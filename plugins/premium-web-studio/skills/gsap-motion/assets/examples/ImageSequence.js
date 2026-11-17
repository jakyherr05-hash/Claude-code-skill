// Recipe 15 · Scroll-scrubbed image sequence (canvas). Plain JS so it runs anywhere; wrap in useGSAP in React.
// frames: array of URLs (pre-encoded AVIF/WebP, same aspect). Returns a cleanup function.
function imageSequence({ section, canvas, frames, poster, step = 1, scrollLength = '+=250%' }) {
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const ctx = canvas.getContext('2d');
  const urls = frames.filter((_, i) => i % step === 0);           // mobile: step 2 halves decode + bytes
  const imgs = new Array(urls.length);
  const state = { frame: 0 };
  let drawn = -1;
  let alive = true;                                                  // cleanup stops the preload loop too
  const ok = (im) => im && im.complete && im.naturalWidth > 0;       // a 404/corrupt frame is never drawn
  const size = () => {                                               // cover-fit, DPR capped at 2
    const dpr = Math.min(devicePixelRatio || 1, 2);
    canvas.width = Math.round(canvas.clientWidth * dpr); canvas.height = Math.round(canvas.clientHeight * dpr);
    drawn = -1; draw();
  };
  const nearestLoaded = (i) => { for (let d = 0; d < urls.length; d++) { if (ok(imgs[i - d])) return i - d; if (ok(imgs[i + d])) return i + d; } return -1; };
  function draw() {
    const i = nearestLoaded(Math.round(state.frame));                // never blank: show the nearest decoded frame
    if (i < 0 || i === drawn) return;
    const img = imgs[i], s = Math.max(canvas.width / img.naturalWidth, canvas.height / img.naturalHeight);
    const w = img.naturalWidth * s, h = img.naturalHeight * s;
    ctx.drawImage(img, (canvas.width - w) / 2, (canvas.height - h) / 2, w, h);
    drawn = i; canvas.dataset.frame = String(i);
  }
  const load = (i) => new Promise((res) => { const im = new Image(); im.decoding = 'async'; im.onload = () => { if (alive) { imgs[i] = im; draw(); } res(); }; im.onerror = () => res(); im.src = urls[i]; });

  if (reduce) {                                                      // no pin, no scrub: one meaningful still
    const im = new Image(); im.onload = () => { if (alive) { imgs[0] = im; size(); } }; im.src = poster || urls[urls.length - 1];
    addEventListener('resize', size);
    return () => { alive = false; removeEventListener('resize', size); };
  }
  // first frame eager, then keyframes (every 8th) so a fast scroll still shows motion, then the rest
  const order = [0, ...urls.map((_, i) => i).filter((i) => i && i % 8 === 0), ...urls.map((_, i) => i).filter((i) => i % 8)];
  load(0).then(async () => { if (!alive) return; size(); for (const i of order.slice(1)) { if (!alive) return; await load(i); } canvas.dataset.loaded = 'true'; });
  const tween = gsap.to(state, {
    frame: urls.length - 1, ease: 'none', snap: 'frame',
    scrollTrigger: { trigger: section, start: 'top top', end: scrollLength, pin: true, scrub: 0.5, invalidateOnRefresh: true },
    onUpdate: draw,
  });
  addEventListener('resize', size);
  return () => { alive = false; tween.scrollTrigger?.kill(); tween.kill(); removeEventListener('resize', size); };
}
