---
name: Behance
url: https://www.behance.net/
slug: behance
category: gallery
tags: [portfolio-platform, gallery, grid, light, adobe, native-scroll, sans]
researched: 2026-11-15
status: partially-inspected
confidence: low
evidence: ../evidence/behance/
---

# Behance

Claim labels: **[M]** measured (capture.json / devtools) · **[O]** observed in screenshots/behaviour · **[I]** inferred (state the basis) · **[?]** unknown.

## At a glance
Adobe's portfolio platform. Document request reported HTTP 403 [M] (automation partly refused), yet the desktop page rendered with content; the 390px capture is blank white. Treat everything as low confidence. Lesson: a centred hero with floating project thumbnails framing a giant tight-tracked headline, then immediately a filter bar and dense project grid.

## Design characteristics
- Light grey-white page `rgb(249,249,249)`, text `rgb(25,25,25)` [M]. Hero headline in black with the middle line "Best Creators" in saturated blue [O]; pill buttons in blue (primary) and pale (secondary) [O].
- Hero is flanked by small rounded-corner thumbnails fading to the edges, partly clipped by the viewport edge [O].
- Below: filter button, search with Projects/People/Assets/Images tabs, a row of dark category chips with imagery, then a 4-column grid of project cards (thumbnail above, title left, likes/views right) [O]. One grid cell is a "Behance Pro" promo card [O].

## Typography
- Loaded: acumin-pro 200-800 (variable range), acumin-pro-wide 200-800, adobe-clean 400/700 [M].
- h1: acumin-pro-wide 80px, weight 600, line-height 68px (0.85), letter-spacing -4px (-0.05em) [M]. h2: 20px/30px, -0.4px (-0.02em) [M]. Nav and body: acumin-pro 12px/15.6px [M].

## Layout & spacing
- h1 box x=405, width 631 on a 1440 viewport (centred, ~44% wide) [M]. Sub-copy box width 550 [M].
- Grid of 4 equal columns with ~16-20px gutters [O, scaled screenshot]. Utility footer bar pinned to the bottom of the viewport [O].
- docHeight 4276 px [M].

## Navigation
- Top bar: logo, Explore (underlined active), Jobs, Resources, Hire; right: Start Free Trial, Sign In, Adobe logo [O]. 27 nav links [M]. Mobile menu [?].

## Animation
- [?] No motion data captured. Thumbnails fade at hero edges [O].

## Scroll
- Wheel 600: scrollY 600 at 16 ms [M] = native scroll, no smoothing. Hero sits in normal flow; filter bar is sticky-looking under header after scroll [O].

## Image & video treatment
- 68 images (png 41, jpg 14, webp 12, jpeg 1) [M]; 122 svgs [M]; no video, canvas [M]. Project cards use uniform crops with slight rounding [O].

## Responsive (390px observation)
- Mobile screenshot is blank white [O]; scrollWidth 980 [M] indicates the layout overflowed or failed to load at 390. Not a valid observation. [?]

## Technical discoveries
- No gsap/Lenis/three detected [M]. File hints show a Vue-style bundle (`GoogleOneTapLogin.vue...js`) [M, scripts.libraryHints]; Vue itself [I]. Google Sign-In client loaded [M].

## Performance (single lab run, indicative only)
- DCL 924 ms, load 3969 ms, LCP 3104 ms, CLS 0.012 [M]; 215 requests, 112 scripts [M]. Transfer sizes understated (cross-origin) [M].

## Useful implementation ideas (original re-implementations, not copies)
- Tight-tracked large heading: `letter-spacing: -0.05em; line-height: .85` on a wide grotesque, with one line coloured via a span.
- Edge-bleed thumbnails: absolutely positioned cards with `mask-image` linear gradient fading to the viewport edge; slight parallax via GSAP ScrollTrigger scrub.
- Sticky filter bar: `position: sticky; top: header-height` with chips in an overflow-x scroller.

## Unknowns / not verified
- Mobile layout, hover states, interactions, real tech stack. Status differs from a pure block: the 403 did not prevent a desktop render, but data is incomplete.
