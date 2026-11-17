---
name: reference-study
description: Inspect and reverse-engineer a live reference website into verified evidence and an original implementation spec — Playwright capture of screenshots (desktop/mobile/after-scroll), computed typography, loaded fonts, layout boxes, detected stack (GSAP, ScrollTrigger, Lenis, Locomotive, Three.js, Next/Nuxt/Framer/Webflow), wheel-scroll smoothing samples, timings — then a measured/observed/inferred/unknown report. Use whenever the user shares a site they like ("make it feel like X", "how did they do this?"), when researching references for a project, or when asked to study an animation or scroll effect on another site.
---

# Reference study

Goal: learn the *principles* behind a reference, backed by evidence, and turn them into an **original** implementation. The studio does not copy branding, copy text, proprietary assets or source code.

## 1. Check the library first
`python3 ../reference-library/scripts/library.py search <domain or technique>`. A recent entry (less than 6 months old) usually suffices.

## 2. Capture

```bash
node scripts/capture-reference.mjs https://example.com ./evidence --id example
# batch: node scripts/capture-reference.mjs --batch urls.txt ./evidence   (lines: "slug url")
# study the scroll story and tablet layouts too:
node scripts/capture-reference.mjs https://example.com ./evidence --id example --tablet --filmstrip 12
```
Requires Playwright (`npm i -D playwright && npx playwright install chromium`, or a global install with `NODE_PATH=$(npm root -g)`).

Outputs `evidence/<id>/capture.json` plus `desktop-0.jpg` (1440×900 top), `desktop-1.jpg` (after a 600px wheel), `mobile-0.jpg` (390×844), or `blocked.jpg` when the server refuses automation (HTTP ≥ 400 → `status: blocked`).

What capture.json measures:
| Field | Meaning |
|---|---|
| `page.h1/h2/p/navLink/bodyFont` | computed font-family, size, weight, line-height, letter-spacing, variation settings, box |
| `page.largestVisibleText` | the biggest text in the first viewport (usually the display face) |
| `page.loadedFonts` | `document.fonts` entries with status `loaded` |
| `page.detected` | `window.gsap.version`, ScrollTrigger global, Lenis class/global, Locomotive markers, `window.__THREE__` revision, Next/Nuxt/Framer/Webflow/Astro/WordPress markers |
| `scroll.samples` | scrollY at 16/100/250/500/900/1500 ms after one wheel event. Native scroll reaches the target in about one frame; Lenis-style smoothing interpolates. `movedPx: 0` means the document didn't scroll (custom scroller, intro lock, or canvas-driven page) |
| `performance` | DCL, load, LCP and CLS from PerformanceObserver, plus request counts. Single lab run, indicative only |
| `mobile` | horizontal overflow, h1 size, menu-button heuristic (it can miss custom buttons) |
| `filmstrip[]` (`--filmstrip N`) | N frames `scroll-NN.jpg` spread over the whole page (wheel steps, 1.2 s apart so scroll animation plays), each with scrollY, large fixed/sticky layers in view, GSAP `.pin-spacer`s in view, the three largest visible headings (text, size, family) and visible canvases/videos. Headings unchanged while scrollY advances + a pinned layer = a pinned scene. Use it to map a reference's story beats, or your own build's |
| `tablet` (`--tablet`) | `tablet-portrait-0.jpg` 768×1024 and `tablet-landscape-0.jpg` 1024×768 with overflow and h1 size |

Known blind spots: bundled libraries without globals go undetected; loaders, intro gates and cookie walls can hide the real page; headless Chromium may be refused or shown a fallback (seen on activetheory.net); and wheel sampling misses inner scroll containers.

## 3. Look, then measure deeper where needed
- **Open every screenshot** before describing anything visual. For scroll-driven sites, read the filmstrip as a storyboard: beats, what is pinned, how words and pictures change together, and how long each beat holds.
- Timing an animation: record a trace or sample frames with Playwright (`page.screenshot` every 100 ms while scrolling, or `page.evaluate` reading `getComputedStyle(el).transform` over time), and report it as a measured series.
- Layout measurement: `el.getBoundingClientRect()` on columns/gutters at 390/768/1440. Report the numbers and derive the grid as [I].
- Page source: one fetch to confirm a script name or a CSS custom property is fine. Don't read minified bundles to extract code.

## 4. Report

Write it with `../reference-library/sites/_TEMPLATE.md` (and add it to the library), labelling every claim **[M]/[O]/[I]/[?]**. For an implementation brief, add `references/implementation-spec-template.md` sections: what to recreate (the principle), measured targets, the original technique to use (GSAP/Lenis/CSS/WebGL), and deliberate differences from the reference.

## 5. Ethics & IP
- Recreate principles (rhythm, hierarchy, motion logic), never the reference's identity.
- Never ship captured screenshots or the reference's fonts, images or code. Licensed fonts seen on a reference must be licensed separately by the project.
- If a site blocks automation, respect it: record `blocked` and inspect manually in a normal browser if needed.
