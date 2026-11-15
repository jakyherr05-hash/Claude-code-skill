# Creative Direction — Penumbra — Light Atelier (demo)
_Owner: creative-director · Status: approved by orchestrator 2026-11-15 (display font → Newsreader, see DECISIONS.md) · Date: 2026-11-15_

> Penumbra is fictional. Every name, place and project below is invented for the demo. No reference brand is imitated; no reference research doc existed at time of writing, so this concept is derived from the brief alone.

## Concept (one sentence)
**"We design the dark first."** The site opens unlit, the way Penumbra treats a building: darkness is the material, and light appears only where it carries meaning, at the colour temperature the hour asks for.

Brand tensions held in balance (design-intelligence step 1):
- **dark ↔ precise.** Atmosphere that stays measurable: every glow on the page has a number next to it (K, lux, beam angle).
- **awe ↔ trust.** A slow, quiet opening, then plain evidence: method, schedule, projects.
- **hand ↔ exact.** Local craftspeople and custom luminaires, specified to the kelvin.

Why only Penumbra could own this: a competitor could not use the concept unchanged, because it rests on their two stated differentiators (shadow-first design, colour temperature per hour) and turns both into how the site behaves, not just what it says.

## Narrative arc
Single long page (`/`) plus one project-detail route (`/work/:slug`). Nav is fixed and minimal: wordmark `PENUMBRA` on the left; `Method · The Hour · Work · Contact` and a persistent `Start a project` link on the right, reachable from every section.

| Beat | Section | What the visitor feels | What they learn | Build notes |
|---|---|---|---|---|
| 1 | **Threshold** (hero) | Quiet awe. Stepping into a dark room, eyes adjusting. | "Light shaped by darkness", understood in under 10 s with no body copy read. | Near-black viewport. One raking **light shaft** (fragment shader) falls diagonally across a limewashed wall plane. Its soft penumbra edge is the hero image. H1 **"We design the dark first."** Words are *lit* in sequence as the shaft settles (opacity/colour only, no y-motion). Sub-line and `Start a project` sit in the dark lower-left. LCP is the H1 text, server-rendered and visible without JS. The shader fades in after load. |
| 2 | **Manifesto** (breathing section) | Stillness, conviction. | The philosophy in one paragraph. | Full viewport, one paragraph set large (display serif, light weight), left-aligned on columns 2–9. A single thin warm line (2700 K accent) is drawn under one phrase, "where darkness must stay". Nothing else moves. |
| 3 | **Method: Dark first** (advanced pinned scroll sequence) | Fascination turning into trust. *They're precise.* | The three-step method, shown on a real architectural section. | Pinned, about 300vh desktop and about 200vh mobile, scrubbed. One hairline **section drawing** of a small chapel/gallery (SVG) stays fixed while scroll moves it through 3 states; step text changes on the left with a `01/03` counter. **Step 1:** the drawing floods to dark; "protected dark" zones gain fine diagonal hatching with mono labels (`NAVE · ≤ 2 lux`). **Step 2:** beam cones (SVG clip-path wedges with gradient falloff) are cast one by one onto altar, threshold and niche, each labelled with beam angle and lux (`12° · 40 lux`). **Step 3:** a 24-hour colour-temperature band (2200 K → 5600 K → 2200 K) sweeps under the drawing and the beams re-tint to match. Ends on the line "Every hour has its own light." This hands off to beat 4. A skip link ("Skip method") sits before the pin. |
| 4 | **The Hour** (meaningful interactive) | Agency, then understanding through the body: *I can feel what they mean.* | Why per-hour colour temperature matters, and that daylight and artificial light are designed as one system. | A procedural interior (the chapel from beat 3, now rendered in tone, not line) with an east clerestory slit and an altar. A **24-hour dial/slider** (native `<input type="range">` styled, keyboard arrows step 15 min, Page Up/Down step 1 h, plus six labelled hour presets as buttons). As the hour changes: sun angle and daylight CCT move the shaft across the floor; as daylight fades, Penumbra's **artificial schedule** takes over and the two blend. A live readout in mono shows `time · daylight K · artificial K · altar lux · nave lux`, plus the atelier's one-line intent for that hour (copy below). `aria-live="polite"` announces the intent line on release, not on every tick. This is not a toy because every state is a real design decision with numbers, and the visitor sees the handover between sun and luminaire, which is the core of the offer. |
| 5 | **Four rooms** (project showcase) | Proof. Quiet admiration. | Range across sacred, museum, house and hospitality, with each room's light signature. | Four vertical chapters, one per project. A large procedural plate is revealed by a **clip-path "door opening"** (a vertical slit that widens, as light spills from an opened door), once per plate, `once: true`. Beside it: name, place/year/type, a one-line light intent, and a spec strip (`2700 K · 40 lux · 3 sources`). The plate is the link to `/work/:slug`. |
| 6 | **Lighting schedule** (project index) | "There's depth here." Calm browsing. | The full body of work, scannable. | Styled as a real **lighting schedule table**: hairline rows with columns `No. · Project · Place · Year · Type · CCT range`. Hover/focus on a row lights it: the row ground warms subtly, and a small light-signature thumbnail appears at the row's right on desktop. No movement of rows. Mobile: rows stack as two-line entries with no thumbnails. Filter chips by type (Sacred · Museum · House · Hospitality) use Flip for the reorder, ≤ 0.6 s. |
| 7 | **Atelier** (craft, short) | Warmth, human scale. | Nine people in Lisbon; custom luminaires made with local brass spinners and glassblowers. | One line of display type, three small procedural plates of luminaire details (spun brass reflector, blown-glass diffuser, a stamped serial plate `PNB-014 · 2700 K`). Static except the plate reveal. |
| 8 | **Contact** | An invitation, not a sales push. | How to start: send plans. | Dark ground. A single small warm pool of light (radial gradient, static) sits under the CTA, the only lit thing on screen, echoing the night state of The Hour. Headline, CTA, address, email, footer. |

**Project-detail route `/work/:slug`:** a full-bleed hero plate of the project, then title and meta, a short narrative (≤ 150 words), the project's **hour strip** (a static, non-interactive 6-state strip that reuses The Hour's renderer as stills), a "drawings" band on the **paper** palette (hairline plan + lighting schedule excerpt), and next/previous project. Transition in and out is **"Dim / Rise"** (see Motion).

### Copy (final for demo)
- **H1:** We design the dark first.
- **Hero sub-line:** Penumbra is a lighting atelier in Lisbon. Sacred spaces, museums, hotels and houses, lit with precision hour by hour.
- **Manifesto (53 words):** Most rooms are over-lit. We start by deciding where darkness must stay — over the nave, behind the vitrine, along the corridor at night. Then we place light only where it gives meaning, at the temperature the hour asks for. Shadow is not what is left over. It is the first thing we design.
- **Method steps:**
  1. **Survey the dark.** We map where shadow must remain before a single fitting is drawn.
  2. **Place the light.** Each source earns its position with an angle, a surface and a reason.
  3. **Schedule the hour.** Colour temperature and level are specified for every hour, from dawn to the last visitor.
- **Method closing line:** Every hour has its own light.
- **The Hour intro:** Drag through a day in the Capela do Silêncio. Watch where the sun stops and we begin.
- **The Hour preset states** (interpolate continuously between them):
  | Time | Daylight | Artificial | Altar / nave | Intent line |
  |---|---|---|---|---|
  | 06:10 | 2 400 K, low, east slit | off | 30 / 6 lux | Dawn does the work. We stay out of its way. |
  | 10:00 | 5 000 K | off | 220 / 90 lux | The nave is bright enough. Nothing is added. |
  | 13:30 | 5 800 K, overhead | off | 300 / 140 lux | Noon flattens everything, so the slit is shaded and the altar keeps its edge. |
  | 18:20 | 3 200 K, fading | 3 000 K altar at 20% | 60 / 15 lux | As the sun leaves, the altar takes over, never brighter than the window was. |
  | 21:00 | none | 2 700 K | 40 / 2 lux | The nave is allowed to be dark. |
  | 00:00 | none | 2 200 K, threshold only | 0 / 0 lux · door 8 lux | Only the door. Enough to find it. |
- **Projects (fictional):**
  | Project | Place | Year | Type | Light intent |
  |---|---|---|---|---|
  | Capela do Silêncio | Évora, Portugal | 2025 | Sacred space | One slit of dawn; the altar answers it at night. |
  | Museu das Marés | Peniche, Portugal | 2024 | Museum | Vitrines glow like rock pools in a dark hall. |
  | Casa Sombra | Comporta, Portugal | 2023 | Private house | Louvre shadows that tell the time across the floor. |
  | Hotel Alva | Porto, Portugal | 2026 | Hospitality | Corridors lit at ankle height; faces lit only at the bar. |
  Index also lists 6–8 further fictional rows (e.g. *Arquivo Municipal, Tomar, 2022, Museum* · *Igreja de São Brás restoration, Mértola, 2021, Sacred* · *Casa do Pátio, Lisbon, 2022, House* · *Pousada da Serra, Manteigas, 2024, Hospitality*). Engineering can finalise the list from ASSET_MANIFEST.
- **Atelier line:** Nine people in Lisbon. Our luminaires are spun, blown and finished by hand, two streets away.
- **Contact headline:** Send us your plans. We'll show you where the dark should stay.
- **Primary CTA:** Start a project → `mailto:studio@penumbra.example` (also nav `Start a project`).
- **Secondary CTA (showcase/detail):** See the room.
- **Footer:** Penumbra — Atelier de Luz · Rua fictícia 12, Lisbon · A fictional studio, made as a demo.

## Design language & rationale
**Primary: Luxury, in its dark-ground, architectural variant.** The audience is architects and commissioning directors. They are design-literate, they distrust spectacle, and they buy patience and craft. Luxury gives extreme negative space, slow decelerating motion, few elements per viewport, and one material-derived accent. It produces the "quiet awe" the brief asks for.

**Accent: technical-drawing precision**, borrowed from minimalist and architectural documentation: hairline rules, mono numerics, a lighting-schedule table, section drawings, spec annotations (`12° · 40 lux · 2700 K`). This makes "trust in their precision" visible. The numbers are the ornament.

Bending it to this brand:
- **Darkness is the layout.** Negative space here is dark space. Each viewport has one lit focal element (rule of one). Everything else sits in tinted near-black.
- **Light is the only highlight.** No colour fills, no cards, no shadows used as decoration. Emphasis comes from luminance and warmth.
- **Edge language: hairline, radius 0.** Architecture drawings have no rounded corners. Lines at about 14% ink for decoration; `line-strong` for interactive boundaries.
- **Grid:** 12 columns with asymmetric placements; display type is deliberately allowed to span columns 1–10 while body stays on 2–7 (measure ≤ 68ch).
- **Industry playbook (architecture portfolio):** honour rigour, space and materials, and keep images large. Break convention safely by using plans and sections as typographic art and clip-path reveals that behave like light across a plan. Avoid the trap of tiny images and slow galleries: plates are big and the index is instant.

## Palette
Derived from a material: **limewashed Lisbon wall at night, lit by a 2700 K source, with dawn daylight at the window.** No pure black or white. One dominant (ground), one support (limewash ink), one accent (tungsten) under 5% of the surface. The cool tone exists only as a functional colour-temperature signal.

| Token | Value | Role | Contrast target → measured |
|---|---|---|---|
| `--ground` | `#0d0c0b` | Unlit room; page background | — (base) |
| `--ground-raised` | `#171513` | Lit-row hover, raised surfaces, readout panel | — (surface; text measured on it below) |
| `--ink` | `#ece6da` | Limewash under warm light; body + display text | AAA body → **15.73:1** on ground, **14.65:1** on raised |
| `--ink-muted` | `#a39c90` | Captions, meta, secondary text, mono annotations | AA body (carries meaning) → **7.18:1** on ground (AAA), **6.69:1** on raised (AA) |
| `--line` | `#2b2825` | Decorative hairlines, table rules, drawing lines (≈ 14% ink) | Decorative only, exempt → 1.33:1 on ground. **Never** the sole boundary of a control |
| `--line-strong` | `#6f685d` | Boundaries of controls (slider track, filter chips, inputs) | ≥ 3:1 non-text (1.4.11) → **3.55:1** on ground, **3.31:1** on raised |
| `--accent-warm` | `#d9a05b` | 2700 K tungsten: lit words, beam cones, active states, CTA underline. < 5% of surface | AA text → **8.50:1** on ground, **7.92:1** on raised |
| `--accent-cool` | `#9db4c6` | 5600 K daylight: *only* daylight in The Hour / method step 3 and its readout values | AA text → **9.10:1** on ground, **8.48:1** on raised |
| `--accent-ink` | `#0d0c0b` | Text on a filled warm accent (e.g. pressed CTA, active chip) | AA → **8.50:1** on `--accent-warm` |
| `--focus` | `#d9a05b` (2px ring + 2px `--ground` offset) | Keyboard focus everywhere on dark | ≥ 3:1 → **8.50:1** vs ground, **7.92:1** vs raised |
| `--paper` | `#e9e3d6` | Daylight "drawings" band on the project-detail route only | — (base of paper context) |
| `--paper-ink` | `#1b1917` | Text and lines on paper; focus ring on paper | AAA → **13.71:1** |
| `--paper-muted` | `#6b5f50` | Captions on paper | AA → **4.86:1** |
| `--paper-accent` | `#8a5420` | Accent text and links on paper (tungsten darkened for daylight) | AA → **4.87:1** |

Rules:
- `--ink` on `--accent-warm` (1.85:1) and `--ink-muted` on any accent **fail**. Never put light text on the accent. Use `--accent-ink`.
- Light gradients (shafts, pools) are luminance on top of the ground. Text never sits on a shaft; captions live in the dark zones. If the shader brightens behind text at any time, the text column has a fixed ≤ 40% ground scrim.
- Grain: 3% tiled noise PNG, `mix-blend-mode: soft-light`, static.

Measured output (`node plugins/premium-web-studio/skills/design-intelligence/scripts/contrast.mjs`), run 2026-11-15:
```
# run 1: "#0d0c0b" "#171513" "#ece6da" "#a39c90" "#d9a05b" "#9db4c6" "#2b2825" "#e9e3d6" "#1b1917" "#6b5f50"
#0d0c0b            vs #171513             1.07:1  FAIL
#0d0c0b            vs #ece6da            15.73:1  AAA
#0d0c0b            vs #a39c90             7.18:1  AAA
#0d0c0b            vs #d9a05b             8.50:1  AAA
#0d0c0b            vs #9db4c6             9.10:1  AAA
#0d0c0b            vs #2b2825             1.33:1  FAIL
#0d0c0b            vs #e9e3d6            15.28:1  AAA
#0d0c0b            vs #1b1917             1.11:1  FAIL
#0d0c0b            vs #6b5f50             3.14:1  AA-large-only
#171513            vs #ece6da            14.65:1  AAA
#171513            vs #a39c90             6.69:1  AA
#171513            vs #d9a05b             7.92:1  AAA
#171513            vs #9db4c6             8.48:1  AAA
#171513            vs #2b2825             1.24:1  FAIL
#171513            vs #e9e3d6            14.24:1  AAA
#171513            vs #1b1917             1.04:1  FAIL
#171513            vs #6b5f50             2.93:1  FAIL
#ece6da            vs #a39c90             2.19:1  FAIL
#ece6da            vs #d9a05b             1.85:1  FAIL
#ece6da            vs #9db4c6             1.73:1  FAIL
#ece6da            vs #2b2825            11.79:1  AAA
#ece6da            vs #e9e3d6             1.03:1  FAIL
#ece6da            vs #1b1917            14.10:1  AAA
#ece6da            vs #6b5f50             5.00:1  AA
#a39c90            vs #d9a05b             1.18:1  FAIL
#a39c90            vs #9db4c6             1.27:1  FAIL
#a39c90            vs #2b2825             5.38:1  AA
#a39c90            vs #e9e3d6             2.13:1  FAIL
#a39c90            vs #1b1917             6.44:1  AA
#a39c90            vs #6b5f50             2.28:1  FAIL
#d9a05b            vs #9db4c6             1.07:1  FAIL
#d9a05b            vs #2b2825             6.37:1  AA
#d9a05b            vs #e9e3d6             1.80:1  FAIL
#d9a05b            vs #1b1917             7.62:1  AAA
#d9a05b            vs #6b5f50             2.70:1  FAIL
#9db4c6            vs #2b2825             6.82:1  AA
#9db4c6            vs #e9e3d6             1.68:1  FAIL
#9db4c6            vs #1b1917             8.16:1  AAA
#9db4c6            vs #6b5f50             2.89:1  FAIL
#2b2825            vs #e9e3d6            11.46:1  AAA
#2b2825            vs #1b1917             1.20:1  FAIL
#2b2825            vs #6b5f50             2.36:1  FAIL
#e9e3d6            vs #1b1917            13.71:1  AAA
#e9e3d6            vs #6b5f50             4.86:1  AA
#1b1917            vs #6b5f50             2.82:1  FAIL

# run 2: "#0d0c0b" "#171513" "#6f685d" "#e9e3d6" "#8a5420"
#0d0c0b            vs #171513             1.07:1  FAIL
#0d0c0b            vs #6f685d             3.55:1  AA-large-only
#0d0c0b            vs #e9e3d6            15.28:1  AAA
#0d0c0b            vs #8a5420             3.14:1  AA-large-only
#171513            vs #6f685d             3.31:1  AA-large-only
#171513            vs #e9e3d6            14.24:1  AAA
#171513            vs #8a5420             2.92:1  FAIL
#6f685d            vs #e9e3d6             4.31:1  AA-large-only
#6f685d            vs #8a5420             1.13:1  FAIL
#e9e3d6            vs #8a5420             4.87:1  AA
```
The FAIL rows are pairs that are never used as text on background (surface vs surface, accent vs accent, light on light). `--line-strong` is used only as a non-text boundary, where 3:1 is the requirement and both measured values pass. `--paper-accent` is used only on `--paper`.

## Type personality (final fonts in TYPOGRAPHY_SYSTEM.md)
**Personality:** *a thin line of light on a dark wall.* The display face should be a high-contrast serif used at **light weights and very large sizes**, so its hairlines read like light catching an edge. Text should be calm, unshowy and very legible on dark grounds (slightly open spacing, no hairline-thin text sizes). Numbers are a separate voice: **mono, tabular**, for every K, lux, angle, year and index number. That is the voice of precision. Uppercase labels with +0.12em tracking for kickers (`METHOD · 01/03`).

Candidates (all from the verified font library; overused families deliberately avoided: no Inter, Playfair, Instrument Serif, Cormorant, Space Grotesk):

| Role | First choice | Alternate | Why |
|---|---|---|---|
| Display | **Zodiak** (Fontshare, ITF FFL, variable). Re-read the licence at fontshare.com before shipping. | **Newsreader** (`@fontsource-variable/newsreader`, OFL-1.1, opsz). The fallback if the ITF FFL check fails. | Sharp contrast at light weights gives the "light on an edge" quality; less seen than the Google serifs. Newsreader's opsz lets one family serve display and pull-quotes. |
| Text / UI | **Hanken Grotesk** (`@fontsource-variable/hanken-grotesk`, OFL-1.1) | Schibsted Grotesk (OFL-1.1) | A quiet neutral grotesk that steps back for the serif and the numbers. Holds up at 17–19px light-on-dark. |
| Numerals / spec | **JetBrains Mono** (`@fontsource-variable/jetbrains-mono`, OFL-1.1, wght) | IBM Plex Mono (OFL-1.1) | Tabular, engineered. Used only for data (K, lux, °, time, index numbers), never for prose. |

Scale contrast ≥ 1:8 between H1 and body on desktop. Display tracking slightly negative at the largest sizes. Body on dark at weight 400 minimum (no 300 below 24px). Exact scale belongs to typography-spacing.

## Image & video direction
No photography and no video. All imagery is **procedural**: a single fragment shader (hero + The Hour, live), plus **pre-rendered stills** (AVIF/WebP, made by ai-visual-producer from the same light model via canvas/shader capture, or from SVG). All imagery is one consistent family. It is a **light study, not a photograph**: abstract architectural planes, readable as real spaces.

- **Subject matter / composition / light / grade:**
  - **Subjects:** architectural planes (walls, floors, vaults, slits, louvres, vitrines, niches) and the light and shadow on them. No people, no furniture clutter, no fake photoreal 3D.
  - **Composition:** one light source per image, entering from **upper left at about 35°**. The same direction sitewide, as if one sun crossed every project. One focal surface per plate; at least 60% of each frame stays in shadow. Define focal points for `object-position` so the lit surface survives 360px crops.
  - **Light:** soft-edged. Every shadow has a visible **penumbra gradient** (the brand's literal namesake). Hard edges are not allowed. Falloff is physically plausible (inverse-square-ish), with faint bounce light on the adjacent plane.
  - **Grade:** warm-neutral. Shadows sit at `#0d0c0b`–`#171513` and never crush to pure black. Highlights top out at `#ece6da` (limewash), never pure white. Warm light is tinted toward `--accent-warm`; daylight toward `--accent-cool`, and only in daylight scenes.
  - **Per-project plates:**
    - *Capela do Silêncio:* a barrel-vaulted nave in section; a single dawn slit throws a narrow blade of light onto a limewashed apse wall. Cool-warm 2400 K.
    - *Museu das Marés:* a dark hall with three low vitrines glowing from within, cool 4000 K, and their light pooling on a polished floor like water.
    - *Casa Sombra:* late-afternoon louvre shadows. Long parallel stripes with soft edges across a concrete floor and up a wall. 3000 K.
    - *Hotel Alva:* a long corridor in one-point perspective, lit only by ankle-height grazing slots that leave regular warm pools on stone. 2200 K.
    - *Atelier details:* macro abstractions of a spun-brass reflector (concentric highlights), a blown-glass diffuser (soft caustic), and a stamped serial plate.
  - **Method drawing (beat 3):** pure line. SVG hairline architectural section, 1px `--line` / `--ink-muted`, with mono annotations and hatching for "protected dark".
- **Treatment (masking, grain, duotone…):**
  - Static 3% grain overlay (tiled PNG, soft-light). Never a live filter.
  - Reveals use **clip-path slits** (vertical or diagonal, aligned with the 35° light), never circular masks or blur-in.
  - No duotone, no colour overlays, no vignettes beyond what the light itself produces.
  - Captions and spec strips sit beside plates on the ground, never over them.
  - Delivery: hero and The Hour are live shader, with a static AVIF poster of the same frame as fallback/LCP-safe backdrop. Plates come in 3 widths (720/1280/1920) AVIF + WebP, lazy below the fold. The hero poster is ≤ 60 KB.

## Motion personality
- **Tempo:** slow and certain, like a dimmer, not a switch. Luxury tempo (about ×1.3): `--dur-xs 0.18s` (hover/focus), `--dur-s 0.4s` (UI state), `--dur-m 0.8s` (element reveals), `--dur-l 1.3s` (section reveals, plate slits), `--dur-xl 2.0s` (hero light rise only).
- **Weight:** heavy and decelerating. Light *arrives* and settles; it never bounces, overshoots or snaps.
- **Signature ease:** a single `CustomEase` called **"dimmer"**, `M0,0 C0.32,0 0.12,1 1,1`: a slow start (filament warming), a long settle. Use it for the hero light rise, the lit-word headline, plate slits and the page transition. Other entrances use `expo.out`, exits `power2.in`, Flip reorders `power3.inOut`. Scrubbed tweens use `ease: "none"` with `scrub: 0.8`.
- **Text animation (GSAP):** headlines are **lit, not moved**. SplitText by words (by lines for the manifesto). Each word goes from opacity 0.08 and `--ink-muted` to opacity 1 and `--ink`, stagger 0.09 s, dimmer ease. At most a 4px y-offset, and only in the H1. Kickers/labels fade at `--dur-s`. Body copy is never animated.
- **Scroll:** one Lenis instance (lerp ≈ 0.09). ScrollTrigger reveals fire once. Parallax ≤ 8%, and only on decorative light layers, never on text. The one pinned sequence is the Method. The Hour is not pinned; its slider is the control.
- **Page transition "Dim / Rise" (≤ 1.2 s total):** on leaving, the current page dims to `--ground` (0.45 s, `power2.in`). On the detail route, the hero plate's light rises from dark (0.7 s, dimmer), and the title is lit word by word. Back navigation runs the reverse. Focus moves to the new page's `h1`. All ScrollTriggers, Lenis listeners, the WebGL context and RAF loops are killed on route exit (this is the lifecycle test the brief wants).
- **What never moves:** nav, body paragraphs, the index table rows (they only *light*), contact details, the footer, and form/slider controls themselves (only their values change).
- **Reduced motion:** no Lenis interpolation, no pin. The Method renders as three stacked static drawings, one per step, each fully annotated. Headlines are fully lit with no animation. Plates show at once (≤ 0.2 s opacity). The hero shader renders a single static frame or the poster. The Hour keeps full function but jumps between states (≤ 0.2 s crossfade) instead of animating the sun. The page transition becomes a 0.2 s crossfade.

## Signature moment(s)
1. **The Threshold shaft + lit headline (hero).** A single diagonal light shaft, with a soft penumbra and faint dust/grain inside the beam, slowly "warms on" across a dark wall over 2.0 s. As it passes, the words of "We design the dark first." are lit one by one. It communicates the whole philosophy in under 10 seconds with no reading.
2. **The Hour (interactive).** Dragging through a day in the chapel. The visitor *feels* the colour temperature shift from 2400 K dawn to 5800 K noon to 2200 K midnight, and sees the moment the sun hands over to Penumbra's luminaires. The readout and intent lines prove the precision.

**Is a lightweight WebGL shader justified? Yes, for these two moments only, and as one shared program.** A single fullscreen-quad fragment shader (no three.js; raw WebGL2 or a tiny wrapper such as OGL, technical-architect's call) models one directional "sun" plus up to 3 point/spot sources, with uniforms for angle, CCT (kelvin → RGB in-shader), intensity and penumbra softness, over 2–3 flat architectural planes. The hero uses it with fixed uniforms and a short intro tween. The Hour drives the same uniforms from the slider. Justification: continuous colour-temperature blending and soft-penumbra falloff at 60 fps is exactly what CSS gradients do badly, and it *is* the product. Constraints: render at ≤ 1× DPR on mobile, pause when off-screen and on `visibilitychange`, budget ≤ 4 ms/frame on a mid-range phone. Fallbacks: no WebGL2 → the static poster plus, for The Hour, 6 pre-rendered stills crossfaded per preset with the readout still live. The method sequence (beat 3) is SVG + ScrollTrigger only, with no WebGL.

Both moments are framed by quiet sections: the manifesto breathes before the method; the showcase settles after The Hour.

## Deliberately not doing
- **No cursor "flashlight"/spotlight effect.** It's the cliché of every dark site, and it contradicts the brand: Penumbra places light deliberately; a visitor waving it around at random is the opposite message.
- No custom cursor, no magnetic buttons, no cursor-follow previews.
- No 3D models, no three.js scene, no lens flares, bloom haze or neon glow.
- No gold gradients, no metallic text, no script fonts.
- No preloader or percentage counter; content and H1 are visible immediately.
- No horizontal scroll gallery, no marquee, no text scramble, no split-letter bounce.
- No rounded cards, drop shadows or glassmorphism. Hairlines and darkness only.
- No pure `#000` / `#fff`.
- No autoplay sound or video.
- No pinning except the Method; no scroll-jacking of The Hour (the slider is the control, scroll stays free).
- No stock "architect at desk" imagery, no fake photoreal renders, no people.
- Cool blue is never decorative. It appears only as measured daylight.

## Alternates considered
- **A. "The Lighting Schedule"**: the entire site as a daylight spec document on paper grounds, editorial and tabular. Precise, but it loses the *awe* and doesn't show darkness. Kept as the paper "drawings" band on the detail route and the index table styling.
- **B. "One room, twenty-four hours"**: the whole homepage as a single room where scroll position equals time of day. Strong, but it is total scroll-jacking, hides the work behind the gimmick, and is fragile on mobile. Its essence lives on as The Hour, where the user has explicit control.
- **C. "Aperture"**: every section revealed through slits and doorways, a purely transitional concept. Too thin to carry a whole site. It survives as the clip-path "door opening" plate reveal.
