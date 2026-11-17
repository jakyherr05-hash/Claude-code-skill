# Motion critique r1 (Phase 7) · creative-director · 2026-11-17
Evidence (fresh capture, plate capped): motion-r1b-1440-f1..f8.png (scrollTo + 1.1 s settle across .steps, range y158–2408), -1440-contact.png, -open-{1440,390}-{0,300,600,1000,1500}.png, -rm-{1440,390}-{top,steps}.png. Per-frame probe: plate transform, --glaze-angle, --ring-blur, step positions/opacity, h1/CTA opacity, ScrollTrigger count.
Rubric §F + concept. Verdict: **PASS** under the exit rule (0 blockers, 2 majors), but #1 and #2 must close and be re-captured before Gate B. They are the signature moment.

## Findings (# · severity · bp · what (frame) → outcome → owner)
1. MAJOR · ≥1024 · glaze fill · The conic sweep renders as a hard-edged pie wedge, a "Pac-Man" at 307° (f6, f7). It reads as a progress chart or loading spinner, not glaze. This is my own Direction failing in render. → Glaze **pools outward from the centre**: tween a radius prop (e.g. `--glaze-r` 0 → full) on `.plate__glaze` with a soft ~6–10% feathered edge, transform/one custom prop only. No-JS and reduced-motion default stays fully glazed. I will update CREATIVE_DIRECTION wording. → gsap-animator (tween) + frontend-engineer (gradient CSS)
2. MAJOR · ≥1024 · centring · "Off-centre" is barely legible. The whole plate shifts 35px (hidden by the bleed), and rotation −8° is invisible on a radially symmetric object. Only the 1px blur → crisp change reads (f1 vs f5). → Make it eccentric. Offset `.plate__rings` (and glaze) inside the rim by ~2.5–3% so the rings sit visibly off the rim, then true to 0 (transform on the child only). Keep the blur, drop the rotation, and reduce the whole-plate xPercent to ≤3. → gsap-animator
3. MINOR · ≥1024 · glaze timing · The glaze lags its text: 50° when 03 Glaze is centred (f6), 307° only once 03 reaches the header (f7). → Start the glaze at ~0.55 so it is mostly full while 03 is centred, with the full state held into contact. → gsap-animator
4. MINOR · 1440, 390 · opening · Between ~0 and 300 ms the lede is absent, leaving a visible hole between h1 and CTA (open-390-0, open-1440-0). Acceptable (readable by ~500 ms, settled < 0.9 s). Optional: lede y-only like h1 if QA flags it. → gsap-animator (optional)

## Ruling: pose/blur ease power2.out → power2.inOut
**ACCEPTED.** f2 (01 Taste centred): plate still at rot −7.8°, blur 0.98, which is the beat table's "hold". The centring then happens through 02 Throw (f3 x 24.8px, blur 0.72 → f5 x 0.2px, blur 0): clay is trued on the wheel during *Throw*, so the plate acts out the copy. It lands without a felt stop and with no overshoot. power2.out would have spent the motion while the visitor is still reading "Taste". This is consistent with the spec token "scrub segments power2.inOut". Signature ease for reveals stays power2.out.

## Re-judged layout carry-overs
- #7 fold (1440): CLOSED. Plate 576px (40vw cap), top 256 / bottom 832 on a 900 fold. Bleed ~57px off-centre → ~23px true, so it still crosses the edge.
- #8 hold after 03: CLOSED. That span now carries the glaze fill (f7) and the glazed plate exits with the sticky end (f8 → contact). It has a job.

## Holding well
- h1 and CTA opacity are 1 in every opening frame, and content is readable ≤ 0.5 s at both widths (no loader).
- Every scrub frame is readable, and step text reveals cross 80% before the plate moves meaningfully.
- No overlap with contact (contact.png).
- Reduced motion: 0 ScrollTriggers, no `style` on the plate or `[data-reveal]`, plate true and glazed, all steps visible (rm-*), complete final state.
- Mobile: plate static and glazed; reveals only.
- Motion material matches Direction: unhurried, no overshoot, one signature.
