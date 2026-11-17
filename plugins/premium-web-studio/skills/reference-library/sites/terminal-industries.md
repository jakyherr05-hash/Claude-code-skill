---
name: Terminal Industries
url: https://terminal-industries.com/
slug: terminal-industries
category: other
tags: [lenis, nuxt, pinned-storytelling, saas, logistics, photoreal-hero, particle-dissolve, grotesk, mono-labels, floating-pill-nav, roi-calculator]
researched: 2026-11-17
status: inspected
confidence: medium
evidence: ../evidence/terminal-industries/
---

# Terminal Industries

Claim labels: **[M]** measured (capture.json / devtools) · **[O]** observed in screenshots/behaviour · **[I]** inferred (state the basis) · **[?]** unknown.

## At a glance
Marketing site for a yard-operating-system product (title "Terminal Yard Operating System") [M]. A cinematic photoreal hero of a truck at golden hour hands off to a dark, pinned statement section, then to light "enterprise SaaS" sections (cards, ROI calculator, pinned media, testimonial, FAQ, dark footer) [O]. Lesson: one cinematic opener, then a quick drop into utilitarian, high-information sections; the contrast signals "serious product" without losing the hero's emotion.

## Design characteristics
- Hero: truck silhouette on an amber/orange sky, dark foreground, floating translucent pill header with CTAs "Explore product" (acid lime), "Request demo", "Contact us" [O desktop-0, scroll-00].
- Scroll-01 flips to near-black with a large white statement progressing line by line ("...automated system.") [O]; scroll-02 flips to white with three equal cards (title, copy, aerial photo, button) [O]; scroll-03 has a calculator form with a dark green results panel [O]; scroll-09 is a deep green footer [O]. Body text colour rgb(5,36,36) (dark green-black) [M].
- Mono micro-labels ("Scroll to explore", step numbers) give a technical tone [O, M].

## Typography
- Loaded: SuisseIntl 400/450/500/600, Geist Mono 400/600, Poppins 400/500/700 [M] (Poppins is probably a third-party widget face [I]).
- h1: SuisseIntl 400, 70 px / 66.5 px (0.95), tracking -3.6 px (-5.1%) [M]. Pinned statement h2: 82.5 px / 78.4 px (0.95), tracking -1.47 px (-1.8%) [M]. Other measured sizes: 46, 34.5, 27, 22.5 px [M].
- Label: Geist Mono 11 px, weight 600, uppercase, tracking 18% [M].
- Weight stays 400 even at 70-82 px; the hierarchy comes from size and negative tracking, not boldness [M, O].

## Layout & spacing
- docHeight 15,896 px (~17.7 viewports) [M]; 10 sections, 40 images, 4 videos, 1 canvas, 88 links [M].
- Header fixed, 78 px, 70 links in the DOM (mega-menu content) [M].
- Pinned media section (scroll-04): copy column left scrolls while a tall sticky media card sits right [O].

## Navigation
- Floating pill nav with dropdown items (System, Markets, Featured, Resources, About), an "Ask Terminal" input pill and three CTAs [O]. Mobile: logo plus hamburger in a pill [O mobile-0]. A chat bubble ("Asked on this page: ...") with a round launcher sits bottom-right on mobile and tablet [O].

## Animation
- Hero canvas 1440x900 [M]; the truck appears to dissolve into particles on the first scroll in the desktop-1 capture [O, file not kept in evidence]. Technique [?].
- Four muted looping videos present but paused at capture (autoplay false) [M]; scroll-04/05 show them in pinned frames [M media count].
- Pinned/sticky large elements 1-3 per frame, no `.pin-spacer` [M].

## Scroll
- `lenis` class on html [M]. Wheel 600: 311 at 16 ms, 449 at 100, 548 at 250, 590 at 500, 599 at 900 [M]; 75% by 100 ms, `likelySmoothed` true [M].
- Filmstrip (step 1,666 px of 15,896) reached 14,994 at frame 9, so it covers the whole page [M]. Story: hero, dark statement x2 (00-01 both at 82.5 px), cards (02), calculator (03), pinned media x2 (04-05), tabbed benefits (06), testimonial photo (07), FAQ + form (08), footer (09) [O, M headings].

## Image & video treatment
- Photoreal CG/rendered trucks and aerial yards with warm grading in the hero; cards use aerial photos [O]. Images: 25 SVG, 5 PNG, 10 unknown-format [M]; videos hosted on Storyblok as `*_prerender.mp4` [M].

## Responsive (390px observation)
- No overflow [M]; h1 30 px (from 70) [M]; hero re-crops to the truck cab with the headline absent in the first viewport [O]. Tablet portrait h1 59 px, landscape 70 px [M].

## Technical discoveries
- Nuxt detected [M]; Lenis class [M]; Google Tag Manager/gtag [M]; no GSAP/ScrollTrigger global [M] (motion library unknown [?]). Footer landmark absent, no skip link [M].

## Performance (single lab run, indicative only)
- DCL 4,200 ms, load 5,468 ms, LCP 6,188 ms, CLS 1.006 [M]; 159 requests (53 scripts, 565 KB listed) [M]. The high CLS likely comes from hero or font swap [I].

## Useful implementation ideas (original re-implementations, not copies)
- Cinematic-to-utilitarian handoff: a one-image hero, one dark statement beat, then clean cards on white (scroll-00 to scroll-02).
- Weight 400 at display size with -3% to -5% tracking and 0.95 line-height for a calm, expensive feel.
- A calculator as the conversion beat (scroll-03): interactive and specific beats generic testimonials.
- Floating pill header that stays legible over any chapter colour.

## Unknowns / not verified
- Hero effect implementation and trigger; motion library; hover states; mega-menu behaviour [?].
