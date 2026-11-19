# Decision Log — OZONE — "Your Ink" (cigarettes-only graphic novel; the vaping-era title was superseded 2026-11-18)

| Date | Decision | Alternatives | Rationale | Decided by |
|---|---|---|---|---|

## 2026-11-18 · Orchestrator decisions on the T6 draft (TECHNICAL_ARCHITECTURE.md)
| # | Question | Decision | Why |
|---|---|---|---|
| D1 | Audio before the user's choice (CREATIVE_DIRECTION §9 says no audio before the choice) | **Attempt audible playback on init**; if the browser blocks it, show ENTER WITH SOUND / CONTINUE WITHOUT SOUND. A saved explicit OFF always wins. | The client brief explicitly requires attempting autoplay; the client instruction overrides the creative doc. |
| D2 | Copy SplitText registration and `lit.ts`? | **No.** Headline reveals are stroke/mask ink reveals. | One fewer dependency; nothing uses it. |
| D3 | Playwright version | **Keep 1.63.0.** | Matches the pre-installed Chromium 1243; installing another version breaks browser lookup. |
| D4 | Mono font | **Dropped** (typography recommendation). | Keeps first-load fonts at 112 KB. |
| D5 | Production URL for canonical/OG | **Client decision**, listed for Gate A. | Unknown. |

## 2026-11-18 · Orchestrator decisions on DESIGN_SPECIFICATION.md
- D-1…D-7 (ui-ux) accepted: Escape = continue without sound; returning no-sound visitors get no prompt; wordmark not a tab stop; no nav landmark; static comic puts text on plates; viewports < 360 px tall use the static comic; toggle and skip link are opaque pills.
- I-1 (Scene 5 horizon ~72 % so the headline fits): accepted provisionally; creative-director judges it in the render-critique loop.
- I-2 (CDPH link): ships only after a source read confirms the URL (California still BLOCKED).
- I-5 (quit-help resource): not added; the client brief does not ask for one and FACTS has none for this brief.

## 2026-11-18 · Orchestrator decisions on ANIMATION_SPECIFICATION.md
- A-1 Track height = story budget + 100svh (sticky stage sits inside the track). TECHNICAL_ARCHITECTURE §3 `--track-h: 1210vh` is wrong; frontend corrects it before Gate A.
- A-2 Rig M uses the desktop scroll table; rig P = desktop × 0.9 rounded to 5 (gsap-animator proposal) — creative-director may tune after the filmstrip.
- A-3 Scroll is NOT locked during the 1.5 s score fade: it unlocks at the loader hand-off; music fades in alongside (client: no unnecessary delays). Overrides CD §5 on this point.
- A-4 `sfx:tNM:<id>` / `cue:sN` / `cue:t45:lowpass-open` label names are the contract for AUDIO_SPECIFICATION.

## 2026-11-18 · Orchestrator decisions on AUDIO_SPECIFICATION.md
- AU-1 Add `setPlayhead(units, dir)` to the AudioDirector contract (throttled to one call per frame from `master.ts` `onUpdate`); `setCue` alone cannot drive within-scene intensity. TECHNICAL_ARCHITECTURE §6 updated.
- AU-2 Mute/unmute gain ramp is 0.4 s everywhere (architecture and audio spec); DESIGN_SPECIFICATION §3.2's 300 ms changed to match. `aria-pressed` still flips at once.
- AU-3 Streetlight plucks (`sfx:t45:pluck1..5`) fire on their label, NOT quantised to the next 16th: up to 208 ms of lag against a scroll-bound light is a visible audio/visual mismatch, and the lights cannot wait for the audio clock. Pitches stay in the chord set, so they remain in key. Creative director may revisit after the t45 prototype.
- AU-4 `loader:bloom` accepted as an internal AudioDirector event (the loader is not on the master timeline), played only when autoplay succeeds.
- AU-5 No `cue:s1` label: the loader hand-off calls `setCue(1,+1)`. The near-silence stays keyed to `sfx:t45:eraser-rub` (no new label). `sfx:footstep` keeps its single id; the variant comes from the playhead.

## 2026-11-18 · Gate A round 1 (FAIL, 30 findings: GATE_A_REVIEW_R1.md) — technical decisions
- TD1 Story DOM: `<div class="story">` = `.stage` (sticky, `height:100lvh`, world SVG + six copy layers in a `100svh` text-safe box anchored top) followed by `.track` (12 beats `#beat-s1…#beat-t67` summing to `--budget`); `#scene-7` and Sources follow `.story`. One ScrollTrigger: trigger `.story`, `start:'top top'`, `end:()=>'+='+track.offsetHeight` (CSS is the single source). Anchors = instant JS `scrollTo` to the beat; hash at load handled. Test per rig: `st.end − st.start === track.offsetHeight`. Supersedes A-1's wording (the budget arithmetic of A-1 still holds).
- TD2 One `src/motion/rig.ts` exports the media-query strings for rigs L/M/P/S and static (reduced motion, `max-height:359px`, `?view=text`). A CSP-hashed pre-paint head script writes `html[data-mode][data-rig]`; CSS `--budget` keys on `[data-rig]`; `gsap.matchMedia` uses the same strings. Width-based motion branches removed (the grid stays width-based for layout only). Rig rebuild only on a bucket change; one 150 ms debounce; DESIGN's 120 px rule dropped. ANIMATION publishes the full P label table (labels rounded to 5).
- TD3 Loader progress is count-based: items `font-display`, `font-text`, `art-s1s2`, `audio-engine`, `audio-ir`, `audio-buffers`. S3–S7 are not loader items. With `ozone-sound=off` the audio items are excluded from the total and load on the first toggle ON (`aria-busy`). `audio-buffers` timeout = skipped, rendering continues, voices join when ready. Critical art failing after its retry: story continues on the prerendered DOM if the master builds, otherwise static mode with the DESIGN §5.2 message. No weights.
- TD4 Scrub `0.5` on fine pointers, `true` on `(pointer:coarse)` (ANIMATION §1).
- TD5 Storage: `localStorage['ozone-sound']` = on|off, persistent, written only by ENTER, CONTINUE, Escape or the toggle. `sessionStorage['ozone-seen']` = short loader. `sessionStorage['ozone-view']` = text-view choice. No `ozone.v1` object.
- TD6 Headlines and captions animate opacity or clip-path only: never autoAlpha, `visibility:hidden`, `display:none` or removal. QA asserts all 7 headlines and all captions are in the accessibility tree at 5 sampled playheads.
- TD7 CSP keeps `style-src 'unsafe-inline'` (SVG/GSAP inline styles; no third parties). Scripts only `'self'` plus the head script's sha256 hash; `worker-src 'self'`. A ~12 s watchdog in the head script (and `onerror` on the module script) reverts to static and removes `js-loading` unless `main.tsx` signals boot.
- TD8 Plan change: new task **T6b** — t45 then t67 prototype on placeholder art matching the real fill area, filters and mask, measured with QA's protocol (DPR 3 at 390×844, DPR 1 and 2 at 1440×900, real wheel/touch input, CDP trace with paint/raster/LoAF, audio running) → performance verdict + cut-lines, after client approval of Gate A and before T7. T8 depends on T6b passing.
- TD9 Art is prerendered and NOT hydrated: the SSR entry imports scenes statically; the client never re-renders art; static frames are `<svg viewBox=…><use href="#sN-world"/></svg>` windows. Budgets: prerendered HTML ≤ 250 KB gz, document SVG nodes ≤ 20,000, rendered nodes in any frame ≤ 5,000 (3,600 at 390). "Initial JS" = all JS requested before the hand-off. t67 panels are low-detail `sN-panel` groups in `<defs>` (≤ 300 nodes each), exempt from `mount`; `mount` uses only `display` sets on aria-hidden art; `content-visibility` dropped.
- TD10 Audio buffers render in a file-based Worker (recurrence oscillators; production keeps exactly one AudioContext); any main-thread remainder in ≤ 16 ms chunks. Budgets in TECH §8: buffer memory ≤ 17 MB desktop / 12 MB mobile, render ≤ 400 ms (lab, mobile profile), no long task from audio, `renderCapacity` ≤ 25 %, node caps. Unlock only inside ENTER and toggle click handlers. Toggle ON = preference on AND `running` AND gain > 0; CONTINUE/Escape set gain 0 and `suspend()`. Static-mode cue observer uses `rootMargin:'-45% 0px -45% 0px', threshold:0`. `history.scrollRestoration='manual'`; resume to stored scene/hash after hand-off with SFX suppressed.
- TD11 tokens.ts and registry.ts are rewritten from ANIMATION §1 (no demo values; no SplitText or Flip). package.json adds `overrides: {playwright-core: 1.63.0}` and devDependency `lighthouse@13.6.0`; Fontsource packages become devDependencies.
- TD12 Height (coefficients superseded by G-8: fitted k values in TYPOGRAPHY §5): TYPOGRAPHY adds the height clamp (originally written `min(vw-curve, 1.78 × vh-curve)`) so 1280×720 at 200 % (640×360) keeps the S1 block within the 100svh copy box under the top bar; static threshold stays `max-height:359px`. Closes I-3.

## Orchestrator defaults pending client confirmation at Gate A (applied now so the documents agree; the client may change them)
- G-1 Sound start, four cases. (a) First visit, autoplay blocked: loader → prompt (ENTER WITH SOUND / CONTINUE WITHOUT SOUND) → hand-off. (b) First visit, autoplay allowed: the loader stays silent and shows no prompt; at the hand-off the score fades in and the sound toggle (visible, focusable, showing ON) appears at the same moment, so a stop control exists from the first audible frame (WCAG 1.4.2). (c) Returning, `ozone-sound=on`: as (b) if the context runs, else as (a). (d) Returning, `ozone-sound=off`: no audio attempt, no prompt, toggle OFF. The loader never plays a bed; AU-4's `loader:bloom` moves to the hand-off as the score's opening gesture. Removes DESIGN's "only inside the ENTER click handler" sentence and D-2's "a gesture is still required" claim.
- G-2 LCP: the S1 headline keeps its ink reveal (creative intent). LCP is measured honestly on whatever element Chromium reports (expected: loader text) against ≤ 2.5 s, and a separate **story-ready** metric (hand-off time) is reported with a target set by performance in TECH §8. ANIMATION §3's "S1 h1 is the LCP element" claim is removed.
- G-3 An explicit CONTINUE WITHOUT SOUND persists (`ozone-sound=off`, TD5) and suppresses the prompt on later visits (D-2).

## 2026-11-18 · Orchestrator rulings during the Gate A r1 fix pass
- G-4 `red-all` (the S2–S4 red roughs group) node budget ≤ 600, counted outside the per-frame total. The two owners each pointed at the other; settled here.
- G-5 A-3 clarified: scroll unlocks when the hand-off's visual sequence ends (camera + S1 ink), not at its start; the 1.5 s score fade runs alongside and never delays it.
- G-6 Autoplay "allowed" (G-1 case b) = `AudioContext.state === 'running'` after the `audio-engine` loader item. Case b needs no gesture because the context is already running; TD10's "unlock only in click handlers" governs every path where a gesture is needed (ENTER, toggle).
- G-7 Returning visitor with autoplay blocked: the compact prompt appears at the normal prompt moment, or by 600 ms into the short loader (ui-ux proposal, accepted).
- P-rig pin length is 1090 (labels rounded to 5), not 1089.
- G-8 Height clamp uses fitted coefficients (`--t-h1: min(vw-curve, 13.1vh)` etc., TYPOGRAPHY §5), not the literal `1.78 × vh-curve`: 1.78 = 640/360, so the literal form trims nothing at 640×360 and the S1 block overlaps the toggle reserve by 34 px. With the fitted clamp S1 clears it by 77 px (measured in Chromium with the real font). Desktop sizes at ≥ 1024×576 are unchanged.
- G-9 One name per hook across TECH and TEST_PLAN: the hand-off mark is `performance.mark('story-ready')` (TEST_PLAN's `ozone:handoff` renamed). Debug/test hooks in dev and test builds only: `window.__labels`, `window.__claims`, `window.__ozoneStats` ({triggers, tweens, listeners}), `window.__art`; `html[data-art]` set by `?art=lite|full`. Test viewports per rig (L 1440×900, M 1024×768, P 768×1024, S 390×844) are QA's assumption, checked against `rig.ts` by Q-LAY-9.
- G-10 Audio caps revised by the audio owner: sounding notes ≤ 48 desktop / ≤ 36 mobile (S7 tutti needs ~33 on mobile); source nodes stay ≤ 140 / ≤ 70. `audio-buffers` loader item: non-critical, 4000 ms, 0 retry. Workers: `renderWorker.ts`, `clockWorker.ts`; `unlock.ts` in the initial bundle. Open: whether CDP CPU throttling reaches Workers is unconfirmed; if not, T6b reports a scaled estimate for the 400 ms render budget.

## 2026-11-18 · CLIENT APPROVAL OF GATE A
The client replied "Approve" to the Gate A decision list (GATE_A_REVIEW_R2.md, client decisions 1–15), accepting every proposed default:
1. G-1 sound start (no prompt when autoplay is allowed; toggle appears ON at the hand-off; loader always silent). 2. G-3/D-2 "without sound" persists. 3. Client approves the music when it exists (T10/T12). 4. G-2 headline ink reveal kept; LCP likely > 2.5 s accepted, story-ready reported separately. 5. Protagonist gender read open. 6. Scene 6 adult customer. 7. M7 off. 8. Placeholder typographic wordmark. 9. "No exceptions" shown as OZONE's own statement (client accepted the default; this is the client's statement, not verified by us). 10. California BLOCKED: no CA claim, no CDPH link, no Resource heading. 11. No quit-help resource. 12. T6b prototype added to the plan. 13. Real devices NOT TESTED (incl. software raster only, scaled Worker estimate, iOS silent switch). 14. Production URL: placeholder until supplied. 15. Hosting/headers: client's deployment, documented in TECH §9.

## 2026-11-18 · Orchestrator rulings on Gate A r2 conditions (GATE_A_REVIEW_R2.md)
- G-11 (N14) One hand-off duration: 1.65 s (ANIMATION §7 arithmetic), +0.3 s when the prompt shows. Story-ready is measured in the autoplay-allowed project (no human wait): target median ≤ 5.5 s first visit, ≤ 3.0 s returning, hard cap 10 s (lab, mobile profile). Q-LOAD-2 measures the hand-off *end*.
- G-12 (N3) S7 release: `#scene-7 { margin-top: -100lvh }`, layered under `.stage`, so the real page sits exactly under the last pinned frame; Q-VIS compares end−1 px, end+1 px and end+100 px. This realises CD's "takes over without a jump", so no creative change.
- G-13 (N1) Effective preference `pref = localStorage['ozone-sound'] ?? 'on'` (no key = the brief's default ON). Case b writes nothing. Toggle ON iff pref === 'on' AND running AND gain > 0. Visibility resume when pref === 'on' ("and the user had chosen on" dropped).
- G-14 (N4) Loader item `art-s1s2` becomes `stage-ready`: every S1/S2 LayerId resolves, defs exist, S1/S2 sub-timelines build; failure → static mode. Totals: 6 items, 3 with sound off. Q-LOAD-3 injects a missing layer id. (N5) Font failures never show the error message; it appears only on a switch to static mode.
- G-15 (N13) Test hooks ship in the production bundle but are exposed only when `window.__OZONE_QA__` is set (Playwright `addInitScript`); Q-BLD asserts they are absent otherwise.
- G-16 (F2 condition) CSS reads only the `data-rig`/`data-mode` attributes; no media strings inlined into CSS.
- G-17 (N7, Worker caveat) T6b: `fidelity.json` holds TARGET values from the budgets and CD §2 (frontend-engineer, creative-director signs off); T8 measures real art against it and > 10 % over triggers a T6b re-run. In software raster (no GPU here) frame time, LoAF and long tasks gate; raster p95 is reported only; the verdict is labelled "lab, software raster". Worker render budget judged on max(measured, unthrottled × 4), labelled "estimated", with a calibration loop in Worker and main thread each run.
- G-18 (14b/c) QA adds short-height fit rows for all seven scenes (640×360, 844×390) — measured before T8; typography adjusts hero k if S5 overlaps. QA records display sizes in device px at 100 % and 200 % zoom; the WCAG 1.4.4 judgement is written before Gate B.
- G-19 (F30) `src/motion/bridge/**` stays with gsap-animator (intended). T6b prototype paths `showcase/ozone/proto/**` → gsap-animator; `proto/fidelity.json` → frontend-engineer; `reports/typography/` is a one-off typography record inside QA's tree, accepted.
- G-8 supersedes TD12's literal "1.78 × vh-curve" wording.
- G-20 G-11's single hand-off duration (1.65 s) applies to first visits. Returning visitors (`ozone-seen`) keep the compressed 0.3 s hand-off inside their ≤ 1 s short loader, the one named exception (ANIMATION §7); their story-ready target stays ≤ 3.0 s. Story-ready = hand-off end = `performance.mark('story-ready')`.
- G-21 The loader's "Read the story as text" link becomes visible at 8 s by a pure-CSS delayed animation (`animation: reveal 0s 8s forwards` under `html.js-loading`), so it appears even when the module bundle hangs (Q-LOAD-4b); JS may show it earlier on a stall, an error or keyboard focus. Fast 3G is report-only, gated only by the 10 s cap (no 3G target is set).

## Creative sign-off: fidelity targets (T6b)
_creative-director · 2026-11-18 · rules on TECHNICAL_ARCHITECTURE §10.1 for `showcase/ozone/proto/fidelity.json`. Verdict: **changed.** Halftone is now set per scene and per rig, and filtered layers go to 0. The mask and node targets are approved with conditions. FE writes the file. The owners of TECH §7/§10.1, TEST_PLAN §3.1 and ANIMATION §9 align their wording._

**Halftone fill area.** A single 35 % misreads CD §2. The figures' ~50 % shadow share is flat black, and frame coverage is driven by framing and text-safe zones, not by that ratio. These are **point targets**: the placeholder is built to them (0.9–1.3×, TEST_PLAN §3.1), and the real art in T8 may not go over 1.1×.
- **Unit.** The sum of the bounding boxes of the pattern-filled elements, each clipped to the viewport, as a percentage of the viewport. Overlaps are counted twice, on purpose, because stacked patterns cost twice.
- **Other rigs.** Rig M uses the L column and rig P uses the S column.
- **Unprototyped scenes.** S1–S3 are not prototyped, so their targets stay at or below the prototyped maxima for each rig (35 % L, 40 % S). That way t45 covers them.

| Frame | L 1440×900 (px²) | S 390×844 (px²) | Why |
|---|---|---|---|
| S1 | 30 % · 388,800 | 30 % · 98,748 | The lamp cone is the largest element; the sky above the roofline is text-safe |
| S2 | 30 % · 388,800 | 25 % · 82,290 | The bulb-pool terminator plus four figures; at 390 only one peer remains |
| S3 | 35 % · 453,600 | 35 % · 115,206 | The close-up has the largest area of skin tone (35 % density) in the story |
| S4 | 35 % · 453,600 | 35 % · 115,206 | Not more area than S3 but the most stacking: beam-edge strips, organ mid-tones, jacket, and red-dot hatching over the organs. The red-dot halftone inside `red-all`, under the eraser mask, counts toward the total: 4 % · 51,840 (L) and 7 % · 23,041 (S) |
| S5 | 30 % · 388,800 | 40 % · 131,664 | Differs by rig. At L the avenue is a band under a sky that stays flat except for a thin horizon glow band (horizon ≈ 72 %, I-1; the sky above is text-safe negative space). At S the road fills the lower 60 %, which makes it the heaviest frame in the story |
| S6 | 25 % · 324,000 | 20 % · 65,832 | The shelves are flat black (text-safe); halftone covers only the employee, the edge of the pendant pool and the window spill |
| S7 | 0 | 0 | Approved: the panels are flat-tinted (rule 2) |
| t45, any sampled frame | ≤ 35 % | ≤ 40 % | A cap with no floor: never heavier than the heavier of its two holds |
| t67, any sampled frame | ≤ 30 % | ≤ 35 % | A cap with no floor (the street exterior); 0 once the hand-over to flat tint is done |

Rules that make the numbers representative, for both the prototype and T8:
1. **Real pattern definitions.** The placeholder uses the production halftone `<pattern>` defs: round dots, a 45° `patternTransform`, the three densities (15/35/60 %), in world units, with each scene's pitch giving 6 px (L) or 4 px (S) on screen at its hold. Flat fills or simplified patterns do not count toward the area.
2. **3 px floor.** No pattern is ever shown at an on-screen pitch below 3 CSS px, because it moirés. Where a zoom would push a pattern below that, the layer hands over to its flat tint or its LOD drawing first, by the method in ANIMATION §9. This happens to the S4 art during the t45 pull-back and to the street frame as it shrinks into panel 7 in t67, and it is why S7 = 0. The prototype must perform the same hand-overs.
3. **Mounted neighbours.** Scenes mounted within ±1 carry placeholder halftone at their own targets, even when they are off-screen.
4. **What to cut first** if T6b fails on halftone (cut-line 2):
   - First the S5 horizon band and far-plane facades, then the terminator bands on background planes.
   - Never the skin tone (an identity rule, identical in every scene), the S4 beam and organs, or the S4 red-dot hatching.
   - Reduce density by one step (60 → 35 → 15) before removing any region.

**Filtered layers: 0, not 3** (`filteredLayers: []`).
- CD §2 bakes the ink-edge wobble into the paths, CD §1 rules out live filters, and the loader blooms are circles, so no live filter is needed anywhere.
- A filter inside the scaling camera group would re-render every frame for no visible gain.
- The cut-lines bake filters only fifth, after the mask and the halftone. Carrying 3 filters would therefore make a failing prototype cut detail we keep.
- Any filter in the story world in T8 triggers a re-run. If FE wants to know the filter headroom, measure it in a separate, report-only variant that cannot trigger a cut.
- TEST_PLAN §3.1's "exactly the same 3 layers" becomes "exactly the listed layers (none)".

**Eraser mask: approved.** `eraser-mask` on `red-all`; the box is the bounding box of `red-all`. Conditions:
- The placeholder `red-all` spans the real extent of the roughs in the world: the alley wall at world x ≈ 1.0–2.2 viewport widths, with the S2 wall shadows and balloon scribbles, the S3 tallies and cigarette outline, and the S4 hatching. The roughs then enter the frame during the pull-back, as they will in the real art.
- It is built to its budget of about 600 nodes (about 200 for S2, 150 for S3 and 250 for S4, including the red-dot pattern elements). This puts the costliest combination, mask × pattern × camera scale, into the test.

**Nodes: approved as written.** Per frame 4,500 / 3,240, including `<use>` targets; `red-all` 600; each `sN-panel` 300, 1,800 in total, flat-tinted with no patterns; document 20,000.
- The placeholder is built to at least 0.9× of these, not below.
- Own-art allocation for the prototyped scenes, excluding the rig and `red-all`: S4 1,200 / 900 · S5 2,000 / 1,400 · S6 1,000 / 800. With the rig (≈ 200 / 140), the S5 hold (S4 + S5 + S6 mounted) lands at 4,400 / 3,240.
- **Conflict to resolve before the run (FE + QA).** TEST_PLAN §3.1 checks "±10 % of 2,500 (1,800 at 390) per scene". With three scenes mounted, that exceeds the 5,000 / 3,600 caps. The per-frame target and the allocation above govern.
- **Assumption for QA to confirm.** The bounding-box measure clips to the viewport. If it does not, FE restates the px² values on QA's basis before the run.

## 2026-11-18 · Rulings after the Gate A conditions diff check (tech lead: conditions met; N15–N19)
- N15 The T6b fidelity node gate is per frame: rendered nodes 0.9–1.0× of `nodes.perFrame` (4,500; 3,240 at 390). The per-scene 2,500 / 1,800 in ANIMATION §9 is a design guideline, not a gate.
- N16 `html[data-mode="story"] #scene-7 { margin-top:-100lvh }` (scoped; no overlap of S6/S7 in static/no-JS, Q-A11Y-7).
- N17 New flag `html.js-loader` (story mode and static-by-reduced-motion or height; not `?view=text`). The loader, its prompt and the G-21 text-link reveal key on it; under reduced motion the link is visible from the start with no animation.
- N18 TECH §8 and AUDIO §4 cite G-20 for the returning-visitor 0.3 s hand-off.
- N19 G-21's CSS reveal is written into TECH §4.
- G-22 Creative sign-off accepted as written (section above): per-scene, per-rig halftone point targets; `filteredLayers: []` (no live filters; wobble baked); eraser mask on `red-all` at real extent ~600 nodes; node targets approved; 3 CSS px minimum dot pitch (switch to flat tint below it, gsap-animator implements in t45/t67 and the prototype). TECH §7/§10.1 and TEST_PLAN §3.1 aligned.
- G-23 (T6b build) `red-all` stays outside the per-frame node count (G-4 reading); with it, S mid-t45 = 3,821 vs the 3,600 cap, recorded as a known risk for T8. `sceneSplitGuide` in fidelity.json is a guide only; the prototype's split (S: s4 720, s5 1560, s6 800) is accepted because the per-frame gate is met. Camera is a GSAP-tweened {x,y,scale} proxy writing the matrix in one onUpdate (svgOrigin offset problem) — adopt in T9. Open for T8/T9 creative review: S5 halftone hand-in at 95 % of t45 on rig S (to stay under the 40 % cap); S6 copy crossing the cream paper mid-t67 (no contrast); red hatching crossing S4 headline line 2 at 1440 (text-safe zone); eraser timing.

## 2026-11-18 · T6b result and rulings (QA verdict `reports/proto/T6B_VERDICT.md`, orchestrator spot-check)
- **T6b result: FAIL (lab, software raster, emulated).** t45 fails in the default build and on every cut-line variant. t67 fails strictly; cumulative `cut=6` is closest (B/C pass, A fails on real long tasks/LoAF). T7/T8 do not start until this is resolved.
- **Orchestrator spot-check** (`proto/tests/orchestrator-probe.mjs`, no CPU throttle, no trace, one wheel pass, rAF intervals; lighter than the protocol, so only the direction is compared). t45 1440×900@1: default max 183 ms / 3 frames > 50.5; `cutonly=6` max 100 ms / 1; cumulative `cut=6` max 117 ms / 3. t45 390×844@3: default max 117 ms / 5; `cutonly=6` max 50.0 ms / 0; `cut=6` max 67 ms / 1. t67 1440: default max 50.0 / 0; `cut=6` max 16.8 / 0. **Agrees with QA**: t45 fails; t67 is near the line. New finding: `cutonly=6` (one composited HTML layer per depth plane, **full scene, no detail cut**) removes most of the main-thread repaint (QA trace: `Layerize` 2,389 ms → 48 ms with planes), and is as good as or better than the cumulative cut that removes detail.
- G-24 (frame-time thresholds, a measurement fix not a bar change) "> 50 ms" means more than 3 vsync intervals and "p95 ≤ 33 ms" means at most 2 intervals; at 60 Hz they are evaluated as > 50.5 ms and ≤ 33.5 ms. Long-task and LoAF gates are unchanged. This changes no verdict: t45 still fails everywhere; t67 `cut=6` still fails on config A.
- G-25 Cut-line 6 (per-plane layers) becomes the **default architecture candidate** for the re-run because it keeps the approved detail. Cut-lines 1–5 reduce the approved scene (fidelity 0.27–0.49 of the node target) and are not adopted without client approval.
- G-26 Evidence: per-run metrics JSON, summaries, verdict and filmstrips (downscaled JPEG) are committed; raw Chromium traces (~146 MB) are git-ignored local evidence and are lost with the container.
- Open: whether the remaining t45 stutter (Viz `Display::DrawAndSwap` in SoftwareRenderer) exists on a GPU can only be settled on real hardware. Client decision requested.
- G-27 (client decision 2026-11-18: "Test on my device") The prototype default is now cut-line 6 alone: one composited HTML layer per depth plane, full approved detail. Measured fidelity: within targets, nodes 0.92–0.99× perFrame, eraser mask on `red-all`, 0 filters (`reports/proto/fidelity-layers-default.json`). The old single-SVG build stays reachable as `?cutonly=0`. The full TEST_PLAN §3 protocol is re-run on the new default as variant `layers`. A device-check build (`VITE_DEVICE_CHECK=1`, output `dist-device/`, git-ignored) turns on the on-screen frame meter (`src/hud.ts`, also `?hud=1`). The meter applies the G-24 gates to frames inside t45 and t67 while scrolling. It is published as a private artifact because the artifact viewer does not pass query strings. Device results come from the client and are labelled "client device, inside the Claude artifact frame".
