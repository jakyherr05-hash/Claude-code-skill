---
name: Resn
url: https://resn.co.nz/
slug: resn
category: studio
tags: [webgl, canvas, immersive, dark, loader, illustration, modernizr, custom-engine]
researched: 2026-11-15
status: partially-inspected
confidence: low
evidence: ../evidence/resn/
---

# Resn

Claim labels: **[M]** measured (capture.json / devtools) · **[O]** observed in screenshots/behaviour · **[I]** inferred (state the basis) · **[?]** unknown.

## At a glance
A creative digital agency with a canvas/WebGL-driven site. The capture saw the loader (white droplet over a thin progress line on near-black) on desktop and a large hand-drawn illustration on mobile. Lesson: a minimal, brand-owned loader and illustrative, playful imagery in place of conventional UI.

## Design characteristics
- Desktop: near-black field `~#161216` [O], tiny white droplet icon above a thin horizontal line with a short bright segment (progress) [O]. Frames 0 and 1 identical [O].
- Mobile: full-bleed cutout illustration of an accordion-playing character on black [O]. Whether this is a hero state or a project piece [?].
- `html` has Modernizr-style classes (`canvas canvastext webgl no-touch ...`) [M].

## Typography
- Loaded: Fort Extralight, Light, Book, Medium [M]. Largest visible text "View All Projects" 16px Fort-Book, line-height 16px [M]; text not visible in the screenshots [O vs M], likely hidden or off-screen at capture time [I]. h1 not found on desktop (0) [M]; mobile h1 28.8px [M].

## Layout & spacing
- [?] Not reached. Body bg black, text black [M] (text colours set per element, likely).

## Navigation
- 0 links, no nav detected [M]. [?]

## Animation
- Loader line and droplet [O]; motion not sampled. Two canvases: 1440x900 static and an 80x80 absolute one [M].

## Scroll
- movedPx 0, docHeight 900 [M]: consistent with an intro lock or loader screen [I]; also possible canvas-driven navigation [I].

## Image & video treatment
- 8 images, 4 svgs, 2 canvases, no video [M]. Heavy WebGL/data payload: ~4.35 MB script, ~2.5 MB XHR [M].

## Responsive (390px observation)
- No overflow [M]; largest font 39px [M]; illustration fills the viewport [O].

## Technical discoveries
- WebGL/canvas feature detection classes on `<html>` [M]. No gsap, Lenis, three, or framework globals detected [M]; engine [?] (custom or bundled, not exposed).

## Performance (single lab run, indicative only)
- DCL 662 ms, load 2954 ms, LCP unavailable [M]; 52 requests, 14 scripts [M]. Only the loader state.

## Useful implementation ideas (original re-implementations, not copies)
- Minimal loader: SVG droplet + 1px line with a GSAP-scrubbed `scaleX` tied to real asset-loading progress.
- Lock scroll during intro with `overflow:hidden` on `html`, release after the load promise resolves.

## Unknowns / not verified
- The post-load site: navigation, scroll model, interactions, stack.
