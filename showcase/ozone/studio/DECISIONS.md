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
- TD12 Height: TYPOGRAPHY adds the height clamp (`min(vw-curve, 1.78 × vh-curve)`) so 1280×720 at 200 % (640×360) keeps the S1 block within the 100svh copy box under the top bar; static threshold stays `max-height:359px`. Closes I-3.

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
