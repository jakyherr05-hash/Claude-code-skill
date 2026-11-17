---
name: OceanX
url: https://oceanx.org/
slug: oceanx
category: other
tags: [nextjs, nonprofit, ocean, full-bleed-photography, big-type, cookie-banner, globe-canvas, native-scroll, expedition-map]
researched: 2026-11-17
status: inspected
confidence: medium
evidence: ../evidence/oceanx/
---

# OceanX

Claim labels: **[M]** measured (capture.json / devtools) · **[O]** observed in screenshots/behaviour · **[I]** inferred (state the basis) · **[?]** unknown.

## At a glance
Ocean science and media non-profit with a Next.js site [M]. The hero is a dark deep-sea scene with a three-line 120 px statement bottom-left, followed by light "editorial" sections that alternate with full-bleed ocean photography, a globe of expeditions and a live "where is the ship now" panel. Lesson: a sober big-type hero over live-feeling imagery, then white editorial sections with a two-column label/copy layout.

## Design characteristics
- Hero: dark blue underwater footage/imagery with floating particles, thin horizontal rule above a one-line intro, then the large statement [O desktop-0]. Palette: blue-black media with white text; light blue-grey cookie bar; coral-orange dot accent in buttons [O].
- Section 02: white page with a small "Our Mission" label left and larger copy in a right column [O scroll-02 thumbnail]. Section 03: full-bleed ocean imagery with centred title [O scroll-03]. Section 05: "Our Expeditions" with a rotating globe and coordinate labels [O scroll-05]. Section 08: full-bleed diver photo with a centred CTA [O scroll-08].
- Cookie banner pinned to the bottom of every viewport until dismissed [O all frames].

## Typography
- Loaded: `zeist` (variable-looking, weight 570 computed) and `dmMono` 500 [M].
- h1: zeist 570, 120 px / 114 px (0.95), tracking -3.6 px (-3%) [M]. h2 56 px / 67.2 px (1.2), tracking -1.68 px (-3%) [M]. Body 14 px / 25.2 px (1.8), tracking 0.14 px, weight 710 in the p sample [M].
- Sizes seen in frames: 120, 56, 40 px [M].

## Layout & spacing
- docHeight ~8,048 px (~9 viewports), 20 sections, 45 images, 3 canvases (1440x900, 760x500, 150x150) [M]. Fixed nav 64 px with 5 links [M]. Two h1 elements [M].

## Navigation
- Thin fixed bar: logo left, Impact / Our Work / About dropdowns centre, search icon and "Donate" pill right [O]. Mobile: logo + hamburger [O mobile-0].

## Animation
- Canvases appear in later frames (globe, ship map) [M media counts in scroll-05..07]. No GSAP/Lenis/Three global detected [M]; mechanisms [?].
- `video` network requests: 12 [M], but no `<video>` elements at capture [M] (hero motion source [?]).

## Scroll
- Native: wheel 600 reached 600 at 16 ms [M]; `likelySmoothed` false [M]. Filmstrip (step 794 px of 8,048) covers the entire page [M]: hero (00), vision statement (01), mission (02), expedition-film feature (03), science/education cards (04), expedition globe (05), impact + ship tracker (06-07), CTA (08), footer with newsletter heading (09) [O].

## Image & video treatment
- Deep-sea photography with cool grading; a framed "live ship" view with coordinates; rounded-corner image cards [O]. 19 SVG, 26 other-format images [M].

## Responsive (390px observation)
- No overflow [M]; h1 39 px [M]; the cookie dialog takes the lower third with a full-width Accept button [O mobile-0]. Tablet landscape h1 102 px, portrait 76.8 px [M].

## Technical discoveries
- Next.js detected [M]; no `header` landmark, `footer` present [M]. No smooth-scroll library detected [M].

## Performance (single lab run, indicative only)
- DCL 839 ms, load 2,229 ms, LCP 1,012 ms, CLS 0.006 [M]; 168 requests; scripts ~1.06 MB [M].

## Useful implementation ideas (original re-implementations, not copies)
- Big, tightly tracked statement (-3%) anchored bottom-left over full-bleed media with a thin rule above a smaller intro line.
- Label-left / copy-right editorial layout for mission copy.
- Mix media tones: dark hero, white editorial, immersive full-bleed breaks, one data-feel module (map or ship tracker).
- Plan the cookie bar's height so it does not cover the hero statement on 16:9.

## Unknowns / not verified
- Hero media source; globe implementation; hover states; menu dropdown design [?].
