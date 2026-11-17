---
name: The FWA
url: https://thefwa.com/
slug: thefwa
category: gallery
tags: [award-gallery, dense-grid, mono-labels, geist, light-theme, native-scroll, black-panels, yellow-accent, editorial-ui]
researched: 2026-11-17
status: inspected
confidence: medium
evidence: ../evidence/thefwa/
---

# The FWA

Claim labels: **[M]** measured (capture.json / devtools) · **[O]** observed in screenshots/behaviour · **[I]** inferred (state the basis) · **[?]** unknown.

## At a glance
The long-running digital-design awards site (title "The FWA — Digital design awards since 2000") [M], re-skinned in 2026 as a dense "terminal/editorial" interface: black header with a pixel-style logo, mono uppercase section labels with `//` prefixes, a hero card with a yellow status strip, black side rails and a grid of latest winners [O]. Lesson: an information-dense gallery can feel premium through restrained black / paper / yellow colour, mono micro-labels and consistent card anatomy.

## Design characteristics
- Palette: paper grey rgb(243,244,246) page, near-black text rgb(22,22,22), black panels, yellow strip on the hero card [M, O].
- Card anatomy: date line, title with ↗ arrow, "BY studio", small status chips, short blurb, [WEBSITE] tag in mono [O scroll-03, scroll-06].
- Black rails on the right hold "Submission portal", "The Wire", "Latest" and a book promo [O desktop-0].
- A one-line cookie notice at the bottom states the site sets no cookies of its own [O].

## Typography
- Loaded: Geist 400/600, Geist Mono 400/500 [M].
- h2 "Latest winners" 24 px, weight 700 [M]. Card titles 28.8 px (hero) / 16 px, weight 600, tracking -0.86 px (-3%) on the hero title [M]. Body 15 px / 23.25 px (1.55) [M]. Mono labels at small size, uppercase [O].
- No h1 (h1Count 0) [M].

## Layout & spacing
- docHeight 5,038 px (~5.6 viewports) [M]; 5 sections, 97 images (68 WebP, 14 JPG, 6 PNG), 212 links, 1 canvas 611x30 [M] (purpose [?]; possibly the striped bar in the card [I]). Header sticky 66 px with 10 links [M].
- Three-column desktop: wide main cards, narrow black rails; mobile single column [O].

## Navigation
- Winners / Profile_log / Editorials / Artwork / Live judging / Framed / Loom / Submit as mono caps, with filters row (category, show, search) [O]. On scroll a "View Source" bar replaces the strip at top-right (scroll-03..06) [O].

## Animation
- Minimal; hero card has carousel dots and a play control; audio-log player [O]. No animation library detected [M].

## Scroll
- Native: wheel 600 reached at 100 ms [M]; `likelySmoothed` false [M]. Filmstrip (step 765 px; 8 frames, max scrollY 4,138 of 5,038) covers hero, winners grid, footer [M, O].

## Image & video treatment
- Small autoplaying thumbnails (static in capture); cards use 16:10 crops; WebP-heavy [M, O].

## Responsive (390px observation)
- No overflow [M]; header collapses to hamburger; the hero card stacks above the cards, cookie bar sits above the fold bottom [O mobile-0, tablet-portrait-0].

## Technical discoveries
- No libraries detected; Geist fonts [M]. The site is data-driven, not an animated showcase [I].

## Performance (single lab run, indicative only)
- DCL 1,528 ms, load 2,852 ms, LCP 2,796 ms, CLS 0.163 [M]; 128 requests, images ~4.5 MB [M].

## Useful implementation ideas (original re-implementations, not copies)
- Dense editorial UI via a mono micro-label system (uppercase, `//` or bracket prefixes) alongside a clean grotesk for titles.
- Repeatable card anatomy (date, title ↗, byline, chips, blurb, tag) so 12-30 cards stay scannable.
- Black rails against a paper page for secondary actions.
- Give each section a "live" element (counter, audio strip, "judging now") to signal activity.

## Unknowns / not verified
- Hover previews, filter behaviour, detail-page layouts; award-date metadata for any listed site is not recorded here [?].
