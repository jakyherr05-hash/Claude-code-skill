# Technical Architecture: OZONE (cigarette-prevention graphic novel, "Your Ink")
_Owner: frontend-engineer · Status: Gate A approved; round-2 conditions applied (N1–N14, G-11..G-19) · 2026-11-18_
_Binding inputs: approved plan §3, CREATIVE_DIRECTION §5/§6/§8, TYPOGRAPHY_SYSTEM, SPACING_SYSTEM, DECISIONS.md (TD1–TD12, G-1..G-19). Links: [DESIGN_SPECIFICATION](DESIGN_SPECIFICATION.md) · [ANIMATION_SPECIFICATION](ANIMATION_SPECIFICATION.md) · [AUDIO_SPECIFICATION](AUDIO_SPECIFICATION.md) · [TEST_PLAN](TEST_PLAN.md)._

## 1. Stack and dependencies
Vite + React 19 + TypeScript (strict) + plain CSS tokens, single route `/`, static prerender (pattern of `demo/scripts/build.mjs`: client build, SSR build of `entry-server.tsx`, inject HTML + font preloads). Native scroll. Not Next.js: one route, no CMS, no server. **The art is prerendered and not hydrated (TD9, §7).**
Versions checked with `npm view` on 2026-11-18; `demo/package.json` pins the same.

| Package | Exact version | Licence | Kind | Why |
|---|---|---|---|---|
| react, react-dom | 19.3.1 | MIT | dependency | UI shell; prerender via `react-dom/server`; the client hydrates only the small interactive shell (loader, toggle, counter), never the art |
| gsap | 3.15.1 | GSAP Standard "no charge" | dependency | master timeline, ScrollTrigger, matchMedia, CustomEase. Free for this commercial use; no Club plugins |
| @gsap/react | 2.1.2 | GSAP Standard "no charge" | dependency | `useGSAP` scoped cleanup |
| @fontsource-variable/bricolage-grotesque | 5.3.0 | OFL-1.1 | **devDependency** (TD11) | display; only the latin `wdth` file (78,156 B) is copied to `public/fonts/` |
| @fontsource-variable/atkinson-hyperlegible-next | 5.3.0 | OFL-1.1 | **devDependency** (TD11) | UI/body; latin `wght` file (33,996 B) copied |
| vite 8.3.8 (MIT), @vitejs/plugin-react 6.3.0 (MIT), typescript 7.0.2 (Apache-2.0), @types/react 19.3.0, @types/react-dom 19.3.0, @types/node 22.19.1 (MIT) | | | devDependency | build + types |
| @playwright/test 1.63.0 (Apache-2.0; latest 1.65.1, keep the demo's tested pin), @axe-core/playwright 4.14.0 (MPL-2.0, test-only, not shipped) | | | devDependency | QA |
| lighthouse 13.6.0 (Apache-2.0, verified `npm view` 2026-11-18) | | | devDependency (TD11) | Lighthouse medians pinned instead of `npx lighthouse` |

`package.json` also carries `"overrides": { "playwright-core": "1.63.0" }` (TD11), so the axe peer (`playwright-core >= 1.0.0`) cannot install a second copy.
Registered GSAP plugins: ScrollTrigger and CustomEase only. No SplitText, no Flip (type reveals are stroke-mask inks).
**Not added:** Lenis (native scroll), Three.js/R3F/WebGL/Canvas, Tone.js/Howler (Web Audio API directly, all audio synthesised in code), React Router, state libraries, CSS-in-JS, Tailwind, icon packs, analytics/trackers, JetBrains Mono (TYPOGRAPHY D1), SplitText/Flip/Draggable/Observer/MorphSVG, any CDN or third-party request at runtime.
**Motion helpers are rewritten, not copied (TD11).** `src/motion/tokens.ts` and `src/motion/registry.ts` are written from ANIMATION_SPECIFICATION §1 (no demo values such as `ease.enter:'dimmer'`, `dur.xs`, `scrub:0.8`; no SplitText/Flip imports). `useReducedMotion.ts` may be copied from `gsap-motion/assets/` unchanged; `lit.ts` is not used. Build script adapted from `demo/scripts/build.mjs` into `scripts/build.mjs`.

## 2. Directory map and file ownership (`showcase/ozone/`)
One named studio role per path (finding 30). Roles: frontend-engineer (FE), gsap-animator (GA), typography-spacing (TS), qa-engineer (QA), performance-engineer (PE), ui-ux-designer (UX), creative-director (CD). The SVG art and the audio code are FE's, as the plan states; T8 (art) and T10 (audio) touch disjoint paths.

| Path | Owner | Task |
|---|---|---|
| `package.json`, `package-lock.json`, `index.html`, `public/` (robots, favicon, `_headers`, `fonts/` copy), `vite.config.ts`, `tsconfig*.json`, `scripts/build.mjs`, `scripts/head-script.mjs` (builds the head script and its sha256) | FE | T7 |
| `src/main.tsx`, `src/entry-server.tsx`, `src/App.tsx`, `src/components/**` (SkipLink, SoundToggle, SceneCounter, SkipToEnd, Sources, Footer), `src/sections/**` (story DOM, `#scene-7`, Sources), `src/stores/sceneIndex.ts` (scene-index store), `src/loader/AssetLoader.ts`, `src/loader/LoadingSequence.tsx` (markup and behaviour) | FE | T7 |
| `src/styles/**` except `tokens.css` | FE | T7 |
| `src/styles/tokens.css` (type, spacing, palette, font-face) | TS | T7 |
| `src/motion/rig.ts` (media-query strings, TD2), `src/motion/head-boot.ts` (source of the head script) | FE | T7 |
| `src/motion/{registry,tokens,useReducedMotion}.ts`, `master.ts`, `camera.ts`, `character.ts`, `idle.ts`, `mount.ts`, `scenes/s1.ts…s7.ts`, `transitions/t12.ts…t67.ts`, `bridge/**` (bridge panels; stays with GA, G-19), `loaderTimeline.ts` (loader choreography, called from `LoadingSequence.tsx`), `cleanup.ts` | GA | T9 |
| `src/art/defs/**`, `src/art/rig/**`, `src/art/scenes/S1…S7.tsx`, `Page7.tsx`, `src/art/panels/**` (`sN-panel` groups), `src/art/layers.ts` (`LayerId` registry) | FE | T8 |
| `src/audio/**` (AudioDirector, graph, score, SFX, cue map, `useAudio.ts`, buffer-render Worker, `?audio-qa` page) | FE | T10 |
| `tests/**`, `playwright.config.ts`, `scripts/check-prerender.mjs`, `scripts/bundle-report.mjs`, `reports/**` (evidence: `showcase/ozone/reports/<area>/`, audio under `reports/audio/`) | QA | T11+ |
| `tests/proto/t45.spec.ts`, `tests/proto/t67.spec.ts` (T6b protocol, with PE) | QA | T6b |
| `showcase/ozone/proto/**` (T6b prototype code and placeholder art) (G-19) | GA | T6b |
| `showcase/ozone/proto/fidelity.json` (T6b target values, §10.1; creative-director signs off) (G-17, G-19) | FE | T6b |
| `reports/typography/` (one-off typography record inside QA's tree, accepted) (G-19) | TS | T6 |
| `studio/**` docs | author named in each file header | |

Rule: FE (T8) defines layer names in `layers.ts`; GA only targets names from that file (typed `LayerId`) and does not edit it; GA owns `src/motion/**` and FE (T7) does not edit it except `rig.ts` and `head-boot.ts`. `master.ts` derives playhead direction and computes N−1 for reverse cues itself (finding 22): `tl.call(audio.sfx, …)` is wrapped so the direction comes from the playhead delta, not from the call.

## 3. Story DOM and motion architecture
**Story DOM (TD1, supersedes A-1's wording; A-1's budget arithmetic stands).**
```
<main>
  <div class="story">
    <div class="stage">          position:sticky; top:0; height:100lvh
      <svg class="world">…</svg> the one world; art bleeds below the text-safe box
      <div class="copy">         100svh text-safe box anchored top; six copy layers (S1–S6 headline + caption)
    </div>
    <div class="track">          12 beats #beat-s1 … #beat-t67, heights sum to --budget
  </div>
  <section id="scene-7">…</section>   after .story in the DOM; margin-top:-100lvh (G-12), layered under .stage
  <section id="sources">…</section>
</main>
```
`--budget` is CSS-only and keyed to `html[data-rig]` (L/M: 1210vh; P: 1090vh (desktop × 0.9, labels rounded to 5, ANIMATION §2); S: 1010vh). **One ScrollTrigger**: `trigger: '.story'`, `start:'top top'`, `end:()=>'+='+track.offsetHeight`, `scrub` per TD4. CSS is the single source of the length. Test per rig: `st.end − st.start === track.offsetHeight`. No nested pins. Headlines and captions travel with their art plane because they are inside `.stage`. **S7 release (G-12, N3):** `#scene-7 { margin-top:-100lvh }` and it is layered under `.stage` in z-order, so the real S7 page sits exactly under the last pinned frame and the stage's release shows no jump (the pin ends, the stage scrolls away over an identical page). Q-VIS compares end−1 px, end+1 px and end+100 px. Anchors (SkipToEnd, scene links) are an instant JS `scrollTo` to the beat's offset (no smooth scroll); a hash present at load is resolved the same way after the hand-off (§4, scroll restoration).
**Master timeline.** `master.ts` builds one paused `gsap.timeline({ defaults:{ease:'none'} })` per rig with labels from ANIMATION's tables (units from one table in `master.ts`; P uses ANIMATION's published label table, labels rounded to 5). Sub-timelines are `add()`ed at labels. The trigger is created at the loader hand-off. **Scrub (TD4):** `0.5` on fine pointers, `true` on `(pointer:coarse)`; ANIMATION §1 is the source.
**Property ownership.**
| Property class | CSS | React | GSAP |
|---|---|---|---|
| Layout, colour, type, static fills/strokes, focus, hover (non-GSAP elements) | yes | renders once | never |
| Stage-layer `transform`, `opacity`, `stroke-dashoffset`, `clip-path`/mask attrs, `<use>` href/pose swaps, SVG attributes | never transition these | never (art is not React-rendered on the client) | yes, only through `gsap.context` scoped to the stage |
| Controls (toggle state text, counter) | style | text from external store via `useSyncExternalStore` (audio state, scene index) | none |
GSAP targets `[data-layer="…"]`/`[data-rig="…"]` set in the prerendered markup and never changed by React (no class toggles on animated nodes). **Headlines and captions animate `opacity` or `clip-path` only: never autoAlpha, `visibility:hidden`, `display:none` or removal (TD6).** `mount` uses only `display` sets and only on aria-hidden art.
**Timeline ownership (one owner per element per time range).**
| Owner | Elements | Range |
|---|---|---|
| `camera` | `[data-cam]` x/y/scale/rotation | whole master |
| `character` | `[data-rig]` position + pose swaps | whole master, except hidden spans |
| `sN` | that scene's `sN-` layers and headline masks | `sN` hold, plus in/out segments inside neighbouring transitions for layers not claimed by `tNM` |
| `tNM` (x6) | only layers crossing the boundary, per ANIMATION_SPECIFICATION | `tNM` label span |
| `loader` | curb line, wordmark, prompt, progress bar | before the master exists; hands the curb line to `s1` |
Enforcement: `master.ts` registers every tween target in a `claims` map; overlapping claims by different owners throw; a Playwright test asserts `window.__claims` has zero overlaps. **Test hooks (`__claims`, `__labels`, `__art`, and the like) ship in the production bundle but are exposed only when `window.__OZONE_QA__` is set (Playwright `addInitScript`) (G-15, N13); Q-BLD asserts they are absent otherwise.**
**Rig selection (TD2).** One `src/motion/rig.ts` exports the media-query strings for rigs **L, M, P, S** and for **static** (`(prefers-reduced-motion:reduce)`, `(max-height:359px)`, `?view=text` / `sessionStorage['ozone-view']`). Everything that picks a rig imports from it:
- the head script (§4) evaluates the strings with `matchMedia` and writes `html[data-mode="story|static"][data-rig="L|M|P|S"]` before first paint;
- CSS `--budget` and the story layout key on `[data-rig]`/`[data-mode]` (**CSS reads only the attributes (G-16)**; no media strings are inlined into CSS);
- `gsap.matchMedia` is created with the same strings.
Width-based motion branches (the old 600/1024 px conditions) are removed; the grid stays width-based for layout only. The rig rebuilds only when the bucket changes (matchMedia semantics), through one 150 ms debounce; DESIGN's 120 px height-change rule is dropped. L/M/P/S camera rigs and budgets cannot disagree because there is one source.
**Refresh.** `ScrollTrigger.config({ ignoreMobileResize:true })`; `ScrollTrigger.refresh()` after `document.fonts.ready` and on `orientationchange` (150 ms debounce). The art is prerendered, so there are no per-scene art chunks to refresh after. Track height comes from CSS (`svh`/vh units), not JS measurement.
**Cleanup.** `useGSAP(fn,{scope:stageRef,revertOnUpdate:false})` plus the matchMedia context revert every tween/trigger. `cleanup.ts` is the single listener registry (`on(target,type,fn,opts)` returns off; `disposeAll()`) for visibilitychange, **pageshow, pagehide, AudioContext `statechange`**, keydown, resize, orientationchange. `AssetLoader.dispose()` and `AudioDirector.dispose()` call into it. Test: ScrollTrigger count, `gsap.globalTimeline.getChildren().length` and the registry's listener count are equal before and after unmount/remount and across reload.

## 4. Modes, head script, watchdog, no-JS and failure behaviour
**One pre-paint head script (TD2, TD7).** A small inline `<script>` in `<head>`, authorised by CSP `script-src 'self' 'sha256-<hash>'` (hash computed at build by `scripts/head-script.mjs` from `src/motion/head-boot.ts` and written into `_headers` and a `<meta http-equiv>` fallback if the host ignores headers). It:
1. evaluates `rig.ts`'s strings and sets `html[data-mode]` (`story` or `static`) and `html[data-rig]`;
2. adds `js-loading` only when `data-mode="story"`;
3. arms the **watchdog (TD7)**: after about **12 s** (longer than the loader's 10 s hard timeout) it sets `data-mode="static"` and removes `js-loading`, unless `main.tsx` has signalled boot (`window.__ozoneBoot = true` or a `ozone:boot` event); the head script also registers `window.addEventListener('error', fn, true)` (capture phase, handler ignores events whose target is not a `<script>` element) and a failed module script does the same immediately. No inline `onerror` attribute exists, because `script-src` would block it (N8).
Story-layout CSS keys on `data-mode="story"` from first paint, so the loader never runs over a stacked static layout and nothing swaps at the hand-off (no layout shift). An init error in `main.tsx` (registry, master build, ScrollTrigger creation inside try/catch) logs once and reverts to `data-mode="static"` and removes `js-loading`.
**No-JS and static mode.** With no JS the head script never runs: `data-mode` is absent, no CSS keyed to `story` applies, and `js-loading` is never set, so the prerendered HTML is the final comic: every scene's headline, copy, art (static frames), OZONE copy and Sources as ordinary stacked sections. Static mode (reduced motion, `max-height:359px`, `?view=text`) uses the same stacked layout with only a ≤ 200 ms fade and no scrub. In every non-story mode (no-JS, `data-mode="static"`) `svg.world` is hidden with `position:absolute; width:0; height:0; overflow:hidden`, **never `display:none`**, so the patterns, masks and gradients that the static `<use href="#sN-world">` frames reference still resolve (N9). Content is visible by default: no CSS hides content; GSAP sets initial states in JS. "Skip intro" is first in tab order; a text-story link appears after 8 s of loading. The static-mode sound-cue observer uses `rootMargin:'-45% 0px -45% 0px', threshold:0` (TD10; a 60 % threshold never fires on tall panels).
**Scroll restoration (TD10).** `history.scrollRestoration='manual'`. After the hand-off the app jumps to the stored scene or the URL hash (instant `scrollTo` to the beat) with SFX suppressed (ANIMATION's 60-unit rule).

## 5. AssetLoader contract (TD3)
```ts
type Item = { id:string; critical:boolean; timeoutMs:number; retries:number; load:()=>Promise<unknown> };
type Progress = { completed:number; total:number; ratio:number; items:Record<string,'pending'|'ok'|'skipped'|'failed'> };
class AssetLoader { constructor(items:Item[]); onProgress(cb:(p:Progress)=>void):()=>void;
  start():Promise<{ ok:boolean; skipped:string[] }>; dispose():void }
```
- **Count-based progress. No weights.** `ratio = completed/total`, `completed` counts settled items (ok or skipped); never pre-advanced or eased ahead (the curb line may lag, never lead). Unit test asserts the equality.
- **Items (six):** `font-display` (`document.fonts.load('800 1em "Bricolage Grotesque Variable"')`, critical, 4000 ms, 1 retry); `font-text` (Atkinson 400, critical, 4000 ms, 1 retry); `stage-ready` (every S1 and S2 `LayerId` from `layers.ts` resolves in the prerendered DOM, the shared defs exist, and the S1 and S2 sub-timelines build; critical, 6000 ms, 1 retry; it makes no network request); `audio-engine` (dynamic import + `AudioDirector.prepare()`, non-critical, 3000 ms, 0 retry); `audio-ir` (reverb IR rendered in code, non-critical, 3000 ms); `audio-buffers` (Worker-rendered score buffers, non-critical, 4000 ms, 0 retry). **S3–S7 are not loader items**: the art is one prerendered document, there are no later art chunks.
- **Totals (G-14): 6 items, or 3 with `localStorage['ozone-sound']='off'`.** With `off` the three audio items are excluded from the total and load on the first toggle ON (the toggle shows `aria-busy` until ready).
- Each item races its timeout; critical items retry once; on second failure critical fonts fall back to metric-matched locals (`skipped`, continue). If `audio-buffers` times out it is `skipped`, rendering continues in the Worker, and its voices join when ready.
- **`stage-ready` failure after its retry (G-14):** a missing layer id, missing defs or a sub-timeline build error switches to `data-mode="static"` and shows the DESIGN §5.2 message; Q-LOAD-3 injects a missing layer id. Font failures never show the message (N5): they fall back and continue.
- Hard global timeout 10 s: story opens regardless, `skipped` recorded; never stuck (the head-script watchdog at ~12 s is the backstop, §4).
- Returning visitor: `sessionStorage['ozone-seen']='1'` set at the hand-off; if present, the compact ≤ 1 s loader runs (assets still really loaded; progress honest).
- Reduced motion: static mark + plain `role="progressbar"` bar with the same values.
- `start()` is idempotent; `dispose()` aborts timers and unsubscribes.

## 6. AudioDirector contract (internals per [AUDIO_SPECIFICATION.md](AUDIO_SPECIFICATION.md))
- Singleton (`AudioDirector.get()`), one `AudioContext` and one graph in production, `src/audio/unlock.ts` (tiny, in the initial bundle) is the only code that constructs the AudioContext. It exports `getContext()` (get-or-create singleton; state expected `suspended` before a gesture; no sound) and `unlock()` (get-or-create, `resume()` and the silent buffer, called synchronously inside the ENTER/toggle click handler). The boot autoplay probe (cases a–c) and `prepare()` both use `getContext()` (N2). A second file-based Worker `clockWorker.ts` keeps time only. Buffers are rendered in a file-based Worker (`new Worker(new URL('./renderWorker.ts', import.meta.url))`, not a blob; CSP `worker-src 'self'`) using recurrence oscillators; any main-thread remainder runs in chunks ≤ 16 ms. Scheduling still runs on the main thread: a main-thread task longer than the look-ahead (120/200 ms) delays notes.
- State machine: `idle → starting → running | blocked`; `running ⇄ muted` (gain 0, then `suspend()` after the 0.4 s fade) and `running ⇄ suspended` (tab hidden). `blocked` = `resume()` did not reach `running`. Public `getState()`, `subscribe(cb)` for `useSyncExternalStore`.
- **Sound preference (TD5):** `localStorage['ozone-sound']` = `on|off`, persistent, **written only by ENTER, CONTINUE, Escape or the toggle**. **Effective preference (G-13, N1): `pref = localStorage['ozone-sound'] ?? 'on'`** (no key means the brief's default ON); every rule below reads `pref`, never the raw key. Case (b) writes nothing. Explicit `off` is never overridden by load, scroll, visibility or any other path. Storage failures are caught and treated as session-only. No `ozone.v1` object. Other keys: `sessionStorage['ozone-seen']` (short loader), `sessionStorage['ozone-view']` (text-view choice).
- **Sound start, four cases (G-1, orchestrator default pending client confirmation; mirrors DESIGN §5.3):**

| Case | Condition | Behaviour |
|---|---|---|
| (a) First visit, autoplay blocked | no preference, context stays `suspended` | loader → prompt (ENTER WITH SOUND / CONTINUE WITHOUT SOUND) → hand-off. ENTER calls `unlock()` inside its click handler and writes `on`; CONTINUE writes `off` (G-3), gain 0, `suspend()` |
| (b) First visit, autoplay allowed | no key (`pref` = `on`), context reaches `running` | loader stays silent and shows no prompt; **at the hand-off** the score fades in and the **sound toggle (visible, focusable, showing ON; no fade, rendered from that frame) appears at the same moment**, writing no key, so a stop control exists from the first audible frame (WCAG 1.4.2). `loader:bloom` plays here as the score's opening gesture (AU-4 moved from the loader) |
| (c) Returning, `on` | `ozone-sound=on` | as (b) if the context runs, else as (a) |
| (d) Returning, `off` | `ozone-sound=off` | no audio attempt, no prompt, toggle OFF; the audio items load on the first toggle ON |

The loader never plays a bed. Everything outside `#loader` is `inert` during the loader (including skip link and toggle) because no audio is audible then. Unlock (`resume()`/`unlock()`) is called only inside the ENTER and toggle click handlers; touch `pointerdown` is not an activation event and is not used.
- **Toggle truth (TD10, G-13):** `SoundToggle` shows ON iff `pref === 'on'` AND `state==='running'` AND master gain > 0; otherwise OFF. CONTINUE and Escape set gain 0 and call `suspend()`. A late-resolving `resume()` therefore cannot flip the toggle to ON. Test: blocked → CONTINUE → still OFF after 2 s. Buttons: `aria-pressed`, text + icon. The iOS silent switch can mute audio while the toggle reads ON: known limit, NOT TESTED.
- Visibility: hidden → fade + suspend; visible → resume when `pref === 'on'` (G-13; in case (b) this makes sound return after a tab switch).
- API: `setCue(sceneIndex, direction:1|-1)` (fired by `cue:sN` labels; `setCue(1,+1)` once at the loader hand-off since there is no `cue:s1` label; AU-5), `setPlayhead(units, direction)` (from `master.ts` `onUpdate`, one call per animation frame; AU-1), `sfx(id:SfxId, {direction})` with per-id latch and cooldown, `setEnabled(bool)`, `unlock()`, `dispose()`. `master.ts` supplies `direction` (derived from the playhead delta) and N−1 for reverse cues.
- Audio never gates anything: the story and loader work with the context absent or blocked. iOS/Android real-device behaviour: NOT TESTED unless the client tests.

## 7. SVG art system (TD9)
- **Prerendered, not hydrated.** `entry-server.tsx` imports `S1…S7`, `Page7` and the defs **statically**; `renderToString` emits all the art into the HTML. The client never re-renders or hydrates the art: it is static markup outside React's hydration roots, with **no art JS chunks**. `main.tsx` hydrates only the interactive shell (loader, toggle, counter, prompt), each in its own root. GSAP only looks up nodes by `data-layer`. Art path data ships once (in the HTML), not twice. (This replaces the earlier lazy-chunk plan; `React.lazy` and `renderToString` Suspense fallbacks would drop the art from the no-JS HTML.)
- **Static frames** are windows onto the one world: `<svg viewBox="…hold…"><use href="#sN-world"/></svg>`, so static mode adds no duplicated art DOM. The world SVG stays in the DOM and is hidden only as in §4 (N9).
- `src/art/defs/`: one `<svg width=0 height=0>` of shared `<defs>` mounted once: halftone patterns (pitch 6 px desktop, 4 px at 390 via CSS var on the pattern), ink-edge filter (single `feTurbulence`+`feDisplacementMap`, ≤ 3 layers, baked to paths where heavy), shadow-plane gradients, palette colours as CSS vars.
- `src/art/rig/`: `Protagonist.tsx` renders `<symbol>` parts and 4 walk frames; `rig.config.ts` proportions; `poses.ts` pose table. GSAP swaps poses by `data-pose` visibility and part transforms, never by React state. Scenes use `<use href="#rig-…">`.
- **t67 panels:** low-detail `sN-panel` groups defined in `<defs>` (≤ 300 nodes each), exempt from `mount`, so a `<use>` of them always renders. `mount` uses only `display` sets and only on aria-hidden art. `content-visibility` is not used (it does not apply to SVG children).
- Targeting: `data-layer="s3-balloons"` (id from `layers.ts`) and `data-depth`. No class names used by GSAP, no inline style set by React on these nodes. `will-change:transform` only on the camera group and the 3 heaviest layers (SVG-child layer promotion is not reliable; the HTML-wrapped-`<svg>`-layer cut-line is held for T6b).
- Node budgets are in §8 (document, per frame, per scene), counted by tests.

## 8. Performance budgets and measurement
| Metric | Budget | Method |
|---|---|---|
| **LCP** (lab, mobile emulation 390, 4x CPU throttle, Fast 4G) | ≤ 2.5 s, on **whatever element Chromium reports** (expected: loader text). No claim that the S1 h1 is the LCP element (G-2) | Playwright `PerformanceObserver('largest-contentful-paint')` records the element; Lighthouse median of 3 (matches plan §4) |
| **Story-ready** (G-2, G-11; navigation start to the **end** of the hand-off, measured in the autoplay-allowed project so no human wait is included, same lab profile) | **≤ 5.5 s median first visit, ≤ 3.0 s returning, hard cap 10 s (the loader timeout)** | `performance.mark('story-ready')` at the hand-off end, read by Playwright; 3 runs, median; Q-LOAD-2 measures the same end |
| CLS | ≤ 0.05 | `layout-shift` observer through the loader, hand-off, full scroll and font swap |
| TBT | ≤ 200 ms | Lighthouse (lab) |
| INP | ≤ 200 ms (lab only) | Event Timing observer over ENTER, CONTINUE, toggle, skip |
| Initial JS (gz) | ≤ 180 KB, where "initial JS" = **all JS requested before the hand-off** (including the audio engine and Worker) | `scripts/bundle-report.mjs` on the network log up to `story-ready` (react+gsap+ScrollTrigger ≈ 120 KB estimated; unverified until built) |
| First-load fonts | 112,152 B (budget 150 KB) | file sizes in `dist` |
| Prerendered HTML | ≤ 250 KB gz | `bundle-report.mjs` gzips `dist/index.html` |
| SVG nodes, document | ≤ 20,000 | DOM count test |
| SVG nodes rendered in any frame | ≤ 5,000 (≤ 3,600 at 390) | DOM count at the 7 holds and 5 mid-transition playheads, counting only nodes without `display:none` ancestors **plus the node count of each rendered `<use>` target** (N10; t67's six `sN-panel` groups add up to 1,800) |
| `sN-panel` nodes | ≤ 300 each; `red-all` ≤ 600 nodes, its own budget outside the per-frame total (G-4) | DOM count |
| Audio buffer memory | ≤ 17 MB desktop / ≤ 12 MB mobile profile | `AudioDirector` reports total buffer bytes to `?audio-qa` |
| Audio buffer render | ≤ 400 ms (lab, mobile profile), in the Worker | `performance.measure` around the Worker job |
| Long tasks from audio | none (no task > 50 ms attributed to audio, incl. any ≤ 16 ms main-thread chunks) | `longtask`/LoAF observer during render and S4→S5, S6→S7 cue changes |
| `AudioContext.renderCapacity` | ≤ 25 % average during the story | `renderCapacity` events where supported, else NOT TESTED |
| Audio node caps | per AUDIO §6: source nodes ≤ 140 desktop / ≤ 70 mobile, sounding notes ≤ 48 / ≤ 36, incl. the outgoing cue tail during the crossfade | `?audio-qa` node counter |
| Scroll smoothness | no frame > 50 ms during scripted slow/fast scroll at 4x CPU throttle | rAF/LoAF probe + filmstrip; T6b protocol (DPR 3 at 390×844, DPR 1 and 2 at 1440×900, real wheel/touch input, CDP trace with paint/raster/LoAF, audio running) |
Lab results are not field results: there is no RUM, so real-user CWV are NOT TESTED; reports say "lab". Story-ready target rationale (G-11): the one hand-off duration everywhere is **1.65 s** (ANIMATION §7: 0.6 + (0.7 + 0.7 − 0.35)), plus 0.3 s when the prompt shows (human wait, excluded from the metric by measuring in the autoplay-allowed project). The first-visit floor is about 4.55 s; 5.5 s leaves about 1 s for transfer variance and the Worker render (≤ 0.4 s) without tolerating a stalled loader. Returning visit: compact loader ≤ 1 s plus the hand-off. Targets are unmeasured until T6b/T11.

## 9. SEO, prerender, hosting, scripts, tests
- Head: `<title>`, description, canonical (production URL not supplied; omitted until given), OG/Twitter text tags (no image until an original share image exists), `lang="en"`, theme-color `#101014`, `color-scheme`. No California claims; copy only from FACTS_AND_SOURCES.md.
- `check-prerender.mjs` greps `dist/index.html` for all 7 headlines (both lines), the OZONE ID line, "Sources", exactly one `<h1>`, and that no `vap`/`e-cig` strings exist; it also greps the JS chunks and asserts no CDPH link while California is BLOCKED. The `<h3>Resource</h3>` is omitted when no resource link ships.
- **Headers** (`public/_headers` example; static host config is the client's/host's): `Content-Security-Policy: default-src 'self'; script-src 'self' 'sha256-<head-script-hash>'; style-src 'self' 'unsafe-inline'; worker-src 'self'; img-src 'self' data:; font-src 'self'` (TD7: `'unsafe-inline'` for styles is kept because SVG/GSAP write inline styles and there are no third parties; scripts only `'self'` plus the head script's hash), `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, `Permissions-Policy: camera=(), microphone=(), geolocation=()`, long-cache immutable for `/assets/*` and `/fonts/*`. NOT TESTED against a real host.
- Scripts: `dev`, `typecheck` (`tsc --noEmit` + node config), `lint`, `build` (`tsc --noEmit && node scripts/build.mjs dist && node scripts/check-prerender.mjs`), `preview`, `report` (bundle/fonts), `test` (Playwright), `test:update-snapshots`.
- `playwright.config.ts` adapted from `demo/playwright.config.ts`: production build via `vite preview`, `PW_PORT` (4173) and `PW_OUT` (`dist`), 1 worker, a width matrix (320, 360, 375, 390, 414, 430, 768, 1024, 1280, 1440, 1920) plus `reduced-motion` and `no-js` projects; SwiftShader args removed (no WebGL). A `?art=lite|full` override exists for QA and the chosen tier is logged.
- **Test plan:** see [TEST_PLAN.md](TEST_PLAN.md) (QA owns it): each criterion maps to a spec file, command, evidence path and PASS/FAIL/NOT TESTED rule. Evidence lives under `showcase/ozone/reports/<area>/`, with audio under `showcase/ozone/reports/audio/`. Lighthouse runs ×3 (plan §4).

## 10. Risks and mitigations
| Risk | Mitigation |
|---|---|
| Continuous camera over a large SVG may drop frames on mid-range phones (unproven) | **T6b (TD8)**: t45 then t67 prototype on placeholder art matching the real fill area, filters and mask, measured with QA's protocol (DPR 3 at 390×844; DPR 1 and 2 at 1440×900; real wheel/touch; CDP trace with paint/raster/LoAF; audio running) → performance verdict + cut-lines, after client approval of Gate A and before T7; T8 depends on T6b passing. Cut-lines: lower halftone density, bake filters, cull layers, fewer nodes, HTML-wrapped-`<svg>` depth planes. Real-device performance NOT TESTED without client devices |
| t67 panel-page assembly is the most complex timeline | second T6b prototype; panels are low-detail `sN-panel` `<defs>` groups; fall back to paper-rise + static panels if the filmstrip fails critique |
| One master timeline is a single point of failure | try/catch init → static mode; head-script watchdog; claims-overlap assertion; per-scene sub-timeline unit tests |
| Prerendered art too heavy for the HTML (size, long parse) | budgets in §8 (≤ 250 KB gz, ≤ 20,000 nodes, per-frame caps); art is never hydrated |
| Fonts late shifting wraps and labels | metric-matched fallbacks (TYPOGRAPHY), `refresh()` after fonts, track heights from CSS |
| Autoplay policies differ (Safari/iOS) | G-1 four-case table; Chromium policies emulated; iOS/Android NOT TESTED |
| Audio render cost on mobile | Worker render, ≤ 16 ms main-thread chunks, §8 audio rows |
| Initial JS budget | GSAP core + ScrollTrigger + CustomEase only; no art chunks; bundle report gate |
| TypeScript 7 / Vite 8 toolchain drift | exact pins matching the demo's passing build; `playwright-core` override |

### 10.1 T6b fidelity target: `showcase/ozone/proto/fidelity.json` (G-17)
Owner: frontend-engineer (written before T6b starts); **creative-director signs off** the values. The file holds **TARGET** values, not measurements of real art (the real art does not exist until T8). The prototype's placeholder art is checked against it (TEST_PLAN §3.1: halftone area 0.9×–1.3× target, identical filtered layers, same mask element ±10 % box). In T8, FE measures the real art against the same file; **more than 10 % over any target triggers a T6b re-run.**

| Field | Target | Derivation |
|---|---|---|
| `halftoneFillArea` per scene (CSS px², bounding boxes of elements filled by a halftone pattern, at the hold viewport) | ≤ **35 % of the viewport**: 1440×900 → 453,600 px²; 390×844 → 115,206 px² (35 % of 329,160). Applied to S1–S7 each; S7 (paper) 0 | CD §2: halftone only in terminators, skin/cloth mid-tones and sky gradation; never in text-safe zones; shadow masses (about 50 % of each figure) double as text-safe zones. The ceiling is 35 % of the frame, below the ~50 % shadow share, so the fill is a cap the art may not exceed. CD adjusts the percentage at sign-off |
| `filteredLayers` | exactly **3** layer ids (ink-edge filter, one `feTurbulence`+`feDisplacementMap`), chosen by FE from `layers.ts` before T6b and written into the file; the same 3 in the placeholder | §7 and ANIMATION §9: ink-edge filter static on ≤ 3 layers |
| `maskId` | `eraser-mask`, on the `red-all` group, covering its bounding box (target box recorded in the file) | ANIMATION t45: one SVG `<mask>` over the single `red-all` group |
| `nodes.perFrame` | ≤ **4,500** (≤ **3,240** at 390), including `<use>` targets | 90 % of the §8 caps (5,000 / 3,600), leaving 10 % headroom for the T8 drift rule |
| `nodes.redAll` | ≤ **600** | §8 own budget (G-4) |
| `nodes.panel` (each of 6 `sN-panel`) | ≤ **300**; t67 panels total ≤ 1,800 | §8 |
| `nodes.document` | ≤ **20,000** | §8 |

**Software-raster rule (N7b).** This environment has no GPU (`/dev/dri` absent; SwiftShader), so raster cost cannot be judged. In software raster, **frame time, LoAF and long-task criteria gate the verdict; raster p95 is reported only**; the verdict is labelled **"lab, software raster"**; real phone GPU stays NOT TESTED. **Worker scaled-estimate rule (G-17):** the Worker render budget is judged on `max(measured, unthrottled × 4)` and labelled "estimated", with a calibration loop run in both the Worker and the main thread on every run.

HANDOFF
- agent: frontend-engineer
- phase: T6 Gate A round-2 conditions (document only)
- summary: Applied N1/G-13, N2, N3/G-12, N4/G-14, N8, N9, N13/G-15, N14/G-11, G-16, G-17 (new §10.1 fidelity target), G-19 ownership rows, F18.
- files_changed: /home/user/Claude-code-skill/showcase/ozone/studio/TECHNICAL_ARCHITECTURE.md
- verification: consistency by reading: PASS. Build, typecheck, browser, story-ready and fidelity values: NOT TESTED (targets, no code).
- open_issues -> owner: fidelity.json 35 % halftone ceiling and 3 filtered layer ids -> creative-director sign-off, FE fills ids from layers.ts.
- decisions_needed: none.
- next_suggested: T6b.
