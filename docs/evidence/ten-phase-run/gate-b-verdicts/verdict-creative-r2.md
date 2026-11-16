# Gate B · Creative re-check (round 2): Halde
Reviewer: creative-director (independent) · 2026-11-16 · Method: I opened all 14 frames in evidence/gateB/frames-r2/ myself, compared them against round 1 (frames/frame-1440-03, -04), and grepped index.html for the lead and meta copy.

## GATE B · CREATIVE: PASS

## Round-1 follow-ups
| # | Item | Status | Evidence |
|---|---|---|---|
| 1 MAJOR | Hero lead was ambiguous ("your weight") | **CLOSED.** It now reads "Halde makes stoneware sized and weighted for your service. By hand, in small batches." A chef reads this as plate size and weight for their service, and there is no body-weight reading. It also sets up step 01, "Talk service and weight", so the hero and the steps now use the same words. The meta description matches and adds "in Bergen". The line wraps cleanly to 2 lines at 1440 and 2 at 390, with no widow. | frames-r2/frame-1440-00, frame-390-00; index.html L7, L45 |
| 2 MINOR | Empty band between steps and contact at 1440 | **IMPROVED. Accepted as a pause, but my target was not met.** The band from the bottom of the step cards to the top of the contact card went from about 433px to about 385px. The target was 300px or less. It now roughly matches the hero's breath below the rings (about 380px in frame-1440-01), so the page has one consistent resting interval. That reads as a deliberate rhythm, not an accident. It is still the longest stretch of nothing on the page, so a further trim stays optional (below). At 390 the band is about 160px and reads well. | frames/frame-1440-04 vs frames-r2/frame-1440-04 |
| 3 MINOR | Breath between hero and steps at 1440 | No change was needed. It is now consistent with item 2. | frame-1440-01 |
| 4 MINOR | "Reply within two working days" promise | Still open as a client decision (copy unchanged). | frame-1440-05 |
| 5 MINOR | Recapture reduced-motion at 390 | Not part of this round. It stays with qa-engineer. | n/a |

## Nothing broke
- The header, nav active state ("How we work" and "Contact" underline per section), CTAs, step cards, contact card, email underline, maker's-mark foot ring and footer all render as in round 1. I found no overflow, clipping or off-palette colour at either width.
- The modifier-click guard has no visual footprint, as expected.

## Signature moment ("Coming to centre"): still present
- At 390 the vessel is visibly off-true at y0 (frame-390-00) and concentric by y488 (frame-390-02).
- The step rings still light in sequence: at y732, 01 and 02 are dark and 03 is pale (frame-390-03); by y976 all three are dark (frame-390-04).
- At 1440 the vessel is eccentric at y0 and the step rings are active by y826.
- The contact foot ring is present as the closing stamp at both widths.

## Remaining follow-ups (none block)
1. MINOR, optional · typography-spacing: if you want the steps-to-contact band at 1440 closer to the original ≤300px target, trim the steps padding-bottom (not contact) by about 4rem. Then check that the hero breath still feels matched.
2. MINOR · client/orchestrator: confirm the "two working days" reply promise.
3. MINOR · qa-engineer: the reduced-motion recapture at 390 is still outstanding from round 1.

## Could not assess from stills
These are unchanged from round 1: how the settle and stagger motion feels, and the hover and focus states.
