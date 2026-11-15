---
name: Instrument
url: https://www.instrument.com/
slug: instrument
category: studio
tags: [nuxt, vue, light, agency, display-type, serif-italic, variable-font, rounded, pills, video]
researched: 2026-11-15
status: inspected
confidence: high
evidence: ../evidence/instrument/
---

# Instrument

Claim labels: **[M]** measured (capture.json / devtools) · **[O]** observed in screenshots/behaviour · **[I]** inferred (state the basis) · **[?]** unknown.

## At a glance
Technology-led brand/product/marketing agency. White page, a gigantic heavy wordmark spanning the full width, a rounded-corner hero reel with a play button, then an editorial serif-italic statement [O]. Lesson: huge wordmark as the page's only "headline" plus a calm serif statement gives hierarchy without effects.

## Design characteristics
- White background body rgb(255,255,255), text rgb(7,7,8) [M]; strong black/white with colour only from work imagery (lime billboard, teal gradient) [O].
- Hero media with ~24px rounded corners, play button centred, pause control bottom-left [O].
- Pill-shaped small caps links and buttons throughout (grey pills for nav, black pill "View All Work" with arrow) [O].
- Announcement strip in the header ("Meet Playspace...") [O].

## Typography
- Loaded faces: Instrument-Sans 400, Instrument-Serif 400 and italic [M]. The giant "INSTRUMENT" wordmark is not in the loaded-font list; probably an SVG logo (31 svgs) [I].
- Instrument Sans is a variable font with width axis: computed `font-variation-settings` "wdth" 100, "wght" 400 on body and "wdth" 80 on h2 [M].
- Body 16px (line-height reported 16px) [M]; small eyebrow h2 "Recent work": 12px, uppercase, tracking 1.32px (0.11em), wdth 80 [M]; cookie p 15px/24px, +0.45px [M].
- Serif statement ("We're a digital-first design agency...") appears ~45px, tight tracking, centred [O]; size not measured [?]. Mobile largest text 35px [M].
- No `<h1>` on the page (h1Count 0) [M] - an a11y/SEO gap.

## Layout & spacing
- Outer margin ~32px, wordmark spans the full width [O]. Hero card full-bleed minus margin. Statement is a narrow centred column (~550px) with large vertical whitespace [O]. 13 sections, doc height 6710px [M].

## Navigation
- Sticky `header` 50px, 28 links (includes mega/duplicate links) [M]; desktop shows Work/Services/About left, Careers/Latest/Contact right as grey pills [O]. Mobile: wordmark + hamburger [O]. Skip link exists in DOM (positioned off-screen) [M].

## Animation
- Hero is a video/reel with controls [O]; the second view shows a card collage (chair collection) as the reel content [O]. Other scripted motion [?].

## Scroll
- Wheel 600px: 600 at first sample (16ms) and constant [M] -> native scroll, no smoothing. Lenis/Locomotive not detected [M].

## Image & video treatment
- 26 `img`, 0 `<video>` elements [M] (reel may be an iframe/player: 2 iframe requests [M]; basis for "player" [I]). Rounded masks, bright flat illustrative work stills [O].

## Responsive (390px observation)
- Wordmark shrinks to a ~200px logo, hamburger at right; hero stacked with rounded corners; cookie banner takes the bottom ~160px [O]. No overflow [M].

## Technical discoveries
- Nuxt detected [M]; `swiper-vue` chunk in script list [M]. 62 scripts, 201 requests, 1 console 404 [M].

## Performance (single lab run, indicative only)
DCL 840ms, load 3077ms, LCP 1768ms, CLS 0.107 (above the 0.1 "good" limit) [M]. Cookie banner and hero media may contribute [I].

## Useful implementation ideas (original re-implementations, not copies)
- Full-width wordmark: inline SVG with `width:100%; height:auto` and fixed viewBox - scales perfectly with no JS.
- Width-axis trick: a variable font with `wdth` lets labels set at 80 read as condensed small caps; implement with `font-stretch: 80%` or `font-variation-settings`.
- Serif-italic statement + sans UI: pair at a ~3:1 size ratio; keep statement `text-wrap: balance`.
- Reserve hero media with `aspect-ratio` to avoid the CLS seen here.

## Unknowns / not verified
- Wordmark implementation, reel player, serif size, page transitions, case-study pages.
