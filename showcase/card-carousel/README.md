# Card carousel (GSAP), matched to a reference recording

A poster carousel rebuilt from a screen recording by **measuring it frame by frame** (the source is HDR PQ/BT.2020; colours are taken from a tone-mapped still) (template-tracking each poster, then least-squares fitting a motion model; 2.5 px RMS over a 585 px travel). Slides are 1:1.

| Measured from the recording (phone, 390 x 689 CSS px) | Value |
|---|---|
| Front card | 70.4% of viewport width, centred at 51.2% of height, corner radius 8.5% of width, 1 px light rim, no shadow |
| Neighbours | centres at ±0.71 card widths (on the screen edges), scale 0.93, 20% light-grey veil (`side ≈ 0.8·front + 40`), blur ≈ 0.55% of card width (a pre-blurred twin fades in, so only opacity animates), ±4.7° rotateY with outer edges forward |
| Path | `x = 0.71·W·sign(o)·|o|^0.82`, scale `1 − 0.07·|o|^2.3`, the nearer card on top (swap at half-way) |
| Motion | `cubic-bezier(0.766, 0, 0.239, 1)`, 0.731 s per move, a new move every 0.834 s (autoplay) |
| Type & layout | header at 13.8% height, title at 85.5%, pill at 90.1%; text #e8e9ee (pill #d3d2d8); background #1d1e22 → #0d0d0f with a darker vignette at the sides |

- `src/carousel.ts`: one continuous `progress` value drives every card through `computePoses()`. Autoplay runs on an absolute time grid (no drift). Swipe keeps the card under the finger glued to it, then glides (`power3.out`) into the slot. Keys, wheel, tap on a side card, and a pause control (visible on keyboard focus) are included. Reduced motion: no autoplay, short moves.
- Smoothness: the grey veil has its own compositor layer and paint order changes only at the half-way swap, so moving the cards never re-rasters the images (raster work during autoplay: 299 ms → 26 ms per 4 moves; 60 fps with 0 long frames under 4x CPU throttling in headless Chromium).
- `src/stage/cardStage.ts`: optional Three.js renderer (open the page with `#webgl`), following the `webgl-three` skill: one canvas, rounded corners/rim/veil in the shader, render on demand from `gsap.ticker`, context loss and full dispose. Lazy-loaded; off by default because on a software GPU it measured slower than the layered DOM cards.

```bash
npm install
npm run dev                         # local
npm run build && npm run preview    # serves dist/ on :4175
npm test                            # Playwright: fidelity to the recording + swipe/keys/wheel/pause/reduced motion
```
