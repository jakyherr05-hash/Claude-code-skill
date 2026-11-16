# Asset Manifest — Halde
_Owner: ai-visual-producer · 2026-11-16 · Phase 8 final, checked against built index.html, styles.css, main.js_

## Summary
No raster, video or font assets; visuals are typographic and CSS-only (brief: "Photo / video: None").
Media weight: **0 KB** image, **0 KB** video, **0 KB** fonts (budget 0 KB; met).
AI generation deliberately NOT used: no shot list exists, AI "product shots" would misrepresent handmade work, zero media is fastest with no licence risk. No provider credentials checked or used. Rejected generations: none.

## CSS-only visuals (own work, no third-party material, no licence needed, 0 KB)
| ID | Visual | Lives in | Alt |
|---|---|---|---|
| V-01a | Hero rings (7 spans) + ruled `.vessel` bg (`repeating-radial-gradient`) | index.html:51-58; styles.css:125-142 | decorative, aria-hidden |
| V-01b | Glaze ring (`[data-glaze]`, 6px `--glaze` border) | index.html:56; styles.css:142 | aria-hidden |
| V-01c | Step rings (`[data-step-ring]`, `::after`, `is-active`) | index.html:71,77,83; styles.css:157-169,206 | aria-hidden |
| V-01d | Foot rings (`.foot > [data-ring]` x3) | index.html:95-98; styles.css:185-191 | aria-hidden |
| V-01e | Card backgrounds (`.step`: flat `--slip` fill, 1px `--rule` border) | styles.css:149-152 | n/a |
| V-02 | "Halde" wordmark, live text in system serif | index.html, styles.css | text itself |
| V-03 | Favicon `<link rel="icon" href="data:,">`: empty inline URI, suppresses /favicon.ico, draws no icon | index.html:9 | n/a |
Ring motion is GSAP transform/opacity (main.js:117-165); it adds no assets.

## Fonts
System stack only (`--font-serif`: Iowan Old Style, Charter, Bitstream Charter, Sitka Text, Cambria, Palatino Linotype, Georgia, serif; styles.css:7,41). None bundled, no @font-face, no preload, so no font licence applies.

## Checks run (Grep/Glob; Bash not used)
- index.html, styles.css, main.js: `<img`, `<picture`, `<video`, `<source`, `url(`, `@font-face`, `@import`: **none**.
- `<link rel=icon`: inline `data:,` only. `http(s)://`: **none**; every script/link is local (vendor/*, main.js, styles.css).
- Glob of media/font extensions (png, jpg, webp, avif, gif, svg, mp4, webm, mov, woff/2, ttf, otf, ico): only 6 QA screenshots in evidence/phase6 and evidence/phase7b, not referenced or shipped. No public/ dir.
- NOT TESTED: runtime network panel; zero media requests is shown by static search and file inventory only.

## JS vendors (code, not media). Licences UNVERIFIED (source: vendor/PROVENANCE.md; none asserted here)
| File | Evidence | Licence |
|---|---|---|
| vendor/gsap.min.js | 3.15.1 header, "gsap.com/standard-license", 73,357 B | UNVERIFIED (terms not fetched) |
| vendor/ScrollTrigger.min.js | 3.15.1 header, 44,683 B | UNVERIFIED |
| vendor/lenis.min.js | 1.3.27 string, no licence text, 18,815 B | UNVERIFIED |
| vendor/lenis.css | no licence text, 513 B | UNVERIFIED |
Open action (owner): store upstream LICENSE texts in vendor/LICENSES/ and verify sha256 against official npm packages before any public or commercial launch.

## Visual consistency
Palette tokens (styles.css:4) and ring geometry in CREATIVE_DIRECTION are the only visual source.
