import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

/**
 * Single smooth-scroll controller. Lenis is driven by gsap.ticker (no second
 * rAF loop) and feeds ScrollTrigger. When the user prefers reduced motion,
 * Lenis is not created and everything falls back to native scrolling.
 */
let lenis: Lenis | null = null;
let locks = 0;

const reducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export function headerOffset(): number {
  const v = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--header-h'));
  return Number.isFinite(v) ? v : 72;
}

export function initSmoothScroll(): () => void {
  if (reducedMotion()) return () => {};

  const instance = new Lenis({ autoRaf: false, anchors: false });
  lenis = instance;

  instance.on('scroll', ScrollTrigger.update);
  const tick = (time: number) => instance.raf(time * 1000);
  gsap.ticker.add(tick);
  gsap.ticker.lagSmoothing(0);
  // Re-apply a lock that was requested before Lenis existed.
  if (locks > 0) instance.stop();

  return () => {
    gsap.ticker.remove(tick);
    gsap.ticker.lagSmoothing(500, 33);
    instance.destroy();
    if (lenis === instance) lenis = null;
  };
}

/** Reference-counted scroll lock (menu, modals). Works with or without Lenis. */
export function lockScroll() {
  if (locks++ === 0) {
    lenis?.stop();
    document.documentElement.classList.add('scroll-locked');
  }
}
export function unlockScroll() {
  if (locks > 0 && --locks === 0) {
    lenis?.start();
    document.documentElement.classList.remove('scroll-locked');
  }
}

export function scrollToTarget(target: HTMLElement | string, immediate = false) {
  const offset = -headerOffset();
  if (lenis) {
    lenis.scrollTo(target, { offset, immediate, force: true });
    return;
  }
  const el = typeof target === 'string' ? document.querySelector<HTMLElement>(target) : target;
  if (!el) return;
  // Native fallback: instant (reduced motion); scroll-padding-top handles the header.
  el.scrollIntoView({ block: 'start', behavior: 'auto' });
}

/** Scroll to an in-page hash, update the URL and move focus for keyboard/AT users. */
export function goToHash(hash: string, { push = true, immediate = false } = {}) {
  const id = decodeURIComponent(hash.replace(/^#/, ''));
  const el = id ? document.getElementById(id) : null;
  if (!el) return false;
  scrollToTarget(el, immediate);
  if (push && location.hash !== `#${id}`) history.pushState(null, '', `#${id}`);
  if (!el.hasAttribute('tabindex')) el.setAttribute('tabindex', '-1');
  el.focus({ preventScroll: true });
  return true;
}
