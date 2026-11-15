#!/usr/bin/env python3
"""
providers.py — check and use AI image/video providers WITHOUT inventing access.

  python3 providers.py check
      Probes every provider and prints AVAILABLE / BLOCKED (+ what's needed). Never prints secrets.

  python3 providers.py image --provider <id> --prompt "..." --out hero.png
                       [--width 1344 --height 768 --seed 7 --steps 4 --model <id>]
      Generates one image. Exit code 3 = BLOCKED (credential/quota/hardware), 1 = error.

Providers (see references/providers.md for licences and limits):
  hf-space     Hugging Face ZeroGPU Space via gradio_client (free daily quota; HF_TOKEN raises it)
               default space: black-forest-labs/FLUX.1-schnell  (model licence Apache-2.0)
  hf-inference Hugging Face Inference Providers router (needs HF_TOKEN; billed per request —
               free accounts have no included credits as of 2026-11; PRO gets $2/month)
  comfyui      Local ComfyUI server (COMFYUI_URL, default http://127.0.0.1:8188) + a workflow JSON
               exported in "API format" (--workflow file.json; prompt injected into the first
               CLIPTextEncode node, seed into KSampler/RandomNoise nodes). Needs a local GPU.
  pollinations Pollinations gen API (needs POLLINATIONS_KEY sk_...; usage draws on "pollen" credits).
               The legacy keyless image endpoint still answered on 2026-11-15 but stamps a visible
               watermark even with nologo=true — unusable for deliverables.

Credentials are read from the environment only. Nothing is written to disk except the image.
"""
import argparse, json, os, shutil, sys, time, urllib.request, urllib.error, random

UA = {"User-Agent": "premium-web-studio/1.0"}


def env(name):
    v = os.environ.get(name)
    return v if v and v.strip() else None


def http(url, data=None, headers=None, timeout=30, method=None):
    req = urllib.request.Request(url, data=data, headers={**UA, **(headers or {})}, method=method)
    return urllib.request.urlopen(req, timeout=timeout)


# ---------------------------------------------------------------- checks
def check_hf_space(space="black-forest-labs/FLUX.1-schnell"):
    try:
        with http(f"https://huggingface.co/api/spaces/{space}", timeout=15) as r:
            info = json.load(r)
        stage = (info.get("runtime") or {}).get("stage")
        try:
            import gradio_client  # noqa: F401
            gc = "gradio_client installed"
        except ImportError:
            gc = "gradio_client NOT installed (pip install gradio_client)"
        tok = "HF_TOKEN set (higher quota)" if env("HF_TOKEN") else "no HF_TOKEN (anonymous quota is shared per IP and often 0 on cloud hosts)"
        status = "AVAILABLE?" if stage == "RUNNING" else "BLOCKED"
        return status, f"space stage={stage}; {gc}; {tok}. Quota is only known when a job runs."
    except Exception as e:
        return "BLOCKED", f"cannot reach huggingface.co: {e}"


def check_hf_inference():
    if not env("HF_TOKEN"):
        return "BLOCKED", "needs HF_TOKEN (free account token works only with purchased credits or PRO monthly credits)"
    try:
        with http("https://huggingface.co/api/whoami-v2", headers={"Authorization": f"Bearer {env('HF_TOKEN')}"}, timeout=15) as r:
            who = json.load(r)
        return "AVAILABLE?", f"token valid for account type={who.get('type')}; billing/credits not checkable via API — a request may still fail with 402"
    except urllib.error.HTTPError as e:
        return "BLOCKED", f"token rejected (HTTP {e.code})"
    except Exception as e:
        return "BLOCKED", f"network: {e}"


def check_comfyui():
    url = env("COMFYUI_URL") or "http://127.0.0.1:8188"
    try:
        with http(f"{url}/system_stats", timeout=5) as r:
            s = json.load(r)
        devs = ", ".join(f"{d.get('name')} {round((d.get('vram_total') or 0)/2**30)}GB" for d in s.get("devices", []))
        return "AVAILABLE", f"{url} devices: {devs or 'unknown'}"
    except Exception:
        return "BLOCKED", f"no ComfyUI at {url} (needs a local install + GPU; see references/providers.md)"


def check_pollinations():
    if env("POLLINATIONS_KEY"):
        return "AVAILABLE?", "POLLINATIONS_KEY set; spend depends on pollen balance"
    return "BLOCKED", "needs POLLINATIONS_KEY (sk_...). Keyless legacy endpoint watermarks output — not for deliverables."


CHECKS = {"hf-space": check_hf_space, "hf-inference": check_hf_inference, "comfyui": check_comfyui, "pollinations": check_pollinations}


# ---------------------------------------------------------------- generators
class Blocked(Exception):
    pass


def gen_hf_space(a):
    try:
        from gradio_client import Client
    except ImportError:
        raise Blocked("pip install gradio_client")
    space = a.model or "black-forest-labs/FLUX.1-schnell"
    kw = {"hf_token": env("HF_TOKEN")} if env("HF_TOKEN") else {}
    try:
        c = Client(space, verbose=False, **kw)
    except TypeError:  # older/newer gradio_client signature
        c = Client(space, verbose=False)
    try:
        res = c.predict(prompt=a.prompt, seed=a.seed, randomize_seed=False, width=a.width, height=a.height,
                        num_inference_steps=a.steps, api_name="/infer")
    except Exception as e:
        msg = str(e)
        if "quota" in msg.lower() or "zerogpu" in msg.lower():
            raise Blocked(f"ZeroGPU quota: {msg.splitlines()[0][:200]}")
        raise
    img = res[0]["path"] if isinstance(res[0], dict) else res[0]
    shutil.copy(img, a.out)


def gen_hf_inference(a):
    tok = env("HF_TOKEN")
    if not tok:
        raise Blocked("HF_TOKEN not set")
    model = a.model or "black-forest-labs/FLUX.1-schnell"
    body = json.dumps({"inputs": a.prompt, "parameters": {"width": a.width, "height": a.height, "seed": a.seed,
                                                          "num_inference_steps": a.steps}}).encode()
    try:
        with http(f"https://router.huggingface.co/hf-inference/models/{model}", data=body,
                  headers={"Authorization": f"Bearer {tok}", "Content-Type": "application/json"}, timeout=180) as r:
            open(a.out, "wb").write(r.read())
    except urllib.error.HTTPError as e:
        if e.code in (401, 402, 403, 429):
            raise Blocked(f"HTTP {e.code}: {e.read()[:200]!r}")
        raise


def gen_comfyui(a):
    url = env("COMFYUI_URL") or "http://127.0.0.1:8188"
    if not a.workflow:
        raise Blocked("--workflow <api-format.json> required for comfyui")
    wf = json.load(open(a.workflow))
    for node in wf.values():
        ct, inp = node.get("class_type", ""), node.get("inputs", {})
        if ct == "CLIPTextEncode" and isinstance(inp.get("text"), str) and "negative" not in json.dumps(node.get("_meta", {})).lower():
            inp["text"] = a.prompt
            break
    for node in wf.values():
        inp = node.get("inputs", {})
        for k in ("seed", "noise_seed"):
            if k in inp:
                inp[k] = a.seed
        for k in ("width", "height"):
            if k in inp and isinstance(inp[k], int):
                inp[k] = getattr(a, k)
    try:
        with http(f"{url}/prompt", data=json.dumps({"prompt": wf}).encode(), headers={"Content-Type": "application/json"}) as r:
            pid = json.load(r)["prompt_id"]
    except Exception as e:
        raise Blocked(f"ComfyUI not reachable at {url}: {e}")
    for _ in range(600):
        time.sleep(1)
        with http(f"{url}/history/{pid}") as r:
            h = json.load(r)
        if pid in h:
            for out in h[pid]["outputs"].values():
                for im in out.get("images", []):
                    q = urllib.parse.urlencode({"filename": im["filename"], "subfolder": im["subfolder"], "type": im["type"]})
                    with http(f"{url}/view?{q}") as r2:
                        open(a.out, "wb").write(r2.read())
                    return
    raise RuntimeError("ComfyUI job timed out")


def gen_pollinations(a):
    key = env("POLLINATIONS_KEY")
    if not key:
        raise Blocked("POLLINATIONS_KEY not set")
    q = urllib.parse.urlencode({"width": a.width, "height": a.height, "seed": a.seed, "model": a.model or "flux", "nologo": "true"})
    with http(f"https://gen.pollinations.ai/image/{urllib.parse.quote(a.prompt)}?{q}", headers={"Authorization": f"Bearer {key}"}, timeout=180) as r:
        open(a.out, "wb").write(r.read())


GENS = {"hf-space": gen_hf_space, "hf-inference": gen_hf_inference, "comfyui": gen_comfyui, "pollinations": gen_pollinations}


def main():
    import urllib.parse  # noqa: F401  (used by generators)
    p = argparse.ArgumentParser()
    sub = p.add_subparsers(dest="cmd", required=True)
    sub.add_parser("check")
    g = sub.add_parser("image")
    g.add_argument("--provider", choices=GENS, required=True)
    g.add_argument("--prompt", required=True)
    g.add_argument("--out", required=True)
    g.add_argument("--width", type=int, default=1344)
    g.add_argument("--height", type=int, default=768)
    g.add_argument("--seed", type=int, default=random.randint(0, 2**31 - 1))
    g.add_argument("--steps", type=int, default=4)
    g.add_argument("--model")
    g.add_argument("--workflow")
    a = p.parse_args()
    if a.cmd == "check":
        for name, fn in CHECKS.items():
            st, why = fn()
            print(f"{name:13} {st:11} {why}")
        return 0
    try:
        GENS[a.provider](a)
    except Blocked as e:
        print(f"BLOCKED [{a.provider}]: {e}", file=sys.stderr)
        return 3
    meta = {"provider": a.provider, "model": a.model, "prompt": a.prompt, "seed": a.seed, "width": a.width, "height": a.height,
            "steps": a.steps, "created": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime())}
    json.dump(meta, open(a.out + ".json", "w"), indent=2)
    print(f"OK → {a.out} (+ {a.out}.json with prompt/seed for the asset manifest)")
    return 0


if __name__ == "__main__":
    import urllib.parse
    sys.exit(main())
