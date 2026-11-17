# Reference Research - Halde
_Phase 2 · 2026-11-17 · Source: existing library only, no new capture (A7). Labels: [M] measured, [O] observed, [I] inferred, [?] unknown. Numbers quoted from library entries._

## References (all entries <6 months old)
1. **Typewolf** - https://www.typewolf.com/ · entry 2026-11-15 · confidence high
   Lesson: warmth and credibility come from one serif family, a tinted ground (bg rgb(230,221,222), text rgb(68,50,53) [M]) and white mats, not effects. 0 scripts, LCP 460 ms [M]. Take the tinted-paper + mat idea for "clay/glaze" swatches in CSS.
2. **Instrument** - https://www.instrument.com/ · 2026-11-15 · high
   Lesson: a full-width wordmark plus a narrow (~550 px [O]) centred serif-italic statement gives hierarchy with no motion. Wordmark as inline SVG is [I] (not confirmed). Serif:sans ~3:1 [I]. Wheel 600 -> 600 at 16 ms, native scroll [M]. Its CLS 0.107 [M] warns us to reserve space.
3. **Immersive Garden** - https://immersive-g.com/ · 2026-11-17 · LOW (partial; scroll [?])
   Lesson: pale grey ground rgb(232,232,232), serif h1 56/61.6 px + 14 px grotesk chrome [M]; a tonal relief texture is "tactile" without colour [O]. We can imitate the relief with CSS gradients/SVG feTurbulence [I]. Do not copy its WebGL/14.6 MB payload [M].
4. **Floema** - https://floema.com/ · 2026-11-17 · medium (partial; consent modal hid content)
   Lesson: maker-of-physical-things on warm off-white rgb(242,239,234), one custom serif, h1 57.2 px / 1.05, tracking -4% [M]. Lenis softer than most: 51% of 600 px at 100 ms, `likelySmoothed` true [M]. Numbered 01-04 slides at ~1,470 px scroll each [M,O] = model for our 3 numbered steps (pin optional [I]).
5. **Apple AirPods Pro 3** - https://www.apple.com/airpods-pro/ · 2026-11-17 · medium
   Lesson: repeated "eyebrow + two-line statement + one object" module with identical rhythm; 96/56/28 px sizes, body 17/25 px [M]. Sticky local nav with a persistent action [O] -> our mailto CTA reachable after hero. Native scroll, no libs [M]. Image-heavy (7.7 MB [M]); we have none.
6. **Santal** - https://santalarch.com/ · 2026-11-17 · medium
   Lesson: restraint (one face, hairlines, 10 px captions weight 500 [M]) and scale as the only drama; giant wordmark -5% tracking, 98/86.2 px [M]. LCP 15,168 ms [M] with WebGL: ship a static first frame, we have no WebGL.

## Patterns to adopt
- One serif-forward system face stack (A1: system fonts) + small tracked caps for labels; hierarchy by size, not colour (Typewolf, Santal, Apple).
- Warm tinted paper ground with a flat "mat"/hairline framing instead of shadows (Typewolf, Floema).
- Numbered 01/02/03 step module with identical rhythm; eyebrow + short statement + one CSS-drawn object (Apple, Floema).
- Narrow centred statement column with big vertical whitespace (Instrument) for the "unhurried" tone.
- Lenis tuned soft but short (Floema [M] as the upper bound); native-feeling, reduced-motion = off.
- Sticky/near-hero contact link with visible email (Apple pattern).
- Static, instantly painted first frame; reserve space via aspect-ratio (Santal, Instrument).

## Patterns to avoid
- Loaders/intro gates and counters (Immersive Garden): hide content from chefs and delay the CTA.
- Heavy WebGL or large asset payloads (Santal, Immersive Garden); also unverified scroll behaviour [?].
- Modals/banners over the hero (Floema consent modal); we have no analytics so need none (A6).
- Missing h1 (Instrument, Typewolf, Santal all h1Count 0 [M]): ours needs one.
- Over-pinning: ~1,470 px per slide is too long for a 3-step read; keep steps short [I].
- Tight -4/-5% tracking at body sizes; keep it display-only [I].

## Gaps
- No ceramics/craft-food library entry [?]; no measured motion easing for hover/reveal on any entry [?].
