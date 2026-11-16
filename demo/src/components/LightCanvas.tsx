/**
 * React wrapper for src/webgl/lightRenderer.ts.
 * - Defers GL setup to idle time after first paint (the poster/H1 are the LCP elements; the raw WebGL2 module is ~5 KB so it's not code-split).
 * - Drives render() from gsap.ticker (single loop), only while the canvas is on screen and the tab is visible.
 * - Destroys the GL context on unmount (route change) — verified by tests via window.__lightRenderers.
 */
import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';
import { gsap } from '../motion/registry';
import { createLightRenderer, supportsWebGL2, type LightState } from '../webgl/lightRenderer';

export type LightHandle = { set: (s: Partial<LightState>) => void; ready: boolean };

type Props = {
  initial: Partial<LightState>; label: string; className?: string; onReady?: (ok: boolean) => void;
  /** Create the GL context only when the canvas comes within ~1 viewport of the screen. Below-the-fold canvases
   *  should be lazy: creating two contexts at route mount cost 245–808 ms on software GL (webgl-specialist 1b). */
  lazy?: boolean;
};

const live = () => ((window as unknown as { __lightRenderers?: number }).__lightRenderers ??= 0);
const bump = (d: number) => { (window as unknown as { __lightRenderers: number }).__lightRenderers = live() + d; };

export const LightCanvas = forwardRef<LightHandle, Props>(function LightCanvas({ initial, label, className, onReady, lazy }, ref) {
  const canvas = useRef<HTMLCanvasElement>(null);
  const renderer = useRef<ReturnType<typeof createLightRenderer>>(null);
  const pending = useRef<Partial<LightState>>({ ...initial });
  const [ready, setReady] = useState(false);

  useImperativeHandle(ref, () => ({
    set: (s) => { Object.assign(pending.current, s); renderer.current?.set(s); },
    ready,
  }), [ready]);

  useEffect(() => {
    let disposed = false;
    let visible = true;
    let onScreen = false;
    let io: IntersectionObserver | undefined;
    let ro: ResizeObserver | undefined;
    let wasLost = false;
    const tick = () => {
      const r = renderer.current;
      if (!r) return;
      // unrestored context loss → show the poster again (canvas fades out via data-ready)
      if (r.lost !== wasLost) { wasLost = r.lost; setReady(!r.lost); }
      if (visible && onScreen && !r.lost) r.render();
    };
    const onVis = () => { visible = document.visibilityState === 'visible'; };

    // Defer GL setup until after first paint so the poster/H1 (LCP) is never blocked by shader compile.
    const idle = (cb: () => void) => ('requestIdleCallback' in window ? requestIdleCallback(cb, { timeout: 600 }) : setTimeout(cb, 1));
    let nearIo: IntersectionObserver | undefined;
    const create = () => {
      if (disposed || !canvas.current) return;
      const mobile = matchMedia('(max-width: 47.99rem)').matches;
      const r = createLightRenderer(canvas.current, { maxDpr: mobile ? 1 : 1.5 });
      if (!r) { onReady?.(false); return; }
      renderer.current = r;
      bump(1);
      r.set(pending.current);
      io = new IntersectionObserver(([e]) => { onScreen = e.isIntersecting; if (onScreen) r.set({}); }, { rootMargin: '10% 0px' });
      io.observe(canvas.current);
      ro = new ResizeObserver(() => r.resize());
      ro.observe(canvas.current);
      gsap.ticker.add(tick);
      document.addEventListener('visibilitychange', onVis);
      setReady(true);
      onReady?.(true);
    };
    // the support check is cheap (no context) → fallbacks activate immediately, even for lazy canvases
    if (!supportsWebGL2()) { onReady?.(false); }
    else if (lazy && canvas.current) {
      nearIo = new IntersectionObserver(([e]) => {
        if (!e.isIntersecting) return;
        nearIo?.disconnect();
        idle(create);
      }, { rootMargin: '100% 0px' });
      nearIo.observe(canvas.current);
    } else idle(create);

    return () => {
      disposed = true;
      gsap.ticker.remove(tick);
      document.removeEventListener('visibilitychange', onVis);
      nearIo?.disconnect();
      io?.disconnect();
      ro?.disconnect();
      if (renderer.current) { renderer.current.destroy(); renderer.current = null; bump(-1); }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <canvas ref={canvas} className={className} data-ready={ready} role="img" aria-label={label} />;
});
