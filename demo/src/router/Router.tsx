/**
 * Minimal history router with a GSAP page transition, scroll restoration and focus management.
 * (Two routes don't justify a router dependency; swap for your framework's router in bigger apps —
 * the transition/cleanup contract below stays the same.)
 *
 * Contract on navigation:
 *  1. play the exit veil (skipped under reduced motion)
 *  2. swap route → old route's useGSAP scopes revert (ScrollTriggers/SplitText killed)
 *  3. scroll to top (or restore position on back/forward), ScrollTrigger.refresh() after layout
 *  4. reveal, then move focus to the new page's <h1> so screen readers announce it
 */
import { createContext, useCallback, useContext, useEffect, useLayoutEffect, useRef, useState, type ReactNode } from 'react';
import { gsap, ScrollTrigger } from '../motion/registry';
import { prefersReducedMotion, motionTokens } from '../motion/tokens';
import { useScroll, headerOffset } from '../scroll/SmoothScroll';

export type Route = { name: 'home' } | { name: 'project'; slug: string } | { name: 'not-found' };

const BASE = import.meta.env.BASE_URL.replace(/\/$/, '');
export function parse(pathname: string): Route {
  const p = pathname.startsWith(BASE) ? pathname.slice(BASE.length) || '/' : pathname;
  if (p === '/' || p === '') return { name: 'home' };
  const m = p.match(/^\/work\/([a-z0-9-]+)\/?$/);
  if (m) return { name: 'project', slug: m[1] };
  return { name: 'not-found' };
}
export const href = (path: string) => `${BASE}${path}`;

/** Next animation frame, or 100 ms if rAF is paused (background tab) — whichever comes first, once. */
function nextFrame(cb: () => void) {
  let ran = false;
  const run = () => { if (!ran) { ran = true; cb(); } };
  requestAnimationFrame(run);
  setTimeout(run, 100);
}

type Nav = { route: Route; navigate: (path: string) => void };
const RouterContext = createContext<Nav | null>(null);

/** `initialPath` is required for server prerendering (no `location` there); the client reads location. */
export function Router({ children, initialPath }: { children: (route: Route) => ReactNode; initialPath?: string }) {
  const [route, setRoute] = useState<Route>(() => parse(initialPath ?? location.pathname));
  // scroll lock is held from Dim until Rise completes (released in done())
  const releaseLock = useRef<(() => void) | null>(null);
  const veil = useRef<HTMLDivElement>(null);
  const pendingScroll = useRef<number | null>(null);
  const pendingHash = useRef<string | null>(null);
  const { lenis, lock } = useScroll();

  useEffect(() => { history.scrollRestoration = 'manual'; }, []);

  const swap = useCallback(async (path: string, restoreY: number | null) => {
    const reduced = prefersReducedMotion();
    releaseLock.current?.();
    releaseLock.current = lock();
    if (veil.current) {
      // "Dim": the page sinks into the ground colour
      const dur = reduced ? motionTokens.page.reduced : motionTokens.page.dim;
      const dim = gsap.fromTo(veil.current, { opacity: 0, visibility: 'visible' },
        { opacity: 1, duration: dur, ease: reduced ? 'none' : motionTokens.ease.exit });
      // Tweens advance on rAF, which browsers pause in background tabs and starve under heavy load.
      // Never let navigation depend on it: complete the swap on a wall-clock deadline too.
      await Promise.race([dim.then(() => undefined), new Promise<void>((r) => setTimeout(r, dur * 1000 + 250))]);
      dim.progress(1);
    }
    pendingScroll.current = restoreY ?? 0;
    const hashAt = path.indexOf('#');
    pendingHash.current = hashAt >= 0 ? path.slice(hashAt + 1) : null;
    setRoute(parse(hashAt >= 0 ? path.slice(0, hashAt) : path));
  }, [lock]);

  // after the new route has rendered: position scroll, refresh triggers, reveal, focus
  useLayoutEffect(() => {
    if (pendingScroll.current === null) return;
    const y = pendingScroll.current;
    pendingScroll.current = null;
    // Lenis measures the document through a ResizeObserver that hasn't fired yet for the new page:
    // without resize() it would clamp scrollTo to the OLD page's height (breaks restore + #hash landing).
    lenis?.resize();
    if (lenis) lenis.scrollTo(y, { immediate: true, force: true }); else window.scrollTo(0, y);
    nextFrame(() => {
      ScrollTrigger.refresh();
      lenis?.resize();
      if (y > 0 && lenis) lenis.scrollTo(y, { immediate: true, force: true });
      const hash = pendingHash.current;
      pendingHash.current = null;
      const hashEl = hash ? document.getElementById(hash) : null;
      if (hashEl) {
        const top = hashEl.getBoundingClientRect().top + scrollY - headerOffset();
        if (lenis) lenis.scrollTo(top, { immediate: true, force: true }); else window.scrollTo(0, top);
        hashEl.setAttribute('tabindex', '-1');
      }
      const done = () => {
        releaseLock.current?.();
        releaseLock.current = null;
        if (hashEl) hashEl.focus({ preventScroll: true });
        else if (y === 0) document.querySelector<HTMLElement>('main h1')?.focus({ preventScroll: true });
      };
      if (veil.current) {
        // "Rise": the new page's light comes up (Detail route's own entrance starts now too)
        const reduced = prefersReducedMotion();
        const dur = reduced ? motionTokens.page.reduced : motionTokens.page.rise;
        let finished = false;
        let rise: gsap.core.Tween | null = null;
        const finish = () => { if (finished) return; finished = true; rise?.progress(1); gsap.set(veil.current, { visibility: 'hidden' }); done(); };
        rise = gsap.to(veil.current, { opacity: 0, duration: dur, ease: reduced ? 'none' : motionTokens.ease.enter, onComplete: finish });
        setTimeout(finish, dur * 1000 + 250); // same rAF-independence guarantee as the Dim step
      } else done();
    });
  }, [route, lenis]);

  const navigate = useCallback((path: string) => {
    if (path === location.pathname + location.hash) return;
    history.replaceState({ ...(history.state || {}), y: scrollY }, '');
    history.pushState({ y: 0 }, '', path);
    void swap(path, null);
  }, [swap]);

  useEffect(() => {
 const onPop = (e: PopStateEvent) => void swap(location.pathname, (e.state && typeof e.state.y === 'number') ? e.state.y : 0);
    addEventListener('popstate', onPop);
    return () => removeEventListener('popstate', onPop);
  }, [swap]);

  return (
    <RouterContext.Provider value={{ route, navigate }}>
      {children(route)}
      <div ref={veil} className="route-veil" aria-hidden="true" />
    </RouterContext.Provider>
  );
}

export function useRouter() {
  const ctx = useContext(RouterContext);
  if (!ctx) throw new Error('useRouter outside <Router>');
  return ctx;
}

/** Internal link: real <a href> (works without JS, middle-click, copy link) + client navigation. */
export function Link({ to, children, ...rest }: { to: string; children: ReactNode } & React.AnchorHTMLAttributes<HTMLAnchorElement>) {
  const { navigate } = useRouter();
  return (
    <a
      href={href(to)}
      {...rest}
      onClick={(e) => {
        rest.onClick?.(e);
        if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
        e.preventDefault();
        navigate(href(to));
      }}
    >
      {children}
    </a>
  );
}
