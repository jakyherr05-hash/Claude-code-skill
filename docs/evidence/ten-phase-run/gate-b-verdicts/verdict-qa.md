# Gate B - QA verdict: PASS (conditional, Chromium-verified private preview)

## Evidence
- Reran `node tests/qa-run.mjs` against 127.0.0.1:8790: "done: 44 pass / 0 fail". tests/qa-results.json rewritten 2026-11-16 04:54:05; I counted 44 rows, 44 with status PASS. Matches QA_REPORT "44 PASS / 0 FAIL".
- Opened: w390-vp-h-how, w1440-vp-h-how (header now clear of the h2/cards; the earlier scrollIntoView artifact is gone after the script switched to nav clicks), w390-full, w1440-full, reduced-390-full, frame-390-03-y750, frame-1440-03-y869.
  - Layout intact at 390 and 1440: no clipping, no overflow, 3 cards stack at 390 and sit in a row at 1440. Reduced-motion full page is identical in content to the animated one, nothing hidden.
  - Frame 390-03: step-03 ring is mid-reveal (faded), consistent with a once-only scroll reveal. Frame 1440-03: header clear of content.
  - Full-page shots (w390/w1440/reduced-390) show the fixed header drawn mid-page over the "How we work"/contact region. This is the Playwright full-page stitching artifact for a fixed header, not a defect. The viewport shots show the header correctly at the top.
- No visual diffs to explain: there are no baselines, so there is nothing to diff (see gaps).

## Report vs raw JSON
- Row count matches (44/44).
- Minor mismatch: QA_REPORT cites fallback h1 timing as 2537-2561 ms. The latest json has 2571 (main.js delayed) and 2581 (main.js blocked). PERFORMANCE_REPORT cites 2537-2571. The report text is stale by about 20 ms.
- Stale text: QA_REPORT line 27 says the vp-h shots still show the header artifact and had not been rerun. They have been rerun and are clean.
- The fallback h1 timing assertion has a 2600 ms limit against a measured 2571/2581 ms, so a margin of about 20-30 ms. That is flaky-prone. It is not a product defect; QA should widen the threshold or assert against the CSS delay (2.5 s) plus a tolerance.
- The run prints "axe available: [ 'playwright' ]", which is cosmetic and not an axe run.

## NOT TESTED (explicit)
axe scan; toHaveScreenshot baselines (no Playwright test runner); Firefox; WebKit; real devices; Lighthouse; INP; CPU/network throttling by QA (performance has a CDP-throttled LCP/TBT proxy only); route-change leak (single page, N/A).

## Decision on gaps
Accept for a Chromium-verified private preview. Rationale: the site is a static single page with a small surface. Keyboard path, focus rings, skip link, anchor focus, 6-pair contrast and reduced motion are all asserted and passing. Two items are not blockers but must be closed before public launch:
1. axe scan (no tool or network available). Owner: QA, once @axe-core/playwright is installable.
2. Firefox/WebKit/real-device pass and Lighthouse/INP (budget INP <= 150 ms is unmeasured). Owner: QA + performance.
Screenshot baselines should be created at the same time, so later changes can be diffed.

## Required changes (non-blocking for this gate)
- QA: refresh QA_REPORT numbers (2571/2581 ms) and remove the stale line-27 note. Widen the 2600 ms timing threshold.
- QA: add axe and toHaveScreenshot baselines before public launch.

GATE B · QA: PASS
