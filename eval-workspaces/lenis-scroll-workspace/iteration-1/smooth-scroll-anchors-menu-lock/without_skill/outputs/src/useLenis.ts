import { useEffect, useState } from 'react';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export const HEADER_HEIGHT = 72;

/**
 * Single scroll loop: Lenis is NOT given its own rAF (autoRaf: false). It is
 * ticked from gsap.ticker, and ScrollTrigger is updated from Lenis' scroll event.
 * Returns the Lenis instance (null until mounted, or when reduced motion is on).
 */
export function useLenis(): Lenis | null {
  const [lenis, setLenis] = useState<Lenis | null>(null);

  useEffect(() => {
    // Respect reduced motion: keep native scrolling entirely.
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (mq.matches) return;

    const instance = new Lenis({ autoRaf: false, anchors: false });
    const onScroll = () => ScrollTrigger.update();
    const tick = (time: number) => instance.raf(time * 1000); // gsap seconds -> ms

    instance.on('scroll', onScroll);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0); // avoid gsap compensating lag and desyncing Lenis
    setLenis(instance);

    return () => {
      gsap.ticker.remove(tick);
      gsap.ticker.lagSmoothing(500, 33); // restore gsap defaults
      instance.off('scroll', onScroll);
      instance.destroy();
      setLenis(null);
    };
  }, []);

  return lenis;
}
