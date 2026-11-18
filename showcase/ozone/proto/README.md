# OZONE T6b prototype (placeholder art)

Self-contained Vite + TypeScript page for the T6b measurement (t45, t67). **Placeholder art and an audio load stand-in. Not the product, not music, not a performance result.** Plain TypeScript (no React), native scroll (no Lenis). Pins: gsap 3.15.1, vite 8.3.8, typescript 7.0.2.

```
cd showcase/ozone/proto
npm ci
npm run build            # tsc --noEmit && vite build  -> dist/
npm run preview          # http://localhost:4174/  (strict port)
node fidelity-measure.mjs   # actual vs target, writes ../reports/proto/fidelity-placeholder.json
node shots.mjs              # s4, mid-t45, t45-70, s5, mid-t67, t67-88, s7 at 1440x900 and 390x844
```

Playwright is not a dependency of this folder; the scripts import `/opt/node-tools/node_modules/playwright/index.mjs` or `playwright` (override with `PLAYWRIGHT=`). Launch Chromium with `--autoplay-policy=no-user-gesture-required` for the autoplay-allowed case; otherwise click `ENTER WITH SOUND`.

Hooks (only when `window.__OZONE_QA__` is set before load): `__labels` `{rig, px:{s1..end}, units, ...}`, `__ozoneStats` `{triggers, tweens, listeners, audio}`, `__art`, `__playhead`. `performance.mark('story-ready')` is always set (immediately after the ScrollTrigger exists).

Query parameters: `?art=lite|full` (logged as `[ozone] art-tier=... source=query`), `?cut=N` (cut-lines 1..N, cumulative), `?cutonly=6` or `?cutonly=2,6` (exact set), `?filters=1` (report-only variant with 3 live filters), `?audioprofile=desktop|mobile` (this lab reports few cores, which selects the mobile profile by default), `?audio=off`, `?at=s5` or `?at=t45+30` (scroll there after load), `?scrub=true|0.5`.

Cut-lines: 1 per-rough opacity stagger instead of the mask; 2 halftone density one step down (60->35->15; does not change the bounding-box area metric); 3 lite tier (far planes flat and frozen, half crumbs); 4 node cull (only the on-screen scene plus the next during a transition); 5 bake filters (no-op here: the prototype has 0 filters); 6 depth planes as HTML-wrapped `<svg>` layers sized to the plane's world extent and transformed on the wrapper.
