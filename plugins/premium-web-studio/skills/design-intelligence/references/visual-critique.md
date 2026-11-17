# Visual critique: judging the rendered site

The design is what renders, not what the spec says. Run this critique on **screenshots of the running build**, every time a section lands (phase 6), after motion (phase 7) and at Gate B. Code review cannot see any of these failures.

Every item below is here because it slipped past a written spec in this studio's own demo and was caught only by looking: W10 label collision at ≤ 768 px, W14 mobile hero text at 1.2:1 over the light, W16 H1 cut at the fold, W20 landscape contrast, W24 a lone word on the last line after a font swap.

## 1 · Capture what a visitor sees

```bash
# from the reference-study skill; works on localhost
node <reference-study>/scripts/capture-reference.mjs http://localhost:4173/ studio/critique --id r1 --tablet --filmstrip 12
```
This gives 1440 top, 390 top, 768×1024 and 1024×768, plus 12 frames spread over the whole scroll with what is pinned and which headings are on screen at each step (`capture.json → filmstrip[]`). Add a reduced-motion pass (Playwright `reducedMotion: 'reduce'`) and the detail routes. **Open every image.** A critique of images you have not opened is not a critique.

## 2 · The rubric

Score each line **ok / minor / major / blocker** per breakpoint (390 · 768 · 1024 · 1440). Any blocker or more than three majors = the section goes back to its owner.

**A. First viewport (the five-second test)**
- [ ] The concept is legible without scrolling: one dominant element, one line that says what this is, one obvious next step.
- [ ] The headline is not cut by the fold at 390×844 and 1024×768, the two most common failures.
- [ ] Hero text over imagery or WebGL is **measured**: worst pixel under the glyphs, not the average colour (see web-qa contrast test). AA 4.5:1 body, 3:1 large.

**B. Hierarchy**
- [ ] Squint test: blur the screenshot; you can still tell the order of importance. If everything is the same grey, nothing leads.
- [ ] One "very large" thing per viewport; contrast of scale (huge vs small and precise) instead of many medium things.
- [ ] Every section has one job. If a section needs its animation to be understood, the layout is wrong.

**C. Typography**
- [ ] Display breaks are *chosen*: no single word alone on a heading's last line, no one-letter ragged lines. Use `text-wrap: balance` on headings and `pretty` on short italic or lead lines, then **check the screenshot**: wraps change when fonts, widths or copy change.
- [ ] Measure 45–75 characters for body; line-height loosens as size shrinks and tightens as it grows; display tracking negative, small caps/mono positive.
- [ ] No synthesised bold or italic (compare the glyphs: a fake italic is a slanted upright).
- [ ] Two families, three at most, each with a role you can name. Weights and sizes come from the scale, not ad hoc.

**D. Composition and spacing**
- [ ] Edges line up: pick the 2–3 vertical lines content hangs from and verify them in the screenshot (measure x positions in the browser when in doubt).
- [ ] Section rhythm is deliberate: not the same padding everywhere; quiet sections breathe, dense sections are compact.
- [ ] Nothing collides or overlaps unintentionally at any breakpoint (labels, captions, sticky header over anchors).
- [ ] Optical alignment: large display type hangs slightly outside the text edge; icons and punctuation are optically, not mathematically, centred.

**E. Imagery and colour**
- [ ] Crops are art-directed per breakpoint (`<picture>` sources), not one crop scaled. The subject survives on mobile.
- [ ] The accent is rare (< 5 % of the surface). If it is everywhere, it is not an accent.
- [ ] Images, video, WebGL and type feel like one world: same light, same grade, same temperature.

**F. Motion (judge from the filmstrip and a recording, not the spec)**
- [ ] Every frame of a pinned scene is readable; text appears in step with the picture it describes.
- [ ] Pins have a rest at the end and are escapable by scrolling and keyboard. No frame is blank while assets load.
- [ ] The opening reaches readable content within ~1.5 s, and the LCP element is visible in HTML (not faded from 0).
- [ ] Reduced motion shows the complete final state, with nothing hidden behind an animation that did not run.
- [ ] Motion has a material (weight, speed, ease) that matches the brand, and one signature moment stands out because the rest is quiet.

**G. Responsive (each breakpoint is a composition)**
- [ ] 390: designed, not squeezed. Fewer, larger elements; navigation reachable by thumb; targets ≥ 44 px; no hover-only meaning.
- [ ] 768 and 1024: *own* layouts. Tablet portrait is not a stretched phone, tablet landscape is not a shrunken desktop. Check the 1024×768 fold specifically.
- [ ] 1440 and wider: line lengths and image sizes capped; the composition does not drift apart on big screens.

**H. The "default site" detector**: any two of these = generic, push back to the creative director
- Centred hero + three feature cards + logo strip + testimonial carousel, in that order.
- Everything fades up 40 px on scroll with the same duration.
- Gradient blobs or a floating glossy 3D shape that has nothing to do with the product.
- One sans in one weight for everything; identical section padding throughout.
- The same palette and type would fit a competitor unchanged.

## 3 · Write it down

One numbered list per round in PROJECT_STATUS.md or the Gate B verdict:
`#  severity  breakpoint  section  what is wrong (evidence frame)  →  desired outcome  →  owner agent`

Re-capture after fixes and compare the same frames. A fix is closed by a new screenshot, not by the fixer's word.
