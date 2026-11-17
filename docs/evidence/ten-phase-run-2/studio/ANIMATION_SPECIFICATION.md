# Animation Specification - Halde
_Owner: gsap-animator · Phase 4 · Date: 2026-11-17 · Stack: ./vendor gsap 3.15.1 + ScrollTrigger + Lenis 1.3.27 (globals), vanilla, no build, no CustomEase/SplitText_
## Architecture
- main.js order: SCROLL block (lenis-scroll) FIRST: `new Lenis({lerp:.1})`, `lenis.on('scroll',ScrollTrigger.update)`, `gsap.ticker.add(t=>lenis.raf(t*1000))`, `gsap.ticker.lagSmoothing(0)`. Then MOTION block (this spec): `gsap.registerPlugin(ScrollTrigger)` once, one `gsap.matchMedia()`. Never a second scroll loop. Nav `aria-current` = IntersectionObserver in SCROLL block (not a ScrollTrigger).
- Motion block must not assume Lenis exists (reduced branch has none). Refresh: `window.load` then `ScrollTrigger.refresh()` (no webfonts, so no font refresh); `invalidateOnRefresh:true` on the scrub.
## Tokens
| Token | Value | Use |
|---|---|---|
| dur-xs / s / m / l | 0.2 / 0.4 / 0.7 / 0.9 s | hover / mobile fade / reveal / plate fade-in |
| ease | `power2.out` (signature, no overshoot); scrub segments `power2.inOut`; hover `cubic-bezier(.22,.61,.36,1)` | all |
| stagger | 0.08 s | reading order |
| reveal | opacity 0>1, y 16px>0 | `[data-reveal]` |
## Opening (no loader, no gate)
Timeline `t0`: eyebrow 0, lede .16 (y-only 16, opacity 1; eyebrow alone fades+y16, 0.7s). **h1 (the LCP element) and CTA are y-only: h1 y 16>0 at .08, CTA y 8>0, opacity never below 1** (text always painted, email legible). QA checks the filmstrip for a visible>hidden flash on hero text; if one appears, eyebrow and lede become y-only too. HTML+CSS show everything final (no-JS = final); JS sets start states in the motion branch only. Plate (>=1024) fades .6>1 over 0.9s at 0.2s, already in its p=0 pose. Readable ~0.3-0.5s, settled <=1.0s (target <=1.5s). Same on return visits.
## Story beats: "centring" scrub (>=1024)
One timeline, trigger `.steps`, start "top 70%", end "bottom 75%" (glazed plate finishes whole, before it scrolls under the header), `scrub:0.5`, no pin, `invalidateOnRefresh`. p = scrub progress. Targets are the plate's CHILDREN only; `[data-plate]` never moves (sticky). Pose p0: `.plate__rings` xPercent 3, yPercent -1.5 (visibly off-centre inside the rim), `--ring-blur` 1px; glaze scale .15, opacity 0.
| p (scroll %) | Step text in view | Plate state | Tween (position on timeline of 1.0) |
|---|---|---|---|
| 0-10 | 01 Taste arrives from below | rings off-centre, full offset | hold |
| 10-33 | 01 Taste centred in viewport | rings x 3>~2%, blur 1>.7 | 0.0-0.66 rings xPercent/yPercent + blur (two tweens, same position), `power2.inOut` |
| 33-66 | 02 Throw | rings x ~2>0, blur ~.7>0 (trued on the wheel) | same tweens, mid-run |
| 55-80 | 02 leaves, 03 Glaze enters | rings true at p=.66 | glaze starts .55 |
| 80-100 | 03 Glaze centred, contact enters | glaze pool grown to scale 1, opacity 1, then holds sticky into contact | `.plate__glaze` scale .15>1 + opacity 0>1, 0.55-1.0, `power1.inOut`; hold at end |
Plate is true *before* the glaze fills: first the clay is centred, then glazed (glaze fills while 03 is centred).
**Custom props**: `--glaze-angle`/`@property` retired (DECISIONS). CSS: glaze = feathered radial pool, scale 1 / opacity 1 by default (no-JS = glazed). `--ring-blur` (`@property`, `<length>`, inherits:false) is tweened on `.plate__rings`, never on `.plate`. Only transform/opacity/one blur prop; no `CSS.supports` guard.
## Per-section
- **Hero**: load timeline above. Mobile: same text reveals, plate static, true.
- **Steps**: each `[data-step]` own ScrollTrigger (`start:"top 80%"`, `once:true`, `toggleActions:"play none none none"`); children `.step__n`, h3, p `[data-reveal]` 0.7s, stagger .08. Hairline rule never animates. Mobile: dur-s (0.4s), y 12.
- **Contact**: one trigger "top 80%" once: h2 then CTA, 0.7s stagger .08 (CTA y only, opacity stays 1). Email never moves after landing.
- **Header/footer/links**: no GSAP; CSS hover 200ms (design spec s6).
## matchMedia branches
1. `(min-width:1024px) and (prefers-reduced-motion:no-preference)`: Lenis + hero timeline + step/contact reveals + scrub. 5 ScrollTriggers (scrub, 3 steps, contact).
2. `(max-width:1023px) and (prefers-reduced-motion:no-preference)`: Lenis (native touch, `syncTouch:false`) + hero text timeline + reveals, plate untouched (static, true, glazed). 4 ScrollTriggers.
3. `(prefers-reduced-motion:reduce)`: nothing created; no Lenis (SCROLL block checks same query and skips init), `ScrollTrigger.getAll().length===0`, no inline transforms or opacity. CSS state is final. Anchor jumps are instant. Live switch: matchMedia reverts all tweens and clears inline props.
## Performance
- Animate transform/opacity only, plus `--ring-blur` on the single plate subtree (one repaint-layer; blur max 1px, no filter on large text). No layout properties anywhere. Cache nothing layout-reading inside onUpdate.
- `will-change: transform` on rings and glaze set in JS in branch 1 only, removed at scrub `onLeave`/`onEnterBack` toggle; never in CSS, never on text. `gsap.set(clearProps)` after one-shot reveals via `onComplete`.
- Plate reserved with aspect-ratio (CLS 0). Pointer-only hover; no cursor effects.
## QA assertions (Playwright)
Desktop 1440: `.plate__rings` translate x at scroll 0 (~3% of rings width) vs end of `.steps` (0); `.plate__glaze` transform scale ~.15/opacity 0 at p0 > scale 1/opacity 1 at end, partial at p~.8; plate `[data-plate]` has no transform; CTA opacity=1 at t=0 and h1 opacity=1 in every filmstrip frame; JS disabled shows final state; trigger counts 5/4/0 above, **taken at load before scrolling** (`once:true` triggers self-remove, so counts drop after scrolling); filmstrip against the beat table; resize 1440>768 leaves no stale transform on plate; reduced run: no `style` attribute on plate or `[data-reveal]`.
