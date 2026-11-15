---
name: Font Squirrel
url: https://www.fontsquirrel.com/
slug: fontsquirrel
category: typography
tags: [typography, free-fonts, font-library, commercial-use, webfont-generator, specimen-list, ad-supported, utility]
researched: 2026-11-15
status: inspected
confidence: medium
evidence: ../evidence/fontsquirrel/
---

# Font Squirrel

Claim labels: **[M]** measured (capture.json / devtools) · **[O]** observed in screenshots/behaviour · **[I]** inferred (state the basis) · **[?]** unknown.

## At a glance
Long-running directory of hand-picked free fonts licensed for commercial use, plus a webfont generator and identifier. Lesson: the specimen-row pattern (live type sample + metadata strip + download button) is a very efficient list UI; the ad/consent layer is what to avoid.

## Design characteristics
- Purple header band (rgb(~97,69,106) links [M]) over a grey page with a white centered content card and right sidebar (search, ads) [O].
- Each font row: huge live sample line, then a grey chevron-style strip with platform icons, family, foundry, style count and a blue "DOWNLOAD OTF (OFFSITE)" tab [O].

## Typography
- Loaded [M]: fjallaone (h1 "Free Font Utopia" 45px/60px, -1px tracking, lilac rgb(162,126,175)), body_font normal+bold (14px/19px), icons font. Fallback Arial/Helvetica [M].
- h2 labels: 14px bold uppercase, 0.28px tracking [M]. The font samples themselves are images or per-family loads (59 images, many "other" format) [M][I].

## Layout & spacing
- Content card ~760px wide with ~66px side gutters visible at 1440; sidebar column ~240px [O estimate]. Header 143px tall [M].

## Navigation
- Two groups: "Free fonts for commercial use" (Hot, Recent, Popular, Tags) and "Font resources & tools" (Webfont Generator, Font Identifier, Font Talk, Creative Market Fonts) [O]. 9 links [M].

## Animation
- None observed; a video ad slot autoplays muted [M] (4 video elements).

## Scroll
- Native (600px reached at 16ms) [M].

## Image & video treatment
- Specimen strips are the imagery; some samples did not render in the 390px capture (alt text "Acherus Grotesque font family by Horizon Type" visible, broken logo image) [O].

## Responsive (390px observation)
- No overflow [M]; menu button present [M] but the header nav is horizontally clipped ("Font reso…") rather than collapsed [O]; consent banner covers the bottom third [O].

## Technical discoveries
- No gsap/Lenis/framework detected [M]. 104 scripts, mostly Google Tag Manager, AdSense, IMA SDK, consent tooling [M libraryHints]. html class list shows Modernizr feature flags [M].

## Performance (single lab run, indicative only)
- DCL 1277ms, load 2225ms, LCP 1300ms, CLS 0.002, 250 requests, 480 KB script [M]; networkidle timed out (ads) [M]; console shows CORS/tunnel failures from third parties [M] (partly lab-network artefact [I]).

## Useful implementation ideas (original re-implementations, not copies)
- "Specimen row" component: sample text at display size, metadata strip beneath, one clear action; make the sample text editable on hover.
- Badge strip showing platform/licence icons for quick scanning.
- Anti-lesson: a consent modal over content should not block the first viewport on mobile.

## Unknowns / not verified
- Licence details per font [?]; how samples render (image vs webfont) [?]; behaviour after consent [?].
