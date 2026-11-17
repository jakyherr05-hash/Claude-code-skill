# Render → critique → refine on the demo (2026-11-17)

The design-first upgrade added a render-critique loop to the studio (design-intelligence `references/visual-critique.md`, wired into `web-studio` phases 6, 7 and 10 and the creative-director agent). This folder records that loop being used on the existing demo site, Penumbra.

## Method
1. **Capture before.** Production build at `9c4e834` with `capture-reference.mjs --tablet --filmstrip 12`, giving 1440/390/768×1024/1024×768 tops and 12 frames over the full 14,071 px page, plus the suite's per-section screenshots at 360/390/768/1024/1440/1920.
2. **Critique r1.** A fresh `premium-web-studio:creative-director` agent got the rubric, the creative direction and the captures, and nothing about planned changes. It was told to cover tablet as thoroughly as other widths, since earlier reviews had not checked it. It had to label every finding CONFIRMED or SUBJECTIVE, with width, element, evidence and why it hurts → [critique-r1.md](critique-r1.md).
3. **Verify, then fix.** I re-checked each CONFIRMED major against screenshots and the code before changing anything. SUBJECTIVE items were left alone.
4. **Critique r2.** A new agent got the same prompt and rubric on new captures (same widths; filmstrip scroll positions within 11 px of r1's). It was told nothing about the fixes → [critique-r2.md](critique-r2.md). Its two CONFIRMED majors (in code untouched by step 3) were then fixed and verified by measurement only; no blind r3 was run.

The critiques reference scratchpad paths that did not survive the session; the comparison images below are the kept evidence.

## Result

| | r1 (before) | r2 (after r1 fixes) |
|---|---|---|
| Verdict | FAIL: 0 blockers, 4 majors, 12 minors | PASS (conditional): 0 blockers, 2 majors, 13 minors |
| r1 majors still reported | n/a | **none of the 4** |
| r1 minors fixed and not reported again | n/a | body-copy fade, 18 px e-mail target, 5+1 time presets, 1.6 display line-height, lone "away." / "begin." |
| New findings caused by r1 fixes | n/a | one SUBJECTIVE note: at 768 the project table now reads as a widened phone layout. The confirmed defect it replaced is fixed |
| r2 majors | n/a | two older Method-drawing defects that r1 did not report (labels 8.4 px at 1024; a label inside its own beam). Now fixed and measured: 11.6 px at 1024, and no text overlaps at 390/768/1024/1440/1920 in either motion mode |

Reviewer variance is real: the two rounds found partly different things. The claim supported here is narrow. Every defect the first independent review confirmed was fixed, and a second blind review did not find it again.

## Before / after (identical width, comparable scroll position; left = `9c4e834`, right = this change)

| File | What to look at |
|---|---|
| [01-1440-header-collision.jpg](01-1440-header-collision.jpg) | Filmstrip frame 4 (scrollY 4,735 vs 4,739). "PENUMBRA" painted over "METHOD · DARK FIRST" → solid header |
| [02-768-hero-cta.jpg](02-768-hero-cta.jpg) | "Start a project" underline no longer runs past the label |
| [03-768-project-table.jpg](03-768-project-table.jpg) | Squeezed six-column table → one readable row per project |
| [04-768-atelier-plates.jpg](04-768-atelier-plates.jpg) | 2 + 1 plates with an empty cell → one row of three |
| [05-768-header-over-the-hour.jpg](05-768-header-over-the-hour.jpg) | Section top under the header |
| [06-390-time-presets.jpg](06-390-time-presets.jpg) | Six times 5 + 1 → 3 + 3 |
| [07-1024-method-drawing-labels.jpg](07-1024-method-drawing-labels.jpg) | Drawing annotations 8.4 px → 11.6 px. The threshold label is mid-fade in both frames; its new position is verified by measurement. The step title's balance wrap ("Place / the light.") is a judgement call, not a measured fix |
| [08-390-contact-email-target.jpg](08-390-contact-email-target.jpg) | E-mail link 18 px → 44 px tall |

## Tests on the final state
Full demo suite **49/49**, 0 flaky ([../playwright-design-upgrade.json](../playwright-design-upgrade.json)). (Later state after Gate B round 2: 56/56, [../playwright-gate-b-r2.json](../playwright-gate-b-r2.json).) Eight visual baselines were regenerated after each diff was inspected: contact (+14 px, e-mail target), method-static (closing line-height, balanced titles, drawing labels), the-hour (3 + 3 presets), and schedule (1 px sub-pixel shift, no visible change). One earlier run under heavy host load failed The Hour preset test once; it passed 3/3 in isolation and in two later full runs.

## Not established by this evidence
- That the plugin produces better *new* websites. This loop improved one existing site; no new site was built with and without the upgrade.
- Motion quality, which was judged from filmstrip frames, not recordings. Real devices, Firefox and Safari were not checked.
