# Creative Direction — OZONE — "Your Ink" (cigarette-prevention graphic novel)
_Owner: creative-director · Status: draft for Gate A + client review · 2026-11-18 (T4) · Replaces "The Layer" (vaping brief; see git history)._
_Copy rules: client headlines verbatim; medical wording only M1–M6 (L1 in the back matter) from FACTS_AND_SOURCES.md; no California claims; no statistics; no equipment beyond a counter, a card and a person._

## 1 · Concept
**Your Ink.** One teenager's walk home is drawn as a single continuous ink world. In it, the pressure, the one cigarette and the harm it can do exist only as **red pencil roughs** trying to draw the next panel for them. When the teen says no, the roughs are erased, the camera widens, and the walk ends as a finished page in their own ink.

- **Why only OZONE can say this.** The walk passes OZONE's counter on the corner. Scene 3 frames a hand offering one cigarette to a teen. Scene 6 repeats that composition, mirrored: an adult's hand offers an ID card across OZONE's counter before anything is sold. The offer is answered by the check. A health department has no counter on the corner. The brand name is never explained or punned.
- **Tensions held:** dark ↔ hopeful · cinematic ↔ legible · warning ↔ respect (the teen is never the problem) · tobacco retailer ↔ neighbour.
- **Language.** Primary: *cinematic storytelling* in graphic-novel form (one stage, scrubbed camera, type lettered into the art). Accent: *editorial*, only for caption boxes and the sourced back matter. Rejected: cute comic-pop (trivialises), campaign or meme (panders), horror (the scare register), luxury (glamorises).
- **The camera is the argument.** Pressure narrows the frame until one small object fills it. Refusal widens it until the city, and then the whole page, belongs to the teen.

| Scene | Shot | Camera scale (S1 = 1) | Where in the one world |
|---|---|---|---|
| 1 | wide-medium | 1.0 | school corner at dusk, one streetlamp |
| 2 · 3 · 4 | medium · close-up · chest mid-shot | 1.15 · 3.2 · 2.0 | the alley wall one street on (the crowd, the offer, the beam) |
| 5 | extreme wide, high | 0.45 | crane up over the avenue the alley opens onto |
| 6 | interior medium | 1.3 | OZONE's counter, on the near corner of that avenue |
| 7 | the page | 1.0 → page | pull back: the walk becomes one page |

**World map.** One SVG world, one camera transform. Left to right, in viewport widths: school corner (0–1) · alley wall (1–2.2) · alley mouth onto the avenue (2.2–3.6), drawn in one-point perspective with 1.5 viewports of sky above for the crane · OZONE's storefront at street level on the near-right corner (≈ 3.0), with its interior behind the glass. **OZONE is never the destination; the vanishing point is.** The teen walks past and never enters. Headlines and captions are real HTML, lettered into per-scene text-safe zones that travel with their art plane.

**Buildability.** One transform on the world group plus per-plane parallax; SVG masks for the beam and the eraser; stroke-dash ink reveals; a level-of-detail swap at zoom extremes; scenes mounted only within ±1 of the camera; one paper tile. No live filters on large areas, no canvas or WebGL. The unproven part (see REFERENCE_RESEARCH) is a 60 fps camera over heavy SVG on mid-range phones, so T4 is prototyped first.

## 2 · Art direction
**Ink line weights** (on-screen at each scene's hold framing, measured at 1440):

| Line | Weight | Built as |
|---|---|---|
| Contour (figures, foreground objects) | 3 px, tapered ends | filled variable-width paths |
| Form (folds, features, inner edges) / Detail (brick, hair, hatching) | 1.5 px / 0.75–1 px | strokes, round caps |
| Distance (skyline, far architecture) | 1 px `#77747B`, no black contour | strokes (atmospheric depth) |
| Red rough: pressure and risk only | 1–1.5 px, 2–3 jittered passes, open ends, never filled | strokes |
| Panel borders (S7 only) | 2 px `#101014` on paper | strokes |

If a zoom would push a contour past 8 px on screen, a close-up drawing of the same model replaces it (S3 face, S4 chest).

- **Halftone.** Round dots, 45° screen, three densities (15 / 35 / 60 % coverage), pitch 6 px at 1440 and 4 px at 390. Only in the terminator (the band between a lit plane and a shadow plane), skin and cloth mid-tones, and sky gradation. Grey dots on black; black dots on off-white or burgundy; red dots only for the S4 risk hatching. Static SVG patterns, never animated per dot, never inside a text-safe zone.
- **Shadow.** Hard-edged flat `#101014` planes. Each figure is about 50 % in shadow, reduced to 3–5 big shapes. Cast shadows are long and graphic. The shadow masses are designed to double as the text-safe zones.
- **Texture.** One paper-grain tile at 3 %, fixed to the screen rather than the world, so it never scales with the camera; it becomes the visible paper in S7. Ink-edge wobble is baked into the paths.
- **Colour rationing.**
  - **Red** marks only what tries to write the teen's story: the roughs (peers' shadows, balloon scribbles, the cigarette's outline, tally marks, S4 hatching) and the two risk headline lines. It appears in S2–S4 only, is erased in T4 and never returns. ≤ 6 % of any frame (≤ 8 % in S3–S4).
  - **Yellow** is light that protects: the teen's headphones in every scene, lamp bulbs, avenue lights, the glint on the ID card, the agency lines, the primary button, the focus ring. ≤ 3 % of a frame (≤ 6 % in S5). Red and yellow never touch (2.56:1).
  - **Burgundy** is warmth in the dark (dusk, jacket, heart). **Off-white** is light and lettering. **Grey** is distance and halftone only.
  - OZONE's identity is off-white and black, never red, because red belongs to pressure.

**Palette and text pairs.** Measured with `design-intelligence/scripts/contrast.mjs`:

| Text | On | Ratio | Use |
|---|---|---|---|
| `#F1EBDD` off-white | `#101014` / `#19191F` / `#481C2A` | 15.97 / 14.72 / 11.98 AAA | Headline line 1, UI, captions on flat dark |
| `#101014` deep black | `#F1EBDD` | 15.97 AAA | Caption boxes, final page, back matter (long-form AAA) |
| `#F5D547` yellow | `#101014` / `#19191F` / `#481C2A` | 13.10 / 12.07 / 9.82 AAA | Agency lines (S1, S2, S5) |
| `#101014` | `#F5D547` | 13.10 AAA | Primary button ENTER WITH SOUND → |
| `#F04452` red | `#101014` / `#19191F` | 5.11 / 4.71 AA at any size | Risk lines (S3, S4); never over burgundy (3.83) |
| `#77747B` grey | `#101014` / `#19191F` | 4.13 / 3.81 (large only) | Not used for text; non-text art ≥ 3:1 |
| **Forbidden** | | | off-white ↔ red 3.12 (Mars Rejects' red body text on paper fails this) · red on grey 1.24 · red ↔ yellow 2.56 · off-white ↔ yellow 1.22 · grey on paper 3.87 |

Focus ring: on dark, a 3 px yellow ring with a 2 px black offset (≥ 9.8:1 against every dark); on paper, a 3 px black ring (15.97).

**Text over art (worst pixel, not average).**
1. Headlines sit only in text-safe zones painted `#101014`, `#19191F` or `#481C2A`: no halftone lighter than the ground, no grey or off-white lines. Worst pixel under the glyphs: off-white ≥ 11.98, yellow ≥ 9.82, red ≥ 4.71.
2. Body-size text (M1–M6, the OZONE sentence, source tags) sits only in an off-white caption box with black text (2 px ink border, straight, never tilted) or on flat black. Never on halftone.
3. During transitions, art passing behind a legible line must be dark-family; otherwise that line has already left with its plane. QA measures every hold and every transition midpoint at 390, 768, 1024 and 1440.

**Type personality** (typography-spacing fixes the fonts and sizes).
- **Display.** Heavy grotesk caps with ink character (ink traps or slightly irregular counters), lettered like a graphic-novel title, never a comic font. Leading 0.9–0.95, tracking 0 to +1 %. Line 2 ≈ 0.5× line 1 in a lighter weight. S5 line 1 is the largest type in the story; S7's DON’T START line is second.
- **Captions.** A highly legible sans at 18–20 px, inside narration boxes; source tags in small caption type (mono dropped, D4).
- **UI** (`03 / 07` counter, sound toggle, skip): ~~mono~~ caption face (D4), caps, +8 % tracking.
- **Candidates to verify (OFL).** Display: Bricolage Grotesque (its ink traps suit the concept) or Archivo. Captions: Atkinson Hyperlegible Next or Instrument Sans. UI: ~~JetBrains Mono~~ (dropped, D4).
- **Set copy exactly as supplied.** Never `text-transform: uppercase`, which would print "IDS". Use ’ in ISN’T and DON’T. Balance breaks so no word is alone on a last line.

## 3 · Protagonist: character sheet
- **Who.** An unnamed, fictional teen of about 15–16 with no likeness to any real person. The gender read is deliberately open (client decision; only hair and face shape change if a specific read is chosen). Skin tone is halftone density (35 % mid-tone) and identical in every scene.
- **Proportions.** 6.5 heads tall (peers 6.5–7, adults 7.5). Narrow shoulders (≈ 1.6 head widths), slim neck, long forearms and shins, slightly big hands and feet: still growing.
- **Face.** Soft jaw, no facial hair, eyes on the head's midline. Thick eyebrows are the main acting tool. Nose drawn with one shadow plane; simple mouth.
- **Hair.** Thick loose curls on top falling over the forehead, short sides. A solid black mass with 2–3 off-white rim strokes, rigged separately for secondary motion.
- **Clothing.** Charcoal `#19191F` hoodie, hood down, off-white drawstrings · oversized burgundy `#481C2A` coach jacket, open, sleeves over the wrists · black `#101014` straight trousers bunching at the ankle · chunky off-white high-tops with black soles · charcoal backpack on the right shoulder only · **yellow `#F5D547` over-ear headphones**, around the neck in S1–S4 and on the ears from T4: the figure's only bright accent and its identity thread.
- **Silhouette test.** Solid black at 48 px tall still reads: curl mop, headphone bump, one-strap backpack, big shoes.
- **Expressions.** neutral · curious (S1) · uneasy (S2) · wary (S3) · thoughtful (S4) · resolved (S5) · calm half-smile (S7). Never fear, crying, coughing, disgust, smugness or a cool smirk.
- **Never.** Holds, touches or sniffs a cigarette; has a hand near the mouth; has smoke nearby; is drawn sick.

| View / pose | Used in | Spec |
|---|---|---|
| Front | S4, turnaround | Arms loose, weight even |
| Three-quarter / side | S1, S3 close-up / S2, walk | Three-quarter is the default acting angle; the profile keeps the curl and headphone bumps |
| Back three-quarter (added) | S5, S7 | Needed for the road shots |
| Walk cycle | T1, T5, T6 | 8 drawings per two steps. Position-locked (frame = distance ÷ stride), so the feet never slide. Contact frames trigger footsteps. Curls, headphones, jacket hem and backpack lag 1–2 frames. |
| Stand (idle) | Holds | Breath loop 4 s (chest and shoulders 1.5 %); blink every 4–7 s; off under reduced motion |
| React | T2 → S3 | Weight to the rear foot, torso back 5°, chin tucked, hand tightens on the strap |
| Say no | T4 | Calm open palm at chest height toward the offer, head turns away, then the body turns. Never a stop-sign in anyone's face. |
| Move forward | S5–S7 | Long stride, chin level, hands in jacket pockets, headphones on |

- **Rig parts per view.** Head (eye, brow and mouth swap sets) · curls · neck and headphones (2 states) · torso (hoodie and jacket; the hem is a separate part) · upper arm and forearm with 4 hands (relaxed, strap grip, open palm, pocket) · backpack · pelvis · thigh, shin and shoe ×2. The S3 close-up head is a separate drawing from the same model. One stroke-weight rule covers every view.
- **Peers (S2–S3).** Three ordinary teens in charcoal and grey halftone only. No accents, sunglasses, leather or cool lighting. Drawn more simply than the protagonist, slouched and bored, faces visible and ordinary: not villains. **Nobody in the world smokes.** The only cigarette is the one unlit offer.
- **Adults (S6).** 7.5-head proportions with adult faces (lines, stubble or grey).

## 4 · The seven scenes
Line 2 colour: Y = yellow, R = red, O = off-white, B = black.

| # | Headline (verbatim) | Picture | Light | Layers: bg / mid / fg | Teen · expression | Text-safe zone |
|---|---|---|---|---|---|---|
| 1 | EVERY STORY STARTS SOMEWHERE. / MAKE SURE YOURS STARTS RIGHT. (Y) | School corner at dusk: railings, bus shelter, one streetlamp, the curb line | Lamp top-right (yellow bulb, off-white halftone cone); burgundy dusk | Sky and charcoal skyline / railings, shelter, lamp, curb / shelter glass edge, black | Stand, three-quarter facing right, headphones on neck · curious | Sky above the roofline |
| 2 | THE PRESSURE TO FIT IN IS REAL. / BUT YOU NEVER HAVE TO SAY YES. (Y) | Back wall of a closed laundromat: steel door, bare bulb, three peers lounging | Bare bulb top-centre: a small, hard pool; huge shadows up the wall | Brick with giant red-rough shadows / peers, door / 4–6 **wordless** balloons (charcoal fill, off-white outline, red-rough scribble, no words) | Side view, stopped, gripping the strap · uneasy | Unlit wall, top-left |
| 3 | IT MAY LOOK LIKE JUST ONE. / BUT NICOTINE CAN LEAD TO ADDICTION. (R) · M1, M2 | The offer: a peer's hand holds out one unlit cigarette | Passing headlights from behind the camera's left shoulder; every shadow climbs up-right | Brick, where the cigarette's shadow stretches into red-rough tally marks (groups of five, no numbers) / the teen's face (close-up) / the hand and charcoal sleeve | Close-up, three-quarter, leaning back, hands out of frame · wary | Dark brick, top-left |
| 4 | THE DAMAGE ISN’T ALWAYS VISIBLE. / BUT THE RISKS ARE REAL. (R) · M6, M4, M3, M5 | The headlight band rests on the chest; inside it the jacket becomes transparent | The beam (off-white, halftone edges) plus low ambient | Alley darkness (peers gone) / the teen, organs in the beam / caption leaders | Front, arms loose, chin down · thoughtful | Alley darkness, left |
| 5 | YOUR FUTURE IS BIGGER THAN A CIGARETTE. / BE STRONG ENOUGH TO SAY NO. (Y) | The avenue at night from high behind: one-point perspective, lights converging to the horizon, big sky, moon high left, OZONE's window small at near-right | Avenue lights as back light (yellow points, off-white cones) give a rim silhouette | Sky and skyline / avenue, lights, OZONE window / alley-mouth walls black at the left edge | Move forward, back three-quarter, headphones ON · resolved | Open sky, upper 40 % |
| 6 | OZONE / WE CHECK IDs. NO EXCEPTIONS. (O) · OZONE sentence | OZONE's counter: the employee reads the customer's ID card by eye | Pendant (off-white pool on the counter), yellow glint on the card edge, window spill | Black shelves (no product) under the OZONE sign band / employee, counter / customer's shoulder and hand, window frame | Cameo: tiny silhouette passing outside the window | Shelf darkness, sign band |
| 7 | DON’T START. PROTECT YOUR FUTURE. · OZONE · WE CHECK IDs. WE FOLLOW THE LAW. WE PROTECT OUR COMMUNITY. (B) | The finished page: seven panels on off-white paper | Even paper light; panel 7 keeps its road lights | Paper / panels / margin type | In panel 7: walking toward the vanishing point · calm | Paper margin |

**Scene notes.**
- **S3 — the cigarette is not the hero.** ≤ 5 % of frame width, on a lower third, never centred. A thin red-rough outline over a flat grey body, slightly bent. No ember, smoke, brand mark or golden filter, and never near the teen's face. The focal point is the teen's eye (the strongest rim light).
- **S4 — anatomy.** Front view, drawn as it actually sits in the body: the three-lobed right lung on the viewer's left; the two-lobed left lung with its cardiac notch on the viewer's right; trachea and bronchi in fine line; the heart burgundy with an off-white contour, centre-low, apex toward the viewer's right, with the aortic arch, pulmonary trunk and superior vena cava. No ribs, skeleton, tumours or blood.
  - The risk is red-rough hatching that sketches itself over the lower lobes and coronary vessels: a possibility never inked, erased in T4.
  - Captions: M6 → lungs, M4 → heart, M3 and M5 in one box without a leader.
- **S6 — the counter.** The card is generic: a photo square and lines, no seal, state or real ID design. No scanner, device, screen or beep. The OZONE wordmark (placeholder) sits on the sign band and as a patch on the employee's shirt. Caption, verbatim: "We verify identification, follow applicable tobacco laws, and do not sell cigarettes to anyone under 21."
- **Back matter**, on the same paper after S7: facts M1–M6 and L1 (publisher, title, date, URL); a link to the CDPH Tobacco Control Branch home page as a resource only; credits (original art, music, sound); "Facts checked 2026-11-18".

**Framing per breakpoint.** One world, four camera rigs: each breakpoint recomposes rather than crops. 1024×768 uses the 1440 framing, with bleed revealing more top and bottom, a 5-of-12-column headline and line 1 ≤ 3 lines; its fold is checked separately.

| # | 1440 (16:9) | 768×1024 (3:4) | 390×844 |
|---|---|---|---|
| 1 | Teen full-figure at 62 % x, 55 % of frame height; headline cols 1–5 on sky; curb at 82 % y | Camera 25 % closer; teen knees-up, right of centre; headline across the top 30 % | Teen waist-up in the bottom 55 %; lamp top-right; headline top third (≤ 4 lines) |
| 2 | Teen left third; peers and shadows right half; balloons cascade from top-right; headline top-left | Two peers (third cropped); balloons down the right | We stand behind the teen (lower-left, cropped at the waist); one peer plus all three shadows; headline above the bulb |
| 3 | Face right third (eye on the upper-third line); hand lower-centre; tallies climb upper-right; headline top-left, captions bottom-left | Face top-right; hand lower-centre; captions full-width at the bottom | Eyes-and-nose crop across the top 35 %; tallies up the right edge; headline and stacked captions mid-frame; hand small, bottom-right |
| 4 | Teen front view, hips to crown, at 58 % x; beam ≈ 22 % of width; headline cols 1–4; captions cols 10–12 with hairline leaders | Figure centred; headline top; two rows of captions below, leaders to markers | Chest fills the middle 50 % (the headphones identify the teen); headline top; captions two at a time below, matched to numbered ink markers on the organs |
| 5 | Vanishing point at 62 % x / 58 % y; teen 12 % of height, lower-centre; headline cols 1–9 in the upper 40 % | Vanishing point at 45 % y; road runs up the frame; headline top 30 % | Road from the bottom edge to a vanishing point at 40 % y; teen bottom-centre; headline in the top 30 % sky (3 lines) |
| 6 | Employee right of centre, chest-up; card at the thirds point (60/55 %); customer's shoulder at the left edge; sign top; line 2 on the shelves; caption bottom-left; cameo in the window | Sign top; employee and card centre; customer's hand from the left; caption bottom | Sign band, then line 2, then face, hands and card, then caption; customer as a hand only; no cameo |
| 7 | Paper fills the viewport: panels 1–6 in a 3×2 grid (left 60 %), tall panel 7 (right 40 %), copy in the bottom margin | Portrait page: 3×2 grid on top, panel 7 full-width, copy at the bottom | 3×2 thumbnail grid (≈ 110 px panels), panel 7 full-width, copy, then free scroll into the back matter |

## 5 · Loader storyboard (the loader *is* Scene 1)
| Stage | First visit, assets ready | What the visitor sees | Returning (≤ 1 s) |
|---|---|---|---|
| 1 Darkness | 0–250 ms | HTML paints `#101014` and the paper grain: the same ground as S1, so no flash | 0–80 ms |
| 2 Ink formation | 250–1100 ms | The curb line (the progress indicator) draws from the left. S1's lamp, shelter and railings ink in off it, with wet-ink blooms at the stroke tips. | 80–500 ms: stages 2–5 merge into one ink wipe of S1 |
| 3 Colour | 1100–1600 ms | Dusk burgundy washes up from the horizon; the bulb lights yellow; the cone fills in halftone | merged |
| 4 OZONE identity | 1600–2200 ms | The wordmark inks in letter by letter on the sky, holds, then settles into its UI corner | already in place |
| 5 Illustrated movement | 2200–2900 ms | The teen inks in under the lamp (contour, then fills, then halftone), breathes once, looks down the street | merged |
| 6 Real progress | throughout | The curb line's length equals real work done (fonts, S1–S2 SVG, score buffers rendered) and never runs ahead. A small % sits beside it (caption face, D4; progress is count-based, TD3) (`role=progressbar`). If loading isn't finished at 2.9 s, the scene idles while the line keeps telling the truth. After 8 s a text-story link appears (wording set by ui-ux). | same |
| 7 Enter | 2900–3300 ms | *(Only when autoplay is blocked, G-1 case a/c; otherwise the loader goes straight to the hand-off.)* At 100 %, the prompt inks in on the lower third: **SOUND IS PART OF THE EXPERIENCE** · **ENTER WITH SOUND →** (yellow button, default focus) · **CONTINUE WITHOUT SOUND** (off-white text button). Targets ≥ 44 px. | compact prompt by 600 ms |

- **Hand-off.** On either choice, or at 100 % when autoplay is allowed (G-1); 1.65 s, +0.3 s with the prompt (G-11): the prompt un-inks (300 ms) → the curb line stays as S1's curb → the camera eases a 4 % push → S1 line 1, then line 2, ink in (700 ms) → if sound was chosen, the score fades in over 1.5 s → scroll unlocks. Nothing is swapped. The toggle (SOUND ON / SOUND OFF as text plus icon, bottom-left) always shows the real AudioContext state.
- **Reduced motion.** S1 appears complete with a ≤ 200 ms fade; a plain bar shows real progress; the prompt is identical.
- **No JS.** No loader; the static story renders (§8). Story text stays in the DOM behind the loader, and "Skip to the message" is first in tab order (DESIGN wording).

## 6 · Transitions (one camera, scrubbed by native scroll, fully reversible)
**Rules for all six.** No fade-to-black. Every scroll step moves the camera, the teen, the light or the ink. At most one headline is legible at a time, and never over light art. Each incoming headline is followed by its scene's hold; during holds the camera drifts 2–3 %, so no pin is empty.
**Type in every transition.** The outgoing headline leaves with the art plane it is lettered on. The incoming line 1 inks in (stroke mask, reading direction) at ≈ 70–88 %, line 2 at ≈ 85–100 %.

| T | Out → in | Continuous element(s) | Camera · fg/bg depth | Teen | Beginning / middle / end | Type specifics | Reverse |
|---|---|---|---|---|---|---|---|
| 1→2 "The walk" | S1 hold → teen stopped at left third facing the wall, first balloon at the right edge | The teen (position-locked walk); the curb line; one sky painted to darken from dusk to charcoal night (no crossfade) | Tracks right ≈ 1.2 world-widths, push 1.0 → 1.15; teen held at ~40 % x. Railings and shelter 1.6×, mid 1.0×, skyline 0.3×. The lamp passes overhead and its light slides off the teen. | Turns from three-quarter to side, walks 4 steps, stops uneasy | 0–15 % turn / 15–80 % walk / 80–100 % slow, stop, first balloon | S1 headline leaves with the sky (gone by 40 %) | Steps play backward, feet planted |
| 2→3 "Closing in" | Medium shot with crowding balloons → hand and cigarette rising into the lower centre, face entering right | The balloons rush past the lens as the camera pushes through them; the bulb dims as headlight glare rises; the giant shadows slide up off the wall | Dolly 1.15 → 3.2 into the gap between the teen and the nearest peer, 2° roll. Balloons scale fastest and exit the frame; peers crop out; brick swells. | Head turns side → three-quarter, into the react pose; the close-up head swaps in at ≈ 60 %, hidden behind a balloon | 0–30 % balloons multiply / 30–70 % break past the lens / 70–100 % hand settles, first tally scratches in | S2 lines exit top-left before 1.6× scale; M1, M2 appear in the hold | Balloons re-gather |
| 3→4 "The beam" | Close-up of face, hand, tallies → front mid-shot, beam settled on the chest | The headlight beam: the light that lit the face sweeps the frame as the car passes; where it crosses the chest, a mask makes the jacket transparent and reveals the anatomy | Pulls back and tilts down 3.2 → 2.0 onto the chest. Hand and cigarette withdraw lower-left (fg); wall and tallies drift up and dim (bg). | Three-quarter → front, eyes down | 0–35 % glare grows, hand withdraws / 35–75 % beam sweeps left → right and stops, organs revealed at its leading edge / 75–100 % red hatching begins | Captions sequence through the hold: M6 → M4 → M3 + M5 | Beam sweeps back, jacket re-covers |
| 4→5 "Erase and widen" (**signature 1**) | Chest with red roughs → extreme wide: teen small on the avenue, no red anywhere | The teen; an **eraser front** that starts at the teen's open palm and travels outward, lifting every red rough (hatching, tallies, shadows, balloon remnants, cigarette outline) with a few grey crumbs; the headphones move from neck to ears | Pulls back and cranes up behind the teen, 2.0 → 0.45. The alley walls slide out left and right like opening doors; the avenue lights switch on toward the horizon; the sky grows to 40 %. | Jacket re-inks solid (0–15 %), say no (15–35 %), turns and puts the headphones on (35–55 %), strides forward | 0–35 % refusal / 35–60 % erase, **with no type on screen** / 60–100 % widening, lights | S4 text exits with the alley before the erase; S5 line 1 is the largest type in the story | Roughs redraw behind the retreating eraser; camera sinks back into the alley |
| 5→6 "The corner" | High wide avenue → across OZONE's counter, card in the employee's hands | The teen walks past OZONE's window and its light pool slides over them; the window (small in S5) becomes the frame we pass through; the mullion and sign sweep the lens as a physical wipe | Cranes down and right to street level (0.45 → 1.0), then pushes through the glass (1.0 → 1.3). The detailed interior replaces the distant window behind the mullion (level-of-detail swap). | Walks in side view through the window light, exits right by 55 %; reappears as the S6 cameo | 0–40 % descent and walk-by / 40–70 % glass passes the lens / 70–100 % the customer releases the card, the employee lifts it to read | "OZONE" inks in on the sign band, then the pendant light reaches it; the caption appears in the hold | Back out through the glass and up |
| 6→7 "The finished page" (**signature 2**) | Counter → paper page of seven panels with the final copy | The camera's own frame. It pulls out through the window onto the street (teen walking toward the vanishing point, OZONE's window behind) and that framing shrinks to become panel 7. Paper `#F1EBDD` rises out of the gutters. Panels 1–6 ink in, in reading order: SVG `<use>` windows onto the same world at each hold framing (low-detail), not new drawings. | 1.3 → 1.0 outside, then down to page scale; 2 px borders draw | Moves forward inside panel 7 | 0–40 % back out to the street / 40–80 % the frame becomes a panel, paper rises, panels ink in / 80–100 % final copy inks in black on the margin, then a rest | S6 copy shrinks into panel 6 as art (its HTML retires below 40 % scale); the pin releases into free scroll | Paper sinks into the gutters, panels un-ink, camera pushes back in |

**Scroll budget.** Totals: desktop 1210vh; 390: 1010svh. Each scene is an HTML section with its heading, so keyboard and anchor jumps land on a hold. The `0n / 07` counter and "Skip to the message" (DESIGN wording) keep control with the visitor.

| | S1 | T1 | S2 | T2 | S3 | T3 | S4 | T4 | S5 | T5 | S6 | T6 | S7 |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| Desktop (vh) | 50 | 100 | 70 | 90 | 90 | 110 | 130 | 150 | 70 | 110 | 90 | 150 | free |
| 390 (svh) | 40 | 80 | 60 | 70 | 80 | 90 | 120 | 120 | 60 | 90 | 80 | 120 | free |

## 7 · Audio direction (the composer writes the score spec)
| Scene | Feeling | Music | SFX accents |
|---|---|---|---|
| Loader | — | ~~Silent until the choice (no autoplay)~~ Superseded by D1 and G-1: the loader itself stays silent; the score enters at the hand-off | — |
| 1 | Open, curious | Sparse felt keys, warm pad, distant city hum; **motif** stated simply | Faint lamp hum; footsteps from T1 (contact frames) |
| 2 | Closing in | A low pulse enters and quickens slightly; a murmur made from filtered noise (no words, no laughter) | Soft paper flick per balloon |
| 3 | Narrowing, tense | Thins to one high held tone plus sub; the motif stops on its 3rd note | Car approach swell; quiet pencil scratch per tally |
| 4 | Inward, grave, not horror | Slow low pad and strings, no pulse | Air swell for the beam; dry pencil under the hatching |
| T4 / 5 | Release | Eraser rub, a beat of near-silence, then the motif completes. The score goes from **low-passed (heard from outside the headphones) to full bandwidth the moment the headphones go on.** | Eraser rub, crumbs; streetlights arrive as soft tonal plucks |
| 6 | Grounded, steady | Stable mid-tempo pulse, warm keys, room tone | One soft tap as the card meets the counter; nothing electronic |
| 7 | Resolution, rest | Full motif, held chord, then silence under the back matter | Ruled pen strokes as the gutters ink in; one paper settle |

- **Instrumentation.** All original, synthesised in Web Audio: felt-piano-like keys, warm analog pads, a plucked-string voice for the motif, sub pulses, filtered-noise foley (paper, pencil, eraser, sneakers, car pass).
- **Motif ("the walk").** A gentle four-note rising figure: stated in S1, interrupted in S2–S3, absent in S4, completed in S5, steady in S6, full in S7.
- **Mechanics.** Music runs in time; scroll selects each scene's mix (crossfade ≈ 1.5 s). SFX fire only on forward threshold crossings, debounced, at most one accent per 400 ms; reverse scrolling plays the bed only. Sound never carries meaning that the picture and text don't.
- **Never heard.** Beeps, scanner tones, register or cash drawer, card-reader chirps, phone notifications or vibration, message whooshes, door chimes, lighter flick or strike, inhale or exhale, burning crackle, coughing or wheezing, literal heartbeats, horror stingers or jump-scare hits, laughter or jeers, sirens, any spoken words.

## 8 · Responsive, reduced motion, no-JS
- **Camera rigs.** One world, four rigs: 16:9, 4:3, 3:4, ≈ 9:19.5. In-between sizes pick by aspect ratio, not width. Every scene has ≥ 20 % bleed plus vertical extension (sky above, ground below), so portrait framings recompose instead of cropping.
- **390.** Fewer people (S2 keeps one peer but all three shadows; S6 shows the customer as a hand only). Captions leave the art for flat planes, two at a time. Pins ≈ 0.8× length, halftone pitch 4 px, no hover meaning. Controls ≥ 44 px at the edges, clear of text-safe zones. Line 1 ≤ 4 lines (S5 ≤ 3); no lone last words.
- **≥ 1920.** The camera shows more bleed rather than larger type; display size caps; captions ≤ 34ch.
- **Landscape phones.** The 4:3 rig, with S4 captions sequential.
- **Reduced motion: the story as a printed comic.** The seven hold frames are stacked as static panels with paper gutters, in free native scroll. Each transition becomes a slim static bridge panel with its continuous element crossing the gutter: walking teen, balloons, beam, eraser, window, page. S4 shows the settled beam with its roughs; S5 shows the erased, widened state.
  - All text is static from first paint. No camera, walk, idle or draw-on; a ≤ 200 ms fade is the only motion. Sound is still offered: the score follows the panel in view, with no scroll SFX.
- **No JS.** The same static comic with all text; no loader, no audio.

## 9 · Deliberately not doing
- **Smoke.** None anywhere, not even as decoration: no steam, fog, haze, rings or exhales. No lit cigarette, ember, ash glow or lighter.
- **Glamour.** No cool poses, attractive "bad" peers, sunglasses, leather, backlit smoker or rebellion styling. The cigarette is never centred, beautiful or large.
- **Products.** No packs, brands, displays or prices; the shelves are flat black. No vaping or e-cigarette content in any form.
- **Scare imagery.** No sick or coughing kids, hospitals, blackened-lung photos, tumours, skeletons, X-ray ribs, skulls, gore or heartbeats. No countdowns, chains or hourglasses.
- **Off-voice material.** No stock art, photography, AI raster or real likenesses. No meme voice, slang, stickers, emoji, comic fonts or preaching. Peers are never shamed or shown as villains.
- **The counter.** No scanner, device, beep or invented procedures or certifications. No teen at the counter.
- **Claims.** No statistics, no count-ups, no California claims, no comparisons with other retailers.
- **Interaction cheats.** No fade-to-black, no empty pins, no tilted caption panels, no WebGL or canvas, no cursor followers, no audio during the loader (G-1: when autoplay is allowed the score starts at the hand-off, with the toggle visible), no `text-transform` on client copy, no body text over halftone.
- **Rejected alternates.** *Tree of lungs* (a street tree becomes the bronchial tree): a stock anti-smoking poster trope. *Refused teen at the counter*: it casts teens as buyers and stages a confrontation; checking an adult says "no exceptions" more strongly. *A comic page from the start*: it would read as sections; the page is the reward at the end.
