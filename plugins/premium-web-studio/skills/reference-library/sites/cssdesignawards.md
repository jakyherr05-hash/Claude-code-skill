---
name: CSS Design Awards
url: https://www.cssdesignawards.com/
slug: cssdesignawards
category: gallery
tags: [gallery, awards, editorial, light, letterspaced-caps, cards, native-scroll]
researched: 2026-11-15
status: inspected
confidence: medium
evidence: ../evidence/cssdesignawards/
---

# CSS Design Awards

Claim labels: **[M]** measured (capture.json / devtools) · **[O]** observed in screenshots/behaviour · **[I]** inferred (state the basis) · **[?]** unknown.

## At a glance
An awards gallery whose homepage leads with the current "Website of the Day": a large preview, a rotating-looking seal, a judges' score panel and a three-column grid of nominees. Lesson: a restrained warm-neutral UI, tiny letter-spaced uppercase labels and generous whitespace let third-party screenshots be the colour.

## Design characteristics
- Warm off-white page (body `rgb(241,239,233)`), near-black text `rgb(40,40,40)` [M]. A slightly darker beige panel sits behind and under the hero preview, overlapping it [O].
- Hero: left large screenshot with soft drop shadow, right column with a circular "Website of the Day" seal, title, author, country; beige score panel below with three trophy icons and a judge's score (8.27) [O].
- Accent: small lilac highlight blocks under some labels (SUBMIT button, section headings) [O].
- Header logo in the centre swaps to the featured site's logo (Mobbin, then red collar between screenshots) [O], i.e. a sponsor/ad slot rotating [I].

## Typography
- Loaded: Open Sans 400, 400 italic, 600, 700, 800 [M]. Single family throughout [M].
- h1 "AWARDED 2026 NOV 14": 12px / 700 / letter-spacing 4.8px (0.4em) / line-height 14.4px [M]. h2 "Newest Nominees": 14px, uppercase [M].
- Largest visible text is only 24px, weight 800, tracking 1.8px (the score "8.27") [M]. The page has no large display type [M].
- Descriptions set in small italic [O].

## Layout & spacing
- Hero content starts x=229 (h1) and cards at x=100 on a 1440 viewport [M]; nominee grid is 3 columns of equal cards with large vertical gaps [O].
- docHeight 2993 px [M]; 3 sections [M].

## Navigation
- Header is `position: static` [M] (scrolls away; desktop-1 still shows the header at top, so it may be fixed in practice [?]; screenshot shows it present after scrolling [O] which contradicts "static" for the measured element, likely a wrapper [I]).
- Desktop shows only logo, hamburger, search, SUBMIT [O]; 17 links in the menu overlay [M]. Mobile: logo, hamburger, search [O], menuButton true [M].

## Animation
- Nominee card hover state shows "VOTE ->" overlay with dim [O, captured mid-state in desktop-1]. Other motion [?].

## Scroll
- Wheel 600px: scrollY 600 at 16 ms and constant after [M] = native scroll, no smoothing. No Lenis/Locomotive detected [M].

## Image & video treatment
- 41 images: 21 SVG, 20 JPG [M]; no video, no canvas [M]. Thumbnails are uniform ~3:2 crops with no overlays until hover [O].

## Responsive (390px observation)
- No horizontal overflow (scrollWidth 390) [M]. Hero stacks: label, preview, text, judge avatars, score in two columns [O]. Largest font 50px on mobile [M].

## Technical discoveries
- No gsap, Lenis, three, framework or CMS globals detected [M]; 6 scripts, no library hints [M]. Likely server-rendered pages [I].

## Performance (single lab run, indicative only)
- DCL 1856 ms, load 2119 ms, LCP 1336 ms, CLS 0.162, 44 requests, ~725 KB images [M]. CLS above 0.1 [M]; cause [?].

## Useful implementation ideas (original re-implementations, not copies)
- Score panel: CSS grid of icon + tracked-caps label + numeral; use `letter-spacing: .3-.4em` on 11-12px uppercase labels for a refined data feel.
- Overlapping beige panel behind a hero image: absolute-positioned block offset by ~20% so the image breaks the container edge.
- Hover "Vote ->" reveal: opacity + `backdrop` dim transition 200-300 ms, pure CSS.

## Unknowns / not verified
- Seal animation, nav overlay design, hover timings, why CLS is 0.162.
