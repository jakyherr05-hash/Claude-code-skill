---
name: Dropbox Brand Guidelines
url: https://brand.dropbox.com/
slug: dropbox-brand
category: other
tags: [webflow, brand-guidelines, tile-grid-navigation, colour-blocks, scroll-assembled-mosaic, variable-font, native-scroll, light-theme]
researched: 2026-11-17
status: inspected
confidence: medium
evidence: ../evidence/dropbox-brand/
---

# Dropbox Brand Guidelines

Claim labels: **[M]** measured (capture.json / devtools) · **[O]** observed in screenshots/behaviour · **[I]** inferred (state the basis) · **[?]** unknown.

## At a glance
The public brand hub (Webflow) [M], only 2,700 px tall with 1,800 px of scroll range [M]. A white page with hairline grid lines opens with one blue statement; scrolling assembles a mosaic of coloured tiles, each labelled with a guideline category (Framework, Voice & Tone, Logo, Typography, Iconography, Color, Imagery, Motion) [O], and the finished mosaic is also the navigation [I, see below]. Lesson: a brand site where the navigation IS the brand system, expressed in colour blocks and mini glyphs.

## Design characteristics
- Opening: white field with pale blue grid lines, one blue statement top-left, a small logo glyph and a chevron-down hint [O desktop-0, mobile-0].
- Scroll-01: a solid blue tile with white statement text appears at the grid centre, with orange and cyan tiles entering from the edges [O].
- Scroll-02/03: tiles fill the viewport edge to edge: yellow (quote marks), cyan (logo), orange (typography "Aa"), lilac (motion, with a Bézier curve glyph), dark navy (framework, a node diagram), lime (iconography), magenta (imagery, a picture glyph) [O]. Each tile has a label top-left and a bespoke mini illustration [O].
- Cookie banner bottom-left on all captures [O].

## Typography
- Loaded: Atlasgrotesk Web 400/500, a variable Dropbox "sharp grotesk" (weights 250-900, named Dbsharpgroteskvariable Vf), Noto Sans Mono 400/500 [M].
- Opening statement: sharp grotesk 700, 36 px / 43.2 px (1.2), tracking -0.72 px (-2%) [M]. Tile labels 33.6 px; pull quote 30 px [M, filmstrip]. Body 14 px / 20-22 px [M].
- No h1 in DOM (h1Count 0) [M].

## Layout & spacing
- Modular grid with visible hairlines; tile sizes are multiples of the grid unit (one tile spans 2x3 cells in scroll-01) [O]. Nav element is 900 px high, absolute, with 8 links [M]; since the eight link labels match the tile labels the tiles are the navigation [I].
- docHeight 2,700, scroll max 1,800 (frames 03 and 04 both at scrollY 1,800) [M].

## Navigation
- Eight categories as colour tiles; mobile keeps the same mosaic stacked [O]. Webflow menu markup visible in CSS text (`.menu .tile-line`) [M body text].

## Animation
- Webflow interactions class `w-mod-ix` [M]: the tile assembly is probably built with Webflow's scroll-into-view interactions [I]. No GSAP/Lenis detected [M].
- Bézier-curve and node glyphs in tiles look like SVG line art (35 SVGs, 0 images) [M, O]; motion on hover [?].

## Scroll
- Native: wheel 600 reached 600 at 16 ms [M]; `likelySmoothed` false [M]. Filmstrip (step 765 px, 5 frames) shows the assembly: statement (00), blue tile (01), mosaic filling (02), full mosaic (03, 04 identical because scroll ended) [M, O].

## Image & video treatment
- No raster images or video; flat colour, SVG glyphs [M, O].

## Responsive (390px observation)
- No overflow [M]; statement set at ~20 px largest text [M] on a vertical grid with the logo and chevron below [O]. Tablet portrait similar with more white space [O].

## Technical discoveries
- Webflow (generator meta "Webflow" and runtime chunks), Google WebFont loader [M]; a console error from a cross-origin metrics call [M].

## Performance (single lab run, indicative only)
- DCL 726 ms, load 3,539 ms, CLS 0.234, LCP not reported [M]; 15 requests, scripts ~16 KB [M].

## Useful implementation ideas (original re-implementations, not copies)
- Make the navigation the hero: a grid of category tiles that assemble on scroll, each with a tiny bespoke diagram.
- Expose the underlying grid with hairlines so the layout system is itself an element of the brand.
- Colour as structure: one saturated colour per category, text in one grotesk, line illustrations in the tile's contrasting colour.
- Keep the page short; show the whole system in under three screens.

## Unknowns / not verified
- Deeper guideline pages; hover and open states of tiles; how interactions are authored [?].
