---
name: Awwwards
url: https://www.awwwards.com/
slug: awwwards
category: gallery
tags: [gallery, awards, directory, curation, blocked]
researched: 2026-11-15
status: blocked
confidence: low
evidence: ../evidence/awwwards/
---

# Awwwards

Claim labels: **[M]** measured (capture.json / devtools) · **[O]** observed in screenshots/behaviour · **[I]** inferred (state the basis) · **[?]** unknown.

## At a glance
Awwwards is the best-known award gallery and directory for high-end web design (Site of the Day, nominees, collections, directory of agencies). Our automated capture got HTTP 502 "upstream request failed" [M], so no design was inspected. Its value to the studio is as a discovery source for references, not as a design reference.

## Design characteristics
- Not inspected. All three screenshots (desktop-0, desktop-1, mobile-0) show only the plain text "upstream request failed" on white [O]. No design claims are made.
- A one-off text retrieval via WebFetch (not a visual render) returned the page structure: nav (Awards, Trending, Categories, Technology, Collections, Directory, Academy, Jobs, Market), Site of the Day with a numeric score, Nominees with vote links, Winners, Academy, Collections, Directory, Blog, Market, footer CTAs [M, basis: WebFetch text, 2026-11-15]. A Site of the Day score of 7.26/10 was shown [M, WebFetch].

## Typography
- No fonts loaded; `loadedFonts` is empty and the body fell back to Times New Roman on the error page [M]. Site typography [?].

## Layout & spacing
- [?] Not inspected.

## Navigation
- Section list as above from WebFetch text [M]; layout, sticky behaviour, mobile menu [?].

## Animation
- [?] Not inspected.

## Scroll
- movedPx 0, docHeight 900 [M]: the error page had nothing to scroll. Says nothing about the real site.

## Image & video treatment
- [?] Not inspected.

## Responsive (390px observation)
- Error page only [O]. [?] for the real site.

## Technical discoveries
- httpStatus 502, 0 requests, 0 scripts, no libraries detected [M] (error page, not the site). Real stack [?].

## Performance (single lab run, indicative only)
- Not meaningful: it measured the 502 error page (LCP 300 ms, 0 requests) [M].

## Useful implementation ideas (original re-implementations, not copies)
- Process idea, not visual: use Awwwards' categories/technology filters [I, from public knowledge of the site's role] to find sites by technique (WebGL, scroll) and run them through the capture script.
- Scored cards (score + criteria breakdown) are a pattern for our own review rubric; implement as plain CSS grid + data attributes.

## Unknowns / not verified
- Everything visual and technical. Re-run capture later; automated access was refused or the upstream failed (502, possibly transient).
