// QA hooks (TEST_PLAN §1, G-15): exposed only when window.__OZONE_QA__ is truthy; absent otherwise.
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { gsap } from 'gsap';
import { LABELS, LABEL_NAMES, type Rig } from './config';
import { listenerCount } from './cleanup';
import type { Standin } from './audio/standin';
import type { Art } from './art';

interface Hooks { rig: Rig; st: ScrollTrigger | null; tl: gsap.core.Timeline | null; audio: Standin; art: Art; tier: 'lite' | 'full'; source: 'query' | 'auto'; cuts: number[]; filters: boolean; lite: boolean }

export function exposeHooks(h: Hooks) {
  const w = window as unknown as Record<string, unknown> & { __OZONE_QA__?: unknown };
  if (!w.__OZONE_QA__) return;
  const L = LABELS[h.rig];
  const def = (k: string, get: () => unknown) => Object.defineProperty(w, k, { get, configurable: true });
  // scroll px per label, read from the real ScrollTrigger and the master's duration (never recomputed by tests)
  if (h.st && h.tl) {
  const { st, tl } = h;
  def('__labels', () => {
    const span = st.end - st.start;
    const px = Object.fromEntries(LABEL_NAMES.map((n) => [n, Math.round(st.start + (tl.labels[n] / tl.duration()) * span)]));
    return { rig: h.rig, px, units: { ...L }, masterDuration: tl.duration(), stStart: st.start, stEnd: st.end };
  });
  def('__playhead', () => tl.time());
  }
  def('__ozoneStats', () => ({
    triggers: ScrollTrigger.getAll().length,
    tweens: gsap.globalTimeline.getChildren(true, true, true).length,
    listeners: listenerCount(),
    audio: h.audio.snapshot(),
    playhead: h.tl ? h.tl.time() : null,
  }));
  def('__art', () => ({
    tier: h.tier, source: h.source, cuts: h.cuts, liteBehaviour: h.lite, staticMode: !h.tl, filters: h.filters ? 3 : 0, rig: h.rig, dpr: devicePixelRatio,
    regions: h.art.stats.regions, redBox: h.art.redBox, maskRect: h.art.maskRect, note: 'placeholder art; not a performance result',
  }));
}
