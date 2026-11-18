# Creative Direction — OZONE — "Your Ink" (cigarette-prevention graphic novel)
_Owner: creative-director · Status: draft for Gate A + client review · 2026-11-18 (T4) · Replaces "The Layer" (vaping brief; see git history)._
_Copy rules: client headlines verbatim; medical wording only M1–M6 (L1 in back matter) from FACTS_AND_SOURCES.md; no California claims; no statistics; no equipment beyond a counter, a card and a person._

## 1 · Concept
**Your Ink.** One teenager's walk home is drawn as a single continuous ink world. In it, the pressure, the one cigarette and the harm it can do exist only as red pencil roughs that try to draw the next panel for them. When the teen says no, the roughs are erased, the camera widens, and the walk ends as a finished page in their own ink.

- **Why only OZONE can say this.** The walk passes OZONE's counter on the corner. Scene 3 frames a hand offering one cigarette to a teen. Scene 6 repeats that exact composition, mirrored: an adult's hand offers an ID card across OZONE's counter before anything is sold. The offer is answered by the check. A health department has no counter on the corner. The brand name is never explained or punned.
- **Tensions held:** dark ↔ hopeful · cinematic ↔ legible · warning ↔ respect (the teen is never the problem) · tobacco retailer ↔ neighbour.
- **Language.** Primary: *cinematic storytelling* in its graphic-novel form (one stage, scrubbed camera, type lettered into the art). Accent: *editorial*, only for caption boxes and the sourced back matter.
  - Rejected: cute comic-pop, which trivialises the subject; campaign or meme styling, which panders; horror, which is the scare register; luxury, which glamorises.
- **The camera is the argument.** Pressure narrows the frame until one small object fills it. Refusal widens it until the whole city, and then the whole page, belongs to the teen.

| Scene | Shot | Camera scale (S1 = 1) | Where in the one world |
|---|---|---|---|
| 1 | wide-medium | 1.0 | school corner at dusk, one streetlamp |
| 2 | medium | 1.15 | the alley wall, one street on |
| 3 | close-up | 3.2 | the same wall: the offer |
| 4 | chest mid-shot | 2.0 | the same alley: the headlight beam |
| 5 | extreme wide, high | 0.45 | crane up over the avenue the alley opens onto |
| 6 | interior medium | 1.3 | OZONE's counter, on the near corner of that avenue |
| 7 | the page | 1.0 → page | pull back: the walk becomes one page |

**World map.** One SVG world under one camera transform. Laid out left to right:
- school corner (0–1 viewport widths)
- alley wall (1–2.2)
- alley mouth onto the avenue (2.2–3.6). The avenue is drawn in one-point perspective, with 1.5 viewports of sky above for the crane.
- OZONE's storefront at street level on the near-right corner (≈ 3.0), with its interior drawn behind the glass.

**OZONE is never the destination; the vanishing point is.** The teen walks past the store and never enters it.

Headlines and captions are real HTML. They are lettered into per-scene text-safe zones and travel with their art plane.

**Buildability.** Everything is built from:
- one transform on the world group, plus per-plane parallax transforms
- SVG masks for the beam and the eraser
- stroke-dash ink reveals
- a level-of-detail swap at zoom extremes
- scenes mounted only within ±1 of the camera
- one paper tile

There are no live filters on large areas and no canvas or WebGL. The unproven part (see REFERENCE_RESEARCH) is a 60 fps camera over heavy SVG on mid-range phones. Prototype T4 first.

## 2 · Art direction
**Ink line weights.** Weights are on-screen sizes at each scene's hold framing, measured at 1440.

| Line | Weight | Built as |
|---|---|---|
| Contour (figures, foreground objects) | 3 px, tapered ends | filled variable-width paths |
| Form (folds, features, inner edges) | 1.5 px | strokes, round caps |
| Detail (brick joints, hair, hatching) | 0.75–1 px | strokes |
| Distance (skyline, far architecture) | 1 px `#77747B`, no black contour | strokes (atmospheric depth) |
| Red rough: pressure and risk only | 1–1.5 px, 2–3 jittered passes, open ends, never filled | strokes |
| Panel borders (S7 only) | 2 px `#101014` on paper | strokes |

If a zoom would push a contour past 8 px on screen, a close-up drawing of the same model replaces it (S3 face, S4 chest).

- **Halftone.** Round dots on a 45° screen, at three densities (15 / 35 / 60 % coverage). Dot pitch is 6 px in 1440 hold framings and 4 px at 390.
  - Halftone lives only in the terminator (the band between a lit plane and a shadow plane), in skin and cloth mid-tones, and in sky gradation.
  - Dot colours: grey dots on black; black dots on off-white or burgundy; red dots only for the S4 risk hatching.
  - Dots are static SVG patterns, never animated per dot, and never inside a text-safe zone.
- **Shadow.** Hard-edged flat `#101014` planes. Every figure is about 50 % in shadow, reduced to 3–5 big shapes. Cast shadows are long and graphic. The shadow masses are designed to double as the text-safe zones.
- **Texture.** One paper-grain tile at 3 % covers the whole stage. It is fixed to the screen, not the world, so it never scales with the camera, and it becomes the visible paper in S7. Ink-edge wobble is baked into the paths.
- **Colour rationing.**
  - **Red** (`#F04452`) marks only what tries to write the teen's story. That means the red roughs (peers' shadows, balloon scribbles, the cigarette's outline, tally marks, S4 risk hatching) and the two risk headline lines. Red appears in S2–S4 only, is erased in T4 and never returns. It covers ≤ 6 % of any frame (≤ 8 % in S3–S4).
  - **Yellow** (`#F5D547`) is light that protects: the teen's headphones (in every scene), lamp bulbs, the avenue lights, the glint on the ID card, the agency headline lines, the primary button and the focus ring. It covers ≤ 3 % of a frame (≤ 6 % in S5).
  - Red and yellow never touch (2.56:1).
  - **Burgundy** is warmth in the dark: dusk sky, the teen's jacket, the heart. **Off-white** is light and lettering. **Grey** is distance and halftone only.
  - OZONE's identity is off-white and black, never red, because red belongs to pressure.

**Palette.** Every ratio below is measured with `design-intelligence/scripts/contrast.mjs`.

| Text | On | Ratio | Use |
|---|---|---|---|
| `#F1EBDD` off-white | `#101014` / `#19191F` / `#481C2A` | 15.97 / 14.72 / 11.98 AAA | Headline line 1, UI, captions on flat dark |
| `#101014` deep black | `#F1EBDD` | 15.97 AAA | Caption boxes, final page, back matter (long-form AAA) |
| `#F5D547` yellow | `#101014` / `#19191F` / `#481C2A` | 13.10 / 12.07 / 9.82 AAA | Agency headline lines (S1, S2, S5) |
| `#101014` | `#F5D547` | 13.10 AAA | Primary button ENTER WITH SOUND → |
| `#F04452` red | `#101014` / `#19191F` | 5.11 / 4.71 AA at any size | Risk headline lines (S3, S4); never over burgundy (3.83) |
| `#77747B` grey | `#101014` / `#19191F` | 4.13 / 3.81 (large only) | Not used for text; non-text art ≥ 3:1 only |
| **Forbidden** | | | Off-white on red 3.12 · red on off-white 3.12 (Mars Rejects' facts page fails this) · red on grey 1.24 · red on yellow 2.56 · off-white on yellow 1.22 · grey on paper 3.87 |

Focus ring: on dark grounds, a 3 px yellow ring with a 2 px black offset (≥ 9.8:1 against every dark); on paper, a 3 px black ring (15.97).

**Text over art (worst pixel, not average).**
1. Every headline sits in a text-safe zone painted only with `#101014`, `#19191F` or `#481C2A`. No halftone lighter than the ground and no grey or off-white lines are allowed in the zone. Worst pixel under the glyphs: off-white ≥ 11.98, yellow ≥ 9.82, red ≥ 4.71.
2. Body-size text (M1–M6, the OZONE sentence, source tags) sits only inside an off-white caption box with black text (2 px ink border, straight and never tilted) or on flat black. It never sits on halftone.
3. In transitions, art passing behind a legible line must be dark-family; otherwise that line has already left with its plane. QA measures every hold, and every transition midpoint, at 390, 768, 1024 and 1440.

**Type personality** (typography-spacing fixes the fonts and sizes).
- **Display.** Heavy grotesk caps with ink character (ink traps or slightly irregular counters), lettered like a graphic-novel title, never a comic font.
  - Leading 0.9–0.95, tracking 0 to +1 %.
  - Line 2 is about 0.5× line 1, in a lighter weight.
  - The S5 line 1 is the largest type in the story; S7's DON'T START line is second.
- **Captions.** A highly legible sans at 18–20 px, inside narration boxes. Source tags in small mono.
- **UI** (`03 / 07` counter, sound toggle, skip link): mono or caption caps, +8 % tracking.
- **Candidates to verify** (free/OFL): Bricolage Grotesque (its ink traps suit the concept) or Archivo for display; Atkinson Hyperlegible Next or Instrument Sans for captions; JetBrains Mono for UI.
- **Set copy exactly as supplied.** Never use `text-transform: uppercase`, because it would print "IDS". Use ’ in ISN’T and DON’T. Balance line breaks so no word sits alone on a last line.

## 3 · Protagonist: character sheet
- **Who.** An unnamed, fictional teen of about 15–16, with no likeness to any real person. The gender read is deliberately open (a client decision; only the hair and face shapes change if a specific read is chosen). Skin tone comes from halftone density (35 % mid-tone) and is identical in every scene.
- **Proportions.** 6.5 heads tall (peers 6.5–7, adults 7.5). Narrow shoulders (≈ 1.6 head widths), a slim neck, long forearms and shins, and slightly big hands and feet: still growing.
- **Face.** Soft jaw, no facial hair, eyes on the head's midline. Thick eyebrows are the main acting tool. The nose is drawn with one shadow plane; the mouth is simple.
- **Hair.** Thick loose curls on top falling over the forehead, short sides. A solid black mass with 2–3 off-white rim strokes. The curls are a separate rig part for secondary motion.
- **Clothing.**
  - Charcoal `#19191F` hoodie, hood down, with off-white drawstrings.
  - Oversized burgundy `#481C2A` coach jacket, worn open, sleeves over the wrists.
  - Black `#101014` straight trousers bunching at the ankle.
  - Chunky off-white high-tops with black soles.
  - Charcoal backpack worn on the right shoulder only.
  - **Yellow over-ear headphones**: around the neck in S1–S4, on the ears from T4 onward. They are the figure's only bright accent and its identity thread through every scene.
- **Silhouette test.** Filled solid black at 48 px tall, the figure still reads: curl mop, headphone bump, single-strap backpack hump, big shoes.
- **Expressions.** neutral · curious (S1) · uneasy (S2) · wary (S3) · thoughtful (S4) · resolved (S5) · calm half-smile (S7). Never fear, crying, coughing, disgust, smugness or a cool smirk.
- **Never.** The teen never holds, touches or sniffs a cigarette, never has a hand near the mouth, never has smoke nearby, and is never drawn sick.

| View / pose | Used in | Spec |
|---|---|---|
| Front | S4, turnaround | Arms loose, weight even |
| Three-quarter | S1; S3 close-up head | The default acting angle |
| Side | S2, walk | Profile keeps the curl mop and headphone bump |
| Back three-quarter (added) | S5, S7 | Needed for the road shots |
| Walk cycle | T1, T5, T6 | 8 drawings per two steps. Position-locked (frame = distance ÷ stride), so the feet never slide. Contact frames trigger footsteps. Curls, headphones, jacket hem and backpack lag 1–2 frames. |
| Stand (idle) | Holds | Breath loop 4 s (chest and shoulders move 1.5 %); blink every 4–7 s. Off under reduced motion. |
| React | T2 → S3 | Weight shifts to the rear foot, torso leans back 5°, chin tucks, hand tightens on the strap |
| Say no | T4 | Calm open palm at chest height toward the offer, head turns away, then the body turns. Never a stop-sign in anyone's face. |
| Move forward | S5–S7 | Long stride, chin level, hands in jacket pockets, headphones on |

- **Rig parts per view:**
  - head, with eye, brow and mouth swap sets
  - curls
  - neck and headphones (2 states)
  - torso: hoodie and jacket, with the jacket hem separate
  - upper arm and forearm, plus 4 hands (relaxed, strap grip, open palm, pocket)
  - backpack
  - pelvis
  - thigh, shin and shoe ×2

  The S3 close-up head is a separate drawing from the same model. All views follow one stroke-weight rule.
- **Peers (S2–S3).** Three ordinary teens in charcoal and grey halftone only. No accents, sunglasses, leather or "cool" lighting. They are drawn more simply than the protagonist and are slouched and bored, not menacing. Their faces are visible and ordinary: they are not villains. **Nobody in the world smokes.** The only cigarette is the one unlit offer.
- **Adults (S6).** Both read as clearly adult: 7.5-head proportions, with adult faces (lines, stubble or greying hair).

## 4 · The seven scenes
| # | Picture | Light | Layers: bg / mid / fg | Teen pose · expression | Text-safe zone |
|---|---|---|---|---|---|
| 1 | School corner at dusk: railings, bus shelter, one streetlamp, the curb line | Lamp top-right (yellow bulb, off-white halftone cone); burgundy dusk sky | Sky and charcoal skyline (unlit grey-halftone windows) / railings, shelter, lamp, curb / shelter glass edge, black, at left | Stand, three-quarter facing right, backpack, headphones on neck · curious | Burgundy sky above the roofline |
| 2 | Back wall of a closed laundromat: steel door, bare bulb, three peers lounging (one on the step, two leaning) | Bare bulb top-centre: a hard, small pool of light; huge shadows thrown up the wall | Brick (charcoal, grey joints) with giant red-rough shadows / peers, door / 4–6 **wordless** balloons (charcoal fill, off-white outline, red-rough scribble inside, no words) | Side view, stopped, hand gripping the strap · uneasy | Unlit wall, top-left |
| 3 | The offer: a peer's hand holds out one unlit cigarette | Passing headlights from behind the camera's left shoulder; every shadow climbs up-right on the brick | Brick, where the cigarette's shadow stretches into red-rough tally marks (groups of five, no numbers) / the teen's face (close-up drawing) / the hand and sleeve (charcoal) | Close-up head, three-quarter, leaning back slightly, hands out of frame · wary | Dark brick, top-left |
| 4 | The beam: the headlight band rests on the teen's chest; inside it the jacket becomes transparent, showing the anatomy | The beam (off-white band, halftone edges) plus low ambient light | Alley darkness (peers gone) / the teen, with lungs and heart in the beam / caption leaders | Front view, arms loose, chin down · thoughtful | Alley darkness, left |
| 5 | The avenue at night, seen from high behind: one-point perspective to the horizon, streetlights converging, a big sky with the moon high left, OZONE's window lit small at near-right | Avenue lights as back light (yellow points, off-white cones) give a rim silhouette; moonlight | Sky and skyline / avenue, lights, OZONE window / alley-mouth walls as black masses at the left edge | Move forward, back three-quarter, headphones ON · resolved (posture carries it) | Open sky, upper 40 % |
| 6 | OZONE's counter: the employee reads the customer's ID card by eye | Pendant over the counter (off-white pool), yellow glint on the card edge, spill from the window | Shelves in total black (no product), OZONE sign band above / employee, counter / customer's shoulder and hand, window-frame edge | Cameo only: a tiny silhouette passing outside the window | Shelf darkness and sign band |
| 7 | The finished page: seven panels on off-white paper | Even paper light; panel 7 keeps its road lights | Paper / panels (windows onto the world) / margin type | In panel 7: walking toward the vanishing point, headphones on · calm | Paper margin |

**Scene notes.**
- **S3 — the cigarette is not the hero.** It is ≤ 5 % of frame width and sits on a lower third, never centred. It is a thin red-rough outline over a flat grey body, slightly bent, with no ember, no smoke, no brand mark and no golden filter. It never comes near the teen's face. The focal point is the teen's eye (the strongest off-white rim light).
- **S4 — anatomy.** Front view, drawn as it actually sits in the body:
  - The three-lobed right lung is on the viewer's left. The two-lobed left lung, with its cardiac notch, is on the viewer's right.
  - The trachea and bronchi are drawn in fine line.
  - The heart is burgundy with an off-white contour, centre-low, apex toward the viewer's right, with the aortic arch, pulmonary trunk and superior vena cava.
  - No ribs, skeleton, tumours or blood.
  - The risk is red-rough hatching that sketches itself over the lower lobes and along the coronary vessels. It is a possibility that is never inked, and it is erased in T4.
  - Captions: M6 → lungs, M4 → heart; M3 and M5 share one box without a leader.
- **S3 captions.** M1 and M2 appear in the S3 hold.
- **S6 — the counter.**
  - The card is generic: a photo square and lines, with no seal, state or real ID design.
  - No scanner, device, register screen or beep. The shelves are flat black: no packs, no brand art.
  - The OZONE wordmark (placeholder, replaceable) appears on the sign band and as a small patch on the employee's shirt.
  - The caption, verbatim: "We verify identification, follow applicable tobacco laws, and do not sell cigarettes to anyone under 21."

**Framing per breakpoint.** One world, four camera rigs; each breakpoint recomposes rather than crops. 1024×768 uses the 1440 framing, with bleed revealing more top and bottom, a 5-of-12-column headline and line 1 ≤ 3 lines. Its fold is checked separately.

| # | 1440 (16:9) | 768×1024 (3:4) | 390×844 |
|---|---|---|---|
| 1 | Teen full-figure at 62 % x, 55 % of frame height; headline cols 1–5 on sky; curb at 82 % y | Camera 25 % closer; teen knees-up, right of centre; headline across the top 30 % | Teen waist-up in the bottom 55 %; lamp top-right; headline top third (line 1 ≤ 4 lines) |
| 2 | Teen left third; peers and shadows right half; balloons cascade from top-right; headline top-left | Two peers (third cropped); balloons stacked down the right | We stand behind the teen (lower-left, back three-quarter, cropped at the waist); one peer plus all three shadows; headline in the black band above the bulb |
| 3 | Face at right third (eye on the upper-third line); hand lower-centre; tallies climb the upper-right; headline top-left, captions bottom-left | Face in the top half, right; hand lower-centre; captions full-width at the bottom | Eyes-and-nose crop across the top 35 %; tallies up the right edge; headline and stacked captions mid-frame; hand small in the bottom-right corner |
| 4 | Teen front view (hips to crown) at 58 % x; beam ≈ 22 % of frame width; headline cols 1–4; captions cols 10–12 with hairline leaders | Figure centred; headline top; captions as two rows of boxes below, leaders to markers | Chest fills the middle 50 % (headphones identify the teen); headline top; captions two at a time below, matched to numbered ink markers on the organs |
| 5 | Vanishing point at 62 % x / 58 % y; teen 12 % of frame height, lower-centre; headline across cols 1–9 in the upper 40 % (largest type) | Vanishing point at 45 % y; road runs up the frame; headline top 30 % | Road runs from the bottom edge to a vanishing point at 40 % y; teen bottom-centre; headline in the top 30 % sky (3 lines) |
| 6 | Employee right of centre, chest-up; card at the thirds intersection (60/55 %); customer's shoulder at the left edge; sign top; line 2 on the shelves; caption bottom-left; teen cameo in the window | Sign top; employee and card centre; customer's hand from the left; caption bottom | Sign band, then line 2, then employee's face, hands and card, then caption; customer appears only as a hand; cameo dropped |
| 7 | Paper fills the viewport: panels 1–6 in a 3×2 grid on the left 60 %, tall panel 7 on the right 40 %; final copy in the bottom margin band | Portrait page: 3×2 grid on top, panel 7 full-width, copy at the bottom | 3×2 thumbnail grid (≈ 110 px panels), panel 7 full-width, copy below; then free scroll into the back matter |

**S7 copy.** DON’T START. PROTECT YOUR FUTURE. (largest) · OZONE wordmark · WE CHECK IDs. WE FOLLOW THE LAW. WE PROTECT OUR COMMUNITY. All three lines are black on paper.

**Back matter** follows on the same paper:
- Facts on this page: M1–M6 and L1, each with publisher, title, date and URL.
- A link to the CDPH Tobacco Control Branch home page, as a resource only.
- Credits: original illustration, music and sound.
- "Facts checked 2026-11-18".

## 5 · Loader storyboard (the loader *is* Scene 1)
| Stage | First visit, assets ready | What the visitor sees | Returning visit (≤ 1 s) |
|---|---|---|---|
| 1 Darkness | 0–250 ms | HTML paints `#101014` and the paper grain: the same ground as S1, so there is no flash | 0–80 ms |
| 2 Ink formation | 250–1100 ms | The curb line (the progress indicator) draws from the left. S1's lamp, shelter and railing outlines ink in off it, with wet-ink blooms at the stroke tips. | 80–500 ms: stages 2–5 merge into one ink wipe of S1 |
| 3 Colour | 1100–1600 ms | Dusk burgundy washes up from the horizon; the bulb lights yellow; the cone fills in halftone | (merged) |
| 4 OZONE identity | 1600–2200 ms | The OZONE wordmark inks in letter by letter on the sky, holds, then settles into its UI corner | Already in place |
| 5 Illustrated movement | 2200–2900 ms | The teen inks in under the lamp (contour, then fills, then halftone), breathes once, turns their head down the street | (merged) |
| 6 Real progress | Throughout | The curb line's length equals real work done: fonts, S1–S2 SVG, score buffers rendered. It never runs ahead. A small mono % sits beside it, with `role=progressbar`. If loading is not finished at 2.9 s, the scene idles (breath, lamp) while the line keeps reporting the truth. After 8 s a text-story link appears (wording to be set by ui-ux). | Same |
| 7 Enter | 2900–3300 ms | At 100 %, the prompt inks in on the lower third: **SOUND IS PART OF THE EXPERIENCE** · **ENTER WITH SOUND →** (yellow button, default focus) · **CONTINUE WITHOUT SOUND** (off-white text button). Both targets ≥ 44 px. | Compact prompt by 600 ms |

- **Hand-off.** On either choice:
  1. The prompt un-inks (300 ms).
  2. The curb line simply stays as S1's curb.
  3. The camera eases a 4 % push.
  4. S1 line 1, then line 2, ink in (700 ms).
  5. If sound was chosen, the score fades in over 1.5 s.
  6. Scroll unlocks.

  Nothing is swapped. The toggle (SOUND ON / SOUND OFF, as text plus icon, bottom-left) always shows the real AudioContext state.
- **Reduced motion.** S1 appears complete with a ≤ 200 ms fade. Progress is a plain bar showing real values. The prompt is identical. Nothing is drawn on.
- **No JS.** There is no loader; the static story renders (§8). The story text stays in the DOM behind the loader, and "Skip intro" is first in tab order.

## 6 · Transitions (one camera, scrubbed by native scroll, fully reversible)
**Rules for all six:**
- No fade-to-black.
- Every scroll step moves the camera, the teen, the light or the ink.
- At most one headline is legible at a time, and never over light art.
- Each incoming headline is followed by its scene's hold. During holds the camera drifts 2–3 %, so no pin is empty.

**T1 · 1→2 "The walk"** · 100vh desktop / 80svh at 390
- **Out → in.** From the S1 hold to the teen stopped at the left third facing the wall, with the first balloon at the right edge.
- **Continuous elements.** The teen (position-locked walk). The curb line. One sky, painted to darken from dusk burgundy to charcoal night across the world (no crossfade).
- **Camera.** Tracks right ≈ 1.2 world-widths with a 1.0 → 1.15 push. The teen holds at ~40 % x.
- **Depth.** Foreground railings and shelter move at 1.6×, mid at 1.0×, skyline at 0.3×. The lamp passes overhead and its light slides off the teen.
- **Beginning / middle / end.** 0–15 %: turn from three-quarter to side. 15–80 %: four steps. 80–100 %: the teen slows and stops, uneasy.
- **Type.** The S1 headline is on the sky plane and leaves at sky speed (gone by 40 %). S2 line 1 inks in at 70–88 %, line 2 at 85–100 %.
- **Reverse.** Exact inverse: steps play backward with planted feet.

**T2 · 2→3 "Closing in"** · 90vh / 70svh
- **Out → in.** From the medium shot with crowding balloons to the hand and cigarette rising into the lower centre, with the face entering right.
- **Continuous elements.** The wordless balloons rush past the lens as the camera pushes through them. The bulb's pool dims as headlight glare rises from behind the camera. The giant shadows slide up off the wall.
- **Camera.** Dolly 1.15 → 3.2 toward the gap between the teen and the nearest peer, with a 2° roll.
- **Depth.** The balloons scale fastest and exit past the frame edges. The peers crop out at the sides. Brick joints swell.
- **Teen.** The head turns from side to three-quarter, into the react pose. The close-up head swaps in at ≈ 60 %, hidden behind a passing balloon.
- **Beginning / middle / end.** 0–30 %: balloons multiply. 30–70 %: they break past the lens. 70–100 %: the hand settles and the first tally scratches in.
- **Type.** The S2 headline rides the wall plane and exits top-left before it passes 1.6× scale (by 30 %). S3 line 1 inks in at 70–90 %, line 2 (red) at 85–100 %. M1 and M2 appear in the hold.
- **Reverse.** The balloons re-gather.

**T3 · 3→4 "The beam"** · 110vh / 90svh
- **Out → in.** From the close-up of face, hand and tallies to the front mid-shot with the beam settled on the chest.
- **Continuous element.** The headlight beam. The same light that lit the face sweeps the frame as the car passes. Where it crosses the chest, a mask makes the jacket and hoodie transparent and reveals the anatomy in off-white ink.
- **Camera.** Pulls back and tilts down, 3.2 → 2.0, re-centring on the chest.
- **Depth.** The hand and cigarette withdraw out the lower left (the offer pauses). The wall and tallies drift up and dim.
- **Teen.** Head turns from three-quarter to front, eyes down.
- **Beginning / middle / end.** 0–35 %: the glare grows and the hand withdraws. 35–75 %: the beam sweeps left → right and stops; the organs are revealed by its leading edge. 75–100 %: the red hatching begins to sketch.
- **Type.** The S3 lines and captions leave up-left with the wall. S4 line 1 inks in at 70–85 %, line 2 (red) at 85–100 %. Captions sequence through the hold: M6 → M4 → M3 + M5.
- **Reverse.** The beam sweeps back and the jacket re-covers the anatomy.

**T4 · 4→5 "Erase and widen"** (SIGNATURE 1) · 150vh / 120svh
- **Out → in.** From the chest with red roughs to the extreme wide shot: the teen small on the avenue, with no red anywhere.
- **Continuous elements.**
  - The teen.
  - An **eraser front** that starts at the teen's open palm and travels outward across the world. It lifts every red rough: hatching, tallies, wall shadows, balloon remnants and the cigarette outline, shedding a few grey crumbs.
  - The yellow headphones, which move from neck to ears.
- **Camera.** Pulls back and cranes up behind the teen, 2.0 → 0.45. The alley walls slide out of frame left and right like doors opening. The avenue lights switch on in sequence toward the horizon.
- **Depth.** The walls exit fastest. The sky grows to 40 % of the frame.
- **Teen.**
  - 0–15 %: the beam leaves and the jacket re-inks solid.
  - 15–35 %: the say-no gesture.
  - 35–55 %: the body turns and the headphones go on.
  - 55–100 %: striding forward.
- **Beginning / middle / end.** 0–35 %: the refusal. 35–60 %: the erase, with **no type on screen**. 60–100 %: widening and lights.
- **Type.** The S4 text exits with the alley before the erase. S5 line 1 letters across the sky at 65–88 %, line 2 (yellow) at 88–100 %.
- **Reverse.** The roughs redraw behind the retreating eraser front and the camera sinks back into the alley.

**T5 · 5→6 "The corner"** · 110vh / 90svh
- **Out → in.** From the high wide avenue to the view across OZONE's counter, with the card in the employee's hands.
- **Continuous elements.** The teen walks past OZONE's window, and its light pool slides over them. The window (seen small in S5) becomes the frame the camera passes through. The mullion and sign lettering sweep past the lens as a physical wipe.
- **Camera.** Cranes down and tracks right to street level (0.45 → 1.0), then pushes through the glass (1.0 → 1.3). The detailed interior replaces the distant window drawing behind the mullion (level-of-detail swap).
- **Teen.** Walks in side view through the window light and exits right by 55 %. Reappears as the cameo in the S6 window.
- **Beginning / middle / end.** 0–40 %: descent and walk-by. 40–70 %: the glass passes the lens. 70–100 %: the customer's hand releases the card and the employee lifts it to read.
- **Type.** The S5 headline rises out with the sky. "OZONE" inks in on the sign band, then the pendant light reaches it (70–88 %). Line 2 inks in on the shelf darkness (85–100 %). The caption appears in the hold.
- **Reverse.** Back out through the glass and up to the wide shot.

**T6 · 6→7 "The finished page"** (SIGNATURE 2) · 150vh / 120svh
- **Out → in.** From the counter to the paper page of seven panels with the final copy.
- **Continuous element: the camera's own frame.**
  1. It pulls back out through the window onto the street: the teen walks toward the vanishing point with OZONE's window behind them.
  2. That framing shrinks to become panel 7.
  3. Paper `#F1EBDD` rises out of the gutters around it.
  4. Panels 1–6 ink in, in reading order. Each is an SVG `<use>` window onto the same world at that scene's hold framing (low-detail version); they are not new drawings.
  5. The 2 px borders draw.
- **Beginning / middle / end.** 0–40 %: back out to the street. 40–80 %: the frame becomes a panel, the paper rises and the panels ink in. 80–100 %: the final copy inks in black on the margin, then a rest.
- **Type.** The S6 sign and line shrink into panel 6 as art; their HTML copies retire below 40 % scale. The pin then releases into free scroll.
- **Reverse.** The paper sinks into the gutters, the panels un-ink, and the camera pushes back through the window.

**Scroll budget.** Totals: desktop 1210vh; 390: 1010svh.

| | S1 | T1 | S2 | T2 | S3 | T3 | S4 | T4 | S5 | T5 | S6 | T6 | S7 |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| Desktop (vh) | 50 | 100 | 70 | 90 | 90 | 110 | 130 | 150 | 70 | 110 | 90 | 150 | free |
| 390 (svh) | 40 | 80 | 60 | 70 | 80 | 90 | 120 | 120 | 60 | 90 | 80 | 120 | free |

- Each scene is an HTML section with its heading, so keyboard and anchor jumps land on a hold.
- The `0n / 07` counter and "Skip to the end" keep control with the visitor.

## 7 · Audio direction (the composer writes the score spec)
| Scene | Feeling | Music | SFX accents |
|---|---|---|---|
| Loader | — | Silent until the choice (no autoplay); the score enters at the hand-off | — |
| 1 | Open, curious, dusk | Sparse felt keys, warm pad, distant city hum; **motif** stated simply | Faint lamp hum; footsteps start in T1 (contact frames) |
| 2 | Closing in | A low pulse enters and quickens slightly; a murmur made from filtered noise (no words, no laughter) | Soft paper flick per balloon |
| 3 | Narrowing, tense | Thins to one high held tone plus sub; the motif stops on its third note | Car approach swell; dry pencil scratch per tally (quiet) |
| 4 | Inward, grave, not horror | Slow low pad and strings, no pulse | Air swell for the beam; dry pencil sketching under the hatching |
| T4 / 5 | Release | Eraser rub, then one beat of near-silence, then the motif completes. The score goes from **low-passed (heard from outside the headphones) to full bandwidth the moment the headphones go on.** | Eraser rub, crumbs, streetlights arriving as soft tonal plucks |
| 6 | Grounded, steady | Stable mid-tempo pulse, warm keys, interior room tone | The card set on the counter: one soft tap. Nothing electronic. |
| 7 | Resolution, rest | Full motif statement, held chord, then silence under the back matter | Ruled pen strokes as the gutters ink in; one paper settle |

- **Instrumentation.** All original and synthesised in Web Audio:
  - felt-piano-like keys
  - warm analog pads
  - a plucked-string voice for the motif
  - sub pulses
  - filtered-noise foley: paper, pencil, eraser, sneakers, car pass
- **Motif ("the walk").** A gentle four-note rising figure: stated in S1, interrupted in S2–S3, absent in S4, completed in S5, steady in S6, full in S7.
- **Mechanics.**
  - Music runs in time; scroll selects each scene's mix (crossfade ≈ 1.5 s).
  - SFX fire only when a threshold is crossed scrolling forward, debounced, with at most one accent per 400 ms. Scrolling in reverse plays the bed only.
  - Sound never carries meaning that the picture and text do not.
- **Never heard.** Beeps, scanner tones, register or cash drawer, card-reader chirps, phone notifications or vibration, message whooshes, door chimes, lighter flick or strike, inhale or exhale, burning crackle, coughing or wheezing, literal heartbeats, horror stingers or jump-scare hits, laughter or jeers, sirens, any spoken words.

## 8 · Responsive, reduced motion, no-JS
- **Camera rigs.** One world, four rigs: 16:9, 4:3, 3:4 and ≈ 9:19.5. In-between sizes pick their rig by aspect ratio, not width.
- **Bleed.** Every scene is drawn with ≥ 20 % bleed and vertical extension (sky above, ground below), so portrait framings recompose instead of cropping.
- **390.**
  - Fewer people: S2 shows one peer (all three shadows stay); S6 shows the customer as a hand only.
  - Captions move off the art onto flat planes and run two at a time.
  - Pins run at about 0.8× length, halftone pitch is 4 px, and nothing relies on hover.
  - Controls are ≥ 44 px and sit at the edges, clear of text-safe zones.
  - Line 1 is ≤ 4 lines (S5 ≤ 3 lines), and no word sits alone on a last line.
- **≥ 1920.** The camera shows more bleed rather than larger type; display size caps out, and captions stay ≤ 34ch.
- **Landscape phones** use the 4:3 rig with S4 captions sequential.
- **Reduced motion: the story as a printed comic.**
  - The seven hold frames are stacked as static panels in a vertical column with paper gutters, in free native scroll.
  - Each transition becomes a slim static "bridge" panel showing its continuous element crossing the gutter: the walking teen, the balloons, the beam, the eraser, the window, the page.
  - S4 shows the beam settled with its roughs; S5 shows the erased, widened state.
  - All text is static and present from first paint.
  - No camera moves, walk cycles, idles or drawing on. A ≤ 200 ms fade is the only motion.
  - Sound is still offered: the score follows the panel in view, with no scroll SFX.
- **No JS.** The same static comic plus all text, with no loader and no audio.

## 9 · Deliberately not doing
- **Smoke.** No smoke anywhere, not even as decoration: no steam, fog, haze, rings or exhales. No lit cigarette, ember, ash glow or lighter.
- **Glamour.** No cool poses, attractive "bad" peers, sunglasses or leather, no backlit hero smoking, no rebellion styling. The cigarette is never centred, beautiful or large.
- **Products.** No packs, brands, displays or prices. The store's shelves are flat black.
- **Vaping.** No vaping or e-cigarette content in any form.
- **Scare imagery.** No sick or coughing kids, hospitals, blackened-lung photos, tumours, skeletons, X-ray ribs, skulls, gore or literal heartbeats. No countdowns, chains or hourglasses.
- **Off-voice material.** No stock art, photography, AI raster or real people's likenesses. No meme voice, slang, stickers, emoji, comic fonts or preaching. Peers are never shamed or shown as villains.
- **The counter.** No scanner, device, beeps or invented procedures or certifications. No teen at the counter.
- **Claims.** No statistics or number count-ups. No California claims. No comparison with other retailers.
- **Interaction cheats.**
  - No fade-to-black transitions or empty pins.
  - No tilted caption panels.
  - No WebGL or canvas.
  - No cursor followers.
  - No autoplay audio before the choice.
  - No `text-transform` on client copy.
  - No body text over halftone.
- **Rejected alternates.**
  - *Tree of lungs* (a street tree becomes the bronchial tree): a common anti-smoking poster trope.
  - *Refused teen at the counter*: it casts teens as buyers and stages a confrontation; checking an adult says "no exceptions" more strongly.
  - *A comic page from the start*: it would read as sections; the page is the reward at the end.
