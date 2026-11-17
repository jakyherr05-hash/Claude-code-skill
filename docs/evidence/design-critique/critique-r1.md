# Penumbra: render critique, round r1 (visual-critique.md, rubric A–H)

Reviewer: creative-director · Date: 2026-11-17 · Build: current production build (`vite preview`)
Concept under test (CREATIVE_DIRECTION.md): **"We design the dark first."** Dark ground, one lit focal element per viewport, numbers as ornament, slow "dimmer" motion.

## Evidence used
- `EV/` = `/tmp/claude-0/-home-user-Claude-code-skill/224276a2-c2aa-5898-b6d9-eebe905c6165/scratchpad/critique/before/` (supplied captures)
- `MS/` = `/tmp/claude-0/-home-user-Claude-code-skill/224276a2-c2aa-5898-b6d9-eebe905c6165/scratchpad/critique/measure/` (my own Playwright measurements on `localhost:4341`; server stopped afterwards)
  - `m1.json`: per-width layout/line-break/target measurements at 360/390/768/1024/1440/1920, taken after scrolling the page through and letting it settle.
  - `notext-<w>.png`: hero with the text made transparent, used for a worst-pixel contrast check.
  - `hdr-768.png`, `hdr-1024.png`, `hdr-390.png`: The Hour scrolled under the fixed header.
  - `manif-<w>.png`: manifesto after settle.
  - `rm-<w>-*.png`: reduced-motion pass (`reducedMotion: 'reduce'`) at 390/1024/1440.
- Images I opened myself: desktop-0, mobile-0, tablet-portrait-0, tablet-landscape-0; scroll-01…11; all 8 sections at 390, 768 and 1024; 1440 the-hour/work/atelier; 1920-02-method; every `MS/` image I cite. I did **not** open the 360 section PNGs (measured only), the other 1920 PNGs, or 1440-00/01/02/05/07. At 1440 I judged those sections from the filmstrip instead.

## What passes (scored ok, not listed below)
- **A. Hero contrast, measured on the worst pixel under the glyphs** (text hidden, max luminance in the glyph box, `MS/notext-*.png`). H1: 13.85:1 at 390, 13.37:1 at 768, 11.47:1 at 1024, 11.61:1 at 1440. Sub-line (`--ink-muted`): 6.62, 6.63, 5.72 and 5.84:1. All pass AA. The shaft never sits under text.
- **A. Fold.** The H1 is fully above the fold at 390×844 (y 523–634) and 1024×768 (y 390–599). The concept reads in the first viewport at every width.
- **F. Reduced motion.** Native scroll: a 600px wheel lands in ≤ 1 frame at 390 and 1024. No pin-spacers. The Method renders as three stacked, fully annotated drawings. No text is left below 0.95 opacity. The Hour canvas and the room plates render once they are in view (`MS/rm-1440-hour.png`, `MS/rm-1024-rooms.png`, `MS/rm-390-hour.png`). (The blank Hour and plates in the full-page `rm-*-full.png` come from lazy-loading in a full-page shot. They are not a defect.)
- **H. Default-site detector.** No default patterns found. There is no centred hero, no card trio and no carousel. The type is a serif/grotesk/mono trio, each with a role. The concept could not be used by a competitor unchanged.
- **E.** The accent stays rare. Plates, shader and drawings share one light direction and one warm grade.
- **G.** No horizontal overflow at any width (`m1.json → overflowX = 0`).

## Findings (minor or worse only)

Format: severity · label · viewport(s) · section › element · what is wrong · evidence and measurement · why it hurts · desired outcome · owner.

### Major

**1. MAJOR · CONFIRMED · 390, 768, 1024, 1440 (one CSS rule, so every width) · Global › `header.site-header` against scrolling content**
- **What:** The header ground fades from `--ground` to fully transparent across its 64px height (`linear-gradient(rgb(13,12,11) 0%, … / 0 100%)`, `m1.json → header`). The wordmark and nav sit about halfway down that fade. Content scrolling underneath shows through and collides with them:
  - `PENUMBRA` over the kicker "METHOD · DARK FIRST" (`EV/scroll-04.jpg`).
  - `PENUMBRA` over The Hour preset chips 06:10/10:00 (`EV/scroll-05.jpg`; `MS/hdr-1024.png`; `MS/hdr-768.png`).
  - Room meta "Peniche, Portugal · 2024" butting against the wordmark (`EV/scroll-07.jpg`).
  - Manifesto lines running under the nav links (`EV/scroll-01.jpg`).
  - At 1024 the Hour canvas's warm edge shows behind "START A PROJECT" (`MS/hdr-1024.png`, top right).
- **Why:** Collision in the one element that is on screen on every frame. Text sitting on text reads as broken, and it fails the brief's "rule of one lit thing per viewport".
- **Desired:** The text band of the header (0 to ~56px) sits on an opaque `--ground`, with the fade only below it (for example a solid ground plus an 8–16px fade, or a solid backing that appears after scrolling past the hero). Re-capture `scroll-04/05/07` and `hdr-768/1024`.
- **Owner:** frontend-engineer (CSS), sign-off ui-ux.

**2. MAJOR · CONFIRMED · 768 (minor at 360/390) · Hero › `.cta` "Start a project →"**
- **What:** At ≤ 768 the CTA stretches to the full column width. Its box is 712px at 768, 349px at 390 and 320px at 360, while the label is only 168 / 167 / 167px. The resting underline is `scaleX(0.35)` of the *box*, so it measures 249px at 768, which is longer than the label and overshoots it by about 80px (`EV/tablet-portrait-0.jpg`, `EV/768-00-top.png`). At 390 it is 122px, about 73% of the label (`EV/mobile-0.jpg`). At ≥ 1024 the box equals the label and the underline is about 60px, covering just "START" (`EV/desktop-0.jpg`, `EV/tablet-landscape-0.jpg`).
- **Why:** In the five-second viewport the only call to action ends in a rule that runs on into empty space. That reads as a bug. The CTA also has a different rest state at each breakpoint, and the whole 712px-wide row is a mailto hit area.
- **Desired:** The CTA shrinks to its content (`align-self: start` / `justify-self: start` / `width: max-content`), so the underline is the same proportion of the label at every width.
- **Owner:** frontend-engineer.

**3. MAJOR · CONFIRMED · 768 · Lighting schedule › `table.sched__table` (columns Year/Type, cells "Sacred space", "Peniche, Portugal")**
- **What:** Tablet portrait gets the desktop six-column table, squeezed:
  - Only a 12px gap between Year text (right edge 495) and Type (left edge 507), in both header and rows, so "2025 Sacred" reads as one phrase.
  - Type cells wrap to two lines: "Sacred / space", "Private / house". Place cells wrap too: "Peniche, / Portugal", "Comporta, / Portugal".
  - Project cell 01 runs to 4 lines.
  - Evidence: `EV/768-05-sched.png`; `m1.json → 768.schedHead / schedRow1`.
- **Why:** This is the "calm browsing" index and the proof of precision. Ragged two-line cells and cramped columns undo the schedule-sheet discipline. It is a shrunken desktop, not a tablet composition (rubric G).
- **Desired:** A tablet layout of its own. Either use the mobile two-line entries from 768 up to about 1000px, or a 4-column table (No. · Project + intent · Place/Year stacked · CCT) with Type folded into the meta line. No wrapped meta cells, and column gaps of at least `--space-m`.
- **Owner:** ui-ux (layout), then frontend-engineer.

**4. MAJOR · CONFIRMED · 768 · Atelier › `ul.atelier__plates` (3 luminaire plates)**
- **What:** Three plates in a 2-column grid. Plates 1–2 sit at x 28 and x 395 (345px each); plate 3 sits alone at x 28, y +396, leaving an empty 345×375 cell beside it (`EV/768-06-atelier.png`; `m1.json → 768.atelierPlates`).
- **Why:** An orphaned third item in a set of three is the most visible "squeezed, not composed" signal on the tablet page. It breaks the triptych that makes "spun, blown, finished" read as one set.
- **Desired:** At 768 keep the triptych: 3 columns at about 225px with captions underneath, or one large plate plus two half-height plates stacked. Never 2+1.
- **Owner:** ui-ux, then frontend-engineer.

### Minor

**5. MINOR · CONFIRMED · 1024 · Atelier › `p.atelier__line` "…two streets away."**
- **What:** The last line of the display line is the single word "away." (`EV/1024-06-atelier.png`; `m1.json → 1024.atelier.last = "away."`).
- **Why:** The rubric's C rule is a word alone on a display last line. This is the brand's human-scale sentence, and it ends on a lone word.
- **Desired:** `text-wrap: balance` on `.atelier__line` (or a tuned max-width), then re-check the screenshot at 768, 1024 and 1440.
- **Owner:** typography-spacing.

**6. MINOR · CONFIRMED · 1024, 1920 · The Hour › intro `p` "Drag through a day… and we begin."**
- **What:** The last line is the single word "begin." (`EV/1024-03-the-hour.png`; `m1.json → 1024/1920.hourIntro.last = "begin."`).
- **Why:** A lone-word last line on a lead paragraph that sits beside the signature interactive.
- **Desired:** `text-wrap: pretty` on the intro.
- **Owner:** typography-spacing.

**7. MINOR · CONFIRMED · 360, 390, 1024, 1440 · The Hour › `.hour__presets .chip` (6 hour presets)**
- **What:** The six presets wrap unevenly:
  - 5+1 at 390 and 1440: "00:00" alone on row 2 (`EV/390-03-the-hour.png`, `EV/1440-03-the-hour.png`).
  - 4+2 at 360 and 1024 (`EV/1024-03-the-hour.png`).
  - Measured row offsets are in `m1.json → hourPresets`. Only 768 and 1920 fit on one row.
- **Why:** The presets are a 24-hour sequence. An orphaned "00:00" breaks the reading of a day as one continuous strip, and the control block looks unplanned.
- **Desired:** A deliberate grid. Either 3×2 everywhere or 6×1 with chips that flex to fill. Never an orphan.
- **Owner:** ui-ux, then frontend-engineer.

**8. MINOR · CONFIRMED · 360, 390 · Lighting schedule › `.sched__filters .chip`**
- **What:** The filter chips wrap 4+1, leaving "HOSPITALITY" alone on row 2 (`EV/390-05-sched.png`; `m1.json → 390.schedChips.rows = 2`).
- **Why:** Same orphan problem as #7, at the top of the index.
- **Desired:** Fit on one line (tighter chip padding at ≤ 400 or a shorter label set), or use a deliberate 3+2 / horizontally scrollable row with a visible edge.
- **Owner:** ui-ux.

**9. MINOR · CONFIRMED · 1024, 1440 · Method › closing line "Every hour has its own light." (italic display, `--accent-warm`)**
- **What:** It is set at 38px with a 61px line-height at 1024, and 45px with 72px at 1440. That is a 1.6 ratio at display size, wrapping to 2 lines ("Every hour has its / own light.") (`EV/scroll-04.jpg`; `m1.json → closingLineCS`).
- **Why:** The line-height should tighten as size grows (rubric C). At 1.6 the two lines drift apart and the hand-off line feels like two captions.
- **Desired:** Line-height about 1.1–1.15 for this display italic. Also consider keeping it on one line at ≥ 1024 (the column is 299–431px wide; it already fits on one line at 768 and 1920).
- **Owner:** typography-spacing.

**10. MINOR · CONFIRMED · 768, 1024 (near at all widths) · Method › SVG labels `8° · 25 lux` and `NICHE` in `.method-drawing`**
- **What:** The beam label ends 4–7px before the "NICHE" label on the same baseline band. Measured gaps: 5px at 768, 4px at 1024, 6px at 1440 and 7px at 1920 (`m1.json → methodLabelNear`). At 768 it reads as one label, "8° · 25 lux NICHE" (`EV/768-02-method.png`, also `EV/390-02-method.png`).
- **Why:** The drawing's credibility depends on unambiguous annotations. This was the class of failure behind W10.
- **Desired:** Move the niche beam label above the niche or to the left of the beam, with at least 12px clear of any other label at every width.
- **Owner:** frontend-engineer (MethodDrawing.tsx), sign-off creative-director.

**11. MINOR · CONFIRMED · 1440 (also 1024 per code) · Four rooms › `.room__intent`, `.room__meta`, `.room__spec`, `.link-arrow` (all `[data-lit]`)**
- **What:**
  - All caption text in a room, including the body intent line and the link, starts at opacity 0.08. It is only lit 0.8s after the plate reveal starts, with a 0.14s stagger, so it reaches full opacity about 2.3s after triggering (`Rooms.tsx` lines 17, 47–52).
  - In the filmstrip, captions are near-invisible while the plate is fully visible: "Hotel Alva" with its meta and intent sitting in the lower viewport but dimmed (`EV/scroll-08.jpg`); Capela captions faded (`EV/scroll-06.jpg`).
  - After settle all reach opacity 1 (`m1.json → roomMeta.op`).
- **Why:** CREATIVE_DIRECTION says "body copy is never animated". During that window the captions are about 1.1:1 against the ground, and someone scrolling at reading speed meets dark text beside a lit plate.
- **Desired:** Light only the room number and name (the headline). Show meta, intent, spec and link at once, or fade them in within `--dur-s` from ≥ 0.6 opacity.
- **Owner:** gsap-motion.

**12. MINOR · CONFIRMED · 360, 1024 · Four rooms › `p.room__meta` (e.g. "Évora, Portugal · 2025 · Sacred / space")**
- **What:**
  - At 1024 the meta wraps a lone "space" (Capela) and "house" (Casa Sombra) onto line 2.
  - At 360, "house" alone (Casa Sombra); the specs "4000 K · 50 lux on objects · 2 lux / hall" and "… 1.5 lux / corridor" wrap one word.
  - Evidence: `EV/1024-04-work.png`; `MS/rm-1024-rooms.png`; `m1.json → roomMeta`.
- **Why:** Mono spec strips should read as one engineered line. Lone words break the precision voice.
- **Desired:** Non-breaking spaces inside the type label ("Sacred space", "Private house"), and `text-wrap: balance` on meta/spec, or allow the text column to be wider at 1024.
- **Owner:** typography-spacing.

**13. MINOR · CONFIRMED · 1024 · Manifesto › `span.uline` "where darkness must stay"**
- **What:** At 1024 the marked phrase breaks across lines ("where" / "darkness must stay"), so the single warm line becomes two segments, x 448–570 and x 115–487 (`MS/manif-1024.png`, `EV/1024-01-manifesto.png`). It holds as one stroke at 390, 768 and 1440.
- **Why:** The brief asks for "a single thin warm line" under one phrase. A split stroke reads as two highlights.
- **Desired:** `white-space: nowrap` on `.uline` at ≥ 768 (the phrase is about 430px at 1024 display size, so it fits), then re-check the wrap of the whole paragraph.
- **Owner:** typography-spacing.

**14. MINOR · CONFIRMED · 360, 390 · Contact › email link `studio@penumbra.example`; Four rooms › `h3.room__name a`**
- **What:** Touch targets below the 44px studio rule at 390. The email link is 193×18 and the room-name links are 25px tall (`m1.json → smallTargets`). They pass the WCAG 2.5.8 24px minimum only by spacing.
- **Why:** Rubric G: targets ≥ 44px at 390. The email is a primary contact path on mobile.
- **Desired:** Give the email link `min-height: 44px` with inline-flex alignment (as `.link-arrow` already does). Room names may stay, because the plate is a large duplicate target, but say so in QA.
- **Owner:** frontend-engineer.

**15. MINOR · SUBJECTIVE · 768 (also 390) · Hero › WebGL shaft + H1 composition**
- **What:**
  - Tablet portrait reuses the phone composition: H1 at x 25–490 in a 768 frame, the right ~280px of the lower half empty.
  - The shaft is a short stroke ending mid-air at about y 490 and never lands on a floor or wall plane (`EV/tablet-portrait-0.jpg`, `EV/mobile-0.jpg`).
  - On desktop and 1024 the shaft lands and bends onto the floor, which is what makes it read as *architecture* (`EV/desktop-0.jpg`, `EV/tablet-landscape-0.jpg`).
- **Why:** The signature moment loses its "light on a real surface" meaning on portrait screens, and 768 reads as a stretched phone (rubric G).
- **Desired:** Portrait-specific shader uniforms or crop, so the shaft falls across the wall and meets the floor plane behind or above the H1. At 768, consider a larger H1 or letting the shaft's landing occupy the empty right half.
- **Owner:** webgl-specialist, sign-off creative-director.

**16. MINOR · SUBJECTIVE · 1024, 1440 · Four rooms › room text block placement (`.room` caption column)**
- **What:** Captions are bottom-aligned to tall plates, which leaves a 450–550px empty column beside each plate's upper half. At 1440 the first room's title starts at y 793 of a 900px viewport and is cut by the fold (`EV/1440-04-work.png`). Hotel Alva has about 550px of void left of the plate (`EV/scroll-08.jpg`); see also `EV/1024-04-work.png`.
- **Why:** Negative space is on-brand, but here the first frame of "Proof" shows a plate and nothing to name it. The name arrives only after more scroll.
- **Desired:** Align the caption block to the plate's optical centre or top third on desktop, or make the first room's name visible in the section's opening viewport.
- **Owner:** ui-ux.

## Unverified (not scored)
- At 1440 in `EV/scroll-03/04.jpg` the Method beams stay amber through step 3, while at 768 and 390 they re-tint toward cool at the 13:30 marker (`EV/768-02-method.png`). This is probably just the scrub position at capture time. Needs a frame at mid-band on desktop.
- The schedule hover thumbnail (spec: a light-signature thumbnail at the row's right edge on desktop) is not visible on the hovered row in `EV/scroll-09.jpg`. The capture may not have hovered deliberately. Needs a hover/focus test.
- I did not inspect fake italic or bold glyph by glyph. `loadedFonts` includes `Newsreader Variable 300 italic`, so the italics are likely real.

## Verdict, round r1
**FAIL: fixes required before Gate B.** No blockers. Four majors (#1 global header, #2 hero CTA at 768, #3 schedule at 768, #4 atelier at 768) and 12 minors. Per the rubric no single section exceeds three majors, so no section goes back wholesale. But three of the four majors are on tablet portrait, which earlier reviews never checked, and #1 affects every frame. Close each finding with a re-capture of the same frame (`EV/` names, `MS/hdr-*`, `MS/manif-1024.png`), not the fixer's word.

```
HANDOFF
agent: creative-director
phase: 6/7 (render critique r1, pre-Gate B)
summary: Rubric A–H critique of the Penumbra production build at 390/768/1024/1440, plus 360/1920 measurements
  and a reduced-motion pass. The concept, hero contrast (worst pixel ≥ 11.5:1 H1, ≥ 5.7:1 sub-line), fold and
  reduced motion pass. 4 majors (header scrim collision on all widths; hero CTA box/underline at 768; schedule
  table and atelier 2+1 orphan at 768) and 12 minors (widows, chip orphans, label proximity, room-caption fade, targets).
files_changed: /tmp/claude-0/-home-user-Claude-code-skill/224276a2-c2aa-5898-b6d9-eebe905c6165/scratchpad/critique/critique-r1.md (no repository files edited)
verification:
  - check: all supplied captures for 390/768/1024 + filmstrip opened and scored | status: PASS | evidence: EV/*.png, EV/scroll-*.jpg
  - check: hero worst-pixel contrast (text hidden) | status: PASS | evidence: MS/notext-{390,768,1024,1440}.png
  - check: layout/line-break/target measurements | status: PASS (measured) | evidence: MS/m1.json
  - check: reduced-motion pass (native scroll, no pin, full final state) | status: PASS | evidence: MS/rm-*-hour.png, MS/rm-1024-rooms.png, MS/rm-1440-part1.png
  - check: header collision reproduced at tablet | status: FAIL | evidence: MS/hdr-768.png, MS/hdr-1024.png, EV/scroll-04.jpg
  - check: 360 and 1920 section screenshots visually reviewed | status: NOT TESTED (measured only, except 1920-02) | evidence: MS/m1.json
open_issues:
  - #1 header scrim lets content collide with wordmark/nav → owner: frontend-engineer | severity: major
  - #2 hero CTA stretches; underline overshoots label at 768 → owner: frontend-engineer | severity: major
  - #3 schedule table squeezed at 768 (12px Year/Type gap, wrapped cells) → owner: ui-ux | severity: major
  - #4 atelier plates 2+1 orphan at 768 → owner: ui-ux | severity: major
  - #5–#14 typographic widows, chip orphans, label proximity, room-caption fade, small targets → owners as listed | severity: minor
  - #15–#16 portrait hero shaft composition; room caption placement → owner: webgl-specialist / ui-ux | severity: minor (subjective)
decisions_needed: none (tablet table pattern for #3 is ui-ux's call within the stated outcome)
next_suggested: frontend-engineer + ui-ux fix #1–#4, typography-spacing #5/#6/#9/#12/#13, gsap-motion #11; then web-qa re-captures the same frames (capture-reference --tablet --filmstrip 12, plus hdr/manif probes) for critique r2.
```

Note: `git status` shows pre-existing modifications to `plugins/premium-web-studio/skills/gsap-motion/references/recipes.md` and `tests/skill-scripts.sh`. I did not make them.
