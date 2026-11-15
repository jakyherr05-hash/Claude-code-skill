---
name: basement.studio
url: https://basement.studio/
slug: basement-studio
category: studio
tags: [webgl, threejs, nextjs, dark, agency, 3d-hero, monochrome, tight-tracking, geist]
researched: 2026-11-15
status: inspected
confidence: high
evidence: ../evidence/basement-studio/
---

# basement.studio

Claim labels: **[M]** measured (capture.json / devtools) · **[O]** observed in screenshots/behaviour · **[I]** inferred (state the basis) · **[?]** unknown.

## At a glance
Dev-led digital studio; black page whose hero is a full-viewport real-time 3D scene of the studio's own "basement" (stairs, arcade cabinet, hoop, neon sign, CRT monitors) [O]. Lesson: one authored, atmospheric 3D scene as hero, then an immediately flat, very large, tightly-tracked grotesk statement below it - drama up top, clarity underneath.

## Design characteristics
- Near-black canvas (body bg rgb(0,0,0), text white) [M]; the scene is dark brown/black with warm wood and one orange-red accent (arcade, "HUMAN" label) [O].
- Playful copy and micro-UI: "Online (1)", "Press [/] to chat", "Close [ESC]" strings in the DOM [M]; a fixed bottom "HUMAN / MACHINE" pill toggle [O] (function not tested [?]).
- "Trusted by Visionaries" logo wall as a bordered grid of cells, logos in white line style [O].

## Typography
- Loaded faces: Geist (variable 100-900), Geist Mono (100-900), "flauta" (a third face; where it is used is [?]) [M].
- h1: 87px / line-height 78px (0.9) / weight 600 / letter-spacing -3.48px (-0.04em) / colour rgb(230,230,230) [M]. Sentence case, three lines at 1440 [O].
- h2 "Trusted by Visionaries": 24px/24px, 600, -0.72px (-0.03em), grey rgb(117,117,117) [M]. Body 16/24 [M]. Nav links 12px/16px weight 600 [M].
- Mobile h1 46px [M].

## Layout & spacing
- H1 box starts at x=16 [M]: ~16px outer gutter, text runs almost edge to edge, left-aligned [O]. Logo grid is 6 equal bordered columns [O].
- Hero is exactly one viewport (900px) tall; main content starts at y=900 [M]. Total document 6714px [M].

## Navigation
- Fixed top bar, 36px tall, 6 links (Home, Services, Showcase(26), People, Blog(29), Lab) centred, plus "Online (1)" and "Contact Us" at the right [M text, O layout]. Counts shown as superscripts [O]. 12px semi-bold type [M].
- Mobile: logo left, "Menu" + hamburger right [O] (capture's menuButton flag was false - detector missed it).

## Animation
- Scene is rendered live (2 canvases 1440x900) [M]. Whether the camera reacts to pointer/scroll is [?] (desktop-0 and desktop-1 differ only by page scroll).
- No GSAP/ScrollTrigger global detected [M]; absence of globals does not rule out bundled use [I].

## Scroll
- Wheel 600px: scrollY 0 at 16ms, 600 at 100ms and stays 600 [M] -> native-like, no smoothing; Lenis/Locomotive not detected [M].
- After scroll the hero is cropped to ~175px at the top and the headline sits right under it [O]: the content simply overlaps the scene's tail, no pinning evident [I].

## Image & video treatment
- 40 `img` of which 36 SVG (logos) [M]; 0 video elements [M] (7 video requests seen in network, so some video is fetched elsewhere [M]).

## Responsive (390px observation)
- No horizontal overflow (scrollWidth 390) [M]. Hero scene re-frames portrait (arcade + stairs centred) at ~640px tall, then headline 46px [O/M].

## Technical discoveries
- Next.js detected [M] (DOM/global marker). Three.js revision "180" exposed on window [M]. Geist font family is the Vercel-published family [I] (name only).
- 57 scripts, 210 requests [M].

## Performance (single lab run, indicative only)
DCL 703ms, load 1551ms, LCP 852ms, CLS 0.001, 210 requests [M]. `fetch` initiator ~8.9MB (39 requests; transfer sizes can be undercounted cross-origin) - likely 3D/asset payload [I]. Fast LCP suggests the headline text, not the canvas, is the LCP element [I].

## Useful implementation ideas (original re-implementations, not copies)
- Hero as a lazy-loaded R3F/Three canvas in a 100vh fixed-height block with a static poster `<img>` as LCP fallback; swap on `requestIdleCallback`. Keep text outside the canvas so LCP and SEO are unaffected.
- Type system: one grotesk, h1 at ~6vw with line-height 0.9 and tracking -0.04em, headings -0.03em; with a variable font this is a 2-token recipe (`--lh-tight`, `--track-display`).
- Bordered logo grid: CSS grid `repeat(6, 1fr)` with 1px collapsed borders; at mobile `repeat(2, 1fr)`.
- Small "character" UI (live status, keyboard hint) built from a plain fixed element + one keydown listener.

## Unknowns / not verified
- What "Human/Machine" toggles; camera interaction; what "flauta" is used for; scene authoring tool and asset sizes.
