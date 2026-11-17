---
name: Igloo Inc.
url: https://www.igloo.inc/
slug: igloo-inc
category: studio
tags: [atmosphere, fog, snow, webgl, three-js, hud-ui, monochrome, partially-inspected, scroll-unverified]
researched: 2026-11-17
status: partially-inspected
confidence: low
evidence: ../evidence/igloo-inc/
---

# Igloo Inc.

Claim labels: **[M]** measured (capture.json) · **[O]** observed in screenshots · **[I]** inferred · **[?]** unknown. Captured with `--tablet --filmstrip 12`; filmstrip.jpg is a contact sheet of the frames, plus desktop-0, mobile-0, tablet-portrait-0. Studied for the OZONE youth-vaping-prevention project; no copy, brand or assets are reused.

## At a glance
A WebGL-only page: a pale blue-grey, foggy arctic scene in which a glowing wireframe igloo assembles itself, camera pulls back, and snow-covered terrain emerges [O filmstrip frames 0-11]. The document did not scroll (docHeight 900, scrollY 0 on all 12 frames and in the wheel sample) [M], yet the scene advanced across frames, so it is either time-driven or driven by a virtual scroller (wheel events captured by the app) [I]; which one is [?]. Lesson for OZONE: the clearest example of fog as the visual medium, plus the failure mode (no real document scroll).

## Design characteristics
- Whole screen is one three.js scene (revision 165 [M]); 0 canvases reported by the DOM probe, so the canvas may be inside a shadow/iframe layer or created later [?].
- Atmosphere: a flat low-contrast haze (rgb 160,165,177 background [M]) with wireframe lines dissolving into mass; the climax frame shows the structure lit from within, bloom on white [O frames 0, 8-11].
- UI is a tiny monospaced HUD in the corners (logo top left, a small data table top right, labels bottom) in white boxes on the haze [O scroll-09..11]; on mobile those boxes show as white redaction bars (text not rendered/loaded in the capture) [O mobile-0].
- Legibility strategy: no text over the scene centre; HUD is boxed with opaque fills. There is no copy-heavy content to test [O].

## Typography
- No fonts reported as loaded [M]; text is in boxes at ~16 px [M largest]. [?] otherwise.

## Responsive (390px observation)
- No overflow [M]; the portrait crop re-frames the igloo centred with corner HUD blocks [O mobile-0].

## Technical discoveries
- three.js 165 [M]; no GSAP/Lenis detected [M]; 88 fetch requests moving ~14.5 MB [M] (assets/models). Heavy.
- DCL 528 ms, LCP 780 ms, CLS 0 [M].

## Useful implementation ideas (original re-implementations, not copies)
- Fog as low-contrast, low-saturation haze with form emerging from it; lighting from inside (glow) rather than particles gives the "reveal".
- Keep text in opaque or scrimmed panels away from the haze; or fade the fog to a flat tone behind prose.
- Avoid: 14 MB of assets; OZONE should use a procedural fragment-shader fog (no downloads), plus a static poster fallback.

## Unknowns / not verified
- Whether scroll/wheel drives the scene; text content; real fonts; behaviour after load [?].
