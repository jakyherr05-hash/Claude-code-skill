---
name: Zirka (Shahed interceptor)
url: https://www.zrk.technology/
slug: zirka-interceptor
category: other
tags: [awwwards-sotd-2026, webflow, gsap, scrolltrigger, lenis, defence-tech, hud-overlay, video-hero, dark, mono-labels, orange-accent, loader]
researched: 2026-11-17
status: partially-inspected
confidence: low
evidence: ../evidence/zirka-interceptor/
---

# Zirka (Shahed interceptor)

Claim labels: **[M]** measured (capture.json / devtools) · **[O]** observed in screenshots/behaviour · **[I]** inferred (state the basis) · **[?]** unknown.

## At a glance
A defence-technology product page for an interceptor drone (title "Shahed interceptor with auto-guidance | Zirka"), Awwwards "Site of the Day - Nov 9, 2026" (verified verbatim on https://www.awwwards.com/sites/zirka-interceptor on 2026-11-17). Dark cinematic product footage with a HUD-style overlay (coordinates, mono readouts, orange crosshair) and a 72 px headline bottom-left. The page is 35,640 px tall (~40 viewports) [M], but in this capture each wheel step moved only ~69 px, so the filmstrip covers only the first 629 px (the hero) [M]. Lesson: a HUD layer on top of product footage sells the product's function without extra copy.

## Design characteristics
- Hero: close-up of the product body with raking light and a dark ground; headline "Zirka is a ... interceptor with auto-guidance" lower-left in three lines; "PRODUCT / ZIRKA" tags above it; header with logo, mono nav (Threat, Features, Effectiveness, System) and an orange-outlined "Contact us" button; coordinates X/Y in the bottom corners; a small orange crosshair in the frame [O desktop-0, scroll-00].
- Mobile: an orange loading screen with scattered orange mono characters and X/Y readouts over the video [O mobile-0]; page background rgb(5,5,5) [M].
- In the filmstrip the headline fades to dim grey (scroll-05) and disappears (scroll-09) while the product footage progresses and the object moves right [O].

## Typography
- Loaded: Inter display 500 and Geist mono 400 [M].
- h1: Inter display 500, 72 px / 63.4 px (0.88), tracking -3.6 px (-5%) [M]. h2: 48 px / 43.2 px (0.9), tracking -1.92 px (-4%) [M]. Body 14 px / 20 px [M]. HUD labels are small mono [O].
- Mobile h1 40 px; tablet portrait 38.4 px, landscape 51.2 px [M].

## Layout & spacing
- Header fixed 96 px with 10 links [M]. 133 images (87 PNG, 20 WebP, 26 SVG), 5 videos, 2 canvases 1440x900 [M]; four large fixed/sticky layers in every frame [M].

## Navigation
- Mono labelled anchors across the top plus a contact button; I did not see a mobile menu button (script false [M]).

## Animation
- GSAP 3.15.1 on window with ScrollTrigger global [M]; script URLs: gsap 3, ScrollTrigger, Observer 3.13.0, Lenis 1.0.23 (via studio-freight CDN path) [M]. Webflow `w-mod-ix` present [M].
- Hero video (`HERO_mp4`) and a scroll video (`SCROLL-1_mp4`) plus an autoplay looping video [M]; the headline/footage change over the first 629 px suggests scroll-linked video and text fade [I].

## Scroll
- `lenis` and `lenis-smooth` on html, Lenis global [M]. Wheel 600 moved only 69 px (7 at 16 ms, 23 at 100, 41 at 250, 57 at 500, 66 at 900, 69 at 1,500) [M]; `likelySmoothed` true [M]. The very small distance means hero scroll is damped, intro-locked or mapped to a long pinned stage [?]. The remaining ~35,000 px were not captured [M].

## Image & video treatment
- Dark, low-key product video with a narrow bright rim light; PNG sequence-like image counts (226 `img` requests) suggest frame-sequence or sprite use [I from counts, ?].

## Responsive (390px observation)
- No overflow [M]; the headline fits at 40 px; loader is a full orange panel [O mobile-0]. Tablet portrait: headline lower-left, HUD readout at top [O].

## Technical discoveries
- Webflow + GSAP + ScrollTrigger + Lenis stack (Lenis 1.0.23 from jsDelivr) [M].

## Performance (single lab run, indicative only)
- DCL 1,261 ms, load 7,963 ms, LCP 564 ms, CLS 0.162 [M]; 250 requests (226 images) [M].

## Useful implementation ideas (original re-implementations, not copies)
- HUD overlay on product footage: mono coordinates, a crosshair that follows the pointer, tiny section tags; it signals "instrument" without text blocks.
- Fade the headline from white to dim to gone across the first ~600 px of scroll while the footage advances.
- Use a bright accent (orange) only for the loader, contact button and crosshair against near-black.
- Damped first-screen scroll should be intentional and short; check that the document is still reachable for keyboard and short-wheel users.

## Unknowns / not verified
- Almost the whole page beyond 629 px; the scroll length of the hero; what the 226 images are; sound [?].
