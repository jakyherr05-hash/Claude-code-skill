# Typography System — OZONE — "Your Ink"
_Owner: typography-spacing · T5 · 2026-11-18 · Replaces the 2026-11-17 "Clear Air" system (git history). Spacing lives in SPACING_SYSTEM.md._

## 1 · Decisions in one screen
| Role | Family | Axes used | Where |
|---|---|---|---|
| Display (headlines, wordmark, S7 lines) | **Bricolage Grotesque Variable** | `wght` 500–800, `wdth` 75–100 (`opsz` is fixed at its default, 96, in the shipped file, which is the display cut) | Line 1 = wdth 75 / wght 800 (condensed, heavy). Line 2 = wdth 100 / wght 500 (expanded, light). |
| Text (captions, UI, loader, back matter, source tags) | **Atkinson Hyperlegible Next Variable** | `wght` 400–700 | Captions 400, light-on-dark 450, UI labels 600, buttons 700 |
| Mono | **Dropped.** | – | See decision D1. |

Why this pairing: Bricolage's ink traps and slightly irregular counters give the "inked, lettered by hand" read the concept needs, and its `wdth` axis gives a condensed poster cut (long words like SOMEWHERE and EXCEPTIONS fit 320 px) and an expanded cut for the quieter line 2, so one family covers "condensed/expanded". Archivo has a wider wdth range (62–125) but no ink character and its wdth file is 90 KB. Atkinson Hyperlegible Next was designed for distinguishable letterforms (I/l/1, 0/O), which suits "IDs", ages and a teen audience on small screens.

**D1 · No mono.** Atkinson Hyperlegible Next ships `tnum` (verified in the font's GSUB), so `03 / 07`, `%` and dates align without a mono. JetBrains Mono costs 40.4 KB (would take first load to 152.6 KB, over budget) and its `calt` ligatures are a character-reveal risk. UI labels are Atkinson 600, caps, +8 % tracking, tabular. Reversible: if the client wants a mono voice for UI, load `@fontsource-variable/jetbrains-mono@5.3.0` `wght` latin lazily after ENTER (40 KB, `font-feature-settings: "calt" 0`), not in first load.

## 2 · Licence and source (verified 2026-11-18)
Self-hosted from Fontsource; copy the files out of `node_modules` into `public/fonts/` (hashed names by the bundler are fine). Include each package's `LICENSE` in the credits.

| Package | `npm view <pkg> license version` | Upstream |
|---|---|---|
| `@fontsource-variable/bricolage-grotesque` | `license = 'OFL-1.1'` · `version = '5.3.0'` | The Bricolage Grotesque Project Authors (Copyright 2022), OFL-1.1 text in package |
| `@fontsource-variable/atkinson-hyperlegible-next` | `license = 'OFL-1.1'` · `version = '5.3.0'` | Braille Institute / Applied Design Works, OFL-1.1 |
| `@fontsource-variable/jetbrains-mono` (evaluated, not used) | `license = 'OFL-1.1'` · `version = '5.3.0'` | JetBrains, OFL-1.1 |
| `@fontsource-variable/archivo` (evaluated, not used) | `license = 'OFL-1.1'` · `version = '5.3.0'` | Omnibus-Type, OFL-1.1 |

Install exact: `npm i -E @fontsource-variable/bricolage-grotesque@5.3.0 @fontsource-variable/atkinson-hyperlegible-next@5.3.0`. OFL-1.1 permits commercial use, embedding and self-hosting. No files are modified (no subsetting of our own), so no Reserved Font Name issue. Cost: 0.

## 3 · Files, subset, budget
Only the **latin** files are declared (Fontsource's own latin/latin-ext split, `unicode-range`). Do not import the package `index.css` (it declares every subset, and for Bricolage the `standard` all-axes file is 131 KB). Use the `wdth` file for Bricolage (wght + wdth, opsz pinned at 96).

| File | Bytes | Preload | First paint |
|---|---|---|---|
| `bricolage-grotesque-latin-wdth-normal.woff2` | 78,156 | yes | yes (wordmark in loader stage 4, every headline) |
| `atkinson-hyperlegible-next-latin-wght-normal.woff2` | 33,996 | yes | yes (loader %, ENTER prompt, captions) |
| **First load total** | **112,152 B (109.5 KiB)** | | **Budget 150 KB: PASS, 37.8 KB spare** |
| latin-ext files (both) | 31.9 + 19.1 KB | no | Only requested if a glyph outside latin appears; none planned |
| Italic files | – | not declared | No italics in the design |

Glyph coverage checked in the shipped latin files: ’ – — · / % & present. **U+2192 → is missing in both fonts** (the latin range lists only U+2191/2193). The `ENTER WITH SOUND →` arrow must be an inline SVG (frontend), not a character.

Preloads (the only two):
```html
<link rel="preload" as="font" type="font/woff2" crossorigin href="/fonts/bricolage-grotesque-latin-wdth-normal.woff2">
<link rel="preload" as="font" type="font/woff2" crossorigin href="/fonts/atkinson-hyperlegible-next-latin-wght-normal.woff2">
```
`font-display: swap` on both. The loader's real-progress meter should include `document.fonts.load()` for `800 1em Bricolage Grotesque Variable` and `400 1em Atkinson Hyperlegible Next Variable`, so the story never shows a swap (the loader holds S1 invisible until they resolve; with `swap` plus the fallbacks below nothing shifts if they are late).

### Metric-matched fallbacks (measured, not guessed)
Measured in Chromium against Arial (Liberation Sans on this machine is metric-identical): the width of the real headline strings at the real weights/widths vs Arial Bold, and of caption text vs Arial Regular.
| Fallback | size-adjust | ascent / descent / line-gap | Basis |
|---|---|---|---|
| Ozone Display Fallback (Arial Bold) | 72.2 % | 128.8 % / 37.4 % / 0 % | 5061 px vs 7014 px for the headline sample at 100 px; Bricolage asc 930, desc 270 (upm 1000) |
| Ozone Text Fallback (Arial) | 99.2 % | 99.2 % / 31.9 % / 0 % | 5794 vs 5841 px; Atkinson asc 984, desc 316 |

The display fallback is a large correction because Arial Bold has no condensed cut; it keeps line count and height stable, not the glyph look. Expect a visible swap if the font is late, never a layout shift. In the specimen both fallbacks and both real faces loaded with no layout overflow.

## 4 · Variable axis configuration
- Do not rely on the `font-weight` shorthand alone for width: set `font-stretch: 75%` (line 1) and `100%` (line 2) explicitly. `font-stretch` maps to `wdth` in both browsers' variable handling.
- `font-optical-sizing: auto` on body (inert for Bricolage-wdth, which has no opsz; harmless).
- No custom axes. No `font-variation-settings` needed, so the cascade stays predictable under GSAP.
- Ligatures: neither face has `liga`/`dlig` (GSUB features: ccmp, dnom, frac, locl, numr, pnum, tnum). Even so set `font-variant-ligatures: none` and `font-kerning: normal` globally. SplitText: split by chars/words/lines on the real text; kerning pairs are lost across char spans, so for line 1 animate **by line mask or by word**, and use chars only for short strings (OZONE, DON’T START.). If chars are used, set `font-kerning: none` on the split element in both states so there is no jump when the split reverts.
- `hanging-punctuation: first` is set but is Safari-only; no quotes open any line, so no fallback is needed.
- Numerals: `font-variant-numeric: tabular-nums` on counter, loader %, source tags.

## 5 · Fluid scale 320 → 1920
Generated by the studio script (text/step scale):
```
node scripts/type-scale.mjs --min-vw 320 --max-vw 1920 --min-base 18 --max-base 20 --min-ratio 1.2 --max-ratio 1.333 --steps -2,8 --space-base 8
```
```css
/* Fluid type scale: 18px@320 → 20px@1920, ratio 1.2 → 1.333 (generated by type-scale.mjs) */
--step--2: clamp(0.7035rem, 0.7968rem + -0.0778vw, 0.7813rem); /* 12.5→11.3px */
--step--1: clamp(0.9375rem, 0.9375rem + 0.0002vw, 0.9377rem); /* 15.0px */
--step-0: clamp(1.125rem, 1.1rem + 0.125vw, 1.25rem); /* 18.0→20.0px · lh 1.35 */
--step-1: clamp(1.35rem, 1.2867rem + 0.3163vw, 1.6663rem); /* 21.6→26.7px */
--step-2: clamp(1.62rem, 1.4998rem + 0.6011vw, 2.2211rem); /* 25.9→35.5px */
--step-3: clamp(1.944rem, 1.7407rem + 1.0167vw, 2.9607rem); /* 31.1→47.4px */
--step-4: clamp(2.3328rem, 2.01rem + 1.6139vw, 3.9467rem); /* 37.3→63.1px */
--step-5 … --step-8  /* generated, not used: the story's headline sizes are the bespoke tokens below */
```
Only `--step-0` (caption/body) and `--step-1…3` (back-matter headings) are used from the script. `--step--2` (11–12 px) is **not used** (below the 14 px floor); `--step--1` is not used either. The script's suggested tracking (-0.035em at display) is overridden: CD §2 sets display tracking 0 to +1 %, and a tight negative tracking on heavy all-caps closes counters.

### Display tokens (bespoke, fitted to the real copy)
A single linear clamp cannot satisfy both the full-width mobile layout and the 5-of-12-column desktop headline zone (width 380 px at 1024 vs 358 at 390), so the display tokens use two curves meeting at 1024 (`64rem`), with no jump at the join.

| Token | 320 | 390 | 768 | 1024 | 1440 | 1920 | Role |
|---|---|---|---|---|---|---|---|
| `--t-hero` | 52 | 56 | 80 | 96 | 150 | **192 (cap)** | S5 line 1: largest type in the story |
| `--t-d1` | 48 | 52 | 73 | 88 | 120 | 150 (cap) | S7 DON’T START. (second largest) and S6 OZONE |
| `--t-h1` | 44 | 47 | 63 | 72 | 88 | 106 | Line 1 of S1–S4 |
| `--t-h2` | 24 | 25 | 34 | 39 | 48 | 58 (cap 60) | Line 2 (≈ 0.5× line 1, S5 `hero` line 2 stays at h2) |
| `--t-d2` | 26 | 28 | 36 | 42 | 52 | 63 (cap 72) | S7 "PROTECT YOUR FUTURE." |
| `--t-0` caption/body | 18 | 18.1 | 18.6 | 18.9 | 19.4 | 20 | Caption boxes, back matter, loader prompt |
| `--t-label` | 14 | 14 | 14.2 | 14.4 | 14.8 | 15 | UI labels, source tags |

Ratios at 1440: hero : h1 : h2 = 150 : 88 : 48. The dramatic changes are hero vs h2 (3.1×) and S5 vs everything else; the display size caps at 192 px at 1920, since the camera shows more bleed rather than larger type.

### Per-step line-height, tracking, weight
| Style | Font / axes | Size token | Line-height | Tracking | Notes |
|---|---|---|---|---|---|
| Line 1 (all scenes) | Display 800, wdth 75 | h1 / hero / d1 | **0.92** (CD 0.9–0.95) | +0.005em | `text-wrap: balance`; no lone last word; written case |
| Line 2 | Display 500, wdth 100 | h2 / d2 | 1.08 | 0 | `text-wrap: balance`; colour per scene (Y/R/O/B) |
| Caption box | Text 400, 18–20 px | `--t-0` | 1.4 | 0 | black on paper; max 34ch |
| Light text on dark (loader prompt, S6 caption on black) | Text 450 | `--t-0` | 1.45 | +0.005em | slight weight lift against halation |
| Back-matter body | Text 400 | `--t-0` | 1.55 | 0 | 62ch measure |
| Back-matter heading | Display 700, wdth 87 | `--step-3` | 1.05 | 0 | sentence case as written |
| UI label (`03 / 07`, SOUND ON/OFF, skip) | Text 600 | `--t-label` | 1.3 | **+0.08em** | tabular; written in caps in the markup, not via `text-transform` |
| Buttons (ENTER WITH SOUND, CONTINUE WITHOUT SOUND) | Text 700 | 16–18 px (`--step-0`) | 1.2 | +0.06em | min target 44 px |
| Source tag / URL | Text 500 | `--t-label` | 1.4 | +0.02em | `overflow-wrap: anywhere` for URLs |

Never `text-transform: uppercase` on client copy. The headline strings are stored in their supplied case ("IDs" stays "IDs"; ’ in ISN’T, DON’T). UI labels are typed as caps strings in the source for the same reason, so that nothing in the stylesheet can print "IDS". Specimen check: "IDs" renders with a lowercase s in both display and text faces at every viewport.

### Measure
Headlines are bounded by their column span, not ch. Caption boxes max-width 34ch (≈ 305–340 px at 18–20 px; also the CD ≥1920 rule, applied at all sizes, min-width `min(34ch, 100%)`). Back matter 62ch. Loader/prompt copy 40ch.

### Minimum column spans for line 1 in ≤ 3 lines (measured in Chromium, real copy, real fonts)
| Viewport (cols) | S1 | S2 | S3 | S4 | S5 (hero) | S6 | S7 |
|---|---|---|---|---|---|---|---|
| 390 (4) | 3 | 3 | 3 | 3 | **4** (3 lines at full width) | 2 | 2 |
| 768 (8) | 4 | 4 | 3 | 4 | 6 | 3 | 3 |
| 1024 (12) | 5 | **6** | 4 | **6** | 8 | 4 | 4 |
| 1440 (12) | 5 | 5 | 4 | **5** | 9 | 3 | 3 |
| 1920 (12) | 4 | 4 | 3 | 4 | 8 | 3 | 3 |

Flag for ui-ux: CD §4 gives S4 headline cols 1–4 and S1 5-of-12 at 1024. At 4 columns S4 line 1 is 5 lines at 1024/1440 (specimen). S4 needs 5 columns at 1440 and 6 at 1024; S2 needs 6 at 1024. Alternatively accept more lines. Not edited in DESIGN_SPECIFICATION.md.

## 6 · Specimen verification (browser, real fonts)
Page: `tokens.css` + the seven real headline pairs, a caption box and a label, rendered in Chromium at 320, 360, 390, 768, 1024, 1440, 1920 (screenshots opened: 320 and 1440 inspected visually; other widths checked numerically).
- No page-level horizontal scroll at any of the seven widths; no headline or line 2 overflowed its zone (49 of 49 element checks `over=0`).
- Largest display line at 320: S5 hero at 52 px, widest word CIGARETTE. = about 4.3 em ≈ 223 px in a 288 px zone. Widest word anywhere (SOMEWHERE. at 44 px) ≈ 224 px. Both fit with ≥ 60 px slack. 4 lines for S5 at 320/360 (3 lines from 390).
- Body/caption 18 px at 320, 20 px at 1920 (≥ 16 px floor passed); smallest text on the site is 14 px (UI label), used with +8 % tracking and weight 600.
- Both real faces and both fallbacks reported `loaded` by `document.fonts`.
- Not measured: real glyph rendering on iOS/Android (NOT TESTED).

## 7 · Contrast table (every text role on every allowed ground)
Measured with `design-intelligence/scripts/contrast.mjs`, palette per CREATIVE_DIRECTION §2. AA minimum: 4.5 normal, 3 large (≥ 24 px, or ≥ 18.66 px bold).
| Role | Text | Ground | Ratio | Result |
|---|---|---|---|---|
| Line 1 (S1–S6), UI labels, loader % and prompt, captions on flat black (S6) | `#F1EBDD` | `#101014` | 15.97 | AAA |
| | `#F1EBDD` | `#19191F` | 14.72 | AAA |
| | `#F1EBDD` | `#481C2A` | 11.98 | AAA |
| Line 2 agency lines S1, S2, S5 | `#F5D547` | `#101014` / `#19191F` / `#481C2A` | 13.10 / 12.07 / 9.82 | AAA |
| Line 2 risk lines S3, S4 (any size) | `#F04452` | `#101014` | 5.11 | AA |
| | `#F04452` | `#19191F` | 4.71 | AA |
| | `#F04452` | `#481C2A` | 3.83 | **Forbidden** (large-only; never used) |
| S6 line 2 (O) | `#F1EBDD` | dark grounds | 11.98–15.97 | AAA |
| Caption boxes, S7 line 1–2 and copy, back matter, links | `#101014` | `#F1EBDD` | 15.97 | AAA |
| Primary button ENTER WITH SOUND | `#101014` | `#F5D547` | 13.10 | AAA |
| CONTINUE WITHOUT SOUND (text button) | `#F1EBDD` | `#101014` | 15.97 | AAA |
| Focus ring on dark | `#F5D547` | `#101014` / `#19191F` / `#481C2A` | 13.10 / 12.07 / 9.82 | AAA (non-text ≥ 3) |
| Focus ring on paper | `#101014` | `#F1EBDD` | 15.97 | AAA |
| Grey `#77747B` | any text | any | 4.13 max on `#101014`; 3.87 on paper | **Not used for text** (AA-large only); art/non-text ≥ 3 |
| Forbidden pairs | off-white on red 3.12, red on paper 3.12, red on grey 1.24, red on yellow 2.56, off-white on yellow 1.22 | | | never text |

Back-matter links: `#101014`, underlined 2 px, offset 0.15em (no colour-only link signal). Disabled/inactive UI: use opacity-free dimming by switching to `#F1EBDD` at 60 % over `#101014` only for non-essential decoration, never for text; the sound toggle shows its state in words.

Text over art is governed by CD §2 "worst pixel" rules; the table above is the ceiling for each role on its flat ground. Red as text is only allowed at line-2 scale (≥ 24 px) on `#101014`/`#19191F`.

## 8 · tokens.css draft (type part; spacing part in SPACING_SYSTEM.md)
```css
/* src/styles/tokens.css — type. Paths: copy the two WOFF2 files to /public/fonts */
@font-face{font-family:"Bricolage Grotesque Variable";font-style:normal;font-display:swap;font-weight:200 800;font-stretch:75% 100%;
  src:url(/fonts/bricolage-grotesque-latin-wdth-normal.woff2) format("woff2-variations");
  unicode-range:U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,U+0304,U+0308,U+0329,U+2000-206F,U+20AC,U+2122,U+2191,U+2193,U+2212,U+2215,U+FEFF,U+FFFD;}
@font-face{font-family:"Atkinson Hyperlegible Next Variable";font-style:normal;font-display:swap;font-weight:200 800;
  src:url(/fonts/atkinson-hyperlegible-next-latin-wght-normal.woff2) format("woff2-variations");
  unicode-range:U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,U+0304,U+0308,U+0329,U+2000-206F,U+20AC,U+2122,U+2191,U+2193,U+2212,U+2215,U+FEFF,U+FFFD;}
@font-face{font-family:"Ozone Display Fallback";src:local("Arial Bold"),local("Arial-BoldMT"),local("Liberation Sans Bold");font-weight:200 800;
  size-adjust:72.2%;ascent-override:128.8%;descent-override:37.4%;line-gap-override:0%;}
@font-face{font-family:"Ozone Text Fallback";src:local("Arial"),local("ArialMT"),local("Liberation Sans");font-weight:200 800;
  size-adjust:99.2%;ascent-override:99.2%;descent-override:31.9%;line-gap-override:0%;}

:root{
  --font-display:"Bricolage Grotesque Variable","Ozone Display Fallback",Arial,sans-serif;
  --font-text:"Atkinson Hyperlegible Next Variable","Ozone Text Fallback",Arial,sans-serif;

  /* palette (brief) */
  --c-black:#101014;--c-char:#19191F;--c-burg:#481C2A;--c-red:#F04452;
  --c-paper:#F1EBDD;--c-grey:#77747B;--c-yellow:#F5D547;

  /* text scale (type-scale.mjs, 320→1920) */
  --t-0:clamp(1.125rem,1.1rem + 0.125vw,1.25rem);
  --step-1:clamp(1.35rem,1.2867rem + 0.3163vw,1.6663rem);
  --step-2:clamp(1.62rem,1.4998rem + 0.6011vw,2.2211rem);
  --step-3:clamp(1.944rem,1.7407rem + 1.0167vw,2.9607rem);
  --t-label:clamp(0.875rem,0.8625rem + 0.0625vw,0.9375rem);

  /* display, mobile/tablet curve (320→1023); overridden ≥ 64rem */
  --t-h1:clamp(2.75rem,1.9545rem + 3.9773vw,4.5rem);
  --t-hero:clamp(3.25rem,2rem + 6.25vw,6rem);
  --t-d1:clamp(3rem,1.8636rem + 5.6818vw,5.5rem);
  --t-h2:clamp(1.5rem,1.0714rem + 2.1429vw,3.75rem);
  --t-d2:clamp(1.625rem,1.1607rem + 2.3214vw,4.5rem);

  --lh-display:.92;--lh-l2:1.08;--lh-text:1.4;--lh-long:1.55;
  --ls-display:.005em;--ls-label:.08em;--ls-button:.06em;
  --measure-caption:34ch;--measure-long:62ch;
}
@media (min-width:64rem){:root{
  --t-h1:clamp(4.5rem,2.0385rem + 3.8462vw,6.75rem);
  --t-hero:clamp(6rem,-2.3077rem + 12.9808vw,12rem);
  --t-d1:clamp(5.5rem,0.5769rem + 7.6923vw,9.375rem);
}}

html{-webkit-text-size-adjust:100%;text-size-adjust:100%}
body{font:400 var(--t-0)/var(--lh-text) var(--font-text);font-optical-sizing:auto;font-variant-ligatures:none;font-kerning:normal}
.l1{font:800 var(--t-h1)/var(--lh-display) var(--font-display);font-stretch:75%;letter-spacing:var(--ls-display);text-wrap:balance;hanging-punctuation:first}
.l1--hero{font-size:var(--t-hero)}.l1--d1{font-size:var(--t-d1)}
.l2{font:500 var(--t-h2)/var(--lh-l2) var(--font-display);font-stretch:100%;letter-spacing:0;text-wrap:balance}
.l2--d2{font-size:var(--t-d2)}
.label{font:600 var(--t-label)/1.3 var(--font-text);letter-spacing:var(--ls-label);font-variant-numeric:tabular-nums}
```
The `.l1/.l2` rules in the draft are the tested specimen rules.

## 9 · Open issues
- Column spans for S2/S4 headline zones (§5) vs CD: owner ui-ux / creative-director.
- The → glyph must be SVG: owner frontend.
- Fallback overrides were measured against Arial/Liberation; macOS Helvetica/“Arial” path not verified: NOT TESTED.
