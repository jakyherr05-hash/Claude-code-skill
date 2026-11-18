---
name: Das Falter Inferno
url: http://falter-inferno.at/
slug: falter-inferno
category: other
tags: [illustrated-descent, monochrome, dark, drag-navigation, loader, atmosphere, grain, virtual-scroll, partially-inspected, scroll-unverified]
researched: 2026-11-18
status: partially-inspected
confidence: low
evidence: ../evidence/falter-inferno/
---

# Das Falter Inferno

Claim labels: **[M]** measured · **[O]** observed · **[I]** inferred · **[?]** unknown. Captured with `--tablet --filmstrip 12` and a drag/click-through script (evidence/falter-inferno/click/). German-language Austrian newspaper project (URL found via a search result about Falter); studied for atmosphere and loader hand-off only. Nothing reused.

## At a glance
A dark monochrome illustrated "descent": the loader is a grainy black field with one German line (roughly: only whoever dares the deepest abysses is rewarded) and a ring; dragging the ring downward navigates ("click and drag the circle to navigate" [O scroll-06]). After the interaction the loader resolves into a grey painted street at night (cars, a cyclist, a road sign, haze) with the title "DAS FALTER INFERNO." in white serif over it [O click/c4, c8]. Document does not scroll (scrollY 0, docHeight 1900 [M]); further scenes not reached [?].

## Design characteristics
- Loader to scene hand-off in one stage: the grain/dust layer persists from the loader into the painting [O]. A hairline "x" close at top centre, a ring cue at lower centre [O c8].
- Title and sub-line are centred over the busiest part of the picture (cars) in white; contrast is adequate for the title but the thin 13 px-looking sub-line is weak over mid-greys [O c8, I].

## Typography
- "Parkinson Cond" 20 px, 0.6 px tracking for loader copy; serif for the title [M largest text; O].

## Responsive (390px observation)
- Horizontal overflow reported at 390 px [M mobile.horizontalOverflow true]. Layout not otherwise verified [?].

## Technical discoveries
- No GSAP/Lenis/Three globals [M]; LCP 10.2 s, CLS 0, 99 requests [M, single run]; the long LCP is the loader/atmosphere image set [I].

## Useful implementation ideas (original)
- One persistent grain layer from loader through Scene 1 so the hand-off is felt not cut.
- Give the first interaction a physical, minimal affordance (a ring), but also a keyboard/scroll route; drag-only is inaccessible.

## Unknowns / not verified
- All scenes after the opening, audio, mobile behaviour, how the drag maps to depth [?].
