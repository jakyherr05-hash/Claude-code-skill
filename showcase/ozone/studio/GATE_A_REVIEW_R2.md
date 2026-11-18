_Tech-lead Gate A review, round 2 (narrow re-gate), at `a431067` (2026-11-18). Verbatim report; the reviewer changed no files._

# Gate A round 2 (narrow re-gate): OZONE "Your Ink"

**Verdict: PASS with conditions.** None of the 3 round-1 blockers is still open: the story DOM, rig selection and sound start now agree across all files. 22 of the 30 findings are CLOSED and 8 are PARTIAL. The fix pass introduced 14 new findings: 5 major, 9 minor. All of them are document edits.

**Conditions (to close before T6b starts; I will check them against the diff, no full re-gate):**
- the 5 new majors: N1, N3, N4, N6, N7;
- what remains of PARTIAL findings 4, 8, 14, 18, 29 and 30.

Client approval of the defaults can go ahead in parallel, because none of the conditions changes a client-facing decision.

Reviewed at HEAD `a431067` (confirmed with `git rev-parse`), diff against `28d9550` covering 15 files. I read DECISIONS (TD1–TD12, G-1..G-10), TEST_PLAN.md, `showcase/ozone/reports/typography/README.md`, `run.mjs`, `page.html`, and every changed spec.

## Your two questions

**1. Fitted height-clamp coefficients instead of the literal "1.78 × vh-curve" (G-8): acceptable.**
- The reasoning is right (CONFIRMED). 1.78 is 640/360, so the literal form only bites on viewports wider than 16:9. It trims nothing at 640×360, which is the 200 % zoom case it was meant to fix.
- I re-derived the floors at 360 px of height: h1 47.2, h2 25.7, hero 66.6, d1 55.1, d2 27.7. All are at or above their role minimums.
- The desktop sizes stay width-limited at 1440×900 and 1920×1080. Hero binds only marginally, by 0.15 px, at 1440×810.
- `run.mjs` applies the cap in JS (`Math.min(h1, 0.131*innerHeight)`) instead of rendering the new `min()` tokens. The result is numerically the same.
- Conditions:
  - (a) TD12 in DECISIONS and DESIGN §2 still state the literal form. Point both at G-8 and the TYPOGRAPHY §5 k values.
  - (b) S5, S6 and S7 at short heights are unmeasured, and no TEST_PLAN row covers them (Q-LAY-6 checks "the S1 block" only). My estimate for S5 at 640×360 (INFERRED): hero 66.6 px over 3 lines + gap + line 2 ≈ 222 px, from top 74 px, puts the bottom at about 296 px. The reserve line is 276 px, so S5 likely overlaps the toggle reserve by about 20 px. Measure before T8 and adjust hero's k if needed.
  - (c) WCAG 1.4.4 risk (INFERRED): the vw terms, and now the vh terms, limit how much display type grows under page zoom (failure technique F94). Hero is about 129 CSS px at 1280×720 and 66.6 CSS px ≈ 133 device px at 200 %, so roughly ×1.03; h1 grows about ×1.15. Body, caption and UI text are rem-based and scale fully. QA should record display sizes in device px at 100 % and 200 %, and the decision should be written down before Gate B.

**2. CDP CPU throttling may not reach Workers (G-10): the caveat is true, and the stated handling is not yet enough.**
- I measured it (CONFIRMED) in Chromium 153 with `Emulation.setCPUThrottlingRate`, using the same busy loop on both threads:
  - main thread: 45–54 ms unthrottled, 191–201 ms at rate 4;
  - dedicated Worker: 45–48 ms unthrottled, 48 ms at rate 4.
  - So the Worker is not throttled at all.
- "Report a scaled estimate" needs to become a rule in Q-AUD-11 and TEST_PLAN §3:
  - the render budget is judged on `max(measured, measured_unthrottled × 4)`, labelled "estimated";
  - a calibration loop runs in both the Worker and the main thread in each run, and its ratio is recorded;
  - the main-thread copy and graph-build chunks are still measured throttled, as they are now.
- The failure mode is mild (`audio-buffers` is non-critical with a 4 s timeout, and voices join late), so this is a condition, not a blocker.
- I did not try sending the throttle command to the Worker's own CDP target; that is NOT TESTED.

## Findings 1–30

| # | Status | Evidence (CONFIRMED unless marked) |
|---|---|---|
| 1 | CLOSED | TECH §3: `.story` > `.stage` "position:sticky; top:0; height:100lvh" + copy box "100svh text-safe box anchored top" + `.track` "12 beats … heights sum to --budget"; `end:()=>'+='+track.offsetHeight`. ANIMATION §2 and DESIGN §1.2 match. See new N3 and N12. |
| 2 | CLOSED | TECH: "One `src/motion/rig.ts` exports the media-query strings for rigs L, M, P, S and for static"; `--budget` "L/M: 1210vh; P: 1090vh; S: 1010vh". I recomputed all 12 P labels and 11 spans in ANIMATION §2: they match. DESIGN §9.1 "desktop × 0.9 (1090…)"; DESIGN §9.4 "one 150 ms debounce … only on a bucket change". Small condition: TECH says "(the build inlines the same strings into the CSS `@media` blocks, or CSS reads only the attributes)". Pick one; I recommend CSS reads only the attributes. |
| 3 | CLOSED | Matching four-case tables in TECH §6, DESIGN §5.3 and AUDIO §4; ANIMATION §7: "The loader is silent (G-1)". The DESIGN "only inside the ENTER click handler" sentence is gone. Leftovers are counted under 29; see new N1. |
| 4 | PARTIAL | Count-based progress and the six items are applied in TECH §5, DESIGN §5.1 and AUDIO. Still open: DESIGN §5.1 "S3–S7 are not loader items (they load after hand-off)" vs TECH "there are no later art chunks"; N4 (`art-s1s2` undefined); N5 (font error); Q-LOAD-1 total (N6). |
| 5 | CLOSED | ANIMATION §3: "No claim is made that it is the LCP element"; TECH §8 has the LCP row and a story-ready row. Still a client decision. See N14 (story-ready arithmetic). |
| 6 | CLOSED | TECH §4: hashed head script, `data-mode`/`data-rig`, ~12 s watchdog, module `onerror`, CSP `script-src 'self' 'sha256-<head-script-hash>'`. See new N8. |
| 7 | CLOSED | ANIMATION §2: "never `autoAlpha`, `visibility:hidden`, `display:none`"; t67 "retires by **`opacity` to 0**"; §6 captions "opacity (never autoAlpha / visibility)"; tests Q-A11Y-1 and Q-A11Y-2. |
| 8 | PARTIAL | TEST_PLAN §3 now has DPR 3, real wheel/touch input, a trace with raster/LoAF, audio running, and cut-line 6. Still open: N7. |
| 9 | CLOSED | Plan: "\| T6b \| … \| T6 + client OK \|" and "\| T7 \| … \| T6b \|"; TD8. |
| 10 | CLOSED | TECH §7: "`entry-server.tsx` imports `S1…S7` … **statically** … **no art JS chunks**"; §8 HTML and node budgets. See N9 and N10. |
| 11 | CLOSED | ANIMATION §9 Mount: `sN-panel` and `red-all` exempt, `display` sets only, no `content-visibility`; TECH §7; G-4. |
| 12 | CLOSED | TECH §6, DESIGN §5.4 and Q-AUD-4 agree: "Storage keys are exactly `ozone-sound`, `ozone-seen`, `ozone-view`; no `ozone.v1`". See N1. |
| 13 | CLOSED, with the condition in answer 2 | AUDIO §3: file-based Worker, recurrence oscillators, half-rate piano and mallet buffers; TECH §8 audio rows. I checked the memory figures (desktop 14.4 MB, mobile 11.2 MB) and the ≈17.5 M multiply-adds for the piano: both correct. |
| 14 | PARTIAL | The TYPOGRAPHY §5 clamp is measured for S1. Still open: conditions (a) and (b) from answer 1. |
| 15 | CLOSED | The TEST_PLAN matrix gives a spec, command, evidence path and rule for every row: `reports/audio/`, heap ≤ 1.10 × baseline, text-overlap method, 24 baselines, Lighthouse ×3. Internal inconsistencies are listed under N6. |
| 16 | CLOSED | TECH §3 "Scrub (TD4): `0.5` on fine pointers, `true` on `(pointer:coarse)`"; Q-SCR-7. |
| 17 | CLOSED | AUDIO: "master 0 → 1 over **0.4 s**"; "This 1.0 s rise is the visibility fade, not a toggle ramp." |
| 18 | PARTIAL | CONTINUE and Escape now set gain 0 and `suspend()`; Q-AUD-3 exists. But the truth rule is written as `ozone-sound` = `on`, while case b writes no key: see N1. |
| 19 | CLOSED | AUDIO: unlock "only inside the ENTER WITH SOUND and toggle click handlers: never on `pointerdown`"; `pageshow`/`pagehide`/`statechange` registered; silent switch marked NOT TESTED. See N2. |
| 20 | CLOSED | AUDIO: "Scheduling runs on the main thread … delays the scheduling"; file-based Workers; `worker-src 'self'`; plan line 121 updated to 120/200 ms. |
| 21 | CLOSED | AUDIO worst-case table: highest mobile figure is 62, within the 70 cap; render item (7). |
| 22 | CLOSED | ANIMATION §5 "SFX and cue direction"; AUDIO "Direction comes from `master.ts`"; TECH §2. |
| 23 | CLOSED | `scrollRestoration='manual'` plus resume with SFX suppressed, in TECH §4, ANIMATION §2, AUDIO and DESIGN §4; Q-SCR-2. |
| 24 | CLOSED | TECH §1 "Motion helpers are rewritten, not copied"; ANIMATION §1. |
| 25 | CLOSED | TECH §1: `lighthouse 13.6.0` (Apache-2.0, re-checked with `npm view`), the `overrides` block, Fontsource packages as devDependencies. |
| 26 | CLOSED | `rootMargin:'-45% 0px -45% 0px', threshold:0` in TECH, DESIGN and AUDIO. See N11. |
| 27 | CLOSED | ANIMATION §9 `?art=` override and `window.__art`; Q-SCR-8. See N13. |
| 28 | CLOSED | DESIGN: Resource h3 "omitted entirely while there is no link"; TECH §9 greps the JS chunks; Q-BLD-4 and Q-BLD-5. |
| 29 | PARTIAL | Fixed: DECISIONS and PROJECT_STATUS titles, TECH header, ANIMATION, CD §2/§7, TYPOGRAPHY, "Skip to the message", 12 beats. Still stale: CD §5 stage 7 "At 100 %, the prompt inks in"; CD §5 "Hand-off. On either choice"; CD §9 "no audio before the choice"; CD §5 "No JS … 'Skip intro' is first in tab order"; TD12 and DESIGN §2 literal clamp; DESIGN §5.1 "they load after hand-off". ASSET_MANIFEST.md, PERFORMANCE_REPORT.md and QA_REPORT.md are still titled "Clear Air (youth vaping prevention)", and the last two become T11 deliverables. |
| 30 | PARTIAL | One role per path now. Not in the map: the T6b prototype build, its placeholder art and `proto/fidelity.json`. `reports/typography/` was written by typography inside QA-owned `reports/**`. `src/motion/bridge/**` (static bridge-panel art) is owned by gsap-animator: confirm that is intended. |

## New findings

**N1. Major: the effective sound preference is undefined when no key is stored. CONFIRMED.**
- Evidence:
  - AUDIO: "The toggle reads **ON iff `ozone-sound` = `on`** AND `ctx.state === 'running'` AND master gain > 0".
  - DESIGN §5.3 case b: "No key is written (no choice was made)", yet `aria-pressed="true"`.
  - TEST_PLAN Q-AUD-2 asserts `aria-pressed === (pref==='on' && …)`, while table 2.7a(b) requires `aria-pressed==='true'`.
  - TECH §6 visibility: "resume only if preference is `on` and the user had chosen on". In case b, sound would then never come back after a tab switch.
- Why it matters: case b would show the toggle OFF while music plays.
- Fix: define `pref = localStorage['ozone-sound'] ?? 'on'` (no key means the brief's default ON) in TECH §6, AUDIO §4 and the Q-AUD-2 formula. Case b keeps writing nothing. Drop "and the user had chosen on".
- Owner: frontend-engineer, audio, qa-engineer.

**N2. Minor: which code creates the AudioContext is ambiguous. CONFIRMED.**
- Evidence:
  - TECH §6: "created lazily on `prepare()`" and also "`unlock.ts` … creates and resumes the single AudioContext … inside the ENTER/toggle click; `prepare()` adopts it".
  - The init probe in cases a–c needs a context before any click (G-6).
- Fix: `unlock.ts` exports `getContext()` (get-or-create singleton) and `unlock()` (get-or-create, `resume()` and the silent buffer, called synchronously). The boot probe and `prepare()` use `getContext()`.
- Owner: frontend-engineer (audio).

**N3. Major: S7 hand-off geometry. The text is CONFIRMED; the sticky-geometry consequence is INFERRED.**
- Evidence:
  - TECH §3 puts `<section id="scene-7">` after `.story` in normal flow.
  - DESIGN §1.2: "the pinned stage's last frame is pixel-identical to the top of `#scene-7` … takes over without a jump".
  - ANIMATION t67: "S7 HTML is the real in-flow section underneath".
- Why it matters: when the stage releases, S7's top sits 100lvh below the stage. The reader would see the stage's painted page scroll away and then the real page again.
- Fix:
  - `#scene-7 { margin-top:-100lvh }` placed under `.stage` in z-order, so the real page sits exactly under the last frame.
  - Or the creative director accepts a different release.
  - Add a Q-VIS check comparing end−1 px, end+1 px and end+100 px.
- Owner: frontend-engineer, gsap-animator, creative-director.

**N4. Major: the `art-s1s2` loader item has nothing to load after TD9. CONFIRMED.**
- Evidence:
  - TECH §5: `art-s1s2` "(the S1 and S2 art decoded and ready, critical, 6000 ms, 1 retry)".
  - TECH §7: "no art JS chunks".
  - Q-LOAD-3: "block the S1/S2 art chunk … one retry observed in the request log".
- Why it matters: the item has no network request and no real failure mode, so it pads the progress count.
- Fix: either drop the item (total 5, or 2 with sound off), or redefine it as `stage-ready`: every S1/S2 `LayerId` resolves in the DOM, the defs exist, and the S1/S2 sub-timelines build, with failure leading to static mode. Update DESIGN §5.1/§5.2, Q-LOAD-1 and Q-LOAD-3 to match (inject a missing layer id instead of blocking a chunk).
- Owner: frontend-engineer, qa-engineer, ui-ux-designer.

**N5. Minor: font failures and the error message. CONFIRMED.**
- Evidence: DESIGN §5.2 shows the error message for "a `font-*` or `art-s1s2` failure". TECH §5 says fonts "fall back to metric-matched locals (`skipped`, continue)", and Q-LOAD-3 expects the fallback.
- Fix: fonts never raise the message; it appears only on the switch to static mode.
- Owner: ui-ux-designer.

**N6. Major: TEST_PLAN contradicts the specs it tests. CONFIRMED.**
- Q-AUD-10 uses "RMS between −28 and −12 dBFS", "DC offset > 0.01" and "silence gap longer than 2 s". AUDIO §2/§6 say s3 −34…−27, s4 −31…−25, |DC| > 1e−4 and 1.5 s, and AUDIO also has true-peak, LUFS, click, spectral-line, bit-identical-render and correlation checks. As written, a correct S3 render would FAIL and a render with DC offset 100× over spec would PASS. Fix: import the AUDIO §6 checks and the §2 ±2 dB ranges as the single source.
- Q-LOAD-1: "total = 6 (4 with `ozone-sound=off`)". TD3 and DESIGN give 3 (or 2 after N4).
- Q-AUD-7: "Reverse: only bed/soft variants". AUDIO says "All SFX are silent in reverse".
- Q-PRF-1: "NOT TESTED against a target while TECH §8 has none". TECH §8 now has one.
- Section references: "ANIMATION §3" is cited for the SFX/jump rule and the beat table; they are §5 and §4.
- Q-LOAD-4 expects a "static fallback by 10 s" with every `/assets/*` request hung. Only the ~12 s watchdog can act then. Split the row into "after boot" and "bundle hung".
- Q-LAY-6: deviceScaleFactor 2/4 is not zoom. Keep only the CSS-viewport emulation.
- Q-SCR-2: compare only after the scrub-0.5 lag settles.
- Q-AUD-1(b) "visible" on the first audible frame conflicts with the toggle "fades in" in DESIGN §5.3. Specify no fade in case b, or define visible as rendered from that frame.
- Owner: qa-engineer.

**N7. Major: the T6b gate cannot finish as written. CONFIRMED.**
- (a) §3.1 compares the placeholder art to "real values … from the art agent's `proto/fidelity.json`", but the real art is drawn in T7/T8, after T6b. Fix: `fidelity.json` holds target values taken from the budgets and CD §2 (owned by frontend-engineer, signed off by creative-director). T8 measures the real art against it, and more than 10 % over triggers a T6b re-run.
- (b) This container has no GPU (`ls /dev/dri`: no such file; the demo uses `--use-angle=swiftshader`), so per §3.4 the raster criterion will always be BLOCKED. The §3.5 verdict rule requires every criterion in 3/3 runs, so no PASS is defined. Fix: in software raster, the frame-time, LoAF and long-task criteria gate; raster p95 is reported only; the verdict is labelled "lab, software raster"; real phone GPU stays NOT TESTED.
- (c) The Worker rule from answer 2.
- Owner: qa-engineer, performance-engineer, frontend-engineer.

**N8. Minor: the CSP blocks an inline `onerror`. The text is CONFIRMED; the CSP behaviour is INFERRED from the spec.**
- Evidence: TECH §4: "an `onerror` on the module `<script>`" under `script-src 'self' 'sha256-…'`. An inline event-handler attribute is blocked unless `'unsafe-hashes'` is allowed.
- Fix: the hashed head script registers `addEventListener('error', fn, true)` on `window` (capture phase, filtered to `<script>` targets).
- Owner: frontend-engineer.

**N9. Minor: hidden-world references in no-JS mode. INFERRED.**
- Static frames are `<use href="#sN-world">` pointing into the stage SVG. Patterns, masks and gradients referenced inside a `display:none` subtree are unreliable across engines.
- Fix: in non-story modes hide `svg.world` with `position:absolute; width:0; height:0; overflow:hidden`, not `display:none`.
- Also: DESIGN §1.2 says the art-slot "In story mode it is empty". It is prerendered and hidden, so reword.
- Owner: frontend-engineer, ui-ux-designer.

**N10. Minor: per-frame node counts ignore `<use>`. CONFIRMED.**
- Evidence: TECH §8 counts nodes "without `display:none` ancestors"; Q-BLD-8 says "`<use>` shadow trees not counted"; t67 renders six `sN-panel` groups through `<use>` (up to 1,800 nodes).
- Fix: add the node count of each rendered `<use>` target to the per-frame total.
- Owner: qa-engineer, performance-engineer.

**N11. Minor: the static-mode observer band can hold two panels. INFERRED.**
- The 10 % band (57–90 px) is wider than the `--space-xl` gutter (38–48 px), so two panels can be "current" at once.
- Fix: the panel covering the viewport's centre line wins (ties go by scroll direction).
- Owner: audio.

**N12. Minor: beat ids are named two ways. CONFIRMED.**
- Evidence: DESIGN "#beat-s1, #beat-t1, … #beat-s6, #beat-t67" and `data-beat="s1|t1|…|s6|t67"`, vs master labels `t12…t67`.
- Fix: beat ids equal the label names, `#beat-s1, #beat-t12 … #beat-t67`.
- Owner: ui-ux-designer, frontend-engineer.

**N13. Minor: where the test hooks exist. CONFIRMED.**
- Evidence: G-9 says "Debug/test hooks in dev and test builds only", but TEST_PLAN says `__labels` is "Present in production build", and §0 runs every test "against the production build".
- Fix: ship the hooks in the production bundle but expose them only when tests set `window.__OZONE_QA__` via `addInitScript`; Q-BLD checks they are absent otherwise.
- Owner: frontend-engineer, qa-engineer.

**N14. Minor: hand-off duration and the story-ready target. CONFIRMED arithmetic.**
- Evidence: ANIMATION §3 says "≈ 1.0 s hand-off". ANIMATION §7 adds up to 0.6 + (0.7 + 0.7 − 0.35) = 1.65 s, plus 0.3 s when the prompt shows. DESIGN §4 says "≈ 2.2 s".
- The floor for story-ready is therefore about 4.55 s in case b against a target of "≤ 5.0 s". In case a it includes human decision time, so it can never meet the target.
- Q-LOAD-2's "hand-off ≤ 1,000 ms" does not say whether it means start or end.
- Fix: one hand-off duration everywhere; measure story-ready in the autoplay-allowed project, or subtract the prompt wait; set the target from the floor.
- Owner: gsap-animator, performance-engineer, qa-engineer.

## Client decisions
1. G-1 sound start. When autoplay is allowed, there is no prompt: the score starts at the hand-off with the toggle visible and ON. The loader is always silent.
2. G-3 / D-2. An explicit "without sound" choice persists across visits and suppresses the prompt.
3. G-2 LCP. Keep the headline ink reveal, accepting that the measured LCP will likely exceed 2.5 s. Story-ready is reported separately; its target is to be set from the ≈ 4.55 s floor (N14).
4. The added T6b prototype task. It is a scope and schedule change to the approved plan.
5. The production URL for canonical and OG tags (D5).
6. The protagonist's gender read.
7. Scene 6 shows an adult customer (no teen being refused).
8. M7 stays off.
9. A placeholder typographic wordmark, or the client supplies a logo.
10. "No exceptions" is OZONE's own statement; the client confirms it is true of store practice.
11. California stays BLOCKED: no CDPH link and no Resource heading unless the client supplies a source.
12. No quit-help resource (I-5).
13. Real-device testing, or accept NOT TESTED. This now includes:
    - raster measured only in software (no GPU here);
    - the Worker render time as a scaled estimate;
    - the iOS silent-switch limit (toggle can read ON while muted).
14. Who deploys the hosting configuration (headers, CSP).
15. Final approval of the music.

## HANDOFF
- **agent:** technical-lead
- **phase:** T6 Gate A round 2 (narrow re-gate)
- **summary:** PASS with conditions. Findings 1–30: 22 CLOSED, 8 PARTIAL (4, 8, 14, 18, 29, 30). New: 5 major (N1, N3, N4, N6, N7) and 9 minor. G-8 is acceptable with 3 conditions. The G-10 caveat is true (measured) and its handling needs a rule.
- **files_changed:** none
- **verification:**
  - `git rev-parse --short HEAD` → `a431067`. `git diff --stat 28d9550..a431067` → 15 files, +1165/−259. PASS.
  - P-rig label table recomputed (×0.9, rounded to 5): end 1090, all labels and spans match. PASS.
  - Audio buffer memory recomputed: 14.4 MB desktop / 11.2 MB mobile, matching AUDIO. PASS.
  - `grep` of the remaining "1.78", "Clear Air", "At 100 %", "#beat-" and "art-slot" strings: the evidence for findings 29, N12 and N9.
  - `node thr.mjs` (Playwright, Chromium 153, `Emulation.setCPUThrottlingRate`): `{"1":{"main":[54,47,45],"worker":[48,45,48]},"4":{"main":[191,201,194],"worker":[48,48,48]}}`. The Worker is not throttled. CONFIRMED.
  - `ls /dev/dri` → "No such file or directory"; `nproc` 4. Software raster only (N7b).
  - Build, typecheck and browser runs: NOT TESTED (no code exists).
- **open_issues → owner:** N1 → frontend-engineer, audio, qa-engineer. N3 → frontend-engineer, gsap-animator, creative-director. N4 → frontend-engineer, qa-engineer, ui-ux-designer. N6 → qa-engineer. N7 → qa-engineer, performance-engineer, frontend-engineer. N2, N5 and N8–N14 as listed above. What remains of PARTIAL findings 4, 14, 29 and 30 goes to its named owners.
- **decisions_needed:** client items 1–15; creative-director acceptance of the N3 fix.
- **next_suggested:** owners apply the conditions; I check them against the diff only; client approval; then T6b.

