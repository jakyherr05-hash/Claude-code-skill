# Asset Manifest — Halde
_Owner: ai-visual-producer · Date: 2026-11-17 · Phase 8 final · Status: A01-A06 VERIFIED_

**Totals:** 0 image files, 0 video files, 0 font files, 0 AI-generated assets, 0 third-party media. Assets are typographic/CSS only (client brief). No generation or stock used; providers check not run (nothing to generate).

**Licence (all rows):** original studio work, hand-authored in `index.html`/`styles.css`; commercial use = yes, no third-party terms (source of claim: authored in-repo, no imports). System fonts are referenced by name, never shipped. Lenis/GSAP/ScrollTrigger are code (vendor/, see TECHNICAL_ARCHITECTURE), not assets.

## Verification evidence (Chromium, 1440x900, `python3 -m http.server 8790`)
- Static grep of index.html, styles.css, main.js: 0 `<img`, `<video`, `<picture`, `@font-face`, 0 image/video/font file extensions. `url(` occurs twice, both inline: the grain `data:image/svg+xml` URI (styles.css:90) and its internal `url(%23n)` filter ref. Also `<link rel="icon" href="data:,">`. No other data: URIs.
- Network, 7 requests, 0 image/media/font: document 4,105 B; stylesheet lenis.css 699 B, styles.css 14,372 B; script main.js 7,508 B, lenis.min.js 19,010 B, gsap.min.js 73,552 B, ScrollTrigger.min.js 44,878 B. Total ~164 KB, 0 failed. Favicon: no request.
- DOM: 0 `img/video/picture/svg/canvas` elements. `.plate` has aria-hidden="true"; `.plate__rings` and `.plate__glaze` sit inside it (closest aria-hidden = true).
- Grain computed: `body::after`, position fixed, pointer-events none, opacity 0.035 (3.5%, limit 4%).
- h1 text = "Halde" (live text, `<span lang="nb">`).

| ID | Type | Construct | A11y | Status |
|---|---|---|---|---|
| A01 wordmark | Typographic | Live h1 "Halde" + header link text; system old-style serif stack (Iowan Old Style / Palatino / Georgia); fluid clamp() | Live text, h1 | VERIFIED (h1 = "Halde") |
| A02 plate | CSS illustration | `.plate[data-plate]`: `repeating-radial-gradient` rings (rim/slip) + radial-gradient glaze pool (feathered rim, glaze #2E5B57); `.plate` clips rings; diameter capped `min(40vw,70svh)`; `aspect-ratio:1` reserved | aria-hidden on `.plate`, children inherit | VERIFIED (aria-hidden, 0 requests) |
| A03 grain | Texture | `body::after` fixed overlay, inline feTurbulence SVG data: URI, opacity .035 | Decorative pseudo-element, no DOM, pointer-events none | VERIFIED (computed 0.035) |
| A04 hairlines | Rules | 1px borders/gradients in rim #8F8274 (3.08:1, non-text OK); no radius, no shadows | Decorative, no DOM | VERIFIED (CSS only, 0 requests) |
| A05 numerals | Typographic | `.step__n` 01-03, tracked caps in system grotesk | aria-hidden; h3 and `<ol>` carry meaning | VERIFIED (aria-hidden in index.html) |
| A06 favicon | Icon | `<link rel="icon" href="data:,">`, intentionally empty | n/a | VERIFIED (no request); no OG/apple-touch image exists |

## Consistency rules (CREATIVE_DIRECTION)
Palette only clay #EFE8DE, ink #2A2320, slip #E3D8CA, ash #62574F, glaze #2E5B57 (<5%), rim #8F8274. No drop shadows, radius 0 except the plate, one object, no faux-photo pottery.

## Rejected generations
None; none attempted.

## Open
No social-preview (OG) image; flag if the client wants one (would need a new asset and approval).
