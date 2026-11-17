---
name: Lando Norris
url: https://landonorris.com/
slug: lando-norris
category: other
tags: [webflow, lenis, three-js, sports-personal-brand, collage, stencil-type, variable-font, acid-lime, dark-light-alternation, merch, cursor-interaction]
researched: 2026-11-17
status: inspected
confidence: medium
evidence: ../evidence/lando-norris/
---

# Lando Norris

Claim labels: **[M]** measured (capture.json / devtools) · **[O]** observed in screenshots/behaviour · **[I]** inferred (state the basis) · **[?]** unknown.

## At a glance
Personal-brand site of a Formula 1 driver (title "McLaren Formula 1 Driver — Lando Norris") [M] built on Webflow with Lenis and three.js [M]. The first frame is a full-bleed portrait that is partly masked by moving helmet-pattern fragments (a "tap to look" hint appears on mobile) [O]. The page then alternates light and dark olive chapters, using collage photography, stencil-style type and a helmet grid. Lesson: a personality-led site can carry strong interaction (portrait reveal) and a strict two-colour system (acid lime on olive/cream) with a loud display face used sparingly.

## Design characteristics
- Palette: cream rgb(244,244,237) text, dark olive rgb(40,44,32) page background [M]; acid lime accents on buttons, scribbles and marquee text [O].
- Hero: photographic face with irregular glossy helmet fragments and pattern shapes masking parts of it, logo top-left, lime "Store" pill and a boxed menu button top-right, tiny "next race" card bottom-left [O desktop-0]. Mobile shows "TAP TO LOCK" with a hand icon [O mobile-0].
- Scroll-01: dark olive with a lime scribble and a looping stencil-type marquee around a framed portrait [O].
- Scroll-04: cream page with huge "ON TRACK / OFF TRACK" words, helmet and face crops [O]. Scroll-06: dark helmet grid ("Helmets") [O]. Scroll-07: merch chapter "World Drivers' Champion" with a large product photo [O]. Footer: lime frame with a mini nav list and store badges [O scroll-09].

## Typography
- Loaded: Brier 700 (display) and Mona Sans Variable 200-900 [M].
- h1: Mona Sans Variable 700, 38 px / 44 px, uppercase, normal tracking [M]; h2 32 px / 36 px uppercase [M]. Giant words "ON / OFF / TRACK" at 97.5 / 93.3 px; "World Drivers' Champion" 93.3 px; "Always bringing the fight." 70 px [M, filmstrip].
- Body 14 px / 20 px [M]. Mobile largest text 56 px [M].

## Layout & spacing
- docHeight 13,577 px (~15 viewports) [M]; 12 sections, 133 images (69 WebP, 32 PNG, 32 SVG), 21 canvases (three 1440x900 and several small icon-sized) [M]. No header landmark detected [M].
- Collage areas place small photos at irregular positions with tiny captions (scroll-02, scroll-03) [O].

## Navigation
- Two floating buttons: Store (lime) and a boxed icon that opens the menu; wordmark top-left [O]. Mobile identical [O].

## Animation
- three.js r174 [M] with 3 canvases visible in hero frames [M]; the helmet-fragment masking is probably a WebGL/canvas pointer effect [I]. Webflow runtime present (`w-mod-js`) [M]. GSAP not detected [M].

## Scroll
- `lenis` class and Lenis global [M]. Wheel 600: 592 at 16 ms, 600 at 100 ms [M]; `likelySmoothed` false [M], so Lenis is present but this input resolved nearly instantly (lerp/duration or syncTouch settings [?]).
- Filmstrip (step 1,409 px of 13,577) covers the whole page [M]: hero (00), scribble marquee (01), photo collage x2 (02-03), "On/Off track" (04-05), helmets (06), merch (07), socials (08), footer (09) [O]. Large fixed/sticky elements 3-6 per frame, no `.pin-spacer` [M].

## Image & video treatment
- High-contrast portraits and action photography, cut-out PNGs for collage, WebP for most images [M]; no video elements [M].

## Responsive (390px observation)
- No overflow [M]; the hero portrait fills the width, wordmark centred, mobile instruction replaces the desktop pointer interaction [O]. h1 stays 38 px [M].

## Technical discoveries
- Webflow, Lenis, three r174, gtag [M]. Brier and Mona Sans loaded [M].

## Performance (single lab run, indicative only)
- DCL 1,664 ms, load 1,666 ms, LCP 976 ms, CLS 0.01 [M]; 123 requests (89 images, transfer sizes read 0, cross-origin [M]).

## Useful implementation ideas (original re-implementations, not copies)
- A hero where an overlay of brand pattern shapes reveals or hides a portrait under pointer or touch; provide a mobile affordance ("tap").
- Alternate cream and dark chapters with one accent colour doing all the highlighting.
- Use a variable grotesk in uppercase for large statements and a stencil or distinct display face only in marquees and wordmarks.
- Collage layout: small captioned photos placed off-grid around a central statement.
- Keep merch/store as a single lime button in every viewport, not a nav item.

## Unknowns / not verified
- Hero effect mechanism; hover behaviour; menu overlay; page transitions; whether Lenis runs on touch [?].
