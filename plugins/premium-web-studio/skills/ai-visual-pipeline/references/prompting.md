# Prompting for a consistent visual family

## 1. Shot list (from CREATIVE_DIRECTION)
| ID | Purpose | Ratios (desktop / mobile) | Focal point (x%, y%) | Text overlay zone | Mood words |
|---|---|---|---|---|---|

## 2. Prompt architecture
```
[SUBJECT]   what is in frame, one clear subject, concrete materials
[COMPOSITION] camera/lens, framing, negative space side, focal point placement
[LIGHT]     source type, direction (same for the whole family!), softness, colour temperature
[GRADE]     palette words + hex anchors, contrast curve, grain
[STYLE]     medium ("architectural photograph", "light study render"), era, finish
[NEGATIVE]  text, logos, watermark, people (if unwanted), extra limbs, oversaturation
```
Keep LIGHT, GRADE and STYLE identical across the family (the *style block*). Vary only SUBJECT and COMPOSITION. Fix the seed per shot; when iterating, change one block at a time and log it.

Example style block (Penumbra demo):
> single soft light source from upper left at 35 degrees, visible penumbra on every shadow edge, 60 percent of frame in deep warm shadow (#0d0c0b), highlights limewash off-white never pure white, 2700K tungsten warmth, fine film grain, minimal architectural light study, quiet, no people, no text

## 3. Reference images
- Only images you own or have licence to (client shoots, your own renders).
- Use them for *structure* (ControlNet depth/canny) or *style* (IP-Adapter) at low weights, then re-check that the output doesn't reproduce a protected work.

## 4. Review checklist (open every image)
- Light direction and temperature match the family?
- Artefacts: warped geometry, melted text, extra fingers, repeated textures, compression banding in gradients?
- Does the composition leave the planned overlay zone calm enough for text at every crop?
- Would it survive at 360px wide (focal point inside the mobile crop)?
- Licence of the model used is commercial-OK for this client?

## 5. Video prompts
Add motion explicitly and sparingly: "slow dolly in", "light slowly sweeps from left to right", "dust drifting in the beam". Keep clips 3–6 s, seamless loops by design (start and end on the same state), no camera shake. Generate at the model's native resolution, then upscale/encode — don't ask for 4K from a 720p model.
