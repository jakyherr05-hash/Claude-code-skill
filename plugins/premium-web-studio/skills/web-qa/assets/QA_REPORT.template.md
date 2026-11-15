# QA Report — <project>
_Owner: qa-engineer · Date: <date> · Build: <commit> · Browsers run: <e.g. Chromium 1243 (Playwright 1.63)>_

Statuses: PASS (evidence linked) · FAIL · NOT TESTED · BLOCKED

| # | Area | Check | Status | Evidence |
|---|---|---|---|---|
| 1 | Rendering | Home + routes render, one h1, landmarks | | |
| 2 | Console | Zero errors across suite | | |
| 3 | Links/media | All internal URLs 200 | | |
| 4 | Navigation | Anchors (offset + focus), routes, back/forward | | |
| 5 | Scroll | Lenis smoothing sampled; single instance | | |
| 6 | Sync | ScrollTrigger progress updates during glide | | |
| 7 | Motion | Pinned sequence states at positions; reveals complete | | |
| 8 | Lifecycle | Route-cycle leak test ×3 | | |
| 9 | Reduced motion | No smoothing/pins; content fully visible | | |
| 10 | Responsive | 360/390/768/1024/1440/1920 overflow, targets, nav — screenshots opened | | |
| 11 | A11y | axe serious/critical = 0; keyboard order; focus visible | | |
| 12 | Resilience | Fonts/images blocked; no WebGL | | |
| 13 | Visual regression | Baselines created/compared; diffs investigated | | |
| 14 | Cross-browser | Firefox / WebKit / real devices | | |

## Screenshots reviewed (what I saw)
## Defects
| ID | Severity | Description | Owner | Status |
|---|---|---|---|---|
