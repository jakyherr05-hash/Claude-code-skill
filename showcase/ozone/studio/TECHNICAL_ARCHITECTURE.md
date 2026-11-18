# Technical Architecture: OZONE (cigarette-prevention graphic novel, "Your Ink")
_Owner: frontend-engineer · Status: DRAFT for Gate A (tech-lead approval + client approval pending) · 2026-11-18_
_Binding inputs: approved plan §3, CREATIVE_DIRECTION §5/§6/§8, TYPOGRAPHY_SYSTEM, SPACING_SYSTEM. Links: [DESIGN_SPECIFICATION](DESIGN_SPECIFICATION.md) (TODO: still a template, align when filled) · [AUDIO_SPECIFICATION](AUDIO_SPECIFICATION.md) (TODO: file does not exist yet) · [ANIMATION_SPECIFICATION](ANIMATION_SPECIFICATION.md) (TODO: template)._

## 1. Stack and dependencies
Vite + React 19 + TypeScript (strict) + plain CSS tokens, single route `/`, static prerender (pattern of `demo/scripts/build.mjs`: client build, SSR build of `entry-server.tsx`, inject HTML + font preloads, hydrate only if `data-prerendered` matches). Native scroll. Not Next.js: one route, no CMS, no server.
Versions checked with `npm view` on 2026-11-18; `demo/package.json` pins the same.

| Package | Exact version | Licence | Why |
|---|---|---|---|
| react, react-dom | 19.3.1 | MIT | UI shell; renders static SVG/HTML once (prerender via `react-dom/server`) |
| gsap | 3.15.1 | GSAP Standard "no charge" | master timeline, ScrollTrigger, matchMedia, CustomEase. Free for this commercial use; no Club plugins |
| @gsap/react | 2.1.2 | GSAP Standard "no charge" | `useGSAP` scoped cleanup |
| @fontsource-variable/bricolage-grotesque | 5.3.0 | OFL-1.1 | display; only the latin `wdth` file (78,156 B) is copied to `public/fonts/` |
| @fontsource-variable/atkinson-hyperlegible-next | 5.3.0 | OFL-1.1 | UI/body; latin `wght` file (33,996 B) |
| Dev: vite 8.3.8 (MIT), @vitejs/plugin-react 6.3.0 (MIT), typescript 7.0.2 (Apache-2.0), @types/react 19.3.0, @types/react-dom 19.3.0, @types/node 22.19.1 (MIT) | | | build + types |
| Dev: @playwright/test 1.63.0 (Apache-2.0; latest 1.65.1, keep the demo's tested pin), @axe-core/playwright 4.14.0 (MPL-2.0, test-only, not shipped) | | | QA |

Registered GSAP plugins: ScrollTrigger, CustomEase only (copy `registry.ts`, delete SplitText/Flip imports: type reveals are stroke-mask inks, not split text; revisit if S7 needs it).
**Not added:** Lenis (native scroll), Three.js/R3F/WebGL/Canvas, Tone.js/Howler (Web Audio API directly, all audio synthesised in code), React Router (one route), state libraries, CSS-in-JS, Tailwind, icon packs, analytics/trackers, JetBrains Mono (TYPOGRAPHY D1), SplitText/Flip/Draggable/Observer/MorphSVG, any CDN or third-party request at runtime.
Reuse by copy (tested): `gsap-motion/assets/{registry.ts,tokens.ts,useReducedMotion.ts}` into `src/motion/`. `lit.ts` is NOT copied (SplitText-based). Build script adapted from `demo/scripts/build.mjs` into `scripts/build.mjs`.

## 2. Directory map and file ownership (`showcase/ozone/`)
| Path | Owner |
|---|---|
| `index.html`, `src/main.tsx`, `src/entry-server.tsx`, `src/App.tsx`, `src/components/**` (Skip link, SoundToggle, SceneCounter, SkipToEnd, Sources, Footer), `src/sections/**` (SceneSection x7: semantic text, one h1, landmarks), `src/styles/**` except `tokens.css`, `vite.config.ts`, `tsconfig*.json`, `scripts/build.mjs`, `public/` (robots, favicon, fonts copy) | frontend |
| `src/styles/tokens.css` (type, spacing, palette, font-face) | typography |
| `src/motion/{registry,tokens,useReducedMotion}.ts`, `src/motion/master.ts` (builds master timeline), `src/motion/camera.ts`, `character.ts`, `scenes/s1.ts…s7.ts`, `transitions/t12.ts…t67.ts`, `loaderTimeline.ts`, `cleanup.ts` | gsap-animator |
| `src/loader/AssetLoader.ts` (contract §5), `src/loader/LoadingSequence.tsx` (DOM/markup: frontend; its timeline: gsap-animator) | frontend (AssetLoader), gsap-animator (choreography) |
| `src/audio/**` (`AudioDirector.ts`, graph, score, SFX, cue map, `useAudio.ts`) | audio |
| `src/art/defs/**` (halftone, ink filter, shadow planes, palette `<defs>`), `src/art/rig/**` (Protagonist.tsx, pose table, rig config), `src/art/scenes/S1…S7.tsx` + `Page7.tsx`, `data-layer` names registry `src/art/layers.ts` | art/SVG rig |
| `tests/**`, `playwright.config.ts`, `scripts/check-prerender.mjs`, `scripts/bundle-report.mjs`, `reports/**` | qa |
| `studio/**` docs | author named in each file header |
Rule: the art agent defines layer names in `layers.ts`; gsap-animator only targets names from that file (typed `LayerId`); frontend never edits either.

## 3. Motion architecture
**Stage.** One `<main>` with a tall track (`--track-h` = story budget + one stage height, i.e. `calc(var(--budget) + 100svh)` with `--budget` 1210vh desktop / 1010vh at 390 from ANIMATION_SPECIFICATION; the sticky stage lives inside the track, so without the extra 100svh the last 100vh of the timeline would never be reached — decision A-1); one `position:sticky; top:0; height:100svh` stage inside it. Stage holds one camera group `<g data-cam>` containing all scene art; scene HTML sections (headings, captions) sit over it in normal flow with height = their hold + transition length so keyboard/anchor jumps land on a hold. No nested pins, ever.
**Master timeline.** `master.ts` builds one paused `gsap.timeline({ defaults:{ease:'none'} })` per matchMedia branch with labels `s1 t12 s2 t23 s3 t34 s4 t45 s5 t56 s6 t67 s7` positioned from the scroll budget (vh to timeline units, single table in `master.ts`). Sub-timelines are `add()`ed at labels. One `ScrollTrigger.create({ trigger: track, start:'top top', end:'bottom bottom', scrub: true, animation: master })` (scrub true, native scroll is the smoother; add numeric scrub only if filmstrip says so). Loader hand-off is a separate timeline that finishes before the trigger is created.
**Property ownership.**
| Property class | CSS | React | GSAP |
|---|---|---|---|
| Layout, colour, type, static fills/strokes, focus, hover (non-GSAP elements) | yes | renders once | never |
| Stage-layer `transform`, `opacity`, `stroke-dashoffset`, `clip-path`/mask attrs, `<use>` href/pose swaps, SVG attributes (`x`, `d` where permitted) | never transition these (no CSS `transition`/`animation` on stage layers) | never (no animated value in state/props) | yes, only through `gsap.context` scoped to the stage |
| Controls (toggle state text, counter) | style | text from external store via `useSyncExternalStore` (audio state, scene index) | none |
GSAP targets layers by `[data-layer="…"]`/`[data-rig="…"]`, set at render and never changed by React (no class toggles on animated nodes; React keys stable; art components are `memo` with no props that change).
**Timeline ownership (one owner per element per time range).**
| Owner | Elements | Range |
|---|---|---|
| `camera` | `[data-cam]` x/y/scale/rotation | whole master (single owner for the whole range) |
| `character` | `[data-rig]` position + pose swaps | whole master, except hidden spans |
| `sN` (scene env/type) | that scene's `data-layer` ids with prefix `sN-` and its headline masks | `sN` hold, plus the scene's own in/out segments inside neighbouring transitions only for layers not claimed by `tNM` |
| `tNM` (x6) | only layers crossing the boundary, listed per transition in ANIMATION_SPECIFICATION: t12 walk/curb/sky; t23 balloons/glare; t34 beam + chest mask; t45 eraser front (signature 1); t56 window wipe; t67 page assembly (signature 2) | `tNM` label span |
| `loader` | curb line, wordmark, prompt, progress bar | before master exists; hands curb line to `s1` |
Enforcement: `master.ts` registers every tween target in a `claims` map (element id, start, end, owner) in dev/test builds; overlapping claims by different owners throw, and a Playwright test asserts `window.__claims` has zero overlaps.
**Responsive.** `gsap.matchMedia()` with conditions `(max-width:600px)`, `(min-width:601px) and (max-width:1024px)`, `(min-width:1025px)`, all `and (prefers-reduced-motion:no-preference)`, plus `(prefers-reduced-motion:reduce)`. Each builds its own master + trigger inside the callback (auto-revert on change). Camera rig (16:9, 4:3, 3:4, 9:19.5) picks by aspect ratio via the same condition set with `(orientation)`/aspect media queries. Reduced-motion branch builds no scrub: static comic panels, only a ≤ 200 ms fade.
**Refresh.** `ScrollTrigger.config({ ignoreMobileResize:true })`; `ScrollTrigger.refresh()` after `document.fonts.ready` (all text is already measured in sections, so fonts only move line wraps), after the art chunk for the next scene lands, and on `orientationchange` (debounced 150 ms). Track height uses `svh`/CSS vars, not JS-measured, so URL-bar changes do not move labels.
**Cleanup.** `useGSAP(fn,{scope:stageRef,revertOnUpdate:false})` plus the matchMedia context revert every tween/trigger. `cleanup.ts` is the single listener registry (`on(target,type,fn,opts)` returns off; `disposeAll()`): visibilitychange, pointerdown, keydown, resize, orientationchange. `AssetLoader.dispose()` and `AudioDirector.dispose()` call into it. Test: ScrollTrigger count, `gsap.globalTimeline.getChildren().length` and the registry's listener count are equal before and after unmount/remount and across reload.

## 4. No-JS and GSAP-failure mode
The prerendered HTML is the final comic: every scene's h1/h2 headline, copy, art (inline SVG, static pose), OZONE copy and Sources as ordinary stacked sections with paper gutters (`html:not(.js-story)` styles). Loader markup is hidden unless JS starts (`html.js-loading` set by an inline `<script>` in `<head>`, no-JS never sees it). `.js-story` is added by `main.tsx` only after `registerGSAP()`, master build and ScrollTrigger creation succeed inside try/catch; on any error we log once, leave the class off, remove `js-loading`, and the document stays readable. Content is visible by default: no CSS hides content; GSAP sets initial states. Same stacked layout is used by the reduced-motion branch (CSS `@media (prefers-reduced-motion:reduce)` plus the JS check), so `.js-story` is not added there either (story is complete without scrub). "Skip intro" is first in tab order; a text-story link appears after 8 s of loading.

## 5. AssetLoader contract
```ts
type Item = { id:string; critical:boolean; timeoutMs:number; retries:number; load:()=>Promise<unknown> };
type Progress = { completed:number; total:number; ratio:number; items:Record<string,'pending'|'ok'|'skipped'|'failed'> };
class AssetLoader { constructor(items:Item[]); onProgress(cb:(p:Progress)=>void):()=>void;
  start():Promise<{ ok:boolean; skipped:string[] }>; dispose():void }
```
- `ratio = completed/total` where completed counts settled items (ok or skipped); never pre-advanced, never eased ahead (the curb line may lag, never lead). Unit test asserts the equality.
- Items: font Bricolage (`document.fonts.load('800 1em "Bricolage Grotesque Variable"')`, critical, 4000 ms, 1 retry); font Atkinson (same, 4000 ms); `art-s1s2` (dynamic `import()`, critical, 6000 ms, 1 retry); `audio-engine` (dynamic import + `AudioDirector.prepare()`, non-critical, 3000 ms, 0 retry); `audio-ir` (reverb IR rendered in code, non-critical, 3000 ms). Each item races its timeout; on failure it retries once (critical only); on second failure critical fonts fall back to metric-matched locals (marks `skipped`, continues) and non-critical is `skipped`. Remaining art chunks (s3..s7) load after ENTER in idle, with `ScrollTrigger.refresh()` after each.
- Hard global timeout 10 s: story opens regardless, prompt shown, `skipped` recorded; never stuck.
- Returning visitor: `sessionStorage['ozone-seen']='1'` set at ENTER; if present, `LoadingSequence` runs the compact ≤ 1 s version (assets still really loaded; progress honest, usually cached).
- Reduced motion: static mark + plain `role="progressbar"` bar with the same progress values; same prompt.
- `start()` is idempotent; `dispose()` aborts timers and unsubscribes.

## 6. AudioDirector contract (internals per [AUDIO_SPECIFICATION.md](AUDIO_SPECIFICATION.md))
- Singleton (`AudioDirector.get()`), one `AudioContext` and one graph, created lazily on `prepare()` (before gesture: context created, state expected `suspended`; no sound).
- State machine: `idle → starting → running | blocked`; `running ⇄ muted` (gain 0, then `suspend()` after 0.4 s fade) and `running ⇄ suspended` (tab hidden). `blocked` means `resume()` did not reach `running` (autoplay policy): the loader prompt then offers ENTER WITH SOUND (`resume()` called in the click handler). Public `getState()`, `subscribe(cb)` for `useSyncExternalStore`.
- Preference: `localStorage['ozone-sound']` = `on|off`. Explicit `off` is never overridden by load, scroll, visibility or any code path (only the user's toggle/choice writes it). No value = default on, attempt start, fall back to prompt. Storage failures are caught and treated as session-only.
- Toggle (`SoundToggle`) reads only `getState()`: shows ON only when `state==='running'` and master gain > 0; otherwise OFF. Buttons: `aria-pressed`, text + icon.
- Visibility: hidden → fade + suspend; visible → resume only if preference is not `off` and user had chosen on.
- API: `setCue(sceneIndex:number, direction:1|-1)` (fired by the `cue:sN` labels; `setCue(1,+1)` is called once at the loader hand-off since there is no `cue:s1` label; quantised to bar lines by the director), `setPlayhead(units:number, direction:1|-1)` (called from `master.ts` `onUpdate`, throttled to one call per animation frame; drives within-scene intensity and resume points, decision AU-1), `sfx(id:SfxId, {direction})` with per-id latch (once per boundary crossing per direction) and cooldown (ms table in audio module), `setEnabled(bool)`, `unlock()`, `dispose()` (stop scheduler, close context, remove listeners via `cleanup.ts`).
- Audio never gates anything: story and loader work with context absent/blocked. No audio before the user's choice on first visit unless the browser allows autoplay and the preference is not off (D1: autoplay is attempted at init; this overrides CREATIVE_DIRECTION §9's "no audio before the choice". If it succeeds, the internal loader event `loader:bloom` plays, AU-4.) Scheduling runs on a Worker-driven look-ahead clock per AUDIO_SPECIFICATION §4.
- iOS/Android real-device behaviour: NOT TESTED unless client tests.

## 7. SVG art system
- `src/art/defs/`: one `<svg width=0 height=0>` of shared `<defs>` mounted once: halftone patterns (pitch 6 px desktop, 4 px at 390 via CSS var on the pattern `patternTransform`), ink-edge filter (single `feTurbulence`+`feDisplacementMap`, used on ≤ 3 layers, baked to paths where heavy), shadow-plane gradients, palette colours as CSS vars.
- `src/art/rig/`: `Protagonist.tsx` renders `<symbol>` parts (head, hair, hoodie, arms, legs, backpack, headphones, 4 walk frames). `rig.config.ts` holds proportions in one object. `poses.ts` is the pose table (front, side, three-quarter, walk 1-4, stand, react, stride, window-pass) mapping each pose to part transforms; GSAP swaps pose by setting `data-pose` frames visible/hidden and tweening part transforms, never by React state. Scenes use `<use href="#rig-…">`, no redraws.
- `src/art/scenes/S1..S7.tsx`: each default-exported, loaded with `React.lazy`/dynamic import (S1+S2 in the loader item; S3..S7 idle after ENTER; S7 `Page7` last). Prerender includes all of them statically (SSR renders them eagerly) so no-JS is complete; on the client the lazy chunk hydrates identically (the prerendered DOM is kept; chunk only attaches data-layer refs, no re-render of art).
- Targeting: each animatable group carries `data-layer="s3-balloons"` (id from `layers.ts`) and `data-depth` (parallax multiplier for camera tweens). No class names used by GSAP, no inline style set by React on these nodes.
- Node budget: ≤ 2,500 live SVG nodes per scene (target 1,800 at 390), counted by a test (`document.querySelectorAll('svg *')` per scene region, stage nodes off-screen scenes removed from layout with `content-visibility:auto` and `display:none` via GSAP `autoAlpha` only while outside ±1 scene of the playhead). Layers use `will-change:transform` only on camera group and the 3 heaviest layers.

## 8. Performance budgets and measurement
| Metric | Budget | Method |
|---|---|---|
| LCP (lab, mobile emulation 390, 4x CPU throttle, Fast 4G) | ≤ 2.5 s | Playwright + `PerformanceObserver('largest-contentful-paint')`; Lighthouse median of 5; LCP = S1 h1 text (HTML, not JS) |
| CLS | ≤ 0.05 | `layout-shift` observer through full scroll + font swap |
| TBT | ≤ 200 ms | Lighthouse (lab) |
| INP | ≤ 200 ms (lab only) | Event Timing observer in Playwright over click/keypress on ENTER, toggle, skip |
| Initial JS (gz) | ≤ 180 KB | `scripts/bundle-report.mjs` gzips `dist/assets/*.js` loaded on first paint (react+gsap+ScrollTrigger ≈ 120 KB estimated; unverified until built) |
| First-load fonts | 112,152 B (budget 150 KB) | file sizes in `dist` |
| SVG nodes per scene | ≤ 2,500 | DOM count test |
| Scroll smoothness | no frame > 50 ms during scripted slow/fast scroll at 4x CPU throttle | rAF/`longtask` probe + filmstrip |
Lab results are not field results: there is no RUM, so real-user CWV are NOT TESTED; reports say "lab".

## 9. SEO, prerender, hosting, scripts
- Head: `<title>`, description, canonical (TODO: production URL not supplied; omitted until given), OG/Twitter text tags (no image until an original share image is made), `lang="en"`, theme-color `#101014`, `color-scheme`. No California claims; copy only from FACTS_AND_SOURCES.md.
- `check-prerender.mjs` greps `dist/index.html` for all 7 headlines (both lines), the OZONE ID line, "Sources", exactly one `<h1>`, and that no `vap`/`e-cig` strings exist.
- Headers (static host config is the client's/host's; supply `_headers` example): `Content-Security-Policy: default-src 'self'; style-src 'self' 'unsafe-inline'` (inline SVG style attrs; no third parties), `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, `Permissions-Policy: camera=(), microphone=(), geolocation=()`, long-cache immutable for `/assets/*` and `/fonts/*`. NOT TESTED against a real host.
- Scripts: `dev`, `typecheck` (`tsc --noEmit` + node config), `lint`, `build` (`tsc --noEmit && node scripts/build.mjs dist && node scripts/check-prerender.mjs`), `preview`, `report` (bundle/fonts), `test` (Playwright), `test:update-snapshots`.
- `playwright.config.ts` adapted from `demo/playwright.config.ts`: production build via `vite preview`, `PW_PORT` (default 4173) and `PW_OUT` (default `dist`) env, 1 worker, projects for the width matrix (320, 360, 375, 390, 414, 430, 768, 1024, 1280, 1440, 1920) plus a `reduced-motion` project (`reducedMotion:'reduce'`) and a `no-js` project (`javaScriptEnabled:false`); remove the SwiftShader launch args (no WebGL).
- Test plan = plan §4 (overflow, contrast, 44 px targets, zoom 200/400, axe at 390/768/1440, keyboard, loading failures, scroll/reverse/resize, claims overlap, listener counts, transition filmstrips, audio instrumentation).

## 10. Risks and mitigations
| Risk | Mitigation |
|---|---|
| Continuous camera over a 1,800-2,500-node SVG may drop frames on mid-range phones (unproven; no reference proof of this pattern) | Prototype t45 first (heaviest: eraser front + widest framing) with placeholder art at real node counts; filmstrip + long-frame probe at 390, 4x CPU throttle; budget cut-lines decided before more scenes are built: lower halftone density, bake filters, cull off-screen layers, reduce nodes. Real-device performance NOT TESTED without client devices. |
| t67 panel-page assembly (frame shrinks into panel 7, six `<use>` windows ink in) is the most complex single timeline | Build t67 as the second prototype; panels use `<use>` of already-mounted scene groups (no duplicated DOM); fall back to a simpler paper-rise + static panels if the filmstrip fails creative critique. |
| One master timeline is a single point of failure (one bug breaks all seven scenes) | try/catch init with graceful no-JS mode; claims-overlap assertion; per-scene sub-timeline unit tests built alone. |
| Prerender vs lazy art mismatch causes hydration warnings/layout shift | art rendered statically in SSR, lazy chunk only attaches refs; zero-console-error test; CLS test. |
| Fonts late shifting line wraps and label positions | metric-matched fallbacks (TYPOGRAPHY), `refresh()` after fonts, track heights from CSS not text. |
| Autoplay policies differ (Safari/iOS) | state machine + explicit prompt; Chromium policies emulated; iOS/Android NOT TESTED. |
| Initial JS budget | GSAP core + ScrollTrigger only, dynamic-import audio and scenes 3-7; bundle report gate in CI. |
| TypeScript 7 / Vite 8 toolchain drift | exact pins matching the demo's passing build. |

HANDOFF
- agent: frontend-engineer
- phase: T6 draft (Gate A document, no application code)
- summary: Wrote TECHNICAL_ARCHITECTURE.md covering all ten required sections: stack with checked versions and licences, not-added list, ownership map, property and timeline ownership, master timeline and matchMedia, no-JS mode, AssetLoader and AudioDirector contracts, SVG art system, budgets, SEO/hosting/scripts, risks.
- files_changed: /home/user/Claude-code-skill/showcase/ozone/studio/TECHNICAL_ARCHITECTURE.md
- verification: Versions and licences via npm view: PASS (gsap 3.15.1 and @gsap/react 2.1.2 use the GSAP "no charge" licence; react/react-dom 19.3.1 MIT; vite 8.3.8; plugin-react 6.3.0; typescript 7.0.2; playwright 1.65.1 latest vs 1.63.0 pinned; axe 4.14.0 MPL-2.0; both fonts 5.3.0 OFL-1.1). Build, typecheck, browser run: NOT TESTED (no code yet). Initial JS size estimate: unverified.
- open_issues: DESIGN_SPECIFICATION, ANIMATION_SPECIFICATION are templates and AUDIO_SPECIFICATION does not exist, so TODO links remain → ui-ux, gsap-animator, audio. Doc is about 125 lines of dense content (a few lines are long). CSP uses 'unsafe-inline' for styles → tech-lead to review. The tooling (dev server) for filmstrips is not set up → qa.
- decisions_needed: (1) Audio before choice: plan allows autoplay attempt on load, CREATIVE_DIRECTION §9 says no audio before the choice; tech-lead/audio to settle (I wrote the TODO). (2) Production URL for canonical and OG. (3) Whether to drop SplitText from the registry copy (I propose yes). (4) Keep Playwright 1.63.0 or move to 1.65.1.
- next_suggested: Gate A review by tech-lead; then prototype transition t45 and t67 with placeholder art at real node counts and filmstrip-measure before building remaining scenes.
