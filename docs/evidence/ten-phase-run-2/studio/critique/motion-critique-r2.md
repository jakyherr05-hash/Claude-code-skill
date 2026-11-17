# Motion critique r2 (Phase 7) · creative-director · 2026-11-17
Evidence (fresh, post-clip): motion-r2b-1440-f1..f8.png (scrollTo + 1.1 s settle, scrub range y158–2408), -1440-contact.png, -1024-f1..f3.png, -rm-1440-top.png, -open-1440-250.png. Per-frame probe: [data-plate] / .plate__rings / .plate__glaze transform, --ring-blur, glaze opacity, step positions/opacity. Animator's motion-r2-*.png not relied on.
Verdict: **PASS** (0 blockers, 0 majors, 1 minor). Signature moment now reads as intended.

## r1 findings re-judged
1. Major, glaze reads as pie/spinner: CLOSED. The pool grows from the centre, translucent at first, so the throwing rings show through like wet glaze (f6). It is opaque by f7 and held in f8/contact. Nothing chart-like is left.
2. Major, off-centre illegible: CLOSED. The rings sit 17px right / 9px up inside a clipped rim, leaving a bare slip crescent on the left, softened by the 1px blur (f1, 1024-f1). They true and sharpen through 02 Throw: f3 12.4px → f4 2.9px → f5 0.08px, crisp. [data-plate] transform is `none` in every frame, and rotation is gone.
3. Minor, glaze lag: CLOSED. See ruling (b).
4. Minor, lede gap: CLOSED. At 250 ms all hero text is painted and only y-offsets remain (open-1440-250).

## Rulings on the animator's questions
(a) **Whole-plate xPercent = 0, ring offset only: ACCEPTED.** The whole-plate shift was invisible behind the bleed and only made the bleed/fold geometry drift. With the rim fixed, the wheel head is stable and the clay moves, which is the truer metaphor. The plate box is constant at 887–1463 × 88–664 while sticky, the ~4% bleed is constant, and the fold is safe (bottom 832 at load). Amend DECISIONS row "plate xPercent ≤3" to "= 0".
(b) **Glaze start at 0.55: KEEP.** With 03 Glaze centred (f6, y1844) I measure scale 0.48 / opacity 0.39. The animator's 0.38 was a slightly earlier frame. The pool is visibly forming while the visitor reads "Your glaze, mixed for your food". It reaches 0.93 / 0.92 as 03 meets the header (f7) and is full before contact (f8). Starting earlier would push glaze into 02 Throw, before the rings are true (true at ~0.66). That breaks "first centred, then glazed". The 0.55–0.66 overlap is invisible (f5: glaze opacity 0.016).

## New finding
5. MINOR · ≥1024 + reduced/no-JS · glaze final state: the held pool has a wide, soft halo and a faint light inner ring (f8, rm-1440-top). It reads slightly as a glow or vignette rather than fired glaze, against the crisp hairline rings. → Tighten the feather in the final state to ~4–5% of the radius and keep the ::after rim hairline-thin, so the held plate looks fired, not wet. Keep the soft edge only while scaling, if that is cheap. Otherwise just tighten. → frontend-engineer

## Holding well
- Every scrub frame is readable, and step reveals land before the plate changes.
- Text and plate are in step: 01 hold (f2 rings 16.9px, blur .98), 02 centring, 03 glazing.
- No overlap with contact (contact.png).
- 1024 mirrors 1440 (f2 rings 1.6px during 02, f3 glaze 0.66 with 03 in the upper third).
- Reduced motion: 0 ScrollTriggers, no `style` on the plate, rings, glaze or [data-reveal]; true and glazed.
- Motion stays unhurried with no overshoot. One signature, everything else quiet. Default-site detector: 0/5.
