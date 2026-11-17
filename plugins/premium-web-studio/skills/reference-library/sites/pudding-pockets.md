---
name: The Pudding: Women's Pockets are Inferior
url: https://pudding.cool/2018/08/pockets/
slug: pudding-pockets
category: other
tags: [editorial, data-scrollytelling, sticky-graphic, svg, publico, atlas-grotesk, canela, light-theme, native-scroll, step-captions, methods-section]
researched: 2026-11-17
status: inspected
confidence: medium
evidence: ../evidence/pudding-pockets/
---

# The Pudding: Women's Pockets are Inferior

Claim labels: **[M]** measured (capture.json) · **[O]** observed in screenshots · **[I]** inferred · **[?]** unknown. Captured with `--tablet --filmstrip 12`; filmstrip.jpg is a contact sheet of the frames, plus desktop-0, mobile-0, tablet-portrait-0. Studied for the OZONE youth-vaping-prevention project; no copy, brand or assets are reused.

## At a glance
A 2018 data essay (a 10,930 px native-scroll page [M], ~12 viewports) from the visual-essay publication The Pudding. Best-in-class at *staging a number*: a sticky SVG graphic changes state as small caption cards pass, and the page tells the reader up front "you're about to experience some scroll-driven animation, you can jump ahead to the final state". Lesson for OZONE: make every statistic a visible, simple object (two shapes, one size difference), explain it in a short caption, and put method and sources at the end.

## Design characteristics
- Light blue-grey ground (rgb 231,238,248) with a blue-framed title panel and dotted-outline "POCKETS" lettering [O scroll-00, M bg].
- Prose column ~ 350 px wide at left on desktop [O scroll-00..01]; sticky graphic stage in the middle; short blue caption cards ("Here are the front pockets in 80 pairs of blue jeans.", "On average, the pockets in women's jeans are 48% shorter and 6.5% narrower than men's pockets.") scroll over it [O scroll-01..03].
- Beat sequence: 160 outlines overlap → separate into two colours (red women, yellow men) → averages overlaid with dimension labels (6.4", 5.6", 9.1") → test objects (phone, wallet, hand) → grid of all items with filters → conclusion prose [O scroll-01..07]. Each graphic change is one idea; the numbers sit on the shapes.
- Colour is data-coded only: red vs yellow with matching inline highlights in the caption [O scroll-03].
- Methods and "download the data" are a full blue section at the end [O scroll-10].

## Typography
- Body Publico Text 17 px / 28.9 px (1.7); sans labels Atlas Grotesk; display Canela 300/700 [M loaded fonts]. Section subheads 24 px [M].

## Responsive (390px observation)
- No overflow [M]; title panel scales and the column becomes full-width at ~17 px serif; hamburger top right [O mobile-0].

## Technical discoveries
- No libraries detected by globals (8 scripts) [M]; the graphics are SVG [O]; it is probably custom scroll-observer code [I, from no GSAP/Lenis globals and sticky behaviour].
- DCL 814 ms, LCP 396 ms, CLS 0.028, 35 requests [M].

## Useful implementation ideas (original re-implementations, not copies)
- Sticky stage + step cards driven by IntersectionObserver; native scroll, no hijack.
- A "skip animation" affordance and a clear final state accessible without scrolling.
- Keep method/limitations on the page: for OZONE this is the Sources and "what the data cannot say" section.

## Unknowns / not verified
- Interaction states for the filters and test objects, mobile graphic sizing beyond the first screen [?].
