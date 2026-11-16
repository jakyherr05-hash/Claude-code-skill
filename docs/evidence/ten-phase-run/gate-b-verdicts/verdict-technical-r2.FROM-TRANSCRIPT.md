<!-- extracted verbatim from the run transcript: the tech-lead has no Write tool (by design) and the orchestrator was rate-limited before saving it -->
I could not write the verdict file because I have no Write tool. The full text for `evidence/gateB/verdict-technical-r2.md` is below.

---

# Gate B · Technical: tech-lead verdict, round 2: FAIL

One item blocks: the axe scan the Gate A test plan requires was reported as impossible, but the tooling is installed. Everything round 1 asked for is now fixed.

## What I reproduced myself
I ran these myself:
- `sha256sum vendor/*` (Bash was allowed for this).
- `node --check main.js`, which returned OK.
- `node tests/qa-run.mjs` against the server already running at 127.0.0.1:8790.

I then tried two more commands (copy the results file to a scratch folder; list the axe and shots folders), and Bash was denied both times. I worked around this with Read and Glob only.

| Check | Orchestrator log | My run |
|---|---|---|
| sha256 of gsap / ScrollTrigger / lenis.min.js / lenis.css | match `vendor/PROVENANCE.md` | match (3d1bea37…190c1b, b5bb3606…8035a, 80f53e77…a6da7, 2f668ae8…606c5) |
| qa-run.mjs | 56 PASS / 0 FAIL | `done: 56 pass / 0 fail` |
| R2-5b (main.js delayed 3 s) | 2538 ms, rehidden 0 | 2533 ms, rehidden 0 |
| R2-5b2 (main.js blocked) | 2616 ms | 2543 ms |
| R2-5c and reduced-motion anchors | how 289 / contact 386, header 65 | same |
| Lenis-path anchors | 290 / 387 | same |
| R2-5a live toggles | before st 5 → after st 2, everything visible | same |

My run overwrote `tests/qa-results.json`. The file on disk now shows my numbers (2533 / 2543), not the 2538 / 2616 the reports cite. I read the orchestrator's copy before running, and it matched the reports exactly. The orchestrator should save the run the reports cite as a fixed file under `evidence/gateB/`, or rerun and update both reports.

The npm-registry hash comparison and the licence texts were NOT TESTED (no network). This is unchanged.

## 1. Are the new tests real?
**R2-5(a) live reduced-motion toggle: PASS, with one weakness.**
- **Reduce → no-preference:** this test can actually catch a bug. It would fail if a matchMedia listener built Lenis or ScrollTriggers mid-session and hid content. It meets Gate A's "when loaded reduced no triggers are created".
- **No-preference → reduce:** this one switches only after the reveals have finished (2.8 s wait), so content would be visible whether or not the switch is handled. It still checks visibility, zero uncaught errors, and the clean state after a reload. It is not empty, but it is weak.
- Recommended (does not block): also switch at about 300 ms, while the reveals are still running.

**R2-5(c) anchors with gsap, ScrollTrigger or lenis.min.js blocked, and anchors under reduced motion: PASS.**
- These go through the native path in `initAnchors` (`anchors.scrollTo` is null) and check that focus lands on the heading.
- Weakness: the position check only has a lower bound (`top >= 64`). Because `focusTarget` uses `preventScroll:true`, a jump that never scrolled would still pass on focus alone.
- The values actually recorded (289 and 386 in a 900 px viewport) show the page did scroll. Recommended: add `top < innerHeight/2`.

## 2. Report figures vs the orchestrator's results file
I checked every number cited in `studio/QA_REPORT.md` against that file, and all of them match:
- 56 rows, 56 PASS.
- ScrollTrigger counts 5→3→3 and 5→2→2.
- Anchor tops 290/387 and 289/386.
- 2538 / rehidden 0 and 2616.
- Text length 772, contrast 5.18–13.84, hash test scrollY 1573 / top 386.

`studio/PERFORMANCE_REPORT.md` cites 2538 / 2616 correctly, and the stale "NOT yet rerun" line is gone.

The performance report's byte table is out of date, and it says so. Files now on disk vs the report:

| File | Report | Now |
|---|---|---|
| index.html | 4,694 | 4,702 |
| styles.css | 10,158 | 10,145 |
| main.js | 7,918 | 8,006 |

No budget is at risk: main.js is 8,006 bytes even uncompressed, which is under the 8 KB compressed limit, and the JS total moves by under 100 bytes.

**Mismatch (blocking):** the QA report says axe is "NOT TESTED – no @axe-core". The script's own output prints `axe available: [ 'playwright' ]`. Glob confirms these files exist:
- `/home/user/Claude-code-skill/demo/node_modules/@axe-core/playwright/package.json`
- `/home/user/Claude-code-skill/demo/node_modules/axe-core/axe.min.js`

The Gate A test plan requires "axe 0 serious/critical". The reason given for not testing it is false.

## 3. The 2800 ms threshold: a fair correction, not fitting the test to the result
- The fallback is `animation: reveal-fallback 0.01s 2.5s`. Its 2.5 s clock starts when the stylesheet takes effect, but the test measures from document creation (`addInitScript` t0). So "first visible" can never be under 2500 ms plus stylesheet time plus one frame.
- My Gate A r3 limit of ≤2.6 s left 100 ms for that, which was too tight. Measured values so far: 2528–2616 ms, including my 2543.
- What the requirement actually protects is still checked: the text is never left hidden and never re-hidden (rehidden frames = 0).
- 2800 ms comes from how the mechanism works (2500 ms plus up to 300 ms load and paint delay), not from the one 2616 ms result. It is a ceiling, not a target.

Conditions:
- (a) Record the ruling below in DECISIONS.md.
- (b) Change line 40 of `studio/TECHNICAL_ARCHITECTURE.md` from ≤2.6 s to ≤2.8 s.
- (c) Take the historical "runs measured 2528-2581" out of the check name at `tests/qa-run.mjs:160`.

## 4. Frontend edits since round 1, reviewed by reading (no git history)
**main.js:23, `if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;` — correct.**
- It returns before `preventDefault`, so ctrl/cmd/shift/alt-click keeps the browser's normal behaviour (open in new tab or window).
- A plain left click is unchanged. All 12 anchor rows pass on both the Lenis path and the native path.
- The new anchor tests do not exercise the early-return branch: they all use a plain `page.click`. They only show that the normal path still works.
- Recommended: one row that dispatches a ctrlKey click and checks `defaultPrevented === false` and that the URL hash did not change.

**index.html (hero lead and meta description): no regression.**
- The text-only change leaves the `data-reveal` count at 4 and the tab order unchanged.
- Description length is fine, and the page text is still 772 characters.

**styles.css contact padding: no regression.**
- `.contact__block` uses defined tokens (`--space-4`, `--space-5`, `--space-8`, `--space-6`).
- No overflow at 360–1920.
- I viewed `tests/shots/w1440-vp-h-contact.png`: centred, rings below the text, heading well clear of the 65 px header.

**Screenshots I opened:** `tests/shots/w390-full.png`, `w1440-top.png`, `w1440-vp-h-contact.png`.
- Nothing is cut off and the hero copy is updated.
- The header appearing mid-page in the 390 full-page shot is a known artifact of full-page capture with a fixed header, and the viewport shots show it correctly.
- Pixel comparison against a baseline: NOT TESTED.

## Required changes
1. **qa-engineer (blocking):** add an axe scan to `tests/qa-run.mjs` using `@axe-core/playwright` from the demo `node_modules`.
   - Run it at 390 and 1440, with motion and with reduced motion.
   - Pass condition: 0 serious or critical violations.
   - Replace the false "no @axe-core" line in `studio/QA_REPORT.md` with the result.
2. **orchestrator:**
   - Freeze the evidence: save the run the reports cite as a copy under `evidence/gateB/`, or rerun and re-sync both reports.
   - Write the DECISIONS row below.
   - Have the TECHNICAL_ARCHITECTURE line 40 changed to ≤2.8 s.

**Non-blocking:**
- Add a modifier-click test.
- Add an upper bound to the anchor position check.
- Add a mid-reveal reduced-motion toggle.
- Remove the historical numbers from check names.
- Remeasure bytes and gzip sizes (performance-engineer).
- Still open from round 1: focus after loading with a #hash, back/forward navigation, pixel baselines, other browsers, INP/Lighthouse, and the 404 from the `lenis.min.js.map` comment.

**Licence:** unchanged. Private preview only until the Lenis LICENSE and GSAP standard-license texts are in `vendor/LICENSES/` and the hashes are checked against npm.

**DECISIONS.md row (tech-lead):**
`2026-11-16 | R2-5b/b2 limit changed from ≤2.6 s to ≤2.8 s. The CSS fallback's 2.5 s clock starts when the stylesheet takes effect, but the test measures from document creation, so the result can never be below 2500 ms plus stylesheet time; 100 ms of headroom was too little (measured 2528–2616). The real requirement (never left hidden, never re-hidden) is still asserted. | Keep 2.6 s and change the code | Fallback timing is a deliberate trade-off; tightening it risks a flash on slow loads | tech-lead`

GATE B · TECHNICAL: FAIL

---

```
HANDOFF
agent: tech-lead
phase: 10 · Gate B technical re-check (round 2)
summary: All round-1 items are fixed and I reproduced them. Vendor hashes match PROVENANCE, qa-run gives 56/56 in my run (R2-5b 2533 ms, R2-5b2 2543 ms), and the report figures match the orchestrator's results file (2538/2616). Loosening the limit to 2800 ms is a fair correction based on how the fallback works, provided it is recorded. The frontend edits introduce no regressions. FAIL on one item: axe is installed, but QA reported it absent and skipped a scan Gate A requires.
files_changed: none (no Write tool; my qa-run overwrote tests/qa-results.json and tests/shots/*, which the orchestrator asked me to run)
verification:
  - sha256sum vendor/*: PASS (4/4 match PROVENANCE.md)
  - node --check main.js: PASS ("CHECK_OK")
  - curl index.html: 200
  - node tests/qa-run.mjs: PASS "done: 56 pass / 0 fail"; R2-5b {"firstVisibleMs":2533,"rehiddenFrames":0}; R2-5b2 {"firstVisibleMs":2543}; "axe available: [ 'playwright' ]"
  - Report numbers vs orchestrator results file (read before my run): PASS, all match
  - axe scan: FAIL (tooling present at node_modules/@axe-core/playwright and axe-core, not run; the report says it is absent)
  - Screenshots w390-full, w1440-top, w1440-vp-h-contact opened: PASS by eye; pixel baselines NOT TESTED
  - npm registry hashes / licence texts: NOT TESTED (no network)
  - Bash: denied for copying the results file to scratch and for listing the axe/shots folders (worked around with Read/Glob)
open_issues:
  - qa-engineer: add an axe scan (390/1440, motion + reduced, 0 serious/critical) and correct the QA_REPORT line (blocking)
  - orchestrator: save the cited results as a fixed copy (my run replaced the file the reports cite); write the DECISIONS row; get TECHNICAL_ARCHITECTURE line 40 changed to ≤2.8 s
  - qa-engineer (non-blocking): modifier-click test, upper bound on anchor position, mid-reveal toggle, remove historical numbers from check names
  - performance-engineer (non-blocking): remeasure bytes and gzip sizes after the edits
  - user: licence texts and npm hashes before any public launch
decisions_needed: none from the user. The 2800 ms ruling is decided above and goes to DECISIONS.md.
next_suggested: qa-engineer adds axe → orchestrator reruns qa-run.mjs and saves a fixed copy of the results → tech-lead round 3, limited to the axe result and the evidence copy. Expected outcome is PASS for private preview only.
GATE B · TECHNICAL: FAIL
```

Relevant paths:
- `/tmp/claude-0/-home-user-Claude-code-skill/224276a2-c2aa-5898-b6d9-eebe905c6165/scratchpad/skillval/projB/tests/qa-run.mjs`
- `/tmp/claude-0/-home-user-Claude-code-skill/224276a2-c2aa-5898-b6d9-eebe905c6165/scratchpad/skillval/projB/tests/qa-results.json`
- `/tmp/claude-0/-home-user-Claude-code-skill/224276a2-c2aa-5898-b6d9-eebe905c6165/scratchpad/skillval/projB/studio/QA_REPORT.md`
- `/tmp/claude-0/-home-user-Claude-code-skill/224276a2-c2aa-5898-b6d9-eebe905c6165/scratchpad/skillval/projB/studio/PERFORMANCE_REPORT.md`
- `/tmp/claude-0/-home-user-Claude-code-skill/224276a2-c2aa-5898-b6d9-eebe905c6165/scratchpad/skillval/projB/studio/TECHNICAL_ARCHITECTURE.md`
- `/tmp/claude-0/-home-user-Claude-code-skill/224276a2-c2aa-5898-b6d9-eebe905c6165/scratchpad/skillval/projB/main.js`
- `/home/user/Claude-code-skill/demo/node_modules/@axe-core/playwright/package.json`