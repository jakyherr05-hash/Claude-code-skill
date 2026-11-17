---
name: Cyera AI Guardian ("Secure the Unknown")
url: https://secure-the-unknown.cyera.com/
slug: cyera-ai-guardian
category: other
tags: [awwwards-sotd-2026, active-theory, webgl, browser-gate, not-inspected, immersive-campaign]
researched: 2026-11-17
status: partially-inspected
confidence: low
evidence: ../evidence/cyera-ai-guardian/
---

# Cyera AI Guardian ("Secure the Unknown")

Claim labels: **[M]** measured (capture.json / devtools) · **[O]** observed in screenshots/behaviour · **[I]** inferred (state the basis) · **[?]** unknown.

## At a glance
A campaign microsite for Cyera, Awwwards "Site of the Day - Nov 11, 2026" (verified verbatim on https://www.awwwards.com/sites/cyera-ai-guardian on 2026-11-17), credited to Active Theory on that Awwwards page. **The automated browser only received an unsupported-browser page**: title "Not Supported", one h1 "Your browser is not supported" in Times New Roman, black on white, in every desktop, mobile, tablet and all ten filmstrip frames [M, O]. No design, typography, motion or scroll behaviour of the real experience was captured, so every design claim here is [?].

## Design characteristics
- Only the fallback page: white background, bold serif sentence top-left [O desktop-0, mobile-0, tablet-portrait-0].

## Typography
- Fallback only: Times New Roman 32 px bold, no custom fonts loaded (document.fonts empty) [M]. Real typography [?].

## Layout & spacing
- docHeight 900; 0 images, 0 canvases, 0 links [M]. Real layout [?].

## Navigation
- [?]

## Animation
- [?]. Seven scripts requested (GTM and gtag among them) [M]; 0 network requests recorded by the Performance API, because the page stops at the gate [M].

## Scroll
- Wheel samples all 0; no scroll content [M]. Story [?].

## Image & video treatment
- [?]

## Responsive (390px observation)
- Same unsupported message; no overflow [M, O]. Real responsive behaviour [?].

## Technical discoveries
- The gate resembles the one captured on activetheory.net [O vs library entry activetheory]; a capability check (probably WebGL/GPU related) failed under headless Chromium [I, basis: same text, same tool]. Active Theory credit comes from Awwwards, not from the capture [?].

## Performance (single lab run, indicative only)
- DCL/load 355 ms, LCP 368 ms, CLS 0 [M]; meaningless because only the gate loaded.

## Useful implementation ideas (original re-implementations, not copies)
- Principle for our own builds: a capability gate must still describe the experience (static poster, text, video) so crawlers, headless QA and older devices get content; this page shows what happens when it does not.
- Re-capture requirement: use a headed browser with GPU (or a WebGL-enabled launch flag) before drawing any lesson from the site itself.

## Unknowns / not verified
- All of it. Re-capture headed with GPU, then update this entry and the "Known gaps" list [?].
