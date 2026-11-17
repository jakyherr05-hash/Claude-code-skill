---
name: Uncommon Studio
url: https://uncommonstudio.com.au/
slug: uncommon-studio
category: studio
tags: [lenis, three-js, nextjs, global-canvas, design-studio, local-time-clock, big-type, video-hero, sticky-sections, light-dark-alternation, neue-montreal]
researched: 2026-11-17
status: inspected
confidence: medium
evidence: ../evidence/uncommon-studio/
---

# Uncommon Studio

Claim labels: **[M]** measured (capture.json / devtools) · **[O]** observed in screenshots/behaviour · **[I]** inferred (state the basis) · **[?]** unknown.

## At a glance
Design studio site (.com.au domain, header clock labelled "MEL" [O]; Next.js, Lenis, three.js r158) [M] with a persistent global canvas (html class `js-has-global-canvas`) [M]. The hero rotates through project showcases with huge italic/mirrored type, then a dark "statement" chapter hosts a sequence of 3D-tilted project mockups before the page switches to light for services and a closing "book a call". Lesson: a single sticky stage (one pinned canvas/video layer) with project cards swapped in, bracketed by oversized cropped type.

## Design characteristics
- Hero variants at capture: lilac zigzag background with enormous black italic type cropped by the viewport and a mirrored "UNCOMMON" wordmark at the base (desktop-0); a blue zigzag with cartoon-like 3D lettering on tablet; a presenter video with the wordmark below (scroll-00) [O]. The hero is therefore rotating or randomised [I].
- Scroll-01: charcoal page with a centred two-line statement [O]. Scroll-04/05: a tilted monitor/laptop mockup showing a project, with captions at left/right [O]. Scroll-07/08: light grey with list-style value statements and thin outline icons [O]. Scroll-09: "Book a 15 min call" with a giant cropped letterform at the right edge [O].
- Local time (local clock) in the header, "Menu" pill at right [O tablet-portrait-0].

## Typography
- Loaded: Neue Montreal 400 and 500 [M] (the `__neuemontreal_hash` family name is the Next.js font-loader pattern [I]).
- h1/h2: 67.5 px / 70.9 px (1.05), tracking -0.9 px (-1.3%) [M]. Contact line 45 px; secondary 24 px [M, filmstrip]. Mobile h1 31.2 px, largest text 120 px (the hero display words) [M].
- Micro labels 9 px, weight 500, uppercase, tracking 0.6 px (6.7%) [M]. Nav 12 px [M].

## Layout & spacing
- docHeight 8,938 px (~9.9 viewports) [M]; 5 sections, 49 images, 1 video (autoplay loop, Vimeo rendition), 1 canvas 1440x900 [M]. Header fixed, 14 px measured (inner items out-of-flow) [M].
- 7-9 large fixed/sticky layers per frame [M]: the stage (canvas + video) is persistent while content layers swap [I].

## Navigation
- Left: home breadcrumb ("/Home"); right: "Menu" pill with dot; "Work with us" and clock top-left on tablet [O]. Mobile: "Menu" pill bottom-right [O mobile-0] (script flagged menuButton false [M]).

## Animation
- three.js r158 [M]; `js-smooth-scrollbar-enabled` class [M]. The mockup tilts in scroll-04/05 are probably WebGL planes or CSS 3D [?]. GSAP not detected [M].

## Scroll
- `lenis` class [M]. Wheel 600: 198 at 16 ms, 356 at 100, 501 at 250, 580 at 500, 598 at 900 [M]; 59% at 100 ms, `likelySmoothed` true [M].
- Filmstrip (step 893 px of 8,938) reaches 8,037 at frame 9 [M]: hero (00), statement (01), project reel x4 (02-05, headline stays "We design for impact...") [M, O], services statement (06), light value list (07-08), CTA (09) [O].

## Image & video treatment
- Heavy, colourful project imagery composited in 3D; dark mockups on black; presenter video in the hero [O]. Network: images ~3.9 MB, fetch ~5.4 MB [M].

## Responsive (390px observation)
- No overflow [M]; display words crop off both edges on mobile and tablet; layout becomes a stacked card with the line "Love to the hidden" [O]. Tablet h1 60 px both orientations [M].

## Technical discoveries
- Next.js, Lenis class, three r158, gtag [M]; font family naming suggests next/font [I]. 

## Performance (single lab run, indicative only)
- DCL 3,019 ms, load 5,374 ms, LCP 3,044 ms, CLS 0.003 [M]; 110 requests, scripts ~795 KB [M]; network-idle timeout [M].

## Useful implementation ideas (original re-implementations, not copies)
- One sticky stage and swapped content layers: keep a single canvas/video persistent and change its content per chapter.
- Intentionally cropped giant type (letters bleeding off the viewport) as a hero.
- A live local-time readout in the header as a human detail.
- Light/dark section alternation, with the closing CTA enlarged to 45 px beside a cropped giant letter.

## Unknowns / not verified
- Hero rotation logic; tilt effect; hover states; menu overlay [?].
