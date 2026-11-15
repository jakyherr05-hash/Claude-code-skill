---
name: GSAP Docs
url: https://gsap.com/docs/v3/
slug: gsap-docs
category: animation-dev
tags: [gsap, documentation, docusaurus, dark-ui, sidebar-nav, search, reference, learning]
researched: 2026-11-15
status: inspected
confidence: high
evidence: ../evidence/gsap-docs/
---

# GSAP Docs

Claim labels: **[M]** measured (capture.json / devtools) · **[O]** observed in screenshots/behaviour · **[I]** inferred (state the basis) · **[?]** unknown.

## At a glance
Official GSAP v3 documentation hub (Docusaurus). Lesson: docs that keep the product's brand (Mori, cream/green on black) while staying scannable: sidebar with grouped sections, big search, and a "what's in core" overview grid.

## Design characteristics
- Dark docs UI with cream headings (rgb(255,252,225)) and muted body text rgb(187,186,166) [M]; green accents for links and tabs [O].
- Overview card: green gradient frame around dark tiles listing Core features, Eases, Utility Methods [O].

## Typography
- Mori 400/600 and Fraktion Mono 400 (sidebar section labels look monospaced [O]) [M].
- h1 "Animate Anything" 101.28px/101.28px, 600, -1.01px tracking (-0.01em) [M]; h2 39.9px, -0.4px [M]; body 16px/29.6px (1.85 line-height) [M].

## Layout & spacing
- Left sidebar ~210px with Docs/Learn tabs, filter field and collapsible groups; content column ~590px centred [O]. Header 77px, not fixed (relative) [M].

## Navigation
- Top bar mirrors main site (Tools, Showcase, Community, Learn GSAP, Docs, Demos) [O]; sidebar groups: Quick Start, Fundamentals, Plugins, Useful features & tools [O]. Quick Start includes an "AI Skills" entry [O]. Skip link present [M]; 45 links [M]. Mobile has no menu button detected [M].

## Animation
- None notable on the docs overview [O].

## Scroll
- Native, 600px at 16ms [M]. Sidebar scrolls independently [O].

## Image & video treatment
- Almost none: 2 PNG, 33 inline SVG [M]; the overview is HTML tiles [O].

## Responsive (390px observation)
- No horizontal overflow [M]; largest text 48px [M]; h1 not detected at mobile [M]. I opened mobile-0.jpg: it shows a bot-verification interstitial ("Please wait while your request is being verified…"), not the docs, so mobile layout is **not inspected** [O].

## Technical discoveries
- Generator meta "Docusaurus v3.9.2" [M]. window.gsap not present on docs [M]. Console: 4 chunks refused due to MIME type text/html [M] (probably the same challenge/edge response [I]).

## Performance (single lab run, indicative only)
- DCL 804ms, load 1521ms, LCP 760ms, CLS 0.002, 25 requests, 454 KB script [M].

## Using this resource in the studio
- Primary reference for tweens, timelines, ScrollTrigger, SplitText, Flip. Core includes Tween/Timeline, eases and utility methods per the overview page [O].
- npm gsap@3.15.1 latest; plugins ship in the same package [M]. Cheatsheet and Demos are linked from Quick Start [O].
- Lenis integration snippet: see sites/lenis.md [M].

## Useful implementation ideas (original re-implementations, not copies)
- "What's in the core" tile overview for any design system doc.
- Sidebar with typed section labels in a mono face and a filter field.

## Unknowns / not verified
- Content correctness of specific pages (only the overview was captured) [?]; mobile layout [?].
