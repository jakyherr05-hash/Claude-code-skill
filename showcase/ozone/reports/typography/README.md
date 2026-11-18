# S1 headline fit under the height clamp (TD12), 2026-11-18
`run.mjs` loads `page.html` in Chromium with the real tokens and `text-wrap: balance` and measures the S1 block against the bottom reserve line H − (44 + `--pad-b` + `--space-m`). Results are in TYPOGRAPHY_SYSTEM.md §5.
The font file `b.woff2` is not committed: it is `bricolage-grotesque-latin-wdth-normal.woff2` from `npm pack @fontsource-variable/bricolage-grotesque@5.3.0` (OFL-1.1). Put it next to `page.html` before running.
Only S1 was measured. S5–S7 at 640×360 and 844×390 are NOT TESTED (QA owns them in TEST_PLAN).
