import { StrictMode } from 'react';
import { createRoot, hydrateRoot } from 'react-dom/client';
import './styles/fonts.css';
import './styles/tokens.css';
import './styles/base.css';
import './styles/sections.css';
import { App } from './App';

const root = document.getElementById('root')!;
const app = (
  <StrictMode>
    <App />
  </StrictMode>
);
// Prerendered pages (scripts/build.mjs) ship real HTML → hydrate it so the hero text paints before JS runs (LCP).
// The dev server serves an empty #root → render from scratch.
const normalise = (p: string) => p.replace(/\/(index\.html)?$/, '').replace(/\.html$/, '') || '/';
if (root.hasChildNodes() && normalise(root.dataset.prerendered ?? '') === normalise(location.pathname)) {
  hydrateRoot(root, app);
} else {
  root.replaceChildren(); // markup for a different route (e.g. a host's SPA fallback) — render fresh
  createRoot(root).render(app);
}
