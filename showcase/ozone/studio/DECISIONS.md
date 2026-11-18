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
