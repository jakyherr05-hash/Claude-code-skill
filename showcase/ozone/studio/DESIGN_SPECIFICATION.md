# Design Specification — OZONE — "Your Ink"
_Owner: ui-ux-designer · T5 · 2026-11-18 · Replaces the 2026-11-17 "Clear Air" spec (git history)._
_Inputs: PROJECT_BRIEF, CREATIVE_DIRECTION (CD), FACTS_AND_SOURCES (FS), REFERENCE_RESEARCH, TYPOGRAPHY_SYSTEM (TS), SPACING_SYSTEM (SS). Type and spacing numbers are theirs; this document owns composition, behaviour and accessibility. Type is referenced by role token only (`--t-h1`, `--t-h2`, `--t-hero`, `--t-d1`, `--t-d2`, `--t-0`, `--t-label`); space by `--space-*`, `--margin`, `--pad-*`._

**Standing rules (apply to every section below)**
- **No `text-transform` anywhere.** Client copy is stored as supplied ("IDs" stays "IDs"; ’ in ISN’T and DON’T). UI labels are typed as caps strings in the markup.
- **No mono.** UI labels are the text face, weight 600, +8 % tracking, tabular numerals (TS D1). Min text size 14 px (`--t-label`).
- **Arrows are inline SVG**, `aria-hidden="true"`, `focusable="false"`, decorative (neither font has "→", TS §3).
- **Medical and legal sentences come only from FS.** No statistics, no California claims, no store details.
- **No focusable element lives inside a pinned scene.** The stage is operated by native scroll; all interactive controls are global UI or back matter.
- **Headline and caption text are real HTML in the DOM from first paint.** Reveals use mask/clip-path, never `display:none`, `visibility:hidden` or removal, so the accessibility tree always holds the whole story.

---

## 1 · Sitemap and story structure

One route, `/`. One document, three modes of the same DOM.

```
loader (stages 1–7, is Scene 1)  →  S1 → T1 → S2 → T2 → S3 → T3 → S4 → T4 → S5 → T5 → S6 → T6 → S7  →  back matter  →  footer
```

| Part | Job (single) | Scroll |
|---|---|---|
| Loader | Honest progress, then the sound choice. Ends *on* Scene 1. | locked until hand-off |
| S1 Every story starts somewhere | Invite: meet the teen and the choice. | pinned, 50 vh / 40 svh |
| S2 The pressure | Name the pressure; permit "no". | pinned |
| S3 One cigarette | Nicotine is addictive; teens hook faster (M1, M2). | pinned |
| S4 The damage | Risks are real, shown gently (M6, M4, M3, M5). | pinned |
| S5 Your future | The refusal's reward: the world widens. | pinned |
| S6 OZONE checks IDs | OZONE's commitment, as a person doing a job. | pinned |
| S7 The finished page | Final message, the walk as one page. | **free scroll** |
| Back matter | Sources M1–M6, L1, one resource link, credits. | free scroll |
| T1–T6 | Reversible camera transitions (CD §6). Budget per CD scroll table (1210 vh desktop, 1010 svh at 390). | scrubbed |

### 1.1 The three modes (one DOM)
| Mode | When | What the visitor gets |
|---|---|---|
| **Story** | JS on, `prefers-reduced-motion: no-preference`, stage height ≥ 360 px | Loader, sticky stage, one scroll track, scrubbed camera. |
| **Static comic** (document flow) | No JS (default CSS), `prefers-reduced-motion: reduce`, "Read the story as text" chosen (`?view=text`, kept in `sessionStorage`), or viewport height < 360 CSS px (a 400 % zoom on a laptop, a 320-high landscape phone) | Stacked panels with paper gutters; every headline, caption and alt present from first paint. See §1.3. |
| **Print** | `@media print` | Static comic on white, no UI, sources included. |

Mode is chosen by a head script before first paint (`html[data-mode="story|static"]`). The mode can change live (preference change, resize across the 360 px height line): scroll position is preserved by scene id plus local progress (§9.4).

### 1.2 Story-mode DOM and layers
```
<a class="skip" href="#scene-7">Skip to the message</a>            ← first focusable
<div id="loader" role="dialog" …>                                   ← only while loading (§5)
<header>  wordmark · counter · sound toggle · (skip is above)     ← fixed UI layer
<main id="main">
  <div class="stage" aria-hidden for art only>                      ← position:sticky, 100svh, art + text layers
     <svg class="world">…</svg>  (aria-hidden)
     seven <section id="scene-n"> copy layers (real HTML, stacked, pointer-events none)
  </div>
  <div class="track">  13 spacer beats (S1,T1,S2 … S6,T6) sized by the CD scroll budget; ids #beat-s1 … #beat-t6 </div>
  <section id="scene-7">  S7 in document flow (the paper page)  </section>
  <section id="sources"> back matter </section>
</main>
<footer> credits, facts-checked line </footer>
<div id="announcer" role="status" aria-live="polite" class="sr-only">
```
- Scene copy layers (`<section id="scene-1…6" aria-labelledby>`) sit in the stage. Their `#scene-n` ids are the **anchor targets**: a hash jump (`#scene-3`) scrolls the track to the *start of that scene's hold* (the end of the previous transition, when line 2 is already inked) and moves focus to that scene's heading (`tabindex="-1"`).
- **Inactive scene copy is kept in the accessibility tree** (opacity 0 via mask, `pointer-events:none`, no focusables). Screen readers can traverse the whole story; sighted users see only the scene in view. Known limit: moving a screen-reader cursor to a hidden scene does not scroll the page. The loader and the top of the page therefore announce the "Read the story as text" alternative (§5.5).
- **S7 hand-off contract.** `#scene-7` is normal document flow. At the end of T6 the pinned stage's last frame is pixel-identical to the top of `#scene-7` at that breakpoint; the pin releases and the real paper page takes over without a jump. At ≤1024×768 and ≤768 wide the S7 page is taller than the viewport; T6's end rest shows the top ≥ 60 % of the page (panels and the start of the copy) and free scroll reveals the rest.
- **Art slots.** Each scene has `<div class="art-slot" role="img" aria-label="…">` directly after the heading. In story mode it is empty (the world SVG is `aria-hidden`); in static mode it holds the static SVG frame. One alt string per slot, so both modes say the same thing (§10.5).

### 1.3 Static comic (document flow): full spec
The reduced-motion story is "a printed comic" (CD §8), and it is also the no-JS page. It is complete, not a fallback.

- **Ground** paper `#F1EBDD`, `data-ground="paper"`. Panels are dark frames with a 2 px `#101014` border and paper gutters (`--space-xl` between panels at ≥768, `--space-l` at ≤390).
- **Panel anatomy** (one per scene, in this DOM order): `h1`/`h2` headline → `.art-slot` (static SVG frame, the scene's hold framing at the rig for the viewport) → caption box(es) → (S4) caption markers.
- **Headline never overlays art here.** The headline lives on a flat `#101014` plate attached to the frame, so legibility does not depend on art. At ≥1024 the plate is a side column (frame = cols 1–7, plate = cols 8–12, plate vertically centred; S5 and S7 span full width because of their size); at ≤768 the plate sits **below** the frame, full zone width. Line colours as in the scenes (Y, R, O). Plate padding `--space-m`.
- **Captions** are the same off-white boxes (§6.1), stacked under the headline in the plate with `--space-xs` gaps, all visible from first paint. S4's leaders are replaced by the numerals on the boxes and markers (no hairline leaders).
- **Bridge panels** (T1–T6): a slim strip, aspect 3∶1 at ≥1024 and 2∶1 at ≤768, with the transition's continuous element crossing the gutter (walking teen, balloons, beam, eraser, window, page). T4 and T5 carry alt text (§10.5); T1, T2, T3 and T6 are `aria-hidden` decoration. The T6 bridge is omitted (S7 is the page itself).
- **S4 shows the settled beam with its red roughs; S5 shows the erased, widened state.** S5's `--t-hero` line is the largest type on the page, as in the story.
- **Motion.** None except a ≤ 200 ms opacity fade as a panel enters (skipped under `prefers-reduced-motion`). No camera, walk, idle, draw-on or parallax.
- **Sound** is still offered (loader prompt and toggle). The score follows the panel in view (IntersectionObserver, 60 % threshold, 1.5 s crossfade), no scroll SFX.
- **UI in static mode.** Wordmark and sound toggle remain (fixed). The counter and the skip link remain. A first-row link in `<main>`, shown only when the mode came from `?view=text` and the user has not asked for reduced motion: "Switch to the animated story". Anchors `#scene-n` are plain in-flow anchors.
- **No-JS** differs only in: no loader, no toggle, no counter (all JS-rendered), skip link and sources work as plain anchors.

---

## 2 · Reading contract: breakpoints and rigs

Layout follows the **camera rig**, chosen by aspect ratio `a = w/h` (CD §8), with a height guard. The HTML grid is SS §2 (4 / 8 / 12 columns).

| Rig | When | Reference sizes | Grid | Role |
|---|---|---|---|---|
| **L** (16∶9) | `a ≥ 1.5` and `h ≥ 480` | 1440×900, 1920×1080 | 12 col, margin 64 | Desktop |
| **M** (4∶3) | `1.1 ≤ a < 1.5`, **or** any `a ≥ 1.5` with `h < 480` | **1024×768** (landscape tablet), 844×390 (landscape phone) | 12 col at ≥1024, 8 col below, margin 40/32 | Short landscape: the L framing with extra top and bottom bleed |
| **P** (3∶4) | `0.65 ≤ a < 1.1` | **768×1024** (portrait tablet) | 8 col, margin 32 | Portrait tablet |
| **S** (≈9∶19.5) | `a < 0.65` | **390×844**, 390×664 (iOS Safari with toolbars), 320×568 | 4 col, margin 20 (16 at ≤374) | Phone |

**Mandatory fold checks** (every scene's first viewport): 1440×900, **1024×768**, 768×1024, **390×844 and 390×664**, 320×568, 844×390. 390×664 is the true in-browser worst case on current iPhones and is checked as often as 844.

**Display type must be clamped by height as well as width** on M/L rigs with short viewports (request to typography-spacing: drive `--t-h1`, `--t-hero`, `--t-d1` with `min(vw-curve, 1.78 × vh-curve)` or equivalent so that 844×390 does not inherit a 844-wide size). Until then the 844×390 rule is: headline zone grows to ≤ 52 % of height and captions go sequential.

**Vertical slack is absorbed by the camera, never by shrinking type below its role minimum.** If a headline block is taller than its zone, the art tilts (more sky above or ground below, which the world already has, CD §8) rather than the type scaling. The art's focal zone top = headline block bottom + `--space-l`.

### 2.1 Headline block budgets (estimates; QA replaces them with measurements)
Estimated from TS tokens with a width model (L1 ≈ 0.47 em per capital in condensed 800, L2 ≈ 0.66 em in 500), `lh` 0.92 / 1.08, gap 0.4 em. Spans are **the wider ones typography-spacing asked for**: S2 = 6 cols and S4 = 6 cols at 1024, S4 = 5 cols at 1440. Block top = `--ui-top` clearance (see §3.1), about 14 % of height at 1440×900, 12 % at 1024×768, 11 % at S.

| Viewport | Span used | S1 | S2 | S3 | S4 | S5 (`--t-hero`) |
|---|---|---|---|---|---|---|
| 1440×900 | 5 (S5: 9) | 366 px · y 14–55 % | 366 · 14–55 % | 366 · 14–55 % | 366 · 14–55 % | **485 · 14–68 %** |
| 1024×768 | 5 / 6 / 6 / 6 (S5: 8) | 299 · 12–51 % | 299 · 12–51 % | 232 · 12–42 % | 299 · 12–51 % | 323 · 12–54 % |
| 768×1024 | 5 / 5 / 4 / 5 (S5: 6) | 261 · 8–33 % | 203 · 8–28 % | 298 · 8–37 % | 261 · 8–33 % | 308 · 8–38 % |
| 390×844 | 3 (S5: 4) | 194 · 9–32 % | 194 | 221 · 9–35 % | 194 | 219 · 9–35 % |
| 390×664 | 3 (S5: 4) | 194 · 11–40 % | 194 | 221 · 11–44 % | 194 | 219 · 11–44 % |
| 320×568 | 4 | 183 · 12–44 % | 183 | 142 · 12–37 % | 183 | 253 · 12–57 % (L1 four lines) |

These are **text-safe-zone reservations for the illustrators and the camera rig**: the art under each range must be a flat `#101014` / `#19191F` / `#481C2A` plane (CD §2 rule 1). Where a row is larger than the CD's wording ("top third", "upper 40 %"), the row wins (see issue I-1 for S5).

---

## 3 · Global UI

### 3.1 Layers, reserves and safe areas
| Item | Position | Size | Notes |
|---|---|---|---|
| **Wordmark** "OZONE" | top-left | display face, role `wordmark` ≈ `--t-label` × 2.2 | Typographic **placeholder**, one swappable component. Not a link, not focusable (decision D-3). Logotype contrast exemption applies, but it is placed over flat dark anyway. Hidden (opacity) during S6, T6 and S7 because the scene's own OZONE lock-up is on screen; returns as back matter scrolls in. |
| **Chapter counter** `03 / 07` | top-right cluster | `--t-label`, tabular | Justified: 1210 vh of pinned scroll has no other orientation. Non-interactive, `aria-hidden="true"` (the headings carry the outline). Shows the scene whose hold is nearest; during a transition it switches to the incoming scene at 50 %. Hidden at < 360 px and during the loader. |
| **Skip link** "Skip to the message" | top-right cluster, left of the counter | pill | Always visible (a quiet persistent control, not hidden-until-focus) so pointer users with 1210 vh ahead can use it. Same element is the first focusable in DOM. §3.3. |
| **Sound toggle** | bottom-left | pill ≥ 44 px high, ≥ 44 px wide at every size (`--target`) | §3.2. |
| **Scroll cue** "SCROLL" + a short SVG chevron | bottom-centre (S rig: bottom-centre above the toggle row) | `--t-label` | Appears after hand-off, fades on the first scroll > 2 % of S1's hold, never returns. `aria-hidden`. Not shown in static mode. |

- **Alignment.** All UI items align to the grid frame, not the viewport edge: left items at `--pad-l`, right items at `--pad-r`, and at ≥ 1920 the same 1680 px container as the text (SS §2). Top items offset `--pad-t`, bottom `--pad-b` (safe-area aware; requires `viewport-fit=cover`).
- **Reserves (art and text must keep them clear).** Top bar band: `--pad-t` + 44 px + `--space-xs`. Bottom-left reserve: 220 × (44 px + `--pad-b` + `--space-m`), so every bottom-left caption starts above that line. Art keeps the top-left 25 % × top bar and the top-right 35 % × top bar free of halftone lighter than the ground (art-direction note to the visual agents).
- **Landscape phone (844×390).** Top bar compresses to 44 px, counter hidden, skip link text stays. Left/right safe-area insets move the toggle and the top items inward.
- **Z-order.** Loader > UI > scene copy > world. UI never covers the scene's headline zone (§2.1) because the zone starts below the top bar.
- **`scroll-padding-top` = top bar + `--space-s`; `scroll-padding-bottom` = toggle row + `--space-s`.** Keeps focused back-matter links clear of fixed UI (WCAG 2.4.11).

### 3.2 Sound toggle (the always-visible control)
- **Markup:** `<button type="button" id="sound" aria-pressed="false">` containing the text node **SOUND**, a decorative speaker icon (SVG, `aria-hidden`), and a state chip `<span aria-hidden="true">ON|OFF</span>`.
- **Accessible name:** "SOUND" (from content), constant. State is conveyed **only** by `aria-pressed`. This avoids the double-announce ("Sound off, pressed") bug and satisfies label-in-name; the chip is a visual duplicate of `aria-pressed` for sighted users, and the icon changes shape (waves vs. waves with a slash) so the state is never colour alone.
- **`aria-pressed="true"` means REAL playback**, all of: user intent is on **and** `AudioContext.state === "running"` **and** the master gain is above 0 (not mid fade-out). It is false while: off by choice, `suspended`/`interrupted` (iOS interruptions, autoplay block, tab hidden), failed to start, or still resuming. A `statechange` listener and `visibilitychange` keep it honest; it is never set from the click alone.
- **Click on:** `aria-busy="true"` → `ctx.resume()` → on `running`: pressed true, chip ON, 0.4 s gain ramp up (AU-2), announce "Sound on." On rejection or `suspended` after 1 s: stays false, announce "Sound could not start. The story works without it. Press Sound to try again."
- **Click off:** pressed false at once, 0.4 s ramp down, then `ctx.suspend()` (AU-2), announce "Sound off." Intent is remembered per visit.
- **Device or tab interruption:** chip flips to OFF, pressed false, announce "Sound paused. Press Sound to resume." Returning to the tab auto-resumes only if intent was on and the browser allows it; otherwise it stays OFF.
- **Unsupported Web Audio:** the control is replaced by non-interactive text "SOUND UNAVAILABLE" (status text, not a button).
- **Visual:** solid `#101014` pill with a 1.5 px `#F1EBDD` border (so it reads over any art), label `--t-label` 600, chip: ON = `#101014` on `#F5D547` (13.10); OFF = `#F1EBDD` on transparent with a 1 px border. On paper ground (`data-ground="paper"`, S7 onward and the whole static mode) it flips to a paper pill: `#F1EBDD` fill, 2 px `#101014` border, black text, chip ON = black fill / paper text, OFF = outlined. The flip happens at 55 % of T6 over 120 ms (QA measures the midpoint; the pill is opaque on both grounds, so the flip cannot produce a low-contrast frame).
- **Size.** Min 44 × 44 CSS px; at 390 the pill is about 112 × 48 (icon + SOUND + chip); at 320 about 104 × 48. Never icon-only.
- **Keyboard:** Tab, Space and Enter. No other shortcut. **First focusable after the skip link.**
- **WCAG 1.4.2:** this is the page-level mechanism to stop audio, reachable from the first focus stop after the skip link.

### 3.3 Skip link
- Text "Skip to the message". Target `#scene-7` (S7's heading, the final message). Focus lands on the S7 `h2` (`tabindex="-1"`); the stage fast-forwards (scrub resolves), the score crossfades to the S7 mix, and the counter shows `07 / 07`.
- In static mode it is an ordinary anchor to the S7 panel.
- Once S7 is reached the link is removed from the tab order (`inert`) and fades out, unless it currently has focus (then it fades on blur).
- Visual: pill, `--t-label` 600, `#101014` fill, 1.5 px off-white border (paper ground variant as the toggle). Target ≥ 44 px.
- A second, visually hidden skip is **not** added: with no focusables inside the scenes, one skip plus the toggle is the entire keyboard path before the back matter.

### 3.4 Chapter indicator
Justified (see 3.1), kept minimal: text only, no ticks, no scene names, never a dark pattern (no "N min left"). Not clickable (scrub jumps are the skip link's job; seven extra tab stops would add noise to a page whose scenes have none). Reversible: an `<nav aria-label="Scenes">` of seven links could replace it if testing shows keyboard users need scene jumps (decision D-4).

### 3.5 Footer
`<footer>` after the back matter: credits and the "Facts checked" line (§8). Nothing else; no social, no newsletter, no address (none supplied).

### 3.6 Cursor and pointer treatments
**None.** No cursor follower, no hover-only meaning, no parallax tied to the pointer (CD §9). Every "desktop interaction" in this design is scroll, which is the same input on touch. Hover styles exist only on the five controls in §7 and are gated by `@media (hover:hover)`.

---

## 4 · Navigation and focus model

- **Pattern:** native scroll is the navigation. Keyboard: Space / Shift+Space / PageUp / PageDown / Home / End / arrows all scroll natively. There is no hamburger, no menu, no focus trap outside the sound dialog.
- **Current-section indication:** the `03 / 07` counter (sighted) and the heading outline (assistive tech). `aria-current` is not used (the counter is not a nav).
- **Focus order (story mode):** 1 skip link → 2 sound toggle → 3 back-matter links (S7 onward, in DOM order) → 4 footer. Tab from the toggle jumps past the whole track to the first Sources link: by design, because nothing in the pinned scenes is interactive. Focus rings are never obscured (scroll-padding in 3.1).
- **While the loader is open:** everything outside `#loader` is `inert` (including the skip link and toggle). Focus order inside the loader is §5.
- **Scrolling is locked** (`overflow:hidden` on `html`) only from the first loader frame until hand-off completes (≈ 2.2 s after the choice); a 4 s safety timeout always unlocks it. Keyboard scroll keys are inert in that window; this is the only scroll lock on the page.
- **Hash links:** `#scene-n` and `#sources` work in all modes (focus management as in 1.2). Browser Back after a skip returns to the previous scroll position (no `pushState` for scroll position).

---

## 5 · Loader

The loader **is** Scene 1 (CD §5). Stages 1–7 keep their timings. This section adds UI, honesty and focus.

### 5.1 Honest progress
- The indicator is the **curb line**, drawn left to right; its length equals real completed work, never ahead of it, never moving backward. A numeric `%` (integer, tabular, `--t-label`) sits at the line's tip (at 320 it sits above the line's right end).
- **Weights (initial; recorded in code):** fonts (`document.fonts.load` of both faces) 15 %, S1 and S2 SVG art decoded 45 %, score buffers rendered 30 %, remaining art preloads 10 %. If the visitor's stored choice is "no sound", the audio weight is dropped and the rest rescales. A failed audio render counts as done (the page continues silent and says so, §5.4).
- **Semantics:** `<div role="progressbar" aria-label="Loading the story" aria-valuemin="0" aria-valuemax="100" aria-valuenow>`. Value updates at most every 250 ms. A **polite status** (`#announcer`) says "Loading the story." once, "Half loaded." at 50 %, and "The story is ready. Choose how to enter." at 100 % (three announcements total, not a stream).
- **Timing honesty:** if the cinematic stages (≈ 2.9 s) finish before 100 %, the scene idles (one breath loop) and the line keeps telling the truth. If the stages are slower than the real load, they do not wait: the prompt appears when both are done.

### 5.2 Controls during loading
| Control | When visible | Behaviour |
|---|---|---|
| **SKIP INTRO** (text button, bottom-left, ≥ 44 px) | from 600 ms | Jumps the *cinematic* to its settled S1 frame. It does **not** fake progress; the curb line and % stay real. Same as pressing Escape before the prompt. |
| **Read the story as text** (link, bottom-right at ≥ 768, stacked above the % at ≤ 390) | visible at 8 s, or immediately on keyboard focus, or when a stall/error is detected; always in the accessibility tree from the first frame | Loads the static comic (`?view=text`), no audio decisions needed. |
| **Stall message** | no progress for 6 s | "Still loading. You can read the story as text now." plus the link promoted to the primary position. |
| **Error message** | any asset failure | "Part of the story didn’t load." Primary: Read the story as text. Secondary: **Try again** (re-runs only the failed tasks). |

### 5.3 The sound prompt (stage 7)
- **Container:** `role="dialog" aria-modal="true" aria-labelledby="sound-title" aria-describedby="sound-desc"`. Not a heading (the page's single h1 is Scene 1's).
- **Content**
  - `#sound-title` label (`--t-label`, 600, +8 %): **SOUND IS PART OF THE EXPERIENCE**
  - `#sound-desc` (`--t-0`, ≤ 40 ch): "Original music and sound. Everything is also written on screen, so the story works without it."
  - Primary button: **ENTER WITH SOUND** + SVG arrow (`#F5D547` fill, `#101014` text 13.10; weight 700; `--t-0`).
  - Secondary button: **CONTINUE WITHOUT SOUND** (`#F1EBDD` text on `#101014`, 1.5 px `#F1EBDD` border so it reads as a button; same height and width as the primary: equal tap area, no shaming copy, no smaller or greyed option).
- **Sizes:** both buttons min 56 px high (≥ 44), min 44 px wide targets with `--space-s` between them (≥ 24 px target spacing).
- **Placement (lower third; teen stays visible above):**
  | Viewport | Layout |
  |---|---|
  | ≥ 1024 | Left-aligned in cols 1–6, y 66–92 %; buttons side by side, label + description above. The teen (62 % x) and lamp stay unobstructed. |
  | 768×1024 | Cols 1–8, y 70–92 %; buttons side by side (each 4 cols). |
  | 390 | Zone width, y 58–94 % of svh; buttons stacked, primary on top, 56 px each, `--space-xs` gap. At 390×664 the description drops to one line ("Original music and sound. The story works without it.") and the block is y 56–95 %. |
  | 320×568 | Same stack; description removed (label + buttons only; `aria-describedby` still points at the full sentence, visually hidden). If the block cannot fit it may scroll inside the dialog (`overflow:auto`), never clip. |
  | 844×390 | Two columns: label + description left, buttons stacked right, y 40–94 %. |
  Prompt ground: an opaque `#101014` plate (no art behind text, so contrast is by construction).
- **Focus management**
  1. On show, focus moves to **ENTER WITH SOUND** (default, CD §5). `aria-modal` + `inert` background.
  2. Tab / Shift+Tab cycle between the two buttons (and "Read the story as text" if it is visible): a real trap for the dialog's lifetime.
  3. **Escape = CONTINUE WITHOUT SOUND** (the quiet, non-committal choice; decision D-1). Announced the same as clicking it.
  4. On either choice: both buttons get `aria-disabled="true"` (double-click guard), the prompt un-inks (300 ms), the dialog and `inert` are removed, and **focus moves to the sound toggle** (it fades in at its place at the same moment) so the result is visible and keyboard users keep their position. The announcer says "Sound on." or "Continuing without sound. You can turn sound on with the Sound button."
  5. Hand-off continues exactly as CD §5: camera 4 % push → S1 line 1 then line 2 ink in (700 ms) → score fades in over 1.5 s if chosen → scroll unlocks.
- **Autoplay honesty:** audio is created and resumed only inside the ENTER click handler. If `resume()` fails the story still starts, the toggle reads OFF/not pressed, and the failure is announced (§3.2).
- **No dark patterns:** one prompt, once per visit; no re-asking; no pre-ticked preference; "without sound" is always available and costs nothing.

### 5.4 Returning visitor (short version)
- Stored locally (functional only, no analytics, nothing sent): `localStorage["ozone.v1"] = {seen:true, sound:"on"|"off"}`. If storage is blocked the visitor is simply treated as new each time.
- ≤ 1 s: stages 2–5 merge into one ink wipe of S1 (CD §5). Progress is still real (usually instant).
- **Last choice was sound ON:** a **compact prompt** appears by 600 ms (a gesture is still required by browsers): label + the same two buttons, no description, focus on ENTER WITH SOUND, same trap and Escape rule.
- **Last choice was sound OFF:** **no prompt.** The story starts silently, the toggle shows OFF, and the announcer says "Sound is off. Use the Sound button to turn it on." (decision D-2: it respects the stated preference; the brief's "sound on by default" applies to first visits).
- Returning with `?view=text` stored: opens in static mode, no loader.

### 5.5 Reduced motion and no-JS in the loader
- **Reduced motion:** a plain horizontal bar fills with real progress, `%` beside it, S1 is shown complete with a ≤ 200 ms fade, and the prompt is identical (sound is still offered). SKIP INTRO is omitted (nothing to skip).
- **No JS:** no loader; the static comic renders.
- **Screen-reader users** hear, in order: the progress announcements, then the dialog. The dialog is preceded by the "Read the story as text" link in the tab order, which is the recommended path for linear reading.

---

## 6 · Scenes

### 6.0 Rules shared by all scenes

**6.1 Caption-box rule** (SS §4 owns the numbers)
1. Off-white `#F1EBDD` ground, `#101014` text (15.97), 2 px `#101014` border, **straight corners, never rotated**. Padding `--space-s` / `--space-m`. Text `--t-0`, line-height 1.4, max `34ch`. Hard offset shadow (`--space-3xs`) only where the box sits on lighter art; none on dark planes.
2. **One fact per box** (M1, M2, M6, M4 separate). The only combined box is M3 + M5 (S4). Wording is the FS "approved page wording" verbatim.
3. The last line of every medical box is a source tag (`--t-label`, 500, tabular): agency and year, a 1 px `#101014` rule above it. Examples: "FDA, 2026" (M1), "FDA, 2026 · CDC, 2024" (M2), "CDC, 2024" (M3–M6). Full titles, dates and URLs are in the back matter. Tags are plain text (no links inside scenes).
4. A box sits **only on its flat plane**, at least `--space-m` from any halftone edge, never over the teen's face (eye), the hand and cigarette (S3), the organs (S4), or the card (S6).
5. A box starts **above the bottom-left reserve** (§3.1) and below the top bar; it never overlaps its own scene's headline (gap `--space-l`).
6. **Slots.** Every scene declares caption slots. If the stacked boxes do not fit the slot (small `svh`, 320 px, user text-spacing, 844×390), they go **sequential** in one slot, in order, each replacing the last as scroll progresses. Everything is in the DOM in order either way.
7. Order and timing are scroll-driven and reversible. At most **two boxes visible at ≤ 768**; at ≤ 390 the second is the next in the same slot rather than a third.
8. Reduced motion / static: all boxes visible, none sequential.
9. Leaders (S4 desktop and tablet only): 1 px `#F1EBDD` hairline ending `--space-2xs` short of the box border and on a numbered ink marker on the organ; decorative, `aria-hidden`.

**6.2 Headline rule.** `<h1>`/`<h2>` contains both lines as `<span class="l1">` and `<span class="l2">` separated by a text space, so assistive tech reads one sentence pair with natural pauses. No `<br>`. `text-wrap: balance`; no word alone on the last line (checked in the screenshot, not assumed). Line 1 off-white (S3, S4: off-white; line 2 red), line 2 colour per CD (Y/R/O). Headline zones = §2.1 on flat dark planes.

**6.3 Per-scene template.** Each scene lists: Job · Content (DOM) · Layout at the five rigs · What re-composes · Controls · Motion hook · Accessibility.
Layout cells use: **H** = headline block, **C** = captions, **A** = art focal, **x/y** = % of viewport.

**6.4 Hand-off to gsap-animator (all scenes)**
- Hooks: `data-scene="1…7"`, `data-beat="s1|t1|…|t6"`, `.l1`/`.l2` (ink-in via `mask`/`clip-path` stroke mask, reading direction), `data-caption="m1…"`, `data-leader`, `data-ui="counter|toggle|skip|wordmark"`.
- Windows: line 1 inks at ≈ 70–88 % of the incoming transition, line 2 at ≈ 85–100 % (CD §6). The outgoing headline leaves with its art plane. At most one headline legible at a time.
- Idle loops (breath, blink, lamp, drift) **run for at most 5 s after a hold begins, then settle to a still pose** and resume on the next scroll (WCAG 2.2.2). Reduced motion: none.
- Every scrubbed state is a pure function of scroll position, so reverse and fast-fling are always legible and no frame is blank.
- No flashing: no luminance change on more than 25 % of the frame more than once per second; headlight glare (T2, T3) ramps over ≥ 400 ms of scroll-time equivalent.

---

### S1 · Every story starts somewhere (h1)
- **Job:** Invite. Establish the world, the teen, one lamp; first thing read is the headline.
- **Content:** `<h1>` EVERY STORY STARTS SOMEWHERE. / MAKE SURE YOURS STARTS RIGHT. (line 2 yellow). `art-slot` (alt S1). No captions. UI only.
- **Layout**

| | H | A (teen, lamp, curb) | Controls / reserve | 
|---|---|---|---|
| ≥1440 (L) | cols 1–5, y 14–55 % (3 + 2 lines), on sky; skyline tops ≥ y 58 % | Teen full figure 55 % of height, x 62 %; lamp top-right x 78 %, cone down; curb y 82 % | Toggle bottom-left; counter, skip top-right; SCROLL cue bottom-centre |
| 1024×768 (M) | cols 1–5, y 12–51 %; skyline ≥ y 56 % (the extra bleed is sky) | Teen ≤ 58 % of height at x 62 %; curb y 84 % | as L |
| 768×1024 (P) | cols 1–5 of 8, y 8–33 % across the top, lamp bulb right of it | Camera 25 % closer: teen knees-up, right of centre (x 62 %), lamp top-right x 80 % | Toggle bottom-left |
| 390×844 / 664 (S) | cols 1–3 (col 4 belongs to the lamp head), y 9–32 % (664: 11–40 %) | Teen waist-up in the bottom 55 %; lamp head x 82 %, cone falls below the headline | Counter and skip share the top-right row; toggle bottom-left; cue above it |
| 320×568 | cols 1–4 (lamp head moves above the headline's right end), y 12–44 % | Teen chest-up, bottom 50 % | counter hidden |
- **Recomposes:** camera distance (full figure → knees-up → waist-up), headline from 5-of-12 to 3-of-4, lamp from the corner to a column of its own at S.
- **First-fold check:** while the prompt is open the headline is still masked; the lamp, curb and teen are visible above the prompt at all rigs. After hand-off, H is complete above the fold at every reference size (390×664: bottom of H at 40 %, teen starts at 45 %).
- **Motion hook:** loader hand-off (CD §5): `l1` then `l2` ink-in after the 4 % push; T1 starts at 50 vh / 40 svh.
- **Accessibility:** the only `h1` on the page. Alt S1.

### S2 · The pressure to fit in is real (h2)
- **Job:** Say the pressure is real, and that "no" is available. Nobody is a villain.
- **Content:** `<h2>` THE PRESSURE TO FIT IN IS REAL. / BUT YOU NEVER HAVE TO SAY YES. (Y). Balloons are wordless art (no text, `aria-hidden`).
- **Layout**

| | H | A | Controls |
|---|---|---|---|
| ≥1440 | **cols 1–5**, y 14–55 %, unlit wall top-left | Teen left third (x 30 %); peers + giant red-rough shadows right half; bulb top-centre x 50 % (hard small pool); balloons cascade from top-right | UI reserves clear |
| 1024×768 | **cols 1–6** (typography's request), y 12–51 %; bulb x 54 %, below y 40 % so the zone stays flat | Teen x 28 %; peers x 58–92 % | as L |
| 768×1024 | cols 1–5 of 8, y 8–28 % | Two peers (third cropped at the right edge); balloons run down the right; teen left | |
| 390 | cols 1–3, y 9–32 % (664: 11–40 %); **bulb sits below the headline at y ≥ 42 %** | We stand behind the teen (lower-left, cropped at the waist); one peer + all three shadows; fewer balloons | |
| 320 | cols 1–4, y 12–44 % | as 390, balloons ≤ 3 | |
- **Recomposes:** cast 3 → 2 → 1 peers, shadows kept (they carry the idea), viewpoint to over-the-shoulder at S.
- **Motion hook:** T1 walk ends with the teen stopped; balloons enter at the right edge in the last 20 % of T1; hold: balloons drift, then idle ≤ 5 s.
- **A11y:** h2; alt S2 (names the pressure in words, without implying anyone is bad).

### S3 · It may look like just one (h2) — M1, M2
- **Job:** Nicotine is addictive; teens can get hooked faster. The cigarette is small and unglamorous.
- **Content:** `<h2>` IT MAY LOOK LIKE JUST ONE. / BUT NICOTINE CAN LEAD TO ADDICTION. (line 2 red `#F04452` on `#101014`). Captions: **M1** "Nicotine is addictive." (FDA, 2026) then **M2** "Teens can get hooked faster." (FDA, 2026 · CDC, 2024).
- **Layout**

| | H | C (slot) | A |
|---|---|---|---|
| ≥1440 | cols 1–5, y 14–55 %, dark brick top-left | Stacked M1 over M2 in cols 1–4, bottom edge ≥ 88 px above the viewport bottom (clear of the toggle); x ≤ 33 % | Face right third, **eye on the upper-third line (y 33 %)**; hand lower-centre (x 45 %, y 70 %); cigarette ≤ 5 % of width on a lower third, never centred; tallies climb upper-right |
| 1024×768 | cols 1–6, y 12–42 % | Stacked cols 1–4 (≤ 38 % x); box tops ≥ y 52 % | Hand moves to x 56 % so boxes clear it |
| 768×1024 | cols 1–4 of 8, y 8–37 % | Full-width (cols 1–8), M1 and M2 stacked, bottom ≥ 88 px up, tops ≥ y 72 % | Face top-right (x 70 %, y 28 %); hand lower-centre (x 50 %, y 58 %) above the boxes |
| 390×844 | cols 1–3, y 38–60 % (below the eyes) | Cols 1–3, stacked, y 62–86 %; hand small at x 72–100 %, y 74–90 % (clear of boxes) | Eyes-and-nose crop across the top 35 %; tallies up the right edge |
| 390×664 | y 42–62 % (headline 33 %) | **Sequential** single slot y 64–84 % | crop top 38 % |
| 320 | cols 1–4, sequential | sequential | tallies thin out |
- **Recomposes:** face moves right-third → top-right → top-crop; captions from stacked-left to full-width to sequential; the hand shrinks.
- **Focal point:** the teen's eye (strongest rim light) at every rig; the cigarette is never the focal point.
- **Motion hook:** T2 balloons break past the lens; M1 appears at hold 15 %, M2 at 45 %; tallies scratch in; no sound-dependent meaning. Red is ≤ 8 % of the frame here.
- **A11y:** h2; alt S3; captions are `<p>`. Red line 2 is also in words, so colour is not the only carrier.

### S4 · The damage isn’t always visible (h2) — M6, M4, M3, M5
- **Job:** Risks are real; show the body plainly, no horror.
- **Content:** `<h2>` THE DAMAGE ISN’T ALWAYS VISIBLE. / BUT THE RISKS ARE REAL. (line 2 red). Captions in order: **M6** "Smoking damages the lungs." (CDC, 2024) with marker 1 on the lungs; **M4** "Smoking is a major cause of heart and blood-vessel disease." (CDC, 2024) with marker 2 on the heart; **one combined box (no leader)**: "Smoking harms nearly every organ of the body." + "Smoking can cause cancer almost anywhere in the body." (M3 · M5, CDC, 2024).
- **Layout** (see wireframes §6.5)

| | H | C | A |
|---|---|---|---|
| ≥1440 | **cols 1–5**, y 14–55 %, alley darkness left | Cols 10–12 stack, y 24 / 42 / 62 %, hairline leaders to markers 1 and 2; combined box has none | Teen front view hips-to-crown at x 58 %; beam ≈ 22 % of width across the chest |
| 1024×768 | **cols 1–6**, y 12–51 % | **Sequential single slot** under the headline, cols 1–5, y 56–74 %; leader (hairline) runs from the visible box to its marker | Teen moves to x 66 % so headline (≤ x 51 %) and teen clear each other; beam 24 % |
| 768×1024 | cols 1–5 of 8, y 8–33 % | Two rows under the figure: row 1 = M6 (cols 1–4) + M4 (cols 5–8) y 66–80 %; row 2 = combined box (cols 1–8) y 82–90 %, bottom ≥ 88 px clear of the toggle; short leaders upward to markers | Figure centred, y 34–64 % |
| 390×844 | cols 1–3, y 9–32 % | **Two at a time**: A = M6 + M4 (stacked, y 64–88 %) with numerals 1 and 2 matching the ink markers; B = combined box replaces A at 55 % of the hold. No hairlines. | Chest fills the middle 50 % (y 33–62 %); headphones identify the teen |
| 390×664 | y 11–40 % | **Sequential**, one box at a time in y 68–88 % | chest y 40–66 % |
| 320 / 844×390 | | Sequential | |
- **Recomposes:** captions move from a right-hand column with leaders, to a sequential slot, to two rows, to two-at-a-time; the figure moves right at 1024 to clear the wider headline.
- **Content constraints:** anatomy per CD §4 (three-lobed right lung on the viewer's left, two-lobed left lung on the right, heart burgundy); no ribs, skeleton, tumours, blood. Red hatching is "a possibility never inked"; it is erased in T4.
- **Motion hook:** T3 beam sweep reveals the organs; hold sequence M6 → M4 → combined box (hold 0–35 / 35–70 / 70–100 %); hatching begins at the end of T3 and grows; at ≤ 390 the two-up swap at 55 %.
- **A11y:** h2; alt S4 describes lungs and heart (informative). Captions and markers: the numerals are `aria-hidden`; each caption's relationship to the organ is stated in the alt. Combined box is one `<p>` of two sentences.

### S5 · Your future is bigger than a cigarette (h2)
- **Job:** The reward for refusing: the frame widens; the future is bigger than the offer.
- **Content:** `<h2>` YOUR FUTURE IS BIGGER THAN A CIGARETTE. / BE STRONG ENOUGH TO SAY NO. (line 2 yellow). L1 uses `--t-hero`, the largest type in the story. No captions. Only the headline in the upper sky (SS §8 protected negative space).
- **Layout**

| | H | A |
|---|---|---|
| ≥1440 | **cols 1–9**, y 14–68 % (3 + 1 lines), sky only | **Horizon / vanishing point y = headline bottom + 6 % ≈ 72 %** (CD gave 58 %; see I-1), x 62 %; teen 12 % of height lower-centre (y 78–92 %); OZONE window small at the near right; moon outside the headline measure (x ≈ 84 %, y 10–20 %) |
| 1024×768 | cols 1–8, y 12–54 % | VP y 62 %; teen lower-centre |
| 768×1024 | cols 1–6 of 8, y 8–38 % | VP y 46 %; road runs up the frame; teen bottom-centre (y 76–92 %) |
| 390×844 | cols 1–4 (full zone), 3 lines of L1, y 9–35 % | Road from the bottom edge to a VP at **y 40 %**; teen bottom-centre |
| 390×664 | y 11–44 % | VP drops to y 48 % (camera tilts, more sky) |
| 320×568 | L1 four lines, y 12–57 % | VP y 62 %, road shorter |
- **Recomposes:** camera height and horizon; the avenue goes from landscape band to a road running up the frame; only the sky is text-safe, so the road gets shorter on short screens.
- **Motion hook:** T4 erase and widen (no type on screen 35–60 %); S5 line 1 inks in at ≈ 70–88 % of T4, line 2 at ≈ 85–100 %; avenue lights switch on toward the horizon; headphones on the teen.
- **A11y:** h2; alt S5. Yellow line 2 is also readable without colour.

### S6 · OZONE, we check IDs (h2)
- **Job:** OZONE's commitment, shown as a person doing a job at a counter. No teen at the counter, no equipment.
- **Content:** `<h2>` `<span class="l1">` OZONE (the wordmark lock-up, same component as the header; not an `<img>` without text) `</span>` `<span class="l2">` WE CHECK IDs. NO EXCEPTIONS. `</span>` (line 2 off-white). Caption (verbatim, OZONE's own statement, not a legal quote): "We verify identification, follow applicable tobacco laws, and do not sell cigarettes to anyone under 21." Shelves are flat black (no product). The ID card is generic: a photo square and lines, no seal or state.
- **Layout**

| | H | C | A |
|---|---|---|---|
| ≥1440 | L1 on the sign band top-centre-left; L2 cols 1–5 on the black shelves y 34–62 % (`--t-h2`, off-white) | One box cols 1–4, bottom ≥ 88 px up (clear of the toggle); may overlap the customer's dark shoulder, never the card or hands | Employee right of centre chest-up; **card at the thirds point (x 60 %, y 55 %)**; customer's shoulder at the left edge; cameo through the window |
| 1024×768 | same, L2 cols 1–5 y 30–58 % | cols 1–5 above the reserve | Card at x 58 %, y 52 % |
| 768×1024 | sign top; L2 across the shelves y 24–40 % (cols 1–6) | Full-width bottom, y 74–90 % | Employee and card centre; customer's hand enters from the left |
| 390 | stack: sign band y 9–19 %, L2 y 21–35 % (2 lines: "WE CHECK IDs." / "NO EXCEPTIONS."), art band y 37–63 %, caption y 66–88 % (3–4 lines) | stacked as listed | Face, hands and card; customer as **a hand only**; **no cameo** |
| 390×664 | caption becomes the last item and may start at y 70 %; art band y 36–60 % | | If the card band is under 150 px tall the camera crops tighter on the card |
| 320 | as 390, caption ≤ 5 lines | | |
- **Recomposes:** cast (customer shoulder → hand only), cameo removed at S, the sign/headline lock-up from top-left composition to a vertical stack.
- **Header wordmark** is hidden here (the scene has its own OZONE). 
- **Motion hook:** T5 window passes the lens; "OZONE" inks in on the sign band, then the pendant light reaches it; caption appears in the hold; the card handoff is the only action; no scanner, device, beep or screen.
- **A11y:** h2 reads "OZONE WE CHECK IDs. NO EXCEPTIONS."; alt S6 (informative: an adult employee reads an adult customer's ID card). The caption box is the only place the legal-adjacent wording appears; it is OZONE's statement, and L1 is in the Sources.

### S7 · Don’t start. Protect your future. (h2, final message)
- **Job:** The final message and sign-off; the walk as one finished page.
- **Content** (in DOM order): `<h2>` DON’T START. PROTECT YOUR FUTURE. (`.l1` "DON’T START." `--t-d1`, `.l2` "PROTECT YOUR FUTURE." `--t-d2`, black on paper), `art-slot` (alt S7: the seven-panel page), then `<p>` OZONE (wordmark lock-up) and `<p>` "WE CHECK IDs. WE FOLLOW THE LAW. WE PROTECT OUR COMMUNITY." (`--t-0` weight 600, ≤ 62 ch, black on paper 15.97). No button, no store link.
- **Layout** (paper `#F1EBDD`, panels with 2 px `#101014` borders)

| | Page |
|---|---|
| ≥1440 | Paper fills the viewport. Panels 1–6 in a 3×2 grid (cols 1–7), tall panel 7 on the right (cols 8–12); copy in the bottom margin (cols 1–9 for `.l1`), with ≥ 96 px clear at the bottom-left for the toggle. Then `--space-5xl` of bare paper before the back matter. |
| 1024×768 | Same, grid y 10–62 %, copy y 66–88 %; the page may run slightly past one viewport (§1.2); T6 rest shows the grid and the `.l1`. |
| 768×1024 | Portrait page: 3×2 grid on top, panel 7 full-width below, copy at the bottom; page ≈ 1.4 viewports. |
| 390 | 3×2 thumbnail grid (≈ 110 px panels), panel 7 full-width (aspect 4∶5), then copy; free scroll flows straight into the back matter. Thumbnails are `<use>` windows onto the world, `aria-hidden` (the page's alt covers them). |
| 320 | Thumbnails ≈ 90 px; copy `.l1` wraps to 2 lines |
- **Recomposes:** from one landscape spread to a portrait page to a phone column; free scroll replaces the pin at every size.
- **Ground:** `data-ground="paper"` from 55 % of T6 onward; UI flips (§3.2).
- **Motion hook:** T6 "the finished page" (signature 2): camera pulls out through the window; paper rises from the gutters; panels ink in in reading order; final copy inks in black; then a rest; the pin releases.
- **A11y:** h2; alt S7; the final copy is real text. Focus target for the skip link.

### 6.5 Wireframes (low-fi)

S4 at 1440×900 (L rig):
```
┌──────────────────────────────────────────────────────────────────────┐
│ OZONE                                       [SKIP TO THE MESSAGE] 04/07│
│ ┌──────────────────────┐                                              │
│ │ THE DAMAGE ISN’T     │              ·············                   │
│ │ ALWAYS VISIBLE.      │   ←leader─ 1 │ (lungs)    │   ┌─────────────┐ │
│ │ BUT THE RISKS ARE    │         ┌────┴─ beam ─────┴─┐│ Smoking     │ │
│ │ REAL.   (red)        │         │  heart  (2)  ─────┼┤ damages the │ │
│ └──────────────────────┘         └───────────────────┘│ lungs. CDC  │ │
│                                    teen, x 58%        └─────────────┘ │
│ [(•) SOUND ON]   reserve                                (M4, M3+M5 …) │
└──────────────────────────────────────────────────────────────────────┘
```
S4 at 390×844 (S rig), state A:
```
┌────────────────────────┐
│ OZONE   [SKIP…] 04/07  │
│ THE DAMAGE ISN’T       │
│ ALWAYS VISIBLE.        │
│ BUT THE RISKS ARE REAL.│
│      ┌──── chest ───┐  │
│      │ (1) lungs    │  │
│      │ (2) heart    │  │
│      └──────────────┘  │
│ ┌──────────────────┐   │
│ │1 Smoking damages…│   │
│ └──────────────────┘   │
│ ┌──────────────────┐   │
│ │2 Smoking is a …  │   │
│ └──────────────────┘   │
│ [(•) SOUND ON]         │
└────────────────────────┘
```
Loader prompt at 390×844:
```
┌────────────────────────┐
│ (curb line ————— 62%)  │
│    lamp, teen, street  │
│ SOUND IS PART OF THE   │
│ EXPERIENCE             │
│ Original music and…    │
│ [ENTER WITH SOUND  →]  │  56 px, yellow
│ [CONTINUE WITHOUT SND] │  56 px, outlined
└────────────────────────┘
```

---

## 7 · Interaction states (every control)
Hover is gated by `@media (hover:hover)`; touch uses `:active`. Focus: **3 px `#F5D547` ring with a 2 px `#101014` offset on dark; 3 px `#101014` ring with a 2 px paper offset on paper** (SS/CD §2; ≥ 9.8:1 / 15.97). Reduced motion: no transforms; state changes are colour/border only.

| Control | Default | Hover | Focus-visible | Active | Disabled / busy | Loading / error / success |
|---|---|---|---|---|---|---|
| **ENTER WITH SOUND →** | `#F5D547` fill, `#101014` text, arrow SVG | Arrow nudges 4 px right; 2 px `#101014` inset border | Ring (dark ground) | `translateY(1px)`, inset border 3 px | After click: `aria-disabled="true"`, no style change (dialog closes in 300 ms) | Failure to start audio is reported on the toggle and announcer, not here |
| **CONTINUE WITHOUT SOUND** | Transparent, `#F1EBDD` text, 1.5 px `#F1EBDD` border | Border 3 px | Ring | Fill `#F1EBDD`, text `#101014` | As above | — |
| **Sound toggle** | §3.2 (OFF: outlined chip; ON: yellow chip) | Border 3 px | Ring (paper variant on paper) | `translateY(1px)` | `aria-busy` while resuming (chip shows a single dot) | Error: chip stays OFF + announcement; unavailable: text-only status |
| **Skip to the message** | Pill, §3.3 | Border 3 px; arrow nudge | Ring | `translateY(1px)` | `inert` from S7 | — |
| **SKIP INTRO** | Text button, off-white, 1.5 px underline | Underline 3 px | Ring | Opacity .8 on the label (non-text, ≥ 3:1 maintained) | Removed when the prompt shows | — |
| **Read the story as text** | Off-white link, 2 px underline, offset .15em | Underline 3 px | Ring | — | — | Navigation to `?view=text` (page reload with the same scroll-less start) |
| **Try again** | As CONTINUE | as above | Ring | as above | `aria-busy` while re-fetching | success: loader resumes; second failure: message persists, link stays primary |
| **Back-matter links** (sources, CDPH resource) | `#101014`, 2 px underline, offset .15em, min 44 px tall hit area (padding) | Underline 4 px | Ring (paper) | Underline 4 px + text `#101014` | — | External links open in the same tab; the browser's back button returns to the scroll position |
| **Switch to the animated story** (static, text-view only) | Link as above | | | | | Reload to story mode |
| **Progressbar, counter, SCROLL cue, wordmark** | Non-interactive | — | not focusable | — | — | — |

Empty state: none (no lists, no forms, no search). No form fields exist on the page; there is no error state for input.

---

## 8 · Back matter (sources, resource, credits)
Same paper after S7; `<section id="sources" aria-labelledby>` in `<main>`, credits in `<footer>`. Measure 62 ch, left-aligned on col 1 (SS §6). 2 px `#101014` hairlines between groups. Text black on paper (15.97). At ≥ 1024 the section heading occupies cols 1–4 and the list cols 5–11 (single column below 1024); the layout is a plain document.

- `<h2>` **Sources** (display 700, `--step-3`, sentence case). One intro line: "Every health statement in this story comes from a public source below."
- `<h3>` **Health facts**: one entry each, in this order, each an `<article>` or `<li>`: the **page wording** in bold, publisher and title, the date as shown on the source, the link, and "Used in scene N".
  | Wording | Source line | Link text → URL (FS) | Used in |
  |---|---|---|---|
  | Nicotine is addictive. (M1) | FDA, "Nicotine Is Why Tobacco Products Are Addictive", content current as of 08/17/2026 | https://www.fda.gov/tobacco-products/health-effects-tobacco-use/nicotine-why-tobacco-products-are-addictive | Scene 3 |
  | Teens can get hooked faster. (M2) | FDA (page above) and CDC, "Youth and Tobacco Use", Oct 17, 2024 | https://www.cdc.gov/tobacco/php/data-statistics/youth-data-tobacco/index.html | Scene 3 |
  | Smoking harms nearly every organ of the body. (M3) | CDC, "Cigarette Smoking", Sep 17, 2024 | https://www.cdc.gov/tobacco/about/index.html | Scene 4 |
  | Smoking is a major cause of heart and blood-vessel disease. (M4) | CDC, "Health Effects of Cigarettes: Cardiovascular Disease", Sep 17, 2024 | https://www.cdc.gov/tobacco/about/cigarettes-and-cardiovascular-disease.html | Scene 4 |
  | Smoking can cause cancer almost anywhere in the body. (M5) | CDC, "Health Effects of Cigarettes: Cancer", Sep 17, 2024 | https://www.cdc.gov/tobacco/about/cigarettes-and-cancer.html | Scene 4 |
  | Smoking damages the lungs. (M6) | CDC, "Health Effects of Cigarettes: COPD", May 15, 2024 | https://www.cdc.gov/tobacco/about/cigarettes-and-copd.html | Scene 4 |
  (M7 and the "not used" statistics stay out.)
- `<h3>` **Federal law**: "Federal law prohibits selling tobacco products to anyone under 21." (L1) FDA, "Tobacco 21", content current as of 08/07/2025, https://www.fda.gov/tobacco-products/retail-sales-tobacco-products/tobacco-21. No California statement anywhere (FS: BLOCKED).
- `<h3>` **Resource**: one link, "California Department of Public Health, Tobacco Control Branch", as a resource only, with no claim attached. **Ships only when its home-page URL has been read and confirmed** (CDPH returned 503; open issue I-2).
- Footer `<h2>` **Credits**: "Illustration, music and sound are original, made for this page." plus the two font licences (OFL-1.1, TS §2) and "Facts checked November 18, 2026." (written as a date, `2026-11-18` in a `<time datetime>`).
- Link targets 44 px tall; links never rely on colour alone; link text is the source title (not "click here"); URLs are visible text under the title (`overflow-wrap:anywhere`) so a printed copy keeps them.
- Motion hook: none. Static from first paint. Score fades to silence under it (CD §7).

---

## 9 · Responsive rules

### 9.1 What re-composes per rig
| | L (1440) | M (1024×768) | P (768×1024) | S (390 / 320) |
|---|---|---|---|---|
| Columns / margin | 12 / 64 | 12 / 40 (8 col below 1024) | 8 / 32 | 4 / 20 (16 ≤ 374) |
| Image crop | 16∶9 framing | L framing + extra top and bottom bleed (more sky/ground) | Camera ~25 % closer, subject nudged right of centre | Tight crops: teen waist-up, S3 eyes-and-nose, S4 chest, S6 hand-only |
| Cast | full | full | S2 two peers | S2 one peer + 3 shadows; S6 customer as a hand, no cameo |
| Headline | 5-of-12 (S5 9) | 5–6-of-12 (S5 8) | 4–6-of-8 | 3-of-4 (S5 4) |
| Captions | right/left columns, stacked, leaders | sequential slot where the headline is wide (S4) | full-width rows at the bottom | two-at-a-time or sequential, stacked under the headline |
| Below the fold | nothing (pinned) | nothing | nothing | nothing; S7 page flows into the back matter |
| Pin length | 1210 vh | 1210 vh | 1210 vh (svh) | **0.8×** (1010 svh) |
| Nav | top bar, bottom-left toggle | same | same | top bar compressed (counter hides ≤ 359), toggle bottom-left |

### 9.2 Touch equivalents
There is no hover-only idea in the story. Scroll is drag/flick on touch; no gesture other than vertical scroll is required (WCAG 2.5.1/2.5.7). The ink reveals and sequential captions are scroll-driven, so they work with a finger exactly as with a wheel.

### 9.3 Zoom and reflow
- **200 % at 1440×900** → ≈ 720×450 CSS px: rig M, height ≥ 360, story mode; type from role tokens in `rem` so it scales; headline and caption boxes are content-driven (no fixed heights, `overflow:visible`).
- **400 % (≈ 320×200 on a laptop) or any height < 360 CSS px:** static comic mode automatically (§1.1); single column, no horizontal scroll at 320 px width (WCAG 1.4.10).
- **Text-spacing overrides (1.4.12):** boxes and slots grow; captions overflow a slot → sequential (6.1 rule 6); nothing is clipped.
- **320 px width:** every scene has a 320 row in §6. Zone widths 288 px; no horizontal page scroll at any width (SS §10: verified on the specimen).

### 9.4 Orientation change and resize
Not locked to an orientation. On `resize`/`orientationchange` (debounced 200 ms) the app re-picks the rig **only if the aspect bucket or width changed** (height-only changes under 120 px, such as a URL-bar collapse, are ignored; pins use `svh`). It stores `{scene id, local progress}`, rebuilds, and scrolls to the equivalent position; no scene jump, no loader replay, the audio keeps playing, an open sound dialog keeps focus and re-lays out in place.

### 9.5 Large screens
≥ 1920: the camera shows more bleed, the text zone stays at 1680 px (SS §2), type tokens cap (TS §5), captions ≤ 34 ch.

---

## 10 · Accessibility plan (WCAG 2.2 AA)

### 10.1 Landmarks and document
`lang="en"`. Title: "OZONE — Make sure your story starts right". Landmarks: `<header>` (wordmark, counter, controls), `<main id="main" tabindex="-1">` (scenes and Sources), `<footer>` (credits), the loader dialog, one polite live region. No `<nav>` (decision D-4). Skip link first. `viewport` allows zoom (no `user-scalable=no`).

### 10.2 Heading outline (one h1)
```
h1  EVERY STORY STARTS SOMEWHERE. MAKE SURE YOURS STARTS RIGHT.        (S1)
h2  THE PRESSURE TO FIT IN IS REAL. BUT YOU NEVER HAVE TO SAY YES.     (S2)
h2  IT MAY LOOK LIKE JUST ONE. BUT NICOTINE CAN LEAD TO ADDICTION.     (S3)
h2  THE DAMAGE ISN’T ALWAYS VISIBLE. BUT THE RISKS ARE REAL.           (S4)
h2  YOUR FUTURE IS BIGGER THAN A CIGARETTE. BE STRONG ENOUGH TO SAY NO.(S5)
h2  OZONE WE CHECK IDs. NO EXCEPTIONS.                                 (S6)
h2  DON’T START. PROTECT YOUR FUTURE.                                  (S7)
h2  Sources
   h3 Health facts · h3 Federal law · h3 Resource
h2  Credits                                                            (footer)
```
Loader prompt, toggle and counter contain no headings.

### 10.3 Focus order across the sticky stage
Skip link → sound toggle → (scenes: none) → Sources links in order → CDPH link → footer. The loader reorders temporarily (§5.3). Focus never lands on hidden or off-screen scene copy because none is focusable. Focus-not-obscured: scroll-padding (3.1) and the fixed UI never covers a focused back-matter link at 320 px (tested at 400 %: static mode, toggle bottom-left 48 px high).

### 10.4 Criteria checklist
| SC | How it is met |
|---|---|
| 1.1.1 Non-text | Alt per illustration (10.5); decorative art `aria-hidden`; icons decorative; arrow SVG hidden. |
| 1.2.x | No speech or video; the score and SFX carry no information (CD §7). |
| 1.3.1 / 1.3.2 | Real headings, DOM order = reading order = visual order of copy; the SR path equals the static comic. |
| 1.4.1 | Risk lines are red *and* worded; toggle state is text + icon + aria-pressed. |
| 1.4.3 / 1.4.11 | Pairs in TS §7; rings ≥ 9.8:1; toggle border off-white on dark; art ≥ 3:1 for informative lines. Worst-pixel measurement at every hold and every transition midpoint at 390 / 768 / 1024 / 1440 (QA). |
| 1.4.4 / 1.4.10 / 1.4.12 | §9.3. |
| 1.4.13 | No hover/focus popups. |
| 2.1.1 / 2.1.2 | Everything keyboard-operable; the only trap is the sound dialog, with Escape. |
| 2.2.1 / 2.2.2 | No time limits; idle motion ≤ 5 s per hold; audio has a page-level control. |
| 2.3.1 | No flashing; glare and beam ramps are scroll-bound and ≥ 400 ms-equivalent (6.4). |
| 2.4.1 / 2.4.2 / 2.4.3 / 2.4.6 / 2.4.7 | Skip link; title; order 10.3; descriptive headings; visible focus. |
| 2.4.11 | Focus not obscured: scroll-padding; fixed UI only in corners. |
| 2.5.1 / 2.5.2 / 2.5.7 / 2.5.8 | Single-pointer, no path-based gestures, no dragging; targets ≥ 44 px (`--target`), ≥ 24 px between adjacent targets. |
| 3.1.1 | `lang`. |
| 3.2.1 / 3.2.2 | No context change on focus or on toggle (only audio). |
| 3.3.x | No inputs. |
| 4.1.2 / 4.1.3 | Names, roles, states (progressbar, dialog, aria-pressed); status messages via the polite region. |

### 10.5 Alt text plan
Informative illustrations get specific alt (on `.art-slot`); the same string is used in the static comic. Alt reflects what is true at every rig (no cameo or crowd details that vanish at S).
- **S1:** "Dusk at a school corner. A teenager with yellow headphones around their neck stands under a single streetlamp, looking down the street."
- **S2:** "Behind a closed laundromat, teenagers lounge against a brick wall under one bare bulb. Their shadows climb the wall, drawn as red pencil sketches, and blank speech balloons crowd in around a teenager who has stopped, hand on their backpack strap."
- **S3:** "Close-up of the teenager leaning back, wary, as a hand from the edge of the frame holds out one unlit cigarette. Red pencil tally marks climb the brick wall behind."
- **S4 (informative anatomy):** "The teenager faces us as a band of headlight crosses their chest and shows what is inside: two lungs and a heart, drawn plainly. Red pencil hatching begins to sketch over the lungs and the heart's blood vessels, a risk not yet drawn in ink."
- **S5:** "From high above, the teenager, now wearing their yellow headphones, walks away down a wide avenue at night. The red pencil marks are gone. Streetlights lead to the horizon and a small lit OZONE window sits on the near corner."
- **S6 (informative ID check):** "Inside OZONE, an employee behind the counter reads an adult customer's ID card, held out across the counter. Only the customer's hand and shoulder are in view."
- **S7:** "The finished comic page: seven panels showing the walk, from the school corner to the wall, the offer, the beam of light, the avenue, the OZONE counter, and the teenager walking toward the horizon."
- **T4 bridge (static):** "The teenager holds up an open palm. Where it points, the red pencil sketches fade away and the headphones go on."
- **T5 bridge (static):** "The teenager walks past OZONE's window, its light sliding across them, and keeps going."
- **Decorative (`aria-hidden`, `alt=""`):** grain, halftone, leaders, markers, balloons, thumbnails, T1/T2/T3/T6 bridges, counter, scroll cue, icons.

### 10.6 Reduced motion, per scene
Global: static comic (§1.3), no scrub, no idle, no parallax, ≤ 200 ms fades only (also skipped on `reduce` for panel entry). Sound is still offered.
| Scene | Reduced-motion expression |
|---|---|
| Loader | Plain bar + %, S1 shown complete, same prompt. |
| S1 | Complete frame; teen at rest. |
| S2 | Static frame with balloons placed; T1 bridge shows the walking teen crossing the gutter. |
| S3 | All of M1 and M2 visible; tallies placed; T2 bridge shows balloons in the gutter. |
| S4 | Settled beam, organs, roughs; all captions visible; T3 bridge shows the beam edge. |
| S5 | Erased and widened state; T4 bridge shows the eraser and palm. |
| S6 | Counter frame complete; T5 bridge shows the window. |
| S7 | The page, as in story mode. |

### 10.7 What could still fail (honest limits)
Screen-reader cursor jumps into non-visible scenes do not scroll the stage (1.2); device testing on iOS Safari and Android Chrome is NOT TESTED (CD/brief); scroll-linked audio state on iOS interruptions is by design but unverified.

---

## 11 · Conversion and CTA strategy

This page sells nothing and asks for nothing. Hierarchy of actions, from most to least prominent:
1. **Scroll** (the story itself): SCROLL cue, once.
2. **Sound** (ENTER WITH SOUND is the primary on the prompt; the toggle afterwards).
3. **Skip to the message** (quiet, always available; not hidden to force completion).
4. **Sources** (transparent, at the end).
5. **One resource link** (CDPH) in the back matter, no pop-up, no tracking.

Not present, by design: store links, offers, address, hours, phone, social, newsletter, share buttons, exit prompts, scroll-jacking beyond the pins, countdowns, guilt copy, re-asking for sound. OZONE's commitment is delivered by S6 and the S7 sign-off, not by a button.

---

## 12 · Decisions, open issues and checks

**Decisions made (reversible)**
- D-1 Escape in the sound dialog = CONTINUE WITHOUT SOUND.
- D-2 A returning visitor who last chose "without sound" gets no prompt; one who chose sound gets the compact prompt (browsers still need a gesture).
- D-3 Header wordmark is not a link or a tab stop (a scroll story's "home" is the start, and there is nowhere else to go).
- D-4 No `<nav>`; counter is non-interactive; swap for seven scene links if keyboard testing asks.
- D-5 Static comic uses a flat text plate (side or below), not overlaid text, so legibility never depends on art.
- D-6 Static mode below 360 CSS px height (zoom and 320-high landscape).
- D-7 Toggle and skip are opaque pills so contrast cannot fail over any art or mid-transition.

**Open issues**
- I-1 **S5 horizon vs headline.** With TS tokens the S5 headline block is about 485 px (54 % of 900) at 1440×900, so "upper 40 %" and a 58 % vanishing point cannot hold. Spec: horizon = headline bottom + 6 % (≈ 72 % at 1440, 62 % at 1024×768, 40–48 % at 390). Also the moon must sit outside the headline measure (high right, not high left). Owner: creative-director (art), typography-spacing (confirm hero size).
- I-2 **CDPH link URL** is unverified (CDPH 503, FS). The link ships only after a source read confirms it. Owner: technical-lead / researcher.
- I-3 **Display type clamp by height** for short landscape (844×390, 1024×768). Owner: typography-spacing.
- I-4 **Text-safe-zone art notes** (§2.1, §3.1 reserves) must be accepted by the illustration owners; the S4 teen moves to x 66 % at 1024×768. Owner: ai-visuals / creative-director.
- I-5 **No quit-help or teen cessation resource** is in FS; none is added. If the client wants one, a verified source is needed. Owner: orchestrator.
- I-6 **Source tags (agency + year)** in caption boxes are a small addition to the CD caption rule; confirm. Owner: creative-director.

**Checks run on this document**: every headline, caption and legal/medical sentence string-matched against the brief and FS (all present, verbatim); contrast pairs taken from the measured tables in CD §2 and TS §7 (no new colour pairs introduced); headline-block budgets are estimates, not browser measurements.
