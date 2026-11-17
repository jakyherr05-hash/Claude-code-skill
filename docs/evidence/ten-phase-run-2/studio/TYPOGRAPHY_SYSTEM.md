# Typography System — Halde
_Owner: typography-spacing · Date: 2026-11-17 · Phase 4 · Tokens land in the TOKENS block of styles.css (Phase 6)_

## Fonts (system stacks only: nothing shipped, no @font-face, no network, no preload)
| Role | Token | Stack | Licence |
|---|---|---|---|
| Serif (wordmark, headings, body, italic accents) | `--font-serif` | "Iowan Old Style", "Palatino Linotype", Palatino, "Book Antiqua", "URW Palladio L", P052, Georgia, serif | System-installed on user device; OS licence, nothing redistributed |
| Grotesk (tracked caps labels, 01/02/03) | `--font-sans` | ui-sans-serif, system-ui, "Helvetica Neue", Arial, sans-serif | same |
Pairing: bookish old-style serif for the hand, neutral system grotesk in small tracked caps for the kiln-log voice. Ratio about 4:1. Weight 400 serif only (600 for nothing; hierarchy by size and italic). Sans 500 for labels. No variable axes.

## Fluid scale: 390 → 1440 viewport, 17→20px base, ratio 1.2→1.333 (type-scale.mjs)
| Token | clamp() | Line-height | Tracking | Use |
|---|---|---|---|---|
| `--step-wordmark` | clamp(5rem, 2rem + 17vw, 14rem) | 0.88 | -0.02em | "Halde" h1 (80→224px) |
| `--step-4` | clamp(2.2032rem, 1.5556rem + 2.6567vw, 3.9467rem) | 1.06 | -0.02em | h2 (35→63px) |
| `--step-2` | clamp(1.53rem, 1.2733rem + 1.0531vw, 2.2211rem) | 1.15 | -0.01em | h3, step titles (24→36px) |
| `--step-1` | clamp(1.275rem, 1.1297rem + 0.5962vw, 1.6663rem) | 1.3 | -0.005em | hero statement, lead (20→27px) |
| `--step-0` | clamp(1.0625rem, 0.9929rem + 0.2857vw, 1.25rem) | 1.5 | 0 | body (17→20px) |
| `--step--1` | clamp(0.8854rem, 0.866rem + 0.0797vw, 0.9377rem) | 1.5 | 0.01em | small, captions (14→15px) |
| `--step-label` | clamp(0.75rem, 0.73rem + 0.1vw, 0.8125rem) | 1.3 | +0.14em, uppercase | sans caps labels (12→13px) |
Also defined (unused unless needed): `--step-3` (29→47px, lh 1.06, -0.02em), `--step-5` (42→84px, lh 0.98, -0.03em). Values re-synced to type-scale.mjs output at 390→1440 in Phase 6. Each step has paired `--lh-*` and `--tr-*` tokens (e.g. `--lh-0`, `--tr-wordmark`); `--lh-body: 1.5`.

## Rules
- Measure: body `--measure: 62ch`; step copy `--measure-narrow: 34ch`; statement `--measure-statement: 24ch`, 34ch from 1280px (lede sets in 2 lines at 1440); never above 70ch.
- Italic for one phrase per section (`<em>`); `text-wrap: balance` on headings, `pretty` on body; `hanging-punctuation: first` where supported.
- Numerals: `font-variant-numeric: lining-nums tabular-nums` on 01/02/03 labels (sans); oldstyle only if serif offers it (`oldstyle-nums` on prose, harmless if not).
- Body floor 17px at 390 (≥16 required). No negative tracking on body; display ≥ -0.035em.
- `font-synthesis: none`; `-webkit-text-size-adjust: 100%`; `font-kerning: normal`.

## Fallbacks & CLS
No webfonts load, so no swap and no font-induced CLS (0 by construction). Cross-OS metric drift is the only risk: Palatino/Iowan/Georgia/P052 differ about 10% in width. `--font-serif` ends `Georgia, "Liberation Serif", Tinos, "Nimbus Roman", serif` so Linux rarely reaches DejaVu. `--step-wordmark` is one token, two values. Below 1024: `min(clamp(7.5rem, 35.7vw, 17rem), (100vw - 2*margin)/2.93)`, a ceiling that fits even DejaVu Serif (2.92em). From 1024: `clamp(11rem, 18vw, 14.2rem)`. Measured h1/content: Liberation 0.78 at 360/390/768, 0.76-0.78 at 1440/1920; DejaVu 1.00 at 360-768, 0.97-0.99 at 1440-1920 (no overflow). Trade-off: Liberation/Georgia fill ~78%, not 85-90%. Rules for frontend: wordmark `white-space: nowrap`, container `overflow-wrap: normal`; give hero text blocks `min-height` in rem/ch, never in font-relative guesses for the plate; reserve the plate with aspect-ratio.
