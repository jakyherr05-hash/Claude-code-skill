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

## 2026-11-18 · Orchestrator decisions on ANIMATION_SPECIFICATION.md
- A-1 Track height = story budget + 100svh (sticky stage sits inside the track). TECHNICAL_ARCHITECTURE §3 `--track-h: 1210vh` is wrong; frontend corrects it before Gate A.
- A-2 Rig M uses the desktop scroll table; rig P = desktop × 0.9 rounded to 5 (gsap-animator proposal) — creative-director may tune after the filmstrip.
- A-3 Scroll is NOT locked during the 1.5 s score fade: it unlocks at the loader hand-off; music fades in alongside (client: no unnecessary delays). Overrides CD §5 on this point.
- A-4 `sfx:tNM:<id>` / `cue:sN` / `cue:t45:lowpass-open` label names are the contract for AUDIO_SPECIFICATION.

## 2026-11-18 · Orchestrator decisions on AUDIO_SPECIFICATION.md
- AU-1 Add `setPlayhead(units, dir)` to the AudioDirector contract (throttled to one call per frame from `master.ts` `onUpdate`); `setCue` alone cannot drive within-scene intensity. TECHNICAL_ARCHITECTURE §6 updated.
- AU-2 Mute/unmute gain ramp is 0.4 s everywhere (architecture and audio spec); DESIGN_SPECIFICATION §3.2's 300 ms changed to match. `aria-pressed` still flips at once.
- AU-3 Streetlight plucks (`sfx:t45:pluck1..5`) fire on their label, NOT quantised to the next 16th: up to 208 ms of lag against a scroll-bound light is a visible audio/visual mismatch, and the lights cannot wait for the audio clock. Pitches stay in the chord set, so they remain in key. Creative director may revisit after the t45 prototype.
- AU-4 `loader:bloom` accepted as an internal AudioDirector event (the loader is not on the master timeline), played only when autoplay succeeds.
- AU-5 No `cue:s1` label: the loader hand-off calls `setCue(1,+1)`. The near-silence stays keyed to `sfx:t45:eraser-rub` (no new label). `sfx:footstep` keeps its single id; the variant comes from the playhead.
