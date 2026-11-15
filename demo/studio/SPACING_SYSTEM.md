# Spacing & Grid System — Penumbra — Light Atelier (demo)
_Owner: typography-spacing · Date: 2026-11-15 · Tokens: `src/styles/tokens.css`_

## Base unit & scale
8px base (4px half-step for UI details). Fluid between viewports 360 and 1440: each step is 80% of its desktop size at 360. Generated with `type-scale.mjs --space-base 8`. Every margin, padding and gap comes from this scale; a one-off value is a bug unless documented.

| Token | Value (360 → 1440) | Use |
|---|---|---|
| `--space-3xs` | 3.2 → 4px | Hairline-adjacent nudges, icon gaps |
| `--space-2xs` | 6.4 → 8px | Kicker to heading gap, chip padding |
| `--space-xs` | 9.6 → 12px | Label/value gaps in the spec strip |
| `--space-s` | 12.8 → 16px | Mobile gutter, paragraph gap in dense UI |
| `--space-m` | 19.2 → 24px | Tablet/desktop gutter, paragraph spacing, heading to body |
| `--space-l` | 25.6 → 32px | Between related blocks |
| `--space-xl` | 38.4 → 48px | Between groups in a section |
| `--space-2xl` | 51.2 → 64px | Heading to content block, table row group |
| `--space-3xl` | 76.8 → 96px | Between major blocks |
| `--space-4xl` | 102.4 → 128px | Large rests inside a section |
| `--space-5xl` | 153.6 → 192px | Deliberate empty moments (see below) |

Layout tokens: `--header-h` 4rem (fixed header; the scroll system reads it for anchor offsets and the hero uses it for top padding), `--margin` `clamp(1.25rem, 0.8rem + 2vw, 3rem)` (20px at 360, 41.6px at 1440, caps at 48px), `--gutter` (below), `--section-pad` `clamp(6rem, 4rem + 8vw, 14rem)` (110px at 360, 179px at 1440, caps at 224px).

## Grid
- Columns per breakpoint: `--cols` 4 below 48rem (768px), 8 from 48rem, 12 from 64rem (1024px), set on `:root` by media query. Breakpoints are content-driven defaults; the CD's asymmetric 12-column placements apply from 64rem.
- Gutter / margin (fluid): `--gutter` = `--space-s` (12.8-16px) on 4 columns, `--space-m` (19-24px) from 48rem. `--margin` 20px → ~42px as above. Use `grid-template-columns: repeat(var(--cols), minmax(0, 1fr)); column-gap: var(--gutter); padding-inline: var(--margin)`.
- Containers: `--container-max` 105rem (1680px) for the grid; `--container-text` = `--measure` (64ch) for running text; media plates go full-bleed (outside the grid). Display type spans columns 1-10; body sits on columns 2-7 (CD). At 1920 the container is centred with side space; the specimen H1 at 1920 renders on one line at 144px when allowed to span the full container, so clamp it to columns 1-10 to keep 2 lines at 1440-1680.

## Section rhythm
- Section padding scale: `padding-block: var(--section-pad)` for standard sections (110 → 179px). Inside a section: `--space-2xl` between heading and content, `--space-xl` between groups, `--space-m` between paragraphs. Space above a heading exceeds space below it (proximity). Header offset for anchors: `scroll-margin-top: var(--header-h)` (the scroll system uses the var directly).
- Intentional negative space moments (protect from content creep):
  1. **Threshold (hero):** near-empty dark viewport; H1 and sub-line only, with `--space-5xl` of dark above the H1 on desktop.
  2. **Beat 2 -> Method handover:** a single manifesto line at `--step-6` alone in a viewport with `--section-pad` * 1.5 above and below (the "rest" after the hero).
  3. **Atelier:** one display line (`--step-5`) with `--space-5xl` on all sides before the three small plates.

## Responsive behaviour
- Everything scales continuously between 360 and 1440 via clamp(); values plateau above 1440 so type and spacing do not grow on large monitors, only the side space does (container capped at 1680px).
- 360: 4 columns, 20px margins, gutter 12.8px, H1 56px on 2 lines (the specimen shows "We design / the dark first." with 322px content width, no overflow, `documentElement.scrollWidth == 360`). 768: 8 columns, H1 89px. 1440: 12 columns, H1 144px on 2 lines. 1920: same tokens, wider side space.
- Mobile section padding is about 110px (never zero) and the grid collapses text to full width within the 20px margins; asymmetric column offsets drop to single column at <48rem.
- Text is rem + vw, so browser zoom / text-size preferences still scale it (WCAG 1.4.4). Check 200% zoom at 360 on the H1 (not tested here).
