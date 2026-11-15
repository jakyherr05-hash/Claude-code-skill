---
name: GSAP Resources
url: https://gsap.com/resources/
slug: gsap-resources
category: animation-dev
tags: [gsap, resources, blocked, bot-protection, interstitial]
researched: 2026-11-15
status: blocked
confidence: low
evidence: ../evidence/gsap-resources/
---

# GSAP Resources

Claim labels: **[M]** measured (capture.json / devtools) · **[O]** observed in screenshots/behaviour · **[I]** inferred (state the basis) · **[?]** unknown.

## At a glance
Not inspected. The capture landed on a bot-verification interstitial ("One moment, please…", "Please wait while your request is being verified…") instead of the resources page [M title/text][O]. Nothing about the real page may be concluded.

## Design characteristics
- Only the interstitial was seen: white page, green rotating-triangle logo, tracked Montserrat-style centred text [O]. Not the site's design [O].

## Typography
- Interstitial only: Montserrat, 48px/100px, 2.88px tracking [M]. No loaded web fonts [M]. Real page: [?].

## Layout & spacing
- [?]

## Navigation
- [?] (no nav detected [M]).

## Animation
- [?]

## Scroll
- The scroll probe failed: "Execution context was destroyed, most likely because of a navigation" [M] — the interstitial navigated to another page during capture. No scroll samples exist.

## Image & video treatment
- [?]

## Responsive (390px observation)
- Interstitial only; no overflow [M]. desktop-1.jpg does not exist (probe failed) [M]; I opened desktop-0.jpg and mobile-0.jpg [O].

## Technical discoveries
- HTTP 200 with a one-script challenge page, docHeight 900, a 404 resource in console [M]. A JavaScript challenge in front of /resources/ is [I] (from the title/text); the vendor is [?].

## Performance (single lab run, indicative only)
- DCL 229ms, 1 request [M]; meaningless for the real page.

## Useful implementation ideas
- None from this capture. Re-run later with a headed/real browser or follow the navigation before probing.

## Unknowns / not verified
- All real content. Do not cite this entry as describing the GSAP resources page. See sites/gsap.md and sites/gsap-docs.md for the verified GSAP facts.

## Using this resource in the studio
- Not verified. For GSAP facts use gsap-docs and npm [M: npm view gsap, gsap@3.15.1].
