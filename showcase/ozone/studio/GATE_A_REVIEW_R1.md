_Tech-lead Gate A review, round 1, at `28d9550` (2026-11-18). Verbatim report; no files were changed by the reviewer._

# Gate A: OZONE ("Your Ink"), technical lead verdict

**Verdict: FAIL (changes required).** No implementation is needed to fix this. Every finding is a document edit, and a narrow re-gate on the changed sections is enough.

Most of the set holds:
- The stack, dependencies, label contract, copy and scroll arithmetic all check out.
- No Lenis, WebGL or canvas, one ScrollTrigger, no nested pins, and reversal is built from `tl.set` steps.

But the documents still give different build contracts on six things: the story DOM, rig selection, how sound starts, loader progress, storage keys and the LCP element. These must be settled before T7, or agents will build incompatible pieces.

Reviewed at HEAD `28d9550`, branch `claude/awesome-ritchie-a31l7f`, tree clean. Files: all of `/home/user/Claude-code-skill/showcase/ozone/studio/*.md` and `/root/.claude/plans/sunny-conjuring-waterfall.md`.

## What I verified as passing
- **Labels ANIMATION ↔ AUDIO:** all 21 `sfx:`/`cue:` ids match. I diffed them with grep and comm; the only ids unique to AUDIO are `cue:s1` and `cue:t45:erase`, both of which it marks as non-existent or a proposal. Every % position matches.
- **Cue positions:** I recomputed the AUDIO §4 unit positions from the ANIMATION labels and they are exact.
  - Desktop: 100 / 265 / 455 / 694 / 715 / 915 / 1135.
  - 390: 80 / 215 / 375 / 583 / 600 / 765 / 950.
- **Scroll budgets:** they sum to 1210 (desktop) and 1010 (390), and the label table matches CREATIVE_DIRECTION §6.
- **Decisions applied:** A-1 is in TECH §3 and AU-1 (`setPlayhead`) is in TECH §6. AU-2 is in DESIGN §3.2 and TECH, but not in AUDIO (finding 17).
- **Fonts:** I downloaded the tarballs with `npm pack`.
  - Bricolage latin wdth = 78,156 B and Atkinson latin wght = 33,996 B, total 112,152 B against the 150 KB budget: PASS.
  - Two preloads, matching TYPOGRAPHY.
- **GSAP size (min builds, gzipped):** core 28,435 B + ScrollTrigger 18,039 B + CustomEase 3,673 B ≈ 50 KB. The 180 KB initial-JS budget is plausible with React (estimate; nothing is built yet).
- **Copy vs FACTS:** every caption, headline, the OZONE sentence and the Sources entries are verbatim. There are no statistics (M7 is off), no California claims, no scanner and no vaping on the page.
- **Honest NOT TESTED labels:** real devices, field Core Web Vitals, screen readers, host headers, safe-area and svh on devices are all marked NOT TESTED.

## Findings

### Blockers

**1. Blocker: the story DOM and track structure contradict each other. CONFIRMED in the text; the sticky and svh behaviour is INFERRED.**
- **Where:** TECHNICAL_ARCHITECTURE §3 vs DESIGN_SPECIFICATION §1.2 vs ANIMATION_SPECIFICATION §2.
- **Evidence:**
  - TECH §3 puts "one `position:sticky; top:0; height:100svh` stage inside it [the track]". It says "scene HTML sections (headings, captions) sit over it in normal flow with height = their hold + transition length".
  - DESIGN §1.2 puts "seven `<section id="scene-n">` copy layers (real HTML, stacked, pointer-events none)" inside `.stage`, with `.stage` as a sibling of `<div class="track"> 13 spacer beats`.
  - TECH has `end:'bottom bottom'`; ANIMATION has `end:'+=budget'`.
- **Why it matters:**
  - If the copy sits in normal flow, headlines scroll 1:1 and cannot "leave with their art plane".
  - A sticky stage that is a sibling inside `<main>` stays stuck over S7 and Sources, and it adds a dead 100svh before the track starts.
  - `bottom bottom` measures against innerHeight (the large viewport once the toolbar collapses), not svh.
  - A 100svh sticky stage leaves an uncovered band of about (lvh − svh) at the bottom on iOS once the toolbar collapses.
  - DESIGN lists 12 beats but calls them 13.
- **Fix:**
  - Use `<div class="story">` containing `.stage` (sticky; world SVG plus six copy layers) followed by `.track` (12 beats, `#beat-s1…#beat-t67`, summing to `--budget`). `#scene-7` goes after `.story`.
  - ScrollTrigger: trigger `.story`, `start:'top top'`, `end:()=>'+='+track.offsetHeight`, so CSS is the single source.
  - Stage `height:100lvh`, with the text-safe copy box `100svh` anchored to the top. The art bleeds below.
  - Anchors use an instant JS `scrollTo` to the beat; handle a hash present at load.
  - Test for each rig: `st.end − st.start === track.offsetHeight`.
- **Owner:** frontend-engineer (TECH), ui-ux-designer (DESIGN §1.2), gsap-animator (ANIMATION §2).

**2. Blocker: rig, matchMedia and budget selectors disagree. CONFIRMED.**
- **Where:** TECH §3 Responsive, DESIGN §2/§9.1/§9.4, DECISIONS A-2, ANIMATION §2/§10.
- **Evidence:**
  - TECH branches on width: "`(max-width:600px)`, `(min-width:601px) and (max-width:1024px)`, `(min-width:1025px)`".
  - DESIGN picks rigs by aspect ratio and height: "L `a ≥ 1.5` and `h ≥ 480` … P `0.65 ≤ a < 1.1`".
  - DESIGN §9.1 says the P pin length is "1210 vh (svh)", but A-2 says "rig P = desktop × 0.9".
  - TECH defines `--budget` only as "1210vh desktop / 1010vh at 390", with no P value and no selector.
  - DESIGN §9.4 says "debounced 200 ms … height-only changes under 120 px … are ignored". gsap.matchMedia reverts immediately, and ANIMATION uses 150 ms.
  - The DESIGN static triggers (height < 360, `?view=text`) are absent from TECH.
- **Why it matters:** CSS track height, JS master duration and camera rig can each pick a different rig, so the A-1 problem returns, for example at 1440×1600 or 900×1400.
- **Fix:**
  - One `src/motion/rig.ts` exports the query strings for L/M/P/S plus static (reduce, `max-height:359px`, view=text).
  - A pre-paint head script writes `html[data-mode][data-rig]` from those strings; CSS `--budget` is keyed to `[data-rig]`; gsap.matchMedia uses the same strings. Remove the width-based motion branches; the grid stays width-based for layout only.
  - ANIMATION publishes the full P label table. A-2 is ambiguous about whether labels or spans are rounded; rounding labels gives end 1090.
  - DESIGN §9.4: the rig rebuilds only on a bucket change (matchMedia semantics); drop the 120 px rule; one 150 ms debounce.
- **Owner:** gsap-animator (P table, matchMedia), frontend-engineer (TECH §3, head script), ui-ux-designer (DESIGN §9).

**3. Blocker: the sound-start flow has not been updated for D1, and the autoplay-allowed case is undefined. WCAG 1.4.2 is at risk. CONFIRMED.**
- **Where:** DESIGN §4/§5.3/§5.4, CD §5, ANIMATION §7, TECH §6, AUDIO §4.
- **Evidence:**
  - DESIGN §5.3: "audio is created and resumed only inside the ENTER click handler" (contradicts D1).
  - DESIGN §5.3: "one prompt, once per visit". CD §5: "At 100 %, the prompt inks in".
  - ANIMATION §7: "the prompt shows only if blocked". TECH §6: "`blocked` … the loader prompt then offers ENTER WITH SOUND".
  - AUDIO §4: "If the context reaches `running` within 300 ms, the loader plays a bed".
  - DESIGN §4: "everything outside `#loader` is `inert` (including the skip link and toggle)".
- **Why it matters:** when autoplay succeeds, audio can play for about 3.3 s, and up to 10 s on slow loads, with no operable control to stop it.
- **Fix:**
  - Write one four-case state table, mirrored in DESIGN §5.3 and TECH §6: first visit blocked / first visit allowed / returning ON / returning OFF.
  - The creative director decides whether the prompt shows when autoplay was allowed (client confirms).
  - Hard technical rule: whenever audio is audible, an operable stop control exists within 3 s. Either the loader exposes a non-inert toggle from the first audible frame, or the loader bed waits until the prompt is shown, with CONTINUE WITHOUT SOUND acting as stop.
  - Delete the DESIGN "only inside the ENTER click handler" sentence and D-2's "a gesture is still required" claim.
- **Owner:** creative-director (decision), ui-ux-designer, audio, frontend-engineer.

### Major

**4. Major: loader items and the progress formula are inconsistent. CONFIRMED.**
- **Where:** TECH §5 vs DESIGN §5.1/§5.2, AUDIO §6, CD §5, plan §4.
- **Evidence:**
  - TECH lists five items with `ratio = completed/total`.
  - DESIGN uses weights: "fonts … 15 %, S1 and S2 SVG art decoded 45 %, score buffers rendered 30 %, remaining art preloads 10 %", and drops the audio weight when the visitor chose no sound.
  - TECH: "Remaining art chunks (s3..s7) load after ENTER".
  - AUDIO: "this step is the loader's 'score buffers' progress weight". That item does not exist in TECH.
  - Plan §4: "progress values equal completed/total (asserted)".
  - Failure of the critical art item is undefined (TECH skips and continues; DESIGN §5.2 shows an error with a choice).
- **Fix (technical decision):**
  - Progress is count-based.
  - Items: `font-display` (800), `font-text` (400), `art-s1s2`, `audio-engine`, `audio-ir`, `audio-buffers`. S3–S7 are not loader items.
  - With `ozone-sound=off`, the audio items are excluded from the total and loaded on the first toggle ON (with `aria-busy`).
  - If `audio-buffers` times out it is marked skipped, but rendering continues and its voices join when ready.
  - If critical art still fails after its retry: the story continues on the prerendered DOM if the master builds; otherwise static mode with the DESIGN §5.2 message.
- **Owner:** frontend-engineer (TECH §5), ui-ux-designer (DESIGN §5.1/§5.2), audio (AUDIO §6).

**5. Major: the LCP budget conflicts with the opening as designed. The contradiction is CONFIRMED; the measurement is INFERRED.**
- **Where:** ANIMATION §3/§7, DESIGN S1, TYPOGRAPHY §3, TECH §8.
- **Evidence:**
  - ANIMATION §3: "S1 h1 … **is the LCP element**; it is visible text behind the loader dialog from first paint".
  - ANIMATION §7 hand-off: "S1 l1 then l2 ink via diagonal clip-path wipe".
  - DESIGN: "while the prompt is open the headline is still masked".
  - TYPOGRAPHY: "the loader holds S1 invisible until they resolve".
  - TECH §8: "LCP = S1 h1 text … ≤ 2.5 s".
- **Why it matters:** the h1 is clipped until roughly 3.3–4.3 s. LCP will be the largest loader text, likely the prompt copy at about 3.3 s or later under 4× throttling. So the budget either fails by design or ends up measuring a trivial element.
- **Fix:** a decision is needed. Either (a) the h1 is painted unclipped from first paint, or (b) LCP is redefined honestly as the loader's first text, with a separate "time to story-ready" metric. Remove the ANIMATION §3 claim either way.
- **Owner:** creative-director (decision, client confirms), gsap-animator, performance-engineer.

**6. Major: mode-flag timing, no watchdog, and the CSP blocks the head script. CONFIRMED.**
- **Where:** TECH §4/§9, ANIMATION §7/§10, DESIGN §1.1.
- **Evidence:**
  - TECH: "`.js-story` is added … only after … master build and ScrollTrigger creation succeed".
  - ANIMATION: "the ScrollTrigger is created at this moment [hand-off]" and "0 during the loader".
  - DESIGN uses a different mechanism: "`html[data-mode="story|static"]`" set by a head script.
  - TECH's CSP is `default-src 'self'`, with no hash for the inline `<head>` script that sets `js-loading`.
- **Why it matters:**
  - The loader would run over the static stacked layout, then switch layout at hand-off. That causes layout shift and breaks "nothing is swapped".
  - If the module bundle fails to load, nothing removes `js-loading`: the loader stays and S1's art stays hidden, so the page is stuck.
  - In production the CSP blocks the head script.
- **Fix:**
  - One pre-paint head script, allowed by a CSP `script-src 'self' 'sha256-…'` hash, sets `data-mode`, `data-rig` and `js-loading`.
  - It arms a watchdog of about 12 s (longer than the 10 s hard timeout) that reverts to static and removes `js-loading` unless `main.tsx` signals boot. An `onerror` on the module script does the same.
  - Story-layout CSS is keyed to `data-mode=story` from first paint; init errors revert to static.
- **Owner:** frontend-engineer; ui-ux-designer aligns the naming.

**7. Major: an accessibility rule is broken. Captions and S6 copy drop out of the accessibility tree. CONFIRMED.**
- **Evidence:**
  - The DESIGN standing rule says reveals "never `display:none`, `visibility:hidden` or removal".
  - ANIMATION §6 uses "captions `data-caption` autoAlpha".
  - ANIMATION t67: "S6 HTML copy … retires (`visibility:hidden` set)".
- **Fix:** headlines and captions animate only opacity (not autoAlpha) or clip-path. Add a QA test: the accessibility tree contains all 7 headlines and all captions at 5 sampled playheads.
- **Owner:** gsap-animator; qa-engineer.

**8. Major: the t45 prototype protocol cannot measure the main risk. The tool limitation is CONFIRMED; the raster and compositing points are INFERRED.**
- **Evidence:**
  - ANIMATION §9.2: "`capture-reference.mjs --filmstrip` at 390×844, scrubbing t45's 540–660 svh in 12 steps".
  - The script spreads steps "over the full page height, at least 0.85 viewport each" and fixes `deviceScaleFactor: 1`. I read `plugins/premium-web-studio/skills/reference-study/scripts/capture-reference.mjs` lines 9, 60 and 216.
  - ANIMATION §9.3 throttles only the CPU.
  - The camera is an SVG `<g data-cam>` with `will-change`.
- **Why it matters:**
  - At DPR 1 the test renders about 1/9 of the pixels of an iPhone (DPR 3).
  - CDP CPU throttling slows the main thread, not raster.
  - JS-set transforms on SVG `<g>` repaint the SVG, and `will-change` on SVG children is not a reliable way to get a layer.
  - Audio is not running, although t45 is the audio-busiest span.
  - `scrollBy` does not exercise the real input path.
- **Fix:** QA writes `tests/proto/t45.spec.ts`:
  - positions from `window.__labels`;
  - 390×844 at DPR 3, and 1440×900 at DPR 1 and 2;
  - `mouse.wheel` and touch-scroll input;
  - a CDP trace with Paint, Raster and long-animation-frame data;
  - audio running through the S4→S5 change;
  - placeholder art that matches the real halftone fill area, the 3 filtered layers and the mask;
  - 3 runs, the existing pass criteria plus a raster p95 threshold.
  - Add a cut-line option: depth planes as HTML-wrapped `<svg>` layers transformed on the wrapper.
- **Owner:** qa-engineer and performance-engineer (protocol), gsap-animator (ANIMATION §9).

**9. Major: the plan orders the prototype after the scenes. CONFIRMED.**
- **Evidence:**
  - ANIMATION §9: "prototype measurement (before any other scene is built)". TECH §10: "cut-lines decided before more scenes are built".
  - Plan §5: T8 "Seven scenes" depends on T7, and T9 "Story stage + master timeline + 6 transitions" depends on T8.
- **Fix:** insert T6b, "t45 then t67 prototype on placeholder art, performance verdict plus cut-lines", after client approval and before T7. T8 depends on T6b passing.
- **Owner:** orchestrator.

**10. Major: prerender and hydration of the art; no DOM or HTML budget. The text is CONFIRMED; React behaviour and cost are INFERRED.**
- **Evidence:**
  - TECH §7: "`React.lazy`/dynamic import … SSR renders them eagerly … the lazy chunk hydrates identically".
  - The demo's `entry-server.tsx` uses `renderToString`, and `renderToString` emits Suspense fallbacks for lazy components.
  - DESIGN §1.2: the art-slot "In story mode it is empty … in static mode it holds the static SVG frame". TECH §4 has one prerendered DOM.
  - There is no budget for HTML size or total nodes.
- **Why it matters:** the no-JS HTML could lose the art. Hydrating about 17k SVG nodes creates long tasks during the story (scroll jank and late audio events). The art path data would ship twice, once in HTML and once in JS.
- **Fix:**
  - The SSR entry imports scenes statically.
  - The client does not hydrate the art: static markup outside React's hydration, with no art JS chunks.
  - Static frames are `<svg viewBox=hold><use href="#sN-world"/></svg>` windows onto the one world.
  - Add budgets (proposal): prerendered HTML ≤ 250 KB gz, document SVG nodes ≤ 20,000, rendered nodes in any frame ≤ 5,000 (3,600 at 390).
  - "Initial JS" means all JS requested before the hand-off.
- **Owner:** frontend-engineer, performance-engineer, ui-ux-designer.

**11. Major: the mount rule clashes with the t67 `<use>` panels and `red-all`. The text is CONFIRMED; rendering is INFERRED.**
- **Evidence:**
  - ANIMATION §9: "others `display:none` via `mount` sets".
  - TECH §7: "`display:none` via GSAP `autoAlpha`" together with `content-visibility:auto`.
  - TECH §10: "`<use>` of already-mounted scene groups", while ANIMATION t67 says "low-detail art".
  - `red-all` spans the S2–S4 roughs.
- **Why it matters:** a `<use>` of a `display:none` element renders nothing, and six full scenes rendered through `<use>` is up to about 15k nodes. autoAlpha does not set `display:none`, and `content-visibility` does not apply to SVG children.
- **Fix:** define `sN-panel` low-detail groups in `<defs>` (≤ 300 nodes each) and exempt them from mount. `mount` uses only `display` sets, and only on aria-hidden art. Give `red-all` its own exempt node budget. Drop `content-visibility`.
- **Owner:** gsap-animator, art/SVG agent (frontend-engineer, SVG), frontend-engineer.

**12. Major: storage keys and persistence are inconsistent. CONFIRMED.**
- **Evidence:**
  - DESIGN §5.4: `localStorage["ozone.v1"] = {seen:true, sound:"on"|"off"}`.
  - TECH: `sessionStorage['ozone-seen']` and `localStorage['ozone-sound']`.
  - DESIGN §3.2: "Intent is remembered per visit". Plan §4: "OFF survives reload".
- **Fix (technical decision):**
  - `localStorage['ozone-sound']` is persistent and written only by ENTER, CONTINUE, Escape or the toggle.
  - `sessionStorage['ozone-seen']` keys the short loader (per the plan).
  - `sessionStorage['ozone-view']` holds the text-view choice.
  - Update DESIGN §3.2 and §5.4.
- **Owner:** ui-ux-designer, frontend-engineer.

**13. Major: audio buffer rendering is not budgeted or placed. The absence is CONFIRMED; the cost is INFERRED.**
- **Evidence:**
  - AUDIO §3: "synthesised in JS into AudioBuffers during the loader".
  - AUDIO §6: "About 17 MB … ≤ 12 MB … ≤ 400 ms, chunked in idle callbacks".
  - TECH §8 has no audio rows.
- **Why it matters:** the felt piano alone is about 35 M oscillator samples (13 roots × 3.5 s × 16 partials at 48 kHz), which is likely more than 400 ms on the 4×-throttled main thread. Safari lacks `requestIdleCallback`.
- **Fix:**
  - Render in a file-based Worker using recurrence oscillators, which keeps exactly one AudioContext in production.
  - If any of it stays on the main thread, chunks are ≤ 16 ms.
  - Add TECH §8 rows: buffer memory ≤ 17/12 MB, render ≤ 400 ms (lab, mobile profile), no long task from audio, `renderCapacity` ≤ 25 %, node caps.
- **Owner:** audio, performance-engineer, frontend-engineer.

**14. Major: the height clamp (I-3) is still open and 200 % zoom is at risk. I-3 being open is CONFIRMED; the arithmetic is INFERRED.**
- **Evidence:** DESIGN §2 asks for type driven by "`min(vw-curve, 1.78 × vh-curve)`". TYPOGRAPHY §8 has no vh terms, and DECISIONS does not record I-3.
- **Why it matters:** 1280×720 at 200 % gives a 640×360 story-mode viewport. The S1 block is about 230 px, roughly 64 % of the height, before the 44 px top bar.
- **Fix:** either add the height clamp, or raise the static-mode threshold (for example to height < 420). Decide before T8.
- **Owner:** typography-spacing, ui-ux-designer.

**15. Major: acceptance criteria have no evidence paths, and some are not numeric. CONFIRMED.**
- **Evidence:**
  - Plan §4 gives no paths, and TECH §9 says only "Test plan = plan §4".
  - AUDIO writes to `showcase/ozone/qa/audio/`, which is not in the TECH §2 ownership map (qa owns `reports/**`).
  - These have no method or threshold: "heap stable", "no text overlap", visual-regression baselines, safe-area emulation.
  - Lighthouse runs: "median of 3" in the plan, "median of 5" in TECH.
- **Fix:** QA adds a matrix to TECH §9 mapping each criterion to a spec file, the command, an evidence path under `showcase/ozone/reports/<area>/`, and its PASS/FAIL/NOT TESTED rule. Numbers to set:
  - heap growth ≤ 10 % after forced GC over 3 scrolls;
  - zero intersecting text rects in each sampled frame;
  - `toHaveScreenshot` baselines for 7 holds plus the static comic at 390/768/1440;
  - Lighthouse ×3 (per the plan);
  - audio evidence under `reports/audio/`;
  - safe-area via a CDP override, or NOT TESTED.
- **Owner:** qa-engineer, performance-engineer.

### Minor

**16. Minor: scrub value conflicts. CONFIRMED.**
- **Evidence:** TECH §3 says "scrub: true … add numeric scrub only if filmstrip says so"; ANIMATION §1 says "`scrub: 0.5` on fine pointers, `scrub: true` on `(pointer:coarse)`".
- **Fix (decision):** adopt the ANIMATION values. Wheel input arrives in steps and touch already has momentum.
- **Owner:** frontend-engineer.

**17. Minor: AU-2 is not applied in AUDIO. CONFIRMED.**
- **Evidence:** AUDIO §4 says "Unmute: … master 0 → 1 over 1.0 s"; AU-2 says "0.4 s everywhere".
- **Fix:** 0.4 s. The 1.0 s fade when the tab becomes visible again may stay, labelled as not a toggle ramp.
- **Owner:** audio.

**18. Minor: the toggle truth rule omits intent. The text is CONFIRMED; the Chromium behaviour is INFERRED.**
- **Evidence:** TECH §6: "ON only when `state==='running'` and master gain > 0". DESIGN §3.2 adds "user intent is on".
- **Why it matters:** a `resume()` left pending before the gesture may resolve on a later click such as CONTINUE, which would make the toggle read ON.
- **Fix:** ON = preference on AND running AND gain > 0. CONTINUE and Escape set the gain to 0 and call `suspend()`. Test: blocked → CONTINUE → still OFF after 2 s.
- **Owner:** audio, frontend-engineer, qa-engineer.

**19. Minor: iOS unlock and listeners. The text is CONFIRMED; activation semantics are INFERRED.**
- **Evidence:** the TECH §3 registry lists "pointerdown" and the plan says "unlock on first touch". AUDIO uses "pointerup/click" and `pageshow`.
- **Why it matters:** a touch `pointerdown` is not an activation event.
- **Fix:** unlock only in the ENTER and toggle click handlers. Add `pageshow`, `pagehide` and `statechange` to `cleanup.ts`. Document that the iOS silent switch (audioSession `ambient`) can mute audio while the toggle reads ON: a known limit, NOT TESTED.
- **Owner:** audio, frontend-engineer.

**20. Minor: the Worker scheduler claim is too strong. CONFIRMED.**
- **Evidence:** AUDIO §4: "Worker timer … (immune to main-thread scroll jank)". Scheduling still runs on the main thread.
- **Fix:**
  - Reword. Main-thread tasks longer than the look-ahead (120/200 ms) delay notes.
  - Use a file-based Worker (`new Worker(new URL(...))`) rather than a blob, and set CSP `worker-src 'self'`.
  - Update plan §3's "100 ms horizon".
- **Owner:** audio, frontend-engineer, orchestrator.

**21. Minor: mobile voice caps are unproven during crossfades. INFERRED.**
- **Evidence:** the mobile caps are "≤ 24 / ≤ 70". During a cue change the outgoing voices ramp out over 1.5 s while S5 (dense) enters, so both cues sound at once.
- **Fix:** add a per-cue source-node table for the worst case (cue plus outgoing tail). Add the S4→S5 and S6→S7 changes at the mobile profile to the offline renders.
- **Owner:** audio.

**22. Minor: callback direction is missing. CONFIRMED.**
- **Evidence:** ANIMATION §5 uses "`tl.call(audio.sfx, [id], pos)`", but the TECH API is `sfx(id,{direction})`. GSAP fires calls in both directions.
- **Fix:** `master.ts` derives the direction from the playhead delta, and computes N−1 for reverse cues itself.
- **Owner:** gsap-animator, audio.

**23. Minor: reload mid-page and deep links are undefined. The absence is CONFIRMED.**
- **Evidence:** a grep finds no `scrollRestoration` anywhere, although plan §4 tests "reload mid-page".
- **Fix:** set `history.scrollRestoration='manual'`. After the hand-off, jump to the stored scene or hash with SFX suppressed (the 60-unit rule).
- **Owner:** frontend-engineer, gsap-animator.

**24. Minor: tokens.ts reuse would copy the demo's values. CONFIRMED.**
- **Evidence:** TECH §1 says "Reuse by copy (tested): … tokens.ts". That asset has `ease.enter:'dimmer'`, `dur {xs:0.18…}` and `scrub:0.8`, and `registry.ts` sets `gsap.defaults` from it and imports SplitText and Flip.
- **Fix:** rewrite tokens from ANIMATION §1. Strip SplitText and Flip from the registry.
- **Owner:** gsap-animator.

**25. Minor: dependency setup is incomplete. CONFIRMED.**
- **Evidence:**
  - The demo has `"overrides":{"playwright-core":"1.63.0"}`; TECH omits it, and the axe peer `playwright-core >= 1.0.0` could install a second copy.
  - Lighthouse is required but not pinned; the web-qa script uses `npx lighthouse`.
- **Fix:** add the override. Add `lighthouse@13.6.0` (Apache-2.0) as a devDependency. Move the Fontsource packages to devDependencies, since only their files are copied.
- **Owner:** frontend-engineer, qa-engineer.

**26. Minor: the sound cue in static mode uses a 60 % IntersectionObserver threshold. INFERRED.**
- **Evidence:** DESIGN §1.3 and AUDIO §4 both use a 60 % threshold.
- **Why it matters:** a panel taller than 1.67 viewports never reaches it (for example at 320×568 or 400 % zoom), so its cue never fires.
- **Fix:** `rootMargin:'-45% 0px -45% 0px', threshold:0`.
- **Owner:** audio, ui-ux-designer.

**27. Minor: the lite-tier switch is non-deterministic. INFERRED.**
- **Evidence:** ANIMATION §9 switches on loader frame time "averages > 24 ms", but loader frames include font decode, chunk parsing and audio rendering.
- **Fix:** add a `?art=lite|full` override for QA, and log the chosen tier in test output.
- **Owner:** gsap-animator, qa-engineer.

**28. Minor: empty Resource heading and narrow grep. CONFIRMED.**
- **Evidence:** the DESIGN §10.2 outline has "h3 Resource", but the CDPH link may not ship (I-2). `check-prerender` greps only `index.html` for vaping strings.
- **Fix:** omit the h3 when the link is absent. Assert there is no CDPH link while California is BLOCKED. Grep the JS chunks too.
- **Owner:** ui-ux-designer, qa-engineer.

**29. Minor: stale and superseded text, including vaping-era titles. CONFIRMED.**
- **Evidence:**
  - TECH: line 3 TODOs ("still a template", "file does not exist yet"), and its handoff lists decisions already taken.
  - ANIMATION §1: "TECHNICAL_ARCHITECTURE §3 says `--track-h` = 1210vh"; its open issue (3) is settled by A-3.
  - CD §2/§5/§7/§9: mono UI, "mono %", "Silent until the choice (no autoplay)".
  - TYPOGRAPHY §4: SplitText guidance (superseded by D2).
  - CD says "Skip to the end"; DESIGN says "Skip to the message".
  - DECISIONS.md is titled "Clear Air (youth vaping prevention)", and PROJECT_STATUS.md still has a vaping-era header and a 2026-11-17 phase table. Plan C1 says "No vaping words … anywhere".
  - PROGRESS T6 says "aligned with … AU-1..AU-5" (untrue, see finding 17).
- **Fix:** mark superseded text inline or remove it. Retitle DECISIONS and PROJECT_STATUS.
- **Owner:** orchestrator, frontend-engineer, gsap-animator, creative-director, typography-spacing.

**30. Minor: the ownership map has gaps. CONFIRMED.**
- **Evidence:**
  - TECH §2 does not cover `package.json`/`package-lock.json`, `qa/audio/`, the `?audio-qa` page, the scene-index store, `idle`/`mount`/`rig.ts`, the bridge panels or `public/_headers`.
  - "art/SVG rig" and "audio" are not studio roles (the plan says frontend-engineer for both).
  - The `LoadingSequence.tsx` row names two owners.
- **Fix:** one named role per path, with T8 and T10 on disjoint paths.
- **Owner:** frontend-engineer.

## Technical decisions for DECISIONS.md (my rationale)
- **TD1:** story DOM per finding 1: a wrapper with the stage plus beats, the end measured from the track, a 100lvh stage and a 100svh copy box. This is the only layout where the copy travels with the art and the pin releases at S7.
- **TD2:** one `rig.ts` source for CSS, matchMedia and audio. Three selectors cannot stay in sync.
- **TD3:** count-based loader progress with the item list in finding 4. It matches the plan §4 assertion and has no tunable weights to fake.
- **TD4:** scrub 0.5 on fine pointers and true on coarse (ANIMATION rationale accepted).
- **TD5:** storage keys per finding 12.
- **TD6:** headlines and captions use opacity or clip-path only.
- **TD7:** the CSP keeps `style-src 'unsafe-inline'`. It is needed for SVG and GSAP inline styles, there are no third parties, and CSSOM writes are unaffected. Scripts are allowed only by hash.

## Client decisions
1. The sound start when the browser allows autoplay: prompt or no prompt, and whether there is a loader sound bed. A stop control must be available within 3 s either way.
2. The LCP element: either the headline is visible at first paint, or the client accepts LCP measured on the loader's first text plus a separate story-ready metric.
3. D-2: an explicit "without sound" choice persists across visits and suppresses the prompt. Confirm, given the brief says sound is "ON by default".
4. The production URL for canonical and OG tags (D5).
5. The protagonist's gender read: open, or a specific read.
6. Scene 6 shows an adult customer at the counter, never a teen being refused. Confirm.
7. M7 stays off.
8. A placeholder typographic wordmark, or the client supplies a logo.
9. "No exceptions" is shown as OZONE's own statement. The client confirms it reflects store practice.
10. California stays BLOCKED. The CDPH resource link ships only if the client supplies or confirms the URL or text.
11. No quit-help resource (I-5): confirm, or supply a source.
12. Real-device testing (iOS and Android audio unlock, performance): the client tests, or accepts NOT TESTED.
13. Hosting and headers are host configuration: who deploys. Publishing is the client's call.
14. Final approval of the music.

Creative-director tunables that do not go to the client: I-1, the A-2 P-rig values, AU-3.

## HANDOFF
- **agent:** technical-lead
- **phase:** T6 Gate A
- **summary:** FAIL (changes required): 3 blockers, 12 majors, 15 minors, all document fixes. Copy, labels, budgets arithmetic, fonts and dependency pins pass.
- **files_changed:** none
- **verification:**
  - `git log --oneline -3; git status --short`: HEAD `28d9550`, clean. PASS.
  - `npm view <pkg>@<ver> name version license repository.url` for all 14 pins: react/react-dom 19.3.1 MIT; gsap 3.15.1 "Standard 'no charge' license"; @gsap/react 2.1.2 "SEE LICENSE AT https://gsap.com/standard-license"; both Fontsource packages 5.3.0 OFL-1.1; vite 8.3.8 MIT; plugin-react 6.3.0 MIT (peer `vite ^8.0.0`); typescript 7.0.2 Apache-2.0; @types/* MIT (@types/node 22.19.1 satisfies vite's `>=22.12.0`); @playwright/test 1.63.0 Apache-2.0; @axe-core/playwright 4.14.0 MPL-2.0. PASS.
  - `npm pack` of the fonts and gsap, then `ls -l`: 78,156 B and 33,996 B. PASS. `gzip -c` of the min builds: 28,435 / 18,039 / 3,673 B.
  - Label diff of `sfx:`/`cue:` ids with grep and comm: only `cue:s1` and `cue:t45:erase` are AUDIO-only, both documented as non-existent or a proposal. PASS.
  - `grep` of `capture-reference.mjs`: "spread over the full page height, at least 0.85 viewport each", `deviceScaleFactor: 1`. This is the evidence for finding 8 (FAIL for the protocol as written).
  - `grep` of `demo/src/entry-server.tsx`: `import { renderToString }` (evidence for finding 10).
  - Build, typecheck, browser and Lighthouse: NOT TESTED (no code exists).
- **open_issues → owner:** findings 1–30 above, each with its owner.
- **decisions_needed:** client list items 1–14; creative-director for findings 3 and 5.
- **next_suggested:** owners apply findings 1–15 and 29. Then a narrow Gate A re-check of those sections. Then client approval. Then T6b (the t45/t67 prototype) before T7.

