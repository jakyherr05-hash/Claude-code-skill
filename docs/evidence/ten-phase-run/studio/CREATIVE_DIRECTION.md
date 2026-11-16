# Creative Direction — Halde
_Owner: creative-director · Status: draft (non-interactive; assumptions recorded) · Date: 2026-11-16_
## Concept (one sentence)
**"Brought to centre"**: the page throws the first thing a potter learns, centring the clay, so a slightly wobbling form settles true as the chef scrolls. It is the same steadiness Halde brings to their service.
## Narrative arc
| Beat | Section | What the visitor feels | What they learn |
|---|---|---|---|
| 1 | Hero | Quiet, a held breath; the off-true rings slowly settle | Two people in Bergen throw stoneware for restaurants |
| 2 | How we work (3 steps) | Trust builds one calm step at a time | Talk service + weight → throw + test → deliver in batches |
| 3 | Contact | Resolved, like a finished foot ring | Write to hello@halde.example; both of them reply |
## Design language & rationale
Primary: **warm editorial minimalism**. Accent: **craft / material honesty**. Tension: *handmade ↔ dependable*, *slow ↔ on time*, *quiet ↔ certain*. Chefs judge plates on weight, balance and how well they stack, not on spectacle. So the page works like a well-set pass: centred, sparse, exact. One centred object, small offset labels and a lot of space show calm without saying it.
## Palette (ratios computed by hand with the WCAG 2.x formula; contrast.mjs could not run because Bash was denied; QA must re-verify)
| Token | Value | Role | Contrast target |
|---|---|---|---|
| --clay | #EDE7DD | Ground (bisque, unglazed stoneware) | iron on clay 12.4:1 AAA |
| --slip | #F7F3EC | Raised mat surface for the steps and contact block | iron 13.8:1 · ash 5.8:1 · glaze 7.1:1 |
| --iron | #2A2420 | Text, wordmark, active ring strokes (iron-oxide, not pure black) | AAA for long-form text |
| --ash | #6A5D51 | Labels, step numbers, meta | 5.2:1 on clay, AA |
| --glaze | #3D5752 | Accent under 5% of the surface: links, focus ring, one glaze band | 6.4:1 on clay, AA (fjord-grey celadon) |
| --rule | #C9BFB2 | Hairlines and inactive rings | Decorative only, never used for text |
## Type personality (final fonts in TYPOGRAPHY_SYSTEM.md)
A system serif (Iowan/Charter/Georgia-class) for the display and the body: plain-spoken and slightly bookish, with large sizes set tight and calm. Labels are uppercase ash, widely tracked, like a kiln log. Use tabular figures for 01/02/03. Nothing condensed, nothing quirky.
## CSS-only visual direction (no images or video)
- The only object is a vessel seen from above, drawn in CSS: concentric throwing rings (bordered circles plus repeating-radial-gradient), one glaze band and a foot ring. Each sits in a fixed aspect-ratio box, so CLS stays at 0.
- Surfaces are matte with hairline borders and no shadows. Corners are square except the circles. Optional grain from a CSS gradient at ≤2% opacity.
## Motion personality
- Slow and weighty, like a heavy wheel coasting down. Durations run 0.9–1.6s with a decelerating power3/expo.out ease and no bounce. Lenis glide is about 700ms on the GSAP ticker. Text fades in with opacity only, no slide-up. The wordmark, nav and contact email never move.
- Reduced motion: Lenis is off (native scroll), and the rings render already centred and static. No content waits on an animation.
## Signature moment
**"Coming to centre"**: in the hero, 5–7 CSS rings sit slightly off-axis (each translated and scaled by a few px, at a different offset). A scrubbed ScrollTrigger brings them concentric as the visitor scrolls through the hero, with each ring trailing the one before. In the steps section one ring darkens to iron for each step. At contact the rings rest as a foot ring around the email. Only transform and opacity animate, on about 7 elements.
## Deliberately not doing
WebGL, particles, custom cursor, pixel dissolves, parallax stacks, marquees, split-letter reveals, fake pottery photos, rustic or kraft textures, brush script, dark mode, carousels, or any pin longer than one viewport. Nothing is copied from the references (Typewolf, Instrument, Lenis, Locomotive). Only principles carry over.
## Alternates considered
"Service weight" (a balance diagram) was rejected as too technical. "Kiln log" (a dated, ledger-style page) was rejected as less tactile, with a weaker signature moment.
