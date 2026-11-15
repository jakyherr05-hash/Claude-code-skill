#!/usr/bin/env node
// WCAG 2.x contrast ratios for every pair of colours given.
// usage: node contrast.mjs "#0b0b0c" "#e9e4da" "rgb(200,120,40)"
const parse = (c) => {
  c = c.trim();
  let m;
  if ((m = c.match(/^#([0-9a-f]{3,8})$/i))) {
    let h = m[1];
    if (h.length === 3 || h.length === 4) h = [...h].map((x) => x + x).join('');
    return [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16));
  }
  if ((m = c.match(/^rgba?\(([^)]+)\)$/i))) return m[1].split(/[ ,/]+/).slice(0, 3).map(Number);
  throw new Error(`unsupported colour: ${c}`);
};
const lum = ([r, g, b]) => {
  const f = (v) => { v /= 255; return v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4; };
  return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
};
const ratio = (a, b) => { const [x, y] = [lum(parse(a)), lum(parse(b))].sort((p, q) => q - p); return (x + 0.05) / (y + 0.05); };
const cols = process.argv.slice(2);
if (cols.length < 2) { console.error('usage: contrast.mjs <colour> <colour> [...]'); process.exit(1); }
for (let i = 0; i < cols.length; i++) for (let j = i + 1; j < cols.length; j++) {
  const r = ratio(cols[i], cols[j]);
  const tag = r >= 7 ? 'AAA' : r >= 4.5 ? 'AA' : r >= 3 ? 'AA-large-only' : 'FAIL';
  console.log(`${cols[i].padEnd(18)} vs ${cols[j].padEnd(18)} ${r.toFixed(2).padStart(5)}:1  ${tag}`);
}
