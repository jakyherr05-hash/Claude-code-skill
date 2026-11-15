---
name: Google Fonts
url: https://fonts.google.com/
slug: google-fonts
category: typography
tags: [typography, font-library, free, open-source, ofl, self-hosting, fontsource, variable-fonts, resource]
researched: 2026-11-15
status: partially-inspected
confidence: low
evidence: ../evidence/google-fonts/
---

# Google Fonts

Claim labels: **[M]** measured (capture.json / devtools) · **[O]** observed in screenshots/behaviour · **[I]** inferred (state the basis) · **[?]** unknown.

## At a glance
The default free web-font catalogue. The site UI itself could not be studied: the headless capture rendered a blank white page. The value of this entry is the "Using this resource in the studio" section.

## Design characteristics
- Not inspected visually: all three screenshots (desktop-0, desktop-1, mobile-0) are entirely white [O]. Page body text is an inline dark-theme script (`isDarkTheme` in localStorage) [M], so the app is client-rendered and did not paint under automation [I].

## Typography
- No fonts loaded by `document.fonts` [M]; computed body font fell back to "Times New Roman" 16px [M] (an unrendered shell, not the site's real design).

## Layout & spacing
- [?] Not inspected.

## Navigation
- [?] Not inspected (no nav element, 0 links in DOM at capture time [M]).

## Animation
- [?]

## Scroll
- Wheel 600px: scrollY 0, docHeight 900 [M] - consequence of the blank shell, not a design signal.

## Image & video treatment
- [?] (0 images, 0 canvases at capture [M]).

## Responsive (390px observation)
- Blank white at 390 [O]; no horizontal overflow [M].

## Technical discoveries
- Script hints are Google-internal bootstrap modules (`...dti=1/m=_b`) and gtag [M]; only 3 requests [M]. No known animation/framework libs detected [M].

## Performance (single lab run, indicative only)
DCL 412ms, load 567ms, LCP not reported, CLS 0, 3 requests [M] - meaningless for the real app because it did not render.

## Using this resource in the studio
- Licensing: the Fontsource npm packages for a Google font (checked `@fontsource/inter` and `@fontsource-variable/inter`) report licence OFL-1.1 [M, npm registry 2026-11-15]. Individual families may carry other licences (e.g. Apache-2.0) - check each family's licence file [I].
- OFL generally permits commercial use, embedding and self-hosting; it forbids selling the font on its own and requires keeping the licence and reserved-name rules when modifying [I - general knowledge of OFL, read the actual licence text before relying on it].
- Obtaining and self-hosting: install `@fontsource/<family>` (static) or `@fontsource-variable/<family>` and import the CSS; fonts are bundled into your build, no request to Google at runtime [M for package existence/licence; behaviour I]. Hosted alternative: `https://fonts.googleapis.com/css2?family=Inter&display=swap` returned HTTP 200 [M] - but that makes visitors request Google's servers (privacy/GDPR consideration [I]).
- Practice: subset to the needed Latin range, use `font-display: swap`, `preload` only the hero weight, prefer a single variable file over many static weights [I].

## Useful implementation ideas (original re-implementations, not copies)
- Studio default: self-host via Fontsource, expose weights/axes through CSS custom properties, and fall back with a metric-matched local font (`size-adjust`) to cut CLS.

## Unknowns / not verified
- The site's own design, filters, specimen interactions - recapture with a longer wait or a real browser session.
