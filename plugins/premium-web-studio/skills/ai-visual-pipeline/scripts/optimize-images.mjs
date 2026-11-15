#!/usr/bin/env node
/**
 * Responsive image set generator: AVIF + WebP + JPEG at several widths, plus a manifest
 * and ready-to-paste <picture> markup.
 *
 *   node optimize-images.mjs <input file|dir> <outDir> [--widths 480,960,1440,2160]
 *        [--avif-q 50] [--webp-q 72] [--jpg-q 78] [--no-jpg]
 *
 * Requires `sharp` (Apache-2.0):  npm i -D sharp
 * Never upscales: widths larger than the source are skipped (the source width is added instead).
 */
import fs from 'node:fs';
import path from 'node:path';

let sharp;
try { sharp = (await import('sharp')).default; } catch {
  console.error('sharp is not installed. Run: npm i -D sharp'); process.exit(2);
}
const args = process.argv.slice(2);
const opt = (k, d) => { const i = args.indexOf(`--${k}`); return i >= 0 ? args[i + 1] : d; };
const [input, outDir] = args.filter((a, i) => !a.startsWith('--') && !(i > 0 && args[i - 1].startsWith('--')));
if (!input || !outDir) { console.error('usage: optimize-images.mjs <input> <outDir> [--widths 480,960,1440,2160]'); process.exit(1); }
const widths = opt('widths', '480,960,1440,2160').split(',').map(Number);
const q = { avif: +opt('avif-q', 50), webp: +opt('webp-q', 72), jpg: +opt('jpg-q', 78) };
const noJpg = args.includes('--no-jpg');

const files = fs.statSync(input).isDirectory()
  ? fs.readdirSync(input).filter((f) => /\.(png|jpe?g|webp|tiff?|avif)$/i.test(f)).map((f) => path.join(input, f))
  : [input];
fs.mkdirSync(outDir, { recursive: true });
const manifest = [];
for (const file of files) {
  const base = path.basename(file).replace(/\.[^.]+$/, '');
  const meta = await sharp(file).metadata();
  const ws = [...new Set(widths.filter((w) => w <= meta.width).concat(widths.some((w) => w > meta.width) ? [meta.width] : []))].sort((a, b) => a - b);
  const entry = { id: base, source: file, sourceWidth: meta.width, sourceHeight: meta.height, aspect: +(meta.width / meta.height).toFixed(4), outputs: [] };
  for (const w of ws) {
    const pipeline = sharp(file).resize({ width: w, withoutEnlargement: true });
    const jobs = [
      ['avif', pipeline.clone().avif({ quality: q.avif, effort: 6 })],
      ['webp', pipeline.clone().webp({ quality: q.webp, effort: 6 })],
      ...(noJpg ? [] : [['jpg', pipeline.clone().jpeg({ quality: q.jpg, mozjpeg: true, progressive: true })]]),
    ];
    for (const [fmt, p] of jobs) {
      const out = path.join(outDir, `${base}-${w}.${fmt}`);
      const info = await p.toFile(out);
      entry.outputs.push({ format: fmt, width: w, height: info.height, bytes: info.size, file: out });
    }
  }
  const srcset = (fmt) => entry.outputs.filter((o) => o.format === fmt).map((o) => `${path.basename(o.file)} ${o.width}w`).join(', ');
  const fallback = entry.outputs.filter((o) => o.format === (noJpg ? 'webp' : 'jpg')).at(-1);
  entry.picture = [
    '<picture>',
    `  <source type="image/avif" srcset="${srcset('avif')}" sizes="100vw">`,
    `  <source type="image/webp" srcset="${srcset('webp')}" sizes="100vw">`,
    `  <img src="${path.basename(fallback.file)}" width="${meta.width}" height="${meta.height}" alt="TODO: describe" loading="lazy" decoding="async">`,
    '</picture>',
  ].join('\n');
  manifest.push(entry);
  const kb = (fmt) => Math.round(entry.outputs.filter((o) => o.format === fmt).reduce((s, o) => s + o.bytes, 0) / 1024);
  console.log(`${base}: ${ws.join('/')}w → avif ${kb('avif')}KB · webp ${kb('webp')}KB${noJpg ? '' : ` · jpg ${kb('jpg')}KB`} (all widths)`);
}
fs.writeFileSync(path.join(outDir, 'images.manifest.json'), JSON.stringify(manifest, null, 2));
console.log(`manifest → ${path.join(outDir, 'images.manifest.json')}`);
