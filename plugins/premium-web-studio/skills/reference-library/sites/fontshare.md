---
name: Fontshare
url: https://www.fontshare.com/
slug: fontshare
category: typography
tags: [typography, font-library, free, itf, variable-fonts, specimen, grid-layout, light, resource]
researched: 2026-11-15
status: inspected
confidence: high
evidence: ../evidence/fontshare/
---

# Fontshare

Claim labels: **[M]** measured (capture.json / devtools) · **[O]** observed in screenshots/behaviour · **[I]** inferred (state the basis) · **[?]** unknown.

## At a glance
Free-font service from Indian Type Foundry (ITF). Pale butter-yellow page, thin-ruled grid, every family previewed as a very large live-editable specimen line. Lesson: letting the type be the content - one giant specimen per row, controls as quiet hairline UI.

## Design characteristics
- Background rgb(255,255,227), black text, html classes `light yellowTheme` [M]; a theme toggle (yellow / contrast dot controls) at right of filter bar [O].
- 1px hairline rules form a table-like grid: header cells, filter row, framed specimen cards [O]. Muted grey for inactive controls, black for active [O].
- Hover/selected row gets a darker 1px border and reveals weight/size sliders [O].

## Typography
- UI face: Passenger-Sans (100-900 variable) [M]. Specimens load as the families themselves: `_Satoshi_Variable`, `_Clash_Display_Variable`, `_General_Sans_Variable` [M].
- Largest text: "Satoshi" specimen 120px / line-height 144px (1.2), weight 400, normal tracking [M]. Size slider shows "120px" [O].
- Nav links 16px/19px weight 500 [M]; body 10px/11.5px [M] (very small meta text, a11y concern [I]).
- Mobile largest text 60px [M].

## Layout & spacing
- Header 160px tall (logo + 3 tab cells + hamburger + "No styles selected" cell) [M/O]. Content inset ~28px from edges; specimen cards ~900px tall-ish rows with ~25px internal padding [O].
- Row meta: "10 styles / Variable / Closed Source" right-aligned, designer left-bottom [O]. (The "Closed Source" label is shown on the site [O]; how it relates to the API licence type is [?].)

## Navigation
- Header tabs: Fonts (100), Pairs (59), Licenses [M text]. Filter bar: search, categories, properties, personality, Cities/Excerpts/Names preview modes, list/grid view, sort (New/Popular/Hot/Alphabetical) [O]. Floating back-to-top button [O].
- Mobile: logo, selection counter "0", search, hamburger [O].

## Animation
- Sliders and text editing are live; no decorative animation seen [O]. Page-level motion [?].

## Scroll
- Wheel 600px: scrollY stayed 0, docHeight 900 [M]. The screenshot after the wheel shows content moved, with the filter bar stuck at the top, so an inner scroll container (app-style) is consistent [I] - native document scroll is not used.

## Image & video treatment
- 0 images, 39 SVG icons [M]; the content is live text.

## Responsive (390px observation)
- Single column; specimens drop to 60px; controls collapse into hamburger/search [O/M]. No overflow [M].

## Technical discoveries
- React-style SPA (the `noscript` text "Enable javascript to use this application" in body [M]; framework name [?]). No animation libraries detected [M]; 6 scripts [M].

## Performance (single lab run, indicative only)
DCL 1023ms, load 1446ms, LCP 2288ms, CLS 0, 22 requests [M].

## Using this resource in the studio
- Licensing facts [M]: `https://api.fontshare.com/v2/fonts` (checked 2026-11-15) lists 100 fonts; `license_type` is `itf_ffl` for 64 and `sil_ofl` for 36. So licences are mixed - read the per-family licence before use; the "ITF Free Font License" terms were not read in this run [?].
- Obtaining: download kits on each family page, or hotlink CSS from `https://api.fontshare.com/v2/css?f[]=satoshi@1&display=swap`, which returned `@font-face` rules pointing to `cdn.fontshare.com` woff2 files [M]. Self-hosting the downloaded woff2 files is the studio default; whether the ITF licence permits it for a given client project must be confirmed [?].
- Practice: prefer variable files; subset; check for a licence PDF in the download and archive it with the project [I].

## Useful implementation ideas (original re-implementations, not copies)
- Specimen row: one contenteditable element with `font-size` bound to a range input via a CSS variable; weight slider binds `font-variation-settings`.
- Hairline grid: CSS grid with `border: 1px solid color-mix(in srgb, currentColor 15%, transparent)` and no gaps.

## Unknowns / not verified
- Licence text, Pairs and Licenses pages, per-family download behaviour.
