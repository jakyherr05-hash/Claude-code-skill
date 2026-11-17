# Ten-phase acceptance run 2 (fresh project "Halde"), 2026-11-17

Prompt: `tests/ten-phase.prompt.txt`, run headless with `claude -p` in an empty temp git repo (vendored GSAP 3.15.1 / Lenis 1.3.27 only).
Interrupted once by the account 5-hour usage limit in phase 9; resumed in the same session with `claude -p --resume <session-id>` (no restart).
Top-level delegations recorded in the orchestrator transcripts: 26. Final exit code 0.

## Orchestrator final summary (verbatim)

All ten phases are done and Gate B passed with all three reviewers, so the Halde site is finished. It's a single page with a hero, three steps and contact, built as plain `index.html`, `styles.css` and `main.js` on the vendored GSAP 3.15.1, ScrollTrigger and Lenis 1.3.27. There are no images and no network requests to other sites.

**What was built:** the concept is "Centred by hand". On desktop a plate drawn in CSS stays pinned beside the steps. Its rings start off-centre and true up during "02 Throw", then the glaze spreads out from the centre during "03 Glaze". On mobile the plate is static and glazed. With reduced motion, the plate shows centred and glazed, smooth scrolling is off and nothing animates.

**How to run:** `python3 -m http.server 8790` in the project folder, then open `http://localhost:8790/`. The tests run with `node tests/qa.mjs`; add `--update-baselines` only after you've reviewed a visual change.

**Verification (Chromium, run in Playwright):**
- All 63 automated checks pass. At 360 to 1920 wide, including the required 390 and 1440, there are 0 console errors and no horizontal overflow.
- The automated accessibility scan (axe) finds 0 violations. Keyboard use, the skip link, the no-JavaScript fallback and the reduced-motion version all pass.
- Load and scroll: the largest element paints in 772 ms on a throttled phone and 132 ms on desktop, and nothing shifts during load. While scrolling, 95% of frames take 16.8 ms or less.
- The screenshots were opened and looked at by QA, by tech-lead and by me.

**Problems the reviews caught and fixed:**
- **Gate A:** three spec mistakes that would have broken the build, each reproduced in Chromium before any code was written.
- **Layout review:** the pinned plate slid over the contact email button.
- **Motion review:** the glaze filled in like a pie chart, so it became a radial pool.
- **Testing:** an accessibility label didn't match the visible "Contact" text.
- **Gate B:** a CSS transition fought the button animation, and the test suite was comparing screenshots against copies it had just rewritten.

**Not tested:** Lighthouse (not installed), real devices, Firefox and Safari, true GPU paint cost, and responsiveness to real user input (INP).

**Still open before a public launch:**
- **Lenis copyright line:** `THIRD_PARTY_NOTICES.md` carries the MIT text, but the exact upstream copyright line couldn't be checked offline.
- **Compression:** the production host needs gzip or brotli turned on.
- **Uncommitted work:** I haven't committed anything; only `vendor/` was in the initial commit, so everything else is uncommitted.

**Assumptions I made instead of asking** (all in `studio/PROJECT_BRIEF.md`):
- system fonts only;
- contact is a mailto link to `hei@halde.example`;
- English copy;
- WCAG 2.2 AA;
- no paid assets.

I also changed the hero line to "two potters" during Gate B, and creative-director approved it.

**By phase** (all paths are under `studio/` unless they start with `tests/` or are a top-level file):

| # | Phase | Agent(s) | Evidence |
|---|---|---|---|
| 1 | Discovery | orchestrator (me) | `PROJECT_BRIEF.md` |
| 2 | Research | reference-researcher (existing library only) | `REFERENCE_RESEARCH.md` |
| 3 | Creative direction | creative-director | `CREATIVE_DIRECTION.md` |
| 4 | Design spec | ui-ux-designer and typography-spacing in parallel, then gsap-animator | `DESIGN_SPECIFICATION.md`, `TYPOGRAPHY_SYSTEM.md`, `SPACING_SYSTEM.md`, `ANIMATION_SPECIFICATION.md` |
| 5 | Architecture, Gate A | frontend-engineer, then tech-lead (passed once three conditions were fixed) | `TECHNICAL_ARCHITECTURE.md`, `DECISIONS.md` |
| 6 | Development | frontend-engineer and ai-visual-producer in parallel, then typography-spacing; creative-director critiqued twice | `critique/layout-critique-r1.md`, `critique/layout-critique-r2.md` |
| 7 | Motion | lenis-scroll, then gsap-animator (with frontend fixes); creative-director critiqued twice | `critique/scroll-samples.json`, `critique/motion-critique-r1.md`, `critique/motion-critique-r2.md` |
| 8 | Visual production | ai-visual-producer | `ASSET_MANIFEST.md` (typographic and CSS only, 0 media) |
| 9 | Testing | qa-engineer and performance-engineer in parallel, plus a tech-lead budget ruling | `QA_REPORT.md`, `PERFORMANCE_REPORT.md`, `tests/results.json` |
| 10 | Gate B | creative-director, tech-lead and qa-engineer independently, then a fix round and re-checks | `gateB/creative/VERDICT.md`, `QA_REPORT.md` (Gate B section), `PROJECT_STATUS.md` |

Gate B verdicts: creative **PASS**, technical **PASS WITH NOTES**, QA **PASS WITH NOTES**. Every `studio/` doc is 40 lines or fewer; the notices file is longer because it carries the licence text.
