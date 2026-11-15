---
name: Typewolf
url: https://www.typewolf.com/
slug: typewolf
category: typography
tags: [typography, type-inspiration, editorial, serif, curated-gallery, no-javascript, font-pairings, warm-palette]
researched: 2026-11-15
status: inspected
confidence: high
evidence: ../evidence/typewolf/
---

# Typewolf

Claim labels: **[M]** measured (capture.json / devtools) · **[O]** observed in screenshots/behaviour · **[I]** inferred (state the basis) · **[?]** unknown.

## At a glance
Curated "what's trending in type" site: real-site font pairings, font lists, lookbooks. Lesson: a type-led brand page can be almost pure HTML/CSS ([M] 0 scripts captured) and still feel premium through one serif family, restrained colour and generous margins.

## Design characteristics
- Muted dusty-rose page (body background rgb(230,221,222), text rgb(68,50,53)) with white-framed thumbnails [M][O]. Centered masthead, thin rule, small caps nav, two-column card grid [O].
- Each card: framed screenshot, site name left, date right, "FONTS — a, b, c" caption [O]. The caption is the product: pairing data beside the visual.

## Typography
- Loaded faces [M]: DomaineText (body, 16/24px, 400), DomaineDisplayNarrow bold (h2 42px/50.4px, 700), Dia 900 (loaded; likely the wide uppercase nav/captions [I] from the extended caps seen in screenshots; not confirmed by element).
- Wordmark "Typewolf" is a large high-contrast display serif, white on the rose ground [O]; largest measured text is only 24px/36px "What's Trending in Type" [M] (wordmark is likely an SVG/image: 3 svg-type images [M]).
- Fallback stack Georgia, serif [M]. Letter-spacing normal everywhere measured [M].
- Nav links: small, uppercase, tracked, extended sans [O].

## Layout & spacing
- Content column starts x=180 at 1440 wide (h2 box x=180, w=516 [M]); two equal columns with ~32px gutter [O, estimated from screenshot]. Header block is 329px tall [M].

## Navigation
- Static (non-fixed) header, 7 links [M]; five centered text items under a hairline rule [O]. No skip link [M].

## Animation
- None observed in desktop-0 vs desktop-1 beyond scrolling [O]; 0 canvases, 0 videos, 0 scripts [M].

## Scroll
- Native: wheel 600px reached 600 at 16ms [M]; not smoothed.

## Image & video treatment
- 56 images [M]: 46 PNG, 7 JPG, 3 SVG; ~785 KB transferred [M]. White 8px-ish mat around each thumbnail gives a "print proof" feel [O]. Some thumbnails show a typographic placeholder ("Top 50 Most Popular Fonts") [O].

## Responsive (390px observation)
- No horizontal overflow [M]; single column, nav wraps to two centered rows, wordmark scales down [O]. No menu button [M].

## Technical discoveries
- Zero script tags captured, no libraries detected [M]; html class "no-js" [M]. Server-rendered/static markup [I]. Generator not detectable [M].

## Performance (single lab run, indicative only)
- DCL 361ms, load 1464ms, LCP 460ms, CLS 0.004, 60 requests [M].

## Useful implementation ideas (original re-implementations, not copies)
- Caption pattern "FONTS — families" under each specimen: build a pairing-card component with a data-driven caption row.
- Two-face system (text serif + narrow display serif + one wide caps sans for metadata) as a 3-token type scale.
- Use a tinted off-white page with white mats instead of drop shadows.

## Unknowns / not verified
- h1 absent (h1Count 0 [M]) so heading semantics unclear [?]; exact font of the wordmark [?]; hover behaviour [?].
