# Spacing & Grid System — Halde
_Owner: typography-spacing · Date: 2026-11-16_

## Base unit & scale
Base unit 8px (0.5rem); half-step 4px. Vertical rhythm: body line = 17–19px × 1.55; stack gaps use the scale, not line multiples.

## Tokens (copy into :root at top of styles.css, after the type tokens)
```css
/* palette (CREATIVE_DIRECTION.md) */
--clay: #EDE7DD; --slip: #F7F3EC; --iron: #2A2420; --ash: #6A5D51; --glaze: #3D5752; --rule: #C9BFB2;
/* space scale */
--space-1: 0.25rem; --space-2: 0.5rem; --space-3: 1rem; --space-4: 1.5rem; --space-5: 2rem;
--space-6: 3rem; --space-7: 4.5rem; --space-8: 6rem;
/* fluid layout (390→1440) */
--margin: clamp(1.25rem, 0.229rem + 4.19vw, 4rem);     /* page side margin 20→64 */
--gutter: clamp(1rem, 0.629rem + 1.524vw, 2rem);       /* 16→32 */
--section: clamp(5rem, 2.4rem + 10.667vw, 12rem);      /* section padding 80→192 */
--stack: clamp(1.5rem, 1.1rem + 1.6vw, 2.5rem);        /* gap between heading and text */
/* containers */
--container: 72rem;  --container-narrow: 48rem;  --container-statement: var(--measure-statement);
```

## Grid
- Columns: 4 (<768px), 8 (768–1199px), 12 (≥1200px). Breakpoints 768 and 1200.
- Gutter `--gutter`, side margin `--margin`; `.container { width: min(100% - 2*var(--margin), var(--container)); margin-inline: auto }`.
- Containers: 72rem (grid/steps), 48rem (contact block), 34.4rem (centred statements, hero tagline).
- Layout is mostly centred. The three steps: 1 column (<1024), 3 columns (≥1024; decision 2026-11-16, design spec wins over the earlier 768). Step card padding steps up at 768. Labels sit offset in the margin column at ≥1200, above the text below.

## Section rhythm
- Section padding-block `--section` top and bottom (hero: top `--space-8`, bottom `--section`). Adjacent sections do not double up: use padding only, no margins.
- Inside a section: label → `--space-3` → statement; statement → `--stack` → body; step cards gap `--gutter`; slip surfaces padding `--space-5` (`--space-4` below 768).
- Negative-space moments: (1) after the hero rings, a full `--section` gap before "How we work"; (2) around the contact email, `calc(var(--section) * 1.25)` above and below, nothing else in view.

## Responsive behaviour
- 390: single column, margin 20px, section 80+px, header wordmark ~24px (--step-2). 768: still single-column steps, larger card padding. 1024: steps go 3-up, hero becomes 12-col. 1440: container caps at 1152px, margins ≥64px.
- Touch targets (email link, nav) min 44px high via padding, not font size.
- No horizontal scroll: rings sized in `min()`/`vw` inside aspect-ratio boxes.
