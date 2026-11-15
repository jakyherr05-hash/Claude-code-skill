---
name: Adobe Fonts
url: https://fonts.adobe.com/
slug: adobe-fonts
category: typography
tags: [typography, font-library, subscription, adobe, creative-cloud, light, gradient, cards, resource]
researched: 2026-11-15
status: inspected
confidence: medium
evidence: ../evidence/adobe-fonts/
---

# Adobe Fonts

Claim labels: **[M]** measured (capture.json / devtools) · **[O]** observed in screenshots/behaviour · **[I]** inferred (state the basis) · **[?]** unknown.

## At a glance
Adobe's subscription font library. White product UI with one coral-pink gradient hero containing a natural-language search ("Describe the font you're looking for"), side promo cards, and horizontal specimen carousels by foundry [O]. Lesson: put search/AI discovery as the hero and let specimen thumbnails supply the colour.

## Design characteristics
- White chrome, thin borders, rounded 8px-ish cards; saturated gradient hero card (coral to magenta/violet) [O].
- Specimen tiles are coloured/black artwork of each family [O]; blue primary "Search" button, black pill secondary buttons [O].

## Typography
- UI font: adobe-clean (400, 700, 900) with fallbacks source-sans-pro, Helvetica Neue [M]; `wf-active` class shows webfont loader ran [M].
- Hero "Find the perfect font": 60px/90px (1.5), weight 900, white [M]. h2 "Every font you need, everywhere you need it": 22px/33px, 400 [M]. Body 14px/21px [M].

## Layout & spacing
- ~16px outer margin; 2-column top: large hero (~62% wide) + stacked cards (~33%) [O]. Section titles with "View more" pill at right, then 5-up carousel [O].

## Navigation
- Sticky 56px header: logo, Browse all, Recommendations, Font packs, Foundries, About, Sign in (7 links) [M/O]. Blue dots on two items as notification markers [O]. Mobile: logo, Search, Browse all, truncated list, Sign in [O].

## Animation
- Carousel arrows; no decorative animation observed [O]. None of the known animation libraries detected [M].

## Scroll
- Wheel 600px: document scrollY 0 [M], docHeight 900 [M], yet desktop-1 shows content moved ~400px with header fixed [O] -> an inner scroll container, not the window [I].

## Image & video treatment
- 7 `img`, 4 SVG, no video [M]; specimen tiles are artwork images [O].

## Responsive (390px observation)
- Cards stack vertically full width; hero title wraps to two lines; floating "?" help button persists [O]. No overflow [M].

## Technical discoveries
- 55 scripts, 129 requests, gtag [M]. Console shows a `requestStorageAccess` denial and a COEP-blocked resource [M]. Framework [?].

## Performance (single lab run, indicative only)
DCL 1444ms, load 2733ms, LCP 724ms, CLS 0.045, 129 requests [M].

## Using this resource in the studio
- Licensing model: Adobe Fonts is included with a Creative Cloud subscription; fonts are activated in apps or served to websites via a web project, not downloadable files [I - from general product knowledge, not verified in this run].
- Self-hosting: generally not permitted; web use goes through Adobe's hosted CSS/kit [I]. This conflicts with the studio's self-host default - for client projects, confirm the client has an Adobe account that will stay active (fonts stop serving if the subscription lapses [I]).
- Practice: use for design exploration; for production prefer Fontsource / Fontshare / purchased fonts unless the brief specifies Adobe [I].

## Useful implementation ideas (original re-implementations, not copies)
- Carousel with CSS scroll-snap (`scroll-snap-type: x mandatory`) plus arrow buttons calling `scrollBy`; no library.
- Natural-language search box as hero focus: a single input with `aria-label`, big radius, primary button.

## Unknowns / not verified
- Licence terms, web project flow, AI search behaviour, inner-scroll container identity.
