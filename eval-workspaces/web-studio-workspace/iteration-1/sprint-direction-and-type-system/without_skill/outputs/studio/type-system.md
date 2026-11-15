# Aster C1: typography and spacing system

## 1. Fonts (all SIL Open Font License 1.1, free for commercial web use, embedding and self-hosting)
| Role | Family | Why | Weights used |
|---|---|---|---|
| Display / headlines | **Newsreader** (Production Type) | Editorial serif with optical sizing; at large sizes and light weight it reads Monocle-calm, not fashion-loud | 300, 400 (opsz axis) |
| Body / UI | **Hanken Grotesk** | Neutral, slightly warm grotesque, very legible at 17-19 px, no "tech startup" tics | 400, 500 |
| Specs / numbers / labels | **IBM Plex Mono** | Precise, instrument-panel feel, tabular by nature, supports Dutch diacritics | 400, 500 |

Sources: Google Fonts repository (OFL files), or fontsource npm packages. Keep each family's OFL.txt in /fonts/licenses/. Do not substitute Adobe/Typekit or paid fonts.

Delivery:
- Self-host WOFF2, subset to Latin + Latin Extended-A (covers Dutch, plus French/German for later), `font-display: swap`.
- Use variable files where available (Newsreader, Hanken Grotesk). Plex Mono as two static files (400, 500).
- Preload only the hero headline face (Newsreader) and body regular. Total font budget target: under 150 KB.
- Fallback stacks, with size-adjust metrics to limit layout shift:
  - Display: `"Newsreader", "Iowan Old Style", Georgia, serif`
  - Body: `"Hanken Grotesk", system-ui, -apple-system, "Segoe UI", sans-serif`
  - Mono: `"IBM Plex Mono", ui-monospace, "SF Mono", Menlo, monospace`

Rejected: Inter (default-looking), Playfair (too fashion), Space Grotesk/JetBrains (too techy/sporty), paid options (Monotype etc.; no budget).

## 2. Type scale
Base 18 px (1.125rem) on mobile, 19 px on desktop. Ratio 1.250 (major third) on mobile widening to 1.333 (perfect fourth) on desktop via fluid clamp(). Steps are named; tokens in tokens.css.

| Token | Role | Mobile (375) | Desktop (1440) | Family / weight | Line height | Tracking |
|---|---|---|---|---|---|---|
| display | hero headline, big figure | 44 px | 112 px | Newsreader 300 | 1.02 | -0.02em |
| h1 | section thesis | 36 px | 64 px | Newsreader 300 | 1.08 | -0.015em |
| h2 | section heading | 28 px | 40 px | Newsreader 400 | 1.15 | -0.01em |
| h3 | sub-heading | 21 px | 26 px | Hanken 500 | 1.3 | 0 |
| lede | intro paragraph | 21 px | 26 px | Newsreader 300 | 1.4 | 0 |
| body | paragraphs | 18 px | 19 px | Hanken 400 | 1.6 | 0 |
| small | captions, footnotes | 15 px | 15 px | Hanken 400 | 1.5 | 0.005em |
| label | spec labels, nav | 12 px | 13 px | Plex Mono 500, uppercase | 1.4 | 0.08em |
| figure | spec numbers | 18 px | 22 px | Plex Mono 400, tabular-nums | 1.3 | 0 |

Rules:
- Measure: body 60-68 characters (`max-width: 36rem`); lede up to 44rem; headings up to 18-22 ch for display.
- Never below 15 px for reading text; 12-13 px only for uppercase mono labels.
- Left aligned, ragged right. No justified text. `text-wrap: balance` on headings, `pretty` on body.
- Hyphenation on for body (`hyphens: auto`, `lang` attribute set), which matters for Dutch compounds.
- Use `font-variant-numeric: tabular-nums` for all specs; `font-feature-settings: "ss01"` not needed.
- Max two weights per family on screen. Serif headings are never bold.
- Units in specs: thin space between number and unit (10.9 kg, EUR 6,200 written as "€6,200"; Dutch variant "€ 6.200").
- Contrast: all text pairings in creative-direction.md meet WCAG AA; Slate only for secondary text of 15 px+.

## 3. Spacing system
Base unit **8 px** with a 4 px half-step for tight UI. Space tokens are rem-based so they scale with user font settings.

| Token | px | Use |
|---|---|---|
| space-1 | 4 | icon gaps, label-to-value |
| space-2 | 8 | tight stacks |
| space-3 | 16 | paragraph gap, related items |
| space-4 | 24 | card padding, grid gutter (mobile) |
| space-5 | 32 | grid gutter (desktop), heading-to-body |
| space-6 | 48 | between groups |
| space-7 | 72 | small section padding |
| space-8 | 112 | section padding (mobile 72, desktop 160 via fluid `section-y`) |
| space-9 | 160 | hero / thesis breathing room |

Vertical rhythm: body line-height 1.6 on 18-19 px is about 29-30 px; paragraph gap is 16 px and section spacing steps by 8 px multiples. Strict baseline-grid alignment is not enforced; consistency of tokens is.

Rules of proximity: heading-to-its-text is smaller than text-to-next-heading (space-3 vs space-6 minimum). Related items closer than unrelated items, always.

## 4. Layout grid
- 12 columns on desktop (>= 1024), 8 on tablet (>= 640), 4 on mobile.
- Gutter: 24 px mobile, 32 px desktop. Outer margin: clamp(20px, 5vw, 80px).
- Content max width 1280 px; text blocks occupy columns 1-6 or 4-9, never full width. Asymmetry (text offset, image bleeding) is the main compositional device; whitespace is intentional.
- Hairline rules (1 px Hairline colour) separate spec rows and sections; no boxes with shadows. Radius 0 on images, 2 px on buttons/inputs.
- Breakpoints: 640, 1024, 1440 (min-width, mobile-first).

## 5. Components in brief (to be built later)
- Button: Graphite fill, Paper text, label style, 48 px high (touch target), 24 px horizontal padding; hover inverts; focus ring 2 px Signal offset 2 px. One secondary: text link with underline offset 0.25em.
- Spec row: label (mono, Slate) left, figure (mono, Graphite) right, 1 px rule beneath, row padding space-3.
- Link: underline always visible in body copy.

## 6. Accessibility / performance checks before launch
- 200% zoom and 320 px width without horizontal scroll; rem-based sizes.
- Visible focus states; reduced-motion respected.
- LCP element is the hero image or headline; headline face preloaded.
- Verify the fluid sizes at 375, 768, 1024, 1440 and 1920 px.

Implementation tokens: see tokens.css.
