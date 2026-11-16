# Gate B · Creative sign-off: Halde
Reviewer: creative-director (independent) · 2026-11-16 · Method: I opened every listed still myself and read index.html, styles.css and main.js (grep), plus evidence/phase7/motion-samples.txt.

## GATE B · CREATIVE: PASS (no blockers; 1 major and 4 minor follow-ups below)

## What I opened
- evidence/gateB/frames/frame-1440-00..06 and frame-390-00..06 (all 14)
- tests/shots/w390-top.png, w1440-top.png, reduced-390-full.png
- evidence/phase7b/w5-390-contact.png, w5-1440-contact.png

## Judgement against CREATIVE_DIRECTION.md
| Check | Verdict | Evidence |
|---|---|---|
| Concept "Brought to centre" | Delivered. The hero vessel is visibly off-true at load: inner rings sit eccentric while the glaze ring is drawn heavy. By 390 y500 it is concentric. One centred object, sparse page, exact labels. | frame-1440-00, frame-390-00 vs frame-390-02; motion-samples: end-hero all 0/0/1 |
| Signature "Coming to centre" | Present and reversible: it scrubs, re-offsets at the top, and runs on 7 transform-only rings. Step rings darken in sequence (390: 01 on / 02 off at y500; 01–02 on / 03 off at y750). The 1440 row is staggered in main.js. | frame-390-02/03, main.js L144-156 |
| Unhurried / tactile / honest | Yes. Warm bisque ground, iron text, square hairline surfaces, no shadows. The serif carries the "plain-spoken" personality. Copy is concrete: menu, pass, stacking, sample set, agreed dates. | all frames |
| Palette discipline | Glaze is under 5% of the surface (hero ring, inner foot ring, focus). Iron is used instead of black. No off-palette colour seen. | frames |
| Hierarchy and type | Clear contrast of scale. Kiln-log labels are tracked, and step numbers are tabular. | frame-1440-02 |
| Reduced motion | Rings render centred and static. All 3 step rings show active: the motion-samples DEFECT is fixed by `html:not(.js-motion) [data-step-ring]::after{opacity:1}` (styles.css L169). Foot rings are visible. | reduced-390-full.png |
| "Not doing" list | Respected: no WebGL, cursor, split text, marquee, carousel, photos, kraft or script type. | code + frames |
| Reference copying | None found. CSS rings, a system serif and original copy. No Typewolf/Instrument/Lenis/Locomotive identity present. | index.html |

## Contact rings sit BELOW the email instead of around it: accepted
Strictly, this departs from the CD text ("rest as a foot ring around the email"). Creatively it is the better choice. A foot ring is the base of a pot, so a small centred stamp under the address reads as a maker's mark that closes the page ("resolved, like a finished foot ring"). It also leaves the email's legibility, underline and tap target clear. I accept it as the intended resolution. No change needed (CD doc wording can be updated at the next CD revision).

## Follow-ups (none block the gate)
1. **MAJOR · Hero lead copy, "to your service and your weight".** The line most read by a chef is ambiguous: "your weight" can be read as the reader's body weight. Desired: name the plate weight plainly, e.g. "Halde makes stoneware sized and weighted for your service. By hand, in small batches." (keep meta description in sync). Owner: frontend-engineer (copy edit, index.html hero `.lead` + `<meta name=description>`). Fix before launch.
2. **MINOR · Empty band steps → contact at 1440.** About 430px of bare clay (steps padding-bottom 12rem + contact padding-top 15rem) is almost half a viewport with nothing to hold the eye. It reads as a gap, not a held breath. Desired: reduce contact padding-block multiplier from 1.25 to 1.0 (or trim steps bottom) so the band is about 300px or less at 1440. Owner: typography-spacing. Evidence: frame-1440-04-y1159.png.
3. **MINOR · Hero → steps band at 1440** (frame-1440-01: about 400px empty below CTAs while rings scroll away). This is acceptable as the hero's breath. Revisit only if item 2 is changed, to keep rhythm consistent. Owner: typography-spacing.
4. **MINOR · Copy promise "reply within two working days"** is a concrete service commitment. It is good and honest only if the client will keep it. Decision for client/orchestrator; otherwise use "Both of us read every message and reply ourselves."
5. **MINOR · reduced-390-full.png shows the sticky header stitched mid-page** (over the end of step 03) and missing at the top. This is almost certainly a full-page capture artefact of a sticky header, not a layout bug, but it hides step 03's body in the evidence. Owner: qa-engineer, to recapture reduced-motion at 390 per viewport (or with the header unstuck for the capture) and confirm.

## Could NOT assess from stills
- Motion feel: whether the settle reads as weighty deceleration (power3/expo) vs drift, the per-ring trailing lag, Lenis glide (~700ms), step-ring stagger timing and the foot-ring fade. Stills plus numeric samples only prove start/end states and that the effects exist. A screen recording (or a 10-frame scrub at 1440 across y0–y526) is needed for a true feel judgement.
- The 1440 fully-settled hero: no frame shows it whole (y579 shows only the lower edge). Settled state is confirmed only numerically (motion-samples end-hero 0/0/1).
- Hover/focus states of the CTA, nav and email (not in the stills).
- The momentary empty lower half of the contact card before the foot fades in (frame-390-05) looks fine at rest, but the feel of the fade timing is unverified.
