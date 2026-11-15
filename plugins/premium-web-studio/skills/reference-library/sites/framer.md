---
name: Framer
url: https://www.framer.com/
slug: framer
category: other
tags: [framer, saas, dark, product-marketing, native-scroll, video, variable-font, sans]
researched: 2026-11-15
status: inspected
confidence: medium
evidence: ../evidence/framer/
---

# Framer

Claim labels: **[M]** measured (capture.json / devtools) · **[O]** observed in screenshots/behaviour · **[I]** inferred (state the basis) · **[?]** unknown.

## At a glance
Marketing site of the Framer website builder, built with Framer itself. Black canvas, one large tight-tracked headline, then a glowing product mock/video that sells the product. Lesson: restraint, dark surface, a single neon-blue glow as the only accent.

## Design characteristics
- Pure black body `rgb(0,0,0)` with white text [M]; secondary copy in mid-grey [O]. Blue neon outline glow around the product frame is the sole colour [O].
- Hero: headline, grey subline, two pill buttons (white primary, dark secondary), a "New:" link right-aligned [O]. Product demo in a rounded, bordered panel with a video play overlay and 0:36 duration [O].
- Logo wall (8 white logos, 2 rows of 4) below the demo [O].
- Cookie banner overlays the bottom-left in light card [O].

## Typography
- Loaded: GT Walsheim Medium 500, Inter Variable 400, Inter 400/500/600/700, Input Mono Regular/Bold, JetBrains Mono [M].
- h1: GT Walsheim Medium 54px, weight 500, line-height 54px (1.0), letter-spacing -2.16px (-0.04em) [M]. h2: 44px / 48.4px (1.1), -1.76px (-0.04em) [M]. Body/nav: Inter Variable 14px, -0.01px [M].

## Layout & spacing
- Hero content sits within a centred container with ~80px left margin in the 960-scaled screenshot (~120px at 1440) [O, estimated]; demo panel spans the full container width [O].
- docHeight 12318 px; 6 sections [M].

## Navigation
- `nav` 64px high, relative [M]; logo, Platform/Solutions/Resources dropdowns, Enterprise, Pricing; right: Log in, white Sign up pill [O]. Remains fixed at top after scroll [O]. Mobile: logo, Log in, Sign up, hamburger [O].

## Animation
- Video: 3 muted looping videos, first autoplay [M]. Play-button overlay suggests a click-to-play demo [O]. Any scroll-triggered reveals [?].

## Scroll
- Wheel 600: 600 at 16 ms [M] = native scroll, no smoothing; no Lenis/Locomotive [M].

## Image & video treatment
- 133 images (jpg 80, png 37, webp 10, svg 6) [M]; 207 svgs [M]; videos from framerusercontent.com [M]; no canvas [M]. ~2.4 MB of video transferred [M].

## Responsive (390px observation)
- No overflow [M]; h1 36px [M] (67% of desktop). Headline reflows over 4 lines [O]; "Connect with" integration icons added; product panel shrinks to a chat-input mock [O]; hamburger present though `menuButton` false [O vs M, detector mismatch].

## Technical discoveries
- `framer: true`, generator meta "Framer 78522eb" [M]. GTM/gtag, Google sign-in [M]. Unauthenticated 401 requests logged [M].

## Performance (single lab run, indicative only)
- DCL 462 ms, load 1936 ms, LCP 596 ms, CLS 0.001 [M]; 160 requests, ~885 KB scripts, ~1.5 MB images [M].

## Useful implementation ideas (original re-implementations, not copies)
- Neon-frame glow: layered `box-shadow` + animated `conic-gradient`/blurred pseudo-element on a dark rounded panel.
- Tight display type: `font-size` ~54, `line-height:1`, `letter-spacing:-0.04em` with a medium-weight grotesque.
- Autoplay poster video that swaps to controlled playback on click, `preload="metadata"`.

## Unknowns / not verified
- Scroll-triggered effects, exact grid, hover/micro-interactions.
