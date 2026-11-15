# Typography System — Aster C1 Launch
_Owner: typography-spacing (performed by the orchestrator in this run) · Date: 2026-11-15 · Status: proposed, not yet rendered in a browser_

Evidence labels: [M] measured/verified in this run, [I] inferred, [?] unknown, to verify at build.

## Fonts
Two families, three font files in the latin subset. All free for commercial use (SIL OFL 1.1), self-hosted. No paid font is needed.

| Role | Family | Source | Licence | Weights/axes used | Loading |
|---|---|---|---|---|---|
| Display + the signature number | Newsreader (variable) | npm `@fontsource-variable/newsreader@5.3.0` (design: Production Type, Google Fonts) | OFL-1.1 [M: `npm view` returned `OFL-1.1`; LICENSE file in the tarball is the SIL OFL 1.1] | wght 300-500 (used 300 and 400), opsz 6-72 auto [M: api.fontsource.org axes] | Self-host `newsreader-latin-opsz-normal.woff2` (132 KB [M]). Preload. |
| Text, UI, labels, specs | Geist (variable) | npm `@fontsource-variable/geist@5.3.0` (Vercel) | OFL-1.1 [M] | wght 100-900 [M], used 300, 400, 500 | Self-host `geist-latin-wght-normal.woff2` (29 KB [M]). Preload. |
| Accent / mono | none | | | | Deliberate omission: tabular Geist covers the specs; a third family would break the quiet. |

Total font payload: about 161 KB for the latin subset [M, from file sizes]. `latin-ext` files load only through `unicode-range` when needed (Dutch and English need only `latin`; the euro sign and e/e/i with diacritics are in the latin subset [I], verify the glyph coverage at build).
Cheaper option if the budget tightens: Newsreader `wght`-only file (58 KB [M]) loses optical sizing; at 70-85 px headlines hairlines become heavier. Decision: keep opsz, reconsider after the performance gate.

## Pairing rationale
- Contrast of one variable: serif (warm, literate, drawn) versus neutral technical sans. Everything else is harmonised: both are light-to-regular, low-contrast-extremes, similar colour on the page.
- Newsreader was designed for reading news; its optical-size axis makes a light 70 px headline elegant and a 16 px caption sturdy. That matches a Monocle audience and a "quiet" tone without any ornament.
- Geist is precise and unobtrusive: a "measuring tool" voice for specs and labels, with tabular figures [I: the feature `tnum` is expected in Geist; verify at build].
- Pattern closest in pairings.md: "Soft editorial" without Fraunces' eccentric SOFT/WONK, and without the mono accent. Fraunces was rejected as too warm and quirky for "engineered and quiet".
- Rejected: Inter (the default of the web), Instrument Serif (trend risk, condensed), Bodoni Moda / Playfair (luxury/status), Archivo / Mona Sans width axis (reads automotive/sport), Fontshare faces (ITF FFL says free commercial use but its licence page could not be re-read here, so they are held in reserve, not chosen).
- Check: x-heights differ (Newsreader is smaller), so the two faces are never mixed within one line. The one exception is a label directly beside a heading, which sits on its own line.

## Fluid scale (min viewport 360 -> max 1440)
Generated with `typography-system/scripts/type-scale.mjs --min-base 16 --max-base 18 --min-ratio 1.2 --max-ratio 1.25 --steps -2,7 --space-base 8` [M]. Calm ratio (1.2 to 1.25) because this is a product/editorial page, not a poster. Scale contrast display:body is up to about 1:5 at the top and the single 10.9 kg moment uses step 7 for drama.

| Step | Token | clamp() [M] | px at 360 -> 1440 | Line-height | Tracking | Face / weight | Use |
|---|---|---|---|---|---|---|---|
| -2 | `--step--2` | `clamp(0.6944rem, 0.6859rem + 0.0379vw, 0.72rem)` | 11.1 -> 11.5 | 1.5 | +0.02em | Geist 400 | Legal footnote only. Not for anything the audience must read. |
| -1 | `--step--1` | `clamp(0.8333rem, 0.8111rem + 0.0988vw, 0.9rem)` | 13.3 -> 14.4 | 1.5 | +0.01em; labels +0.10em uppercase | Geist 500 (labels), 400 (captions) | Kickers, captions, spec labels, nav, button text |
| 0 | `--step-0` | `clamp(1rem, 0.9583rem + 0.1852vw, 1.125rem)` | 16 -> 18 | 1.6 | 0 | Geist 400 | Body |
| 1 | `--step-1` | `clamp(1.2rem, 1.1312rem + 0.3056vw, 1.4063rem)` | 19.2 -> 22.5 | 1.4 | 0 | Geist 400 | Lead paragraph under a heading |
| 2 | `--step-2` | `clamp(1.44rem, 1.3341rem + 0.4708vw, 1.7578rem)` | 23 -> 28.1 | 1.2 | -0.01em | Newsreader 400 | Pull quote, sub-heading |
| 3 | `--step-3` | `clamp(1.728rem, 1.5716rem + 0.6952vw, 2.1973rem)` | 27.6 -> 35.2 | 1.15 | -0.01em | Newsreader 400 | H3, feature title; spec figure (Geist 300 tabular) |
| 4 | `--step-4` | `clamp(2.0736rem, 1.8493rem + 0.997vw, 2.7466rem)` | 33.2 -> 43.9 | 1.08 | -0.02em | Newsreader 400 | H2 on small sections, price line |
| 5 | `--step-5` | `clamp(2.4883rem, 2.1734rem + 1.3999vw, 3.4332rem)` | 39.8 -> 54.9 | 1.06 | -0.02em | Newsreader 300 | H2 (section titles) |
| 6 | `--step-6` | `clamp(2.986rem, 2.5508rem + 1.9341vw, 4.2915rem)` | 47.8 -> 68.7 | 1.0 | -0.03em | Newsreader 300 | H1 (hero headline) |
| 7 | `--step-7` | `clamp(3.5832rem, 2.9894rem + 2.6389vw, 5.3644rem)` | 57.3 -> 85.8 | 0.98 | -0.03em | Newsreader 300 | "10.9 kg" only (the signature figure). Used once on the page. |

Overrides to the script's suggestions (which gave lh 1.55/1.35/1.15/1.06 etc.): body 1.6 and lead 1.4 for calm; tracking at steps -2/-1 left at +0.01 to +0.02em.
At 85.8 px the "10.9 kg" figure is about 7 characters wide, around 350 px, comfortably inside a 1440 grid; at 57 px it is about 235 px at 360 viewport (width inside a 320 px content area is fine) [I: estimated from average glyph width, verify].

## Rules
- Measure: body and lead `max-width: 60ch` (inside the 45-75ch range). Pull quote 28ch. H1 at most 14ch wide (e.g. "Ten point nine kilograms." breaks into 2-3 lines by design).
- Optical sizing: `font-optical-sizing: auto` on Newsreader; no manual `font-variation-settings` needed. Weight 300 only at step 5 and above. Below step 5 use 400 (light weights at small sizes fail legibility).
- Case: sentence case everywhere. Uppercase only in `.label` (step -1, Geist 500, tracking +0.10em, max about 24 characters).
- Numerals: Geist `font-variant-numeric: tabular-nums lining-nums` in the spec table and prices. Newsreader's default numerals: force `lining-nums` on "10.9" and verify rendering [?] (oldstyle numerals would look wrong in a measurement).
- Units: non-breaking space between a number and its unit ("10.9&nbsp;kg", "EUR&nbsp;6,200"). Use the euro symbol as in "€6,200" in copy; keep it in the same text run as the number.
- Hanging punctuation: for the pull quote use `text-indent: -0.4em` (Safari-only `hanging-punctuation` is not relied on). Measure per font at build.
- Optical alignment: pull the first letter of the H1 left by about `-0.04em` [I]; measure and record at build.
- Emphasis: weight 500 in Geist, never italic for emphasis, never underline except links. Links: ink colour, 1px hairline underline offset 0.2em, thickness 1px; hover darkens the underline to `--aster`.
- Language: set `lang` on the document. Use `hyphens: auto` on body text only (not headings) so Dutch compounds ("fietsverlichting") do not overflow at 360 px; headings may use `overflow-wrap: anywhere` as a last resort.
- Minimum sizes: body never below 16 px; interactive text never below 13.3 px (step -1 at 360). Touch targets 44 x 44 px (see SPACING_SYSTEM).
- Text on dark (Dusk section): use `--paper` (15.5:1) and `--graphite-muted` (6.8:1); increase body line-height by +0.05 and weight stays 400 (no thinning on dark).

## Fallbacks & metrics overrides (CLS)
Strategy: `font-display: swap` for Geist; for Newsreader (the hero) preload and use `font-display: swap` with a metric-matched fallback so the swap does not shift layout. The override values below are NOT measured; they must be tuned by overlaying fallback and real font in a browser at build.
```css
@font-face { font-family: "Newsreader Fallback"; src: local("Times New Roman"); size-adjust: 100%; ascent-override: 90%; descent-override: 25%; line-gap-override: 0%; } /* [?] starting values, tune */
@font-face { font-family: "Geist Fallback"; src: local("Arial"); size-adjust: 100%; ascent-override: 92%; descent-override: 24%; line-gap-override: 0%; } /* [?] starting values, tune */
--font-display: "Newsreader Variable", "Newsreader Fallback", Georgia, serif;
--font-text: "Geist Variable", "Geist Fallback", system-ui, sans-serif;
```
Preload exactly two files: `newsreader-latin-opsz-normal.woff2` and `geist-latin-wght-normal.woff2`, `crossorigin`. No italic files are loaded (no italic in use).

## Font loading (CSS to land at build)
```css
@font-face { font-family: "Newsreader Variable"; font-style: normal; font-display: swap; font-weight: 200 800;
  src: url("/fonts/newsreader-latin-opsz-normal.woff2") format("woff2-variations");
  unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD; }
@font-face { font-family: "Geist Variable"; font-style: normal; font-display: swap; font-weight: 100 900;
  src: url("/fonts/geist-latin-wght-normal.woff2") format("woff2-variations"); /* same unicode-range */ }
```
(Use the `@font-face` blocks shipped in each package's `opsz.css` / `wght.css`; they hold the authoritative `unicode-range`.) Confirm that the opsz axis is exposed by the shipped `opsz.css` [M: file present in the package].

## Verification status
| Check | Status | Evidence |
|---|---|---|
| Licences (Newsreader, Geist = OFL-1.1) | PASS (registry metadata and bundled LICENSE) | `npm view @fontsource-variable/{newsreader,geist} license` returned OFL-1.1; Newsreader LICENSE read |
| Axes available (opsz, wght) | PASS | api.fontsource.org/v1/variable/{newsreader,geist} |
| Scale values | PASS (generated) | type-scale.mjs output, see table |
| Specimen rendered at 360/768/1440/1920, no overflow of the largest line | NOT TESTED | No page built in this run; do this first when code starts |
| Geist `tnum`, Newsreader `lnum`, euro glyph in subset | NOT TESTED | verify at build |
| Fallback metrics | NOT TESTED | tune by overlay |
