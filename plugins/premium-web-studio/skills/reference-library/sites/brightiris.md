---
name: BRIGHTIRIS (cinematic yard-ops concept)
url: https://brightiris-cinematic.netlify.app/
slug: brightiris
category: other
tags: [gsap, scrolltrigger, lenis, splittext, pinned-storytelling, colour-block-chapters, display-grotesk, mono-labels, serif-accent, canvas, dark-to-colour, saas-product]
researched: 2026-11-17
status: inspected
confidence: medium
evidence: ../evidence/brightiris/
---

# BRIGHTIRIS (cinematic yard-ops concept)

Claim labels: **[M]** measured (capture.json / devtools) · **[O]** observed in screenshots/behaviour · **[I]** inferred (state the basis) · **[?]** unknown.

## At a glance
A long (29,427 px, ~33 viewports [M]) one-product storytelling page for an "AI-native yard operations" product, hosted on a Netlify preview URL with a "Powered by Netlify" badge visible [O, M title]. It opens on an outlined display wordmark over a dark wireframe scene, then moves through full-bleed colour-block chapters (dark teal, orange, grey, yellow) each with one giant statement. Lesson: a single strong chapter system (numbered mono label + one huge headline + one accent italic word, background colour changing per chapter) carries a whole product story without screenshots.

## Design characteristics
- Hero: outlined "BRIGHT / IRIS" letterforms filled with a moving dark isometric/wireframe scene, small tagline and "SCROLL TO EXPLORE" bottom centre [O desktop-0]. Palette: very dark teal (body rgb(8,20,26)) with light text rgb(233,238,240) [M]; orange pill CTA "Request demo" and a "Menu" pill in a fixed header [O].
- Chapters change the whole background: teal-on-black (scroll-01), orange with struck-through "Spreadsheets / Paper logs" over a grey band with a "SEE · UNDERSTAND · OPTIMIZE" marquee (scroll-03), saturated yellow with a giant numeral and a dot grid (scroll-06), grainy orange (scroll-08) [O].
- Accent words are set in an italic serif inside otherwise heavy grotesk headlines ("dark.", "signal.", "picture.", "site.") [O]; Instrument Serif italic 400 is among loaded faces [M], so that is the likely source [I].
- A chapter index ("00 Opening", "01 Identity", "02 The blind spot…") is present in body text and echoed as a small mono counter in the header [M text, O].

## Typography
- Loaded: Clash Display 200-700, Satoshi 400 and 500, JetBrains Mono 400, Instrument Serif italic 400 [M].
- h2 "BRIGHTIRIS": Clash Display 600, 165.6 px / line-height 149 px (0.9), letter-spacing -7.45 px (about -4.5%) [M]. Largest visible statement: 137.6 px / 123.8 px (0.9), tracking -2.75 px (-2%) [M]. Other chapter headlines measured at 106.6, 92.2, 72, 62.4, 57.6 px [M, filmstrip headings].
- Mono labels: JetBrains Mono 11.52 px, uppercase, tracking 1.15 px (10%), colour rgb(159,179,185) [M].
- Body: Satoshi 16 px / 24.8 px (1.55) [M]. h1 is a visually small 32 px / 33.3 px, tracking -1.12 px, so the SEO h1 is separate from the visual wordmark [M].

## Layout & spacing
- Fixed header 89 px high with logo left, mono chapter pill centre, CTA + Menu right [M height, O].
- Statements sit left-aligned in large type with small mono captions in the lower-left and lower-right corners (scroll-04, scroll-07, scroll-08 thumbnails) [O].
- 12 sections, 24 inline SVGs, 5 canvases (two 1425x1170, three 1425x900, absolute) [M]; no `img` elements and no video [M]. Imagery is therefore drawn in canvas/SVG [I].

## Navigation
- Fixed header with "Request demo" and a "Menu" button; a skip-to-content link is present [M]. Mobile keeps the same two controls [O mobile-0].

## Animation
- GSAP 3.15.0 on `window.gsap` with ScrollTrigger global [M]. Script URLs show Flip, Observer, SplitText, CustomEase, DrawSVG, ScrambleText and ScrollTo plugins loaded from jsDelivr, plus own `gsapSetup.js` and `lenisSetup.js` [M, scripts.libraryHints]. Which plugins actually drive which effect is [?].
- Filmstrip shows per-chapter pinned layers (1-3 large fixed/sticky elements per frame) with no `.pin-spacer` in view [M]; pinning is therefore done another way (CSS sticky or a custom wrapper) [I].
- Words in headlines are doubled in the DOM text ("The yard,The yard,seen.seen.") [M], the typical footprint of split-line masking (a duplicate line for reveal) [I].

## Scroll
- `lenis` class on html and Lenis 1.3.26 script [M]. Wheel 600 px: 213 at 16 ms, 445 at 100, 563 at 250, 598 at 500, 600 at 900 [M]; 74% done at 100 ms, `likelySmoothed` true [M] (a quick ease-out, consistent with a high-lerp Lenis [I]).
- Filmstrip (step ~3,170 px, document 29,427) reached scrollY 28,522 at frame 9 [M], so frames 00-09 span the whole story [M, O]: 00 hero, 01 "one living system", 02 blind-spot statement, 03 marquee/colour break, 04 mono label + diagram, 05 live-picture cards, 06 yellow scale chapter, 07 network map, 08 orange close, 09 FAQ + giant wordmark footer [O].

## Image & video treatment
- No raster images or video [M]; wireframe scenes, dot-grid maps and diagrams are drawn procedurally [O, I]. Grain overlay on orange chapter [O scroll-08].

## Responsive (390px observation)
- No horizontal overflow [M]; wordmark restacks to fill width, largest font 192 px [M]; Request demo is dropped from the mobile header, only Menu remains [O]. Tablet portrait/landscape: no overflow, h1 32 px [M]; the portrait hero scales the wordmark to full width [O].

## Technical discoveries
- gsap 3.15.0, ScrollTrigger, Lenis (class + global) detected [M]; no Three.js global [M]; hosting Netlify [O, M URL].

## Performance (single lab run, indicative only)
- DCL 2,606 ms, load 2,630 ms, LCP 2,772 ms, CLS 0.001 [M]; 52 requests, scripts 183 KB, CSS 80 KB listed with transfer sizes [M] (cross-origin sizes can read 0).

## Useful implementation ideas (original re-implementations, not copies)
- Chapter system: numbered mono label + one oversized statement + one accent word in a contrasting italic serif; change the entire viewport colour per chapter to reset attention (scroll-01 to scroll-08).
- Alternate a dark "problem" register with saturated colour "solution" chapters; the contrast is the narrative device.
- Tight display tracking (-2% to -4.5%) and 0.9 line-height at 100+ px; pair with small, widely tracked (10%) mono captions to create scale contrast.
- Keep the SEO h1 small and separate from the visual wordmark.

## Unknowns / not verified
- Which GSAP plugin runs which effect; canvas content (shader vs 2D) [?]; hover and menu states [?]; whether the page is a client demo or a product site [?].
