# Animation Specification — Penumbra — Light Atelier (demo)
_Owner: gsap-animator · Date: 2026-11-15 · Status: Phase 4 spec, for the integrator. gsap 3.15.1, Lenis 1.3.27, `@gsap/react` useGSAP._

Principle: headlines are **lit, not moved**. Light arrives and settles (dimmer ease); nothing bounces. Only `transform`, `opacity`, `clip-path` (and shader uniforms) are animated; never layout properties.

## Motion tokens
Source of truth: `src/motion/tokens.ts` (`motionTokens`). CSS must mirror it as custom properties on `:root` (`--dur-xs: .18s; --dur-s: .4s; --dur-m: .8s; --dur-l: 1.3s; --dur-xl: 2s;` and `--ease-dimmer: cubic-bezier(.32,0,.12,1)` for CSS-only hovers). Never hard-code durations in components; import `motionTokens`.

| Token | Value | Use |
|---|---|---|
| `dur.xs` | 0.18 s | hover/focus, row light |
| `dur.s` | 0.4 s | kickers/labels fade, UI state, counter swap |
| `dur.m` | 0.8 s | element reveals, word lighting (per word) |
| `dur.l` | 1.3 s | plate slits, section reveals |
| `dur.xl` | 2.0 s | hero shader `reveal` only |
| `ease.enter` = `dimmer` | CustomEase `M0,0 C0.32,0 0.12,1 1,1` | hero light, lit words, slits, Dim/Rise rise |
| `ease.reveal` | `expo.out` | other entrances (sub-line, CTA, underline) |
| `ease.exit` | `power2.in` | exits, page dim |
| `ease.morph` | `power3.inOut` | Flip reorder |
| `ease.scrub` | `none` | every scrubbed tween |
| `scrub` | 0.8 | Method |
| `stagger` | words .09 · lines .12 · cards .14 | |
| `gsap.defaults` | ease `dimmer`, duration `dur.m` (set in registry) | |

Additional literals defined in this spec (add to tokens.ts as `motionTokens.hour = { quick: 0.6, cross: 0.2 }`, `motionTokens.page = { dim: 0.45, rise: 0.7 }`): hour smoothing 0.6 s, reduced-motion crossfade 0.2 s, page dim 0.45 s, page rise 0.7 s.
Note: CREATIVE_DIRECTION says Lenis lerp ≈ 0.09; SmoothScroll.tsx uses 0.1. Keep 0.1 (imperceptible difference); do not change.

## Global systems
### Scroll
Unchanged `SmoothScroll.tsx`: one Lenis (`autoRaf:false`, `lerp:0.1`, `smoothWheel:true`, `syncTouch:false`), `lenis.on('scroll', ScrollTrigger.update)`, `gsap.ticker.add(t => lenis.raf(t*1000))`, `lagSmoothing(0)`. No other scroll loop, no `ScrollTrigger.scrollerProxy` (Lenis scrolls the window). Lenis honours `prefers-reduced-motion` itself (native scroll). Parallax: none planned except S5 plates may translate `yPercent` ±4 (≤ 8% rule) on a scrubbed `ease:'none'` tween, desktop only, inner `<img>/canvas` wrapper, never text; optional, drop first if perf budget is tight.

### Responsive / reduced-motion split (one `gsap.matchMedia()` per section hook)
```
const mm = gsap.matchMedia();
mm.add({
  desktop: '(min-width: 64rem) and (prefers-reduced-motion: no-preference)',
  mobile:  '(max-width: 63.999rem) and (prefers-reduced-motion: no-preference)',
  reduce:  '(prefers-reduced-motion: reduce)',
}, (ctx) => { const { desktop, mobile, reduce } = ctx.conditions; ... });
```
Create inside `useGSAP(() => {...}, { scope: sectionRef })`; the hook's context reverts it on unmount. Conditions re-evaluate on change (OS toggle, resize across 64rem) and reverts/rebuilds that branch only. `reduce` branch never creates a ScrollTrigger except where stated "once" (and even those render final state with no tween).

### Reduced-motion policy (global)
- `prefersReducedMotion()` from tokens.ts for imperative code (Router, slider); `matchMedia` condition `reduce` for GSAP code. No pin, no scrub, no stagger, no shader intro.
- Headlines and manifesto: rendered fully lit (final CSS state), SplitText not created. Plates visible immediately; where an entrance remains, it is `opacity 0→1` over 0.2 s, no clip-path.
- Hero shader: `reveal` set to 1 immediately (single static frame / poster). The Hour: full function, state jumps with a 0.2 s crossfade. Page transition: 0.2 s opacity crossfade.
- Initial state rule: any element hidden for an entrance must be hidden by GSAP (`gsap.set`/`from`) inside the `no-preference` branch only, so no-JS and reduced users see final content (H1 is the LCP and server-rendered visible).

### Page transition "Dim / Rise" (≤ 1.2 s) on the existing Router veil
Change `Router.tsx` veil animation, keep its contract (lock scroll → swap → refresh → focus h1). `.route-veil` becomes a full-viewport `background: var(--ground)` layer (fixed, `pointer-events:none` except while transitioning, `will-change: opacity` only while transitioning).
1. Exit "Dim" (replaces current clip-path fromTo): `gsap.fromTo(veil, { opacity: 0 }, { opacity: 1, duration: 0.45, ease: 'power2.in' })`.
2. Swap route; layout effect unchanged (scroll to 0/restored y, `ScrollTrigger.refresh()` in rAF).
3. Enter "Rise" (replaces clip-path out): `gsap.to(veil, { opacity: 0, duration: 0.7, ease: 'dimmer', onComplete: done })`. Total 1.15 s. On `done`: `setTransitioning(false)`, focus `main h1` when `y===0`.
4. Back/forward runs the same two steps (restored y); "reverse" is satisfied by identical dim/rise. Detail route's own entrance (hero light rise, title words) starts at the beginning of step 3 (see Detail).
5. Reduced: `fromTo opacity 0→1` 0.2 s, swap, `to opacity 0` 0.2 s, ease `none`.
Remove the clip-path veil CSS (`inset(...)`) so only opacity animates.

### Setup rules
- `import { gsap, ScrollTrigger, SplitText, Flip, useGSAP } from '../motion/registry'` only.
- After fonts load: `document.fonts.ready.then(() => ScrollTrigger.refresh())` once in the Home component's `useGSAP` (SplitText `autoSplit` also re-splits on font load, see S1).
- Fixed vertical stack height of the pinned Method section must not depend on webfonts (set `min-height:100svh` on the pin panel).

## Per-section choreography
All reveals `once: true` unless noted. Shared helper `litWords(el, opts)` in `src/motion/lit.ts` (see S1) used by S1, S2 (lines), Detail.

### S1 · Threshold (hero) — load
- Purpose: stepping into a dark room; light settles while the words are lit.
- Trigger: on load (after `document.fonts.ready` and shader ready; if shader not ready at 600 ms, start text anyway and fade shader in).
- Shader: `const u = { reveal: 0 }`; `gsap.to(u, { reveal: 1, duration: motionTokens.dur.xl /*2.0*/, ease: 'dimmer', onUpdate: () => renderer.setUniform('reveal', u.reveal) })`, at t=0. Renderer never renders faster than rAF; stop on `onComplete` if static.
- H1 words: `SplitText.create(h1, { type: 'words', aria: 'auto', autoSplit: true, onSplit: (self) => gsap.fromTo(self.words, { opacity: 0.08, color: 'var(--ink-muted)', y: 4 }, { opacity: 1, color: 'var(--ink)', y: 0, duration: 0.8, ease: 'dimmer', stagger: 0.09 }) })` (returning the tween makes autoSplit revert/re-sync progress on re-split). Starts at t=0.35 s (as the shaft begins to catch the wall); the last of 5 words lands at 0.35 + 4·0.09 + 0.8 = 1.51 s, inside the 2.0 s rise. `aria:'auto'` keeps the accessible name intact (d.ts `SplitText.Vars.aria?: "auto"|"hidden"|"none"`, line 82). Words are `display:inline-block`; use `wordsClass:'w'`. Do not use `mask` for the H1 (no sliding).
- Sub-line + CTA: at t=1.1 s (label `"sub"`): kicker and sub-line `opacity 0→1`, `duration: 0.8` (dur.m), `ease:'expo.out'`, no y; CTA at `"sub+=0.25"`, same tween (opacity only; the warm underline of the CTA is CSS `scaleX` on hover, 0.18 s).
- Mobile variant: identical timing; shader renders at ≤1× DPR (renderer concern).
- Reduced-motion: no SplitText, final colours, `reveal=1`.
- Perf: opacity/colour on ≤5 spans (colour is paint-only, tiny text; acceptable), shader uniform tween. `will-change: opacity` on words removed in `onComplete`. 0 ScrollTriggers.

### S2 · Manifesto — enter once, no scrub
- Purpose: stillness; the paragraph is lit by line as the reader arrives.
- Trigger: `ScrollTrigger.create({ trigger: p, start: 'top 75%', once: true })`.
- Split: `SplitText.create(p, { type: 'lines', autoSplit: true, linesClass: 'ln', aria: 'auto', onSplit })` (`autoSplit` required so lines recompute on resize/font load). `onSplit` returns `gsap.fromTo(self.lines, { opacity: 0.08, color: 'var(--ink-muted)' }, { opacity: 1, color: 'var(--ink)', duration: 0.8, ease: 'dimmer', stagger: 0.12, scrollTrigger: {...above}, })`. No y-motion.
- Underline "where darkness must stay": the phrase is wrapped in `<span class="uline">` in the markup (survives the split; SplitText handles nested elements). CSS: `background: linear-gradient(var(--accent-warm),var(--accent-warm)) 0 100%/0% 1px no-repeat; box-decoration-break: clone` (wraps correctly across lines). Tween on the same timeline, after the lines: `tl.to(uline, { backgroundSize: '100% 1px', duration: 1.3 /*dur.l*/, ease: 'dimmer' }, '>-0.2')`. Paint-only on one span; accepted.
- Mobile: same. Reduced: lines lit, underline at 100%, no ScrollTrigger.
- Perf: 1 ScrollTrigger (once, auto-killed).

### S3 · Method: Dark first — pinned, scrubbed (centrepiece)
Markup contract: `<section data-method>` > `.method__pin` (100svh, grid: left text column, right drawing) containing the counter `[data-counter]` (`01/03` as two spans: current + `/03`), three step blocks `[data-step="1|2|3"]` (stacked in the same grid cell, `position:absolute` inset 0 within the column, all but step 1 start `opacity:0`), the closing line `[data-closing]`, and one `<MethodDrawing step={n} />` SVG. Inside the live SVG, grouped layers: `[data-layer="room"]` (hairline section, always visible), `[data-layer="flood"]` (rect fill `--ground` at 0), `[data-layer="hatch"]` (3 hatch zones, each with a mono label `[data-label]`), `[data-layer="beam"]` ×3 (`[data-beam="altar|threshold|niche"]`, polygon wedge with `clip-path: polygon()`-style via SVG `<clipPath>` per wedge + gradient fill; label per beam), `[data-layer="cct"]` (band `<rect>` + sweeping marker `[data-cct-marker]` + tick labels 2200/5600/2200 K).
Skip link: `<a href="#the-hour" class="skip">Skip method</a>` is the first focusable element inside `[data-method]`'s preceding sibling (before the pin), visible on focus; uses the existing anchor handler (focus moves to #the-hour).

ScrollTrigger (one, desktop and mobile variants inside the `matchMedia` `desktop`/`mobile` branches):
```
const tl = gsap.timeline({
  defaults: { ease: 'none' },
  scrollTrigger: {
    trigger: '[data-method]',
    start: 'top top',
    end: desktop ? '+=300%' : '+=200%',   // 3 × viewport / 2 × viewport of scroll
    pin: '.method__pin',                  // pin the inner panel; section keeps its height via pinSpacing
    pinSpacing: true,
    scrub: 0.8,
    anticipatePin: 1,
    invalidateOnRefresh: true,
    snap: false,                          // no snapping (native/Lenis feel)
  },
});
```
Timeline length is 12 units (1 unit = ⅟₁₂ of the scroll distance; scrub makes durations proportional, not seconds). Labels and contents:

| Position | Label | Action |
|---|---|---|
| 0 | `s1` | counter shows `01`; step1 text visible (already). `drawing room` visible. |
| 0 → 1.5 | | `[flood]` opacity 0→0.82 (dark flood), 1.5 long. |
| 1 → 3 | | `[hatch]` zones: opacity 0→1 staggered 0.5 apart (`stagger: 0.5`), each hatch `scaleX` not needed; labels `[data-label]` opacity 0→1 at the same positions +0.3 (`NAVE · ≤ 2 lux` etc.). |
| 3.6 → 4.0 | `s2` | swap: step1 `opacity 1→0` (0.4), counter number `01→02` (see counter below), step2 `opacity 0→1` at 4.0 (0.4). Hatch/flood stay. |
| 4.2 → 8 | | beams cast one by one: `beam[altar]` at 4.4, `beam[threshold]` at 5.6, `beam[niche]` at 6.8, each 1.0 long: `clipPath` from `inset(0 0 100% 0)` (rooted at the fixture, apex top) to `inset(0 0 0% 0)` plus `opacity 0→1`; its label fades in at +0.6 (`12° · 40 lux`). Beam fill = `--accent-warm`. |
| 7.6 → 8.0 | `s3` | swap: step2 out, counter `02→03`, step3 in at 8.0. |
| 8.0 → 11.0 | | CCT band: band `opacity 0→1` over 0.6, then marker `x` from 0% to 100% across 2.4 (`xPercent`/`x` on the marker, ease none). During the sweep, beams re-tint with a nested scrubbed tween `gsap.to(beamFills, { attr?: no → use CSS var })`: animate a proxy `{k:0}` 0→1 over 8.2→11.0 with `onUpdate` setting `--beam-tint` on the SVG root through `gsap.utils.interpolate(['#d9a05b','#9db4c6','#d9a05b'], k)` (warm 2200 K → cool 5600 K → warm); beams use `fill: var(--beam-tint)`. (`onUpdate` writing one CSS variable per frame, accepted: ≤3 small shapes.) |
| 11.0 → 12 | `close` | `[data-closing]` ("Every hour has its own light.") opacity 0→1 (0.6), step3 text stays. Final 0.5 unit is a rest so the pin releases after the line is readable. |

Counter swap (inside the timeline, scrub-safe): two stacked number spans per digit; at each swap position `tl.to(counterOld,{yPercent:-40,opacity:0,duration:.4}).fromTo(counterNew,{yPercent:40,opacity:0},{yPercent:0,opacity:1,duration:.4})` (≤ 40% y, tiny mono text). Counter is `aria-hidden`; a visually hidden `aria-live="off"` region is not used (step text is readable in order in the DOM).
Step text contrast: step blocks are real DOM text, in source order 1,2,3; inactive ones get `aria-hidden` via a `onUpdate` that toggles by progress (`tl.progress()` thresholds 3.8/12, 7.8/12) so screen readers hear only the active one; in the reduced-motion render all three are exposed.
Mobile (`max-width:63.999rem`): same timeline with `end:'+=200%'`; drawing sits above text (CSS), beams cast at 3.6/4.8/6.0 spacing (use a `scale = desktop?1:0.85` factor on positions 4.4–6.8 only) so the whole run fits 2 viewports; `ScrollTrigger.config({ignoreMobileResize:true})` already set; no `normalizeScroll`.
Reduced motion (`reduce`): **no ScrollTrigger, no pin.** DOM strategy: `<MethodDrawing step={1|2|3} />` is one component rendering the SVG in the *final state of that step* purely from props (step 1: flood+hatch+labels; step 2: step 1 + 3 beams + labels; step 3: step 2 + CCT band + tinted beams at 2700 K); the animated version is the same component rendered once with `step={3}` plus the data-layer hooks above, and layers hidden by GSAP at timeline build. The `Method` component reads `useReducedMotion()` (a `matchMedia` hook) and, when true, renders three `<article>`s each containing the step text, counter `0N/03` as plain text, and a `<MethodDrawing step={n} />`, then the closing line. Not `display:none` toggling: three real copies, so the DOM differs between modes and nothing is pinned. Switching the OS setting live re-renders; the `matchMedia` branch reverts the pin.
Perf: 1 ScrollTrigger, 1 pin; animated properties opacity, clip-path, transform, one CSS variable; SVG ≤ ~120 nodes; promote only the three beam groups (`will-change: opacity, clip-path` set in `onStart`, cleared in `onComplete`/`onReverseComplete`).

### S4 · The Hour — interaction only (no ScrollTrigger)
- State: `minutes` (0–1439) is the single source of truth; the slider `<input type="range" min=0 max=1439 step=15>` is native; presets are buttons.
- Slider input: `const q = gsap.quickTo(state, 'minutes', { duration: 0.6, ease: 'power3.out' })` on a plain object `state = { minutes }`; on every `input` event call `q(value)`; a `gsap.ticker`-free `onUpdate` is not available on quickTo, so the renderer reads `state.minutes` each rAF frame and the readout (time, K, lux) is computed from it, text updated only when the rounded displayed value changes. The thumb position itself follows the native input immediately (never smoothed).
- Presets (06:10, 10:00, 13:30, 18:20, 21:00, 00:00): `gsap.to(state, { minutes: target, duration: 1.3 /*dur.l*/, ease: 'power3.inOut', overwrite: true, modifiers: { minutes: wrap24 } })` where `target` is computed along the **shortest path around 24 h**: `d = ((t - cur + 720) % 1440) - 720; target = cur + d` (may leave 0–1439; `wrap24 = v => ((v % 1440) + 1440) % 1440`). Update the slider `value` in the tween's `onUpdate` with `wrap24(state.minutes)`. A user `input` event during a preset kills that tween (`gsap.killTweensOf(state)`), and quickTo takes over from the current value (also shortest-path-wrap before starting).
- Announce: `aria-live="polite"` region contains only the intent line. Update its text on `change` (slider release/keyboard step end, fired by native `change`) and when a preset tween's `onComplete` fires; never on `input`. Debounce keyboard repeat to 400 ms.
- Reduced motion: `quickTo` and preset tweens replaced by direct assignment (`state.minutes = value`); the renderer crossfades between the old and new frame over 0.2 s (`gsap.fromTo(canvasCover, {opacity:0},{opacity:1,duration:0.2,ease:'none'})` with a snapshot of the previous frame, or a CSS opacity transition if using the 6 poster stills fallback). Readout and aria-live behave identically.
- Mobile: same; keep the slider track ≥ 44 px hit height (CSS).
- Perf: no ScrollTrigger; renderer pauses off-screen (`IntersectionObserver`) and on `visibilitychange` (renderer's job). The tweened object is not a DOM node; zero layout.
- Cleanup: tweens created in `useGSAP({ scope })` or via `contextSafe` for event handlers so unmount kills them.

### S5 · Four rooms — enter once per plate
- Trigger per plate: `ScrollTrigger.create({ trigger: plate, start: 'top 80%', once: true })` (4 triggers) driving a timeline `tl.paused` played in `onEnter`.
- Plate (door opening): `gsap.fromTo(plate, { clipPath: 'inset(0 50% 0 50%)' }, { clipPath: 'inset(0 0% 0 0%)', duration: 1.3, ease: 'dimmer' })`; the inner media starts `scale 1.04` → `1` over the same duration, `ease:'dimmer'` (transform only).
- Text lit after: name, meta, intent, spec strip lit with `opacity 0.08 → 1`, colour `--ink-muted → --ink` for the name only, `duration: 0.8`, `stagger: 0.14`, label `"+=-0.5"` relative to the slit end (i.e. starts at 0.8 s into the slit). Words/lines not split here (blocks only).
- Mobile: same timing, `start: 'top 88%'`. Reduced: final state; if needed `opacity 0→1` over 0.2 s via the same triggers (once).
- Initial state: `clip-path` set inside the `no-preference` branch only. The plate link remains focusable throughout (clip-path does not affect focusability).
- Perf: clip-path on 4 large elements, one at a time; `will-change: clip-path` during the tween only.

### S6 · Index (lighting schedule) — filter with Flip
- Trigger: chip click/Enter (buttons with `aria-pressed`).
- Flow (desktop and mobile): `const state = Flip.getState(rows, { props: 'opacity' })`; apply the filter by toggling `hidden`/`data-hidden` on non-matching rows (React state commit, `useLayoutEffect`/`flushSync`), then `Flip.from(state, { duration: 0.6, ease: 'power3.inOut', absolute: false, nested: false, onEnter: els => gsap.fromTo(els, { opacity: 0 }, { opacity: 1, duration: 0.4 /*dur.s*/, delay: 0.2 }), onLeave: els => gsap.to(els, { opacity: 0, duration: 0.4, ease: 'power2.in' }) })`. Removed rows stay in flow until `onLeave` completes (hide in its `onComplete`), so Flip measures survivors correctly. `overwrite`: kill the previous Flip (`Flip.killFlipsOf(rows)`) before starting a new one. Total ≤ 0.6 s (leave 0.4 s runs in parallel with the 0.6 s move).
- Row hover/focus light: CSS only (`transition: background-color var(--dur-xs)`), thumbnail opacity ≤ `--dur-s`.
- After completion: `ScrollTrigger.refresh()` once (page height changed, S7/S8 triggers below shift).
- Reduced: toggle rows instantly, no Flip (`Flip.from` skipped), 0.2 s opacity on newly shown rows optional.
- Announce: a `role="status"` line "N projects" updates after the filter commit.
- Perf: Flip on ≤ 12 rows, transform/opacity only; no ScrollTrigger.

### S7 · Atelier — plate reveals
Three small plates, same recipe as S5 (door-opening slit, `dur.l`, `dimmer`) with `stagger: 0.14` (`dur.cards`) via one trigger on the plate row (`start: 'top 80%'`, `once`); the single display line is lit by line (as S2, no underline) when it enters at `top 80%`. Reduced/mobile as S5. 2 ScrollTriggers.

### S8 · Contact — static
No animation. The warm pool is a static radial gradient. CTA hover/focus: CSS `--dur-xs`. 0 ScrollTriggers.

### Detail route `/work/:slug`
- Trigger: on mount; the veil is still opaque until Router's Rise step begins, so the timeline starts at the same moment as Rise (both 0.7 s, dimmer).
- Timeline (at mount): hero plate `gsap.fromTo(heroPlate, { opacity: 0 }, { opacity: 1, duration: 0.7, ease: 'dimmer' })` plus media `scale 1.03 → 1` over 1.3 (this is the "light rises"; a `brightness()` filter is not used). Title: `SplitText type:'words'` lit exactly like the H1 (stagger 0.09), starting at `0.25`; meta/kickers fade `dur.s` at `0.9`.
- Below the fold: hour strip + drawings band + next/prev reuse S5 plate recipe once-triggers (strip stills `opacity 0→1` 0.4 s stagger 0.14, no clip).
- Reduced: everything final; only the Router 0.2 s crossfade.
- Cleanup on exit: hook scope reverts all of the above.

## Plugins used
| Plugin | Where | Notes |
|---|---|---|
| ScrollTrigger | S2, S3, S5, S7, Detail, Router refresh | `once:true` except S3 |
| SplitText | S1 (words), S2/S7 (lines), Detail (words) | `autoSplit`, `onSplit` returning the tween, `aria:'auto'` (`split-text.d.ts` `SplitText.Vars`, lines 76–92); `mask` not used (lit, not moved) |
| CustomEase | `dimmer` (registered in registry) | |
| Flip | S6 | |
| Draggable / InertiaPlugin | not used in this build | registered but tree-shaken; remove from registry if the bundle report asks |
| `gsap.quickTo`, `gsap.matchMedia`, `useGSAP` | S4 / all / all | core |

## Performance notes
- Animated properties: `transform`, `opacity`, `clip-path`, shader uniforms; exceptions that are paint-only and tiny: `color` on lit text spans, `background-size` on the one underline span, one CSS variable on the Method SVG.
- ScrollTrigger inventory on Home (desktop, motion on): S2 ×1, S3 ×1 (+pin), S5 ×4, S7 ×2 = **8**; mobile same; reduced-motion = **0**. Detail route: ≤ 3. No ScrollTrigger on S1, S4, S6, S8. Fixed header: none.
- Only the Method pins. No nested ScrollTriggers (triggers sit on the timeline's `scrollTrigger` vars, not child tweens, in S3).
- `ScrollTrigger.config({ ignoreMobileResize: true })` already registered. Call `ScrollTrigger.refresh()` after: fonts ready, S6 filter completion, route layout (Router does it).
- `document.fonts.ready.then(() => ScrollTrigger.refresh())` in Home's `useGSAP`; SplitText `autoSplit` re-splits on font load itself.
- `will-change` only during tweens. Max 3 promoted layers at once (Method beams); hero shader canvas is one.
- No `ScrollTrigger.batch`, no `normalizeScroll`, no scroller proxy.

## Cleanup rules (testable)
1. Every section component uses `useGSAP(() => {...}, { scope: sectionRef, dependencies: [] })`; every tween, ScrollTrigger, SplitText, `matchMedia` and Flip made inside is reverted on unmount. Event-handler tweens use `contextSafe`.
2. SplitText is created inside the hook so the context reverts it (DOM restored to original text); never keep module-level SplitText instances.
3. No `ScrollTrigger.create` outside a hook scope; no global `ScrollTrigger.killAll()`.
4. Acceptance test: `ScrollTrigger.getAll().length` is 0 on the detail route before its own triggers mount (baseline), returns to the same baseline after Home → Detail → Home, and equals the inventory above on Home; also `gsap.globalTimeline.getChildren(false).length` returns to baseline once idle. Expose both in `?debug` (`window.__gsapStats`).
5. Lenis: single instance; route changes use the existing `lock()` and `scrollTo(...,{immediate})`; the pinned Method is reverted before `ScrollTrigger.refresh()` on the new route (guaranteed by unmounting).
6. WebGL renderer disposes on unmount (context lost, rAF cancelled); S1 and S4 tweens targeting uniform objects are killed with their scope.
