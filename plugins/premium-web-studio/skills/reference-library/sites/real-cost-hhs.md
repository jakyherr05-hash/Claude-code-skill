---
name: The Real Cost - Vapes (U.S. FDA/HHS)
url: https://therealcost.betobaccofree.hhs.gov/
slug: real-cost-hhs
category: other
tags: [youth-prevention, government-campaign, anton, yellow-highlight, black-chalk, carousel, q-and-a-bubbles, sources-accordion, mobile-ok]
researched: 2026-11-17
status: inspected
confidence: medium
evidence: ../evidence/real-cost-hhs/
---

# The Real Cost - Vapes (U.S. FDA/HHS)

Claim labels: **[M]** measured (capture.json) · **[O]** observed in screenshots · **[I]** inferred · **[?]** unknown. Captured with `--tablet --filmstrip 12`; filmstrip.jpg is a contact sheet of the frames, plus desktop-0, mobile-0, tablet-portrait-0. Studied for the OZONE youth-vaping-prevention project; no copy, brand or assets are reused.

## At a glance
Federal youth vaping prevention site ("What Is The Real Cost? - Smoking and Tobacco Facts" [M title]). 4,044 px native-scroll page [M] with a narrow ~880 px stage on black [O]. Lesson for OZONE: the closest *subject* match: one claim per screen, a yellow highlighter on the one word that matters, a Q&A bubble pattern for myths, and a "Sources" accordion in the footer.

## Design characteristics
- Black page; white strip header "THE REAL COST" with warning triangle; wordmark lock-up with a yellow disposable-device graphic [O scroll-00].
- Beats in a chalkboard-textured panel: "VAPING AS A TEEN CAN PUT YOUR MENTAL & PHYSICAL HEALTH AT RISK" (yellow marker highlights on MENTAL, PHYSICAL), then "TEENS WHO VAPE RISK GETTING SERIOUSLY ADDICTED" beside a line-drawn brain/inhaler illustration; white hand-drawn line curves run between beats as connective tissue [O scroll-00..02].
- Carousel dots (3 slides) inside each panel with arrow buttons [O scroll-01, 02]; a Q&A module: question in a dark speech bubble ("Aren't vapes just vapor?"), answer in a white bubble [O scroll-03].
- A video poster of a face behind coloured products with "THAT ESCALATED QUICKLY" [O scroll-03]. Closing panel: "Want to quit vaping? It's okay to ask for help." with a single yellow "Find Help & Support" button [O scroll-04], then a collapsed "Sources" accordion and legal footer [O].

## Typography
- Anton 400 caps; h1 36 px (letter-spacing 1.44 px), panel headings 27 px; Poppins 400 for body 18 px / 22.5 px [M].

## Responsive (390px observation)
- No overflow [M]; mobile stacks the wordmark lock-up then a full-width chalk panel with the headline at ~34 px and the white curve framing it [O mobile-0; M h1 34 px].

## Technical discoveries
- No animation libraries detected [M]; Drupal modules path, gtag [M]. Pinned layers in view at top only (header) [M].

## Performance (single lab run, indicative only)
- DCL 1,328 ms, LCP 1,104 ms, CLS 0 [M]; 73 requests [M].

## Useful implementation ideas (original re-implementations, not copies)
- One highlighted word per statement carries emphasis without exclamation; adopt a single accent device (OZONE: a single clear-air colour or underline, not a marker).
- Myth/answer pairs ("Aren't vapes just vapor?") are a good fit for the "what's inside the cloud" reveal, set as plain text, not bubbles.
- Close with one calm ask for help and a visible Sources entry; OZONE's brief requires sources per number.
- Avoid: product graphics (a device illustration is itself a product depiction; the OZONE brief forbids showing products).

## Unknowns / not verified
- Carousel and video behaviour, the Q&A copy beyond what is visible, scroll-triggered animation [?].
