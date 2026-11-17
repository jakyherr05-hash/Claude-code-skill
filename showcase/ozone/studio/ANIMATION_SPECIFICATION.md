# Animation Specification — OZONE — Clear Air (youth vaping prevention)
_Owner: gsap-animator · Date: 2026-11-17_

## Motion tokens
| Token | Value | Use |
|---|---|---|
| --dur-xs … --dur-xl | | |
| ease-signature | | |

## Global systems
- Scroll: Lenis (lenis-scroll) → GSAP ticker → ScrollTrigger
- Page transitions:
- Reduced motion policy:

## Opening
- First readable content at (s), LCP element and how it stays visible:
- What the intro adds (light / depth / movement), total duration, skipped on return visits?:

## Story beats (scroll-driven pages; see design-intelligence → motion-system "Scroll storytelling")
| Beat | Feel / learn | Picture | Words | Scroll length | Mobile | Reduced motion |
|---|---|---|---|---|---|---|

## Per-section choreography
### S1 · <name>
- Purpose of motion:
- Trigger: load | enter | scrub | pin | hover | drag
- Timeline (time/position → target → props → ease):
- Mobile variant:
- Reduced-motion variant:
- Perf notes (properties animated, will-change, layer count):

## Plugins used (all in the public `gsap` package, Standard no-charge licence)
