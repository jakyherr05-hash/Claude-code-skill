---
name: truth (thetruth.com)
url: https://www.thetruth.com/
slug: thetruth
category: other
tags: [youth-prevention, campaign, collage, bebas-neue, din, orange-black, native-scroll, video-hero, cta-quit-help, mobile-ok]
researched: 2026-11-17
status: inspected
confidence: medium
evidence: ../evidence/thetruth/
---

# truth (thetruth.com)

Claim labels: **[M]** measured (capture.json) · **[O]** observed in screenshots · **[I]** inferred · **[?]** unknown. Captured with `--tablet --filmstrip 12`; filmstrip.jpg is a contact sheet of the frames, plus desktop-0, mobile-0, tablet-portrait-0. Studied for the OZONE youth-vaping-prevention project; no copy, brand or assets are reused.

## At a glance
Youth tobacco/vaping prevention campaign site of the Truth Initiative [M title "we are truth"]. A loud, collage-and-sticker attitude: 5,198 px page [M], native scroll [M, 600 px wheel moved 600 px instantly]. Lesson for OZONE: it shows what the genre usually looks like (peer-voice, orange/black, stickers) and where it stops: below the hero it becomes a plain alternating image/text list. Use it as the *contrast* for OZONE's calmer register.

## Design characteristics
- Hero: looping muted video (1 autoplay/loop mp4 [M]) of an animated "TOXIC THERAPY FROM YOUR VAPE" graphic on a painted wall, white nav bar on top, "NOTHING BUT THE TRUTH" label bottom right [O desktop-0, scroll-00]. Next beat: orange field with a ragged black film-strip of peer photos and a short mission paragraph [O scroll-01].
- Then six identical white sections: tiny red dash, Bebas heading ("Truth through the decades", "Campaigns that make history", "Driven by science", "Share your story", "Need help quitting nicotine?"), a small paragraph and a red button, photo alternating left/right [O scroll-02..06; M headings]. Footer is a black torn-edge band with the pixel-dot wordmark [O].
- Facts appear as red inline highlights inside body copy (e.g. a dollar figure on savings) rather than as staged data [O scroll-04].

## Typography
- Bebas Neue 400 caps headings 40 px; body DIN 18 px / 28.8 px (1.6) [M]. Nav items Bebas caps [O].

## Responsive (390px observation)
- No horizontal overflow, tablets no overflow [M]. Mobile keeps the nav as a wrapped row of four items and shows the collage under a pop-up-window motif ("DOWNLOADING... SHORT TERM BUZZ // LONG TERM STRESS" progress bar) [O mobile-0]; h1 32 px [M].

## Technical discoveries
- No GSAP/Lenis/Three globals detected [M]; 63 scripts mostly analytics/GTM [M]; Drupal-style paths (`/sites/default/files`) [M video src].

## Performance (single lab run, indicative only)
- DCL 1,424 ms, LCP 1,148 ms, CLS 0.13 [M] (above the OZONE target of 0.05); 153 requests [M].

## Useful implementation ideas (original re-implementations, not copies)
- A single "help line" section as the last beat before the footer (heading, one paragraph, one button) is the proven closing for this topic.
- Peer-voice humour works for teens but is the register OZONE should not copy: a retailer using sticker/meme styling would read as pandering.
- Repeated plain section module = low craft ceiling; OZONE should vary beat composition.

## Unknowns / not verified
- Hover states, the animated hero's source, sub-pages ("Stories", "Campaigns") [?].
