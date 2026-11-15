/**
 * The project's ONE scroll system: a single Lenis instance driven by GSAP's ticker.
 *
 * Integration (from the Lenis 1.3.27 README, "GSAP ScrollTrigger"):
 *   lenis.on('scroll', ScrollTrigger.update)
 *   gsap.ticker.add((time) => lenis.raf(time * 1000))
 *   gsap.ticker.lagSmoothing(0)
 * We keep autoRaf off so there is exactly one animation loop (GSAP's).
 *
 * Accessibility: Lenis wraps native scroll (keyboard, find-in-page and screen readers keep working)
 * and honours prefers-reduced-motion by default (respectReducedMotion: true).
 */
import Lenis from 'lenis';
import 'lenis/dist/lenis.css';
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { gsap, ScrollTrigger } from '../motion/registry';

type ScrollApi = {
  lenis: Lenis | null;
  /** Smooth (or instant under reduced motion) scroll to a target, accounting for the fixed header. */
  scrollTo: (target: string | number | HTMLElement, opts?: { immediate?: boolean; focus?: boolean }) => void;
  /** Reference-counted lock (menu, modal). Blocks wheel, touch and keyboard scrolling. */
  lock: () => () => void;
};

const ScrollContext = createContext<ScrollApi | null>(null);

export const HEADER_OFFSET_VAR = '--header-h';
/** Resolve a CSS length custom property (rem, px, clamp()…) to px by letting the browser compute it. */
export function cssVarPx(name: string): number {
  const probe = document.createElement('div');
  probe.style.cssText = `position:absolute;visibility:hidden;height:var(${name});`;
  document.body.appendChild(probe);
  const px = probe.getBoundingClientRect().height;
  probe.remove();
  return px;
}
export const headerOffset = () => cssVarPx(HEADER_OFFSET_VAR);

export function SmoothScroll({ children }: { children: ReactNode }) {
  const [lenis, setLenis] = useState<Lenis | null>(null);
  const locks = useRef(0);

  useEffect(() => {
    // Reduced motion: Lenis' respectReducedMotion makes PROGRAMMATIC scrolls instant, but user wheel input
    // still runs a short damp (lerp forced to 1 → damp λ=60, ≈70 ms; lenis.mjs L753-757 + L86). For a truly
    // native, un-eased wheel we turn smoothWheel off (line 621 then leaves the event to the browser) and
    // keep it in sync with the OS setting live.
    const reducedMq = matchMedia('(prefers-reduced-motion: reduce)');
    const instance = new Lenis({
      autoRaf: false,
      lerp: 0.1,
      smoothWheel: !reducedMq.matches,
      syncTouch: false, // native touch momentum on phones; most robust on iOS/Android
      anchors: false,   // handled below so we can apply header offset AND move focus
      stopInertiaOnNavigate: true,
    });
    const onScroll = () => ScrollTrigger.update();
    instance.on('scroll', onScroll);
    const tick = (time: number) => instance.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);
    const onReducedChange = () => { instance.options.smoothWheel = !reducedMq.matches; };
    reducedMq.addEventListener('change', onReducedChange);
    setLenis(instance);
    if (import.meta.env.DEV || new URLSearchParams(location.search).has('debug')) {
      (window as unknown as { __lenis?: Lenis }).__lenis = instance;
    }
    return () => {
      reducedMq.removeEventListener('change', onReducedChange);
      gsap.ticker.remove(tick);
      gsap.ticker.lagSmoothing(500, 33); // GSAP default
      instance.destroy();
      setLenis(null);
      delete (window as unknown as { __lenis?: Lenis }).__lenis;
    };
  }, []);

  const scrollTo = useCallback<ScrollApi['scrollTo']>((target, opts = {}) => {
    const el = typeof target === 'string' ? document.querySelector<HTMLElement>(target) : target;
    if (el === null) return;
    // Lenis.scrollTo(element) already subtracts the target's scroll-margin-top AND the root's
    // scroll-padding-top (lenis 1.3.27, lenis.mjs L787-790). If the project sets either in CSS
    // (a good no-JS / initial-#hash fallback), adding our own offset would double-count it.
    const cssOffset = el instanceof Element
      ? (parseFloat(getComputedStyle(el).scrollMarginTop) || 0) + (parseFloat(getComputedStyle(document.documentElement).scrollPaddingTop) || 0)
      : 0;
    const offset = cssOffset > 0 ? 0 : -headerOffset();
    const done = () => {
      if (opts.focus && el instanceof HTMLElement) {
        if (!el.hasAttribute('tabindex')) el.setAttribute('tabindex', '-1');
        el.focus({ preventScroll: true });
      }
    };
    if (lenis) {
      lenis.scrollTo(el as HTMLElement | number, { offset, immediate: opts.immediate, force: true, onComplete: done });
      if (lenis.prefersReducedMotion || opts.immediate) done();
    } else {
      const y = typeof el === 'number' ? el : el.getBoundingClientRect().top + scrollY + offset;
      window.scrollTo({ top: y, behavior: 'instant' as ScrollBehavior });
      done();
    }
  }, [lenis]);

  const lock = useCallback(() => {
    locks.current += 1;
    lenis?.stop();
    document.documentElement.classList.add('is-scroll-locked');
    let released = false;
    return () => {
      if (released) return;
      released = true;
      locks.current = Math.max(0, locks.current - 1);
      if (locks.current === 0) {
        lenis?.start();
        document.documentElement.classList.remove('is-scroll-locked');
      }
    };
  }, [lenis]);

  // In-page anchors: <a href="#id"> anywhere → offset-aware scroll + focus move (keyboard/screen readers).
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const a = (e.target as Element | null)?.closest?.('a[href^="#"]') as HTMLAnchorElement | null;
      if (!a) return;
      const id = a.getAttribute('href')!.slice(1);
      const target = id ? document.getElementById(id) : document.body;
      if (!target) return;
      e.preventDefault();
      scrollTo(target, { focus: true });
      history.replaceState(history.state, '', id ? `#${id}` : location.pathname);
    };
    document.addEventListener('click', onClick);
    return () => document.removeEventListener('click', onClick);
  }, [scrollTo]);

  const api = useMemo<ScrollApi>(() => ({ lenis, scrollTo, lock }), [lenis, scrollTo, lock]);
  return <ScrollContext.Provider value={api}>{children}</ScrollContext.Provider>;
}

export function useScroll() {
  const ctx = useContext(ScrollContext);
  if (!ctx) throw new Error('useScroll must be used inside <SmoothScroll>');
  return ctx;
}

/** Lock scrolling while `active` is true (menus, dialogs). */
export function useScrollLock(active: boolean) {
  const { lock } = useScroll();
  useEffect(() => (active ? lock() : undefined), [active, lock]);
}
