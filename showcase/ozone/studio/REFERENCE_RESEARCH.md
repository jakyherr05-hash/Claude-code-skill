# Reference Research: OZONE Clear Air
_Phase 2 · 2026-11-17 · Labels: [M] measured, [O] observed, [I] inferred, [?] unknown. Library: plugins/premium-web-studio/skills/reference-library/ (entries in sites/, evidence in evidence/). Screenshots are for internal study only; no copy, brand or assets are reused._

## Method
7 new sites captured (`capture-reference.mjs <url> --tablet --filmstrip 12`, status `inspected` for all 7; two (igloo-inc, sbs-the-boat) did not scroll the document so are marked partially-inspected). 1 guessed URL (Guardian) returned 404 = not inspected. BMW Group Report 2025 and Adidas Annual Report 2024 were unreachable from this environment (curl HTTP 000), so they are NOT inspected. Reused library entries: brightiris, terminal-industries, santal, oceanx, apple-airpods-pro, dropbox-brand, floema, lenis.

## References and what each teaches
1. **The Pudding: Pockets** (new; pudding-pockets). Best model for staging numbers. [M] 10,930 px native scroll, no JS library globals, LCP 396 ms, CLS 0.028. [O] A sticky SVG stage changes state as short caption cards pass: 160 outlines, then two colours, then averages with dimension labels, then a grid. One idea per graphic state; colour is only data-coded; method and data link sit in a final section; the intro offers "jump ahead to the final state". Take: one fact = one simple object + one caption + a skip path + a Sources chapter.
2. **The Real Cost: Vapes, HHS** (new; real-cost-hhs). Closest subject. [O] One bold claim per panel, a single highlighted phrase, myth/answer bubble ("Aren't vapes just vapor?"), a single "Find help" button, a "Sources" accordion. [M] Anton caps + Poppins, 73 requests, CLS 0. Take: myth/answer cadence and calm closing ask. Avoid: its illustrated device graphic (OZONE may not show products) and the 3-slide carousels (hide content).
3. **truth (thetruth.com)** (new; thetruth). The genre's loud register. [O] Looping video hero, orange collage, then six identical white image/text rows ending on "Need help quitting?". [M] CLS 0.13, 153 requests. Take: help-line as the final beat. Avoid: peer-voice stickers and meme styling (a retailer would read as pandering); the repetitive template.
4. **Truth Initiative** (new; truth-initiative). Credibility devices: dated research cards, a text-to-join quit line. [M] CLS 0.133, LCP 3.0 s; [O] hero carousel text clipped at 390 px. Take: date-stamped, sourced facts; free help always reachable. Avoid: the floating blob CTA, layout shift.
5. **Igloo Inc.** (new; igloo-inc; partially inspected). Fog/atmosphere as the whole medium. [O] Low-contrast haze, a wireframe form assembles and is lit from inside; UI is tiny HUD boxes in corners, nothing over the centre. [M] three r165, document did not scroll, ~14.5 MB fetched. Take: reveal by light-from-within and form emerging from haze; keep type out of the fog or on opaque panels. Avoid: the asset weight and no real scroll.
6. **Dogstudio** (new; dogstudio; partially inspected). Text over atmosphere. [M] GT Sectra Display 700, 120 px, 0.89 line-height, tracking -23 px. [O] White bold serif on the darkest, emptiest side of the scene reads clearly; thin grey project names and small body over brighter areas are weak. Take: scrim and placement rules for legibility (see below). Avoid: crude copy; banners over the hero.
7. **SBS The Boat** (new; sbs-the-boat; gate only). [O] "Click to start" over rain, audio warning. Take: any sound must be opt-in; do not gate the story. The story itself is [?].
8. **Brightiris** (library). Chapters as whole-viewport colour changes, numbered mono counter, one italic serif accent word per statement; 29,427 px, GSAP+ScrollTrigger+Lenis. Take: chapter numbering and the dark "problem" vs bright "answer" register shift (the OZONE "cloud clears" turn).
9. **Terminal Industries** (library). Cinematic hero hands off to a near-black statement revealed line by line, then white utilitarian cards; calculator as the conversion beat. Take: the line-by-line statement as the "turn"; calm 400-weight display at -3 to -5% tracking.
10. **Santal** (library). Monochrome, hairline grid, one typeface; dark WebGL chapters alternate with white single-object chapters; LCP 15 s. Take: restraint, scale as the only drama; ship a static first frame so type paints before WebGL.
11. **Apple AirPods Pro** (library). Identical "eyebrow + two-line statement + one object" module repeated. Take: constant rhythm so the content carries novelty; one idea per screen.
12. **OceanX** (library). Big bottom-left statement over full-bleed dark media, white editorial sections with label-left/copy-right, a cookie bar planned around. Take: factual register, mixed dark/light tones.
13. **Dropbox brand** (library, short). Tiles assemble to fill the viewport on scroll. Take only as a possible "many small facts become one wall" device; low priority.
14. **Floema / Lenis site** (library). Pinned numbered slides (floema, cookie modal hides centre); lenis.dev: ember particles on pure black with a shared ticker feeding uniforms. Take: pinned numbered beats; scroll progress as a shader uniform.

## Cross-cutting findings
- **Pacing**: Pudding-style steps run about 900 px per beat on a 900 px viewport [M, filmstrip step 912 px]; the library's long stories run ~12 to 33 viewports. For OZONE, 8 to 10 beats of ~100 to 150 vh each, one idea per beat (the brief's ≤12-word display copy).
- **Numbers**: no reference shows a number alone. Pudding and Real Cost pair each claim with a shape or a short plain sentence, and place sources in a closing section.
- **The turn**: Terminal (dark line-by-line statement to white cards), Brightiris (colour change per chapter) and Igloo (form emerges lit from within) are three ways to stage "the cloud clears". Nothing in the youth-prevention set uses one; that is the open design space.
- **Legibility over atmosphere** [I from Dogstudio, Igloo, Santal]: keep text on the emptiest, darkest area; fade the atmosphere to a flat tone behind prose; use opaque panels for small text; thin light weights fail over bright regions.
- **Mobile**: all 7 new sites had no horizontal overflow at 390 px [M]; Truth Initiative clipped carousel text [O]; Igloo's HUD showed blank bars [O]. Test OZONE with the fog at lower DPR and the type re-stacked, not scaled.
- **Performance**: only the campaign sites with heavy video/carousels hit CLS 0.13+ [M]; Pudding stayed at 0.028. OZONE's CLS 0.05 target is realistic with reserved space and no carousels.

## Patterns to use
- Sticky stage + short step captions, native scroll feel, IntersectionObserver or ScrollTrigger; always a "skip to the end" and a no-motion path.
- One number per beat, drawn as a simple form; plain sentence beneath; citation tag visible; full Sources chapter.
- Myth/fact pairs as plain text; one highlighted word per statement.
- Chapter counter in small mono caps; a dark-to-light register shift at the turn.
- Procedural fog (fragment shader) with a static poster fallback; light-from-within reveal.
- Closing beat: one calm ask (free quit help), one sourced list, reduced to a few links.
- Large serif or grotesk display at 0.9 line-height, tight tracking; small text only on solid or scrimmed areas.

## Patterns to avoid
- Sticker/meme/peer-slang styling, shock imagery, product or device graphics, glamorous cloud visuals (the brief forbids it).
- Carousels and click-to-start gates; autoplay audio.
- Identical repeating text/image rows (the truth site); floating blob CTAs.
- Text on the bright part of the fog; thin grey small copy over imagery.
- Multi-megabyte scene assets; layout shift above 0.05.

## Not covered / open
- BMW Group Report 2025 and Adidas Annual Report 2024: unreachable, not inspected. The Boat past the gate, Igloo's scroll behaviour, and any real smoke-as-medium site with text paragraphs remain [?]; a headed/GPU capture is needed for those.
- No claim here verifies any health statistic; that is the copywriter's job with primary sources.
