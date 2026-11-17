---
name: Floema
url: https://floema.com/
slug: floema
category: other
tags: [lenis, three-js, portuguese, outdoor-furniture, pinned-slides, full-bleed-photography, custom-serif, cookie-modal, partially-inspected]
researched: 2026-11-17
status: partially-inspected
confidence: medium
evidence: ../evidence/floema/
---

# Floema

Claim labels: **[M]** measured (capture.json / devtools) · **[O]** observed in screenshots/behaviour · **[I]** inferred (state the basis) · **[?]** unknown.

## At a glance
Portuguese maker of urban/outdoor furniture and signage (title in Portuguese) [M]. A drifting cloud of small product/portrait tiles opens the page, then a pinned, full-bleed photo carousel numbered 01-04 (Urban, Nature, Golf, Details) is advanced by scroll, followed by a statement, a "Urban / Nature" split and a yellow footer with a giant glyph. **A Cookiebot consent modal covers the centre of every frame**, so mid-viewport content is not visible; measurements are unaffected [O, M]. Lesson: a scroll-advanced full-bleed slideshow with numbered counters and persistent catalogue download chips.

## Design characteristics
- Hero: warm off-white page (rgb(242,239,234)) with ~15 small framed images scattered at varied sizes, wordmark top-left, pill nav top-right [O desktop-0]. Text rgb(36,31,33) [M].
- Carousel frames (scroll-01 to scroll-05): full-bleed photography of benches, hotel front, hillside, forest path; large title at lower-left; "Scroll to explore" and product-link chips; a lower-right "Catálogo ..." download card [O].
- Scroll-06: "Est. 2007" text block with a small photo; scroll-09: acid yellow footer with huge black "R" glyph, office address columns and partner logos [O].
- Tags like "Urban", "Golf" appear as small coloured chips on the images [O].

## Typography
- Loaded: Zimula (single custom face) [M]; consent UI uses sans-serif system fonts [M].
- h1: Zimula 57.2 px / 60.1 px (1.05), tracking -2.29 px (-4%) [M]. h2 51 px / 56.1 px, tracking -2.04 px (-4%) [M]. Slide titles 43.75 px; small labels 19.15 px [M, filmstrip].
- Mobile h1 32 px; tablet portrait 41 px, landscape 47 px [M].

## Layout & spacing
- docHeight 14,168 px (~15.7 viewports) [M]; 7 sections, 65 images, 3 canvases (1440x900, 1440x1049, 1440x450), 52 SVGs [M]. Header nav fixed 86 px [M].

## Navigation
- Pill nav: Produtos, Sobre, Sustentabilidade, Jornal, language switch; search icon left. Mobile hamburger [O].

## Animation
- three.js r181 detected [M]; one canvas visible in hero and footer frames [M media counts], likely driving the tile drift or glyph [I]. One `.pin-spacer` in view at frame 0 [M]; 8-9 large fixed/sticky elements in carousel frames [M]. A hydration mismatch console error was logged [M], typical of a server-rendered React framework [I].

## Scroll
- `lenis` class [M]. Wheel 600: 111 at 16 ms, 303 at 100, 480 at 250, 575 at 500, 598 at 900 [M]; 51% at 100 ms, `likelySmoothed` true [M]: softer than most.
- Filmstrip (step 1,474 px of 14,168) covers the page [M]: scroll-01 to 05 each show the next numbered slide (headings change 01..04) [O, M headings], scroll-06 statement, scroll-07 catalogue section, scroll-08 mixed green/yellow section, scroll-09 footer [O]. So roughly 1,470 px of scroll per slide [M, O]: the carousel is pinned and advanced by scroll [I].

## Image & video treatment
- Large landscape photography with a tonal darkening so white text reads [O]; 65 images of unknown extension [M].

## Responsive (390px observation)
- No overflow [M]; consent modal fills the viewport as a sheet [O mobile-0]; h1 32 px [M].

## Technical discoveries
- Lenis class, three r181 global, GTM, Cookiebot [M, O]; Next/Nuxt not detected [M]. Console: hydration mismatch [M].

## Performance (single lab run, indicative only)
- DCL 2,659 ms, load 5,044 ms, LCP 2,032 ms, CLS 0.012 [M]; 134 requests, 43 scripts [M].

## Useful implementation ideas (original re-implementations, not copies)
- Scroll-advanced fullscreen slideshow: each slide = one viewport-plus of scroll, numbered counter, title lower-left, one CTA chip.
- Persistent small "download catalogue" card that changes per slide.
- A scattered tile intro as a hero (small framed images at varied scales) before the full-bleed takeover.
- Reserve a consent-banner-friendly area: a centred modal hides the hero; prefer a bottom bar for first-visit screenshots.

## Unknowns / not verified
- Content under the modal in every frame; carousel interaction/drag; what the canvas renders [?].
