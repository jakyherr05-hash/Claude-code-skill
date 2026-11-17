---
name: Minh Pham (portfolio)
url: https://minhpham.design/
slug: minh-pham
category: studio
tags: [three-js, lenis, portfolio, gate-start-button, uppercase-display, dark, mascot, partially-inspected, scroll-unverified]
researched: 2026-11-17
status: partially-inspected
confidence: low
evidence: ../evidence/minh-pham/
---

# Minh Pham (portfolio)

Claim labels: **[M]** measured (capture.json / devtools) · **[O]** observed in screenshots/behaviour · **[I]** inferred (state the basis) · **[?]** unknown.

## At a glance
A designer's portfolio that opens on a black gate with a small cat-in-moon mark and a pill "START" button [O]. The capture never passed the gate: all ten filmstrip frames, plus desktop, mobile and tablet frames, show the identical gate [O]. **The document did not scroll under wheel input** (scrollY 0, `lenis-stopped` class [M]), so scroll behaviour is [?]. The DOM text does reveal the structure beneath the gate. Lesson: a deliberate click-to-start gate doubles as audio/autoplay permission and as a brand moment, but it hides content from automated captures and costs a click for every visitor.

## Design characteristics
- Gate: near-black rgb(13,13,13), centred mark, thin-outline pill "START" with wide letter-spacing [O]. Text colour rgb(183,171,152) warm sand [M].
- DOM beneath the gate contains oversized uppercase statements ("making good ... since 2009", "Hiding bad ... since 2009") and a "3D" heading [M text], plus About / Work / Contact links and a "Start 100%" progress label [M body text].

## Typography
- Loaded: Avant Garde 600 and Nunito Sans (variable 200-1000) [M].
- h1/h2: Avant Garde 700, 116.67 px / 98 px (0.84), tracking -5.83 px (-5%), uppercase [M]. Eyebrow p: 11.67 px, uppercase, tracking 5.83 px (50%), weight 700 [M]. Body/nav 13.33 px [M].
- Mobile h1 76.4 px; tablet portrait 96 px, landscape 110 px [M].

## Layout & spacing
- Header fixed, 4 links; docHeight 9,777 px (~10.9 viewports) [M]; 21 images, 3 videos, 1 fixed canvas 1640x1100, 6 SVGs, no `section` elements [M]. Two h1 elements [M].

## Navigation
- Fixed header with About / Work / Contact [M]; hidden behind the gate [O]. Mobile: Menu button flagged [M].

## Animation
- three.js r137 [M]; hero video `hero.mp4` autoplays (muted, loop) and `reel.mp4` is paused [M]. Generator meta credits a creative developer, 2023 [M]. Motion beyond the gate [?].

## Scroll
- Lenis is present but stopped (`lenis-stopped` class) [M, O]; scroll likely unlocks after START [I]. Wheel samples all 0 [M]. Everything else [?].

## Image & video treatment
- Not visible; DOM lists 11 JPG, 8 SVG, 1 GIF, 1 PNG [M]. Video weight in the run ~9.9 MB [M].

## Responsive (390px observation)
- No overflow [M]; gate scales up (button larger) [O mobile-0].

## Technical discoveries
- three r137, generator meta "Powered by ... Creative developer." [M]; Google Analytics [M]; audio request present (1) [M].

## Performance (single lab run, indicative only)
- DCL 1,793 ms, load 2,289 ms, LCP 2,196 ms, CLS 0.001 [M]; 49 requests; video ~9.9 MB [M]. Network-idle timeout during capture [M].

## Useful implementation ideas (original re-implementations, not copies)
- If using a start gate, make it do real work: unlock audio, preload assets with a progress count, start Lenis only then.
- Expose gate-hidden content to crawlers and a no-JS fallback; document the gate when capturing.
- Uppercase 117 px display at 0.84 line-height and -5% tracking, paired with 50%-tracked micro-labels, is a strong scale contrast to test.

## Unknowns / not verified
- Everything behind the gate: hero video, scroll story, cursor ("no-system-cursor" class suggests a custom cursor [M class, I]), work pages [?]. Re-capture with a click on START.
