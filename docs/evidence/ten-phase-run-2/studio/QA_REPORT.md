# QA Report — Halde
_Owner: qa-engineer · 2026-11-17 · Build: working tree incl. D1 fix (re-run for Gate B B1) · Chromium only (Playwright, headless) · server `python3 -m http.server 8790`, stopped, port confirmed free_
Suite: `node tests/qa.mjs` (63 checks, re-run: 63 PASS, 0 FAIL). NOTE: `qa.mjs` imports Playwright from `/home/user/Claude-code-skill/demo/node_modules/@playwright/test` and axe from `/home/user/Claude-code-skill/demo/node_modules/axe-core/axe.min.js` (absolute default paths, not project dependencies; overridable via env `PLAYWRIGHT_PATH`/`AXE_PATH`; port via `PORT`/`BASE_URL`). Raw results: `tests/results.json`. Screens: `tests/screens/`. Baselines: `tests/baseline/`.

| # | Check | Status | Evidence |
|---|---|---|---|
| 1 | Console errors + pageerrors = 0 at 360/390/768/1024/1440/1920 | PASS | results.json `R-*-console`: all empty |
| 2 | No horizontal overflow (scrollWidth<=innerWidth; no element right edge > innerWidth outside `.plate-col`), all 6 widths | PASS | `R-*-overflow`, scrollWidth = innerWidth each; wheel/scrollTo(300,0) at 1440 leaves scrollX 0 |
| 3 | Failed requests 0, HTTP>=400 0, one origin, 7 requests | PASS | `R-*-net` (html, 2 css, 4 js) |
| 4 | One h1, no skipped levels; header/nav/main/footer x1; mailto x4 correct | PASS | `S-1440/390-*` |
| 5 | Skip link: first Tab visible on-screen with ring, Enter focuses `#main` below header | PASS | `K-*-skip`, `screens/390-skip-focused.png` |
| 6 | Tab order skip > wordmark > Process > email > hero CTA > contact email > footer email, computed focus ring on each | PASS | `K-*-order` (2px solid outline; CTAs ink outline) |
| 7 | Touch targets at 390 >= 44x44 (nav, CTAs, footer) | PASS | `T-390-targets` min 44 high, 48/64 CTAs |
| 8 | `aria-current` toggles (off at top, on in #process, off after return); anchor lands below header with focus on #process | PASS | `A-aria-current`, `A-anchor` (section top 80px, header 64) |
| 9 | Trigger counts at load 5 (1440, 1024) / 4 (768, 390) / 0 (reduced), Lenis on | PASS | `M-*-triggers`, `RM-*` |
| 10 | Rings tx 3% (17.3px) at p0 > 0 at end; glaze .15/0 > .664/.605 at p.8 > 1/1 after 1.8 s settle; `[data-plate]` never transformed | PASS | `M-rings/glaze/plate-static`, `screens/1440-beat-p*.png` |
| 11 | h1 and hero CTA opacity 1 in every frame of opening (108 rAF frames/1.8 s); eyebrow fades from 0 by spec | PASS | `M-opening-opacity` |
| 12 | Resize 1440 > 768 mid-scrub: no stale transform/inline style, 4 triggers, no overflow | PASS | `M-resize`, `screens/768-after-resize-from-1440.png` |
| 13 | Reduced motion 1440+390: 0 triggers, no html.lenis, no inline style on plate/rings/glaze/[data-reveal], all opacity 1, instant anchor | PASS | `RM-1440`, `RM-390`, `RM-390-anchor` |
| 14 | No-JS 1440+390: all copy + CTAs visible, glazed final state | PASS | `NJ-*`, `screens/*-nojs-full.png` |
| 15 | Network failure: vendor JS aborted → 0 pageerrors, content visible; styles.css aborted → text present | PASS | `NF-vendor`, `NF-css`, `screens/1440-vendor-blocked.png` |
| 16 | axe-core 4.14 (accepted by tech-lead, DECISIONS.md) WCAG2.2 AA + best-practice: 390, 1440, 1440 reduced | PASS | `AX-390`, `AX-1440`, `AX-1440-rm`: 0 violations (390 now 36 rules passed, 0 incomplete) |
| 17 | Colour contrast | PASS (by calculation, not axe) | tech-lead evidence in DECISIONS.md: min 4.61:1 ash on slip, worst case with 3.5% grain. axe returns `color-contrast` "incomplete" at 1440 (textured bg); I did not recompute ratios |
| 18 | Pixel baselines 390/1440 normal+reduced (top) and reduced full; D-* identical-run diff; V-* regression vs stored baselines | PASS | `V-*`: 6 files, 0 px differ, max delta 0. Re-baselined at Gate B for the hero lede copy change only (see Gate B section). Method: PNG decode via browser canvas, per-pixel compare (pngjs absent). Not `toHaveScreenshot`. |
| 19 | Lighthouse | NOT TESTED | not installed; performance-engineer owns perf |
| 20 | Real devices; Firefox/WebKit; real compositor/paint cost; INP | NOT TESTED | Chromium headless only; no field/real-interaction data |
| 21 | Wheel-smoothing samples; route-change leak | NOT TESTED | single page, no routes; no WebGL in design |
## Screenshots opened (re-opened after fix: 390 and 1440, unchanged)
- 390: header CONTACT link, eyebrow, big "Halde", 3-line lede, full-width green CTA, glazed plate fully above the fold; full page stacks 3 steps, tinted contact mat, footer, no clipping. 768: h1 ~75% width, plate left-aligned, grazed ~12% by fold (spec). 1024: two columns, unglazed plate bleeding right. 1440: plate ~38vw bleeds ~23px (5%, intended); p100 plate fully glazed, contact mat entering. Skip link at 390: bordered button with visible ring.
## Defects
| ID | Sev | Description | Owner | Status |
|---|---|---|---|---|
| D1 | Serious (WCAG 2.5.3) | FIXED: label now "Contact: hei@halde.example"; AX-390 PASS, `T-390-navlabel` PASS. Was: axe `label-content-name-mismatch` (aria-label lacked visible text "Contact"). | frontend-engineer | Closed |
| D2 | Low | `body.scrollWidth` is 1463 at 1440 (plate bleed, clipped; user cannot scroll sideways). Full-page shots are 1463 px wide. | frontend-engineer (info) | Closed: bleed intended and clipped |

## Gate B
Re-check after frontend/gsap fixes (lede copy "two potters", CTA transition, contact reveal, scrub end "bottom 75%"). Suite now 63 checks (6 D-* determinism + 6 V-* regression rows): default run 63/63 PASS; console 0 and no overflow at 390/1440; axe 0 violations x3; reduced motion PASS; triggers 5/5/4/4 (1440/1024/768/390), rings/glaze/plate-static/resize PASS.
Baseline update (reason): first default run gave 6 V-* FAIL + 2 NJ FAIL. Diff bbox (`tests/gateB/bbox.mjs`) is confined to the first lede line only (390: x20-263,y287-333; 1440: x353-538,y516-540; same on reduced-full), i.e. "hands" > "potters"; nothing else differs. I opened `diff-actual-*` and the new 390/1440 shots: lede wraps "...two potters / in Bergen, glazed for one / kitchen: yours." at 390, 2 lines at 1440, CTA/plate/header unchanged. Baselines then rewritten with `--update-baselines` (6 files); default run re-run all PASS.
Suite fixes (qa.mjs): NJ expected string updated to the new copy; default tolerance tightened 0.05% > 0.01% because the 1440 reduced-full lede diff (2083 px, 0.037%) slipped under 0.05%.
Verdict: PASS WITH NOTES (Chromium lab only; Firefox/WebKit, real devices, Lighthouse NOT TESTED; contrast by calculation). Notes: qa.mjs imports are env-overridable (PLAYWRIGHT_PATH, AXE_PATH) but default to absolute paths; tests/ still untracked in git.
