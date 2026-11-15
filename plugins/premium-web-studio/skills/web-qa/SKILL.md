---
name: web-qa
description: QA, visual regression and performance verification for premium websites with Playwright and Lighthouse — functional and navigation tests, broken-link and media checks, console-error guards, a 360/390/768/1024/1440/1920 responsive matrix with overflow and touch-target checks, Lenis/ScrollTrigger sync and pinned-sequence assertions, route-change leak tests, reduced-motion runs, axe accessibility and keyboard order, network-failure and no-WebGL resilience, toHaveScreenshot baselines, Lighthouse medians and a scroll-jank probe, plus PASS/FAIL/NOT TESTED/BLOCKED reporting. Use whenever a site needs testing, before launch, after animation/scroll changes, or when writing QA or performance reports.
---

# Web QA & verification

**The rule:** a check is PASS only with evidence you looked at: an assertion result, a number, or a screenshot you opened. Files existing, servers starting or commands exiting 0 are not evidence on their own.

Statuses: **PASS** (tested, with evidence) · **FAIL** (tested, failed) · **NOT TESTED** · **BLOCKED** (missing credentials, hardware, browser or service).

## 1. Set up (copy the templates)
```bash
npm i -D @playwright/test @axe-core/playwright   # pin to the version of your installed browsers
cp -r <skill>/assets/tests ./tests && cp <skill>/assets/playwright.config.ts .
```
`assets/` is the suite that verifies the reference demo in this repo, so every pattern in it has run green. Adapt the selectors, routes and inventories to the project; the structure stays the same:

| Spec | Covers |
|---|---|
| `functional.spec.ts` | Landmarks and h1, console guard, every internal link and media URL returns 200, routes, deep links, 404, nav from sub-pages, filters (Flip), interactive widgets, mobile menu (focus trap, scroll lock, Escape) |
| `scroll-motion.spec.ts` | Wheel smoothing samples, single Lenis instance, ScrollTrigger progress updating *during* the glide, anchor offset + focus, pinned-sequence state at timeline positions, SplitText results, **route-cycle leak test** (ScrollTriggers, tweens, WebGL contexts back to baseline ×3), back/forward scroll restoration, reduced-motion run (instant scroll, no pins, nothing hidden) |
| `responsive-a11y.spec.ts` | The 6-viewport matrix (overflow offenders listed, h1 fits, body ≥ 16px, touch targets ≥ 44px, correct nav pattern, top + full-page screenshots), axe WCAG 2.2 AA (no serious/critical), keyboard tab order + visible focus, fonts/images blocked, WebGL2 unavailable |
| `visual.spec.ts` | `toHaveScreenshot` per section at 390 and 1440, reduced motion for determinism, canvases masked |

The app should expose a debug hook under `?debug` for leak tests, e.g. `window.__gsapStats()` → `{ scrollTriggers, globalChildren, lightRenderers }`, and `window.__lenis`.

## 2. Run
```bash
npx playwright test --trace off                       # whole suite against the production build
npx playwright test responsive --trace off            # just the matrix
npx playwright test -g "leak" --trace on              # debug one test with a trace
```
Then **open** `test-results/responsive/*.png` (all widths, top and full page) and judge them: hierarchy, crops, overlaps, broken lines, empty states. Write what you saw.

## 3. Visual regression workflow
1. The first run on a feature-complete build creates baselines (`--update-snapshots`). Inspect every baseline before committing it.
2. Later runs compare. For each diff, open `test-results/**/<name>-diff.png` next to `-actual` and `-expected`:
   - Intended change → update that one snapshot (`-g "<name>"` + `--update-snapshots`) and note why in QA_REPORT.md.
   - Regression → file a defect with the three images.
3. Never bulk-update baselines to make a suite green.

## 4. Performance
```bash
bash scripts/lighthouse.sh http://localhost:4173/ lighthouse 3   # mobile + desktop, 3 runs each, median table
node scripts/scroll-probe.mjs http://localhost:4173/ 1440        # long tasks + frame times during scripted Lenis scroll
```
- `lighthouse.sh` uses `npx lighthouse` with the Playwright Chromium (`CHROME_PATH` auto-detected) and writes JSON/HTML plus a median summary. Lab numbers from a container are indicative only; say so in the report.
- INP needs real interactions. In the lab, report TBT as the proxy and label it as such.
- `scroll-probe.mjs` records frame intervals via rAF and long tasks via PerformanceObserver while scrolling the whole page. Report p50/p95 frame time, the share of frames over 20 ms, and the count of long tasks.

## 5. Report
Use `assets/QA_REPORT.template.md` (and the project's PERFORMANCE_REPORT.md): one row per check with status and evidence path, the responsive matrix, the a11y results, the visual-regression baseline commit and investigated diffs, and defects with an owner each.

## 6. Coverage you must state honestly
- Browsers actually run (e.g. "Chromium 1243 only; Firefox/WebKit NOT TESTED: not installed").
- Real-device behaviour (iOS Safari momentum, Android URL bar) is NOT TESTED in emulation. Recommend a device pass.
- GPU performance under SwiftShader is not representative. Correctness yes, performance no.
