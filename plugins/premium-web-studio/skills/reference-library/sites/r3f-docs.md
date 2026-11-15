---
name: React Three Fiber Docs
url: https://r3f.docs.pmnd.rs/
slug: r3f-docs
category: animation-dev
tags: [react-three-fiber, r3f, threejs, react, documentation, nextjs, pmndrs, drei, webgpu-alpha]
researched: 2026-11-15
status: inspected
confidence: high
evidence: ../evidence/r3f-docs/
---

# React Three Fiber Docs

Claim labels: **[M]** measured (capture.json / devtools) · **[O]** observed in screenshots/behaviour · **[I]** inferred (state the basis) · **[?]** unknown.

## At a glance
Docs for react-three-fiber (R3F), the React renderer for three.js, by Poimandres. The URL redirected to /getting-started/introduction [M finalUrl]. Lesson: friendly, soft docs UI (cream ground, lime accent) around a technical subject.

## Design characteristics
- Warm cream page rgb(254,248,244), near-black text [M]; lime-green search bar and active sidebar item, large rounded callout cards (blue Note, mustard Warning) [O]. Right "On this page" rail and sponsor card [O].
- Dark code block with package-manager tabs (pnpm / npm / yarn / bun) [O].

## Typography
- Inter variable (100–900) and Inconsolata (200–900) [M]. h1 "Introduction" 51px/51px 700 with -2.55px (-0.05em) tracking [M]; body 17px/25.5px [M]; h2 21.25px 400 [M].

## Layout & spacing
- Three columns: ~205px sidebar, ~485px article, ~170px TOC rail at 1440 [O estimate]. Header 69px, sticky [M].

## Navigation
- Sidebar groups: Getting Started (Installation, Your first scene, Examples, Community R3F Components), API, Advanced, Tutorials, Development [O]. Version switcher "v9.8.2 / master" bottom-left [O]. Search "/" shortcut, GitHub star count (33k), Discord [O].

## Animation
- None notable [O]; 0 canvases [M].

## Scroll
- Native [M].

## Image & video treatment
- 4 images (2 JPG, 2 SVG) [M]; sponsor banner [O].

## Responsive (390px observation)
- No overflow [M]; sidebar hidden behind a button; h1 51px wraps mid-word ("Introductio / n") at 390px [O] — a bug-level flaw worth avoiding (clamp/hyphenation).

## Technical discoveries
- Next.js [M] (Turbopack chunk code in body [M]). Console: Babel note that three.cjs exceeds 500KB and is deoptimised [M] — the docs embed live three/R3F code [I]. 37 fetches totalling 1.7 MB [M].

## Performance (single lab run, indicative only)
- DCL 337ms, load 1743ms, LCP 2792ms, CLS 0, 64 requests [M].

## Using this resource in the studio
- npm `npm view @react-three/fiber version` = 9.8.2 [M, 2026-11-15], same as the docs' "v9.8.2" [O]; dist-tags: alpha 10.0.0-alpha.6, canary 10.0.0-canary.58acabc [M]. Docs say v10 is alpha with WebGPU support and a new frame-loop scheduler [O].
- Peer deps of fiber 9.8.2: react >=19 <19.4, three >=0.156 [M]. The docs warn fiber@8 pairs with React 18 and fiber@9 with React 19 [O].
- `npm view @react-three/drei version` = 10.7.9 [M]; peers: react ^19, three >=0.159, @react-three/fiber ^9 [M].
- License MIT for fiber [M]. Docs install line: `pnpm add three @types/three @react-three/fiber` [O].
- Docs claim no limitations/overhead versus plain three.js [O] — vendor claim [I], not measured.

## Useful implementation ideas (original re-implementations, not copies)
- Package-manager tab block that remembers the choice; "Copy page" action for LLM-friendly docs.
- Callout cards with distinct hues for Note vs Warning.

## Unknowns / not verified
- Content of API/Advanced pages [?]; v10 behaviour [?].
