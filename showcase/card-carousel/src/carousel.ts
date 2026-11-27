import { gsap, Observer } from './motion/registry';
import { motionTokens, prefersReducedMotion } from './motion/tokens';
import type { CardPose, CardStage } from './stage/cardStage';

export interface CarouselOptions {
  /** Self-running loop, as in the reference recording. On by default. */
  autoplay?: boolean;
  /** Resolves to the WebGL stage (or null to stay on DOM rendering). The entry waits for it, capped. */
  stage?: Promise<CardStage | null>;
}

export interface CarouselHandle {
  readonly index: number;
  readonly progress: number;
  readonly ready: boolean;
  readonly playing: boolean;
  /** 'webgl' once the canvas renderer has taken over, else 'dom'. */
  readonly renderer: 'webgl' | 'dom';
  /** Current pose of every card (CSS px / degrees), whichever renderer draws it. */
  poses(): CardPose[];
  goTo(index: number): void;
  next(): void;
  prev(): void;
  pause(): void;
  play(): void;
  destroy(): void;
}

/*
 * Geometry measured from the reference recording (iPhone, 1170 px wide; front card 824 px wide).
 * Every card's pose comes from its continuous offset `o` from the front slot (o = i - progress):
 *   x      = ±0.71·W·|o|^0.82          neighbours' centres land exactly on the screen edges
 *   scale  = 1 − 0.07·|o|^2.3          stays ~1 near the centre, 0.93 at the neighbour slot
 *   haze   = 0.2·|o|^2.3               side cards: side ≈ 0.8·front + 40 (light grey veil), tone-mapped
 *   blur   = |o|^2.3 × 0.55% of W      side cards are softly blurred
 *   rotY   = ∓4.7°·o (perspective 2.84·W)  outer edges come slightly toward you
 *   z      = nearest to the centre on top (the swap happens half-way through a move)
 */
const SPACING = 0.71;
const PATH_EXP = 0.82;
const SCALE_DROP = 0.07;
const SHAPE_EXP = 2.3;
const HAZE = 0.2;
const ROT_DEG = 4.7;
const PERSPECTIVE = 2.84;

const xOf = (o: number, w: number) => Math.sign(o) * SPACING * w * Math.abs(o) ** PATH_EXP;
const oOfX = (x: number, w: number) => Math.sign(x) * (Math.abs(x) / (SPACING * w)) ** (1 / PATH_EXP);

/** Signed distance from the front slot, wrapped so the strip loops: result in [-n/2, n/2). */
function wrapOffset(raw: number, n: number) {
  return ((((raw + n / 2) % n) + n) % n) - n / 2;
}

export function createCarousel(root: HTMLElement, options: CarouselOptions = {}): CarouselHandle {
  const stage = root.querySelector<HTMLElement>('[data-stage]')!;
  const cards = gsap.utils.toArray<HTMLElement>('[data-card]', root);
  const hazes = cards.map((c) => c.querySelector<HTMLElement>('.haze')!);
  const imgs = cards.map((c) => c.querySelector<HTMLImageElement>('img')!);
  // Blurred twin of each image (side cards are measured as softly blurred); only its opacity animates.
  const softs = imgs.map((im) => {
    const s = im.cloneNode() as HTMLImageElement;
    s.className = 'soft';
    s.alt = '';
    s.setAttribute('aria-hidden', 'true');
    im.after(s);
    return s;
  });
  const pauseBtn = root.querySelector<HTMLButtonElement>('[data-pause]');
  const n = cards.length;

  let reduced = prefersReducedMotion();
  let width = cards[0].offsetWidth;
  const state = { progress: 0 };
  let target = 0; // where the strip is heading
  let ready = false;
  let playing = options.autoplay !== false;
  let tween: gsap.core.Tween | null = null;
  let autoplayCall: gsap.core.Tween | null = null;
  const lastZ = cards.map(() => -1);
  const lastVis = cards.map(() => '');

  const idx = (p: number) => ((Math.round(p) % n) + n) % n;

  cards.forEach((card, i) => {
    card.setAttribute('role', 'group');
    card.setAttribute('aria-roledescription', 'slide');
    card.setAttribute('aria-label', `${i + 1} of ${n}`);
  });

  // --- rendering: one pass places every card from state.progress ---
  const setters = cards.map((c) => ({
    x: gsap.quickSetter(c, 'x', 'px'),
    // 'scale' is a shorthand that quickSetter does not apply; set both axes explicitly.
    sx: gsap.quickSetter(c, 'scaleX'),
    sy: gsap.quickSetter(c, 'scaleY'),
    rotY: gsap.quickSetter(c, 'rotationY', 'deg'),
  }));
  let shownIndex = -1;
  let gl: CardStage | null = null; // WebGL renderer, once loaded
  const zooms = cards.map(() => ({ z: 1 })); // image zoom inside each card (entry only)
  const poses: CardPose[] = cards.map(() => ({ x: 0, scale: 1, rotY: 0, haze: 0, blur: 0, z: 0, visible: true, zoom: 1 }));

  /** The measured pose of a card at offset o. Both renderers draw exactly this. */
  function computePoses() {
    for (let i = 0; i < n; i++) {
      const o = wrapOffset(i - state.progress, n);
      const a = Math.abs(o);
      const shape = Math.min(a, 1.6) ** SHAPE_EXP;
      const p = poses[i];
      p.x = xOf(o, width);
      p.scale = 1 - SCALE_DROP * shape;
      p.rotY = -Math.sign(o) * ROT_DEG * Math.min(a, 1.5);
      p.haze = Math.min(1, shape) * HAZE;
      p.blur = Math.min(1, shape); // 0 = sharp, 1 = the measured side-card blur
      p.z = 0; // set below as a rank, so the order only changes at the half-way swap (once per move)
      p.visible = a <= 1.9; // past the screen edge: skip painting
      p.zoom = zooms[i].z;
    }
    // Paint order: nearest to the centre on top. A rank changes once per move; a raw distance would
    // change every frame and make the browser re-sort layers constantly.
    const order = poses.map((_, i) => i).sort((a, b) => Math.abs(poses[a].x) - Math.abs(poses[b].x));
    order.forEach((i, r) => { poses[i].z = 100 - r; });
  }

  function render() {
    computePoses();
    if (gl) {
      gl.update(poses, width, width * PERSPECTIVE);
    } else {
      for (let i = 0; i < n; i++) {
        const p = poses[i];
        const s = setters[i];
        s.x(p.x); s.sx(p.scale); s.sy(p.scale); s.rotY(p.rotY);
        hazes[i].style.opacity = String(p.haze);
        softs[i].style.opacity = String(p.blur);
        if (p.z !== lastZ[i]) { cards[i].style.zIndex = String(p.z); lastZ[i] = p.z; }
        const vis = p.visible ? 'visible' : 'hidden';
        if (vis !== lastVis[i]) { cards[i].style.visibility = vis; lastVis[i] = vis; }
        if (zooms[i].z !== 1 || imgs[i].style.transform) imgs[i].style.transform = zooms[i].z === 1 ? '' : `scale(${zooms[i].z})`;
      }
    }
    const active = idx(state.progress);
    if (active !== shownIndex) {
      shownIndex = active;
      cards.forEach((c, i) => c.setAttribute('aria-hidden', String(i !== active)));
    }
  }

  // --- moves ---
  function stop() {
    tween?.kill();
    tween = null;
    autoplayCall?.kill();
    autoplayCall = null;
  }

  function moveTo(t: number, kind: 'step' | 'release' = 'step', onDone?: () => void) {
    tween?.kill();
    tween = null;
    target = t;
    if (Math.abs(t - state.progress) < 0.0005) { state.progress = t; render(); onDone?.(); return; }
    const dist = Math.abs(t - state.progress);
    const duration = reduced
      ? motionTokens.dur.xs
      : kind === 'release'
        ? motionTokens.dur.release * Math.min(1.4, 0.6 + 0.5 * dist)
        : motionTokens.dur.move * (dist > 1 ? 1 + 0.25 * (dist - 1) : 1);
    tween = gsap.to(state, {
      progress: t,
      duration,
      ease: reduced ? 'power1.out' : kind === 'release' ? motionTokens.ease.release : motionTokens.ease.strip,
      onUpdate: render,
      onComplete: () => { tween = null; onDone?.(); },
    });
  }

  // Autoplay exactly like the recording: a new 0.731 s move starts every 0.834 s, forever.
  // The next step is timed from the START of the current one, so the rhythm never drifts.
  const PERIOD = motionTokens.dur.move + motionTokens.dur.hold;
  let nextAt = 0; // ticker time the next step is due; steps are planned on an absolute grid (no per-frame drift)
  function autoplayStep() {
    moveTo(Math.round(target) + 1);
    nextAt += PERIOD;
    autoplayCall = gsap.delayedCall(Math.max(0, nextAt - gsap.ticker.time), autoplayStep);
  }
  function scheduleAutoplay(delay: number = motionTokens.dur.hold) {
    autoplayCall?.kill();
    autoplayCall = null;
    if (!ready || !playing || reduced || pressed || document.hidden) return;
    nextAt = gsap.ticker.time + delay;
    autoplayCall = gsap.delayedCall(delay, autoplayStep);
  }
  const RESUME_AFTER_INPUT = 2.2; // seconds of calm after the user moves it, then the loop carries on

  // Steps count from where the strip is HEADING, so quick repeated inputs all count.
  function goTo(i: number) {
    if (!ready) return;
    stop();
    const b = Math.round(target);
    moveTo(b + Math.round(wrapOffset(i - idx(b), n)), 'step', () => scheduleAutoplay(RESUME_AFTER_INPUT));
  }
  const next = () => { if (ready) stop(), moveTo(Math.round(target) + 1, 'step', () => scheduleAutoplay(RESUME_AFTER_INPUT)); };
  const prev = () => { if (ready) stop(), moveTo(Math.round(target) - 1, 'step', () => scheduleAutoplay(RESUME_AFTER_INPUT)); };

  /** Topmost card under a viewport x coordinate, from the poses (works for both renderers). */
  function hitTest(clientX: number) {
    const r = stage.getBoundingClientRect();
    const x = clientX - (r.left + r.width / 2);
    let best = -1;
    computePoses();
    poses.forEach((p, i) => {
      if (p.visible && Math.abs(x - p.x) <= (width * p.scale) / 2 && (best < 0 || p.z > poses[best].z)) best = i;
    });
    return best;
  }

  // --- swipe / drag: the card under your finger stays glued to it, then glides into the slot ---
  let pressed = false; // Observer reports releases anywhere on the page; only handle presses that began on the strip
  let dragging = false;
  let startP = 0;
  let base = 0;
  let baseX = 0;
  let dx = 0;
  const pointer = Observer.create({
    target: stage,
    type: 'pointer,touch',
    dragMinimum: 3,
    lockAxis: true,
    preventDefault: false,
    onPress: () => {
      if (!ready) return;
      pressed = true;
      stop();
      startP = state.progress;
      base = Math.round(startP);
      baseX = xOf(base - startP, width); // where the nearest card sits right now
      dx = 0;
    },
    onDragStart: (self) => {
      if (!pressed || self.axis === 'y') return;
      dragging = true;
      stage.classList.add('is-dragging');
    },
    onDrag: (self) => {
      if (!pressed || !dragging || self.axis === 'y') return;
      dx += self.deltaX;
      const p = base - oOfX(baseX + dx, width);
      state.progress = Math.max(startP - 2, Math.min(startP + 2, p));
      render();
    },
    onRelease: (self) => {
      if (!pressed) return;
      pressed = false;
      stage.classList.remove('is-dragging');
      const wasDragging = dragging;
      dragging = false;
      if (!wasDragging) {
        // A tap on a side card brings it to the front.
        const i = hitTest(self.x ?? 0);
        if (i >= 0 && i !== idx(state.progress)) goTo(i);
        else moveTo(Math.round(state.progress), 'release', () => scheduleAutoplay(RESUME_AFTER_INPUT));
        return;
      }
      const v = self.velocityX; // px/s; negative = finger moving left = next card
      const moved = state.progress - startP;
      let snap: number;
      if (Math.abs(v) > 300) {
        snap = v < 0 ? Math.floor(state.progress) + 1 : Math.ceil(state.progress) - 1;
        if (Math.abs(v) > 2400) snap += v < 0 ? 1 : -1; // a hard flick carries one more card
      } else if (Math.abs(moved) > 0.15) {
        snap = moved > 0 ? Math.ceil(state.progress) : Math.floor(state.progress);
      } else {
        snap = Math.round(startP);
      }
      snap = Math.max(base - 2, Math.min(base + 2, snap));
      moveTo(snap, 'release', () => scheduleAutoplay(RESUME_AFTER_INPUT));
    },
  });

  // --- trackpad / mouse wheel: one sideways gesture = one card ---
  let wheelLock = false;
  const wheel = Observer.create({
    target: stage,
    type: 'wheel',
    preventDefault: true,
    onWheel: (self) => {
      if (!ready || wheelLock) return;
      const d = Math.abs(self.deltaX) > Math.abs(self.deltaY) ? self.deltaX : self.deltaY;
      if (Math.abs(d) < 4) return;
      wheelLock = true;
      gsap.delayedCall(motionTokens.dur.move * 0.8, () => { wheelLock = false; });
      if (d > 0) next(); else prev();
    },
  });
  pointer.disable();
  wheel.disable();

  // --- keyboard + pause control ---
  root.tabIndex = 0;
  const onKey = (e: KeyboardEvent) => {
    const t = e.target as HTMLElement | null;
    if (t && (t.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName))) return;
    if (e.key === 'ArrowRight') { e.preventDefault(); next(); }
    else if (e.key === 'ArrowLeft') { e.preventDefault(); prev(); }
  };
  document.addEventListener('keydown', onKey);
  function setPlaying(on: boolean) {
    playing = on;
    if (pauseBtn) {
      pauseBtn.setAttribute('aria-pressed', String(!on));
      pauseBtn.textContent = on ? 'Pause carousel' : 'Play carousel';
    }
    if (on) { if (!tween) scheduleAutoplay(); }
    else { autoplayCall?.kill(); autoplayCall = null; }
  }
  pauseBtn?.addEventListener('click', () => setPlaying(!playing));
  const onVisibility = () => {
    if (document.hidden) { autoplayCall?.kill(); autoplayCall = null; }
    else if (!tween) scheduleAutoplay();
  };
  document.addEventListener('visibilitychange', onVisibility);

  // --- resize + reduced-motion changes ---
  const applySize = () => {
    width = cards[0].offsetWidth;
    stage.style.perspective = `${Math.round(width * PERSPECTIVE)}px`;
    render();
  };
  const ro = new ResizeObserver(applySize);
  ro.observe(stage);
  const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
  const onMq = () => {
    reduced = mq.matches;
    if (reduced) { autoplayCall?.kill(); autoplayCall = null; } else if (!tween) scheduleAutoplay();
    render();
  };
  mq.addEventListener('change', onMq);

  // --- entry: the strip sweeps in with the same measured ease and lands on card 1 ---
  function finishEntry() {
    ready = true;
    pointer.enable();
    wheel.enable();
    document.documentElement.classList.add('motion-ready');
    scheduleAutoplay(0.9);
  }

  function playEntry() {
    const header = gsap.utils.toArray<HTMLElement>('.masthead .word > span');
    if (reduced) {
      state.progress = 0;
      render();
      gsap.set(header, { visibility: 'visible' });
      gsap.fromTo([stage, '.caption'], { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.3, ease: 'power1.out', onComplete: finishEntry });
      return;
    }
    state.progress = -2; // two cards before the first: they sweep past and card 1 lands in front
    render();
    gsap.timeline({ onComplete: finishEntry })
      .set(header, { visibility: 'visible' })
      .fromTo(header, { yPercent: 110 }, { yPercent: 0, duration: 0.9, ease: motionTokens.ease.reveal, stagger: motionTokens.stagger.words }, 0)
      .fromTo(stage, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.5, ease: 'power1.out' }, 0.1)
      .to(state, { progress: 0, duration: 1.5, ease: motionTokens.ease.strip, onUpdate: render }, 0.1)
      .fromTo(zooms[0], { z: 1.12 }, { z: 1, duration: 1.4, ease: 'power2.out', onUpdate: render }, 0.5)
      .fromTo('.caption', { autoAlpha: 0, y: 14 }, { autoAlpha: 1, y: 0, duration: 0.7, ease: motionTokens.ease.reveal }, 1.0);
  }

  // Start once fonts and the first images are ready (capped so a slow network never blocks it).
  applySize();
  const loaded = Promise.all([
    document.fonts?.ready ?? Promise.resolve(),
    ...imgs.slice(0, 3).map((im) => im.decode().catch(() => undefined)),
  ]);
  // Hand drawing over to WebGL when it is ready; the DOM cards stay as the fallback and for screen readers.
  const stageReady = (options.stage ?? Promise.resolve(null)).then((s) => {
    if (!s) return;
    gl = s;
    root.classList.add('is-webgl');
    render();
  }).catch(() => undefined);
  Promise.race([Promise.all([loaded, stageReady]), new Promise((r) => setTimeout(r, 2500))]).then(() => {
    applySize();
    playEntry();
  });

  return {
    get index() { return idx(state.progress); },
    get progress() { return state.progress; },
    get ready() { return ready; },
    get playing() { return playing; },
    get renderer() { return gl ? 'webgl' : 'dom'; },
    poses: () => { computePoses(); return poses.map((p) => ({ ...p })); },
    goTo, next, prev,
    pause: () => setPlaying(false),
    play: () => setPlaying(true),
    destroy() {
      gl?.dispose();
      pointer.kill();
      wheel.kill();
      stop();
      ro.disconnect();
      mq.removeEventListener('change', onMq);
      document.removeEventListener('keydown', onKey);
      document.removeEventListener('visibilitychange', onVisibility);
    },
  };
}
