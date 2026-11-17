---
name: Immersive Garden
url: https://immersive-g.com/
slug: immersive-garden
category: studio
tags: [three-js, webgl, nuxt, agency, luxury, serif, light, relief-texture, loader-counter, partially-inspected, scroll-unverified]
researched: 2026-11-17
status: partially-inspected
confidence: low
evidence: ../evidence/immersive-garden/
---

# Immersive Garden

Claim labels: **[M]** measured (capture.json / devtools) · **[O]** observed in screenshots/behaviour · **[I]** inferred (state the basis) · **[?]** unknown.

## At a glance
A digital-experiences studio site (self-described "Innovative digital experiences studio" [O]) opening on a pale grey loader with a counter, then revealing an embossed, bas-relief paper-like WebGL ground with floating project images. Lesson: a restrained serif-on-grey loader and a tactile relief texture make a luxury tone with almost no colour. **Caveat: the document did not scroll under wheel input** (docHeight 900, scrollY 0 in all samples [M]); the filmstrip frames change but cannot be attributed to scrolling, so scroll claims are [?].

## Design characteristics
- Loader: centred row with the logo mark and "IMMERSIVE GARDEN", a one-line studio descriptor in serif, and a two-digit counter that read 82, 98, 99 across captures [O desktop-0, mobile-0, tablet-portrait-0]. Background rgb(232,232,232), text rgb(3,3,3) [M].
- After the loader, a grey embossed floral/animal relief fills the screen; images float over it as rectangles with small captions; "Menu" top-right and "See all projects" bottom-left [O scroll-03, scroll-06, scroll-09].
- Projects shown as framed stills (a dark interior scene, a monogram-pattern object, a watercolour landscape) positioned off-grid at different sizes [O scroll-06, scroll-09].

## Typography
- Loaded: PSTimes 400 (serif), HelveticaNeueRegular 400 [M].
- h1 56 px / 61.6 px (1.1) PSTimes, normal tracking [M]; secondary statement 36 px / 43.2 px (1.2) [M]; nav "Menu" 14 px HelveticaNeueRegular [M].
- Serif for statements, neutral grotesk for chrome [M, O].

## Layout & spacing
- 18 sections, 39 images, 12 canvases (one 1440x900 absolute, several 22x22) [M]. Header absolute with zero measured height (nav is out-of-flow) [M]. Content is placed on an asymmetric, free-floating grid [O].

## Navigation
- Single "Menu" link top-right plus a small icon [M linkCount 1, O]. Mobile has no visible menu button in the loader frame [O mobile-0; script flagged false [M]].

## Animation
- three.js r151 and Nuxt detected [M]; `vue3-lottie` bundle in scripts (Lottie animations used somewhere) [M hint]. The relief is likely a shader/normal-map lit surface [I from appearance]. Trigger and easing [?].

## Scroll
- Wheel 600: 0 at all sample times [M]. The page therefore either listens to wheel events virtually or waits for the loader/intro [I]. Frames 03-09 show progressive content, but the driver (wheel, time or pointer) is [?].

## Image & video treatment
- Stills with a desaturated or soft-grade look floating over the relief [O]; image formats are all "other" (extensionless URLs) [M]. Heavy asset loading: 64 fetch requests ~14.6 MB and images ~4.7 MB in this run [M].

## Responsive (390px observation)
- No overflow [M]; the loader stacks logo, two-line descriptor and counter left-aligned [O mobile-0]; h1 44 px [M]. Tablet portrait similar [O].

## Technical discoveries
- Nuxt, three r151, vue3-lottie, GTM [M]; no GSAP/Lenis globals [M].

## Performance (single lab run, indicative only)
- DCL 901 ms, load 931 ms, LCP 2,796 ms, CLS 0 [M]; 122 requests, fetch ~14.6 MB [M].

## Useful implementation ideas (original re-implementations, not copies)
- A calm loader with a counter and one serif line sets luxury tone before any imagery.
- A single tonal relief texture as a ground plane, with projects "floating" over it at irregular sizes.
- Pair a classic serif at 56 px with 14 px grotesk chrome; keep colour out of the chrome.

## Unknowns / not verified
- What drives the progression; scroll length; menu; sound toggle; project page transitions [?].
