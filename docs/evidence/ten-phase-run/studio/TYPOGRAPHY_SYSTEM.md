# Typography System — Halde
_Owner: typography-spacing · Date: 2026-11-16_

## Fonts
| Role | Family | Source | Licence | Weights/axes | Loading |
|---|---|---|---|---|---|
| Display + Text | System serif stack (one family for both) | Installed on visitor's device | System fonts, none bundled or redistributed | 400 and 500 only (synthetic bold avoided) | None: no @font-face, no preload, no request |

Which face renders depends on the OS (Iowan Old Style/Charter on Apple, Sitka/Cambria on Windows, Georgia as the broad fallback). Per-font licence terms were not looked up: nothing is shipped, so none applies.
## Pairing rationale
One serif voice, hierarchy by size, case and tracking, not by a second family. Plain-spoken and bookish, matching "unhurried, tactile, honest". Because stacks are system fonts there is no swap, so no CLS and no metric-override block is needed. Revisit only if a web font is added.

## Tokens (copy into :root at top of styles.css)
```css
--font-serif: "Iowan Old Style","Charter","Bitstream Charter","Sitka Text",Cambria,"Palatino Linotype",Georgia,serif;
--step--1: clamp(0.75rem, 0.727rem + 0.095vw, 0.8125rem);   /* label */
--step-0: clamp(1.0625rem, 1.016rem + 0.19vw, 1.1875rem);   /* body 17→19 */
--step-1: clamp(1.1875rem, 1.095rem + 0.381vw, 1.4375rem);  /* lead 19→23 */
--step-2: clamp(1.5rem, 1.314rem + 0.762vw, 2rem);          /* step title 24→32 */
--step-3: clamp(1.875rem, 1.457rem + 1.714vw, 3rem);        /* statement 30→48 */
--step-4: clamp(3.25rem, 1.671rem + 6.476vw, 7.5rem);       /* display 52→120, currently unused */
--lh-body: 1.55; --lh-lead: 1.45; --lh-title: 1.2; --lh-statement: 1.15; --lh-display: 0.95; --lh-label: 1.3;
--track-body: 0; --track-lead: -0.005em; --track-title: -0.01em; --track-statement: -0.015em; --track-display: -0.035em; --track-label: 0.14em;
--measure-statement: 34.4rem; /* ≈550px */  --measure-body: 62ch;
```
## Fluid scale (390→1440; fixed outside)
| Step | Token | Size 390→1440 | Line-height | Tracking | Weight | Use |
|---|---|---|---|---|---|---|
| -1 | --step--1 | 12→13px | 1.3 | +0.14em | 400, uppercase, ash | Labels, step numbers, meta |
| 0 | --step-0 | 17→19px | 1.55 | 0 | 400 | Body |
| 1 | --step-1 | 19→23px | 1.45 | -0.005em | 400 | Lead paragraph |
| 2 | --step-2 | 24→32px | 1.2 | -0.01em | 500 | Step titles (h3) and header wordmark "Halde" |
| 3 | --step-3 | 30→48px | 1.15 | -0.015em | 400 | h1 and h2 statements |
| 4 | --step-4 | 52→120px | 0.95 | -0.035em | 400 | UNUSED in build; token kept for a possible display moment (Gate B may revisit) |

## Rules
- Measure: statements max `--measure-statement` (~550px, centred, `text-wrap: balance`); body max `--measure-body` (45–75ch band). Body never below 17px.
- Optical: `font-optical-sizing: auto`; `text-wrap: pretty` on body; the -0.04em wordmark margin from the earlier draft is NOT built (wordmark is 24→32px, so the side-bearing is negligible); no hanging punctuation needed (no pull quotes).
- Case/numerals: labels `text-transform: uppercase`. Step numbers 01/02/03 use `font-variant-numeric: tabular-nums lining-nums`; Georgia has no lining figures, so they may render oldstyle there, which is acceptable. `font-variant-ligatures: common-ligatures`.
- Largest type in use is --step-3 (30px at 390); the 52px wordmark claim no longer applies. "Halde" at --step-2 (24px) is far inside 360. Keep long headings on `text-wrap: balance`.
