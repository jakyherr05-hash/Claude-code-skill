---
name: Mars Rejects
url: https://www.marsrejects.com/
slug: mars-rejects
category: other
tags: [graphic-novel, halftone, ink-illustration, red-black-cream, extended-grotesk, framer, comic-poster, character-cast, native-scroll, dark-to-light]
researched: 2026-11-18
status: inspected
confidence: medium
evidence: ../evidence/mars-rejects/
---

# Mars Rejects

Claim labels: **[M]** measured · **[O]** observed · **[I]** inferred · **[?]** unknown. `capture-reference.mjs https://www.marsrejects.com --tablet --filmstrip 12`, all 12 frames and mobile opened. A Web3 character project (Awwwards Honorable Mention, May 2023, per search result); studied only for its look. No art or copy reused. Do not copy its NFT/commercial framing.

## At a glance
Closest palette and drawing register to OZONE found: near-black navy ground, one electric red-coral (#F04452-like) display type, off-white, halftone-shaded ink portraits. Native-scroll document of 16,339 px (wheel 600 px reached 600 in one sample, so no smoothing [M]; 12 frames at ~1,404 px steps reach 15,439). Lesson: a cast of consistently drawn, halftone-shaded figures cropped at the frame edge, with huge red extended type, reads "dark graphic novel" immediately.

## Design characteristics
- Hero: five greyscale halftone portraits with white highlights and cropped to the bottom edge, red "MARS REJECTS" in 140 px Druk Wide Super, line-height 112 px [M] overlapping the figures [O scroll-00]. One character exhales a wisp of smoke: exactly the kind of cigarette cue OZONE must not draw [O].
- Story chapter on dark navy: tiny red label "story", hairline rule, 3-line display "THE BEGINNING OF THE END" rising from the bottom [O scroll-01]. Next, a comic-poster card centred on a plain dark field, with a parchment caption box (italic comic type, one bold phrase) and red hand-sprayed marks over the face; later frames add torn-paper stickers [O scroll-03, scroll-05]. Type-in-art is done by captions and stickers on the art, not text over faces.
- Dark story world turns to a flat warm-off-white "FACTS" FAQ section with red caps and hairlines [O scroll-10]: a dark-to-light register shift.

## Typography
- Druk Wide Super / Medium, Tight Spot BB Italic (comic captions), Inter Tight 500/600 [M loaded fonts]. Licensing for any of these is separate; OZONE needs free equivalents.

## Responsive (390px observation)
- No overflow [M]. Hero re-composed to one large portrait, logo above, wordmark overlapping the head; the cast is reduced not scaled [O mobile-0]. h1 not exposed [M null].

## Technical discoveries
- Framer generator marker [M]; no GSAP/Lenis/Three globals [M]. 73 requests, 50 images ~2.8 MB, LCP 1.48 s, CLS 0 [M, single run].

## Useful implementation ideas (original)
- Halftone as a CSS/SVG dot pattern clipped to shadow shapes; shading is only dots and flat black.
- Caption boxes (solid parchment, 1-2 lines, one bold phrase) as the type-in-art device; keeps text legible over illustration.
- Red-on-navy display for statements, off-white for the sourced "facts" end.

## Unknowns / not verified
- How the poster/sticker layers are scrubbed [?]; audio [?]; reduced motion [?].
