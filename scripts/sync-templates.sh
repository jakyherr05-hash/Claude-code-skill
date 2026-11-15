#!/usr/bin/env bash
# sync-templates.sh [--check]
# The skills' assets/ ARE the tested demo implementation. Default: copy demo files into the skills.
# --check: verify they're identical (used by tests/validate.py) so templates never drift from the code
# the Playwright suite exercised.
set -euo pipefail
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
D="$ROOT/demo"; S="$ROOT/plugins/premium-web-studio/skills"
MAP=(
  "src/motion/registry.ts:gsap-motion/assets/registry.ts"
  "src/motion/tokens.ts:gsap-motion/assets/tokens.ts"
  "src/motion/lit.ts:gsap-motion/assets/lit.ts"
  "src/motion/useReducedMotion.ts:gsap-motion/assets/useReducedMotion.ts"
  "src/sections/Method.tsx:gsap-motion/assets/examples/PinnedSequence.Method.tsx"
  "src/sections/MethodDrawing.tsx:gsap-motion/assets/examples/PinnedSequence.MethodDrawing.tsx"
  "src/sections/ScheduleIndex.tsx:gsap-motion/assets/examples/FlipFilter.ScheduleIndex.tsx"
  "src/sections/TheHour.tsx:gsap-motion/assets/examples/QuickToInteractive.TheHour.tsx"
  "src/sections/Rooms.tsx:gsap-motion/assets/examples/OnceReveal.Rooms.tsx"
  "src/sections/Hero.tsx:gsap-motion/assets/examples/HeroSequence.Hero.tsx"
  "src/router/Router.tsx:gsap-motion/assets/examples/PageTransition.Router.tsx"
  "studio/ANIMATION_SPECIFICATION.md:gsap-motion/assets/examples/ANIMATION_SPECIFICATION.example.md"
  "src/scroll/SmoothScroll.tsx:lenis-scroll/assets/SmoothScroll.tsx"
  "src/webgl/lightRenderer.ts:webgl-three/assets/lightRenderer.ts"
  "src/components/LightCanvas.tsx:webgl-three/assets/LightCanvas.tsx"
  "lab/threeStage.ts:webgl-three/assets/threeStage.ts"
  "lab/three-lab.ts:webgl-three/assets/three-lab.ts"
  "playwright.config.ts:web-qa/assets/playwright.config.ts"
  "tests/helpers.ts:web-qa/assets/tests/helpers.ts"
  "tests/functional.spec.ts:web-qa/assets/tests/functional.spec.ts"
  "tests/scroll-motion.spec.ts:web-qa/assets/tests/scroll-motion.spec.ts"
  "tests/responsive-a11y.spec.ts:web-qa/assets/tests/responsive-a11y.spec.ts"
  "tests/visual.spec.ts:web-qa/assets/tests/visual.spec.ts"
)
MODE="${1:-sync}"
drift=0
for m in "${MAP[@]}"; do
  src="$D/${m%%:*}"; dst="$S/${m##*:}"
  if [[ "$MODE" == "--check" ]]; then
    cmp -s "$src" "$dst" || { echo "DRIFT: skills/${m##*:} differs from demo/${m%%:*}"; drift=1; }
  else
    mkdir -p "$(dirname "$dst")"; cp "$src" "$dst"
  fi
done
if [[ "$MODE" == "--check" ]]; then
  [[ $drift == 0 ]] && echo "templates in sync (${#MAP[@]} files)"
  exit $drift
fi
echo "synced ${#MAP[@]} template files from demo/ into skills/*/assets"
