---
name: MyFonts
url: https://www.myfonts.com/
slug: myfonts
category: typography
tags: [typography, font-marketplace, commercial, monotype, ecommerce, helvetica-now, popups, light, resource]
researched: 2026-11-15
status: inspected
confidence: medium
evidence: ../evidence/myfonts/
---

# MyFonts

Claim labels: **[M]** measured (capture.json / devtools) · **[O]** observed in screenshots/behaviour · **[I]** inferred (state the basis) · **[?]** unknown.

## At a glance
Large commercial font marketplace (by Monotype; "400,000+ fonts" in site text [M]). Dense e-commerce layout, carousels of foundry specimens, and heavy overlays. Lesson (negative): marketing modals, cookie panels and promos can cover the whole first screen.

## Design characteristics
- White page, slate text rgb(49,57,69), blue primary actions [M/O]. First view is covered by an email-signup modal (full-colour brick-wall photo), a cookie panel bottom-left, a top promo bar ("Find your next font in ChatGPT") and a side "10% off" tab [O].
- Underneath: card carousels of specimens on coloured tiles with price lines ("8 fonts starting at $39.00 USD") [O].

## Typography
- Loaded: HelveticaNowMT family (Text, Text Medium, Text Bold, Micro, Micro Medium, Display Medium) plus Open Sans 400 and Lato 400 [M].
- h1: HelveticaNowMTDisplayMedium 33px/40px weight 500 [M]; h2 "Over 400,000 available fonts, and counting." 23px/32px, grey rgb(87,101,121) [M]; nav 16px/24px, tracking -0.32px (-0.02em) [M]. Body computed 22.4px [M].
- Mobile largest text 145px [M] (specimen graphic text).

## Layout & spacing
- 39 sections, document 1622px at capture (lazy content) [M]. Header: logo, wide search ("Search 400K+ fonts & foundries"), camera/AI-search buttons, currency/language, cart, login; second row category nav (20 links) [M/O]. Dark "Enterprise solutions" block at right [O].

## Navigation
- Sticky-like top bar scrolls with page (nav `static`) [M]; mobile has hamburger, search, cart, account [O].

## Animation
- Auto-advancing carousel with pause control [O]. No animation libraries detected [M].

## Scroll
- Wheel 600px: 600 at first sample [M] -> native scroll. The modal stays fixed in both screenshots [O].

## Image & video treatment
- 47 images, 1 canvas [M]; specimen tiles are images with text baked in [O].

## Responsive (390px observation)
- Modal fills ~half the screen height and cookie panel the lower third, leaving little content visible [O]. No overflow [M]. Menu button present [M].

## Technical discoveries
- No framework marker detected [M]; 113 scripts, mostly tracking (gtag, DoubleClick) [M]. `html` class `js` [M]. 1 console 401 [M].

## Performance (single lab run, indicative only)
DCL 1553ms, load 2724ms, **LCP 13968ms**, CLS 0.236, 425 requests [M]. The ~14s LCP is from a single cloud-container run with an active modal/third-party load; treat as directional only (lab caveat), but 113 scripts make the page genuinely heavy [I].

## Using this resource in the studio
- Licensing model: commercial per-font purchase; separate desktop / web / app / etc. licences, priced by usage size [I - not verified in this run]. Check each foundry's EULA before use [I].
- Obtaining: buy and download from the account; web fonts come as a web-font kit or hosted subscription [?]. Self-hosting rights depend on the licence purchased [?]. Do not copy fonts into a repo without keeping the licence record [I].
- Practice: use MyFonts for discovery/testing (trial specimens) and confirm client-paid licences in the project brief before design lock [I].

## Useful implementation ideas (original re-implementations, not copies)
- Specimen search: debounce + inline custom-text preview field.
- Anti-pattern to avoid: stack of modal + cookie + promo bars on first paint; gate modals behind scroll depth or exit intent, one at a time.

## Unknowns / not verified
- Licence terms, checkout, per-page layout beyond the homepage.
