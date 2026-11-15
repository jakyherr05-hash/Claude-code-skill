---
name: ai-visual-pipeline
description: Production pipeline for website imagery and video — creative-brief → shot list, prompt systems for visual consistency, AI image generation (FLUX.1-schnell, Qwen-Image, Z-Image, SDXL via Hugging Face Spaces/Inference, ComfyUI, Pollinations) and AI video (Wan 2.x, LTX, Mochi, CogVideoX, HunyuanVideo) with verified licences and free-tier limits, procedural fallbacks, asset review, AVIF/WebP responsive sets, H.264/VP9/AV1 encoding, and the asset manifest with licensing. Use whenever a site needs hero images, backgrounds, product shots, textures, video loops or cinematic footage, or when asked which AI image/video tools are free or commercially usable.
---

# AI visual pipeline

## 0. Honesty rules
- Check what is **actually available** before promising generation: `python3 scripts/providers.py check`.
- Never sign up for a paid plan, spend credits, or invent keys. If a credential unlocks a free path (e.g. a free Hugging Face token raises ZeroGPU quota), ask the user for it and say exactly what it enables.
- Record the licence of the **model weights and the service terms** for every generated asset. Non-commercial models (FLUX.1-dev, FLUX.2-dev) are never used for client deliverables.
- If nothing is available, produce **procedural** or placeholder assets with the right aspect ratios and art direction so the build isn't blocked, and mark generation BLOCKED.

## 1. Workflow
1. **Brief → shot list** (`references/prompting.md` §1): ID, purpose, aspect ratios per breakpoint, focal point, mood, what must be legible over it.
2. **Prompt system** (§2): one shared *style block* (light, lens, grade, texture, palette, composition rules) + per-shot *subject block* + negatives. Fix seeds; log every prompt+seed.
3. **Reference images** (§3): use image-to-image / IP-Adapter / ControlNet (ComfyUI) only with images you have rights to; never a competitor's or artist's work.
4. **Generate:** `python3 scripts/providers.py image --provider <id> --prompt "..." --seed 7 --out raw/hero.png` (writes `hero.png.json` with the prompt metadata). Video: see `references/providers.md` §Video (local/ComfyUI; hosted Spaces where available).
5. **Review** every output by opening it: anatomy/text artefacts, consistency with siblings (light direction, grade), brand fit, legibility zones. Reject and regenerate with notes.
6. **Optimise:** `node scripts/optimize-images.mjs raw/ public/media --widths 720,1280,1920 --no-jpg` (AVIF + WebP + manifest + `<picture>` snippet; needs `sharp`). Video: `bash scripts/encode-video.sh in.mov public/media 1920` (H.264 MP4 + VP9 WebM + optional AV1 + poster).
7. **Manifest:** a row per asset in `studio/ASSET_MANIFEST.md`: source, model+version, prompt/seed, licence + commercial status **with the source of that claim**, sizes, weights, alt text.

## 2. Provider registry
`references/providers.md` holds the verified registry (checked 2026-11-15): licences pulled from the Hugging Face model API, free-tier rules from official pricing/docs pages, and live probes from this environment. Summary:

| Option | Class | Commercial use | Needs |
|---|---|---|---|
| FLUX.1-schnell (weights) | Open-source (Apache-2.0) | Yes | GPU ≥ 12–16 GB, or a hosted Space |
| Qwen-Image, Z-Image-Turbo (weights) | Open-source (Apache-2.0) | Yes | GPU |
| SDXL base 1.0 | Open-source (OpenRAIL++) | Yes, with use restrictions | GPU ≥ 8 GB |
| SD 3.5 Large | Community licence | Free below the licence's revenue threshold; read it | GPU |
| FLUX.1-dev / FLUX.2-dev | **Non-commercial licence** | **No** | — |
| HF ZeroGPU Spaces | Free tier with restrictions | Per model licence | Daily GPU quota; anonymous quota is per IP (was **0** from this cloud host); a free account token raises it |
| HF Inference Providers | Pay-as-you-go | Per model | Free accounts get **no** included credits; PRO gets $2/month |
| ComfyUI (local) | Open-source tool (GPL-3.0) | Per model | Local NVIDIA GPU (or Apple Silicon) |
| Pollinations gen API | Free tier with restrictions / credits | Per their terms | `sk_` key; keyless legacy endpoint watermarks |
| Wan 2.1/2.2, Mochi-1 (video weights) | Open-source (Apache-2.0) | Yes | GPU: Wan 1.3B ≈ 8 GB+, 14B much more |
| LTX-Video / LTX-2 | Open weights, custom licence | Read licence (revenue terms) | GPU |
| HunyuanVideo | Tencent community licence | Territory exclusions; read licence | Large GPU |
| CogVideoX-5b | Custom licence | Read licence | GPU |

## 3. Formats
- Photos/renders: AVIF (q≈50) + WebP (q≈72); JPEG only if a legacy target needs it. Widths matched to layout (`sizes` attribute), never upscaled.
- Graphics with flat colour / transparency: SVG first, then PNG/WebP lossless.
- Video: muted autoplay loops ≤ 6–10 s; H.264 baseline MP4 + VP9 WebM, AV1 when encoder available; always a poster; pause off-screen and under reduced motion; ≤ 2–4 MB for hero loops on mobile.
