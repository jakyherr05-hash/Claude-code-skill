---
name: reference-library
description: The studio's searchable library of researched reference websites — award galleries, creative studios (Locomotive, basement.studio, Active Theory, Obys, Unseen, Instrument, Resn), type foundries/catalogues and animation/WebGL tool sites — each with measured evidence (fonts, sizes, detected libraries like GSAP/Lenis/Three, scroll-smoothing samples, timings) and screenshots. Use before doing any new reference research, when looking for examples of a technique (smooth scroll, WebGL hero, pinned storytelling, editorial type), or when the user asks what top studios do.
---

# Reference library

Long-term memory for references, so the studio never re-researches what it already knows.

## Find before you fetch

```bash
python3 scripts/library.py search webgl hero --limit 5          # ranked, with matching lines
python3 scripts/library.py search --tag lenis                   # by tag
python3 scripts/library.py search editorial serif --category studio --min-confidence medium
python3 scripts/library.py stale --days 180                     # entries due for re-research
```

`INDEX.md` lists every entry with status, confidence, date and tags. Open only the entries a search surfaces.

## How to read an entry

Each `sites/<slug>.md` uses `sites/_TEMPLATE.md`. Every claim carries a label:
- **[M] measured**: taken from `evidence/<slug>/capture.json` (computed styles, `document.fonts`, window globals, wheel-scroll samples, Performance API) or page source.
- **[O] observed**: seen in the screenshots in `evidence/<slug>/`.
- **[I] inferred**: reasoned from the evidence, with the basis stated.
- **[?] unknown**: not verified.

`status` is one of `inspected`, `partially-inspected` (a loader, gate or overlay hid part of the site), `blocked` (bot wall or HTTP error), or `not-inspected`. Trust entries in proportion to their `confidence`.

Caveats that apply to all entries:
- Performance numbers come from a single lab run from a cloud container. Treat them as indicative only.
- Library detection relies on globals and DOM markers. A bundled library with no global can go undetected, so treat absence as weak evidence.
- Screenshots are downsized, used for internal study only, and must not be shipped or redistributed.

## Adding or refreshing entries

1. Capture with the `reference-study` skill: `node capture-reference.mjs <url> evidence --id <slug>`, then downsize the screenshots to ≤ 960px wide.
2. Write `sites/<slug>.md` from the template, then open every screenshot before describing it.
3. Run `python3 scripts/library.py build` to regenerate `index.json` and `INDEX.md`.

## Known gaps as of 2026-11-17
- **Blocked:** awwwards (HTTP 502 to the automated browser), siteinspire (bot verification), gsap-resources (interstitial).
- **Partially inspected (2026-11-15 batch):** behance (403, but desktop rendered), activetheory ("browser not supported" gate under headless Chromium; needs a GPU or headed capture), resn and obys (only the loader was captured), unseen (only the intro gate; needs a click on "Enter"), google-fonts (blank render).
- **Partially inspected (2026-11-17 batch):**
  - cyera-ai-guardian: only the "Your browser is not supported" gate was captured (same failure as activetheory); needs a headed/GPU capture.
  - minh-pham: stuck on the "START" gate; Lenis stopped; needs a click-through capture.
  - creative-reference-library: stuck on the "Enter Library" state; Lenis stopped; needs a click-through capture.
  - lusion (About page), immersive-garden, preymaker, auge-experience: the document did not scroll under wheel input (docHeight 900, scrollY 0), so filmstrip frames do not prove a scroll story and scroll claims are [?]; auge-experience also has a Cookiebot modal over the centre and a "rotate device" gate on tablet portrait. Needs a capture that drives their virtual scroller (e.g. keyboard, touch or repeated wheel events after the intro).
  - floema: Cookiebot modal covers the centre of every frame.
  - zirka-interceptor: each wheel step moved only ~69 px, so frames cover just the first 629 px of 35,640 px.
  - santal: filmstrip reaches ~64% of the 41,571 px page.

Re-capture these with a headed browser, a longer wait, or a click-through step when they matter for a project.
