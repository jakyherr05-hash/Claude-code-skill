import { useEffect } from 'react';
import { gsap, ScrollTrigger } from '../motion/registry';

/** ?debug → window.__gsapStats() for leak tests (ANIMATION_SPECIFICATION cleanup rule 4). Renders nothing. */
export function DebugStats() {
  useEffect(() => {
    if (!new URLSearchParams(location.search).has('debug') && !import.meta.env.DEV) return;
    const w = window as unknown as Record<string, unknown>;
    w.__gsapStats = () => ({
      scrollTriggers: ScrollTrigger.getAll().length,
      globalChildren: gsap.globalTimeline.getChildren(false).length,
      lightRenderers: (w.__lightRenderers as number) ?? 0,
    });
    w.__ScrollTrigger = ScrollTrigger;
  }, []);
  return null;
}
