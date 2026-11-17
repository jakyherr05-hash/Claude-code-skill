---
name: Scrollytelling.ai (scrolling-websites guide)
url: https://scrollytelling.ai/scrolling-websites/
slug: scrollytelling-ai
category: other
tags: [reference-list, scroll-effects-taxonomy, article, dark-theme, inter, sticky-toc, gif-previews, no-js-library, research-pointer]
researched: 2026-11-17
status: inspected
confidence: medium
evidence: ../evidence/scrollytelling-ai/
---

# Scrollytelling.ai (scrolling-websites guide)

Claim labels: **[M]** measured (capture.json / devtools) · **[O]** observed in screenshots/behaviour · **[I]** inferred (state the basis) · **[?]** unknown.

## At a glance
A text-led article page ("Best Scrolling Websites (2026): 16 Examples by Scroll Effect") from a scrollytelling builder, updated "November 11, 2026" per the page [M title, O]. It is not an immersive site. Its value to the studio is the taxonomy of scroll effects and a candidate list of examples: it sorts 16 sites by the effect (scroll-scrubbed video, parallax layers, pinned sections, horizontal scroll, scroll-triggered reveals, long single page, 3D scenes, scrolljacking) [O sticky table of contents, headings]. The effects, a short "worth copying" and "watch out for" note per example, and performance figures from PageSpeed are on the page [O]; we have not verified any of those claims [?].

## Design characteristics
- Dark neutral page (bg rgb(10,10,10), text rgb(212,212,212)) with a sticky nav and a right-hand sticky card listing the eight effects, "Make one" links and "More examples" links [M, O].
- A summary table ("Eight scroll effects at a glance": Effect / What the scroll does / Use it for / Examples below) [O scroll-00 text].
- Each example has a numbered h3 (e.g. "1. Lunar", "4. SBS The Boat", "6. AVATR Vision", "8. Melvin Winkeler", "11. Adidas Annual Report 2024", "13. YES NOW", "15. BMW Group Report 2025") with a looping GIF preview and structured copy labelled "What the scroll does", "Worth copying", "Watch out for" [M headings, O frames].

## Typography
- Loaded: Inter 400/500/600/700 [M].
- h1 44 px / 55 px (1.25), tracking -0.88 px (-2%), weight 700 [M]. h2 30.4 px / 38 px, tracking -0.3 px [M]. Example h3 20.8 px [M]. Body 17-18.4 px / 28.9-31.3 px (1.7) [M].

## Layout & spacing
- docHeight 23,326 px [M]; no `section` elements, 97 links, 17 images (16 GIF + 1 WebP) [M]. Two-column article with a sticky aside; sticky 69 px nav [M]. No pinned layers (0) in any filmstrip frame [M].

## Navigation
- Templates, Widgets, Guides, Tools, and a white "Create Your Story" button; mobile hamburger [O].

## Animation
- None beyond GIF previews [M, O]. No GSAP/Lenis detected [M].

## Scroll
- Native: wheel 600 reached at 16 ms [M]. Filmstrip (step 2,492) covers the page: intro and table (00), examples 1-13 (01-06), 15 (07), templates and FAQ (08), CTA (09) [M, O].

## Image & video treatment
- Silent looping GIF previews per example (16 GIF) [M]; they are the only way the page shows motion [O].

## Responsive (390px observation)
- No overflow [M]; the sticky aside drops out and the article becomes one column; h1 33.6 px [M, O].

## Technical discoveries
- Inter, gtag and a Google Ads conversion script [M]; no site JS library hint [M].

## Performance (single lab run, indicative only)
- DCL 359 ms, load 1,329 ms, LCP 380 ms, CLS 0 [M]; 30 requests [M].

## Useful implementation ideas (original re-implementations, not copies)
- Reference format worth copying for our own library: a fixed vocabulary of scroll effects, one row per effect with "use it for", and per-example "worth copying / watch out for".
- A sticky table of contents keyed to the taxonomy for long reference pages.
- Always attach a measured performance caveat to each recommended effect.

## Unknowns / not verified
- Accuracy of listed examples and numbers; the linked sites (research candidates: Lunar, SBS The Boat, AVATR Vision, Melvin Winkeler, Adidas Annual Report 2024, YES NOW, BMW Group Report 2025) [?].
