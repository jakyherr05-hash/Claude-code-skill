# Reference Research: OZONE (cigarette-prevention graphic novel)
_Phase 2, delta T3 · 2026-11-18 · Labels: [M] measured, [O] observed, [I] inferred, [?] unknown. Library: plugins/premium-web-studio/skills/reference-library/ (sites/, evidence/). Screenshots are internal study only; no art, characters, copy or code is reused._

## Brief changed 2026-11-18
The 2026-11-17 vaping/fog brief is replaced by a cigarettes-only, hand-illustrated, dark graphic-novel scroll story: one teen protagonist, 7 connected scenes, camera-like transitions, a cinematic loader, sound-first with an honest choice. Fog and device-graphic findings no longer apply; pacing, number staging, legibility and mobile findings still do.

## Old references: what still applies
- **Pudding: Pockets** (keep): one idea per state, a skip path, a final Sources chapter. Use for the 7-scene rhythm and the facts/sources close [M step ~900 px/beat].
- **Real Cost HHS** (keep, narrowed): myth/answer cadence and a single calm help ask; its device graphic and carousels are out.
- **Terminal Industries, Brightiris, Apple AirPods** (keep): line-by-line statement as "the turn", numbered chapter counter, constant module rhythm. Map to scenes 3 to 5.
- **Dogstudio, Santal, OceanX** (keep as legibility rules): type on the emptiest dark area or an opaque panel; ship a static first frame.
- **truth, Truth Initiative** (keep as avoid/credibility): sourced, dated facts; no meme voice.
- **Igloo (fog), lenis.dev (particles), Dropbox tiles, Floema** (demoted): fog/WebGL is not in this brief (SVG/CSS only). Igloo's lesson survives only as "light from within" for lighting a scene.
- **SBS The Boat** (upgraded, see 3).

## New references (all captured with `capture-reference.mjs <url> --tablet --filmstrip 12`)
1. **Mars Rejects** (mars-rejects; inspected, medium). Closest register: near-black navy, red extended display type (Druk Wide, 140 px / 112 px line-height [M]), halftone greyscale ink portraits cropped at the frame edge, off-white facts section [O]. Native scroll, 16,339 px, no smoothing (600 px wheel reached in one frame [M]), CLS 0, LCP 1.5 s [M]. Teaches **scene composition + type-in-art**: figures bleed off the frame; text is red display type beside art, or a solid parchment caption box with one bold phrase placed on the art; torn-paper stickers and sprayed marks carry emphasis [O]. **Avoid**: one portrait exhales smoke (never draw this); Druk is licensed; NFT framing. Mobile: cast reduced to one large portrait, not scaled [O].
2. **Ponpon Mania** (ponpon-mania; partially, low). The home screen is the first scene: a bleeding illustrated stage with one pill ("read now") [O]. Teaches **character consistency**: same proportions and heavy outline in every frame, with a layered idle loop (moving clouds, moon, new creature appears) [O]; chapter select as a spatial disc of sleeve covers with a visible music-player pill [O]. Document does not scroll (all samples 0 [M]), so panel camera moves are [?]. Mobile 390: spinner on flat colour, art not painted at capture, so a lightweight loader colour matched to Scene 1 is the lesson [O]. Cookie bar overlapped the art [O]: OZONE has no cookie bar to plan around, but must not add one.
3. **SBS The Boat** (sbs-the-boat; partially, medium after click-through). Teaches **sound UX**: the gate says "This site uses audio, headphones are recommended" [O]; the click starts sound already ON with visible SOUND / AUTO SCROLL / FULL SCREEN toggles bottom-left [O]; 8 audio/video elements after the click [M]. Also **type-in-art**: centred white serif narration directly on a monochrome ink scene, with a chapter tab 1 to 6 on the right edge [O]. Wheel advanced the story while docHeight stayed 900 (virtual scroller) [M, O]. **Avoid**: story hidden behind the gate (OZONE needs the readable no-JS/no-sound path), caption colliding with the control row and tilted panels [O c6, c8].
4. **Das Falter Inferno** (falter-inferno; partially, low). Teaches **loader hand-off**: a grainy black loader with one line and a ring; after the first drag it resolves into a grey painted night street with the title over it, the same grain persisting [O]. Document did not scroll (scrollY 0, docHeight 1900 [M]); loader image set made LCP 10.2 s [M]; mobile overflow true [M]. **Avoid**: drag-only navigation (inaccessible), thin 13 px sub-line over mid-greys, 10 s to first meaningful paint.
5. **Not inspected**: Le Dernier Gaulois (illustrated documentary, Awwwards SOTD 2016; francetv URL HTTP 403), Studio375 "Ten Years Away" (interactive comic; every guessed URL 000/404, Codrops write-up HTTP 403), Who's Guilty (HTTP 404), 45R Indigo Story (redirects to the studio home, no story). Search-result descriptions only: Ten Years Away reportedly uses a camera drifting through panels in a fixed WebGL canvas, Howler.js crossfading tracks per chapter and scroll-velocity playback-rate nudges [?, not read]. Treat as leads, not evidence.

## Cross-cutting findings for this brief
- **Scene composition** [O]: one dominant silhouette per scene, cropped at the edge; a flat dark ground with one accent (red) and the rest greyscale halftone. Colour is saved for the accent.
- **Character consistency** [O Ponpon, Mars]: identical outline weight, proportions and palette in every frame. Build the protagonist as one SVG rig, vary only pose, crop and light.
- **Transitions**: none of the 4 captured sites proved a continuous camera transition under automation (3 do not scroll the document). Evidence supports only: persistent grain/atmosphere across the hand-off (Falter), chapter disc as spatial nav (Ponpon), tilted panels sweeping over text (Boat). A true one-stage zoom/track through layers is [?] in the library; OZONE must prototype and measure its own.
- **Loader**: end on Scene 1 itself, not a separate screen (Ponpon home, Falter). Keep it under ~3 s of ceremony; the real wait must show real progress. Match loader colour to Scene 1 to avoid a flash [O Ponpon mobile].
- **Sound**: ask once, honestly, before the first scene; state that headphones help; keep a persistent toggle showing true state; never needed to follow the story.
- **Mobile** [O/M]: reduce the cast, re-stack the type; Mars re-composes, Falter overflowed (test 390 for overflow).
- **Performance** [M]: Mars 50 images ~2.8 MB, CLS 0; Falter LCP 10 s is the cost of a heavy atmospheric loader. Inline SVG should be far lighter.

## Patterns to use
- Sticky stage + short step captions with native scroll (Pudding), a skip path, a Sources chapter.
- Red display caption beside art, or a solid caption box over art with one bold phrase (Mars, Boat).
- Halftone as SVG/CSS dot pattern clipped to shadow shapes.
- Scene 1 as the loader destination; one pill action, no secondary gate.
- ENTER WITH SOUND / CONTINUE WITHOUT SOUND, then a visible state toggle and a text-only story path.
- Dark story registers, then a flat off-white sourced-facts end (Mars, Terminal, Brightiris).

## Patterns to avoid
- Any smoke, cigarette, glamour or smoking pose; peer-slang stickers; NFT/commercial framing.
- Story behind a gate; drag-only or click-only navigation; autoplay audio.
- Thin small type over mid-greys; captions overlapping controls; carousels; cookie-bar-style overlays on the art.
- Multi-second image-heavy loaders (Falter LCP 10 s).

## Open / not covered
- A site proving continuous one-stage camera transitions was not found; a headed/GPU capture of Ponpon (panels), The Boat (mobile) and Falter (scroll) would settle this. iOS/Android real devices NOT TESTED.
- No health claim is verified here; copy sources come from FACTS_AND_SOURCES.md.
