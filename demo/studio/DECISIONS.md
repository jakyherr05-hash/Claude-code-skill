# Decision Log — Penumbra — Light Atelier (demo)

| Date | Decision | Alternatives | Rationale | Decided by |
|---|---|---|---|---|
| 2026-11-15 | Concept "We design the dark first" approved as written | Alternates A/B/C in CREATIVE_DIRECTION | Grounded in both brief differentiators; signature moments justify one shader | orchestrator |
| 2026-11-15 | Display face = Newsreader Variable (OFL-1.1, verified via npm) instead of Zodiak | Zodiak (Fontshare ITF FFL) | ITF FFL licence text could not be machine-read; the CD named Newsreader as the fallback; OFL is verified | orchestrator |
| 2026-11-15 | Live light rendering = raw WebGL2 fragment shader, no three.js in the site bundle | three.js (~130 KB gz), OGL | One full-screen quad needs no scene graph; saves ~130 KB; CD's call. The webgl-three skill's Three.js template is verified separately in demo/lab/ | orchestrator (tech-lead to ratify at Gate A) |
| 2026-11-15 | Router = 70-line in-house history router | react-router | Two routes; keeps deps minimal; transition contract documented in src/router/Router.tsx | orchestrator |
| 2026-11-15 | Email placeholder studio@penumbra.example | — | .example TLD is reserved, can't reach a real person | orchestrator |
