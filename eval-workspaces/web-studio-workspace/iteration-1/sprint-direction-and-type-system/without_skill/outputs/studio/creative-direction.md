# Aster C1 launch page: creative direction

Status: proposal for approval. No site code exists yet.

## 1. The idea: "A quiet instrument"
The C1 is sold the way a good watch or a Leica is sold: by restraint and by evidence. The page should feel like a well-made technical object. It is calm and exact, and nothing on it is shouting.

One-line brief for everyone on the project: **say less, show the part, print the number.**

Why this works for the audience: design-minded 30-50 commuters (Monocle readers) distrust adrenaline. They respond to craft, material honesty, and confidence that doesn't need volume. At EUR 6,200 the page must justify the price through precision, not hype.

## 2. Tone of voice
- Declarative, short sentences, no exclamation marks, no "unleash", "crush", "beast", "adventure".
- Specifics over adjectives: "10.9 kg" beats "ultra-light".
- Dutch understatement. Dry is allowed, jokes are not.
- Sample headline: "Ten point nine kilograms. Nothing to maintain." Alt: "The quiet way across the city."
- Sample label: "Belt drive. No oil, no noise, no stained trousers."

## 3. Visual principles
1. **Quiet.** One idea per screen. Lots of empty space. Maximum ~3 type sizes visible at once.
2. **Engineered.** Visible grid, hairline rules, small tabular spec labels (like a drawing's title block). Numbers are set in monospace with tabular figures.
3. **Material.** Carbon weave, belt, lights, shown in macro, evenly lit, neutral. Photography is documentary, not heroic: city mornings, overcast light, no motion blur, no jumps, no riders in lycra.
4. **Slow.** Motion, if any, is a gentle fade or a 400-600 ms ease. No parallax spectacle, no autoplay sound. Respect prefers-reduced-motion.

## 4. Colour (small palette, one accent)
| Role | Name | Hex | Notes |
|---|---|---|---|
| Ground | Paper | #F2F0EB | warm off-white, default background |
| Ground alt | Fog | #E4E2DC | section alternation, cards |
| Text | Graphite | #1B1C1E | 15.6:1 on Paper |
| Secondary text | Slate | #5A5D62 | 5.9:1 on Paper (AA) |
| Rules | Hairline | #C9C6BE | 1px dividers |
| Dark ground | Carbon | #121314 | one or two inverted sections (the frame, the lights) |
| Accent | Signal | #D8431F | used sparingly: one CTA, one dot, the lights. Only on Paper/Carbon with large text or non-text use; use Graphite text on it never; check 4.5:1 before using as text (it is 4.3:1 on Paper, so text use is limited to 24px+ or bold 19px+) |

Rule: Signal appears at most twice per viewport.

## 5. Page structure (single page, in order)
1. Hero: product on Paper, one headline, price and "Reserve" link. Spec strip: 10.9 kg / Carbon / Belt / Integrated lights.
2. The thesis: two sentences, large serif, lots of space.
3. Weight: 10.9 kg, one big figure, comparison in a quiet table.
4. Frame: carbon macro, dark section.
5. Belt drive: why no chain, service interval, silence.
6. Lights: integrated, shown at dusk, dark section.
7. Specification: full table, mono labels.
8. Made in Rotterdam: the 14 people, workshop, honesty about batch size.
9. Reserve / order: price EUR 6,200, deposit and delivery March, test-ride booking, FAQ.
10. Footer: contact, legal.

Claims such as weight, range and motor specs must come from Aster engineering; placeholders are marked [TBC] in copy later.

## 6. Do / Don't
Do: generous margins, left-aligned text, real numbers, one CTA style.
Don't: gradients, glows, italic-all-caps, diagonal cuts, stock cyclists, countdown timers, "limited!" pressure, emoji, more than two weights per family on screen.

## 7. Assumptions (no questions asked this run)
- Launch is March 2027, page is in English first; Dutch to follow (type system supports Dutch diacritics and long compound words, see type-system.md).
- Single page, static or lightly dynamic; performance and accessibility matter more than effects.
- Brand mark exists and is supplied; it is not redesigned here.
- Photography will be commissioned or shot in-house; until then placeholders are neutral grey boxes with correct aspect ratios.
- EU audience: fonts are self-hosted (no Google Fonts CDN calls) to avoid GDPR exposure and to speed loading.
- Reservation/payment is handled by an existing provider; out of scope.
