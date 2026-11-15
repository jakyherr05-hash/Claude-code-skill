---
name: typography-system
description: Premium typography and spacing systems for websites — font discovery and pairing with verified licences (Google Fonts/Fontsource OFL, Fontshare ITF FFL, commercial foundries), variable font axes (wght, opsz, wdth, SOFT…), fluid clamp() type scales, line-height and tracking curves, optical alignment, self-hosted font loading without CLS, grids, containers, vertical rhythm and section spacing. Use whenever choosing fonts, building a type scale or spacing tokens, fixing typography that looks cheap or cramped, or configuring web font loading.
---

# Typography & spacing system

Type is the voice of the site; space is its breathing. Both must be **systems** — tokens derived from rules — so the site stays coherent as it grows.

## 1. Choose fonts from personality, then verify licence

1. Take the type personality from CREATIVE_DIRECTION.md (e.g. "patient, crafted, a little eccentric").
2. Shortlist from `references/font-library.md` (verified-licence catalogue grouped by voice) and pairing patterns in `references/pairings.md`. The library is a starting point, not a boundary — use Typewolf, Fontshare, Google Fonts or a foundry when the brief needs it.
3. **Verify licence before committing** (and record source + licence in TYPOGRAPHY_SYSTEM.md):
   - Google Fonts / Fontsource: check `npm view @fontsource-variable/<slug> license` (expect `OFL-1.1`) — OFL allows commercial use, embedding and self-hosting.
   - Fontshare: `curl -s "https://api.fontshare.com/v2/fonts?limit=200"` → `license_type` (`itf_ffl`). Self-host the files downloaded from Fontshare; don't redistribute them as a font product.
   - Adobe Fonts: only via the user's Creative Cloud web project (their subscription) — never copy files.
   - MyFonts / foundries: requires a purchased web licence, usually priced by pageviews. Flag cost to the user; never assume.
4. Test the candidates *rendered* (specimen page at 360 and 1440) with real headline copy — glyph shapes in the actual words decide more than any catalogue description.

## 2. Build the scale

```bash
node scripts/type-scale.mjs --min-base 16 --max-base 19 --min-ratio 1.2 --max-ratio 1.333 --steps -2,8
```

Outputs `--step-*` clamp() tokens with suggested line-height/tracking per step and a fluid `--space-*` scale. Choose ratios by language: editorial/luxury want dramatic top ends (max ratio 1.333–1.5); product/corporate want calmer (1.2–1.25).

Rules:
- Body text 16–20px, measure 45–75ch (`max-width: 65ch`).
- Tighten tracking and leading as size grows (display −0.02 to −0.04em, lh 0.9–1.05); open tracking on small uppercase labels (+0.06 to +0.14em).
- Use `font-optical-sizing: auto` on opsz fonts; set `font-variation-settings` only for custom axes (SOFT, WONK, GRAD) and keep them in tokens.
- Numerals: `font-variant-numeric: tabular-nums` in data/specs, oldstyle in editorial prose if the font supports it.
- Hanging punctuation for large quotes (`hanging-punctuation: first` is Safari-only — use a negative text-indent fallback).
- Display lines must survive 360px — test the longest real word at the smallest clamp.

## 3. Build the space

`references/spacing-grid.md` covers base units, grids, containers and section rhythm with ready CSS. In short: one fluid spacing scale for everything; a 12-column grid (4 on mobile, 8 on tablet) with fluid gutters; 2–3 container widths; section padding from the top of the scale; and planned "empty" moments.

## 4. Load fonts without hurting LCP/CLS

- Self-host WOFF2 (Fontsource packages or downloaded files). Variable fonts reduce request count when ≥ 3 weights are used.
- `font-display: swap` for text; for a hero display face that would visibly swap, preload exactly that file (`<link rel="preload" as="font" type="font/woff2" crossorigin>`), nothing else.
- Subset by `unicode-range` (Fontsource ships latin/latin-ext splits automatically).
- Define a metric-matched fallback to cut layout shift:
  ```css
  @font-face { font-family: "Display Fallback"; src: local("Times New Roman"); size-adjust: 104%; ascent-override: 92%; descent-override: 24%; line-gap-override: 0%; }
  --font-display: "Fraunces Variable", "Display Fallback", serif;
  ```
  Tune the overrides by overlaying fallback and real font in a browser.

## Output
TYPOGRAPHY_SYSTEM.md and SPACING_SYSTEM.md filled; `src/styles/tokens.css` containing font stacks, type and space tokens; a specimen screenshot at 360/1440 you have opened and checked.
