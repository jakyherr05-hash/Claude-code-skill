# T6b verdict: t45 and t67 prototype (QA, independent)

**Label: lab, software raster, emulated.** Chromium 153.0.8010.12 headless, no GPU (`/dev/dri` absent, WebGL renderer = SwiftShader), 4 cores (`nproc` 4), load average 0.5 to 1.6 during runs (recorded per run in each JSON as `host.before/after`). Control page (empty, same viewport/DPR/throttle, 4 s rAF) was 16.7 ms p50 / 16.8 max / 0 frames over 50 ms before every config, so the host was not starved. Prototype HEAD 969c731, placeholder art, audio is a load stand-in.

## Verdict

| Span | Default build | Cut-line ladder | Result |
|---|---|---|---|
| **t45** (S4 to S5, includes cue 4 to 5) | **FAIL** 0/24 runs pass, every config | cut=1..6 cumulative and `cutonly=6` all FAIL in screening; **ladder exhausted** | **FAIL** (lab, software raster) |
| **t67** (S6 to end) | **FAIL** 0/24 runs pass | first variant that survives screening: cumulative `cut=6` (cut=5 passes B only, A fails); full 3-run protocol on cut=6: **FAIL strictly on config A** (4/12 runs pass), B/C 11/12 (strict), all of B/C pass under vsync tolerance | **FAIL strictly**; closest to passing; needs a decision (below) |
| Worker render budget (400 ms, G-17 rule, mobile profile, "estimated") | 17/24 runs within, median 361, worst 433 | cut6: 20/24, worst 436 | **FAIL strictly** (marginal, noisy; the unthrottled mobile render is 85 to 110 ms and x4 puts it on the line) |
| Placeholder-fidelity precondition (default) | PASS (re-run with proto's `fidelity-measure.mjs`, my output `fidelity-default-qa.json`): halftone and nodes in band, 0 filtered layers, mask on the same element, box 1.02; nodes 0.92 to 0.99 of target | cut6: **not representative** (mask removed, node cull drops s4/s5 to 0.27 to 0.49 of target `fidelity-cut6-qa.json`) | any cut-line pass is a pass of a reduced scene |

Dominant cause (from the traces, not asserted): **default build**: main thread `Layerize` is 2389 of 2695 ms of main-thread task time in one 5.9 s t45 desktop window (about 11 ms per `Layerize` average, up to 255 ms; SVG repaint of the whole root per frame). With cut6 `Layerize` falls to 48 ms. Remaining t45 failure at cut6 on config B/C is the **Viz compositor thread `Display::DrawAndSwap` in SoftwareRenderer** (75 draws, 2065 ms, max 89 ms; t67 cut6 B: 89 draws, 876 ms, max 17 ms), main thread is fine (BeginMainFrame 303 ms total). That cost is a software-compositing artefact of this lab: it may not exist on a GPU. This is why t45 is "FAIL in the lab", not "FAIL on devices", and why a GPU run is the only way to settle it.

## Pass criteria (TEST_PLAN 3.5), strict as written

Gates: zero frames > 50 ms; p95 <= 33 ms; long tasks 0 and LoAF > 50 ms 0 during slow scroll; (raster p95 reported only in software raster); precondition audio running, cue fires. All 3 runs, every config, slow and fast, forward and reverse.

| Criterion | t45 default | t45 cut6 | t67 default | t67 cut6 |
|---|---|---|---|---|
| Audio precondition (ctx running, gain > 0.3, rms > 1e-4, cue 4/6 voices) | PASS 48/48 | PASS | PASS | PASS |
| Cue fires in span (cueLog has 5 / 7, +1 direction) | PASS | PASS | PASS | PASS |
| No `filter` in stage | PASS | PASS | PASS | PASS |
| Zero frames > 50 ms | FAIL all configs | FAIL all | FAIL all | FAIL A (1 to 2 per config), PASS B/C (only 50.0/50.1 ms 3-vsync intervals) |
| p95 <= 33 ms | FAIL all | FAIL all | FAIL all | A touch-fast 33.3 (2 vsyncs) FAIL strict; rest PASS or 33.3 quantisation |
| Long tasks 0 (slow) | FAIL | A 1 touch-slow, B 0, C 1 | FAIL A, B 1 | A 2 wheel-slow, B/C 0 |
| LoAF > 50 ms 0 (slow) | FAIL A, 0 on desktop | FAIL (B/C 14 to 27) | FAIL A | A 2 wheel-slow, B/C 0 |
| Raster p95 per frame (software, REPORTED ONLY) | A 6 to 15 ms, B/C 30 to 40 | A 9 to 13, B/C 24 to 35 | A 0.5 to 11, B/C 29 to 31 | A 0.5 to 6, B/C 2.5 to 8 |
| Console errors | PASS none | PASS | PASS | PASS |

*Vsync tolerance sensitivity (NOT the gate; I did not move it).* The plan's "> 50 ms" and "p95 <= 33 ms" are quantised by a 60 Hz vsync: a 3-vsync interval is 50.0 to 50.1 ms and a 2-vsync interval is 33.3 to 33.4 ms, so the strict numbers fail on a single missed frame by 0.1 ms. With "> 50.5" and "p95 <= 33.5" and long tasks / LoAF unchanged, t67 cut6 passes on B and C (6/6 each) and on A 5/12 runs (touch-fast 0/3, touch-slow 2/3, wheel-fast 2/3, wheel-slow 1/3). The A failures that remain have a real long task or LoAF > 50 ms (1 to 2 per config), which the tolerance does not change. t45 stays FAIL under any tolerance (frames 66 to 566 ms).

## Per-config tables (median / worst of 3 runs; forward and reverse folded, worse of the two)

Columns: pass runs strict / vsync-tolerant; achieved forward speed (px/s; nominal slow 3600, fast 24000, so "slow" was slower than nominal where the page janked, input is on a fixed schedule and not awaited); audio late max = worst note start lateness in the audio scheduler (ms); raster p95 REPORTED ONLY; Worker estimate = max(measured, unthrottled x4) per run.

### Default build

#### t45 (default)

| cfg | input | speed | runs | pass runs strict / vsync-tolerant* | achieved px/s (fwd) | frame max ms med/worst | p95 ms med/worst | frames>50 (sum) | long tasks (sum) | LoAF>50 (sum) | audio late max ms | raster p95 ms/frame med/worst (reported) | Worker est. ms (budget 400, mobile gating) |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| A | touch | fast | 3 | 0/3 / 0/3 | 3060 | 450.0 / 516.6 | 433.4 / 450.0 | 20 | 19 | 4 | 579.8 | 12.9 / 13.0 | 368.4, 330.4, 336.4 |
| A | touch | slow | 3 | 0/3 / 0/3 | 1639 | 466.7 / 483.4 | 450.0 / 466.7 | 30 | 30 | 4 | 510.2 | 15.0 / 15.5 | 426, 360.8, 383.6 |
| A | wheel | fast | 3 | 0/3 / 0/3 | 5371 | 450.0 / 533.3 | 366.7 / 383.4 | 12 | 12 | 3 | 510.2 | 6.1 / 7.0 | 411.6, 364.4, 432.8 |
| A | wheel | slow | 3 | 0/3 / 0/3 | 2075 | 566.6 / 566.7 | 433.4 / 566.7 | 28 | 28 | 4 | 460.8 | 12.4 / 13.5 | 336, 302, 337.2 |
| B | wheel | fast | 3 | 0/3 / 0/3 | 4600 | 250.0 / 283.3 | 249.9 / 249.9 | 25 | 19 | 0 | 231.5 | 33.6 / 40.0 | 582.4, 519.2, 501.6 |
| B | wheel | slow | 3 | 0/3 / 0/3 | 2864 | 266.7 / 333.3 | 233.3 / 316.6 | 44 | 36 | 0 | 260.6 | 35.0 / 35.8 | 431.2, 438.4, 501.6 |
| C | wheel | fast | 3 | 0/3 / 0/3 | 6185 | 283.3 / 283.4 | 250.1 / 266.6 | 28 | 21 | 1 | 301.2 | 29.6 / 35.6 | 474.8, 535.2, 492.4 |
| C | wheel | slow | 3 | 0/3 / 0/3 | 2554 | 300.0 / 300.0 | 250.0 / 266.6 | 37 | 32 | 1 | 292.5 | 39.0 / 40.7 | 608, 504.8, 521.2 |

#### t67 (default)

| cfg | input | speed | runs | pass runs strict / vsync-tolerant* | achieved px/s (fwd) | frame max ms med/worst | p95 ms med/worst | frames>50 (sum) | long tasks (sum) | LoAF>50 (sum) | audio late max ms | raster p95 ms/frame med/worst (reported) | Worker est. ms (budget 400, mobile gating) |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| A | touch | fast | 3 | 0/3 / 0/3 | 3262 | 100.1 / 133.4 | 66.7 / 100.0 | 10 | 14 | 8 | 649.5 | 8.4 / 9.3 | 411.6, 336, 431.2 |
| A | touch | slow | 3 | 0/3 / 0/3 | 1710 | 83.4 / 116.6 | 50.1 / 83.3 | 14 | 18 | 3 | 571.1 | 9.9 / 10.2 | 314, 429.2, 349.2 |
| A | wheel | fast | 3 | 0/3 / 0/3 | 6972 | 116.8 / 150.0 | 33.3 / 33.4 | 7 | 9 | 4 | 402.8 | 0.5 / 3.0 | 377.6, 331.6, 328.4 |
| A | wheel | slow | 3 | 0/3 / 0/3 | 3567 | 100.0 / 100.0 | 66.6 / 66.7 | 15 | 20 | 3 | 481.2 | 11.3 / 11.3 | 347.6, 332.8, 406.4 |
| B | wheel | fast | 3 | 0/3 / 2/3 | 15471 | 50.1 / 83.4 | 33.4 / 66.8 | 4 | 0 | 1 | 240.2 | 31.3 / 32.5 | 505.6, 576, 501.2 |
| B | wheel | slow | 3 | 0/3 / 0/3 | 3485 | 50.1 / 66.7 | 50.0 / 50.0 | 3 | 1 | 0 | 249.0 | 31.2 / 34.6 | 426.8, 489.6, 452.8 |
| C | wheel | fast | 3 | 0/3 / 1/3 | 13722 | 50.0 / 50.1 | 49.9 / 50.0 | 1 | 0 | 0 | 309.9 | 29.0 / 30.6 | 463.6, 429.6, 510 |
| C | wheel | slow | 3 | 0/3 / 1/3 | 3298 | 66.7 / 166.7 | 50.0 / 50.0 | 5 | 1 | 0 | 321.5 | 28.7 / 32.5 | 449.2, 526, 456 |

### Cumulative cut=6 (all six cut-lines)

#### t45 (cut6)

| cfg | input | speed | runs | pass runs strict / vsync-tolerant* | achieved px/s (fwd) | frame max ms med/worst | p95 ms med/worst | frames>50 (sum) | long tasks (sum) | LoAF>50 (sum) | audio late max ms | raster p95 ms/frame med/worst (reported) | Worker est. ms (budget 400, mobile gating) |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| A | touch | fast | 3 | 0/3 / 0/3 | 3645 | 83.4 / 133.3 | 16.8 / 50.0 | 6 | 2 | 4 | 80.6 | 11.2 / 11.7 | 354.4, 361.6, 314 |
| A | touch | slow | 3 | 0/3 / 2/3 | 1868 | 50.0 / 66.6 | 33.3 / 49.9 | 1 | 1 | 0 | 251.9 | 11.3 / 12.7 | 393.2, 369.2, 348 |
| A | wheel | fast | 3 | 0/3 / 0/3 | 13589 | 100.0 / 116.7 | 33.2 / 33.3 | 8 | 4 | 7 | 28.4 | 9.4 / 10.8 | 367.2, 405.2, 334.4 |
| A | wheel | slow | 3 | 0/3 / 0/3 | 3631 | 83.3 / 100.0 | 33.3 / 33.3 | 4 | 3 | 3 | 80.6 | 11.4 / 12.8 | 408.8, 390.4, 302.8 |
| B | wheel | fast | 3 | 0/3 / 0/3 | 22285 | 150.0 / 216.6 | 116.7 / 116.7 | 17 | 5 | 18 | 51.6 | 27.2 / 27.4 | 520, 512.8, 490.4 |
| B | wheel | slow | 3 | 0/3 / 0/3 | 3058 | 216.7 / 233.3 | 83.4 / 116.7 | 23 | 0 | 27 | 40.0 | 23.8 / 26.3 | 428.4, 428.4, 520 |
| C | wheel | fast | 3 | 0/3 / 0/3 | 19117 | 150.0 / 166.7 | 116.6 / 116.7 | 11 | 4 | 14 | 55.2 | 26.5 / 31.4 | 488.4, 448.8, 430 |
| C | wheel | slow | 3 | 0/3 / 0/3 | 3097 | 233.2 / 233.4 | 83.3 / 83.4 | 17 | 1 | 14 | 31.3 | 29.2 / 35.5 | 512, 494.4, 404.8 |

#### t67 (cut6)

| cfg | input | speed | runs | pass runs strict / vsync-tolerant* | achieved px/s (fwd) | frame max ms med/worst | p95 ms med/worst | frames>50 (sum) | long tasks (sum) | LoAF>50 (sum) | audio late max ms | raster p95 ms/frame med/worst (reported) | Worker est. ms (budget 400, mobile gating) |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| A | touch | fast | 3 | 0/3 / 0/3 | 3239 | 49.9 / 50.1 | 33.3 / 33.3 | 1 | 2 | 1 | 40.0 | 3.0 / 3.0 | 416.8, 372, 336.4 |
| A | touch | slow | 3 | 1/3 / 2/3 | 1719 | 33.5 / 50.0 | 16.8 / 33.3 | 0 | 1 | 1 | 22.6 | 6.1 / 6.7 | 356, 389.2, 400 |
| A | wheel | fast | 3 | 2/3 / 2/3 | 23721 | 50.0 / 83.3 | 16.8 / 16.8 | 1 | 1 | 2 | 22.6 | 0.5 / 0.5 | 322.8, 352.4, 361.6 |
| A | wheel | slow | 3 | 1/3 / 1/3 | 3657 | 49.9 / 50.0 | 16.8 / 16.8 | 0 | 2 | 2 | 11.0 | 1.1 / 3.0 | 436.4, 343.2, 312 |
| B | wheel | fast | 3 | 3/3 / 3/3 | 20309 | 16.8 / 33.3 | 16.8 / 16.8 | 0 | 0 | 0 | 31.3 | 3.2 / 3.3 | 406.8, 463.2, 433.6 |
| B | wheel | slow | 3 | 2/3 / 3/3 | 3483 | 16.8 / 33.4 | 16.8 / 33.3 | 0 | 0 | 0 | 31.3 | 7.8 / 8.3 | 397.2, 424.4, 420.8 |
| C | wheel | fast | 3 | 3/3 / 3/3 | 21524 | 33.3 / 33.3 | 16.8 / 16.8 | 0 | 0 | 0 | 40.0 | 2.5 / 3.4 | 534.4, 450.8, 420 |
| C | wheel | slow | 3 | 3/3 / 3/3 | 3511 | 33.4 / 33.4 | 16.8 / 16.8 | 0 | 0 | 0 | 31.3 | 8.0 / 8.0 | 414.4, 456.4, 536.8 |

## Cut-line screening (ANIMATION 9 order), 1 run each of A touch-slow, A wheel-fast, B wheel-slow, B wheel-fast per span
Any failure fails the variant (the full rule needs every config and every run), so a fail here is final; only a surviving variant gets the full protocol. Files `t45-cutN-<cfg>-run1-<input>-<speed>.json`.

| Variant | t45 | t67 |
|---|---|---|
| cut=1 (opacity stagger replaces mask) | FAIL (max 517 / 283 ms) | FAIL (A 83 ms, 1 long-task) |
| cut=2 (+ halftone density) | FAIL | FAIL |
| cut=3 (+ lite tier) | FAIL | FAIL (B p95 50) |
| cut=4 (+ node cull) | FAIL (A 383, B 200) | FAIL A; B wheel-fast pass |
| cut=5 (+ bake filters: no-op, 0 filters) | FAIL | FAIL A; B passes both |
| cut=6 (+ HTML-wrapped planes), cumulative | FAIL (A near: 50.1 ms; B 200, 133 ms; LoAF 3 to 4) | passes screening 4/4; full protocol: see above, strict FAIL on A |
| `cutonly=6` (HTML wrap alone) | FAIL (A 83, B 267 ms) | FAIL (long tasks, 50 ms frames) |

First variant that passes: t45 none. t67 none strictly; cumulative cut=6 is the first to survive screening and the first to pass B/C fully, and passes A in 4/12 runs. HTML-wrapped planes alone (`cutonly=6`) are not enough for either span; the structural change is the one that matters (default `Layerize` 2389 ms to 48 ms), but with cuts 1 to 4 also applied.

## Filmstrips (12 positions, real DPR, opened)
`filmstrip/t45-A-390x844@3x.jpg` (default): s4 with red roughs and the figure, captions stack, mask/erase and crumbs around frame 8 to 9, S5 headline "YOUR FUTURE IS BIGGER THAN A CIGARETTE." at 11 to 12; at 390 the caption cards cover the figure's torso and the red "BUT THE RISKS ARE REAL." is low contrast against red roughs (placeholder art, noted only). `t45-B-1440x900@1x.jpg` default and `t45-cut6-B` side by side: same story beats and layout; cut6 is visibly darker and sparser (halftone density, far-plane freeze, fewer crumbs), and frame 12 shows a yellow card in the S5 scene that the default lacks at that position. `t67-cut6-B`: OZONE hero on near-black, paper wipe from frame 6, panel grid of six tiles with the OZONE card and "DON'T START." at the end; no tearing or blank frames in the stills. Other sheets (t67 default, A/C) were written but not opened: NOT described.

## Audio and Worker
Audio ran the whole time (autoplay-policy flag, `__OZONE_QA__` init script, `?audioprofile=mobile` for 390, `desktop` for 1440): precondition PASS in 96/96 pages. Audio scheduler lateness (`stats.late.maxMs`): default t45 A up to 580 ms, t67 A 650 ms (default build); cut6 t45 A 252 ms, t67 A 23 ms; desktop 230 to 320 ms default, 30 to 55 ms cut6. These are notes starting late because the main thread is blocked; at default they would be audible. Calibration loop main/worker ratio on A = 3.3 to 5.5 (target 4), confirming throttle hits the main thread only.

## NOT TESTED
Real devices (iOS Safari, Android Chrome, thermal), GPU raster and GPU compositing (this lab is software; raster p95 is reported, not compared with 8 ms), Firefox, WebKit, real audio output device, Worker throttling under CDP (estimate only), real art (placeholder), Lenis (prototype uses native scroll, so Lenis/ScrollTrigger sync is not part of this measurement).

## Method deviations and plan defects (mine, TEST_PLAN to fix)
1. `Input.synthesizeScrollGesture` with `gestureSourceType:'touch'` dispatched touch events but never scrolled in Chromium 153 here (scrollY unchanged; `default` produced wheel events). The touch path is built from `Input.dispatchTouchEvent` drags (16 ms steps at 3,600 and 24,000 px/s, 80 ms dwell before lift to avoid fling, swipes of at most 60 % viewport height). Achieved speeds are in the JSON; "fast" touch reached about 3,000 px/s achieved because the page janked, not because Chromium capped it.
2. Wheel steps are scheduled at 16 ms and not awaited one by one, so a janky page does not slow its own input.
3. Frame window = first input to last input + tail (800 ms wheel, 400 ms touch) for catch-up; forward and reverse are separate windows, both must pass.
4. Quantisation of the thresholds (above) needs a ruling: suggest "> 50 ms" read as more than 3 vsyncs and "p95 <= 33 ms" as at most 2 vsyncs.
5. Browser-level tracing is on during measurement (as the plan requires). An untraced control run on default t45 B wheel-slow gave the same failure (max 267 vs 283 ms, 63 long tasks), so tracing is not what fails the build.
6. Run structure: default and cut6 full protocol (3 runs, all configs); other variants screened. `tests/*.mjs` scripts, not a Playwright Test project (per-run fresh contexts, browser-level trace, custom evidence JSON).
7. Evidence size: `reports/proto/` is about 173 MB (trace gz about 6 MB each, 140+ traces). Recommend keeping only metrics JSON and filmstrips in git and the traces outside (lead's decision; nothing committed).

## Problems with the prototype
- Hooks all present and correct: `__labels` (rig, px, units), `__ozoneStats` (audio snapshot with `cueLog`, `render`, `late`, `rms`, `masterGain`), `__playhead`, `__art`, `story-ready` mark. No `cue:s5` console line exists; I used `audio.cueLog` instead (equivalent evidence).
- Cut-line 5 is a no-op in this prototype (0 filters), so cut=5 equals cut=4 by construction.
- `?cut=6` and `cutonly=6` both leave `maskTarget` null (cut1 removes the mask) for cut=6; `cutonly=6` keeps it. The fidelity script reports `maskPass:false` for cut6 as expected.
- Fidelity under cuts is not re-gated by the prototype; node counts at cut6 are 0.27 to 0.99 of target, so a cut6 pass is not a pass of the budgeted scene.
- Audio is already late at load before any scroll (8 late notes, 190 ms desktop; 4, 92 ms mobile) in an idle page.

## Commands
```
cd showcase/ozone/proto && npm ci && npm run build && npm run preview        # http://localhost:4174/
cd showcase/ozone/proto/tests
node t45.mjs                      # default build, A,B,C x 3 runs x (touch|wheel) x (slow|fast)
node t67.mjs
./cutlines.sh                     # screening of cut1..6 and cutonly6
node t67.mjs --variant cut6 --query "cut=6"; node t45.mjs --variant cut6 --query "cut=6"
node filmstrip.mjs; node filmstrip.mjs --variant cut6 --query "cut=6"
node summarize.mjs default; node summarize.mjs cut6
node ../fidelity-measure.mjs [--query "?cut=6"] --out ../reports/proto/fidelity-<x>-qa.json
```
Evidence: `reports/proto/t45-<cfg>-run<N>.json`, `t67-...`, `t45-cut6-...`, screening `t45-cutN-<cfg>-run1-<input>-<speed>.json`, traces `reports/proto/t45|t67/*.trace.json.gz`, filmstrips `reports/proto/filmstrip/`, `summary-default.md`, `summary-cut6.md`.

## Orchestrator verification (independent of the QA scripts)
A separate, lighter probe (`proto/tests/orchestrator-probe.mjs`: no CPU throttle, no trace, one wheel pass, rAF intervals) agrees in direction. t45 at 1440×900@1: default max 183 ms; per-plane layers only (`cutonly=6`) max 100 ms; cumulative `cut=6` max 117 ms. t45 at 390×844@3: default 117 ms; `cutonly=6` 50.0 ms; `cut=6` 67 ms. t67 at 1440: default 50.0 ms; `cut=6` 16.8 ms. Single unthrottled runs: direction only, not a gate. Rulings G-24..G-26 in DECISIONS.md. Raw traces are git-ignored (local only).
