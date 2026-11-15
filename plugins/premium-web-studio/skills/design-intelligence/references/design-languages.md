# Design languages

Contents: Luxury · Editorial · Minimalist · Brutalist · Futuristic · Technology · Automotive · Fashion · E-commerce · Cinematic storytelling · Interactive portfolio · Product experience · Corporate · Experimental

Each entry: **Essence** · **Type** · **Space & grid** · **Palette** · **Imagery** · **Motion** · **Fits** · **Pitfalls**. These are starting positions, not templates — combine one primary with at most one accent, then bend toward the brand.

---

## Luxury
- **Essence:** scarcity, patience, craft. The site behaves like a quiet salesperson who never hurries you.
- **Type:** high-contrast serif or refined didone/transitional display at very large sizes, light weights; a restrained sans for UI at small sizes with generous tracking on uppercase labels (+0.08–0.16em). Optical-size axis (opsz) is gold here.
- **Space & grid:** extreme negative space; asymmetric placements on a 12-col grid; few elements per viewport; long section padding (16–28vh).
- **Palette:** near-black or warm off-white grounds (avoid pure #000/#fff), one metallic or material-derived accent (brass, oxblood, sea-glass) used sparingly.
- **Imagery:** large, slow, art-directed; macro texture of material; controlled light; avoid stock-y smiles.
- **Motion:** slow (0.9–1.6s), strongly decelerating eases (expo/power4.out), clip-path/mask reveals, parallax ≤ 10%, nothing bouncy.
- **Fits:** fashion houses, jewellery, hospitality, real estate, fragrance, watches, spirits.
- **Pitfalls:** gold gradients, script fonts, autoplay music, slowness that blocks content (keep everything skippable and fast to LCP).

## Editorial
- **Essence:** a magazine that happens to be interactive; reading is the experience.
- **Type:** expressive serif headlines with personality (variable, opsz), a highly legible text face (serif or humanist sans) at 18–21px, small caps/kickers, pull quotes, drop caps used deliberately.
- **Space & grid:** strong column logic, visible baseline rhythm, asymmetric image/text layouts, captions and credits as design elements.
- **Palette:** paper tones, ink, one spot colour per story.
- **Imagery:** documentary photography, full-bleed spreads alternating with column-width images.
- **Motion:** minimal; reading progress, image reveals, subtle sticky captions. Never animate body text in.
- **Fits:** publications, culture institutions, long-form brand stories, research reports, journals.
- **Pitfalls:** measure > 75ch, tiny body text, animating paragraphs.

## Minimalist
- **Essence:** only what's necessary, perfectly placed.
- **Type:** one family (often a neo-grotesk or geometric sans) in 2–3 weights; hierarchy by size and space, not decoration.
- **Space & grid:** rigorous grid, strict alignment, consistent spacing scale (8pt or 4pt base), lots of white.
- **Palette:** monochrome + one accent.
- **Imagery:** few, centred, product-isolated or architectural.
- **Motion:** short (0.3–0.6s), precise, opacity/translate only; motion as feedback, not spectacle.
- **Fits:** product companies, SaaS, architecture, design tools, Scandinavian/Japanese-leaning brands.
- **Pitfalls:** emptiness without hierarchy (minimal ≠ unfinished); low-contrast grey text.

## Brutalist
- **Essence:** honesty of the medium; raw structure on display; confidence that can afford rudeness.
- **Type:** monospace or grotesk at huge sizes, uppercase, tight tracking; system fonts used on purpose; deliberate collisions.
- **Space & grid:** visible borders and grid lines, dense blocks, abrupt scale changes, intentional overflow (that still doesn't break mobile).
- **Palette:** black/white + one loud primary or acid colour; or raw unstyled defaults.
- **Imagery:** flash photography, scans, low-fi, dithered, cut-outs.
- **Motion:** instant state changes, stepped eases, marquee tickers, cursor-following elements, hard cuts.
- **Fits:** creative agencies, fashion streetwear, music, galleries, developer tools with attitude.
- **Pitfalls:** unusable navigation, inaccessible contrast/colour combos, "ugly" that reads as broken rather than intended.

## Futuristic
- **Essence:** a glimpse of a technology not yet ordinary.
- **Type:** wide/extended sans or geometric display, mono for data, variable width axis animation.
- **Space & grid:** HUD-like overlays, data annotations, generous dark space, layered depth.
- **Palette:** deep space darks, luminous accents (one or two), gradients as light, not decoration.
- **Imagery:** 3D renders, particles, shaders, light volumes.
- **Motion:** WebGL heroes, scramble/decode text, scroll-driven camera paths, glow and bloom used sparingly.
- **Fits:** AI, space, quantum, energy, future-mobility, gaming.
- **Pitfalls:** generic purple-blue gradient blobs, illegible thin type on dark, GPU-heavy scenes that tank mobile.

## Technology (SaaS / dev tools)
- **Essence:** clarity and competence; show the product working.
- **Type:** precise grotesk + mono; tabular numerals; strong UI-scale hierarchy.
- **Space & grid:** bento grids, product UI framed with care, dense but ordered.
- **Palette:** dark or light neutral base, one brand colour, semantic colours from the product.
- **Imagery:** real product UI (crisp, possibly animated), diagrams, code.
- **Motion:** product demos assembled with GSAP timelines, Flip for state changes, number counters, scroll-scrubbed feature walkthroughs.
- **Fits:** SaaS, APIs, infrastructure, fintech, developer platforms.
- **Pitfalls:** fake dashboards, every card glowing, "AI-powered" sparkle everywhere.

## Automotive
- **Essence:** engineered emotion — performance, form and sensation.
- **Type:** wide/extended sans display, technical secondary, spec typography with tabular figures.
- **Space & grid:** cinematic full-bleed, horizontal compositions, spec sheets as editorial grids.
- **Palette:** dark studio grounds, paint-colour accent derived from the hero model, metallic neutrals.
- **Imagery:** studio light on surfaces, motion blur, detail macros; 3D configurators.
- **Motion:** pinned scroll sequences (image sequence or 3D camera orbit), speed lines expressed via scale/blur, heavy eases for mass, snappy for performance trims.
- **Fits:** car/motorbike brands, EV launches, mobility, high-end engineering.
- **Pitfalls:** 300 MB of image sequences, configurators that block mobile, unreadable spec text over imagery.

## Fashion
- **Essence:** attitude and seasonality; the collection is the hero.
- **Type:** editorial serif or condensed sans, often oversized and cropped; logos treated typographically.
- **Space & grid:** lookbook rhythms, overlapping layers, unexpected crops, horizontal scroll galleries.
- **Palette:** from the season's collection; often near-monochrome with one seasonal colour.
- **Imagery:** campaign photography and film, full-bleed video, cut-out products.
- **Motion:** image transitions (clip-path, scale), cursor-follow previews, horizontal pinned galleries, page transitions that keep the image (Flip).
- **Fits:** fashion labels, beauty, accessories, footwear drops.
- **Pitfalls:** products impossible to find/buy, unlabelled icon-only nav, heavy video on mobile.

## E-commerce (premium)
- **Essence:** desire → confidence → purchase with zero friction.
- **Type:** brand display for storytelling, highly legible UI sans for product/price/cart.
- **Space & grid:** product grids with consistent aspect ratios, sticky purchase panels, clear price hierarchy.
- **Palette:** neutral to let products sing; accent reserved for primary CTA.
- **Imagery:** consistent product photography (same light, angle, background), lifestyle in editorial bands.
- **Motion:** micro-interactions on add-to-cart, Flip for filter/sort changes, image zoom; scroll storytelling only on brand pages, never in the checkout path.
- **Fits:** DTC brands, boutiques, marketplaces with a premium tier.
- **Pitfalls:** animation slowing the PDP, CLS from late images/prices, hidden shipping/returns info.

## Cinematic storytelling
- **Essence:** the page is a film the visitor directs by scrolling.
- **Type:** few words, very large; captions like subtitles; chapter markers.
- **Space & grid:** full-viewport scenes, pinned chapters, letterboxing, sound-design-like pacing (tension → release).
- **Palette:** graded like film — a defined LUT mood (teal/orange, bleach bypass, warm tungsten).
- **Imagery:** video, image sequences, layered parallax planes, WebGL.
- **Motion:** scrubbed timelines, pinned scenes, camera moves, crossfades, text appearing in sync with picture.
- **Fits:** launches, campaigns, documentaries, annual reports, nonprofits, games.
- **Pitfalls:** scroll-jacking that removes control, enormous media payloads, no way to skip to content.

## Interactive portfolio
- **Essence:** the work, framed by a personality.
- **Type:** a voice-y display face or mono; project titles as large typographic objects.
- **Space & grid:** index/list views + immersive project views; hover previews.
- **Palette:** personal; often duotone.
- **Imagery:** the projects themselves, consistently treated.
- **Motion:** cursor-follow image previews, Flip between list and detail, page transitions, playful but fast.
- **Fits:** designers, studios, photographers, architects, developers.
- **Pitfalls:** gimmick over work, slow to the first project, hover-only interactions with no touch alternative.

## Product experience
- **Essence:** understand and want one object.
- **Type:** clean sans with technical secondary; feature names large, specs small and precise.
- **Space & grid:** centred hero object, feature callouts orbiting it, comparison tables.
- **Palette:** derived from product finishes.
- **Imagery:** 3D model or high-res renders, exploded views, macro details.
- **Motion:** scroll-controlled 3D rotation/explode, image sequences, sticky product with changing captions.
- **Fits:** hardware, consumer electronics, furniture, instruments, wearables.
- **Pitfalls:** 3D that adds nothing over good photography, missing price/CTA.

## Corporate
- **Essence:** trustworthy, clear, current — without being dull.
- **Type:** dependable sans (humanist or neo-grotesk) with a characterful display cut for headlines.
- **Space & grid:** clear IA, consistent modules, predictable navigation.
- **Palette:** brand colours with a well-defined neutral system; accessible by default.
- **Imagery:** real people and places (no generic stock), data visualisation.
- **Motion:** subtle reveals, counters, smooth anchors; motion never gets in the way of finding information.
- **Fits:** enterprises, professional services, healthcare, public sector, finance.
- **Pitfalls:** carousels, jargon, inaccessible PDFs, decorative motion that slows tasks.

## Experimental
- **Essence:** the interface itself is the idea.
- **Type:** variable fonts animated on axes, kinetic type, custom glyph manipulation.
- **Space & grid:** broken or generative grids, canvas-based layouts, physics.
- **Palette:** anything — but chosen.
- **Imagery:** generative, shader-driven, user-created.
- **Motion:** physics (Draggable + Inertia), Observer-driven gestures, shaders reacting to input, audio-reactive.
- **Fits:** art projects, festivals, labs, awards-bait microsites, music releases.
- **Pitfalls:** no fallback, no keyboard path, crashes on low-end phones, unreadable for screen readers. Always ship an accessible "plain" path.
