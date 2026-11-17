/** Build-time prerender entry (used by scripts/build.mjs, never shipped to the browser). */
import { StrictMode } from 'react';
import { renderToString } from 'react-dom/server';
import { App, titleFor } from './App';
import { parse } from './router/Router';
import { featured } from './data/content';

/** Every route the static build writes an HTML file for. */
export const routes = ['/', ...featured.map((p) => `/work/${p.slug}`)];

/** The <title> the static HTML for `path` ships with (same function the client uses). */
export const title = (path: string): string => titleFor(parse(path));

export function render(path: string): string {
  return renderToString(
    <StrictMode>
      <App initialPath={path} />
    </StrictMode>,
  );
}
