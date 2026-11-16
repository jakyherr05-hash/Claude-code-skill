# Design Specification — Halde
_Owner: ui-ux-designer · 2026-11-16 · Plain HTML/CSS/JS, no images. Type sizes and spacing numbers live in the TYPOGRAPHY and SPACING files; this doc owns composition. Tokens: --clay --slip --iron --ash --glaze --rule._
## Sitemap & navigation
- One page, DOM order: skip link, `<header>`, `<main id="main" tabindex="-1">` (#top hero, #how, #contact), `<footer>`. First focusable is `<a class="skip" href="#main">Skip to content</a>`, visible on focus only.
- Header (static, never animates): wordmark "Halde" (link to #top, `data-nav="top"`) left; right: `How we work` (#how), `Contact` (#contact), `data-nav` on each. Same at 390 and 1440 (two links fit, so no burger and no focus trap). Link targets ≥44x44px. Current section: `aria-current="true"` plus a 1px --glaze underline on the link whose section holds the viewport centre (IntersectionObserver).
- Anchors: sections get `scroll-margin-top` = header height. After a jump, focus moves to the section heading (`tabindex="-1"`). Lenis `scrollTo` when active, native when reduced motion.
- Footer: `© Halde, Bergen` (fictional placeholder) as a small ash label. No cursor effects; nothing is hover-only.
## S1 · Hero `<section id="top" data-section="hero" aria-labelledby="h-hero">`
- Purpose: say who and what in one breath, and show the object.
- Copy: label `BERGEN · STONEWARE FOR RESTAURANTS`; h1 `Plates and bowls, thrown by two people.`; sub `Halde makes stoneware to your service and your weight. By hand, in small batches.`; CTA `Write to us` (mailto) plus text link `See how we work` (#how).
- 390: single column, text first, then the vessel (full gutter width, `aspect-ratio:1`), left-aligned. 1440: 12-col grid; text in cols 1-6 centred vertically, vessel in cols 8-12; min-height 100svh.
- Vessel: `<div data-rings="hero" aria-hidden="true">` with 7 `<span data-ring="1..7">` (1 outermost), circles with a 1px --rule border; ring 5 has `data-glaze` (the one --glaze band); ring 7 is the foot ring. The default CSS state is centred (works without JS); JS sets the off-axis start state only when motion is allowed.
- Motion hook (gsap-animator): scrubbed `data-ring` offsets go to 0 across the hero, each ring trailing the previous; `data-reveal` on label, h1, sub and CTA fades opacity-only on load. Reduced motion: no offsets, no fades.
- A11y: the only h1; the vessel is decorative (aria-hidden, no alt) and never holds text.
## S2 · How we work `<section id="how" data-section="steps" aria-labelledby="h-how">`
- Purpose: the chef grasps the process in one scroll.
- Copy: label `HOW WE WORK`; h2 `Three steps, no surprises.`; `<ol data-steps>` of `<li data-step="1|2|3">`, each with `<span class="num">01</span>`, an h3 and a p. 1 `Talk service and weight`: `Tell us the menu, the pass and how plates are stacked and carried. We agree sizes and weight on paper.` 2 `Throw and test`: `We throw a sample set and send it. You run it through a real service, then tell us what to change.` 3 `Deliver in batches`: `Batches are made on dates we agree up front. We tell you early if a date moves.`
- 390: steps stacked at full width on --slip, 1px --rule border, square corners, num above h3. 1440: h2 in cols 1-4 top-aligned; the 3 steps in one row across cols 5-12 as equal cards. No pin, no horizontal scroll.
- Interaction: steps are static text (not links, no hover change). Each step holds `<span data-step-ring aria-hidden="true">`, a small circle, --rule when inactive.
- Motion hook: when `data-step="n"` enters the viewport (ScrollTrigger, once) its `data-step-ring` gets `.is-active` (--iron; transform/opacity/colour only). Reduced motion: all three are active from the start.
- A11y: the ol announces "list, 3 items"; the heading order is h2 then h3s.
## S3 · Contact `<section id="contact" data-section="contact" aria-labelledby="h-contact">`
- Purpose: one clear action.
- Copy: label `CONTACT`; h2 `Write to us.`; p `Both of us read every message and reply within two working days.`; link `hello@halde.example` (`<a href="mailto:hello@halde.example?subject=Stoneware%20enquiry" data-cta="email">`); meta `Bergen, Norway`. No form, phone or newsletter.
- 390: stack on a --slip block, left-aligned, email never clipped (`overflow-wrap:anywhere`), link ≥44px tall. 1440: centred block of about 8 cols; `<div data-rings="foot" aria-hidden="true">` holds 3 `data-ring` circles behind the email as a foot ring (`pointer-events:none`).
- Motion hook: foot rings fade opacity 0 to 1 on entry; the email never moves. Reduced motion: static.
- A11y: the email is real, selectable text inside a real link.
## States (nav links, CTA, text links, email)
- Default: --iron text, links underlined 1px at 0.2em offset. Hover (inside `@media (hover:hover)`): text and underline → --glaze, no movement. Focus-visible: 2px --glaze outline, 3px offset, never removed (skip link too). Active: --iron, 2px underline. Primary CTA (`.btn`, `data-cta="primary"`): --iron fill, --clay text (12.4:1), ≥48px tall; hover fill → --glaze; same focus ring. Disabled, loading, error and empty do not apply (no form, no async).
## Responsive & accessibility
- Mobile-first from 390; 768 only widens gutters (hero and steps stay stacked); ≥1024 gives the two-column hero and the steps row. No horizontal overflow at 320. The vessel has a fixed aspect-ratio (CLS 0). Scrub behaves the same on touch; there are no desktop-only effects.
- Landmarks: header, nav (`aria-label="Primary"`), main, footer. Outline: h1, h2 (How), h3 x3, h2 (Contact). `lang="en"`. Focus order = DOM order: skip, wordmark, How, Contact, CTA, See how, email. Contrast: iron/clay 12.4, ash/clay 5.2 (labels), glaze/clay 6.4; --rule never for text (QA to re-verify). Reduced motion: Lenis off, rings static and centred, no fades. All content is visible with JS off.
## Conversion / CTA strategy
- One quiet action, the mailto: hero `Write to us` (filled), header `Contact`, and the contact block. Secondary: `See how we work`. No urgency, pop-ups or dark patterns. Measure: clicks on `data-cta`.
## DOM hooks (contract with animation and CSS)
`data-section`, `data-rings="hero|foot"`, `data-ring="1..7"`, `data-glaze`, `data-steps`, `data-step="1..3"`, `data-step-ring`, `data-reveal`, `data-nav`, `data-cta`; class `.is-active`. Never rename without telling the animation owner.
