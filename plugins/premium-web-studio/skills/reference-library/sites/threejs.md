---
name: three.js
url: https://threejs.org/
slug: threejs
category: animation-dev
tags: [threejs, webgl, 3d, showcase-grid, monospace, minimal, documentation-hub, library-homepage]
researched: 2026-11-15
status: inspected
confidence: medium
evidence: ../evidence/threejs/
---

# three.js

Claim labels: **[M]** measured (capture.json / devtools) · **[O]** observed in screenshots/behaviour · **[I]** inferred (state the basis) · **[?]** unknown.

## At a glance
Homepage of the three.js library: a white sidebar of links plus a dense, edge-to-edge grid of community project thumbnails. Lesson: let the work be the interface; navigation is plain monospace text.

## Design characteristics
- White background, #444 text, blue (rgb(4,158,244)) section headings [M]. Left 200px sidebar with grouped link lists: Learn, Tools, Community, Code, Resources, Merch [O]. Right: 6-column grid of square-ish thumbnails with no gaps [O]. Floating pill "submit project" bottom-right [O].
- Version tag "r187" in an outlined badge next to the wordmark [O]; h1 text "three.js r187" [M].

## Typography
- Roboto Mono only (400 and 500) [M]: body 15px/25px, h1 18px/24px 500, h2 15px/26px 500 [M]. Largest visible text is 18px [M].

## Layout & spacing
- Sidebar 200px; grid cells ~126px wide at 1440 [O, from screenshot]. docHeight 900 [M].

## Navigation
- No header/nav landmark detected [M]; sidebar is a list of links [O]. Mobile: header with wordmark and hamburger, 2-column grid [O].

## Animation
- Thumbnails respond to pointer (a hand cursor is visible over one in the capture) [O]. No canvas on the page [M].

## Scroll
- Wheel at the page level moved 0px at every sample [M]: the document is 900px tall, so the grid scrolls inside its own container (desktop-1 shows different thumbnails than desktop-0) [O][I]. Smoothing not measurable [?].

## Image & video treatment
- 264 images (127 JPG, 137 PNG), ~3.9 MB transferred, 192 image requests [M]. Uniform cropped thumbnails; colour variety does the decoration [O].

## Responsive (390px observation)
- No overflow [M]; sidebar becomes hamburger menu [O]; grid halves to 2 columns [O].

## Technical discoveries
- No framework or library globals detected, only 2 scripts including Google Tag Manager [M]. three.js itself is not loaded on this page [M].

## Performance (single lab run, indicative only)
- DCL 864ms, LCP 860ms, CLS 0, 200 requests [M]; image-heavy payload.

## Using this resource in the studio
- npm three@0.187.0 is latest [M, studio-verified], matching "r187" on the homepage [M]. Lenis's own site uses r182 [M], so versions in the wild lag.
- Entry points visible on the page: examples, documentation, tsl guide, devtools, editor [O].

## Useful implementation ideas (original re-implementations, not copies)
- Gapless thumbnail wall as a showcase index with a persistent text sidebar.
- Monospace-only UI to signal "tooling" credibility.

## Unknowns / not verified
- What the inner scroll container is [?]; thumbnail lazy-loading [?]; docs/examples pages not inspected [?].
