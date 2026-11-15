---
name: webgl-three
description: WebGL, Three.js and React Three Fiber for premium websites — deciding whether 3D is justified, raw WebGL2 full-screen shaders vs Three.js vs R3F + Drei, lazy loading behind a static poster, render-on-demand driven by the GSAP ticker, scroll-controlled cameras and uniforms, DPR caps, context loss, off-screen pausing, disposal/memory hygiene and fallbacks. Use for 3D heroes, shader backgrounds, light/colour simulations, image distortion, particles, product viewers, or whenever a page with a canvas is slow, leaks memory or breaks on mobile.
---

# WebGL / Three.js

## Verified baseline (2026-11-15)
`three@0.187.0` (MIT), `@react-three/fiber@9.8.2` (peers: react ≥19 <19.4, three ≥0.156), `@react-three/drei@10.7.9`. These are from `npm view` during reference research. Re-check before installing.

## 1. Decide whether 3D earns its bytes
| Need | Use |
|---|---|
| Static beauty shot | An optimised image (AVIF). No WebGL. |
| Looping ambient motion | Muted video (`ai-visual-pipeline/encode-video.sh`), or CSS |
| Continuous parametric light/colour/noise on flat planes | **Raw WebGL2 fragment shader** (≈ 3–8 KB); see `assets/lightRenderer.ts` |
| A real 3D object, camera moves, lighting, PBR materials | **Three.js** (≈ 130+ KB gz); see `assets/threeStage.ts` |
| A complex scene graph inside React, many interactive objects | **R3F + Drei** (adds React reconciler cost; use `frameloop="demand"`) |

Write the decision and its byte cost into TECHNICAL_ARCHITECTURE.md.

## 2. Integration pattern (both templates follow it)
- **LCP first:** render a static poster `<picture>` behind the canvas. Load the WebGL module with dynamic `import()` after first paint, and fade the canvas in when ready. Users without WebGL keep the poster.
- **One loop:** no private `requestAnimationFrame`. Add `render()` to `gsap.ticker`, and render only when state is dirty. Pause off-screen with IntersectionObserver and on `visibilitychange`.
- **Drive from GSAP:** tween a plain object (`{ reveal: 0 }`, `{ t: 0 }`) and push it to the renderer in `onUpdate`, or read it in the ticker. Scroll control uses a scrubbed tween on that object.
- **DPR cap:** ≤ 1.5 desktop, 1 on mobile. Resize via ResizeObserver.
- **Context loss:** listen for `webglcontextlost` (preventDefault) and `webglcontextrestored`, and rebuild resources.
- **Dispose everything** on unmount: geometries, materials, textures, render targets, `renderer.dispose()`, `renderer.forceContextLoss()`, observers. Verify with `renderer.info.memory` going back to 0 across mount/unmount cycles.
- **Reduced motion:** render one static frame; no camera drift.
- **Accessibility:** the canvas is decorative (`aria-hidden`), or it has `role="img"` plus an `aria-label` describing what it shows. Any information it conveys also exists as text (e.g. The Hour's readout).

## 3. Templates (tested in this repo)
- `assets/lightRenderer.ts`: raw WebGL2 single-quad shader with a typed state API (`set`, `render`, `resize`, `destroy`), kelvin→RGB in GLSL, dirty-flag rendering, context-loss handling. Used live in the demo's hero and The Hour.
- `assets/LightCanvas.tsx`: the React wrapper (lazy import, ticker, IO pause, destroy on unmount, `window.__lightRenderers` leak counter).
- `assets/threeStage.ts`: Three.js stage with a lit PBR object, render-on-demand, `setProgress(p)` for scroll control, IO pause and full `dispose()`. Verified in `demo/lab/three.html` (not shipped in the demo bundle).

## 4. Shader & performance notes
- Budget about 4 ms/frame of GPU on a mid-range phone. Full-screen fragment shaders cost per pixel: lower DPR before simplifying art.
- Prefer analytic falloffs and a few octaves of value noise over textures. Bake grain into a tiny texture or CSS overlay rather than computing it at high frequency.
- Avoid branching on uniforms per-pixel when a `mix()` works.
- Test in headless Chromium with SwiftShader (`--use-angle=swiftshader`) for correctness, and on a real device for performance.
