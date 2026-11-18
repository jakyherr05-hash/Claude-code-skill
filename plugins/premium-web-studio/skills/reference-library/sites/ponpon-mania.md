---
name: Ponpon Mania
url: https://ponpon-mania.com/
slug: ponpon-mania
category: other
tags: [interactive-comic, illustration, flat-colour, thick-outline, recurring-character, nuxt, webgl, chapter-select, panel-navigation, loader-hand-off, sound, partially-inspected, scroll-unverified]
researched: 2026-11-18
status: partially-inspected
confidence: low
evidence: ../evidence/ponpon-mania/
---

# Ponpon Mania

Claim labels: **[M]** measured · **[O]** observed in screenshots · **[I]** inferred · **[?]** unknown. Captured `capture-reference.mjs https://ponpon-mania.com --tablet --filmstrip 12` plus a click-through script (evidence/ponpon-mania/click/). Studied for OZONE (cigarette-prevention graphic novel); none of its art, characters or copy is reused.

## At a glance
An interactive comic (title "Ponpon Mania - Interactive Comic" [M]) by an illustrator and a developer. One lesson: the home screen IS the first scene. A cut-out illustrated stage (outlined cloud-shaped frame, a recurring sheep, wolf and dinosaur, city skyline, sunset) sits behind a single "read now" pill; chapters appear as discs/album-cover cards. Partially inspected: the document does not scroll (docHeight 900, wheel samples null across all frames) [M], so panel-to-panel camera moves were not reached [?].

## Design characteristics
- Flat saturated colour (violet ground, orange sky, pink clouds, green dinosaur) with a heavy near-black outline on every shape [O desktop-0]. Characters keep the same proportions and outline weight in every frame seen (hero and chapter covers) [O desktop-0, click/c5].
- The scene breathes between frames: clouds and a moon move, a blue creature appears at lower left between desktop-0 and scroll-05 [O], so the idle loop is layered movement, not one looping GIF [I].
- Cookie bar sits over the lower edge of the art on first paint [O]; "accept" was not clickable through the text locator [M log] so it stays open.

## Typography
- One loaded face, Libre Franklin 100-900 [M]; wordmark is a bespoke lettered logo [O]. Nav "chapters / about" 15 px bold [M]. No type is placed inside the artwork on the home scene [O].

## Navigation / interaction
- Wheel on the home led to /chapters [M final URL]: a radial orange-to-pink disc with tilted record-sleeve covers; one chapter shows a music-player pill ("05.wow ...", track title, prev/next) [O click/c1, c5]. Sound exists as a visible player, not a hidden autoplay [O]; whether audio plays before a gesture is [?].
- Mobile 390: lilac screen with a small spinner and a dimmed "read now" pill; the illustration had not painted yet at capture [O mobile-0]. Tablet portrait: same, pill lower centre [O]. No overflow [M].

## Technical discoveries
- Nuxt marker [M]; no GSAP/ScrollTrigger/Lenis/Three globals [M] (the Codrops article cited in search results says WebGL and GSAP [?, not read: HTTP 403]). 201 requests, LCP 1.26 s, CLS 0.002 [M, single lab run].

## Useful implementation ideas (original)
- Make Scene 1 the load destination: after the loader, the page is the hero illustration with one clear action.
- A strict character rig (same outline weight, proportions, colour set) is what makes a cast feel authored.
- Chapter select as a spatial object (disc) rather than a menu list; OZONE can show seven scene markers as one strip.

## Unknowns / not verified
- Panel camera moves, transitions between chapters, audio autoplay policy, reduced-motion, real mobile story layout [?].
