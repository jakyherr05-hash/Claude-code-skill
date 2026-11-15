---
name: Motion (formerly Framer Motion)
url: https://motion.dev/
slug: motion
category: animation-dev
tags: [motion, framer-motion, animation-library, react, vue, dark-ui, particle-canvas, yellow-accent, monospace-ui]
researched: 2026-11-15
status: inspected
confidence: high
evidence: ../evidence/motion/
---

# Motion (formerly Framer Motion)

Claim labels: **[M]** measured (capture.json / devtools) · **[O]** observed in screenshots/behaviour · **[I]** inferred (state the basis) · **[?]** unknown.

## At a glance
Site of Motion, the animation library previously called Framer Motion [M title]. Lesson: a dark, restrained page with a single yellow CTA and a quiet particle-sphere canvas, rather than loud effects; the pitch sits in a tiny install command.

## Design characteristics
- Near-black rgb(14,19,18), off-white text rgb(237,237,236) [M]; one accent: saturated yellow "GET STARTED" button [O]. Colours declared in oklch [M].
- Hero: dotted sphere with a warm orange band of particles [O]; install line "npm install motion && npx motion-ai" in a copyable code box [O]; logo strip (Framer, Cursor, Linear, Figma, Sanity, Clerk) [O].

## Typography
- TASA Orbiter 400–800 (variable) and Geist Mono 100–900 [M]. h1 34.56px/37.32px 700, -1.21px (-0.035em) tracking [M]; h2 "Small APIs. Expressive interfaces." 40px/44px, -1.4px (-0.035em) [M].
- Nav and buttons: small uppercase Geist Mono [O].

## Layout & spacing
- 80px side margins at 1440, 1200px-wide canvas [M]; hero copy bottom-left and install box bottom-right [O]; 18 sections, 13,635px page [M]. Hairline dividers between sections [O].

## Navigation
- Fixed 72px nav [M]: Docs, Examples, AI Kit, search, "Motion+" outlined button [O]. Skip link present [M]. Mobile keeps a compact inline nav (Docs, Examples, AI) [O].

## Animation
- Hero canvas (1 canvas [M]) with particles [O]. 5 example videos (pinch-rotate, pinch-zoom, tap-double, press-hold, animate-suspense by file name) muted loop, not autoplaying at capture [M]. Hatched stripe effect appears on the logo/header in desktop-1 [O].

## Scroll
- Native: scrollY 0 at 16ms, then 600 at 100ms [M]; reached the target within about 6 frames, not interpolated over hundreds of ms; no smoothing library detected [M].

## Image & video treatment
- 58 WebP images [M]; example thumbnails as short looping videos from an images CDN [M].

## Responsive (390px observation)
- No overflow [M]; sphere above copy, install box and full-width CTA stack [O]; h1 30px [M].

## Technical discoveries
- No window globals detected for gsap, Lenis, three, Next, Framer, Webflow [M]; not WordPress [M]. Canvas implementation unknown [?]. A 401 response occurred in console [M].

## Performance (single lab run, indicative only)
- DCL 1089ms, load 3038ms, LCP 1104ms, CLS 0, 142 requests [M].

## Using this resource in the studio
- `npm view motion version` = 14.14.0, depends on framer-motion 14.14.0 (same version), license MIT; peers react ^18 || ^19 [M, 2026-11-15]. Package name "motion" is the current one; "framer-motion" is published at the same version [M].
- Site states it is free and open source, previously Framer Motion [O]. Positions layout, scroll, gestures, 3D and hardware acceleration across React, Vue, JS [O vendor claim].
- Choose: GSAP for timeline/scroll choreography and plugins; Motion for React state-driven UI, layout and gestures [I, based on the feature lists above].

## Useful implementation ideas (original re-implementations, not copies)
- Copyable install line component as the primary CTA companion.
- Negative-tracking (-0.035em) bold grotesk headlines with mono UI labels.
- Thumbnail videos that play only on hover/in-view.

## Unknowns / not verified
- Particle canvas technique [?]; scroll-linked effects below fold [?]; whether the 600px step difference vs native is a smooth-scroll behaviour [?].
