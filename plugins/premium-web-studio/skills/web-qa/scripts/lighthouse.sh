#!/usr/bin/env bash
# lighthouse.sh <url> [outDir=lighthouse] [runs=3]
# Runs Lighthouse (mobile default + desktop preset) N times each, saves JSON (+ last HTML), prints median table.
set -euo pipefail
URL="${1:?usage: lighthouse.sh <url> [outDir] [runs]}"; OUT="${2:-lighthouse}"; RUNS="${3:-3}"
mkdir -p "$OUT"
if [[ -z "${CHROME_PATH:-}" ]]; then
  for c in /opt/pw-browsers/chromium-*/chrome-linux*/chrome "$HOME"/.cache/ms-playwright/chromium-*/chrome-linux*/chrome \
           "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" /usr/bin/google-chrome /usr/bin/chromium; do
    [[ -x "$c" ]] && { export CHROME_PATH="$c"; break; }
  done
fi
echo "lighthouse $(npx -y lighthouse@13 --version) · chrome: ${CHROME_PATH:-auto}"
for form in mobile desktop; do
  for i in $(seq 1 "$RUNS"); do
    extra=(); [[ $form == desktop ]] && extra=(--preset=desktop)
    npx -y lighthouse@13 "$URL" --quiet --chrome-flags="--headless=new --no-sandbox" \
      --only-categories=performance,accessibility,best-practices,seo "${extra[@]}" \
      --output=json --output=html --output-path="$OUT/$form-$i" >/dev/null
  done
done
node - "$OUT" "$RUNS" <<'JS'
const fs = require('fs'); const [out, runs] = process.argv.slice(2);
const med = (a) => { const s = [...a].sort((x, y) => x - y); return s[Math.floor(s.length / 2)]; };
const rows = [];
for (const form of ['mobile', 'desktop']) {
  const r = [...Array(+runs)].map((_, i) => JSON.parse(fs.readFileSync(`${out}/${form}-${i + 1}.report.json`)));
  const a = (id) => r.map((x) => x.audits[id].numericValue);
  const c = (id) => r.map((x) => Math.round(x.categories[id].score * 100));
  rows.push({ form, perf: med(c('performance')), a11y: med(c('accessibility')), bp: med(c('best-practices')), seo: med(c('seo')),
    fcpMs: Math.round(med(a('first-contentful-paint'))), lcpMs: Math.round(med(a('largest-contentful-paint'))), tbtMs: Math.round(med(a('total-blocking-time'))),
    cls: +med(a('cumulative-layout-shift')).toFixed(3), siMs: Math.round(med(a('speed-index'))), bytesKB: Math.round(med(a('total-byte-weight')) / 1024),
    perfSpread: `${Math.min(...c('performance'))}-${Math.max(...c('performance'))}` });
}
console.table(rows);
fs.writeFileSync(`${out}/summary.json`, JSON.stringify(rows, null, 2));
JS
