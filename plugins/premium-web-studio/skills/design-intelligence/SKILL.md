---
name: design-intelligence
description: Framework for choosing and specifying a website's design language and full design system (typography, spacing, visual and motion systems) from the brand, industry and audience — luxury, editorial, minimalist, brutalist, futuristic, tech, automotive, fashion, e-commerce, cinematic storytelling, portfolio, product, corporate and experimental. Use whenever deciding how a site should look and feel, writing creative direction, picking palettes, art direction or motion personality, or when a design feels generic and needs a sharper point of view.
---

# Design intelligence

The failure mode this skill prevents is the **default site**: the same Inter-on-off-white, fade-up-on-scroll, rounded-card layout applied to a law firm, a sneaker drop and a perfume house. Premium work comes from decisions traced back to the brand. Every choice in a design system should be answerable with "because this audience / this product / this story…".

## Method

1. **Extract the brand's tension.** From the brief, write three pairs of words the brand must hold in balance (e.g. *heritage ↔ engineering*, *warm ↔ exact*, *rare ↔ welcoming*). Premium design lives in the tension, not at one pole.
2. **Pick a primary design language (and at most one accent language)** from `references/design-languages.md`. Read only the entries you're considering. Each lists its traits, type, spacing, palette, image and motion signatures, best-fit industries and pitfalls.
3. **Check the industry playbook** in `references/industry-playbooks.md` for what that audience expects and where you can break convention safely.
4. **Derive the four systems**, each choice justified by step 1–3:

| System | Decide | Detail lives in |
|---|---|---|
| Typography | display / text / accent families, axes, scale ratio, tracking curve | `typography-system` skill |
| Spacing | base unit, scale, grid, containers, section rhythm, negative-space moments | `typography-system` skill |
| Visual | palette roles + contrast, backgrounds, image/video treatment, borders, shadows, texture, composition | `references/visual-system.md` |
| Motion | principles, duration scale, eases, stagger logic, scroll behaviour, transitions, reduced motion | `references/motion-system.md` |

5. **Name the signature moment.** One or two places where the site does something memorable that *only this brand* would do. Everything else stays quiet so the signature lands.
6. **Write the "not doing" list.** Name the clichés you are rejecting for this project.

## Rules of taste that hold across languages

- **Hierarchy before decoration.** If a section needs motion to be understood, the layout is wrong.
- **Contrast of scale** is the cheapest premium signal: one very large thing, generous space, small precise details.
- **Restraint in palette.** One dominant, one support, one accent used < 5% of the surface. Accents earn attention by being rare.
- **Consistency of edge.** Pick a radius language (0, small, or pill) and a border language and keep them everywhere.
- **Motion mirrors material.** Heavy brands move with weight (longer, decelerating eases); playful brands can overshoot; technical brands move precisely (short, linear-ish, stepped).
- **Text over images needs a plan** (scrim, grade, placement in quiet areas), never luck.
- **Contrast is non-negotiable.** Check every text/background pair with `scripts/contrast.mjs` (WCAG 2.x ratio; AA 4.5:1 body, 3:1 large text ≥ 24px or ≥ 18.66px bold).

## Judge the render, not the spec

Taste is applied to what the browser draws. When sections land, after motion, and at Gate B, capture the running build at 390, 768, 1024 and 1440 plus a scroll filmstrip and critique it with `references/visual-critique.md` (first viewport, hierarchy, typography, composition, imagery, motion, per-breakpoint layout, a "default site" detector). Specs can't show a lone word on a heading's last line, an H1 cut by the fold or text over a light that fails contrast. Screenshots do.

## Output

Feed decisions into `studio/CREATIVE_DIRECTION.md` (concept, language + rationale, palette with roles and measured contrast, image/motion direction, signature moment, not-doing list). Keep exact type/spacing numbers for the typography-spacing specialist.

## Scripts

- `node scripts/contrast.mjs "#0b0b0c" "#e9e4da" ...` — prints WCAG ratios for every pair of the given colours and flags AA/AAA pass/fail.
