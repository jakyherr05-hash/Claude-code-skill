# Creative Direction — Aster C1 Launch
_Owner: creative-director (performed by the orchestrator in this run) · Status: draft, awaiting client approval · Date: 2026-11-15_
_Track: Sprint, light pass. Reference research was skipped on purpose: the brief gives a clear audience and tone, and no live sites were inspected. Nothing below is copied from a reference._

## Brand tension (three pairs to hold in balance)
- exact <-> calm
- engineered <-> humane (a daily companion, not a gadget)
- rare (EUR 6,200, 14 people) <-> unshowy (no status theatre)

## Concept (one sentence)
**"Measured, not shouted":** the Aster C1 is presented like a precision instrument, so the page speaks in measurements, materials and silence, and never in adjectives like "powerful" or "extreme".

Working line for the hero (placeholder copy, for the client to rewrite): *"Ten point nine kilograms. Nothing you hear."*

## Design language & rationale
Primary: **Minimalist** (design-languages.md). Accent: **Editorial** (the Monocle reading habit).
- Minimalist because the object is the claim: light, belt-driven, unadorned. Hierarchy comes from size and space, not decoration.
- Editorial because the audience reads long, well-set text and trusts a publication voice: a literate serif for headlines, captions and kickers as design elements, text measured at 60ch.
- Rejected on purpose: Automotive (dark studio, speed, pinned image sequences = "sporty"), Futuristic (gadget energy), Luxury (gold/didone = status, wrong calm), Cinematic (scroll-jacking, heavy media).
- Edge language: **hairline** (1px at ~16% ink), radius **0** everywhere including the CTA button (square-cornered). No shadows. No gradients.

## Narrative arc
| Beat | Section | What the visitor feels | What they learn |
|---|---|---|---|
| 1 Arrival | Hero: wordmark, one headline, one image of the bike alone in calm light, "Reserve" + "March" | Quiet, curiosity | A new bike exists; it is not what they expected from "e-bike" |
| 2 The Weight (signature) | One near-empty viewport: **10.9 kg** | Surprise, then trust | It is exceptionally light. Stated as a measurement, with a plain comparison line (client supplies) |
| 3 Material | Carbon frame: macro detail + 2 lines of copy | Respect for craft | Why carbon, how it is made in Rotterdam (client to confirm any claim) |
| 4 Silence | Belt drive: no chain, no grease, no noise | Relief | Practical daily benefit; clean trousers, little maintenance (claims to be confirmed by Aster) |
| 5 Dusk | Integrated lights (the single dark section) | Safety and ease | Lights are part of the frame, always there |
| 6 Specification | Instrument-panel spec table, ruled lines, tabular figures | Confidence | Full facts; gaps labelled "to be supplied" until Aster provides them |
| 7 Reserve | EUR 6,200, March, one CTA, delivery/returns/warranty line (client to supply) | Calm decision | What it costs, when, what to do next |

## Palette
Born from materials: unbleached paper, graphite carbon, a single dyed-textile accent (aster violet). Contrast measured with design-intelligence/scripts/contrast.mjs on 2026-11-15 [M].
| Token | Value | Role | Measured contrast |
|---|---|---|---|
| `--paper` | `#EEEBE5` | ground (default) | base |
| `--paper-raised` | `#E4E0D8` | panels, spec table rows | ink 13.6:1 (via #15171A on E4E0D8), muted 5.18:1 |
| `--ink` | `#15171A` | primary text | 15.09:1 on paper (AAA) |
| `--ink-muted` | `#585B60` | secondary text, captions | 5.73:1 on paper, 5.18:1 on paper-raised (AA) |
| `--line` | ink at 16% alpha | hairlines, decorative only | not text; do not use for input borders (use ink-muted, which is >= 3:1) |
| `--aster` | `#4A4FA3` | accent: CTA fill, focus ring, the scale tick on the weight rule; <5% of any viewport | 6.01:1 on paper; white on aster 7.15:1 (AAA) |
| `--graphite` | `#121416` | the one dark section | paper text on graphite 15.52:1 |
| `--graphite-muted` | `#9A9DA3` | secondary text on dark | 6.79:1 on graphite (AA) |
| `--aster-on-dark` | `#8E92E0` | accent on dark (focus ring, light glyph) | 6.45:1 on graphite |
Rules: no pure #000/#fff grounds (white text on the aster button is the only #FFF). Accent never used for body text links larger than the CTA and focus ring; text links are ink with a hairline underline.

## Type personality (final fonts in TYPOGRAPHY_SYSTEM.md)
Literate and exact. A light, optically-sized text serif for headlines (editorial voice, hairlines that look drawn rather than stamped), a neutral, technical sans for everything functional (specs, labels, body). No condensed, no wide, no italics for emphasis, no all-caps headlines. Uppercase appears only in small tracked labels.

## Image & video direction
- Subject: the bike alone, calm, true to scale. Rotterdam as quiet context: early morning, overcast, wet stone, brick, water. Riders (if any) are dressed for work, upright, unhurried, shot from a distance or cropped to hands and bag.
- Light: soft overcast daylight, long exposures of dusk for the lights section; no flash, no lens flare.
- Grade: neutral-cool, low contrast, slightly desaturated greys with warm paper highlights. One treatment family for every image.
- Macro: carbon weave, belt teeth, frame joins, light housing. Real objects, honest detail.
- Composition: one focal element per viewport; generous empty frame; images sit on the grid and keep hairline-aligned edges. No full-bleed text-over-image except the dusk section, where text sits in the calm lower-left zone.
- Video: none required. If added later: muted, slow, under 10 s, paused under reduced motion.
- Provenance: all photography must be Aster-owned or commissioned with written commercial rights. AI-generated imagery is not assumed and, if used, must be disclosed to Aster and logged in ASSET_MANIFEST.md.

## Motion personality
- Tempo: slow-and-exact. 400-700 ms for reveals, 150-250 ms for UI feedback.
- Weight: light object, so little mass. Ease: decelerating, no overshoot, no bounce (`power2.out` / `cubic-bezier(0.2, 0, 0, 1)`).
- What moves: opacity and 8-16 px translate on reveals; the weight rule (below). Nothing else.
- What never moves: body text, nav, prices, spec values. No parallax, no scroll-jacking, no pinned image sequences, no cursor effects, no preloader.
- Scroll: native scrolling is the baseline. Smooth scroll (Lenis) is optional and, if used, gentle; it must never delay anchor jumps. Decision deferred to build.
- Reduced motion: every reveal becomes an instant final state; the weight rule renders at 10.9 immediately.

## Signature moment
**"The Weight."** One viewport, mostly empty paper. A single figure, **10.9 kg**, set very large in the display serif. Beneath it a hairline ruler graduated like a scale; as the section enters, a single aster-violet tick travels from 0 to 10.9 over about 1.2 s and settles. No counting digits, no sound, no bounce. It is the only large motion on the page and costs two CSS-sized elements (no WebGL, no video). The reduced-motion version is the static final frame. The figure is real text (selectable, screen-reader readable: "10.9 kilograms").

Supporting quiet moment: **"Dusk"**, the only dark section. The page goes from paper to graphite and back, a hush that matches the lights and the belt's silence.

## Deliberately not doing
- No speed, slope, mountain, jump, sweat, or "beast / power / extreme / crush / conquer / performance" vocabulary or imagery.
- No diagonal cuts, speed lines, motion blur, neon, gradients, glows, grain, glassmorphism, drop shadows.
- No condensed or ultra-wide display type, no all-caps headlines.
- No wattage / torque / "up to X km" figures as hero claims.
- No 3D configurator, no WebGL, no autoplay video, no countdown timer, no carousel, no pop-ups beyond what consent law requires.
- No parallax or scroll-jacking.
- No generic "Inter on off-white, fade-up everything" treatment: motion is rationed to one signature moment.

## Alternates considered
1. **Cinematic automotive** (dark studio, pinned scroll through the frame). Rejected: reads sporty, heavy media, scroll control loss, wrong for the audience.
2. **Luxury / didone** (high-contrast serif, gold). Rejected: status signalling is the opposite of calm; EUR 6,200 buyers here read craft, not bling.
3. **Full editorial magazine** (Monocle pastiche). Kept only as the accent language; a full imitation would bury the product and drift toward copying.

## Open questions for the client (answered with assumptions for now)
See PROJECT_BRIEF.md assumptions. Highest impact: hero copy and tone-of-voice, available photography, and what "Reserve" actually does.
