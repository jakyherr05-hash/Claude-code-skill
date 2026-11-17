# Penumbra: render critique, round 2 (visual-critique rubric A–H)

_Creative director · 2026-11-17 · production build served locally on :4341 · concept checked against `demo/studio/CREATIVE_DIRECTION.md`_

## Evidence used
- Supplied captures in `.../scratchpad/critique/after/`. I opened all of these: desktop-0/1, mobile-0, tablet-portrait-0, tablet-landscape-0, scroll-00..11, and the per-section PNGs at 360/390/768/1024/1440/1920. Where a finding cites only a file name, the file is in this folder.
- My own measurements, made with Playwright against `vite preview` on :4341. The scripts and outputs are in `.../scratchpad/critique/r2/`:
  - `m1.jsonl`: boxes, line wraps, SVG label sizes and target sizes at 360/390/768/1024/1440/1920. Each width was run twice, once with normal motion and once with reduced motion.
  - `m2`: room text-lighting timing, plus the reduced-motion screenshots `rm-*.png`, `hour-*.png` and `room*-*.png`.
  - `m3`: hero text contrast measured against a glyph-free render (`herobg-*.png`).
- Reduced-motion pass: `r2/rm-top-390.png`, `rm-method-{390,768,1440}.png`, `rm-method2-{390,768,1440}.png`, `rm-work-{390,768,1440}.png`. With reduced motion there were 0 `[data-lit]` elements and 0 text nodes below 0.5 opacity at 390/768/1440.

## Verdict
**PASS (conditional).** No section has a blocker or more than three majors, so nothing goes back under the rubric threshold. The concept carries at every width: the dark ground, one raking shaft and a lit H1 tell the story in under five seconds. The two majors are both in the Method drawing, the precision beat of the narrative, and should be fixed before launch. All other findings are minor.

## Lines scored ok at all four breakpoints (390 / 768 / 1024 / 1440), not itemised
- **A1 (concept legible):** the concept reads in the first viewport at every width.
- **A2 (headline above the fold):** the H1 clears the fold. At 390×844 the H1 bottom is at 634 px and the CTA bottom at 792. At 1024×768 the H1 bottom is at 599 and the CTA bottom at 709.
- **A3 (hero contrast, measured on the worst pixel under the text box with the text hidden):**
  - H1: ≥ 11.4:1 (1440 and 1024), 13.2:1 (768), 13.8:1 (390).
  - Sub-line: ≥ 5.68:1.
  - Kicker: ≥ 6.46:1.
- **B (hierarchy):** one dominant element per viewport, and every section has one job.
- **C3 (no faux styles):** the italic is the real Newsreader italic (`Newsreader Variable 300 italic` is loaded). There is no faux bold.
- **C4 (families):** three families, each with a named role.
- **E2 (accent rarity):** the accent stays rare.
- **F (motion):** the pin rests on step 3 before handing over (scroll-04). In reduced motion the Method is three stacked static drawings and nothing is hidden.
- **Room text:** after the plate opens, all `[data-lit]` room text reaches opacity 1.00 at every width (`m2`). The dim titles in scroll-06/08 are an artefact of the filmstrip jumping 1185 px per step, not a defect.
- **G1 (targets):** the mobile menu toggle is 62×44, the chips and presets are ≥ 44 px tall, and the CTAs have a 44 px min-height.
- **H (default-site detector):** no detector item fires.

## Findings (minor or worse only)

Format: **# · severity · label · width(s) · section → element**, then evidence, why it hurts, desired outcome and owner.

### Major

**1 · major · CONFIRMED · 1024 (also 360 and 390) · Method → `svg.method-drawing` annotation text (`NAVE · ≤ 2 lux`, `12° · 40 lux`, `THRESHOLD`, `ALTAR` …)**
- **Evidence:** measured rendered label size (`m1.jsonl`):
  - **8.4 px at 1024**
  - 10.0 px at 360
  - 10.9 px at 390
  - 14.9 px at 768
  - 12.0 px at 1440

  The cause: at 1024 the SVG is only 599 px wide (viewBox 860), so 11-unit text scales down. Visible in `1024-02-method.png`, where the lux values are barely readable.
- **Why it hurts:** the brief says "the numbers are the ornament". At 1024 the whole proof of precision in the signature pinned sequence is illegible on tablet landscape. Text under 9 px also fails the CD rule "no hairline-thin text sizes".
- **Desired outcome:** annotation text renders at ≥ 11 px at every width. For example, counter-scale the font size by the inverse of the SVG scale, or give the drawing more columns at 64–80 rem.
- **Owner:** frontend-engineer (with typography-spacing for the size floor).

**2 · major · CONFIRMED · all widths (360–1920) and reduced motion · Method → threshold beam label `24° · 8 lux` (`[data-beam=threshold] text`)**
- **Evidence:**
  - The label is placed at viewBox x 112–~185, y≈292. At that height the threshold cone spans x 117–187, so the label sits entirely inside the beam polygon and also inside the door rectangle (x 108–168).
  - Measured overlaps:
    - 1440: label 649–728 px vs cone 645–727 px
    - 768: 121–219 vs 118–186
    - 1024: 470–526 vs 467–524
  - Visible in `scroll-03.jpg`, `scroll-04.jpg`, `768-02-method.png`, `360-02-method.png`, `r2/rm-method2-1440.png` and `r2/rm-method2-768.png`.
  - The worst background pixel next to the glyphs is (77,62,44), about 4.47:1 against `--accent-warm`, compared with 8.50:1 on plain ground.
- **Why it hurts:** this is the same class of defect as W10 (label collision). A technical drawing whose argument is precision has its label printed on top of the light it describes and struck through by the door outline. The altar label (end-anchored, outside its cone) shows the correct pattern.
- **Desired outcome:** move the label clear of the cone and door. Either place it left of the cone with `text-anchor: end` (like the altar label), or put it below the ground line next to `THRESHOLD`. Then re-check at 360/390/768/1024/1440 in both motion modes.
- **Owner:** frontend-engineer.

### Minor

**3 · minor · CONFIRMED · 1024, 1440, 1920 · Method → `.method__step-title` ("Survey the dark." / "Place the light." / "Schedule the hour.")**
- **Evidence:** a single word sits alone on the last line (`m1.jsonl` wraps):
  - 1024: `Survey the | dark.` and `Place the | light.`
  - 1440: all three titles (`… | dark.`, `… | light.`, `… | hour.`)
  - 1920: `dark.` and `hour.`

  Visible in `scroll-02.jpg`, `scroll-03.jpg`, `scroll-04.jpg` and `1024-02-method.png`. The rule has no `text-wrap`.
- **Why it hurts:** rubric C1. At 80 px the stranded noun reads as an accident, not a chosen break, in the most-viewed headline after the H1.
- **Desired outcome:** the breaks read `Survey / the dark.`, `Place / the light.`, `Schedule / the hour.`, or the title fits on one line. Use `text-wrap: balance` and/or a non-breaking space before the noun, then confirm in a screenshot.
- **Owner:** typography-spacing.

**4 · minor · CONFIRMED · 768, 1440 (normal and reduced motion) · Manifesto → `.manifesto__text`, last line "design."**
- **Evidence:** `m1.jsonl` wraps end `…first thing we | design.` at both widths. Visible in `768-01-manifesto.png`, `1440-01-manifesto.png` and `scroll-01.jpg`. `text-wrap: pretty` is set but does not prevent it in this engine.
- **Why it hurts:** this is W24 recurring. The paragraph's closing idea ("It is the first thing we design") ends on a lone word.
- **Desired outcome:** no single-word last line at any width. For example, use a non-breaking space in "we design." and re-check 360–1920.
- **Owner:** typography-spacing.

**5 · minor · CONFIRMED · 1024 (also 360) · Four rooms → `.room__meta`**
- **Evidence:** the line breaks after a separator:
  - 1024: `Évora, Portugal · 2025 · | Sacred space` and `Comporta, Portugal · 2023 · | Private house`
  - 360: `Comporta, Portugal · 2023 · | Private house`

  Visible in `1024-04-work.png`.
- **Why it hurts:** a dangling `·` at the end of a line looks like a typo in the spec strip, which is meant to look engineered.
- **Desired outcome:** separators never end a line. Keep each segment with its leading separator (nowrap spans, or separators drawn in CSS).
- **Owner:** frontend-engineer.

**6 · minor · CONFIRMED · 360, 390 · Lighting schedule → `.sched__intent`**
- **Evidence:** single-word last lines (`m1.jsonl`):
  - 390: `…across the | floor.` and `…only at the | bar.`
  - 360: `…answers it at | night.` and `…light well onto | paper.`

  Visible in `390-05-sched.png` and `360-05-sched.png`. No `text-wrap` is set on `.sched__intent`.
- **Why it hurts:** rubric C1 on short lead lines. Four of the visible rows end ragged.
- **Desired outcome:** apply `text-wrap: pretty` (plus a non-breaking-space fallback) so there are no lone final words at 360/390.
- **Owner:** typography-spacing.

**7 · minor · CONFIRMED · 1024, 1440, 1920 · Threshold (hero) → bottom edge of `.hero` / shader canvas**
- **Evidence:** in `desktop-1.jpg`, the hero scrolled 600 px, the shaft is cut by a straight horizontal line at y=300. Measured luma at x=1408–1428 drops from 30–34 to 12–14 within 2 px. The scrim only reaches 72 % ground at the bottom (`.hero__scrim`). The shaft reaches the bottom-right corner at 1024 too (`tablet-landscape-0.jpg`).
- **Why it hurts:** the CD forbids hard edges ("every shadow has a visible penumbra gradient"). The first scroll gesture shows the brand's own material cut by a ruler-straight seam.
- **Desired outcome:** the hero dissolves into `--ground` over at least the last 15–20 % of its height, so no luminance step is visible at the section boundary.
- **Owner:** webgl-specialist (shader falloff), with frontend-engineer for the scrim.

**8 · minor · CONFIRMED · 360, 390, 1024 · Manifesto → `.uline` ("where darkness must stay")**
- **Evidence:** the single warm line breaks into two fragments:
  - 360: 267 px + a 30 px stub under "stay"
  - 1024: 122 px under "where" + 371 px on the next line

  Visible in `360-01-manifesto.png` and `1024-01-manifesto.png`. The phrase would fit on one line: about 297 px in a 320 px measure at 360, and 493 px in about 626 px at 1024.
- **Why it hurts:** the CD specifies "a single thin warm line… under one phrase". Two fragments, one a 30 px stub, read as a broken underline.
- **Desired outcome:** the phrase never wraps (`white-space: nowrap` on `.uline`, since it fits at every measured width), giving one continuous line.
- **Owner:** frontend-engineer.

**9 · minor · CONFIRMED · 768 · The Hour → `.hour__readout` relative to `.hour__stage`**
- **Evidence:** in `r2/hour-768.png` the section is scrolled so the kicker sits at y=133. The stage occupies y 245–645 and the slider y≈840, but the readout labels start at y≈1018 and the K/lux values fall below the 1024 fold. The presets use 3 columns of 64 px (x 28–235), leaving about 500 px of the row empty.
- **Why it hurts:** the readout is the proof that "every state is a real design decision with numbers". At tablet portrait, the visitor cannot drag the slider and watch the numbers change at the same time. This is the phone layout stretched (rubric G2).
- **Desired outcome:** at 48–64 rem, keep stage, slider and readout in one 1024-tall viewport. For example, put the presets and the 2×2 readout side by side under the slider, or use a shorter stage aspect ratio.
- **Owner:** ui-ux-designer, with frontend-engineer.

**10 · minor · CONFIRMED · 1920 · Global → `.site-header` vs content container**
- **Evidence:**
  - The wordmark is at x=48 and the nav ends at x≈1872 (`1920-00-top.png`).
  - Every section's content starts at x=168 and ends at x=1752 (kickers, H1, table: `m1.jsonl`, `1920-05-sched.png`).
  - At 1440 both edges agree (42 / 1398).
- **Why it hurts:** rubric D1/G3. On large screens the header drifts 120 px outside the composition's vertical lines, so nothing hangs from the same edge.
- **Desired outcome:** the header inner box uses the same `--container-max` and margins as the content at ≥ 1600 px.
- **Owner:** frontend-engineer.

**11 · minor · CONFIRMED · 1440 (likely all widths; only checked at 1440 in the filmstrip) · Four rooms → `.room__plate` before reveal**
- **Evidence:** before the door opens, each plate shows a full-size `--ground-raised` rectangle (`.room__plate { background: var(--ground-raised) }`). The clip-path is on the `<picture>`, so the box itself is visible. See `scroll-05.jpg` (empty raised box at x 42–708, y 757+) and `768-04-work.png` / `r2/room0-768.png` (next plate as an empty box).
- **Why it hurts:** rubric F2 ("no frame is blank"). The "door opening" should open out of darkness. A grey placeholder panel reads as an image that failed to load and pre-empts the reveal.
- **Desired outcome:** before reveal the plate is indistinguishable from `--ground`, and the slit opens out of the dark. Use a `--ground` background, or clip the raised background together with the picture.
- **Owner:** gsap-motion-engineer.

**12 · minor · SUBJECTIVE · 768 · Four rooms (`.room`, plate cols 1–7) and Lighting schedule (`.sched__row` stacked)**
- **Evidence:**
  - Rooms: at 768 every plate sits at x 28–557 with a 211 px empty right band, and the text is stacked below, with no alternation (`768-04-work.png`, `r2/room0-768.png`).
  - Schedule: rows use the stacked phone layout, so the content ends at about x 430 of a 712 px row, while Place, Year and CCT could take the right half (`768-05-sched.png`).
- **Why it hurts:** rubric G2. Tablet portrait reads as a widened phone rather than a composition of its own.
- **Desired outcome:**
  - Rooms: either a full-bleed plate, or a plate (cols 1–5) with the text beside it (cols 6–8).
  - Schedule: a 3-column row (name and intent | place · year | CCT) at 48–64 rem.
- **Owner:** ui-ux-designer.

**13 · minor · SUBJECTIVE · 1024×768 · Manifesto → `.manifesto__text`**
- **Evidence:** the paragraph occupies y 205–730 of a 768 viewport, 10 lines at about 52 px (`1024-01-manifesto.png`), leaving roughly 40 px of dark above the next section.
- **Why it hurts:** this is meant to be the "breathing section" ("stillness"). At tablet landscape it is a wall of type with no dark around it, the opposite of "darkness is the layout".
- **Desired outcome:** at 1024×768 the paragraph sits with clear dark space above and below. Use a slightly smaller step or a wider column (cols 2–11), targeting 7–8 lines.
- **Owner:** typography-spacing.

**14 · minor · SUBJECTIVE · 360, 390 · Method → room labels `ALTAR`, `THRESHOLD`, `NICHE`, `E. SLIT`**
- **Evidence:** these labels render at 0×0 below 48 rem (`m1.jsonl`), so on phones the beam labels (`12° · 40 lux` …) have no named surface (`390-02-method.png`).
- **Why it hurts:** the CD says each beam is "cast onto altar, threshold and niche". On mobile the numbers float without their subject, which weakens step 2's message.
- **Desired outcome:** on phones, name the surface within the beam label (e.g. `ALTAR 12° · 40 lux`) or in the step copy, without adding new collisions.
- **Owner:** frontend-engineer, with ui-ux-designer.

**15 · minor · SUBJECTIVE · 360, 390 · Lighting schedule → `.sched__filters`**
- **Evidence:** four chips fit on row 1 and `HOSPITALITY` (111 px) wraps alone to row 2 (y 8600 vs 8651 at 390; `390-05-sched.png`, `360-05-sched.png`).
- **Why it hurts:** a lone chip looks like overflow rather than design.
- **Desired outcome:** the filters read as one deliberate set on phones, e.g. a single scrollable row with an edge fade, or a 3 + 2 split.
- **Owner:** ui-ux-designer.

## Unverified / not reported
- **Hero CTA position at 1440:** `Start a project` sits at x=649. I could not confirm which grid line it hangs from, so I did not report it as misalignment.
- **Reduced-motion Method at 1440:** the drawing spans the full 1356 px container, so each step is about 1129 px tall, longer than the 900 px viewport (`r2/rm-method-1440.png`). It is functional; whether it should sit side by side as in the animated version is a taste call I have not scored.
- **Recording-based motion checks:** not done (no video captured). Two motion checks rest on the filmstrip only: 60 fps feel, and the hero light rise reaching readable content within 1.5 s.
- **Untracked `demo/dist-s2/`:** `git status` shows an untracked `demo/dist-s2/` in the repo. I did not create it and did not touch it.

## Tally per section (normal motion)
| Section | blocker | major | minor |
|---|---|---|---|
| Threshold (hero) | 0 | 0 | 1 (#7) |
| Manifesto | 0 | 0 | 3 (#4, #8, #13) |
| Method | 0 | 2 (#1, #2) | 2 (#3, #14) |
| The Hour | 0 | 0 | 1 (#9) |
| Four rooms | 0 | 0 | 3 (#5, #11, #12) |
| Lighting schedule | 0 | 0 | 3 (#6, #12, #15) |
| Atelier / Contact | 0 | 0 | 0 |
| Global | 0 | 0 | 1 (#10) |

The rooms and schedule counts include #12, which covers both sections.

```
HANDOFF
agent: creative-director
phase: 6/Gate B (render critique round 2)
summary: Penumbra demo critiqued from real captures at 360–1920 and a reduced-motion pass, against visual-critique A–H. The concept, hero contrast (≥11.4:1 H1 on worst pixel), fold and motion all hold. Verdict PASS (conditional): no section reaches the send-back threshold. 2 majors (Method drawing labels 8.4 px at 1024; threshold label printed inside its beam) and 13 minors, mostly wraps/orphans and tablet-portrait layouts.
files_changed: /tmp/claude-0/-home-user-Claude-code-skill/224276a2-c2aa-5898-b6d9-eebe905c6165/scratchpad/critique/critique-r2.md (repo untouched)
verification:
  - check: opened every supplied capture (tops, 48 section PNGs, 12 filmstrip frames) | status: PASS | evidence: scratchpad/critique/after/
  - check: hero text contrast on worst background pixel, text hidden | status: PASS | evidence: scratchpad/critique/r2/herobg-*.png, m3.jsonl
  - check: line wraps / orphans / dangling separators measured at 6 widths | status: FAIL (#3–#6) | evidence: scratchpad/critique/r2/m1.jsonl
  - check: method SVG label size and collisions | status: FAIL (#1, #2) | evidence: m1.jsonl, scroll-03.jpg, r2/rm-method2-1440.png
  - check: reduced-motion complete final state | status: PASS | evidence: r2/rm-*.png (0 dim [data-lit], 0 low-opacity text)
  - check: touch targets ≥44px at 360/390 | status: PASS | evidence: m1.jsonl
  - check: motion feel from a recording | status: NOT TESTED | evidence: none (filmstrip only)
open_issues:
  - Method annotation text 8.4px at 1024 → owner: frontend-engineer | severity: major
  - Threshold label "24° · 8 lux" inside its beam cone and door outline, all widths → owner: frontend-engineer | severity: major
  - Method step titles single-word last line (1024/1440/1920) → owner: typography-spacing | severity: minor
  - Manifesto orphan "design." (768/1440) → owner: typography-spacing | severity: minor
  - room__meta dangling "·" (1024/360) → owner: frontend-engineer | severity: minor
  - sched__intent orphans (360/390) → owner: typography-spacing | severity: minor
  - Hero hard bottom edge cutting the shaft (1024+) → owner: webgl-specialist | severity: minor
  - Manifesto underline broken across lines (360/1024) → owner: frontend-engineer | severity: minor
  - The Hour readout below fold at 768 → owner: ui-ux-designer | severity: minor
  - Header not on content container at 1920 → owner: frontend-engineer | severity: minor
  - Room plate shows raised empty box before reveal → owner: gsap-motion-engineer | severity: minor
  - 768 rooms/schedule are widened phone layouts (subjective) → owner: ui-ux-designer | severity: minor
  - 1024×768 manifesto has no breathing room (subjective) → owner: typography-spacing | severity: minor
  - Phone method drawing loses surface names (subjective) → owner: frontend-engineer | severity: minor
  - Lone HOSPITALITY chip on phones (subjective) → owner: ui-ux-designer | severity: minor
decisions_needed: none (the subjective items #12–#15 may be accepted or declined by the orchestrator)
next_suggested: frontend-engineer to fix #1, #2, #5, #8, #10; typography-spacing #3, #4, #6, #13; then re-capture the same frames (capture-reference --tablet --filmstrip 12 + reduced-motion) for round 3
```
