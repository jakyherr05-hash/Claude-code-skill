# Spacing, grid and rhythm

## Base unit
- 8px base (4px half-steps for UI details). Generate the fluid `--space-*` scale with `scripts/type-scale.mjs --space-base 8`.
- Every margin, padding and gap comes from the scale. A one-off value is a design bug unless documented.

## Grid
```css
:root {
  --cols: 4;                                   /* mobile */
  --gutter: var(--space-s);
  --margin: clamp(1.25rem, 0.8rem + 2vw, 3rem); /* page edge */
  --container-max: 1680px;
  --container-text: 65ch;
}
@media (min-width: 48rem) { :root { --cols: 8; } }
@media (min-width: 64rem) { :root { --cols: 12; --gutter: var(--space-m); } }

.grid {
  display: grid;
  grid-template-columns: repeat(var(--cols), minmax(0, 1fr));
  column-gap: var(--gutter);
  padding-inline: var(--margin);
  max-width: var(--container-max);
  margin-inline: auto;
}
```
Breakpoints are chosen where the *content* breaks; the 48/64rem above are defaults, not law. Use container queries (`container-type: inline-size`) for components that live in different column spans.

## Containers
Three widths are usually enough: **full-bleed** (media), **wide** (grid max), **text** (≈ 65ch). Long-form text never exceeds the text container, even inside full-bleed sections.

## Vertical rhythm
- Line-height of body sets the rhythm unit (e.g. 19px × 1.55 ≈ 29px). Headline margins are multiples/fractions of the space scale, not arbitrary.
- Space *above* a heading > space *below* it (proximity binds the heading to its content).
- Section padding: `--section-pad: clamp(6rem, 4rem + 8vw, 14rem)` for premium pacing; compress ~40% on mobile, never to zero.

## Negative space as a decision
Mark in SPACING_SYSTEM.md the 1–3 places where the design deliberately leaves a viewport nearly empty (a single line, an image alone). These "rests" make the signature moment hit harder. Protect them from content creep.

## Optical alignment
- Large display type: pull the first letter left by its side-bearing (`margin-left: -0.05em` typical; measure per font).
- Align text baselines to image edges with `padding-top` tuned by eye in the browser — and record the value.
- Icons next to text: centre on x-height, not on line-box.
