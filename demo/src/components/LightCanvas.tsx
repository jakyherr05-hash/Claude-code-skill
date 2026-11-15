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

type Props = { initial: Partial<LightState>; label: string; className?: string; onReady?: (ok: boolean) => void };

const live = () => ((window as unknown as { __lightRenderers?: number }).__lightRenderers ??= 0);
const bump = (d: number) => { (window as unknown as { __lightRenderers: number }).__lightRenderers = live() + d; };

export const LightCanvas = forwardRef<LightHandle, Props>(function LightCanvas({ initial, label, className, onReady }, ref) {
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
    const tick = () => { if (visible && onScreen) renderer.current?.render(); };
    const onVis = () => { visible = document.visibilityState === 'visible'; };

    // Defer GL setup until after first paint so the poster/H1 (LCP) is never blocked by shader compile.
    const idle = (cb: () => void) => ('requestIdleCallback' in window ? requestIdleCallback(cb, { timeout: 600 }) : setTimeout(cb, 1));
    idle(() => {
      if (disposed || !canvas.current) return;
      if (!supportsWebGL2()) { onReady?.(false); return; }
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
    });

    return () => {
      disposed = true;
      gsap.ticker.remove(tick);
      document.removeEventListener('visibilitychange', onVis);
      io?.disconnect();
      ro?.disconnect();
      if (renderer.current) { renderer.current.destroy(); renderer.current = null; bump(-1); }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <canvas ref={canvas} className={className} data-ready={ready} role="img" aria-label={label} />;
});
