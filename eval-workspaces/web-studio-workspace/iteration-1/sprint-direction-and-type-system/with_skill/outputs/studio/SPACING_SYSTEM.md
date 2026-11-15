# Spacing & Grid System — Aster C1 Launch
_Owner: typography-spacing (performed by the orchestrator in this run) · Date: 2026-11-15 · Status: proposed, not yet rendered_

Principle: space is the quiet. One fluid scale, one grid, three containers, three deliberate rests. A one-off value is a design bug unless recorded here.

## Base unit & scale
8 px base (4 px half-step for UI details). Generated with `type-scale.mjs --space-base 8` [M]; fluid between 360 and 1440 viewport.

| Token | clamp() [M] | px at 360 -> 1440 | Use |
|---|---|---|---|
| `--space-3xs` | `clamp(0.2rem, 0.1833rem + 0.0741vw, 0.25rem)` | 3.2 -> 4 | hairline offsets, icon nudges |
| `--space-2xs` | `clamp(0.4rem, 0.3667rem + 0.1481vw, 0.5rem)` | 6.4 -> 8 | label to value gap |
| `--space-xs` | `clamp(0.6rem, 0.55rem + 0.2222vw, 0.75rem)` | 9.6 -> 12 | kicker to heading |
| `--space-s` | `clamp(0.8rem, 0.7333rem + 0.2963vw, 1rem)` | 12.8 -> 16 | paragraph to paragraph, button padding block |
| `--space-m` | `clamp(1.2rem, 1.1rem + 0.4444vw, 1.5rem)` | 19.2 -> 24 | heading to body, grid gutter (desktop) |
| `--space-l` | `clamp(1.6rem, 1.4667rem + 0.5926vw, 2rem)` | 25.6 -> 32 | between blocks inside a section |
| `--space-xl` | `clamp(2.4rem, 2.2rem + 0.8889vw, 3rem)` | 38.4 -> 48 | spec table row group, page margin (desktop) |
| `--space-2xl` | `clamp(3.2rem, 2.9333rem + 1.1852vw, 4rem)` | 51.2 -> 64 | image to caption block |
| `--space-3xl` | `clamp(4.8rem, 4.4rem + 1.7778vw, 6rem)` | 76.8 -> 96 | between a section's sub-groups |
| `--space-4xl` | `clamp(6.4rem, 5.8667rem + 2.3704vw, 8rem)` | 102.4 -> 128 | section padding (compact sections) |
| `--space-5xl` | `clamp(9.6rem, 8.8rem + 3.5556vw, 12rem)` | 153.6 -> 192 | section padding (standard) and rests |

Tokens beyond the scale (documented exceptions): `--hit: 2.75rem` (44 px minimum touch target), `--hairline: 1px`.

## Grid
- Columns: 4 (< 48rem), 8 (>= 48rem), 12 (>= 64rem). Breakpoints are content-driven defaults; the 12-column layout starts where the two-column text/image composition stops feeling cramped (to be confirmed visually at build).
- Gutter: `--space-s` on 4/8-col, `--space-m` on 12-col.
- Page margin: `--margin: clamp(1.25rem, 0.8rem + 2vw, 3rem)` (20 px at 360, 48 px at 1440+).
- Max width: 1440 px (equal to the upper bound of the fluid scale). At 1920 the layout stays centred; the paper ground runs full-bleed; type does not grow past its 1440 size.
```css
:root { --cols: 4; --gutter: var(--space-s); --margin: clamp(1.25rem, 0.8rem + 2vw, 3rem); --container-wide: 1440px; --container-text: 60ch; --container-narrow: 38rem; }
@media (min-width: 48rem) { :root { --cols: 8; } }
@media (min-width: 64rem) { :root { --cols: 12; --gutter: var(--space-m); } }
.grid { display: grid; grid-template-columns: repeat(var(--cols), minmax(0, 1fr)); column-gap: var(--gutter); padding-inline: var(--margin); max-width: var(--container-wide); margin-inline: auto; }
```
- Composition rule: **asymmetric, left-weighted**. On 12 columns, text sits in columns 1-5 (or 2-6) and imagery spans 6-12; the hero image may bleed to the right edge. The spec table spans columns 1-12 but its text-bearing cells align to columns 1-3 (label) and 4-8 (value). Anything that breaks the grid must do so on purpose and only once per section.
- On 8 columns: text 1-6, image 1-8 stacked. On 4 columns: single column, image first or second per narrative beat, all full-width within margins.

## Containers
| Name | Width | Used by |
|---|---|---|
| Full-bleed | 100% | Hero image, Dusk section background |
| Wide | 1440 px incl. margins | Grid, spec table, image pairs |
| Text | 60ch (about 540 px at 18 px) | Body, lead; never exceeded, even inside full-bleed sections |
| Narrow | 38rem | Reserve block, form (email field), legal lines |

## Vertical rhythm
- Body rhythm unit: 18 px x 1.6 = 28.8 px at 1440 (25.6 px at 360). Spacing between text elements uses the scale, not multiples of line-height.
- Heading proximity: space above a heading > space below. Kicker -> heading `--space-xs`; heading -> body `--space-m`; body -> body `--space-s`; body -> CTA `--space-l`; block -> block `--space-3xl`.
- Spec table: row padding-block `--space-s`, hairline between rows, label column `--step--1` uppercase, value column Geist 300 at `--step-3` for the headline specs (weight, price) and `--step-0` for the rest, all tabular.
- Image captions: `--space-2xs` under the image, step -1, ink-muted.

## Section rhythm
- Standard section padding: `--section-pad: var(--space-5xl)` (154 -> 192 px).
- Compact section (spec table, footer): `--space-4xl`.
- Mobile compression: the clamp already compresses (about 20% from 1440 to 360). Never below `--space-4xl`; the page must stay calm on a phone.
- Section edges: paper to graphite and back are hard edges (no gradient). A 1px `--line` hairline separates paper sections that share a ground.
- Sticky header: 56 px tall (`--space-2xl` + hairline), transparent over the hero, paper once scrolled; reserve `scroll-padding-top: 4.5rem` for anchors.

## Intentional negative space (protect from content creep)
1. **The Weight** (beat 2): a full viewport (`min-height: 100svh`) holding only "10.9 kg", the ruler, and one line of copy. Nothing else may be added.
2. **Dusk exit**: after the lights text, `--space-5xl` of graphite before the page returns to paper. No content.
3. **Before Reserve**: a single sentence on its own, with `--space-5xl` above and below.
These three rests are the page's pacing; a stakeholder request to "use the space" for more content must be raised as a design decision.

## Responsive behaviour
Matrix to verify at build: 360, 390, 768, 1024, 1440, 1920.
- 360/390: 4 columns, margin 20 px, single-column stack, ruler in the Weight section spans the full content width (about 320 px), the figure stays on one line (check).
- 768: 8 columns, text 1-6; image pairs side by side only if each is >= 280 px wide.
- 1024: 12 columns begin; text/image offset composition.
- 1440: reference layout.
- 1920: centred container, extra paper margin on both sides; no scaling of type or spacing.
- Landscape phones: sections that use `100svh` set a `min-height`, never a fixed height, so content is never clipped.
- Zoom: 200% text zoom must not hide content (use rem/em; no fixed heights on text blocks).

## Interactive sizing
- Buttons: height >= `--hit` (44 px), padding-inline `--space-l`, radius 0, label step -1 uppercase tracked, accent fill `--aster`, text white (7.15:1), focus ring 2px offset 3px in `--aster` (6.0:1 on paper) or `--aster-on-dark` on graphite.
- Email field: 1px `--ink-muted` border (>= 3:1), height 48 px, visible label above (not placeholder-only).
- Targets spaced at least `--space-xs` apart.

## Verification status
| Check | Status | Evidence |
|---|---|---|
| Scale values generated | PASS | type-scale.mjs output |
| Grid/containers rendered at all six widths | NOT TESTED | no build in this run |
| 100svh rests behave on mobile browser chrome | NOT TESTED | check at build |
