# Asset Manifest — Penumbra — Light Atelier (demo)
_Owner: ai-visual-producer · Date: 2026-11-15_

All imagery is **procedural**: computed by `scripts/render-assets.mjs` (ray-cast / analytic light model drawn into a canvas in headless Chromium via Playwright). No photographs, no AI generation, no third-party material. Masters are 2400 px wide PNGs in `assets-src/` (git-ignored, ~10 MB each, reproducible with `npm run assets`); delivery files are in `public/media/`.

Tool versions: Playwright 1.63.0, Chromium 153.0.8010.12 (render); sharp 0.35.5 (optimise, via `optimize-images.mjs`, AVIF q64 / WebP q72, no JPEG); Node 22.23.4.
Licence for every row: **original work created for this project — no third-party rights, commercial use unrestricted.**

| ID | File(s) | Type | Source | Model / tool + version | Prompt / seed | Licence & commercial use | Formats & sizes | Weight (all variants) | Alt text |
|---|---|---|---|---|---|---|---|---|---|
| capela-do-silencio | `public/media/capela-do-silencio-{720,1280,1920}.{avif,webp}` | Plate 4:5 (2400x3000 master) | procedural via render-assets.mjs (scene `capela`) | Playwright 1.63.0 / Chromium 153 | deterministic (grain seed 1) | Original work, no third-party rights | AVIF 4.7/10.1/23.8 KB; WebP 4.4/9.8/18.7 KB | 71 KB | A dark barrel-vaulted stone nave seen toward a limewashed apse wall; a narrow blade of dawn light from a high slit on the left falls diagonally across the wall and onto the floor. |
| museu-das-mares | `public/media/museu-das-mares-{720,1280,1920}.{avif,webp}` | Plate 4:5 | procedural (scene `museu`) | as above | seed 2 | as above | AVIF 5.0/11.0/31.0 KB; WebP 4.8/10.9/22.6 KB | 85 KB | A dark museum hall with three low vitrines glowing cool blue-white from within, their light pooling and reflecting on a polished floor. |
| casa-sombra | `public/media/casa-sombra-{720,1280,1920}.{avif,webp}` | Plate 4:5 | procedural (scene `casa`) | as above | seed 3 | as above | AVIF 7.6/14.4/30.7 KB; WebP 9.3/19.7/35.3 KB | 117 KB | Late-afternoon light through horizontal louvres casts long soft-edged parallel stripes across a concrete floor and up a wall. |
| hotel-alva | `public/media/hotel-alva-{720,1280,1920}.{avif,webp}` | Plate 4:5 | procedural (scene `hotel`) | as above | seed 4 | as above | AVIF 11.8/25.2/49.0 KB; WebP 9.3/21.1/38.9 KB | 155 KB | A long stone corridor in one-point perspective, lit only by warm ankle-height slots that leave regular pools of light on the floor and walls. |
| atelier-brass | `public/media/atelier-brass-{480,960}.{avif,webp}` | Detail 1:1 | procedural (scene `brass`) | as above | seed 5 | as above | AVIF 8.2/22.5 KB; WebP 10.6/27.5 KB | 69 KB | Macro of a spun-brass reflector: concentric turned ridges catching a warm highlight arc on the side facing the light. |
| atelier-glass | `public/media/atelier-glass-{480,960}.{avif,webp}` | Detail 1:1 | procedural (scene `glass`) | as above | seed 6 | as above | AVIF 3.1/5.8 KB; WebP 3.0/7.0 KB | 19 KB | A blown-glass diffuser with a brass collar on a dark table, a soft highlight on its surface and a glowing caustic pooled beside it. |
| atelier-plate | `public/media/atelier-plate-{480,960}.{avif,webp}` | Detail 1:1 | procedural (scene `plate`) | as above | seed 7 | as above | AVIF 3.4/8.0 KB; WebP 2.4/6.5 KB | 21 KB | A brushed-brass serial plate stamped "PNB-014 · 2700 K", lit from the upper left. |
| hero-poster | `public/media/hero-poster-{960,1920}.{avif,webp}` | LCP-safe backdrop 16:9 | procedural (scene `hero`) | as above | seed 8, baked grain 60% | as above | **AVIF 1920w = 8.2 KB (budget 60 KB)**; 960w 2.7 KB; WebP 9.1/3.2 KB | 23 KB | (decorative backdrop behind live shader) A single diagonal shaft of warm light falling across a dark limewashed wall; use `alt=""`. |
| grain | `public/media/grain.png` | 256x256 tileable noise | procedural (scene `grain`) | as above | seed 424242 | as above | PNG, 32-colour palette, 61 KB | 61 KB | decorative, `aria-hidden` |

Delivered total (AVIF + WebP + grain.png + manifest): **647,158 bytes (~632 KB)**. `public/media/images.manifest.json` lists every output with dimensions (kept from `optimize-images.mjs`, merged across the three width groups; `source` points at `assets-src/`).

Implementation notes for engineering:
- Focal points for `object-position` (fraction of image, x y): capela 40% 50% (blade); museu 35% 78% (front vitrine); casa 55% 80% (floor stripes); hotel 50% 62% (vanishing point); brass 40% 45%; glass 45% 45%; plate 50% 52%.
- AVIF encoding smooths the baked 3% grain, so keep the sitewide `grain.png` overlay (soft-light; PNG is full-contrast noise around 128, apply at the CD's low opacity). The hero master carries only 60% baked grain for the same reason.
- Images carry no text except the serial plate.

## Visual consistency rules (from CREATIVE_DIRECTION)
- One light source, entering from the upper left at about 35 deg elevation in every scene; shadows fall lower right. Same direction sitewide.
- Soft penumbra on every shadow and beam: edge width grows with distance from the occluder (louvres, slit, shaft). No hard edges.
- At least 60% of every frame in shadow; one focal lit surface per plate; no people, furniture or photoreal detail.
- Grade: shadows floor at #0d0c0b and ambient lifts stay below #171513 (pixel clamp min 13,12,11; never pure black); highlights are tone-mapped (1 - e^-2x) toward limewash #ece6da and clamped at (236,230,218), so nothing reaches white.
- Colour temperature: warm family by plate (capela 2400 K, hotel 2200 K, casa 3000 K, atelier 2700 K, hero 2700 K); cool only in daylight/display light (capela dawn fill, museu 4000 K vitrines). No overlays, duotone or vignettes beyond the light itself.
- Falloff is inverse-square-ish (hotel, museu, plate) with faint bounce light on the adjacent plane (capela apse, casa wall).
- Static baked grain (about 2.4% in highlights, less in shadows); never a live filter.
- Reproducible: fixed seeds, no `Math.random`; scene parameters live in `scripts/render-assets.mjs`.

## Commands
```
NODE_PATH=$(npm root -g) node scripts/render-assets.mjs            # masters -> assets-src/
node <plugin>/ai-visual-pipeline/scripts/optimize-images.mjs <dir> public/media --widths 720,1280,1920 --no-jpg --avif-q 64   # project plates
... --widths 480,960 (atelier squares); --widths 960,1920 (hero-poster)
```
(`sharp` was installed in a scratch directory; the demo `package.json` was not modified.)

## AI generation attempt
Date 2026-11-15. `providers.py check` output (verbatim; gradio_client was installed only in a scratch venv for the attempt):
```
hf-space      AVAILABLE?  space stage=RUNNING; gradio_client NOT installed (pip install gradio_client); no HF_TOKEN (anonymous quota is shared per IP and often 0 on cloud hosts). Quota is only known when a job runs.
hf-inference  BLOCKED     needs HF_TOKEN (free account token works only with purchased credits or PRO monthly credits)
comfyui       BLOCKED     no ComfyUI at http://127.0.0.1:8188 (needs a local install + GPU; see references/providers.md)
pollinations  BLOCKED     needs POLLINATIONS_KEY (sk_...). Keyless legacy endpoint watermarks output — not for deliverables.
```
One real generation attempt: `providers.py image --provider hf-space` (black-forest-labs/FLUX.1-schnell, 1024x1280, seed 7, 4 steps; prompt: "Barrel-vaulted stone nave in section, single narrow blade of dawn light from an upper-left slit falling on a limewashed apse wall, soft penumbra, dark room, warm neutral grade, architectural light study, no people"). Result: **BLOCKED [hf-space]: ZeroGPU quota: You have exceeded your ZeroGPU quota (90s requested vs. 0s left). Try again in 0:00:00. Authenticate with a Hugging Face token for more quota.** No retry was made; the keyless Pollinations endpoint was not used (watermark). Nothing generated, so no AI image is in the site.
What would unblock it: a free Hugging Face token in `HF_TOKEN` (raises ZeroGPU quota) — then FLUX.1-schnell (weights Apache-2.0 per the HF model card API) is usable commercially. Not needed for this demo: the CD specifies a procedural light-study family, which the shared light model delivers more consistently than diffusion output.

## Rejected generations (and why)
- None generated (see above). Procedural iterations rejected during review: first capela pass (blade a needle, scene evenly lit and sepia, shadows under 60%), first museu pass (grey, over-saturated vitrine faces, bright ceiling haze), square "bubble" specks in the glass plate, serial text overflowing the plate; all fixed before delivery.

## Change log
| Date | Change | By | Reason |
|---|---|---|---|
| 2026-11-15 | `grain.png` (62,543 B) → `grain.webp` (21,744 B, sharp q60), CSS updated | orchestrator (integrator) | PERFORMANCE_REPORT action 4: Lighthouse flagged ~50 KiB saving on first view |
