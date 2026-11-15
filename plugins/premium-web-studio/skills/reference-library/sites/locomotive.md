---
name: Locomotive
url: https://locomotive.ca/
slug: locomotive
category: studio
tags: [lenis, webgl, three-js, agency, editorial, serif, pixelated-hero, red, video, montreal]
researched: 2026-11-15
status: inspected
confidence: medium
evidence: ../evidence/locomotive/
---

# Locomotive

Claim labels: **[M]** measured (capture.json / devtools) · **[O]** observed in screenshots/behaviour · **[I]** inferred (state the basis) · **[?]** unknown.

## At a glance
A Montreal digital-first design agency (the Locomotive Scroll authors) whose homepage opens with a full-bleed red pixelated image that resolves, with a condensed serif headline pinned bottom-left. Lesson: a distinctive display serif plus a tactile WebGL image reveal over clean grotesque UI text.

## Design characteristics
- Hero at capture: saturated red field with large pixel blocks over a dark portrait; headline and small tags in cyan/teal; header text white [O]. After scrolling, hero becomes dark with red glows, then a white content section [O].
- White section uses an editorial composition: "Seven Years / Running / 2018-2024" text positioned around a centred black product image (a ring) with offset labels on each side [O].
- Small outlined "OPS | DES | DEV" badge and asterisk glyphs beside the headline [O].
- html classes `is-over-home-hero`, `is-loaded`, `is-ready`, `is-top` [M].

## Typography
- Loaded: LocomotiveNew 400 (display), HelveticaNowDisplay 400 (UI/body) [M].
- h1: LocomotiveNew 70px, line-height 77px (1.1), letter-spacing normal [M]; looks like a condensed light serif [O]. h2/p/nav: HelveticaNowDisplay 26px / 31.2px [M] (the large text size is a viewport-scaled or root-scaled value [I]).
- Mobile h1 36px, largest 46.8px [M].

## Layout & spacing
- Header: logo left, small glyph, centred links "Work, Agency, Careers, Store", "Let's talk" right; ~27px edge margin on 960-scaled shot ≈ 40px at 1440 [O, estimated].
- docHeight 6598 px; 2 sections; 54 links [M].

## Navigation
- `header` position static [M]; stays visible over the hero on scroll in desktop-1 [O]. Mobile collapses to "Menu" text button [O, M].

## Animation
- 2 absolute canvases (440x616, 440x587) [M], three.js revision 165 detected [M]; canvases likely drive image effects [I]. Hero pixel dissolve [O]. One muted looping video from Vimeo progressive redirect, autoplay false [M].

## Scroll
- `lenis` class on html [M]. Wheel 600: 476 at 16 ms, 576 at 100, 594 at 250, 600 at 500 [M]: fast ease-out tail, consistent with Lenis with a high lerp or short duration [I]. The capture script's likelySmoothed flag is false [M], so the smoothing is subtle.

## Image & video treatment
- 7 images, ("other" format, likely extensionless URLs [I]), 1 video [M]. Heavy darkened portraits with colour grading; products on pure black [O].

## Responsive (390px observation)
- No overflow [M]; full-bleed face crop with headline bottom-left over three lines [O]; Menu button [M].

## Technical discoveries
- Lenis class on html, three r165 global [M]. Custom `vendors.js` and `app.js` bundles [M, scripts.libraryHints]. Matomo analytics, reCAPTCHA, Cloudflare challenge script [M]. GSAP not detected as global [M].

## Performance (single lab run, indicative only)
- DCL 890 ms, load 1431 ms, LCP 936 ms, CLS 0.923 [M] (very high; likely hero/canvas layout shift during load [I]). 23 requests, ~1 MB script, ~0.7 MB fetch [M].

## Useful implementation ideas (original re-implementations, not copies)
- Pixel-reveal hero: render the image to a small canvas, upscale with `image-rendering: pixelated`, animate resolution up with GSAP over ~1.5 s.
- Lenis with `lerp ~0.1-0.15`, toggling a body class (`is-over-hero`) via ScrollTrigger to switch header colours.
- Editorial offset labels: CSS grid with named areas, text placed on both sides of a centred media block.

## Unknowns / not verified
- Effect source (WebGL shader details), GSAP use, page transitions, hover states, cause of CLS.
