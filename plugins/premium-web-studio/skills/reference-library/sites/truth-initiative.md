---
name: Truth Initiative
url: https://truthinitiative.org/
slug: truth-initiative
category: other
tags: [youth-prevention, nonprofit, health, research-hub, jeko, din, cream-purple, help-line-cta, mobile-ok, native-scroll]
researched: 2026-11-17
status: inspected
confidence: medium
evidence: ../evidence/truth-initiative/
---

# Truth Initiative

Claim labels: **[M]** measured (capture.json) · **[O]** observed in screenshots · **[I]** inferred · **[?]** unknown. Captured with `--tablet --filmstrip 12`; filmstrip.jpg is a contact sheet of the frames, plus desktop-0, mobile-0, tablet-portrait-0. Studied for the OZONE youth-vaping-prevention project; no copy, brand or assets are reused.

## At a glance
The research/advocacy organisation behind the truth campaign [M title "Truth Initiative: freedom from nicotine addiction"]. 5,162 px native-scroll page [M]. Lesson for OZONE: its credibility devices (dated press releases, "Research & Resources", a text-to-join help line) and the primary-source status of its data; as a *design* it is a standard nonprofit hub.

## Design characteristics
- Cream and white fields, purple CTAs, a persistent orange-to-purple circular "Explore what we do" scroll button that follows the user [O scroll-01, 02, 05].
- Card carousel of dated news/research items with category tags ("E-cigarettes / vaping", "Health") [O scroll-03]; the footer area carries a tiled line-icon pattern, a dark-purple "Want support quitting? Join EX Program" bar with a phone-number field, and an in-circle "TEXT ... TO 88709 for free help quitting" [O scroll-05, 06].
- Headings 60 px for section titles ("Our latest research and resources"), 35 px for hero card headings [M].

## Typography
- Jeko Bold (900) display and Jeko text, DIN fallbacks; body 16 px / 20 px [M]. Loaded: DIN, Jeko, Jeko Bold, icomoon [M].

## Responsive (390px observation)
- No overflow [M]; header collapses to logo + search + menu; the hero carousel is cropped at the left edge (text clipped "cators: / y to quit") [O mobile-0], a layout fault to avoid. h1 24 px [M].

## Performance (single lab run, indicative only)
- DCL 2,678 ms, LCP 3,016 ms, CLS 0.133 [M]; 149 requests [M]. Fails OZONE's CLS and LCP targets.

## Useful implementation ideas (original re-implementations, not copies)
- The free-help line as a persistent, visible element (here a floating circle) is the right idea; for OZONE make it a quiet fixed text link, not a blob.
- Date-stamping facts and linking to research builds trust; mirror with a visible Sources chapter.

## Unknowns / not verified
- Primary data on the site was not read or verified for this study; no statistic here is endorsed [?].
