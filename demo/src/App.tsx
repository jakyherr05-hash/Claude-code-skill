import { SmoothScroll } from './scroll/SmoothScroll';
import { Router } from './router/Router';
import { Header } from './components/Header';
import { Footer } from './sections/Closing';
import { Home } from './pages/Home';
import { ProjectPage, NotFound } from './pages/ProjectPage';
import { projectBySlug } from './data/content';
import { DebugStats } from './components/DebugStats';
import { useEffect } from 'react';
import type { Route } from './router/Router';

const SITE_TITLE = 'Penumbra — We design the dark first (fictional demo)';
/** One title per page (WCAG 2.4.2): used by the client on every route change and by the prerender (entry-server). */
export function titleFor(route: Route): string {
  if (route.name === 'home') return SITE_TITLE;
  const project = route.name === 'project' ? projectBySlug(route.slug) : undefined;
  return project ? `${project.name} — Penumbra (fictional demo)` : 'Page not found — Penumbra (fictional demo)';
}
function DocumentTitle({ title }: { title: string }) {
  useEffect(() => { document.title = title; }, [title]);
  return null;
}

/** `initialPath` is only passed by the build-time prerenderer (src/entry-server.tsx). */
export function App({ initialPath }: { initialPath?: string } = {}) {
  return (
    <SmoothScroll>
      <Router initialPath={initialPath}>
        {(route) => {
          const project = route.name === 'project' ? projectBySlug(route.slug) : undefined;
          const page = route.name === 'home' ? <Home /> : project ? <ProjectPage key={project.slug} project={project} /> : <NotFound />;
          const key = route.name === 'project' ? `p-${route.slug}` : route.name;
          return (
            <>
              <Header />
              <main id="main" tabIndex={-1} key={key}>{page}</main>
              <Footer />
              <DebugStats />
              <DocumentTitle title={titleFor(route)} />
            </>
          );
        }}
      </Router>
    </SmoothScroll>
  );
}
