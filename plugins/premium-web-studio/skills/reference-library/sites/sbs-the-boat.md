---
name: SBS: The Boat
url: https://www.sbs.com.au/theboat/
slug: sbs-the-boat
category: other
tags: [documentary, scrollytelling, graphic-novel, canvas, gate, click-to-start, audio, partially-inspected, scroll-unverified]
researched: 2026-11-17
status: partially-inspected
confidence: low
evidence: ../evidence/sbs-the-boat/
---

# SBS: The Boat

Claim labels: **[M]** measured (capture.json) · **[O]** observed in screenshots · **[I]** inferred · **[?]** unknown. Captured with `--tablet --filmstrip 12`; filmstrip.jpg is a contact sheet of the frames, plus desktop-0, mobile-0, tablet-portrait-0. Studied for the OZONE youth-vaping-prevention project; no copy, brand or assets are reused.

## At a glance
A famed interactive graphic-novel documentary. The capture only reached the entry gate: white hand-lettered "CLICK TO START" over drifting white rain streaks on black, with an audio notice ("This site uses audio, headphones are recommended") [O all 12 frames]. docHeight 900 and scrollY 0 throughout [M], one fixed full-viewport canvas [M]. The story itself was not inspected. Lesson for OZONE: only the gate pattern, and the cost of a gate (the story is invisible to automation and to anyone who bounces).

## Design characteristics
- Black ground, white rain particles moving diagonally, tiny footer links (Terms, Privacy, Complaints) and an acknowledgement of country in a dark strip [O].
- Gate copy is lettered in a handwritten face (Stone Informal / Plantin Infant listed in loaded fonts) [M fonts; O].

## Responsive (390px observation)
- Not separately observed beyond no horizontal overflow [M].

## Technical discoveries
- No GSAP/Lenis/Three detected [M]; 5 scripts, 2 console errors [M]. DCL 2,045 ms, LCP 2,668 ms, CLS 0, 74 requests [M].

## Useful implementation ideas (original re-implementations, not copies)
- Using sound needs a user gesture; if OZONE adds ambient audio it must be opt-in and off by default.
- Do not gate the story behind "click to start": OZONE should start with the first beat visible.

## Unknowns / not verified
- Everything after the gate: chapter structure, pacing, text over illustration, mobile story layout [?]. Re-capture needs a click on the gate.
