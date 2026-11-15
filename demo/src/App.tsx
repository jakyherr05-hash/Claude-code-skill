import { SmoothScroll } from './scroll/SmoothScroll';
import { Router } from './router/Router';
import { Header } from './components/Header';
import { Footer } from './sections/Closing';
import { Home } from './pages/Home';
import { ProjectPage, NotFound } from './pages/ProjectPage';
import { projectBySlug } from './data/content';
import { DebugStats } from './components/DebugStats';

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
            </>
          );
        }}
      </Router>
    </SmoothScroll>
  );
}
