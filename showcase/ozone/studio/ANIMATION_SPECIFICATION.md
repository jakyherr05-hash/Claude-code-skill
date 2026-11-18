# Animation Specification — OZONE — "Your Ink"
_Owner: gsap-animator · Date: 2026-11-18 (T5) · Inputs: CREATIVE_DIRECTION §5/§6/§8, DESIGN_SPECIFICATION §1.1/§6.4/§10.6, TECHNICAL_ARCHITECTURE §3/§5, TYPOGRAPHY_SYSTEM, DECISIONS D1–D5. No code in this file. Verified: gsap 3.15.1 (Standard no-charge licence), plugins used: ScrollTrigger + CustomEase only (D2: no SplitText)._

## 1 · Motion tokens
**Timeline unit.** 1 unit = 1vh (1svh at the S rig) of scroll distance, so master duration = scroll budget (desktop 1210, 390: 1010). Scrub distance = budget exactly, therefore the track must be `budget + 100svh` tall (stage is sticky inside it). TECHNICAL_ARCHITECTURE §3 says `--track-h` = 1210vh: **frontend must add the 100svh**. Scroll-driven tweens use units, never seconds. Seconds exist only in the loader, idle loops and hand-off.
| Token | Value | Use |
|---|---|---|
| `--dur-xs / s / m / l / xl` | 0.12 / 0.2 / 0.3 / 0.7 / 1.5 s | xs hover/focus ring; s reduced-motion fade (≤200 ms cap); m prompt un-ink; l headline ink at hand-off; xl score fade-in |
| `ink` (CustomEase) | `M0,0 C0.22,0 0.14,1 1,1` | Signature. Wet-ink: a slow bloom at the nib, a quick stroke, a long soft settle. For every ink-in (headline masks, stroke-dashoffset draws, panel borders, wordmark, loader strokes). Tune by filmstrip, keep the name. |
| `cam` | `power2.inOut` | Camera moves inside a transition (zero velocity at both ends, so holds feel still). |
| `lift` | `power3.in` | Outgoing planes leaving (accelerate away, never ease into a stop). |
| `settle` | `power2.out` | Beam stop, card lift, paper rise. |
| `none` | linear | Master default, walk cycle distance, hold drift, tally scratches. |
| Windows | line 1 ink = 70–88 % of the incoming transition, line 2 = 85–100 %; hold drift = 2.5 % scale + 1 % x, linear | DESIGN §6.4 / CD §6 |
| Idle | breath 4 s loop (chest/shoulders 1.5 %), blink every 4–7 s, lamp shimmer; **stop 5 s after a hold begins, resume on next scroll** (WCAG 2.2.2) | Hold life only |
**Scrub smoothing: `scrub: 0.5` on fine pointers, `scrub: true` on `(pointer:coarse)`.** Why: a mouse wheel arrives in discrete 100 px steps, which would step the camera like a flipbook; 0.5 s of catch-up turns steps into a glide and is short enough that picture and scroll bar never disagree (all state is a pure function of the lagging playhead, so it is always coherent). Touch scrolling already has native momentum, and lag against a finger reads as drag. Not larger: a camera still travelling after the user stops would blur the "hold lands on text" contract. Re-check by wheel-sampling (§7). SFX and `setCue` read the playhead, not the scroll position.

## 2 · Global systems
- **Scroll:** native only. No Lenis, no ScrollSmoother, no `scroll-behavior:smooth` on `html` (it would fight scrub). Anchor jumps (`#scene-n`, "Skip to the message") use instant `scrollTo` to the hold start; focus moves to the heading.
- **Structure:** one sticky stage, one `gsap.timeline({paused:true, defaults:{ease:'none'}})` per matchMedia branch, one `ScrollTrigger` (`trigger: track, start:'top top', end:'+=budget', scrub, animation: master, invalidateOnRefresh:true`, **no `pin`**: CSS sticky does the pinning, so there are no pin-spacers and no nested pins). Camera values are functions of the stage size, so refresh re-evaluates them.
- **Labels (units, desktop / 390):** `s1` 0/0 · `t12` 50/40 · `s2` 150/120 · `t23` 220/180 · `s3` 310/250 · `t34` 400/330 · `s4` 510/420 · `t45` 640/540 · `s5` 790/660 · `t56` 860/720 · `s6` 970/810 · `t67` 1060/890 · end 1210/1010. Rig M uses the desktop table; **rig P = desktop × 0.9 rounded to 5 (proposal, not in CD; creative-director to confirm)**. Position inside a transition is written as % of its span: `at = label + pct × span`.
- **Page transitions:** none (one route). **Reduced motion:** §6 of this file; no master, no ScrollTrigger.
- **One-shot pieces** (everything else is scrubbed): loader, idle loops, hand-off timeline, footstep-frame callbacks. Every "swap" inside the master is `tl.set()` at a position, which GSAP reverses when the playhead goes back, so reverse is symmetric by construction.
- **No flashing:** headlight glare (t23, t34) ramps over ≥ 40 units; no >25 % luminance change more than once per second.

## 3 · Opening
- First readable content: S1 h1 is prerendered HTML and **is the LCP element**; it is visible text behind the loader dialog from first paint (loader overlay does not hide it from the LCP candidate computation; hidden state is CSS `html.js-loading` on the art only). Story-mode intro adds light (bulb), depth (ink formation), identity (wordmark) and the protagonist; first visit ≈ 3.3 s to the sound prompt, then ≈ 1.0 s hand-off. Returning visitor ≤ 1 s. See §5.

## 4 · Story-beat table
Ranges: desktop vh / 390 svh. Camera scale (S1 = 1) is the L-rig value; each rig stores its own x/y/scale per hold in `camera.ts rigs[]` from the art agent's world map (CD §4 framing table): P = L framing with S1 25 % closer, S = chest/face-led crops. Scale ratios between holds are identical in every rig.
| Beat | Range | Picture | Words (legible window) | Camera | Teen | Mobile expression | Reduced motion (static comic) |
|---|---|---|---|---|---|---|---|
| s1 | 0–50 / 0–40 | School corner, dusk, lamp | S1 l1+l2 inked at hand-off, hold | 1.04 → 1.0 drift | stand, ¾ right, headphones on neck, curious; breath | waist-up, headline top third | S1 frame complete |
| t12 | 50–150 / 40–120 | Tracking walk, sky dusk → night | S1 leaves with sky by 40 %; S2 l1 70–88 %, l2 85–100 % | track +1.2 world widths, 1.0 → 1.15, teen at 40 % x | turn 0–15 %, walk 4 steps, stop uneasy | same track, shorter (80); one peer + 3 shadows | bridge: walking teen across gutter |
| s2 | 150–220 / 120–180 | Laundromat wall, bulb, balloons | S2 l1+l2 | 1.15 drift | side, grip strap, uneasy | behind the teen, cropped at waist | S2 frame, balloons placed |
| t23 | 220–310 / 180–250 | Camera pushes through balloons into the gap | S2 exits top-left before 1.6×; S3 l1 70–88 %, l2 85–100 %; M1 M2 in hold | 1.15 → 3.2, 2° roll | react pose; close-up head swap at 60 % | eyes-and-nose crop; captions 2 at a time | bridge: balloons in gutter; M1 M2 visible |
| s3 | 310–400 / 250–330 | Offer: hand, unlit cigarette, tallies | S3 (l2 red), M1 → M2 | 3.2 drift | close-up ¾, leaning back, wary; eye is the rim-lit focus | hand small bottom-right | all captions visible |
| t34 | 400–510 / 330–420 | Headlight sweep, jacket transparent | S3 leaves up with wall; S4 l1 70–88 %, l2 85–100 % | 3.2 → 2.0, tilt down | ¾ → front, eyes down | chest fills middle 50 % | bridge: beam edge; S4 settled beam |
| s4 | 510–640 / 420–540 | Beam on chest, organs, red hatching | S4; captions M6 → M4 → M3+M5 sequential | 2.0 drift | front, arms loose, thoughtful | numbered markers, no leaders | all captions + markers visible |
| t45 | 640–790 / 540–660 | **Erase and widen** (signature 1) | **no type 35–60 %**; S5 l1 70–88 %, l2 85–100 % | 2.0 → 0.45 crane | refusal, headphones on, stride | vanishing point 40 % y | bridge: eraser + palm; S5 erased state |
| s5 | 790–860 / 660–720 | Avenue, lights, moon | S5 (largest type) | 0.45 drift | back ¾, resolved, walking | headline 3 lines | S5 frame |
| t56 | 860–970 / 720–810 | Pass OZONE's window, push through glass | S5 exits up with sky; OZONE inks on sign band 60–80 %, S6 l2 85–100 % | 0.45 → 1.0 → 1.3 | walk-by, exits right by 55 % | no cameo | bridge: window |
| s6 | 970–1060 / 810–890 | Counter, ID card | S6 + OZONE sentence caption | 1.3 drift | cameo tiny (L/M/P only) | customer as hand only | S6 frame |
| t67 | 1060–1210 / 890–1010 | **The finished page** (signature 2) | S6 copy shrinks into panel 6; final copy inks 80–100 % | 1.3 → 1.0 → page | walks toward vanishing point in panel 7 | 3×2 thumbs, panel 7 full-width | none (S7 is the page) |
| s7 | after 1210 | Pin released, free scroll, back matter | static HTML | none | none | none | same |

## 5 · The six transitions (timeline specs)
Notation: `%` of the span; positions are start / mid / end. All tracks are children of the named sub-timeline added at its label. `tl.set` = reversible swap. "Continuous" items are never re-created. Every transition also gets `cue:sN` (audio `setCue(N, dir)`) at its 50 % label.

**t12 "The walk"** (span 100 / 80)
- camera: x +1.2 world widths (`cam`), scale 1.0 → 1.15; teen held at 40 % x (camera x follows `walkDist` proxy). Parallax planes by `data-depth`: railings/shelter 1.6, mid 1.0, skyline 0.3.
- character: 0 % turn ¾→side (pose set at 7 %, `tl.set`); 15–80 % walk, `walkDist` 0 → 4 steps, linear; 80–100 % decelerate to stand (frame snaps to `stand-uneasy` at 100 %). Balloon 1 enters at the right edge 80–100 %.
- env: sky gradient painted as two stacked rects; the night rect opacity 0 → 1 (0–80 %), no other crossfade; lamp passes overhead 20–45 %, its light cone translates with the lamp plane; curb line continuous (never recreated, `s1` hands it to the camera plane).
- type: S1 headline plane exits with the sky (`lift`, done by 40 %). S2 l1 ink 70–88 %, l2 85–100 % (`ink`).
- red/ink masks: none yet (red begins in s2).
- reverse: walk frames are a function of `walkDist`, so feet stay planted; night rect fades back.
- fast scroll: the 8 frames are sampled at the playhead, no frame is skipped on purpose; poses at 7 % and 100 % are `set`s so a jump lands on correct pose. SFX: `sfx:footstep` (frame-driven, contact frames 0 and 4), `sfx:t12:flick1` at 92 %, `cue:s2` at 50 %.

**t23 "Closing in"** (span 90 / 70)
- camera: 1.15 → 3.2 (`cam`) into the gap between teen and nearest peer, rotation 0 → 2° (0–90 %, `none`, rolls back in t34). Balloons scale fastest (`data-depth` 3.5), exit frame 30–70 %; peers crop out; brick plane 1.0 → swells.
- character: side → ¾ with react pose 0–30 %; close-up head swap at 60 % (`tl.set` autoAlpha, hidden behind balloon 3); hand/cigarette rise from lower centre 70–100 %, settle on `settle`.
- env: bulb opacity 1 → 0.35 (20–70 %) while glare rect (off-white, halftone edge) 0 → 0.9 (30–85 %, ≥ 40 units ramp); giant shadow groups translate up-right off the wall 0–60 %.
- red roughs: balloon scribbles (stroke-dashoffset) draw 0–30 % as they multiply; first tally scratches 90–100 % (`none`).
- type: S2 lines leave top-left (`lift`) by 28 % (before 1.6× scale); S3 l1 70–88 %, l2 85–100 %. M1/M2 belong to `s3` hold.
- continuous: teen, balloons (rushing past the lens), bulb/glare. reverse: balloons re-gather; head swap reverses at 60 %. fast scroll: all balloon positions are tweens (no physics).
- SFX: `sfx:t23:flick1..4` at 32/42/52/62 %, `sfx:t23:car-swell` at 45 %, `sfx:t23:tally1` at 92 %, `cue:s3` at 50 %.

**t34 "The beam"** (span 110 / 90)
- camera: 3.2 → 2.0 and tilt down (`cam`), rotation back to 0. Fg hand/cigarette exits lower-left 0–35 % (`lift`); wall + tallies drift up and dim 0–60 % (bg).
- env: glare 0.9 → 0 (0–35 %). Beam = off-white band with halftone edges, `x` −60 % → settled position 35–75 % (`settle`); the chest reveal is a `clip-path` on the anatomy group (inset from left edge following the beam's leading edge) over the jacket, so the jacket is never re-masked per frame.
- character: ¾ → front by 35 % (`set` at 35 %), eyes down (brow set swap at 60 %). Red hatching begins 75–100 % (stroke-dashoffset, `none`), over lower lobes then coronary vessels.
- type: S3 leaves up with its wall by 30 %; S4 l1 70–88 %, l2 85–100 %. Captions M6 → M4 → M3+M5 sequence through the **s4 hold** (position-based `set`s at 20 / 50 / 80 % of hold, each pair ≤ 2 visible at S/P).
- continuous: the headlight (the light that lit the face is the beam). reverse: beam sweeps back, jacket re-covers via the same clip. fast scroll: clip and beam are one proxy value `beamX`, so they can never disagree.
- SFX: `sfx:t34:beam-air` at 35 %, `sfx:t34:hatch1` at 78 %, `cue:s4` at 50 %.

**t45 "Erase and widen"** (signature 1, span 150 / 120)
- camera: 2.0 → 0.45 and crane up behind the teen (`cam`), 35–100 %; 0–35 % held still (the refusal needs a locked frame). Alley walls slide out left/right (x, `data-depth` 1.8) 40–85 %; avenue light points switch on toward the horizon 65–95 % (opacity stagger `stagger: from end`, `settle`); sky plane grows to 40 % (scale y) 60–100 %.
- character: 0–15 % jacket re-ink (fill swap `set`); 15–35 % **say no** (open palm hand set, head turns away 15–25 %, body turns 25–35 %); 35–55 % headphones neck → ears (`headphones` part set at 50 %, plus a 12-unit yellow flash on the ear cups limited to 2.5 % frame area); 55–100 % stride, `walkDist` linear, back ¾ pose set at 55 %.
- red roughs / ink mask: **eraser front** = one SVG `<mask>` over the single red group (`red-all`): a mask circle whose `scale` (transform) grows 0 → 1 from the palm (origin set at refresh via function value) 35–60 %, `cam` ease. Crumbs: 12 grey specks translating out, opacity 1 → 0, 40–62 % (`lift`). After 60 % the `red-all` group is `display:none` via `set` (no red on screen from 60 %, reversible). Fallback if the mask repaint fails the prototype (§7): per-rough opacity stagger ordered by distance from the palm, same window.
- type: S4 text exits with the alley **before** the erase, by 30 %. No type on screen 35–60 %. S5 l1 ink 70–88 % (largest type, `ink`), l2 85–100 %.
- continuous: teen, the eraser front's origin (palm), camera, red group (one object). reverse: mask shrinks, roughs redraw behind the retreating eraser; camera sinks back. fast scroll: mask scale is a pure function of playhead; no crumbs state.
- SFX: `sfx:t45:eraser-rub` at 36 %, `sfx:t45:crumbs` at 45 %, `cue:t45:lowpass-open` at 50 % (music low-pass → full bandwidth exactly at headphones set), `sfx:t45:pluck1..5` at 68/74/80/86/92 %, `sfx:footstep` frame-driven 55–100 %, `cue:s5` at 50 %.

**t56 "The corner"** (span 110 / 90)
- camera: 0.45 → 1.0 crane down and right to street level (0–40 %, `cam`), then push through the glass 1.0 → 1.3 (40–70 %); mullion + sign plane is an fg plane (`data-depth` 3) that sweeps the lens as the wipe 40–70 %. LOD: interior detail group `set` visible at 45 %, distant window art `set` hidden at 45 % (swap behind the mullion).
- character: side-view walk through window light 0–55 % (`walkDist`); light pool translates across the teen (cone plane x). Exits frame right by 55 %; tiny cameo outside the S6 window appears at 80 % (L/M/P only).
- env: pendant pool opacity 0 → 1 60–85 %. Card: customer hand releases 70–85 %, employee lifts to read 85–100 % (`settle`), yellow glint `opacity` pulse once at 100 %.
- type: S5 headline exits up with sky by 35 %. "OZONE" sign ink 60–80 %, S6 l1 70–88 % (OZONE), l2 85–100 %; caption appears in hold.
- continuous: the window (small in s5, frame here); the teen's walk. reverse: out through glass and up; LOD swap reverses at 45 %. fast scroll: LOD is a `set`, never both visible.
- SFX: `sfx:footstep` 0–55 %, `sfx:t56:card-tap` at 90 %, `cue:s6` at 50 %.

**t67 "The finished page"** (signature 2, span 150 / 120)
- camera: 1.3 → 1.0 pull out through the window onto the street (0–40 %, `cam`); then that framing's transform shrinks to panel-7 geometry (40–80 %, `cam`), the camera group becoming the panel-7 clip.
- env: paper `#F1EBDD` plane translates up from the gutters (`y`, `settle`, 40–70 %), no fade. Panel 2 px borders draw by stroke-dashoffset 50–78 % in reading order; panels 1–6 are `<use>` windows clipped at 42–78 %, one clip-path inset per panel staggered 6 units apart in reading order (low-detail art; never new drawings). Final copy (S7 l1 `DON’T START.`, `PROTECT YOUR FUTURE.`, OZONE, ID lines) inks 80–100 % (`ink`), then a 0-motion rest of 6 units.
- character: walks toward the vanishing point inside panel 7 (`walkDist`, 40–100 %).
- type: S6 HTML copy shrinks with panel 6 into art and retires (`visibility:hidden` set) below 40 % scale; S7 HTML is the real in-flow section underneath, pixel-identical at 100 % (DESIGN §1.2 hand-off contract), pin (sticky) releases by scroll position, not by tween.
- continuous: the camera frame itself. reverse: paper sinks, panels un-ink, camera pushes back in. fast scroll: `<use>` windows are clip-path only. SFX: `sfx:t67:rule-pen1..6` at 44/50/56/62/68/74 %, `sfx:t67:paper-settle` at 98 %, `cue:s7` at 50 %.

**SFX rules for the audio engineer.** Every cue is a `tl.call(audio.sfx, [id], pos)` named by the labels above. The audio module latches per id per direction and plays SFX only for direction +1 (bed-only on reverse, CD §7). If one frame crosses > 60 units (fling or anchor jump), skip SFX, apply only the latest `cue:sN`.

## 6 · Ownership table (one owner per element per range; CSS `transition`/`animation` forbidden on all of these)
| Element / property | 0–50 loader→s1 | each transition | each hold | Notes |
|---|---|---|---|---|
| `[data-cam]` x/y/scale/rotate | `handoff` then `camera` | `camera` | `camera` (drift) | `camera` is the single owner of the whole master range |
| `[data-cam-drift]` none | | | | not used: drift is inside `camera` |
| `[data-rig]` position, `data-pose` frames, part transforms | `loader` (idle) → `character` | `character` | `character` (`stand`) | idle breath/blink: `idle` owns inner `rig-chest`, `rig-eyes` only, which `character` never touches |
| curb line `stroke-dashoffset` | `loader` → `s1` at hand-off | `t12` (continuous, as camera plane) | `s1` / none | handed over by `clearProps` then claim |
| wordmark, prompt, progress, loader % | `loader` | none | none | wordmark settles into UI corner, then CSS only |
| `sN-*` env layers | `sN` | `tNM` only for layers it lists; others stay with `sN` / `s(N+1)` out/in | `sN` | prefix rule from TECHNICAL_ARCHITECTURE §3 |
| sky night rect | `t12` | `t12` | `s2` | |
| balloons, glare rect, shadows | | `t23` | `s2`/`s3` | |
| `beamX`, anatomy clip, hatching | | `t34` | `s4` | |
| `red-all`, eraser mask, crumbs | | `t45` | none after 60 % of t45 | red group display set owned by `t45` |
| headphones part set | | `t45` | none | |
| window mullion plane, LOD sets | | `t56` | `s6` | |
| paper, panel borders, `<use>` clips | | `t67` | none | after t67: CSS only |
| headline `.l1/.l2` clip-path | `s1` (hand-off) | incoming scene's own window in `tNM` (position 70–100 %), outgoing scene's exit | none | one owner each: `sN` owns its own headline in and out |
| captions `data-caption` autoAlpha | | | `sN` | |
| UI: counter, toggle, skip, wordmark | CSS + store | CSS + store | CSS + store | never GSAP; counter text from `useSyncExternalStore` |
| Scene mount (`display`/autoAlpha, ±1 scene) | `camera`-adjacent `mount` sub-timeline | same | same | `tl.set` only; owner `mount` |
Dev/test builds register every target in `window.__claims` (id, start, end, owner); different owners overlapping on the same id and property throws; QA asserts zero overlaps. Initial hidden states live in the matchMedia callback (no-JS and reduced motion see everything).

## 7 · Loader timeline (`loaderTimeline.ts`, before the master exists, no ScrollTrigger)
Under `html.js-loading`, CSS hides S1's art (initial state only); `loader` takes ownership with `fromTo` and `clearProps` at hand-off.
| Stage | Time (first visit) | Tracks |
|---|---|---|
| 1 Darkness | 0–0.25 s | nothing animates; ground `#101014` + grain already painted |
| 2 Ink formation | 0.25–1.1 | curb line stroke draws; lamp/shelter/railings stroke-dashoffset 1 → 0 staggered off the curb (`ink`); bloom circles at stroke tips scale 0 → 1 → settle |
| 3 Colour | 1.1–1.6 | burgundy dusk rect `y` 100 % → 0 (clip-path rise); bulb fill to yellow; cone halftone opacity 0 → 1 |
| 4 Identity | 1.6–2.2 | wordmark glyph paths dashoffset stagger 0.04 s; holds; then translates/scales to UI corner (`cam`, 0.5 s) |
| 5 Illustrated movement | 2.2–2.9 | teen contour → fills → halftone (three dashoffset/opacity steps), one breath, head turn to look down the street (`head` swap, the only micro-motion) |
| 6 Progress | continuous | curb line dashoffset = 1 − ratio through `quickTo` (0.25 s, `power3.out`, monotone, so it lags and never leads); % text rounds the same ratio; `role=progressbar aria-valuenow` from the same value. The timeline pauses at label `idle` (2.9 s) until `ratio === 1`: assets finishing early never skip a stage, slow assets hold the scene (breath loop only). 10 s global timeout opens the prompt (TECH §5); text-story link at 8 s |
| 7 Enter | 2.9–3.3 | prompt lines ink in (`ink`, 0.12 s stagger); default focus on ENTER WITH SOUND |
- **Hand-off (mask into Scene 1):** prompt un-ink 0.3 s → curb line is not touched (it is already S1's curb) → camera scale 1.0 → 1.04 over 0.6 s (`cam`) → S1 l1 then l2 ink via diagonal clip-path wipe, 0.7 s each, overlapped 0.35 s → if sound chosen, `AudioDirector` fade 1.5 s (D1: autoplay was attempted at init; the prompt shows only if blocked) → scroll unlock (`overflow:hidden` + `scrollbar-gutter:stable` removed; the ScrollTrigger is created at this moment, with the master's first frame equal to the hand-off end state: camera 1.04, headlines inked). Nothing is swapped, only released.
- **Returning (`sessionStorage ozone-seen`), ≤ 1 s:** stages 2–5 merge into one `ink` wipe of S1 over 0.42 s (80–500 ms), real progress still drives the curb line, no prompt unless sound state is unknown (DESIGN D-2); hand-off compressed to 0.3 s.
- **Reduced motion:** no timeline; S1 complete with a ≤ 0.2 s opacity fade; plain bar + % from the same ratio; same prompt (no ink, no push); static comic follows.
- **Headline ink method (D2: no SplitText):** `.l1/.l2` are inline spans, so the reveal is a `clip-path: polygon()` on the span, a 4-point diagonal edge sweeping in reading direction (start `0 0,0 0,-30% 100%,0 100%` → end `0 0,130% 0,100% 100%,0 100%`, same point count so GSAP interpolates). Verify at 390 that multi-line wraps read top-to-bottom acceptably; fallback is a top-to-bottom `inset()` wipe.

## 8 · Character animation (`character.ts`, poses from `poses.ts`)
- **Walk cycle:** 8 drawings per two steps (CD §3), shown as `[data-pose="walk-1…8"]` toggled with `visibility`, only when the integer index changes. Index = `floor(walkDist / stridePx × 8) mod 8`, with `walkDist` one proxy number tweened `none` by t12 (4 steps = 16 frames), t45 55–100 %, t56 0–55 %, t67 40–100 %. Scroll → distance → frame, so frames never slide and reverse plays backward on planted feet; contact frames (0, 4) call `sfx:footstep` (forward only). Curls, headphones, hem and backpack lag 1–2 frames via the same index offset (secondary drawings in the frame set, no extra tweens).
- **Pose swaps** (`tl.set`): stand-curious (s1), turn-side (t12 7 %), stand-uneasy (t12 100 %), react (t23 0–30 %), close-up head (t23 60 %), ¾ → front (t34 35 %), front-thoughtful (s4), say-no palm (t45 15 %), back-¾ stride (t45 55 %), window-pass (t56), panel-walk (t67). Expression sets (brow/eye/mouth) swap with the pose, never in between.
- **Micro-motion only where it means something:** breath and blink on holds (≤ 5 s), eyes in t34 ("eyes down" at 60 %), head turn away in t45 ("say no"), head look at loader stage 5. No cursor-following eyes, no random fidgets. Reduced motion: none.

## 9 · Performance rules
- **Properties:** `transform`, `opacity`, `stroke-dashoffset`, `clip-path` (and SVG `<mask>` element transform in t45). Never `filter` animation, layout props, `d` morphs, or `fill` tweens in scrub (fill colour changes are `set` swaps between two stacked layers). Reads before writes; no `getBoundingClientRect` in `onUpdate`.
- **Layers / will-change:** `will-change:transform` on `[data-cam]` and ≤ 3 of the heaviest planes, **always on** (a scrubbed stage animates continuously; others none). Max ≈ 12 promoted layers: camera group + 3 depth planes per scene, only for scenes within ±1 of the playhead; others `display:none` via `mount` sets. ≤ 2,500 nodes per scene (1,800 at 390); ink-edge filter static on ≤ 3 layers. Halftone as static patterns, never re-rasterised by animation.
- **LOD swaps (reversible `set`s):** close-up head at t23 60 %, chest drawing at t34, distant-window ↔ interior at t56 45 %, panel `<use>` low-detail art in t67. Lite tier: if the rolling frame time during loader stages 2–5 averages > 24 ms, `html[data-art=lite]` before the master is built: drop halftone patterns on planes with `data-depth` < 0.5, freeze far planes, halve crumbs and bloom circles.
- **4 → 5 prototype measurement (before any other scene is built), placeholder art at real node counts (2,500 live nodes, 1,800 at 390):**
  1. Build t45 + s4/s5 only, with the real master, ScrollTrigger and eraser mask.
  2. Filmstrip: `reference-study/capture-reference.mjs --filmstrip` at 390×844, scrubbing t45's 540–660 svh in 12 steps (and the same at 1440×900).
  3. Long tasks and frames: Playwright + CDP `Emulation.setCPUThrottlingRate {rate:4}`, `PerformanceObserver('longtask')` and a rAF interval probe while scripting slow (60 px/frame) and fast (400 px/frame) scrolls through the span, three runs each.
  4. Pass: zero frames > 50 ms, p95 frame ≤ 33 ms, longtask count 0 during slow scroll. Fail → cut in this order: mask → opacity stagger fallback; halftone density; far-plane freeze (lite tier); node cull; bake filters. Report "lab, emulated"; real devices NOT TESTED.
  5. Then t67 prototype (second heaviest), same protocol.
- **Wheel check:** sample `scrollY` vs camera `x` every 16 ms for a 10-notch wheel burst; scrub 0.5 should show no stepping > 1 frame of plateau.

## 10 · Cleanup, refresh, inventory
- All animation in `useGSAP({scope: stageRef, revertOnUpdate:false})` plus one `gsap.matchMedia()` with branches (S ≤ 600 / M-P 601–1024 / L ≥ 1025, each `and (prefers-reduced-motion:no-preference)`, one `reduce` branch that builds nothing). Rig by aspect ratio per DESIGN §2. Change of branch reverts and rebuilds the master; scroll position is restored from scene id + local progress (DESIGN §9.4) with `st.scroll(start + p × (end − start))`.
- `idle` loops, loader and hand-off timelines are created inside the same context; the `cleanup.ts` registry removes listeners. No module-scope triggers, no `killAll()`.
- Refresh: `ScrollTrigger.config({ignoreMobileResize:true})`; `refresh()` after `document.fonts.ready`, after each art chunk (s3…s7) lands, after the loader releases scroll, and on debounced `orientationchange` (150 ms). Track height in `svh` so toolbar changes do not move labels.
- **ScrollTrigger inventory: exactly 1 in story mode (`getAll().length === 1`), 0 during the loader, 0 in static comic / reduced motion / no-JS.** After unmount/remount, across reload and after resize across a rig line: same count, `gsap.globalTimeline.getChildren().length` unchanged, claims overlaps 0.

## 11 · Verification plan (to run after implementation; none run yet, this is a spec)
Playwright: sample `[data-cam]` transform and each headline's clip-path at every label ±1 and mid-transition at 1440/768/390; assert at most one headline legible per sampled unit; trigger count; wheel and touch scroll both directions; scroll jump to `#scene-5` and back; `reducedMotion:'reduce'` run (no transforms, all text visible); filmstrip per transition checked against the beat table (screenshots opened before citing).

## Plugins used
gsap core, ScrollTrigger, CustomEase (all in public `gsap` 3.15.1, Standard no-charge licence). Not used: SplitText, Flip, Observer, ScrollSmoother, MotionPath, MorphSVG, DrawSVG (stroke-dashoffset is done directly).

HANDOFF
- agent: gsap-animator
- phase: T5 (ANIMATION_SPECIFICATION, no code)
- summary: Filled every section: tokens incl. `ink` CustomEase and scrub 0.5 (fine pointer) / true (touch) with reasons, unit system and labels for desktop/390, 13-row beat table, six transition specs (tracks, % positions, eases, continuity, reverse, fast-scroll, SFX cue labels), ownership table, 7-stage loader with progress coupling and hand-off, walk cycle/pose rules, perf rules and the t45 prototype plan, cleanup and the ScrollTrigger inventory (1 / 0).
- files_changed: /home/user/Claude-code-skill/showcase/ozone/studio/ANIMATION_SPECIFICATION.md
- verification: Document written and read against CD §5/§6, DESIGN §1.1/§6.4/§10.6, TECH §3/§5, DECISIONS D1–D5: PASS (consistency by reading). Easing curve feel, diagonal clip-path interpolation, SVG mask cost at 390/4x, wheel smoothing: NOT TESTED (no code yet; the t45 prototype is the test). Scroll budget arithmetic (desktop 1210, 390 1010, label starts): PASS (summed).
- open_issues: (1) Track height must be budget + 100svh, TECH §3 says 1210vh → frontend. (2) Rig P and M scroll tables are not in CD; I propose M = desktop, P = desktop × 0.9 → creative-director. (3) CD says scroll unlocks after the 1.5 s score fade; that lengthens the lock when sound is on; I followed CD, say if it should unlock after the headline ink → creative-director/audio. (4) Hold drift (2.5 %) means hold framings are nominal ±2.5 % → art agent to leave bleed. (5) Reduced-motion ink-per-line headline reveal without SplitText is a diagonal clip approximation → verify at 390. (6) Per-rig camera x/y/scale values need the art agent's world map → art/SVG rig. (7) 60 fps camera over heavy SVG at 390 remains unproven.
- decisions_needed: items 2 and 3 above; accept the `cue:` and `sfx:` label names for the audio spec.
- next_suggested: audio agent maps `sfx:`/`cue:` ids into AUDIO_SPECIFICATION; art agent publishes `layers.ts` names matching this table; then prototype t45 and t67 per §9 before building other scenes.
