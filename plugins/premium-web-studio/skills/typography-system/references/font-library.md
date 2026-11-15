# Font library (licence-verified 2026-11-15)

Every entry below was checked on the research date:
- **Fontsource (Google Fonts) entries:** `npm view @fontsource-variable/<slug> license` returned `OFL-1.1` (static-only families: `@fontsource/<slug>`). Axes from `api.fontsource.org/v1/variable/<slug>`.
- **Fontshare entries:** `api.fontshare.com/v2/fonts` reported `license_type: itf_ffl` and a variable style. Fontshare describes ITF FFL fonts as free for personal and commercial use; its licence page didn't render for automated reading, so **re-read the licence at fontshare.com before shipping** [I].
- Re-verify when you use an entry: licences and packages change.

Voice tags help shortlist: **warm · cool · crafted · technical · loud · quiet · eccentric · classic**.

## Serif — display & editorial
| Family | Source / install | Licence | Variable axes | Voice | Notes |
|---|---|---|---|---|---|
| Fraunces | `@fontsource-variable/fraunces` | OFL-1.1 [M] | wght 100–900, opsz 9–144, SOFT 0–100, WONK 0–1, ital [M] | warm, crafted, eccentric | "Old-style soft" display; opsz + SOFT give a big expressive range from one file |
| Newsreader | `@fontsource-variable/newsreader` | OFL-1.1 [M] | wght 200–800, opsz [M wght; opsz I] | classic, quiet | Built for news reading; excellent text serif |
| Source Serif 4 | `@fontsource-variable/source-serif-4` | OFL-1.1 [M] | wght, opsz | classic, cool | Robust text serif with display opsz |
| EB Garamond | `@fontsource-variable/eb-garamond` | OFL-1.1 [M] | wght | classic, crafted | Book typography; use ≥ 18px |
| Bodoni Moda | `@fontsource-variable/bodoni-moda` | OFL-1.1 [M] | wght, opsz | loud, classic | High-contrast didone for fashion/luxury display; never small |
| Playfair Display | `@fontsource-variable/playfair-display` | OFL-1.1 [M] | wght | classic | Very common — use only with a strong reason |
| Cormorant Garamond | `@fontsource-variable/cormorant-garamond` | OFL-1.1 [M] | wght | quiet, crafted | Delicate display; light weights only large |
| Literata | `@fontsource-variable/literata` | OFL-1.1 [M] | wght, opsz | warm | Screen-reading serif |
| Instrument Serif | `@fontsource/instrument-serif` (static) | OFL-1.1 [M] | — | eccentric, warm | Condensed display serif; widely used in 2024–26 startup sites — risk of looking trendy |
| DM Serif Display | `@fontsource/dm-serif-display` (static) | OFL-1.1 [M] | — | loud | High contrast headlines |
| Libre Caslon Display | `@fontsource/libre-caslon-display` (static) | OFL-1.1 [M] | — | classic | Elegant display Caslon |
| Gambetta · Zodiak · Erode · Sentient · Boska · Bespoke Serif | Fontshare | itf_ffl [M] | variable [M] | crafted / editorial | Distinctive alternatives to overused Google serifs |

## Sans — text, UI & display
| Family | Source / install | Licence | Variable axes | Voice | Notes |
|---|---|---|---|---|---|
| Inter | `@fontsource-variable/inter` | OFL-1.1 [M] | wght 100–900 (+ opsz in recent versions [I]) | cool, technical, quiet | Default of the web — choose deliberately or not at all |
| Inter Tight | `@fontsource-variable/inter-tight` | OFL-1.1 [M] | wght | technical | Tighter spacing for display |
| Geist | `@fontsource-variable/geist` | OFL-1.1 [M] | wght 100–900, ital [M] | technical, cool | Precise UI sans; pairs with Geist Mono |
| Manrope | `@fontsource-variable/manrope` | OFL-1.1 [M] | wght | warm, technical | Friendly geometric-grotesk |
| Hanken Grotesk | `@fontsource-variable/hanken-grotesk` | OFL-1.1 [M] | wght | quiet | Neutral grotesk |
| Familjen Grotesk | `@fontsource-variable/familjen-grotesk` | OFL-1.1 [M] | wght | eccentric | Quirky details at display sizes |
| Schibsted Grotesk | `@fontsource-variable/schibsted-grotesk` | OFL-1.1 [M] | wght | classic, editorial | Newspaper-grade grotesk |
| Instrument Sans | `@fontsource-variable/instrument-sans` | OFL-1.1 [M] | wght, wdth [I] | cool | Pairs with Instrument Serif |
| Space Grotesk | `@fontsource-variable/space-grotesk` | OFL-1.1 [M] | wght | technical, eccentric | Overused in web3 era |
| Bricolage Grotesque | `@fontsource-variable/bricolage-grotesque` | OFL-1.1 [M] | wght 200–800, opsz, wdth [I] | loud, eccentric | Expressive display grotesk |
| Archivo | `@fontsource-variable/archivo` | OFL-1.1 [M] | wght 100–900, wdth [I] | technical, loud | Width axis → automotive/sport |
| Mona Sans / Hubot Sans | `@fontsource-variable/mona-sans` / `hubot-sans` | OFL-1.1 [M] | wght, wdth [I] | technical | GitHub's families; width axis |
| Big Shoulders Display | `@fontsource-variable/big-shoulders-display` | OFL-1.1 [M] | wght 100–900 | loud | Condensed, industrial |
| Unbounded | `@fontsource-variable/unbounded` | OFL-1.1 [M] | wght 200–900 | loud, futuristic | Wide rounded display |
| Syne | `@fontsource-variable/syne` | OFL-1.1 [M] | wght 400–800 | eccentric | Art-school display; weight changes width |
| Sora · Outfit · Onest · Figtree | `@fontsource-variable/<slug>` | OFL-1.1 [M] | wght | warm, quiet | Friendly geometric UI sans options |
| Roboto Flex | `@fontsource-variable/roboto-flex` | OFL-1.1 [M] | many (wght, wdth, opsz, GRAD, …) [I] | technical | For kinetic/variable-axis experiments |
| Anton | `@fontsource/anton` (static) | OFL-1.1 [M] | — | loud | Poster condensed |
| Satoshi · General Sans · Switzer · Supreme · Cabinet Grotesk · Clash Display · Clash Grotesk · Panchang · Chillax · Author · Excon · Ranade | Fontshare | itf_ffl [M] | variable [M] | varied | Panchang (wide) observed on lenis.dev [M: loaded font] |

## Mono
| Family | Source | Licence | Notes |
|---|---|---|---|
| JetBrains Mono | `@fontsource-variable/jetbrains-mono` | OFL-1.1 [M] | wght axis; specs, code, labels |
| Geist Mono | `@fontsource-variable/geist-mono` | OFL-1.1 [M] | Pairs with Geist |
| IBM Plex Mono | `@fontsource/ibm-plex-mono` | OFL-1.1 [M] | Corporate-technical |
| Space Mono | `@fontsource/space-mono` | OFL-1.1 [M] | Retro-technical |
| Recursive | `@fontsource-variable/recursive` | OFL-1.1 [M] | MONO + CASL axes [I] — sans↔mono morph |

## Commercial sources (licence purchase required — flag cost to the user)
- **MyFonts** (Monotype marketplace) — web licences typically priced by monthly pageviews.
- **Adobe Fonts** — included with Creative Cloud; served from Adobe's CDN via the user's web project kit; can't self-host.
- **Independent foundries** often referenced on Typewolf (e.g. Klim, Grilli Type, Dinamo, Pangram Pangram, Commercial Type, Production Type) — each has its own web licence terms; read them per project. [I: no prices verified here]
- **Font Squirrel** — aggregates free fonts with licence notes; still read each font's own licence file.
