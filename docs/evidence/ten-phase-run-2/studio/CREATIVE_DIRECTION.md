# Creative Direction — Halde
_Owner: creative-director · Status: approved, revised after motion critique r2 · Date: 2026-11-17 · Phase 3, rev. Phase 7_
## Concept (one sentence)
**"Centred by hand"**: the page behaves like clay on the wheel: one CSS-drawn plate's throwing rings start slightly off-centre and true up as the chef reads our three steps, so the page acts out the care it describes. (Tension: unhurried ↔ dependable, handmade ↔ exact, small ↔ easy to reach.)
## Narrative arc
| Beat | Section | Feels | Learns |
|---|---|---|---|
| 1 | Hero | calm, invited in | two potters, Bergen, plates made for *your* menu; email visible at once |
| 2 | Steps 01–03 | trust building as the plate centres | we taste, we throw tests, we glaze and deliver: a clear and short process |
| 3 | Contact | ease, warmth | write to two people, not a sales desk: hei@halde.example |
## Design language & rationale
Primary: **quiet editorial craft** (warm paper, one serif voice, hairlines, scale as the only drama). Accent: **technical-drawing exactness** (thin rule lines, 01/02/03 numerals, tracked caps labels like a kiln log). Why for chefs: they read menus and spec sheets, not ads. They trust a precise, unfussy page the way they trust a well-set pass. The serif stands for the hand, the hairlines for consistency across a 120-cover service.
## Palette (measured with contrast.mjs)
| Token | Value | Role | Contrast target / measured |
|---|---|---|---|
| clay | #EFE8DE | ground (~80%) | n/a |
| ink | #2A2320 | headings, body | AAA, 12.70:1 on clay; 10.99:1 on mat |
| slip | #E3D8CA | mat panels, plate body | surface only, never a text ground below 4.5 |
| ash | #62574F | captions, labels | AA, 5.76:1 on clay; 4.99:1 on mat |
| glaze | #2E5B57 | accent (<5%): CTA, focus ring, plate glaze | AA, 6.28:1 on clay (as text); clay-on-glaze 6.28:1 |
| rim | #8F8274 | decorative ring hairlines, rules | 3.08:1 on clay: OK for non-text graphics (1.4.11) |
## Type personality (final stacks → typography-spacing)
A system **old-style serif** for display and body (Iowan Old Style / Palatino / Georgia, for example), calm and bookish, with italic used for one phrase per section. **Small tracked caps** in a system grotesk (ui-sans-serif) for labels and numerals. Display tracking −2% at most. No negative tracking on body text. Serif-to-sans ratio about 4:1.
## Visual direction (no images; typographic + CSS only)
- Single object: a plate seen from above, built from `repeating-radial-gradient` throwing rings (clipped to the rim) plus a **radial glaze pool** with a short feathered edge (~4–5% of radius) that reads as fired, not wet. Size cap ≥1024: `min(40vw, 70svh)`, bleeding ~4% off the right edge. aspect-ratio is reserved, so CLS is 0.
- Tactile relief (resolved): **low**. One SVG feTurbulence grain on clay at ≤4% opacity and a 1px inner highlight on the plate rim. No neumorphism, no drop shadows. Panels are flat mats with rim hairlines.
## Motion personality
- Unhurried and weighted: 600–900 ms, signature ease `power2.out` (no overshoot), stagger 80 ms, one reveal per block. Lenis lerp ≈0.1 (softer than native, gentler than Floema). Never moves: body copy after it lands, the email link, the nav.
## Signature moment: "centring"
On desktop (≥1024) the plate sits in a **sticky** right column beside steps that **scroll plainly** (resolved: no pinning, no scroll-jacking; each step is about one viewport). One ScrollTrigger scrub (`power2.inOut`) across the steps. **The plate (rim) never moves and nothing rotates**: like the wheel head, it stays still while the clay moves. The rings start **eccentric inside the rim** (~3% right, ~1.5% up, blur 1px) and true to 0 / sharp by scrub ~0.66, mostly during 02 Throw. Then, from scrub **0.55**, the **glaze pools outward from the centre** (scale 0.15→1 with opacity, translucent at first so the rings show through), full as 03 Glaze leaves and held into contact. Order is the story: tasted, centred, then glazed. At 390/768 the plate is inline under the hero (static, true, glazed) and the steps stack with simple reveals. Reduced motion and no-JS: plate true and glazed, Lenis off, no transforms. Cost: transform/opacity on two children plus one blur custom property, and no WebGL.
## First viewport
- 1440 / 1024: wordmark "Halde" in huge serif, left; a 2-line statement (≥1280) plus email; the plate (`min(40vw, 70svh)`) bleeds ~4% off the right edge, rings off-centre, whole rim above the fold.
- 768: wordmark ~0.8 of the width (fallback-safe cap), statement below, plate (60vw) hung on the text edge beneath; no deliberate peek (measured r2: at 768×1024 the fold grazes the bottom ~12% of the plate, which is accepted, since the object still reads whole).
- 390: wordmark, statement and "hei@halde.example" link above the fold, with the **whole plate also in the first viewport** (no peek; the hairline + "How we work" at the fold invite scroll). H1 is never cut.
## Placeholder copy
Hero h1 "Halde": "Plates thrown by two potters in Bergen, glazed for one kitchen: yours." CTA "Write to us: hei@halde.example". Steps: **01 Taste**, "We sit at your pass, eat the menu, talk about weight and colour." **02 Throw**, "Test pieces in a week. Hold them, plate on them, tell us what's wrong." **03 Glaze**, "Your glaze, mixed for your food. Small batches, fired and delivered." Contact: "Opening, refit or one new dish? *Hei* is enough." mailto:hei@halde.example.
## Deliberately not doing
Loader or intro gate; pinned scroll-jack or horizontal scroll; parallax stacks; faux-photo pottery or illustrations; skeuomorphic/neumorphic clay; rounded cards and pill buttons (edge = 0 radius, hairlines); multi-accent palette; cursor followers; contact form or modals; counters.
## Alternates considered
- "Kiln log" (page set like a firing record) was too cold for "easy to talk to". "Glaze test tiles" (a grid of CSS swatches) was too close to a generic card grid.
