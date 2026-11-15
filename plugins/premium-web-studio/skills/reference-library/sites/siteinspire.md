---
name: Siteinspire
url: https://www.siteinspire.com/
slug: siteinspire
category: gallery
tags: [gallery, curation, directory, minimal, blocked]
researched: 2026-11-15
status: blocked
confidence: low
evidence: ../evidence/siteinspire/
---

# Siteinspire

Claim labels: **[M]** measured (capture.json / devtools) · **[O]** observed in screenshots/behaviour · **[I]** inferred (state the basis) · **[?]** unknown.

## At a glance
Siteinspire is a curated gallery of well-designed websites filterable by style, type, subject and platform. Automated capture was stopped by a Vercel security checkpoint (HTTP 429, "Failed to verify your browser, Code 21") [M]; no design was inspected. Use it as a discovery source.

## Design characteristics
- The three screenshots show only the checkpoint page: white, centred 19.2px Inter-like system text, mono footer [O]. This belongs to Vercel, not Siteinspire.
- WebFetch text (not visual) reported: nav Websites / Profiles / Fonts / About / Subscribe; tagline "A showcase of the web's finest design + talent."; Popular Categories tabs (Styles, Types, Subjects, Platforms); gallery grid with screenshot, name, date, credit; sponsor slot; pagination 1-5; newsletter signup [M, basis: WebFetch text, 2026-11-15].
- Hosting on Vercel is evidenced by the checkpoint page [M]; not evidence about the app framework [?].

## Typography
- [?] Site not rendered. Checkpoint font stack is system sans (-apple-system, Segoe UI, Noto Sans...) [M], irrelevant to the site.

## Layout & spacing
- [?]

## Navigation
- Item list from WebFetch only [M, WebFetch]; behaviour [?].

## Animation
- [?]

## Scroll
- movedPx 0, docHeight 900 [M]: checkpoint page fits viewport; says nothing about the site.

## Image & video treatment
- [?] (WebFetch indicates screenshot thumbnails in a grid [M, WebFetch]).

## Responsive (390px observation)
- Checkpoint only [O]. [?]

## Technical discoveries
- None for the site. 1 request, no libraries [M] (checkpoint).

## Performance (single lab run, indicative only)
- Not meaningful (checkpoint page, 282 ms load) [M].

## Useful implementation ideas (original re-implementations, not copies)
- Process: use its category taxonomy (style/type/subject/platform) [M, WebFetch] as a model for tagging our own library, which already uses tags.
- Filter-by-facet grid: implement with URL query params + CSS grid.

## Unknowns / not verified
- All visual and technical details. Retry later or inspect manually in a normal browser.
