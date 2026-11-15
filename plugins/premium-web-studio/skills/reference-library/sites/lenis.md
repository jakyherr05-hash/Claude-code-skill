---
name: Lenis
url: https://lenis.darkroom.engineering/
slug: lenis
category: animation-dev
tags: [lenis, smooth-scroll, darkroom, webgl, three, nextjs, blackletter, dark-ui, pink-accent, showcase]
researched: 2026-11-15
status: inspected
confidence: high
evidence: ../evidence/lenis/
---

# Lenis

Claim labels: **[M]** measured (capture.json / devtools) · **[O]** observed in screenshots/behaviour · **[I]** inferred (state the basis) · **[?]** unknown.

## At a glance
Site of the Lenis smooth-scroll library by darkroom.engineering. The URL redirected to https://lenis.dev/ [M finalUrl]. It is a living demo: it runs Lenis itself over a WebGL hero, so it doubles as feel-test reference for smooth scroll.

## Design characteristics
- Pure black ground (rgb(0,0,0)), off-white text rgb(239,239,239) [M], salmon-pink accent on wordmark and buttons [O]. Ember/particle WebGL background with glowing red "hands" shapes [O].
- Hero wordmark "LENIS" in a blackletter-style display face spanning full width, with "SMOOTH SCROLL" right-aligned beneath [O]. The wordmark face is not in loadedFonts [M], so it is likely an SVG/canvas/image asset [I].

## Typography
- Loaded [M]: Anton 400 (body default), Roboto 400/900, Panchang 700. h2 "Smooth Scroll" Panchang 700 52px/46.8px (line-height 0.9) [M]. h1 text is 14px Roboto 900 [M] (a small label; the huge wordmark is not the h1 text) [I].
- Small uppercase Roboto Black for nav and tagline [O].

## Layout & spacing
- Doc height 37,462px [M] (long scroll story), 5 sections [M], 56px fixed header with 6 links: Showcase, Templates, Submit, logo, Documentation, Sponsor [O]. Pill buttons with left icon tile ("Documentation", "Showcase") [O].

## Navigation
- Fixed header [M]. Mobile: logo centred, hamburger right [O].

## Animation
- Hero ember canvas and a custom ring cursor appearing after scroll [O]. 16 video elements (5 listed, muted loop) [M]. Text under the hero begins to appear at the bottom of desktop-1 ("Smooth scroll used to be a hard sell…") [O].

## Scroll
- Smoothed: after one 600px wheel gesture scrollY = 188, 405, 551, 592, 600, 600 at 16/100/250/500/900/1500ms [M]; only 31% at 100ms. Class on html and window.lenis present [M]. That's an eased glide of roughly 500–900ms [I].
- README default respectReducedMotion is true [M, studio-verified].

## Image & video treatment
- 18 images (format unlabelled), 16 videos, 1 full-viewport canvas 1440x900 [M]. Videos are lazy [I] (4 video transfers only).

## Responsive (390px observation)
- No overflow [M]; wordmark fills the width; CTAs stack full width; largest text 58px [M]; menu button [M].

## Technical discoveries
- Lenis (html class + global) [M], three.js r182 [M], Next.js [M] with Turbopack chunk names [M libraryHints], Vercel insights script [M]. GSAP not detected [M] (no window.gsap).

## Performance (single lab run, indicative only)
- DCL 696ms, load 1849ms, LCP 820ms, CLS 0, 65 requests, 706 KB script (35 files) [M]; networkidle timeout (continuous WebGL/video) [M].

## Using this resource in the studio
- npm lenis@1.3.27 is latest [M]. Recommended GSAP pairing from the README: `lenis.on('scroll', ScrollTrigger.update); gsap.ticker.add((t)=>lenis.raf(t*1000)); gsap.ticker.lagSmoothing(0)` [M, studio-verified].
- Option respectReducedMotion defaults to true [M]: users with reduced motion get native scroll; test with that preference on.
- Smoothing is inferred from the sample curve above; to compare any other site use the same probe.

## Useful implementation ideas (original re-implementations, not copies)
- Single shared RAF/ticker for scroll + WebGL uniforms (feed scroll progress as a uniform).
- Long scroll story with sticky text blocks over a persistent canvas.

## Unknowns / not verified
- Lenis options used on this site (lerp/duration) [?]; wordmark asset type [?]; section content below the hero [?].
