# Spacing & Grid System — OZONE — "Your Ink"
_Owner: typography-spacing · T5 · 2026-11-18 · Replaces the 2026-11-17 system. Type is in TYPOGRAPHY_SYSTEM.md._

The page is one pinned stage, not a stack of sections. Spacing therefore governs three things: the **text-safe zones** the headlines and captions sit in, the **UI edge gutters** (counter, sound toggle, skip), and the **back matter** that scrolls freely after S7. Art is positioned in world coordinates by the camera rig and is not on this scale.

## 1 · Base unit and scale
- Base unit **8 px** (4 px half-step for borders, ink offsets and icon gaps). Every padding, gap and margin comes from the scale; a one-off value needs a comment.
- Fluid scale generated with `type-scale.mjs --min-vw 320 --max-vw 1920 --space-base 8`:

| Token | 320 → 1920 | Use |
|---|---|---|
| `--space-3xs` | 3.2 → 4 px | ink-offset, hairline gaps |
| `--space-2xs` | 6.4 → 8 px | label to icon, caption leader gap |
| `--space-xs` | 9.6 → 12 px | UI gaps, gutter at 320 |
| `--space-s` | 12.8 → 16 px | caption box vertical padding, button padding-y |
| `--space-m` | 19.2 → 24 px | caption box horizontal padding, headline L1→L2 (fallback) |
| `--space-l` | 25.6 → 32 px | headline block → caption |
| `--space-xl` | 38.4 → 48 px | caption → caption stack |
| `--space-2xl` | 51.2 → 64 px | back-matter block gaps |
| `--space-3xl` | 76.8 → 96 px | back-matter section padding |
| `--space-4xl` | 102.4 → 128 px | back-matter / paper margin top |
| `--space-5xl` | 153.6 → 192 px | rest after final copy |

(`clamp()` values are in tokens.css below, copied from the script output.)
- **Headline internal rhythm uses em, not the scale:** line 2 starts `0.4em` below line 1 (em of line 2's own size), so the pair scales as one lock-up at every size.

## 2 · Grid per breakpoint
Breakpoints are where the content breaks (the camera rigs), not device names. In-between sizes use the rig chosen by aspect ratio (CD §8); the grid below only positions HTML text and UI.

| Range | Columns | Margin | Gutter | Container max | Notes |
|---|---|---|---|---|---|
| **320–374** | 4 | 16 px | 12 px | fluid | Narrowest supported; zone 288 px |
| **375–767** (390 reference) | 4 | 20 px | 12 px | fluid | Zone 350 px at 390 |
| **768–1023** | 8 | 32 px | 20 px | fluid | |
| **1024–1439** | 12 | 40 px | 24 px | fluid | 5-of-12 = 380 px at 1024 |
| **1440–1919** | 12 | 64 px | 24 px | fluid (1312 px at 1440) | 5-of-12 = 533 px at 1440 |
| **≥ 1920** | 12 | 64 px | 24 px | **1680 px, centred; art bleeds wider** | The camera shows more world, the type zone stays at 1680 px and does not grow |

Column spans each scene needs for line 1 are in TYPOGRAPHY_SYSTEM.md §5 (measured). Zones are anchored to the grid, never to the art plane edge; the art plane moves, the grid does not (HTML sits over the stage, per-scene zones travel via transform of their layer, not via different margins).

Landscape phones use the 768 grid with the 4:3 rig. Ranges are `min-width` queries in rem (`23.4375rem`, `48rem`, `64rem`, `90rem`, `120rem`).

## 3 · Safe areas and viewport units
- Edge UI (counter top, sound toggle bottom-left, skip) and every text-safe zone use `padding-inline: max(var(--margin), env(safe-area-inset-left))` / `-right`; bottom-anchored items add `env(safe-area-inset-bottom)`, top-anchored add `env(safe-area-inset-top)`. Requires `<meta name="viewport" content="viewport-fit=cover">` (frontend).
- Scene pin heights use **`svh`** (the CD scroll budget is already in svh at 390) so the mobile URL-bar collapse does not resize pins; stage height for camera rigs uses `dvh` only for the no-pin reduced-motion comic. Fallback `vh` first in the cascade.
- Touch targets ≥ 44 × 44 px for sound toggle, skip, counter links, ENTER/CONTINUE; small visual elements get an invisible padded hit area, kept clear of text-safe zones (CD §8).
- Landscape phone notch: left/right insets apply, so the zone shrinks, not the type.

## 4 · Caption box (narration box)
- Ground `#F1EBDD`, text `#101014`, **2 px `#101014` border, straight corners, never tilted**.
- Padding: `var(--space-s)` top/bottom, `var(--space-m)` left/right: 12.8 × 19.2 px at 320 to 16 × 24 px at 1920 (text inside therefore sits ≥ 19 px from the ink border).
- Text 18–20 px, lh 1.4, max-width `min(34ch, 100%)`; at 390 the box is full zone width (350 px: about 31 ch). Box width never exceeds the zone.
- Hard offset shadow for the "printed panel" feel: `box-shadow: var(--space-3xs) var(--space-3xs) 0 #101014` only where the box sits on lighter art; otherwise none (a shadow on `#101014` is invisible).
- Stacked boxes (two at a time on 390): gap `--space-xs`, never touching, never overlapping a headline lock-up. Box-to-headline gap `--space-l`.
- Leaders (S4): 1 px `#F1EBDD` hairlines on dark, ending `--space-2xs` short of the box border.
- Box over art is only allowed on its flat plane; a box sits ≥ `--space-m` from any halftone edge.

## 5 · Measure
| Element | Measure |
|---|---|
| Headline line 1 / 2 | Set by zone span (see type doc table); `text-wrap: balance` |
| Caption boxes | ≤ 34 ch at all sizes (CD: ≤ 34ch at ≥ 1920) |
| Loader prompt copy | ≤ 40 ch |
| S7 final copy on paper | ≤ 9-of-12 columns for line 1, label line ≤ 62 ch |
| Back-matter paragraphs, facts, credits | **62 ch** (inside 45–75) |
| Source/URL lines | wrap anywhere, ≤ 62 ch |

## 6 · Back matter rhythm (free scroll, paper `#F1EBDD`)
- Section padding-block `--space-3xl`; first block begins `--space-4xl` below S7 copy so the rest after the final message is felt.
- Within a block: heading → body `--space-s`; body → next heading `--space-xl`; between facts M1–M6 `--space-l`; hairline 2 px `#101014` between groups (echoes panel borders).
- Text container 62 ch, left-aligned on grid column 1 (desktop columns 1–7, the remaining columns stay empty); on 390 the full zone.
- Spacing above a heading is always larger than below (proximity).

## 7 · Optical alignment
- Large display type: first-letter side bearing is small in Bricolage caps; start with `margin-inline-start: -0.04em` on `.l1` at ≥ 64 px so the straight stem of E, T, I, Y aligns with the caption box edge and the `label` below. **Value not yet measured in the real layout** (frontend/QA to tune against the screenshot; revert if the stem touches the safe margin at 320).
- Headline to caption: align the left ink edge of line 1 with the caption border (not the box text).
- Icon next to a label: centre on x-height, gap `--space-2xs`.

## 8 · Deliberate negative space (protect from content creep)
1. **T4 erase, 35 → 60 %: no type on screen** (CD §6): the empty frame is the beat.
2. **S5 upper 40 % sky**: only headline in it; nothing else may enter the zone.
3. **S7 rest after the final copy** (`--space-5xl` of bare paper) before the back matter starts, then silence in the score.

## 9 · tokens.css draft (spacing part; type part in TYPOGRAPHY_SYSTEM.md §8)
```css
:root{
  --space-3xs:clamp(0.2rem,0.19rem + 0.05vw,0.25rem);
  --space-2xs:clamp(0.4rem,0.38rem + 0.1vw,0.5rem);
  --space-xs:clamp(0.6rem,0.57rem + 0.15vw,0.75rem);
  --space-s:clamp(0.8rem,0.76rem + 0.2vw,1rem);
  --space-m:clamp(1.2rem,1.14rem + 0.3vw,1.5rem);
  --space-l:clamp(1.6rem,1.52rem + 0.4vw,2rem);
  --space-xl:clamp(2.4rem,2.28rem + 0.6vw,3rem);
  --space-2xl:clamp(3.2rem,3.04rem + 0.8vw,4rem);
  --space-3xl:clamp(4.8rem,4.56rem + 1.2vw,6rem);
  --space-4xl:clamp(6.4rem,6.08rem + 1.6vw,8rem);
  --space-5xl:clamp(9.6rem,9.12rem + 2.4vw,12rem);

  --cols:4;--margin:1rem;--gutter:.75rem;--container-max:105rem;
  --pad-l:max(var(--margin),env(safe-area-inset-left));
  --pad-r:max(var(--margin),env(safe-area-inset-right));
  --pad-t:max(var(--margin),env(safe-area-inset-top));
  --pad-b:max(var(--margin),env(safe-area-inset-bottom));
  --border-ink:2px;--target:2.75rem;
}
@media (min-width:23.4375rem){:root{--margin:1.25rem}}
@media (min-width:48rem){:root{--cols:8;--margin:2rem;--gutter:1.25rem}}
@media (min-width:64rem){:root{--cols:12;--margin:2.5rem;--gutter:1.5rem}}
@media (min-width:90rem){:root{--margin:4rem}}

/* zone of N columns (set --span on the scene's text layer) */
.zone{--span:5;
  width:min(100%,calc((100% - (var(--cols) - 1)*var(--gutter))/var(--cols)*var(--span) + (var(--span) - 1)*var(--gutter)));
  margin-inline:var(--pad-l) var(--pad-r);max-width:var(--container-max)}
.caption{background:var(--c-paper);color:var(--c-black);border:var(--border-ink) solid var(--c-black);
  padding:var(--space-s) var(--space-m);max-width:min(34ch,100%);font-size:var(--t-0);line-height:1.4}
.l1+.l2{margin-block-start:.4em}
.measure-long{max-width:62ch}
```
Note `.zone` percentages resolve against the content box of its parent (the scene layer, already inset by `--margin`); at ≥ 1920 the layer is capped at `--container-max` (1680 px) and centred.

## 10 · Verified
Specimen (same grid formulas, 7 widths 320–1920): no horizontal page scroll. Measured zone widths: 288 / 328 / 350 px full-width at 320 / 360 / 390; 5-column zone 433 px at 768 (5 of 8), 379 at 1024, 533 at 1440. Caveat: the 1920 specimen used a 1792 px content width (no 1680 container cap), giving a 733 px 5-column zone; with the 1680 cap it is about 686 px, so the 1920 span table in TYPOGRAPHY_SYSTEM.md §5 should be re-run once the real layout exists (headline size at 1920 is 106 px, so 686 px still fits SOMEWHERE. at about 540 px). Safe-area insets, `svh/dvh` behaviour and notch devices: NOT TESTED (no devices; Chromium emulation only).
