# Visual system

## Palette construction
1. Start from a **material or light** in the brand world (concrete at dusk, oxidised brass, paper, anodised aluminium), not from a colour wheel.
2. Define roles, not just swatches: `ground`, `ground-raised`, `ink`, `ink-muted`, `line`, `accent`, `accent-ink` (text on accent), `focus`.
3. Avoid pure `#000`/`#fff` grounds in luxury/editorial; use tinted neutrals (e.g. `#0c0b0a`, `#f2eee6`). Pure values are fine for brutalist/tech.
4. Measure every text pair with `scripts/contrast.mjs`. Body ≥ 4.5:1; muted text ≥ 4.5:1 if it carries meaning; large display ≥ 3:1; focus ring ≥ 3:1 against both adjacent colours.
5. Dark mode is a separate palette, not an inversion — re-check contrast and reduce saturation of accents.

## Backgrounds
Solid grounds by default. Gradients only as light (a soft radial falloff that implies a source), grain only at 2–5% opacity with a blend mode, and never animate full-screen backgrounds with CSS filters (expensive) — use a shader or a pre-rendered video if it must move.

## Image treatment
- One treatment family per site: grade (warm/cool/neutral), contrast curve, grain, crop philosophy (tight macro vs. wide environmental).
- Always define focal points so responsive crops (`object-position`) keep the subject.
- Text on images: place in calm regions, add a scrim gradient (≤ 40% opacity) when contrast can't be guaranteed, and test at every breakpoint.

## Video treatment
Muted, `playsinline`, looping only when seamless, poster frame always, pause when off-screen and under reduced motion, provide controls for anything > 5s that conveys information.

## Borders, radii, shadows
Pick one edge language: **hairline** (1px lines at 10–20% ink), **block** (thick, brutalist), or **none** (space-only separation). Radii: 0, small (2–6px) or pill — never a mix. Shadows: in premium flat systems, rarely; if used, soft, large-radius, low-opacity, with a consistent light direction.

## Texture
Noise/grain via a tiny tiled PNG or SVG `feTurbulence` baked to an image, not live filters on large areas. Paper, concrete or metal textures only where the brand's materials justify them.

## Composition
- Rule of one: each viewport has one primary focal element.
- Use the grid to break the grid: elements that deliberately span unexpected columns read as intentional only when everything else is aligned.
- Scale contrast ≥ 1:6 between display and body sizes signals editorial confidence.
- Leave "breathing" sections — full viewports with only a sentence — before and after the signature moment.
