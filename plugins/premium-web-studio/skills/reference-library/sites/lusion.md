---
name: Lusion (About page)
url: https://v2.lusion.co/about/
slug: lusion
category: studio
tags: [three-js, webgl, agency, real-time-3d, particles, serif, dark, partially-inspected, scroll-unverified]
researched: 2026-11-17
status: partially-inspected
confidence: low
evidence: ../evidence/lusion/
---

# Lusion (About page)

Claim labels: **[M]** measured (capture.json / devtools) · **[O]** observed in screenshots/behaviour · **[I]** inferred (state the basis) · **[?]** unknown.

## At a glance
The About page of the Lusion real-time studio (v2 domain), captured at `/about/` not the home page [M finalUrl]. A full-screen WebGL scene of a glowing particle runner in a tunnel of neon streaks sits under a small centred serif title. Lesson: one hero idea executed in real-time 3D, with almost no UI on top. **Caveat: the document did not scroll under wheel input** (docHeight 900, scrollY 0 in every sample and filmstrip frame [M]), so the filmstrip does not show a scroll story and all scroll-related claims here are [?].

## Design characteristics
- Near-black navy scene (body bg rgb(16,16,16)) with magenta/blue light streaks radiating from a vanishing point; a translucent wireframe/particle humanoid runs on a reflective floor [O desktop-0].
- Title "About Lusion" in a light serif at the centre-left with a one-line mono-ish subhead; thin vertical "SCROLL TO SEE MORE" label bottom-left; tiny links top-right [O].
- Across the ten filmstrip frames the runner changes pose and position, the title fades out and a small paragraph block appears at the right [O scroll-00, scroll-05]. Whether this is driven by wheel input, time, or a virtual scroll is [?] because the document height stayed at 900 [M].

## Typography
- Loaded: GT-Sectra-Fine 400 and Bold 700 (display serif), nb_akademie Light 400 and Medium 700 (UI/body) [M].
- h1 60 px / 60 px (1.0), normal tracking, GT-Sectra-Fine [M]. Body 15 px / 17.25 px, nb_akademie_light [M]. Nav links 12 px uppercase, tracking 1.2 px (10%) [M]. Largest paragraph text 24 px and eyebrow 9 px [M, filmstrip].
- The font stacks include CJK fallbacks (Microsoft Yahei etc.) [M].

## Layout & spacing
- 3 sections, 28 links, 11 SVGs, 13 canvases (one fixed 1440x900, four 960x864 static) [M]. Header absolute, 34 px high, 6 links [M].
- Page chrome is minimal; the canvas is the layout [O].

## Navigation
- Home / About / Work / Contact text links top-right with an underline on the active item, plus a small icon [O]. Mobile shows the logo and a hamburger [O mobile-0] (menuButton flagged false by the script, so that detection missed it [M, O]).

## Animation
- three.js r128 (dev build) loaded from `/assets/js/three.r128.dev.js` [M]. html classes `use-webgl`, `is-ready`, `at-about` [M].
- Page-level transitions and scroll mapping [?].

## Scroll
- Wheel samples all 0 [M]: native or Lenis scrolling is not in play for this page's document [M, I]. Whether it uses a virtual scroll listening to wheel events and moving the camera is [?] (no evidence either way except the changing frames).

## Image & video treatment
- No `img` or `video` elements [M]; everything is canvas [M, O].

## Responsive (390px observation)
- No overflow [M]; h1 37.5 px [M]; the scene re-crops with the runner centred and the title crossing him [O mobile-0]. Tablet portrait: same composition [O].

## Technical discoveries
- three r128dev, Google Analytics and gtag [M]; no GSAP/Lenis/ScrollTrigger globals [M]; no framework detected [M].

## Performance (single lab run, indicative only)
- DCL 945 ms, load 2,371 ms, LCP 1,036 ms, CLS 0 [M]; 37 requests; XHR ~2.0 MB and images ~2.0 MB transferred (likely model/texture data [I]).

## Useful implementation ideas (original re-implementations, not copies)
- Let one real-time scene be the whole page for an About: small serif title, minimal links, thin vertical scroll hint.
- Give the scene a floor reflection and radial speed lines to create depth without text.
- Keep UI text at 9-15 px so the 3D hero stays dominant; use a serif at 60 px for the single title.

## Unknowns / not verified
- Scroll behaviour and story, hover/cursor interactions, how the title/paragraph swap is triggered, home page [?].
