---
name: Obys Agency
url: https://obys.agency/
slug: obys
category: studio
tags: [preloader, canvas, custom-font, black-white, monochrome, agency, image-stack, minimal-js]
researched: 2026-11-15
status: partially-inspected
confidence: medium
evidence: ../evidence/obys/
---

# Obys Agency

Claim labels: **[M]** measured (capture.json / devtools) · **[O]** observed in screenshots/behaviour · **[I]** inferred (state the basis) · **[?]** unknown.

## At a glance
Obys is a design/branding agency. Capture shows a black preloader with a small stacked-image cluster and a numeric counter at the right edge ("91") [O], and a second frame with a white page and a vertical column of grayscale project thumbnails flanked by black crescent shapes [O]. Lesson: a minimalist, canvas-driven showcase built with almost no libraries (2 scripts) [M].

## Design characteristics
- Monochrome: black loader, white stage, greyscale thumbnails [O]. Thumbnails ~120px wide, centred column, glitchy slice-offset layers during loading [O].
- Counter in tiny type at the far right during load [O].

## Typography
- Loaded faces: custom "Obys" (400) and "ObysSans4" [M]. Body is `Obys, serif` fallback [M].
- Body 11px/13.2px (1.2), tracking -0.11px (-0.01em) [M]. Largest visible text 79.9999px/79.9999px (1.0), tracking -2.4px (-0.03em), text "Makhno" [M] - a project title, not visible in the screenshots [O].
- Names such as "Makhno", "Odin's Crow", "Olga Prudka" are project/credit text in the DOM [M].

## Layout & spacing
- docHeight 900 (viewport) [M]: single-screen app, content is not laid out in document flow. 194 links, 38 webp images [M], 1 fixed canvas 1440x900 [M].
- Fixed 65px header with 3 links, white text at x=10 [M] (inverts against the black stage [I]).

## Navigation
- Fixed header with 3 links [M]. Project index appears to be a list of ~190 links [M] (basis for "index" [I]). Mobile: no menu button detected [M]; screenshot shows only the loader [O].

## Animation
- Preloader counter and a stack of images that shuffle/jitter [O]. Canvas fixed behind everything [M]; likely draws or transforms the images [I]. Technique unknown [?].
- No GSAP/Three/Lenis globals detected [M]; custom code or bundled libs are both possible [I].

## Scroll
- Wheel 600px: scrollY 0 at all samples, docHeight 900 [M]. Consistent with a page driven by a canvas/virtual scroll (a custom container or WebGL carousel) rather than native scroll [I]. The vertical column in desktop-1 shows the carousel moving after the wheel/loader finishing [O] - two effects cannot be separated from one sample.

## Image & video treatment
- Images all webp (38) [M], shown greyscale and small, vertically stacked with 3-5px gaps [O]; large previews are not reached [?].

## Responsive (390px observation)
- Loader cluster centred, ~50px; no horizontal overflow [O/M]. Largest text 21.7px on mobile [M].

## Technical discoveries
- Only 2 scripts and 25 requests [M]; Google Tag Manager present [M]. No framework markers [M].

## Performance (single lab run, indicative only)
DCL 1278ms, load 2091ms, LCP 2135ms, CLS 1 [M]. A CLS of 1 is consistent with a full-viewport preloader/stage swapping layout during load [I]; lab caveat: single run, and the layout-shift counter can be inflated by transitions of fixed elements.

## Useful implementation ideas (original re-implementations, not copies)
- Counter preloader: drive a tween with GSAP (`gsap.to(obj,{val:100,onUpdate})`) tied to real loading progress (`Promise.all` of image decodes), then reveal via `clip-path`.
- Vertical thumbnail carousel: a transform-driven list moved by wheel delta with lerp (`value += (target - value) * 0.1` in rAF) - this is the technique that makes `scrollY` stay 0.
- To avoid the CLS here: animate only `transform`/`opacity` and reserve sizes up front.
- Keep a real list of links in the DOM (as here) for crawlers/keyboard users.

## Unknowns / not verified
- Post-load page, project detail pages, canvas contents, scroll implementation, mobile interaction.
