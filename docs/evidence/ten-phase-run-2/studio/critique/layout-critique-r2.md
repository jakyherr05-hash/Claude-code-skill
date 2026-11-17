# Layout critique r2 (Phase 6, layout only) · creative-director · 2026-11-17
Evidence: layout-r2b-{390,768,1024,1440}.png / -full.png / -step{1,2,3}.png / -contact.png (fresh capture, same method as r1; builder's layout-r2-*.png not relied on).
Metric probe: plate vs contact h2/p/a overlap tested at contact block end/center/start, all four widths: no overlap anywhere. scrollWidth = innerWidth at all four.
Verdict: **PASS to motion** (0 blockers, 0 majors, 3 minors carried).

## r1 findings re-judged
1. Blocker, sticky plate over contact: CLOSED. The plate releases above the mat at 1024 and 1440, and the CTA is fully clear (r2b-1440-contact, r2b-1024-contact).
2. Major, dead air below 1024: CLOSED. Steps are now ~200–213px tall, paced by the hairlines. They read as one compact list, then the mat (r2b-390-full, r2b-768-step2).
3. Major, 768 stretched phone: CLOSED. The wordmark fills 561/718px (0.78). I accept the DejaVu-safe cap in DECISIONS.md, because no overflow beats a 7% gain in fill. The plate hangs on the x=25 text edge and is cropped by the fold, as Direction asks (r2b-768).
4. Minor, 1440 bleed: CLOSED. The plate crosses the right edge by ~25px (~4%) and 1024 matches. It still reads as whole and concentric.
5. Minor, lede lines: CLOSED at 1440 (2 lines, "yours." not orphaned). 1024 keeps 3 lines, which is acceptable at that width.
6. Minor, spec amendment for 390/768 plate fully visible: OPEN (doc only). → ui-ux-designer

## New / carried minors (do not block motion)
7. MINOR · 1440 · hero: the plate grew from 522 to 627px (~44vw against Direction's ~38vw). Its bottom ring sits at y≈883 on a 900 fold, and it is now co-dominant with the wordmark. The wordmark still wins the squint test on ink contrast, so I accept it for now. Phase 7 watch: the 6% off-centre translate adds bleed and may cut the ring at the fold. If it does, cap the plate at min(40vw, 70svh). → frontend-engineer / gsap-animator
8. MINOR · 1440 · process: after step 03, ~600px of plate alone before contact (r2b-1440-step3). This is the intended "glaze holds" beat. Re-judge once the glaze fill is scrubbed. If it still feels empty with motion, shorten the last step's padding-bottom. → frontend-engineer (Phase 7 re-check)
9. MINOR · 390 · contact→footer: ~100px of bare paper between the mat and the footer rule reads slightly unresolved. Tighten to the footer rhythm token. → typography-spacing

## Holding well
The first viewport passes at all four widths: wordmark, one line, glaze CTA, H1 never cut (1024 CTA bottom 624 < 768). Edges are consistent (124/235/838 at 1440; 25/126 at 768). Accent stays rare. 0 radius throughout. Default-site detector: 0/5. The concept's object is present and calm in every frame, ready for the centring scrub.
