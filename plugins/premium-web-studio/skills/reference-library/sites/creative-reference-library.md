---
name: Creative Reference Library (CRL 2026)
url: https://crl-2026.webflow.io/
slug: creative-reference-library
category: other
tags: [awwwards-sotd-2026, webflow, lenis, three-js, giant-letterforms, enter-gate, neue-haas-grotesk, warm-grey, monochrome, library-index, partially-inspected, scroll-unverified]
researched: 2026-11-17
status: partially-inspected
confidence: low
evidence: ../evidence/creative-reference-library/
---

# Creative Reference Library (CRL 2026)

Claim labels: **[M]** measured (capture.json / devtools) · **[O]** observed in screenshots/behaviour · **[I]** inferred (state the basis) · **[?]** unknown.

## At a glance
A curated reference library site (v.01, 2026), on a Webflow staging domain [M URL], Awwwards "Site of the Day - Nov 10, 2026" (verified verbatim on https://www.awwwards.com/sites/creative-reference-library on 2026-11-17). A warm-grey screen where giant black letterforms of "CRL" fragment, scale and rotate under a small white "Enter Library →" button, with a white "CRL® /V.01 (2026)" strip and two dense text columns. **The capture stayed on the entry state**: the document was 900 px tall, `lenis-stopped` was set, and wheel input did not scroll (scrollY 0 in all frames) [M]. The library content behind the button was not seen.

## Design characteristics
- Palette: warm grey rgb(161,160,152), black glyph shapes, white text [M, O].
- The hero letters are cropped so heavily that they read as abstract black polygons; across filmstrip frames they sweep and rotate while the white strip "CRL® /V.01 (2026)" stays centred [O scroll-00, scroll-03]. Time vs wheel vs pointer driver is [?].
- Corners hold micro-copy: top-left "Creative Reference Library®" and a note column, top-right "Index / Library / About", bottom-left a numbered category list, bottom-right small counter [O scroll-03].

## Typography
- Loaded: Neue Haas Grotesk Text Pro 400 (computed weight 500) and Oswald 200-700 via webfont loader [M].
- Display "crl®": 95.1 px / 95.1 px (1.0), tracking -2.85 px (-3%), weight 500 [M]; micro text 14.8 px / 14.8 px, tracking -0.15 px (-1%) [M]. Mobile largest text 40.6 px [M].
- Seven h1 elements in DOM [M], used as typographic layers [I].

## Layout & spacing
- docHeight 900 [M]; 1 section, 1 canvas 1440x900, 6 SVGs, no images, 17 links [M]. Three-column corner layout with a central strip [O].

## Navigation
- Index / Library / About top-right [O]; mobile hamburger flagged [M].

## Animation
- three.js r180 and Lenis (global + `lenis-stopped`) [M]; the giant letters are probably a WebGL mesh text effect on the canvas [I]. Webflow runtime present [M].

## Scroll
- Lenis is installed but stopped at the gate [M], so scroll is locked until "Enter Library" [I]. Wheel samples 0 [M]. Library scroll behaviour [?].

## Image & video treatment
- None (no images, no video) on this view [M]; the visual is a canvas of black shapes [O].

## Responsive (390px observation)
- No overflow [M]; letters stack vertically in the narrow frame [O mobile-0]; tablet portrait shows rotated, scaled letters filling the viewport [O].

## Technical discoveries
- Webflow, Lenis, three r180 [M]; Google WebFont loader [M]. Only 11 requests, 6 KB of script transfer reported [M].

## Performance (single lab run, indicative only)
- DCL/load 716 ms, LCP 6,772 ms, CLS 0.004 [M]; LCP is late because the canvas paints after load [I].

## Useful implementation ideas (original re-implementations, not copies)
- Use oversized, partially cropped letterforms as an abstract hero, with one small functional button as the only UI.
- Keep a thin centred strip of live-feel text (title, version, year) as the stable anchor while shapes move.
- Hold scroll (Lenis `stop()`) until the entry CTA is pressed, and expose real content for crawlers while the gate is up.
- Corner micro-copy at ~15 px with -1% tracking gives an archive/index tone.

## Unknowns / not verified
- The library itself; scroll story; the cursor (`data-cursor` attribute appears in text [M]); animation trigger; transitions [?]. Re-capture with a click on "Enter Library".
