---
name: Active Theory
url: https://activetheory.net/
slug: activetheory
category: studio
tags: [webgl, three-js, immersive, dark, particles, canvas, custom-engine, unsupported-fallback]
researched: 2026-11-15
status: partially-inspected
confidence: low
evidence: ../evidence/activetheory/
---

# Active Theory

Claim labels: **[M]** measured (capture.json / devtools) · **[O]** observed in screenshots/behaviour · **[I]** inferred (state the basis) · **[?]** unknown.

## At a glance
An immersive-experience studio. The capture reached only a "Your browser is not supported" state: the headless browser failed their capability check [I, title "Not Supported" + overlay text]. What is visible is the loading/fallback scene: a dark 3D-rendered world with particles and a glossy ring logo. Lesson: even the failure/loader screen is art-directed; graceful-fallback copy can match the brand.

## Design characteristics
- Deep navy-black scene with blue and gold particle clusters, a metallic ring holding the "a" mark, a jellyfish/mushroom shape at left, tail ribbons below [O].
- Single centred text line "YOUR BROWSER IS NOT SUPPORTED" in small monospaced-looking uppercase, wide tracking [O]. Rendered over a scene image, which means either a CSS background or canvas [?].

## Typography
- Loaded: `nbarchitekt` 400 [M]. h1 "Your browser is not supported": nbarchitekt 18px, weight 700, line-height normal [M], with Helvetica/Arial fallback [M]. Visible uppercase styling not matched by captured `textTransform: none` [O vs M] so the shown text may be a different element [I].

## Layout & spacing
- Centred stack, no grid observable [O]. docHeight 900 [M].

## Navigation
- None [M] (no nav, no links).

## Animation
- Static in both desktop frames (identical) [O]. Particles/scene motion [?].

## Scroll
- movedPx 0 [M]; consistent with a locked, canvas-driven or unsupported-state page [I]; not tested further.

## Image & video treatment
- 0 images, videos, canvases in DOM [M]; the scene imagery is therefore CSS/background or drawn outside the counted DOM [I].

## Responsive (390px observation)
- Same scene scaled, text larger relative to width, no overflow [O, M]. h1 18px [M].

## Technical discoveries
- No library globals detected [M]; gtag script present [M]. Main experience code was not loaded [I] (3 scripts, 5 requests).

## Performance (single lab run, indicative only)
- Load 469 ms, 5 requests [M]; measures the fallback only.

## Useful implementation ideas (original re-implementations, not copies)
- Fallback state: detect WebGL via `canvas.getContext('webgl2')` and show a branded static poster + short message instead of a blank page.
- Particle backdrop for loaders with Three.js `Points` + additive blending, or a pre-rendered WebP poster for low-power devices.

## Unknowns / not verified
- The real site experience, tech stack, navigation, scroll model. Needs a GPU-enabled capture.
