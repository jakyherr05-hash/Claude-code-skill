---
name: Santal (Santalarch)
url: https://santalarch.com/
slug: santal
category: studio
tags: [awwwards-sotd-2026, lenis, three-js, architecture, helvetica, giant-wordmark, hairline-grid, long-scroll, invert-color-toggle, monochrome, webgl-chapters]
researched: 2026-11-17
status: inspected
confidence: medium
evidence: ../evidence/santal/
---

# Santal (Santalarch)

Claim labels: **[M]** measured (capture.json / devtools) · **[O]** observed in screenshots/behaviour · **[I]** inferred (state the basis) · **[?]** unknown.

## At a glance
An architecture studio's site, Awwwards "Site of the Day - Nov 15, 2026" (verified verbatim on https://www.awwwards.com/sites/santal on 2026-11-17). A near-monochrome, Helvetica-only, hairline-grid layout with a giant cropped wordmark, followed by a very long (41,571 px, ~46 viewports [M]) chain of WebGL-lit chapters that alternate between dark 3D scenes and white detail chapters. Lesson: extreme restraint (one typeface, one grey, thin lines) makes room for dramatic scale changes and photographic/3D chapters.

## Design characteristics
- Hero: off-white page, a black Helvetica wordmark so large it is cropped at the viewport edges, a thin top navigation with tick marks under each label, two small text blocks placed on the hairline grid, a plus mark at left and "Scroll to discover" with a vertical rule at the bottom [O desktop-0].
- Bottom-left control "invert color" [O]: the page can flip to a dark scheme [I].
- Chapters (filmstrip): 3D grid of rotating words on black (scroll-01), a dark tiled floor/texture (scroll-02..04), a glass/ribbed texture (scroll-05), then white "Quiet" chapter with a mechanical watch image (scroll-06/07), "Material Intelligence" with a lattice panel (scroll-08), "Detail as Discipline" with an exploded layered panel (scroll-09) [O].
- Hairlines form a quartered grid with a small central dot [O].

## Typography
- Loaded: Helvetica 400 and 500 (system face), plus a `lil-gui` font entry [M] (lil-gui stylesheet injected, so a debug UI is bundled [I]).
- Giant display: Helvetica 400, 98 px / 86.2 px (0.88), tracking -4.9 px (-5%) [M] (the wordmark itself is larger and cropped [O]). "Architectural" intro 33 px / 35.6 px (1.08), tracking -0.99 px (-3%) [M]. Chapter titles 50 px [M]. Nav 16 px; small captions 10 px, weight 500, tracking -0.2 px [M].
- No h1 in DOM (h1Count 0) [M].

## Layout & spacing
- docHeight 41,571 px [M]; 9 sections, 31 WebP images, 4 canvases (two 1440x900, one 864x566), 62 SVGs [M]. Header sticky; 7 links [M]. 5-7 large fixed/sticky layers per frame [M], no `.pin-spacer` [M].

## Navigation
- Philosophy / Works / Services / Process / Company / Contact with hairline ticks; mobile: "Menu" text button and plus mark [O, M].

## Animation
- three.js r183 [M]; 1-2 canvases live from scroll-01 onwards [M]. Rotating word-field and tile textures are WebGL [I]. GSAP not detected [M].

## Scroll
- `lenis` class [M]. Wheel 600 moved only 390 px (352 at 16 ms, 366 at 100, 387 at 250, 390 at 500) [M]; `likelySmoothed` false [M]. Why only 390 is [?] (page may be scroll-length-mapped or the hero is a pinned intro).
- Filmstrip (step 4,519 requested; scrollY advanced ~2,937 per frame, last 26,433 of 41,571) covers about 64% of the page [M]; the remaining ~15,000 px (footer and later chapters) were not captured [M].

## Image & video treatment
- Monochrome black/grey photography and renders of materials, mechanisms and lattice panels, mostly WebP [M, O]; no video [M].

## Responsive (390px observation)
- No overflow [M]; the wordmark fits width with wide tracking; copy block centred; cookie bar bottom-right [O]; largest text 60 px [M]. Tablet portrait: wordmark fills width [O].

## Technical discoveries
- Lenis class, three r183, GTM/gtag, lil-gui style [M]. 147 `link` requests and 13.3 MB fetch traffic [M].

## Performance (single lab run, indicative only)
- DCL 1,496 ms, load 6,816 ms, LCP 15,168 ms, CLS 0 [M]; 232 requests [M]. Very long LCP: the hero wordmark or WebGL scene loads late in the lab run [I].

## Useful implementation ideas (original re-implementations, not copies)
- Monochrome system: one typeface at two or three sizes, hairline grid, tiny captions; use scale (a cropped giant wordmark) as the only drama.
- Chapter pairs: dark WebGL atmosphere chapter followed by a white single-object chapter with a two-word title.
- Colour-invert toggle in a fixed corner as a persistent brand gesture.
- Plan LCP: ship a static first frame so the giant wordmark paints immediately while WebGL loads.

## Unknowns / not verified
- The last third of the page; invert behaviour; menu overlay; why the first wheel moved 390 px [?].
