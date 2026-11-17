#!/usr/bin/env node
/**
 * Production build with static prerendering:  node scripts/build.mjs [outDir=dist]
 *  1. client bundle (vite build)
 *  2. server bundle of src/entry-server.tsx (vite build --ssr) into a temp dir
 *  3. render every route to HTML, inject into the built index.html (+ font preloads), write
 *     <outDir>/index.html and <outDir>/work/<slug>/index.html
 * Why: the hero text (the LCP element) is in the HTML, so it paints before ~150 KB of JS has run.
 * The client hydrates it (src/main.tsx). No extra dependency: react-dom/server + Vite's SSR build.
 */
import { build } from 'vite';
import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const outDir = path.resolve(root, process.argv[2] || 'dist');
// inside the project so the externalised SSR bundle resolves node_modules (react, gsap…)
const ssrDir = path.join(root, 'node_modules', '.cache', 'penumbra-ssr');

await build({ root, logLevel: 'warn', build: { outDir, emptyOutDir: true } });
await build({ root, logLevel: 'warn', build: { ssr: 'src/entry-server.tsx', outDir: ssrDir, emptyOutDir: true } });

const { render, routes, title } = await import(pathToFileURL(path.join(ssrDir, 'entry-server.js')).href);

const template = fs.readFileSync(path.join(outDir, 'index.html'), 'utf8');
// Preload only the two faces that paint above the fold: the hero H1 (Newsreader, latin, normal) and the
// hero sub-line/UI (Hanken Grotesk, latin). Other subsets/italics load on demand via unicode-range.
const assets = fs.readdirSync(path.join(outDir, 'assets'));
const preloadFonts = [/^newsreader-latin-opsz-normal-.*\.woff2$/, /^hanken-grotesk-latin-wght-normal-.*\.woff2$/]
  .map((re) => assets.find((f) => re.test(f)))
  .filter(Boolean)
  .map((f) => `<link rel="preload" as="font" type="font/woff2" href="/assets/${f}" crossorigin>`)
  .join('\n    ');

for (const r of routes) {
  const html = render(r);
  const page = template
    // data-prerendered records which route this HTML is: the client only hydrates when it matches the URL
    // (hosts' SPA fallbacks may serve the home HTML for /work/x — hydrating that would mismatch)
    .replace('<div id="root"></div>', `<div id="root" data-prerendered="${r}">${html}</div>`)
    .replace(/<title>[^<]*<\/title>/, `<title>${title(r)}</title>`)
    // the home hero's poster preloads only belong on the home page (project pages never show that image)
    .replace(r === '/' ? /^$/ : /\s*<!-- preloads mirror[^\n]*\n(\s*<link rel="preload" as="image"[^\n]*\n)+/, r === '/' ? '' : '\n')
    .replace('</head>', `    ${preloadFonts}\n  </head>`);
  const file = r === '/' ? path.join(outDir, 'index.html') : path.join(outDir, r.slice(1), 'index.html');
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, page);
  // twin for hosts/servers that resolve extensionless paths to <path>.html instead of <path>/index.html
  if (r !== '/') fs.writeFileSync(path.join(outDir, `${r.slice(1)}.html`), page);
  console.log(`prerendered ${r.padEnd(32)} ${(html.length / 1024).toFixed(1)} KB html`);
}
fs.rmSync(ssrDir, { recursive: true, force: true });
