---
name: Preymaker
url: https://preymaker.com/
slug: preymaker
category: studio
tags: [awwwards-sotd-2026, nextjs, vfx, fullscreen-video-panels, reel-showcase, new-grotesk, dark, cookie-bar, partially-inspected, scroll-unverified]
researched: 2026-11-17
status: partially-inspected
confidence: low
evidence: ../evidence/preymaker/
---

# Preymaker

Claim labels: **[M]** measured (capture.json / devtools) · **[O]** observed in screenshots/behaviour · **[I]** inferred (state the basis) · **[?]** unknown.

## At a glance
A VFX/visual-content creative collective, Awwwards "Site of the Day - Nov 14, 2026" (verified verbatim on https://www.awwwards.com/sites/preymaker on 2026-11-17). The hero is a looping black feather macro video with a small 40 px statement, followed by full-viewport project video panels. Lesson: let the reels be the site: full-bleed video, a tiny centred title and a "View Work" button per panel. **Caveat: the document did not scroll under wheel input** (docHeight 900, scrollY 0 for all samples and frames [M]), so the filmstrip shows a progression of project panels whose driver (wheel-driven virtual scroll, or time) is [?].

## Design characteristics
- Hero: monochrome feather close-up, headline at mid-right of the lower half, "MENU" top-centre and "SEARCH" top-right, "Scroll Down" bottom [O desktop-0].
- Panels (scroll-01 to scroll-09): each shows a full-bleed video with a centred small uppercase title (Lincoln Navigator, Auto reel vol 2, Anthem reel vol 2, Ford, Kinder, Toyota), a tiny "View Work" button and discipline tags at right (VFX, Color, ...) [O, M headings]. Panels appear to overlap/slide vertically with the next panel's edge visible at the top or bottom [O scroll-03, scroll-07].
- Cookie bar bottom-left on every frame [O].

## Typography
- Loaded: NewGrotesk 400/500/600/700 [M].
- h1: NewGrotesk 600, 40 px / 42 px (1.05), tracking -0.8 px (-2%) [M]. Panel titles 25 px [M, filmstrip]. Small labels 12 px uppercase, tracking -0.24 px [M]. Tablet portrait h1 47 px, landscape 28 px, mobile 24 px [M].
- Very small type relative to the media: the content is the footage [O].

## Layout & spacing
- docHeight 900 [M]; 6 sections, 45 images, 19 `<video>` elements, 6 SVGs; fixed nav 42 px [M]. 1-2 large fixed layers per frame [M].

## Navigation
- Logo (top-left), "MENU" and "SEARCH" text [O]; mobile: logo + MENU [O].

## Animation
- Next.js detected [M]; 27 video requests [M]. No GSAP/Lenis/Three globals [M]. Panel transition mechanism and timings [?].

## Scroll
- Wheel samples 0 at all times [M]. A virtual (wheel-hijacked) scroller or a timed autoplay would fit the frames, but neither is verified [I, ?].

## Image & video treatment
- Cinematic, graded 1080p reel clips from CloudFront (e.g. showreel/auto reel, Lincoln preview) set to muted loop [M]; high contrast, shallow depth of field, cars, creatures, close-ups [O].

## Responsive (390px observation)
- No overflow [M]; the headline moves into the lower-left over the same feather video; cookie bar floats over the lower third [O].

## Technical discoveries
- Next.js, gtag [M]; video served from a CDN [M].

## Performance (single lab run, indicative only)
- DCL 2,209 ms, load 3,731 ms, LCP 3,520 ms, CLS 0.058 [M]; 98 requests [M].

## Useful implementation ideas (original re-implementations, not copies)
- Reel-first portfolio: full-viewport muted video panels, one small centred title, one button, discipline tags small at the right.
- Keep headline copy at ~40 px over video and rely on the footage for drama; hold contrast with a dark gradient.
- Preload only the next panel's video; keep one video playing at a time.
- If using a virtual scroller, still provide a native-scroll fallback and keyboard access.

## Unknowns / not verified
- Scroll driver, panel timing, menu overlay, project pages, sound [?].
