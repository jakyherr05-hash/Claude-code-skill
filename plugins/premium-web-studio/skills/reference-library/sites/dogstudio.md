---
name: Dogstudio / Dept
url: https://dogstudio.co/
slug: dogstudio
category: studio
tags: [atmosphere, webgl, painted-3d, dark-blue, serif-display, gt-sectra, text-over-image, scroll-driven, cookie-banner, outdated-browser-banner]
researched: 2026-11-17
status: partially-inspected
confidence: medium
evidence: ../evidence/dogstudio/
---

# Dogstudio / Dept

Claim labels: **[M]** measured (capture.json) · **[O]** observed in screenshots · **[I]** inferred · **[?]** unknown. Captured with `--tablet --filmstrip 12`; filmstrip.jpg is a contact sheet of the frames, plus desktop-0, mobile-0, tablet-portrait-0. Studied for the OZONE youth-vaping-prevention project; no copy, brand or assets are reused.

## At a glance
Belgian/Chicago creative studio whose hero is a moody, painted 3D wolf in a dark blue-violet atmosphere with floating leaves [O desktop-0]. Docs: 3,881 px [M], one 1440×1190 canvas [M]. Lesson for OZONE: how large light serif type holds its own over an atmospheric dark scene, and where legibility is lost.

## Design characteristics
- Hero headline stacked and right-aligned over the dark left half, away from the subject: "We / Make / Good / ..." in a bold high-contrast display serif (GT Sectra Display 700, 120 px, line-height 107 px (0.89), letter-spacing -23 px [M]) in pure white on near-black blue [O desktop-0].
- Scroll beats change the headline into a list of projects whose type is thin and grey, one highlighted in white as it passes; the wolf drifts and recolours behind [O scroll-02]. In scroll-01, scroll-04 the grey small copy is only partially legible over the brighter areas of the scene [O]; the large white serif headings stay clear.
- Body paragraphs sit in a narrow column on the right on a darker part of the image [O scroll-04/05].
- An orange-red hairline diagonal is the only accent [O desktop-0].

## Typography
- GT Sectra Display (400/700) display, Gilroy 500/700, Heebo 200-500 for UI [M loaded fonts]. h1 is a hidden 14 px "Dogstudio" [M], visible headline is a split-letter div.

## Responsive (390px observation)
- Only a circular loader with a small wolf icon on a dark ground was captured [O mobile-0]; mobile layout is [?]. Tablet: no overflow [M].

## Technical discoveries
- No GSAP/Lenis/Three globals detected [M]; the wheel reached 600 px by the 100 ms sample (0 px at 16 ms), so native or near-native scroll [M] [M]. Outdated-browser banner and a cookie panel overlay the hero in every frame [O].
- DCL 3,185 ms, LCP 5,148 ms, CLS 0.07, 56 requests [M]; 5 console errors [M].

## Useful implementation ideas (original re-implementations, not copies)
- Place type where the atmosphere is darkest and emptiest; the subject sits on the other side. Never put paragraph text over the brightest part of the scene.
- Large high-contrast serif at 100+ px survives atmosphere better than thin grey UI text; reserve thin weights for areas with a scrim.
- Avoid: crude copy as a brand voice (OZONE's tone is the opposite).

## Unknowns / not verified
- How the 3D/painted scene is rendered (canvas, video?) and whether it responds to scroll [?]; mobile layout [?]; cookie and browser banners were not dismissed, so they cover the lower-left of frames.
