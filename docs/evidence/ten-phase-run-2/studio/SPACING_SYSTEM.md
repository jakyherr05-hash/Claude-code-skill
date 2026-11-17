# Spacing & Grid System — Halde
_Owner: typography-spacing · Date: 2026-11-17 · Phase 4 · Tokens land in the TOKENS block of styles.css (Phase 6)_

## Base unit & scale (4px base at max, 8px rhythm; fluid 390→1440, floor 0.8x)
| Token | Range (390→1440) | Use |
|---|---|---|
| `--space-3xs` | 3.2→4px | hairline gaps, label-to-rule |
| `--space-2xs` | 6.4→8px | inline gaps |
| `--space-xs` | 9.6→12px | tight stacks |
| `--space-s` | 12.8→16px | paragraph gap |
| `--space-m` | 19.2→24px | heading to body |
| `--space-l` | 25.6→32px | block gap |
| `--space-xl` | 38.4→48px | mat padding, step internal |
| `--space-2xl` | 51.2→64px | between steps (mobile) |
| `--space-3xl` | 76.8→96px | section padding (min) |
| `--space-4xl` | 102→128px | section padding, default |
| `--space-5xl` | 154→192px | hero top, deliberate negative space |
Values use the type-scale.mjs clamp() output (e.g. `--space-m: clamp(1.2rem, 1.1rem + 0.4444vw, 1.5rem)`). Also: `--rule: 1px` (hairlines, edge radius 0), `--section-y: var(--space-4xl)`, `--section-y-hero: var(--space-5xl)`.

## Grid
- Breakpoints (min-width; custom props cannot be used in @media, so write literals): base 390 (design floor, 360 must not break), 768, 1024, 1440.
- Columns: 4 (<768), 8 (768-1023), 12 (≥1024). `--cols`; `--gutter: clamp(1rem, 0.6rem + 1.5vw, 2rem)` (16→32px; ~22px at 1024).
- Page margin `--margin: clamp(1.25rem, 0.2rem + 2.8vw, 3.5rem)` (20px at 390, 56px at 1440).
- Containers: `--container: 80rem` (1280, page max, centred, inside margins); `--container-text: 40rem` (contact and statement); `--container-wide: 100%` defined; `--container-wide: 100%` (plate bleed to the right edge at ≥1024).
- Use `.grid { display:grid; grid-template-columns: repeat(var(--cols), minmax(0,1fr)); column-gap: var(--gutter) }`.

## Sticky-plate layout (≥1024)
- Steps column: cols 1-7 (7/12, about 58%); plate column: cols 8-12 (5/12, about 42%), plate `position: sticky; top: var(--space-xl)`, `align-self: start`, `aspect-ratio: 1`, width up to the viewport edge (bleed via negative right margin = `--margin`).
- Hero at 1440: wordmark spans cols 1-7, statement + email cols 1-5, plate about 38vw cols 7-12 bleeding right.
- 768: single column, wordmark full width, plate 60vw under the statement; 390: stacked, plate begins at the fold. Below 1024 the plate is inline, never sticky.

## Section rhythm
- `--rhythm-gap` (= `--space-2xl`, 51-64px): vertical gap between stacked blocks below 1024 (statement/CTA to plate, plate to process).
- Sections: padding-block `--section-y`; hero top `--section-y-hero`; step-to-step gap `--space-3xl`; heading to copy `--space-m`; label to heading `--space-xs`.
- Negative space moments: (1) 5xl above the hero wordmark, (2) 5xl between step 03 and contact so the glazed plate holds alone, (3) contact copy at `--container-text` with empty right 5 columns.
- One hairline (`--rim`) between sections; no cards, no radius.

## Custom properties for frontend (complete list)
`--font-serif --font-sans --step-wordmark --step-0..5 --step--1 --step-label --lh-* --tr-* --measure --measure-narrow --measure-statement --space-3xs..5xl --section-y --section-y-hero --rhythm-gap --cols --gutter --margin --container --container-text --rule`
