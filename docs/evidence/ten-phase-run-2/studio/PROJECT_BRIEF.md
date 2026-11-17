# Project Brief — Halde
_Owner: orchestrator · Last updated: 2026-11-17 · Track: full production_

## Business
- What it is: Halde, a fictional two-person ceramics studio in Bergen, Norway.
- Offer: wheel-thrown stoneware (plates, bowls, cups) made to order for restaurants.
- Differentiator: small batches thrown by hand, glazes developed with the chef.

## Audience
- Primary: chefs and restaurant owners planning a menu, opening or refit.
- Must believe: these two people will make *my* plates, carefully, and are easy to talk to.

## The feeling: unhurried, tactile, honest.

## Goals
| Goal | Measure |
|---|---|
| Explain the process | 3-step "how we work" read end to end |
| Start a conversation | contact (mailto + email visible) reachable from hero |

## Content inventory
| Item | Exists? | Source / owner |
|---|---|---|
| Copy | no | studio writes placeholder copy (creative-director / frontend) |
| Logo | no | typographic wordmark only |
| Photography / video | no | none — typographic + CSS-only visuals |

## Constraints
- Stack: no build step — `index.html` + `styles.css` + `main.js`, served statically.
- Libraries: only ./vendor — GSAP 3.15.1, ScrollTrigger, Lenis 1.3.27 (+ lenis.css). No network, no npm.
- Single page: hero, how-we-work (3 steps), contact.

## Assumptions (non-interactive run; revisit if wrong)
- A1 Fonts: system font stacks only (no network, no font files supplied).
- A2 Contact = mailto link to a placeholder address (hei@halde.example); no form backend.
- A3 Language: English copy, a few Norwegian words allowed as texture.
- A4 Accessibility: WCAG 2.2 AA; prefers-reduced-motion fully honoured.
- A5 Browsers: evergreen Chromium/Firefox/Safari; QA tests Chromium only.
- A6 No paid assets or services; no analytics.
- A7 No user-supplied references; research uses the existing library only.
