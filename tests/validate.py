#!/usr/bin/env python3
"""
Structural test suite for the premium-web-studio plugin (stdlib only).

  python3 tests/validate.py            # all checks; exit 1 on any FAIL

Checks: skill frontmatter (Agent Skills spec fields only, so skills also upload to claude.ai),
description length cap, agent frontmatter fields/tool names/models (Claude Code subagent docs),
every file path referenced from SKILL.md/agent bodies exists, script syntax, template drift vs the
tested demo, reference-library index freshness, no secrets committed, `claude plugin validate`.
"""
import json, re, subprocess, sys, pathlib, shutil

ROOT = pathlib.Path(__file__).resolve().parent.parent
PLUGIN = ROOT / "plugins" / "premium-web-studio"
SKILLS = PLUGIN / "skills"
AGENTS = PLUGIN / "agents"
results = []

def check(name, ok, detail=""):
    results.append((name, bool(ok), detail))

def frontmatter(path):
    t = path.read_text(encoding="utf-8")
    m = re.match(r"^---\n(.*?)\n---\n(.*)$", t, re.S)
    if not m:
        return None, t
    meta = {}
    for line in m.group(1).splitlines():
        if re.match(r"^[A-Za-z_-]+:", line):
            k, v = line.split(":", 1)
            meta[k.strip()] = v.strip()
    return meta, m.group(2)

# ---- skills
SPEC_FIELDS = {"name", "description", "license", "compatibility", "metadata", "allowed-tools"}
skill_dirs = sorted(p for p in SKILLS.iterdir() if p.is_dir())
check("10 skills present", len(skill_dirs) == 10, f"{len(skill_dirs)}: {[p.name for p in skill_dirs]}")
for d in skill_dirs:
    f = d / "SKILL.md"
    if not f.exists():
        check(f"skill {d.name}: SKILL.md exists", False); continue
    meta, body = frontmatter(f)
    check(f"skill {d.name}: frontmatter parses", meta is not None)
    if meta is None: continue
    check(f"skill {d.name}: name matches folder", meta.get("name") == d.name, meta.get("name"))
    extra = set(meta) - SPEC_FIELDS
    check(f"skill {d.name}: only Agent-Skills-spec fields (claude.ai upload compatible)", not extra, str(extra))
    desc = meta.get("description", "")
    check(f"skill {d.name}: description 80..1536 chars", 80 <= len(desc) <= 1536, str(len(desc)))
    check(f"skill {d.name}: body < 500 lines", len(body.splitlines()) < 500, str(len(body.splitlines())))
    # referenced relative paths exist
    refs = set(re.findall(r"`((?:references|scripts|assets|templates)/[A-Za-z0-9_./*-]+)`", body))
    refs |= set(re.findall(r"\(((?:references|scripts|assets|templates)/[A-Za-z0-9_./-]+)\)", body))
    missing = []
    for r in refs:
        r = r.rstrip("/.")
        if "*" in r:
            if not list(d.glob(r)): missing.append(r)
        elif not (d / r).exists():
            missing.append(r)
    check(f"skill {d.name}: referenced files exist", not missing, str(missing))

# ---- agents
VALID_TOOLS = {"Read", "Write", "Edit", "Glob", "Grep", "Bash", "WebFetch", "WebSearch", "Skill", "Agent", "Task", "NotebookEdit", "TodoWrite"}
VALID_MODELS = {"sonnet", "opus", "haiku", "fable", "inherit"}
EXPECTED = {"creative-director", "reference-researcher", "ui-ux-designer", "typography-spacing", "gsap-animator", "lenis-scroll",
            "webgl-specialist", "ai-visual-producer", "frontend-engineer", "performance-engineer", "qa-engineer", "tech-lead"}
names = set()
for f in sorted(AGENTS.glob("*.md")):
    meta, body = frontmatter(f)
    check(f"agent {f.stem}: frontmatter parses", meta is not None)
    if meta is None: continue
    names.add(meta.get("name"))
    check(f"agent {f.stem}: name has no ':' (reserved)", ":" not in meta.get("name", ":"))
    check(f"agent {f.stem}: description present", len(meta.get("description", "")) > 60)
    tools = {t.strip() for t in meta.get("tools", "").split(",") if t.strip()}
    check(f"agent {f.stem}: tools valid", tools and tools <= VALID_TOOLS, str(tools - VALID_TOOLS))
    check(f"agent {f.stem}: model valid", meta.get("model") in VALID_MODELS, meta.get("model"))
    check(f"agent {f.stem}: no plugin-ignored fields", not ({"hooks", "mcpServers", "permissionMode"} & set(meta)))
    check(f"agent {f.stem}: defines HANDOFF contract", "HANDOFF" in body)
    for s in re.findall(r"Load (?:the )?`([a-z-]+)`", body):
        check(f"agent {f.stem}: referenced skill '{s}' exists", (SKILLS / s).is_dir())
check("all 12 specialist agents present", names == EXPECTED, str(EXPECTED ^ names))
tl = frontmatter(AGENTS / "tech-lead.md")[0]
check("tech-lead is read-mostly (no Write/Edit)", "Write" not in tl["tools"] and "Edit" not in tl["tools"])

# ---- scripts
for s in SKILLS.glob("*/scripts/*"):
    if s.suffix == ".py":
        r = subprocess.run([sys.executable, "-m", "py_compile", str(s)], capture_output=True, text=True)
    elif s.suffix in (".mjs", ".js"):
        r = subprocess.run(["node", "--check", str(s)], capture_output=True, text=True)
    elif s.suffix == ".sh":
        r = subprocess.run(["bash", "-n", str(s)], capture_output=True, text=True)
    else:
        continue
    check(f"script syntax {s.relative_to(SKILLS)}", r.returncode == 0, r.stderr[-200:])

# ---- template drift & library index
r = subprocess.run(["bash", str(ROOT / "scripts" / "sync-templates.sh"), "--check"], capture_output=True, text=True)
check("skill templates identical to tested demo code", r.returncode == 0, (r.stdout + r.stderr).strip()[-300:])
lib = SKILLS / "reference-library"
idx = json.loads((lib / "index.json").read_text())
sites = [p for p in (lib / "sites").glob("*.md") if not p.name.startswith("_")]
check("reference library index up to date", len(idx) == len(sites), f"index {len(idx)} vs sites {len(sites)}")
check("every library entry has evidence folder", all((lib / "evidence" / e["slug"]).is_dir() for e in idx))

# ---- secrets
pat = re.compile(r"(hf_[A-Za-z0-9]{30,}|sk_[A-Za-z0-9]{20,}|sk-ant-[A-Za-z0-9-]{20,}|ghp_[A-Za-z0-9]{30,}|AKIA[0-9A-Z]{16})")
hits = []
for p in ROOT.rglob("*"):
    if p.is_file() and not any(x in p.parts for x in (".git", "node_modules", "dist", "test-results", "playwright-report", "eval-workspaces")) and p.suffix not in (".png", ".jpg", ".avif", ".webp", ".woff2"):
        try:
            if pat.search(p.read_text(errors="ignore")): hits.append(str(p.relative_to(ROOT)))
        except Exception:
            pass
check("no secrets/API keys committed", not hits, str(hits))

# ---- manifests via the official validator
if shutil.which("claude"):
    for target in (PLUGIN, ROOT):
        r = subprocess.run(["claude", "plugin", "validate", str(target)], capture_output=True, text=True)
        check(f"claude plugin validate {target.relative_to(ROOT) if target != ROOT else '. (marketplace)'}", r.returncode == 0 and "Validation passed" in r.stdout, r.stdout.strip()[-200:])
else:
    check("claude plugin validate (CLI unavailable)", True, "NOT TESTED")

fails = [r for r in results if not r[1]]
for n, ok, d in results:
    print(f"{'PASS' if ok else 'FAIL'}  {n}" + (f"  — {d}" if (not ok and d) else ""))
print(f"\n{len(results) - len(fails)}/{len(results)} checks passed")
sys.exit(1 if fails else 0)
