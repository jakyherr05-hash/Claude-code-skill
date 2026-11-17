---
name: AUGE Experience
url: https://auge-xp.com/
slug: auge-experience
category: studio
tags: [awwwards-sotd-2026, nextjs, digital-experience-studio, collage-canvas, giant-wordmark, cream-black, cookiebot-modal, rotate-device-gate, partially-inspected, scroll-unverified]
researched: 2026-11-17
status: partially-inspected
confidence: low
evidence: ../evidence/auge-experience/
---

# AUGE Experience

Claim labels: **[M]** measured (capture.json / devtools) · **[O]** observed in screenshots/behaviour · **[I]** inferred (state the basis) · **[?]** unknown.

## At a glance
A digital experience studio (title "Digital Experience Studio | AUGE Experience") [M], Awwwards "Site of the Day - Nov 12, 2026" (verified verbatim on https://www.awwwards.com/sites/auge-experience on 2026-11-17). A cream page with a giant black "AUGE" wordmark bottom-left and a dense collage of colourful photographic tiles that rearrange across the filmstrip. **Two limits on this entry:** a Cookiebot consent modal covers the centre of every desktop frame [O], and **the document did not scroll under wheel input** (docHeight 900, scrollY 0 in all samples [M]), so the scroll story is [?]. Lesson: a loud, fast photographic collage against a calm cream ground with one huge black wordmark.

## Design characteristics
- Palette: cream rgb(237,238,229) ground, black wordmark and text [M, O]. Collage tiles are saturated: green avocados, red tinned-food packaging, a rider with a pink flag, glossy street scenes, blue/black graphic panels [O desktop-0, scroll-00, scroll-05].
- Wordmark "AUGE" in a heavy black grotesk at bottom-left, cropped by the lower edge or partly under the modal; a small descriptor at the right, a menu icon button, legal footer in tiny caps [O].
- Tablet portrait: a bright yellow screen with "ROTATE DEVICE" in a serif display italic and a rotate icon; the experience is landscape-only on tablets [O tablet-portrait-0]. Tablet landscape h1 13 px [M].

## Typography
- Loaded: ppNeueMontreal 400/500, greedBold, farnhamDisplay (font variables on `<html>` and `document.fonts`) [M].
- h1 (nav title, with © and encoded characters) 18 px / 22.5 px [M]; body 16 px / 24 px [M]; "Works" heading 38 px; project titles 28.5 px [M, filmstrip]. Mobile largest text 111 px [M] (the wordmark).
- Mixed families: neutral grotesk for UI, a bold grotesk for the wordmark, a display serif for the rotate-device message [I from font names].

## Layout & spacing
- docHeight 900 [M]; 0 sections, 27 images (21 JPG), 1 fixed canvas 1440x900, 4 SVGs [M]; two h1 elements [M]. Three large fixed layers per frame [M].
- The project list ("ViruGroup", "MaisonAUGE", "AC40Lunarossa" in DOM headings) is present but not shown in frames [M, O].

## Navigation
- A boxed menu icon bottom-right; links to LinkedIn and Instagram bottom-right; © and VAT line bottom-left [O].

## Animation
- Next.js detected [M]. A fixed canvas plus 27 images suggests a WebGL collage/slideshow [I]. The collage changes position between frames [O scroll-00 vs scroll-05]; whether it is time-driven or wheel-driven is [?].

## Scroll
- Wheel samples all 0, docHeight 900 [M]; no Lenis/GSAP detected [M]. Story [?].

## Image & video treatment
- Dense, cropped commercial/editorial photography at varied tile sizes with overlap and offset; no video [M, O].

## Responsive (390px observation)
- No overflow [M]; the Cookiebot sheet fills the viewport; largest text 111 px [M]. Tablet portrait is gated by "ROTATE DEVICE" [O].

## Technical discoveries
- Next.js, Cookiebot, gtag [M, O].

## Performance (single lab run, indicative only)
- DCL 1,564 ms, load 4,760 ms, LCP 8,896 ms, CLS 0.468 [M]; 50 requests [M].

## Useful implementation ideas (original re-implementations, not copies)
- One giant wordmark as the only fixed anchor while an image collage animates around it.
- Offer a considered orientation message instead of a broken tablet portrait layout (or better, a portrait layout).
- Put consent in a bottom bar, not a centred modal, so first impressions of the hero are protected.

## Unknowns / not verified
- Everything under the modal; scroll/navigation model; project pages; collage trigger; sound [?].
