# Pairing patterns

Pair on **contrast of one variable, harmony of the rest**. Fonts that differ in everything fight; fonts that differ in nothing are pointless. Typical axes of contrast: serif vs sans, high vs low stroke contrast, wide vs condensed, humanist vs geometric, expressive vs neutral.

| Pattern | Display | Text / UI | Accent | Why it works | Suits |
|---|---|---|---|---|---|
| Soft editorial | Fraunces (opsz high, SOFT 50–100, light weight) | Hanken Grotesk / Geist | JetBrains Mono for labels | Expressive warm serif against a cool neutral sans; mono gives "instrument" precision | Craft, hospitality, architecture, food |
| Luxury didone | Bodoni Moda (opsz max, 400) | Switzer / Satoshi | — | Hairline contrast vs calm grotesk; tracking-open uppercase labels | Fashion, jewellery, fragrance |
| Newsroom | Schibsted Grotesk (bold, tight) | Newsreader | — | Grotesk headlines over a reading serif — the classic newspaper inversion | Publications, reports, institutions |
| Technical precision | Geist (600, −0.04em) | Geist | Geist Mono | Single superfamily; hierarchy from size/weight/mono | SaaS, dev tools, fintech |
| Engineered width | Archivo or Mona Sans (wdth 125, 800) | Archivo (wdth 100, 400) | tabular mono numerals | Width axis as personality; one family | Automotive, sport, hardware |
| Poster brutal | Anton / Big Shoulders (uppercase, huge) | Space Mono / IBM Plex Mono | — | Condensed shout + raw mono | Streetwear, music, events |
| Futurist wide | Unbounded / Panchang | Inter Tight | Geist Mono | Wide geometry reads "future"; neutral text keeps legibility | AI, space, energy, gaming |
| Quiet classic | Cormorant Garamond (300, large) | EB Garamond or Source Serif 4 | small caps | Serif-on-serif works when roles are separated by scale and weight | Books, heritage, wine |
| Art-school | Syne (800) | Instrument Sans | — | Width-shifting display vs clean grotesk | Agencies, galleries, portfolios |

## Checks before you commit
- Do the x-heights match closely enough for inline mixing? (If not, never mix them in one line.)
- Does the display face have the glyphs you need (punctuation, numerals, diacritics for target languages)?
- Weight budget: ≤ 2 families, ≤ 2 files each (variable fonts count as one file per style).
- Render your real H1 at 360px and 1920px. If it breaks badly at 360, change the clamp minimum or the copy length — not the font size in a media query hack.
