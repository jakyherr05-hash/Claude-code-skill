# Decision Log — OZONE — Clear Air (youth vaping prevention)

| Date | Decision | Alternatives | Rationale | Decided by |
|---|---|---|---|---|

## 2026-11-18 · Orchestrator decisions on the T6 draft (TECHNICAL_ARCHITECTURE.md)
| # | Question | Decision | Why |
|---|---|---|---|
| D1 | Audio before the user's choice (CREATIVE_DIRECTION §9 says no audio before the choice) | **Attempt audible playback on init**; if the browser blocks it, show ENTER WITH SOUND / CONTINUE WITHOUT SOUND. A saved explicit OFF always wins. | The client brief explicitly requires attempting autoplay; the client instruction overrides the creative doc. |
| D2 | Copy SplitText registration and `lit.ts`? | **No.** Headline reveals are stroke/mask ink reveals. | One fewer dependency; nothing uses it. |
| D3 | Playwright version | **Keep 1.63.0.** | Matches the pre-installed Chromium 1243; installing another version breaks browser lookup. |
| D4 | Mono font | **Dropped** (typography recommendation). | Keeps first-load fonts at 112 KB. |
| D5 | Production URL for canonical/OG | **Client decision**, listed for Gate A. | Unknown. |

## 2026-11-18 · Orchestrator decisions on DESIGN_SPECIFICATION.md
- D-1…D-7 (ui-ux) accepted: Escape = continue without sound; returning no-sound visitors get no prompt; wordmark not a tab stop; no nav landmark; static comic puts text on plates; viewports < 360 px tall use the static comic; toggle and skip link are opaque pills.
- I-1 (Scene 5 horizon ~72 % so the headline fits): accepted provisionally; creative-director judges it in the render-critique loop.
- I-2 (CDPH link): ships only after a source read confirms the URL (California still BLOCKED).
- I-5 (quit-help resource): not added; the client brief does not ask for one and FACTS has none for this brief.
