# Reference Research — Halde
_Owner: reference-researcher · Date: 2026-11-16 · Source: existing library only (no new captures, screenshots not re-opened)_
Labels: **[M]** measured · **[O]** observed · **[I]** inferred · **[?]** unknown. Labels are inherited from library entries (researched 2026-11-15, one lab run).
Honest gap: the library has no ceramics, craft, food or hospitality site. Picks rest on transferable principles only.

## Selected references
### 1. Typewolf — https://www.typewolf.com/ (researched 2026-11-15; entry `sites/typewolf.md`)
- Lesson: warm, tinted ground plus one serif family reads calm and tactile with no motion. [M] 0 scripts, 0 canvases; [M] body rgb(230,221,222) on text rgb(68,50,53).
- Type/layout: [M] 16/24 body, h2 42/50.4, letter-spacing normal; [O] white mats around thumbnails (print-proof feel), hairline rule, centred masthead.
- Scroll: [M] native (600px reached at 16ms). Confidence: high.
### 2. Instrument — https://www.instrument.com/ (2026-11-15; `sites/instrument.md`)
- Lesson: one calm serif statement in a narrow column with big whitespace carries hierarchy. [O] statement ~45px, ~550px column (size [?] unmeasured); [M] eyebrow 12px uppercase, 0.11em tracking.
- Scroll: [M] native, no Lenis. [M] CLS 0.107: reserve media with aspect-ratio. Agency/tech tone is not a match. Confidence: high (layout), low (serif size).
### 3. Lenis site — https://lenis.darkroom.engineering/ (redirects to lenis.dev) (2026-11-15; `sites/lenis.md`)
- Lesson: the only measured smooth-scroll curve for "unhurried". [M] 600px wheel gave 188/405/551/592/600 at 16/100/250/500/900ms, so a glide of about 500-900ms [I]. [M] CLS 0.
- Caution: [O] black, WebGL, particles, custom cursor. Take the feel, not the look. Lenis options used [?]. Confidence: high.
### 4. Locomotive — https://locomotive.ca/ (2026-11-15; `sites/locomotive.md`)
- Lesson: the subtle end of Lenis. [M] 476/576/594/600 at 16/100/250/500ms (fast ease-out tail), lerp ~0.1-0.15 [I]. Compare with ref 3 to choose a slower value.
- Type: [M] display serif h1 70/77px (1.1); [O] offset editorial labels around a centred object. Fits a CSS-drawn "object" idea.
- Avoid: [M] CLS 0.923, pixel-dissolve hero, three.js. Confidence: medium.

## Patterns to adopt
- Tinted paper-like ground, one serif display plus the system-serif body, hairline rules, mats instead of shadows (1).
- Narrow centred statement column (about 550px) with generous vertical space (2); label eyebrows 12px, uppercase, about 0.11em (2).
- Lenis tuned slower than Locomotive, nearer the Lenis site's ~500-900ms glide [I]. Single instance on the GSAP ticker, with reduced motion falling back to native (3; [M] respectReducedMotion default true).
- Offset labels beside a centred CSS object (4). Pace: one idea per viewport, 3-step section readable in one scroll [I from brief].
- Fixed-ratio boxes for every CSS object, so CLS stays near 0 (2, 4).

## Patterns to avoid (and why)
- Loud WebGL or particle heroes, pixel dissolves, custom cursors (3, 4): they conflict with "unhurried, honest" and with the no-network, CSS-only brief.
- Dark, high-contrast agency styling (3, 4): wrong tone for a chef audience [I].
- Missing h1 (1, 2: [M] h1Count 0): Halde needs a real h1 and a skip link.
- Heavy smoothing as a gimmick: no measured evidence that it helps comprehension [?].

## Not inspected
| URL | Reason |
|---|---|
| Any ceramics, craft or restaurant site | Not in library; no new captures allowed this task |
| awwwards, siteinspire | Library status blocked (502 / bot wall) |
| Library screenshots for refs 1-4 | Not opened this run; descriptions reuse the entries' [O] labels |
