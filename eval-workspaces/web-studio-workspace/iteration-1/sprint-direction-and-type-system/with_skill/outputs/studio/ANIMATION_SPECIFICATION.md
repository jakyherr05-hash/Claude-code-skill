# Animation Specification — Aster C1 Launch
_Owner: gsap-animator · Date: 2026-11-15_

## Motion tokens
| Token | Value | Use |
|---|---|---|
| --dur-xs … --dur-xl | | |
| ease-signature | | |

## Global systems
- Scroll: Lenis (lenis-scroll) → GSAP ticker → ScrollTrigger
- Page transitions:
- Reduced motion policy:

## Per-section choreography
### S1 · <name>
- Purpose of motion:
- Trigger: load | enter | scrub | pin | hover | drag
- Timeline (time/position → target → props → ease):
- Mobile variant:
- Reduced-motion variant:
- Perf notes (properties animated, will-change, layer count):

## Plugins used (all in the public `gsap` package, Standard no-charge licence)
