#!/usr/bin/env bash
# skill-scripts.sh — EXECUTES every script bundled in the plugin's skills against real inputs in a temp dir and
# asserts on the output. Files existing is not evidence; this is the functional regression test for the tooling.
#   bash tests/skill-scripts.sh            (needs node, python3; playwright/sharp/ffmpeg steps SKIP if absent)
set -uo pipefail
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
S="$ROOT/plugins/premium-web-studio/skills"
T="$(mktemp -d)"; trap 'rm -rf "$T"' EXIT
pass=0; fail=0; skip=0
ok()   { echo "PASS  $1"; pass=$((pass+1)); }
bad()  { echo "FAIL  $1 — $2"; fail=$((fail+1)); }
skp()  { echo "SKIP  $1 — $2"; skip=$((skip+1)); }
has()  { command -v "$1" >/dev/null 2>&1; }
NODE_PATH="${NODE_PATH:+$NODE_PATH:}$(npm root -g 2>/dev/null):$ROOT/demo/node_modules"; export NODE_PATH
# NOTE: never `cmd | grep -q` under pipefail — grep exits early, cmd gets SIGPIPE, the pipeline "fails".
ENCODERS="$(ffmpeg -hide_banner -encoders 2>/dev/null || true)"

# web-studio: init-project creates 13 docs, substitutes name/date, never overwrites
out=$(bash "$S/web-studio/scripts/init-project.sh" "$T/p" "Acme & Co/Lab" 2>&1)
n=$(ls "$T/p/studio"/*.md 2>/dev/null | wc -l)
grep -q "Acme & Co/Lab" "$T/p/studio/PROJECT_BRIEF.md" && [[ $n == 13 ]] && ok "init-project: 13 docs, name substituted" || bad "init-project" "$out"
echo "KEEP" > "$T/p/studio/DECISIONS.md"
bash "$S/web-studio/scripts/init-project.sh" "$T/p" "Other" >/dev/null 2>&1
[[ "$(cat "$T/p/studio/DECISIONS.md")" == "KEEP" ]] && ok "init-project: never overwrites existing docs" || bad "init-project overwrite" "DECISIONS.md was replaced"
grep -rq "{{" "$T/p/studio" && bad "init-project placeholders" "unreplaced {{…}}" || ok "init-project: no unreplaced placeholders"

# design-intelligence: contrast ratios against known WCAG values
out=$(node "$S/design-intelligence/scripts/contrast.mjs" "#000000" "#ffffff" "#777777")
echo "$out" | grep -q "21.00:1  AAA" && echo "$out" | grep -q "#ffffff.*#777777.*4.48:1  AA-large-only" \
  && ok "contrast.mjs: black/white 21:1, white/#777 4.48:1" || bad "contrast.mjs" "$out"
node "$S/design-intelligence/scripts/contrast.mjs" "#fff" >/dev/null 2>&1 && bad "contrast.mjs usage" "accepted 1 colour" || ok "contrast.mjs: rejects a single colour"

# typography-system: clamp math is exact at both ends
out=$(node "$S/typography-system/scripts/type-scale.mjs" --json --min-base 16 --max-base 20 --steps 0,0)
python3 - "$out" <<'PY' && ok "type-scale.mjs: clamp() hits min at 360 and max at 1440" || bad "type-scale.mjs" "clamp endpoints wrong"
import json,re,sys
d=json.loads(sys.argv[1]); c=d['type'][0]['clamp']
lo,ic,sl,hi=map(float,re.findall(r'([\d.]+)', c)[:4])
at=lambda vw:(ic*16)+sl*vw/100
assert abs(lo*16-16)<0.01 and abs(hi*16-20)<0.01, c
assert abs(at(360)-16)<0.05 and abs(at(1440)-20)<0.05, (at(360),at(1440))
PY

# reference-library: index matches entries; search ranks; stale works
lib="$S/reference-library"
out=$(python3 "$lib/scripts/library.py" search lenis --limit 3)
echo "$out" | head -1 | grep -q "lenis" && ok "library.py search: 'lenis' ranks the Lenis entry first" || bad "library.py search" "$out"
python3 "$lib/scripts/library.py" search --tag webgl --min-confidence high | grep -q "basement-studio" && ok "library.py: tag + confidence filters" || bad "library.py filters" "basement-studio missing"
python3 "$lib/scripts/library.py" stale --days 0 | grep -q "researched" && ok "library.py stale: flags entries older than N days" || bad "library.py stale" "no output"
cp -r "$lib" "$T/lib" && python3 "$T/lib/scripts/library.py" build | grep -q "indexed 25" && cmp -s "$T/lib/index.json" "$lib/index.json" \
  && ok "library.py build: deterministic and committed index is current" || bad "library.py build" "index differs from committed"

# reference-study: capture a local page (no network dependency)
if node -e "require('playwright')" 2>/dev/null; then
  cat > "$T/ref.html" <<'H'
<!doctype html><html lang="en"><head><style>h1{font:700 64px/1 serif;letter-spacing:-2px}body{height:3000px}</style></head>
<body><header><nav><a href="#a">A</a></nav></header><main><h1>Reference title</h1><p>Body</p></main></body></html>
H
  PORT=$(python3 -c 'import socket;s=socket.socket();s.bind(("",0));print(s.getsockname()[1])')
  python3 -m http.server "$PORT" --directory "$T" >/dev/null 2>&1 & echo $! > "$T/srv.pid"; sleep 1
  node "$S/reference-study/scripts/capture-reference.mjs" "http://localhost:$PORT/ref.html" "$T/ev" --id local >"$T/cap.log" 2>&1 || cat "$T/cap.log"
  kill "$(cat "$T/srv.pid")" 2>/dev/null
  python3 - "$T/ev/local/capture.json" <<'PY' && ok "capture-reference.mjs: measured h1 64px/-2px, native scroll, screenshots" || bad "capture-reference.mjs" "see capture.json"
import json,sys,os
d=json.load(open(sys.argv[1]))
assert 'page' in d, d
h=d['page']['h1']
assert d['status']=='inspected' and h['fontSize']=='64px' and h['letterSpacing']=='-2px', h
assert d['scroll']['likelySmoothed'] is False and d['scroll']['movedPx']>0, d['scroll']
for f in ('desktop-0.jpg','desktop-1.jpg','mobile-0.jpg'): assert os.path.getsize(os.path.join(os.path.dirname(sys.argv[1]),f))>1000
PY
else skp "capture-reference.mjs" "playwright not installed"; fi

# ai-visual-pipeline: provider check never crashes; generation without credentials exits 3 (BLOCKED), not 0
out=$(env -u HF_TOKEN -u POLLINATIONS_KEY python3 "$S/ai-visual-pipeline/scripts/providers.py" check 2>&1); rc=$?
[[ $rc == 0 ]] && echo "$out" | grep -q "pollinations  BLOCKED" && ok "providers.py check: runs, reports BLOCKED without keys" || bad "providers.py check" "$out"
env -u POLLINATIONS_KEY python3 "$S/ai-visual-pipeline/scripts/providers.py" image --provider pollinations --prompt x --out "$T/x.png" >/dev/null 2>&1
[[ $? == 3 ]] && [[ ! -f "$T/x.png" ]] && ok "providers.py image: missing credential → exit 3 BLOCKED, no file" || bad "providers.py BLOCKED" "wrong exit or file written"
if node -e "require('sharp')" 2>/dev/null; then
  ffmpeg -loglevel error -f lavfi -i "gradients=size=1200x800:duration=1" -frames:v 1 "$T/in.png" -y
  node "$S/ai-visual-pipeline/scripts/optimize-images.mjs" "$T/in.png" "$T/out" --widths 480,960,2000 --no-jpg >/dev/null 2>&1
  python3 - "$T/out" <<'PY' && ok "optimize-images.mjs: AVIF+WebP at 480/960, never upscales past 1200, manifest" || bad "optimize-images.mjs" "outputs wrong"
import json,os,sys
o=sys.argv[1]; f=set(os.listdir(o)); m=json.load(open(os.path.join(o,'images.manifest.json')))[0]
need={'in-480.avif','in-480.webp','in-960.avif','in-960.webp','in-1200.avif','in-1200.webp'}
assert need<=f, f; assert 'in-2000.avif' not in f; assert max(x['width'] for x in m['outputs'])==1200
assert open(os.path.join(o,'in-480.avif'),'rb').read(12)[4:12] in (b'ftypavif',b'ftypavis')
PY
else skp "optimize-images.mjs" "sharp not installed"; fi
if has ffmpeg; then
  ffmpeg -loglevel error -f lavfi -i testsrc2=size=640x360:rate=24 -t 2 -pix_fmt yuv420p "$T/clip.mp4" -y
  bash "$S/ai-visual-pipeline/scripts/encode-video.sh" "$T/clip.mp4" "$T/v" 640 >"$T/v.log" 2>&1
  codecs=$(for f in "$T/v/clip.mp4" "$T/v/clip.webm"; do ffprobe -v error -select_streams v:0 -show_entries stream=codec_name -of csv=p=0 "$f"; done | tr '\n' ' ')
  if [[ "$codecs" == "h264 vp9 " ]] && [[ -f "$T/v/clip-poster.webp" ]]; then
    if grep -q libsvtav1 <<<"$ENCODERS"; then
      [[ "$(ffprobe -v error -select_streams v:0 -show_entries stream=codec_name -of csv=p=0 "$T/v/clip.av1.mp4" 2>/dev/null)" == av1 ]] \
        && ok "encode-video.sh: h264 + vp9 + av1 + poster (regression: pipefail AV1 detection)" || bad "encode-video.sh AV1" "av1 missing although libsvtav1 exists"
    else ok "encode-video.sh: h264 + vp9 + poster (no AV1 encoder here)"; fi
  else bad "encode-video.sh" "$codecs $(cat "$T/v.log")"; fi
else skp "encode-video.sh" "ffmpeg not installed"; fi

# web-qa: scroll probe + lighthouse runner are syntactically valid and print usage
node --check "$S/web-qa/scripts/scroll-probe.mjs" && ok "scroll-probe.mjs parses" || bad "scroll-probe.mjs" "syntax"
lh_out="$(bash "$S/web-qa/scripts/lighthouse.sh" 2>&1)"; lh_rc=$?
bash -n "$S/web-qa/scripts/lighthouse.sh" && [[ $lh_rc != 0 ]] && grep -q "usage" <<<"$lh_out" && ok "lighthouse.sh: parses, prints usage without args" || bad "lighthouse.sh" "no usage"

# repo tooling: installer (temp HOME), template drift, structural validator
H="$T/home"; mkdir -p "$H/.claude/agents"; echo "mine" > "$H/.claude/agents/qa-engineer.md"
HOME="$H" bash "$ROOT/install.sh" >/dev/null 2>&1
[[ "$(cat "$H/.claude/agents/qa-engineer.md")" == "mine" ]] && [[ -f "$H/.claude/skills/web-studio/SKILL.md" ]] && [[ $(ls "$H/.claude/agents" | wc -l) == 12 ]] \
  && ok "install.sh: installs 10 skills/12 agents, keeps user's existing agent" || bad "install.sh" "overwrote or missing"
HOME="$H" bash "$ROOT/install.sh" --uninstall >/dev/null 2>&1
[[ "$(cat "$H/.claude/agents/qa-engineer.md")" == "mine" ]] && [[ ! -e "$H/.claude/skills/web-studio" ]] && ok "install.sh --uninstall: removes only what it installed" || bad "install.sh --uninstall" "wrong removal"
bash "$ROOT/scripts/sync-templates.sh" --check >/dev/null && ok "templates identical to tested demo code" || bad "template drift" "run sync-templates.sh"
python3 "$ROOT/tests/validate.py" >/dev/null && ok "validate.py structural checks" || bad "validate.py" "see output"

echo; echo "skill scripts: $pass passed, $fail failed, $skip skipped"
[[ $fail == 0 ]]
