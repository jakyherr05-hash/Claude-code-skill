# Gate B: creative review (creative-director). Verdict: PASS WITH NOTES
Judged from the running build (http.server :8792, Chromium headless, captured 2026-11-17). Every image listed below was opened.
Evidence: {390,768,1024,1440}-{top,full}.png, film-00..11.png (scrub start "top 70%" to end "bottom 60%" of .steps, settled 1.0 s each), film-contact.png, film-end.png, rm-{390,1440}-{top,full}.png.
Measured filmstrip: rings x 17.3 to 0 px (blur 1 to 0) reach true at f7 (p~.64); glaze opacity 0 at f6, .07 at f7, .67 at f9, 1 at f11 (scale .15 to 1); [data-plate] transform none in every frame. Reduced motion: 0 ScrollTriggers, 0 inline styles.
Note: the step and contact text missing from the motion-on *-full.png shots comes from the capture method (once-reveals never fire in a full-page shot). The rm-*-full shots show every word.

## Rubric (390 / 768 / 1024 / 1440)
A First viewport: ok/ok/ok/ok. Wordmark dominant, one-line lede, email CTA visible, H1 never cut. At 1024x768 the plate rim is whole.
B Hierarchy: ok. One huge thing per viewport (wordmark, then plate, then contact h2). Each section has one job.
C Typography: ok. Serif 4:1 to tracked caps. Lede breaks are chosen (2 lines at 1440, 3 at 390/768/1024, no orphan). Contact h2 breaks well: "Hei is enough." gets its own line.
D Composition: ok/ok/ok/minor. Left axis is consistent. At 1440 the ~80svh steps leave a lot of empty paper under 3-line steps. The sticky plate earns it, but it is near the limit.
E Colour: ok. Glaze is under 5% until the payoff, then becomes the single saturated object, which is earned. One world: clay, slip, ink, glaze.
F Motion: ok. Signature reads: f0 rings visibly eccentric (left band wider, centre dot up-right) -> f4-f6 trued during 02 Throw -> f8-f10 glaze pools from the centre, translucent at first, during 03 Glaze. Text and object beats coincide. No pin, nothing rotates, the email never moves.
G Responsive: ok. 390 and 768 are their own compositions (inline glazed plate, stacked steps, full-bleed mat at 390).
H Default-site detector: 0 of 5 hits.
Brief feeling: unhurried (slow scrub, quiet paper), tactile (grain, rings, fired glaze edge), honest (plain copy, the email as the CTA). It reads as a spec sheet a chef would trust.

## QA open question: empty left column at 1440 at scrub end (film-11)
Intended and acceptable. 03 Glaze has just left, and the plate is releasing from .plate-col (spec: it settles above contact, never covers it). The glaze is already 93% at f10 with the 03 text still on screen, so the payoff lands with its words. f11 is a half-viewport breath before the contact mat.

## Notes (non-blocking, all minor)
1. 1440 f11: the contact mat enters empty for a moment (its h2 waits for "top 80%"). Desired: start the contact reveal earlier ("top 90%") so the mat never shows as an empty box. Owner: gsap-animator.
2. 1440 f11/f-contact: the fully glazed plate is cropped under the header as it scrolls away. Optional: end the scrub slightly earlier (e.g. "bottom 75%") so the finished plate rests whole for longer before release. Owner: gsap-animator.
3. Copy: "thrown by two hands" against "Two people answer". A chef may read "two hands" as one person. Optional fix: "by hand, by two of us, in Bergen…", or keep it as an idiom. Owner: frontend-engineer (CD to approve the wording).

## Re-check (scope: notes 1-3 plus anything they touched). Final verdict: PASS
Same method (:8792, Chromium headless; server stopped, port free). All recheck-*.png files opened.
Evidence: recheck-film-08..11.png (scrub now "top 70%" to "bottom 75%"), recheck-contact.png, recheck-wheel-0..2.png (continuous 120px wheel steps, 110 ms apart), recheck-{390,768}-top.png, recheck-rm-1440-top.png.
1. Contact reveal: CLOSED. main.js triggers on `.contact` at "top 100%". Continuous wheel, measured (mat top px, h2 opacity): 1106/0, 987/.37, 868/.70, 714/.99, 590/1. The h2 is already ~.7 when the mat crosses the fold, so the mat never reads as an empty box (wheel-1, wheel-2). Settled film-11: h2 opacity 1. Email never moves.
2. Scrub end: CLOSED. Glaze is .93 at f10 and 1.0 at f11 while the plate is still sticky and whole (top 88, bottom 664 px, no header crop in film-10/11). The payoff now rests whole. In f11 the end of the 03 text is still on screen with the contact mat entering, so the empty left column from round 1 is gone. Beat order unchanged: f8 translucent pool over true rings, f9 .67, f10-11 full.
3. Copy "Plates thrown by two potters in Bergen, glazed for one kitchen: yours.": APPROVED. It is honest, agrees with "Two people answer", and "thrown" still carries the hand. Wraps: 1440 = 2 lines, breaking at "Bergen," (chosen). 390 = 3 lines: "Plates thrown by two potters / in Bergen, glazed for one / kitchen: yours." 768 = same 3 lines. No orphan or one-word line. "kitchen: yours." as the last line lands the italic, which is good.
Untouched areas re-seen: hero 390/768/1440-rm unchanged apart from the lede; rm-1440 top is true and glazed with no inline styles; contact composition unchanged.
Capture artefact, not a defect: in mid-wheel shots (wheel-0..2) the header appears 6-17 px low. The DOM reports header top = 0 at every wheel step (10 samples) and in every settled frame. Headless screenshots taken during an active scroll can show this; real-device check stays with QA's NOT TESTED list.
Open: none. Creative Gate B: PASS.
