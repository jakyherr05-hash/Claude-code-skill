---
name: Unseen Studio
url: https://unseen.co/
slug: unseen
category: studio
tags: [webgl, threejs, wordpress, intro-gate, pastel, light, agency, motion-studio, serif-sans]
researched: 2026-11-15
status: partially-inspected
confidence: medium
evidence: ../evidence/unseen/
---

# Unseen Studio

Claim labels: **[M]** measured (capture.json / devtools) · **[O]** observed in screenshots/behaviour · **[I]** inferred (state the basis) · **[?]** unknown.

## At a glance
Brand/digital/motion studio. The captured state is an entry gate: blush-pink screen, animated cartoon eyes, one-line positioning, an "Enter" pill and "Enter without audio" [O]. Only this gate was inspected - the actual portfolio was not reached. Lesson: an intro gate that sets tone and asks for sound consent in one gesture, with a clear skip.

## Design characteristics
- Flat pale pink (~#f0ddd8, eyeballed from the image [O]); black line illustration; white pill button [O]. Very sparse: everything centred in a ~200px column [O].
- desktop-0 shows the eyes not yet drawn (faded text, "U" glyph) and desktop-1 (taken later) shows them fully drawn: the intro animates in on its own timeline, independent of scroll [O].

## Typography
- Loaded faces: Neue Montreal 400, Saol Display 400 and 400 italic [M]. Saol is not visible in the gate screenshots; its use deeper in the site is [?].
- Body 14.4px/21.6px (0.9rem, 1.5) [M]. Tagline p: 14.4px/16.56px (1.15), tracking -0.36px (-0.025em), grey rgb(66,66,66) [M].
- h2 "Say hello": 86.4px/77.76px (0.9), weight 700 [M] - lives in a later section, not visible [O]. Largest visible text measured: 90px "01 Index" list item [M].
- Caps small-print link "ENTER WITHOUT AUDIO" with underline [O].

## Layout & spacing
- Centred stack: icon, wordmark line, 3-line paragraph (~285px wide [M]), pill, bottom-anchored skip link [O]. Generous empty space (>60% of viewport) [O].

## Navigation
- Fixed `header`, 82px, 4 links [M]; not visible in the gate [O]. Mobile has a menu button [M].

## Animation
- Eyes illustration animates in (fade/draw) [O]. Mechanism [?]. Audio gate implies sound design inside the site [I from "Enter without audio"].

## Scroll
- Wheel 600px: scrollY stayed 0 at all samples, docHeight 900 [M]. Consistent with an intro lock / non-document scroll (html class `asscroll-disabled` [M] suggests a scroll-container library, name resembles ASScroll [I]). Which of intro lock vs virtual scroll applies after entering is [?].

## Image & video treatment
- 0 `img` in DOM at gate time, 1 canvas 1440x900, 30 SVG [M]; 74 img and 31 XHR requests were made (portfolio assets preloaded behind the gate) [M].

## Responsive (390px observation)
- Same centred stack scaled down; no overflow [O/M]. Menu button flag true [M].

## Technical discoveries
- Three.js revision 143 on window [M]; WordPress detected [M] (marker-based; likely headless/theme hybrid [?]). No GSAP/Lenis/Locomotive globals [M]. Google Tag Manager script [M].
- Only 9 script tags in 117 requests [M].

## Performance (single lab run, indicative only)
DCL 1587ms, load 9054ms, LCP 1192ms, CLS 0; networkidle timed out (page keeps loading assets) [M]. 4.6MB via XHR and 2MB images [M]; totals are lower bounds.

## Useful implementation ideas (original re-implementations, not copies)
- Entry gate: fixed full-screen div with central Enter button; on click, resolve a Promise that (a) unlocks the AudioContext (browser autoplay policy needs a gesture), (b) starts the reveal timeline (GSAP timeline or CSS clip-path), (c) removes the gate. Provide a no-audio button that skips (b).
- Use the gate time to preload below-the-fold assets with `fetch`/`Image.decode()` and show real progress.
- Respect `prefers-reduced-motion` by skipping the gate animation and `prefers-reduced-data` for asset preloading.

## Unknowns / not verified
- Everything beyond the gate: work grid, transitions, scroll model, Saol usage, WebGL content.
