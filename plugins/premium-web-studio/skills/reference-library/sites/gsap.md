---
name: GSAP (homepage)
url: https://gsap.com/
slug: gsap
category: animation-dev
tags: [gsap, animation-library, scrolltrigger, splittext, dark-ui, oversized-type, showcase, free-licence, kinetic-type]
researched: 2026-11-15
status: inspected
confidence: high
evidence: ../evidence/gsap/
---

# GSAP (homepage)

Claim labels: **[M]** measured (capture.json / devtools) · **[O]** observed in screenshots/behaviour · **[I]** inferred (state the basis) · **[?]** unknown.

## At a glance
Marketing site of the GreenSock Animation Platform. Design lesson: dark near-black ground, cream display type at 224px, one acid-green accent and playful 3D-ish glyph shapes drifting through the headline [O].

## Design characteristics
- Background rgb(14,16,15), text rgb(255,252,225) cream [M]; neon green announcement bar and CTA outline [O].
- Hero: "Animate anything" in two staggered lines, with decorative colourful objects (pinwheel, squiggle) overlapping letters; the "i" in "anything" is replaced by an exclamation-like glyph [O]. Bracket-framed tagline and pill CTA [O].
- Next section: large statement text where the word "animate" is highlighted green progressively (letter-level colouring visible at desktop-1) [O].

## Typography
- Mori only [M]: 400 and 600. Largest text 224px/201.6px, weight 600, -4.48px tracking (-0.02em), i.e. line-height 0.9 [M]. h1 32px (visually hidden box 1x1) [M]; statement h2 24px/27.6px [M] (visually the large text is bigger on screen [O]); small UI 14px, -0.14px (-0.01em) [M].

## Layout & spacing
- 96px left margin, 9 sections, 127px fixed header incl. banner [M]. Hairline dividers at section edges [O].

## Navigation
- Fixed header, 48 links (mega-menu content) [M]: Tools, Showcase, Community, Learn GSAP, Docs, Demos, Login, "Get GSAP" pill [O]. Mobile collapses to a "Menu" pill [O].

## Animation
- Hero objects and letter-level colour reveal [O]; SplitText chunk and MorphSVGPlugin chunk loaded [M libraryHints], so letter splitting and SVG morph are plausible [I].

## Scroll
- Native: 600px reached at 16ms [M]; ScrollTrigger present [M] but no smoothing layer (no Lenis, no ScrollSmoother detected [M]).

## Image & video treatment
- 6 videos, muted loop, none autoplaying at capture (lazy) [M]; showcase "site of the week" clips [M src names]; 103 inline SVGs [M]. 3.5 MB video transfer [M].

## Responsive (390px observation)
- No overflow [M]; but desktop-0 mobile shot shows the area under the header empty black: hero text not yet visible at capture time [O] (entrance animation pending or intro delay [I]). Largest text 90px [M].

## Technical discoveries
- window.gsap 3.15.0 [M], ScrollTrigger global [M]; scripts: tf-assets index chunks, SplitText, MorphSVGPlugin [M]. Not Next/Webflow/WordPress per detection [M].

## Performance (single lab run, indicative only)
- DCL 1407ms, load 1541ms, LCP 4080ms (large hero), CLS 0.003, 31 requests, 117 KB script [M].

## Using this resource in the studio
- npm gsap@3.15.1 is latest and the package includes ScrollTrigger, SplitText, Flip, Observer, Draggable, InertiaPlugin, CustomEase, MorphSVGPlugin, DrawSVGPlugin, ScrollSmoother, MotionPathPlugin [M: npm view gsap, 2026-11-15].
- Licence field: "Standard 'no charge' license: https://gsap.com/standard-license" [M]; the page says GSAP is free for everyone thanks to Webflow, with a Prohibited Use for no-code visual animation builders competing with Webflow [M, studio-verified 2026-11-15]. Ordinary client sites are fine; do not build a visual animation tool on it.
- The site's banner states "GSAP is now free for everyone, thanks to Webflow's support!" [M].
- With Lenis, README pattern: `lenis.on('scroll', ScrollTrigger.update); gsap.ticker.add((t)=>lenis.raf(t*1000)); gsap.ticker.lagSmoothing(0)` [M].

## Useful implementation ideas (original re-implementations, not copies)
- 0.9 line-height, -0.02em tracking on giant display type with cream-on-black.
- Progressive letter colour highlight tied to scroll via a scrubbed timeline.
- Lazy-load showcase videos (muted loop) only when in view.

## Unknowns / not verified
- Exact tween setups [?]; whether the mobile hero is blank by design or a timing artefact [?].
