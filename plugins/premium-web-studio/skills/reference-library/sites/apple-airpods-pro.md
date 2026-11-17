---
name: Apple AirPods Pro 3
url: https://www.apple.com/airpods-pro/
slug: apple-airpods-pro
category: other
tags: [apple, product-page, sticky-local-nav, video-scrub, big-statement, sf-pro, minimal, light-theme, native-scroll, large-photography]
researched: 2026-11-17
status: inspected
confidence: medium
evidence: ../evidence/apple-airpods-pro/
---

# Apple AirPods Pro 3

Claim labels: **[M]** measured (capture.json / devtools) · **[O]** observed in screenshots/behaviour · **[I]** inferred (state the basis) · **[?]** unknown.

## At a glance
Apple's product page for AirPods Pro 3 (title "AirPods Pro 3 - Apple") [M]: native-scrolled, 28,936 px tall (~32 viewports) [M], built from alternating full-width white statement sections and large photo/video tiles. Lesson: restraint. One 96 px statement, one small eyebrow label, one product image per beat, with no scroll smoothing at all.

## Design characteristics
- Light theme: white background rgb(255,255,255), text rgb(29,29,31) [M]. Hero is a dancer silhouette against a pale gradient with the headline bottom-left and a $ price + blue "Buy" pill bottom-right [O desktop-0].
- After the hero a thin sticky local nav ("AirPods Pro 3" + Overview / Hearing Health / Tech Specs / Compare + blue Buy) stays at top of every frame [O scroll-01..08].
- Each chapter: small eyebrow (e.g. "Audio performance", "All-day battery life"), a two-line centred headline, a short paragraph, then a product render cropped by the section edge [O scroll-01, 02, 06].
- Full-bleed photographic breaks (dark skin-toned portrait on white, scroll-03) interrupt the white rhythm [O].
- A horizontally scrolling card carousel and a three-card values grid appear near the end [O scroll-08].

## Typography
- SF Pro Display 600 (headlines), SF Pro Text 400/600, SF Pro Icons [M].
- Hero statement 64 px / 68 px (1.06), tracking -0.576 px (-0.9%), weight 600 [M]. Chapter headlines 96 px, 56 px and 28 px [M, filmstrip]. Body 17 px / 25 px, tracking -0.374 px [M].
- Everything in one family; hierarchy via size and weight only [M, O].

## Layout & spacing
- Global nav 44 px high, 234 links (mega-menu) [M]. 18 sections, 102 images, 16 videos, 0 canvases [M].
- Centred single column for statements; wide cards constrained to a max width with large gutters [O].

## Navigation
- Two-tier: global bar, then a sticky product bar with Buy [O]. Mobile: icons for search and bag plus hamburger [O mobile-0].

## Animation
- Videos (hero `large.mp4` etc.) are present but not autoplaying at capture, with several having no `src` yet (lazy) [M]. Scroll-linked video/image sequences are plausible but not verified [?].
- Filmstrip shows 1-2 large sticky elements per frame; no `.pin-spacer` [M].

## Scroll
- No smoothing: wheel 600 jumps 0 at 16 ms then 600 at 100 ms [M]; `likelySmoothed` false [M]. No Lenis/GSAP detected [M].
- Filmstrip (step 3,115 px of ~28,936-29,051) covers the page: hero (00), noise-control (01), audio (02), photo (03), heart-rate (04), carousel (05), battery (06), explore (07), values (08), footer links (09) [M, O].

## Image & video treatment
- Studio-lit renders on white or pale gradient; large photographic crops with dark silhouettes; iridescent ring patterns in the mobile hero [O]. Transfer: images ~7.7 MB, video ~7.3 MB, scripts ~0.97 MB in this run [M].

## Responsive (390px observation)
- No overflow [M]; the headline stacks to four lines, h1 reads 21 px (the eyebrow) with the largest text 28 px [M]; the price and Buy sit under the statement; hero image becomes a tall crop [O]. Tablet portrait similar with a bottom-left statement [O].

## Technical discoveries
- No third-party animation globals detected [M]; custom Apple stack with html classes such as `inline-media`, `enhanced`, `no-touch` [M]. `libraryHints` empty [M].

## Performance (single lab run, indicative only)
- DCL 1,560 ms, load 2,309 ms, LCP 1,268 ms, CLS 1.007 [M]; 130 requests [M]. The CLS figure is high for a page this stable, so it may reflect late sticky-nav or media insertion in the lab run [I].

## Useful implementation ideas (original re-implementations, not copies)
- The "eyebrow + two-line statement + one object" chapter module repeated with identical rhythm; consistent rhythm lets each image carry the novelty.
- A sticky local nav with a persistent purchase action as soon as the hero leaves.
- Headlines at 96 px with slightly negative tracking in a neutral grotesk; weight 600, no ornament.
- Crop the product at the section edge to imply continuation into the next beat.
- Lazy-attach video sources until near the viewport.

## Unknowns / not verified
- Any scroll-scrubbed media; exact scroll-trigger mechanism; interaction of the carousel [?].
