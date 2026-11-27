import { gsap, Observer } from './motion/registry';
import { motionTokens, prefersReducedMotion } from './motion/tokens';

export interface CarouselOptions {
  /** Self-running loop like the reference recording. Off by default: the carousel moves when you swipe. */
  autoplay?: boolean;
  autoplayDelay?: number;
}

export interface CarouselHandle {
  readonly index: number;
  readonly progress: number;
  readonly ready: boolean;
  goTo(index: number): void;
  next(): void;
  prev(): void;
  destroy(): void;
}

const SPACING = 0.62; // centre-to-centre distance between neighbours, in card widths
const Z_BIAS = 18; // lifts the card that is travelling toward the centre, so it slides OVER the current one

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const clamp01 = (v: number) => Math.min(1, Math.max(0, v));

/** Signed distance from the active position, wrapped so the strip loops: result in [-n/2, n/2). */
function wrapOffset(raw: number, n: number) {
  return ((((raw + n / 2) % n) + n) % n) - n / 2;
}

interface Pose { x: number; y: number; scale: number; rotY: number; rotZ: number; dim: number; alpha: number; z: number }

/** Pose of a card at a continuous offset `o` from the centre. Everything (drag, tweens, entry) goes through here. */
function poseAt(o: number, width: number, dir: number, reduced: boolean): Pose {
  const a = Math.abs(o);
  const s = Math.sign(o) || 0;
  const xUnits = a <= 1 ? SPACING * a : a <= 2 ? SPACING + 0.42 * (a - 1) : SPACING + 0.42 + 0.3 * (a - 2);
  const scale = reduced ? 1 - 0.06 * Math.min(a, 1) : a <= 1 ? 1 - 0.14 * a : 0.86 - 0.08 * Math.min(a - 1, 1.5);
  const towardCentre = s !== 0 && s === dir && a < 1.5;
  return {
    x: s * xUnits * width,
    y: 0,
    scale,
    rotY: reduced ? 0 : s * Math.min(a, 1) * 9,
    rotZ: 0,
    dim: Math.min(a, 1) * 0.5 + clamp01(a - 1) * 0.25,
    alpha: 1 - clamp01((a - 1.9) / 0.5),
    z: Math.round(100 - a * 20 + (towardCentre ? Z_BIAS : 0)),
  };
}

export function createCarousel(root: HTMLElement, options: CarouselOptions = {}): CarouselHandle {
  const stage = root.querySelector<HTMLElement>('[data-stage]')!;
  const cards = gsap.utils.toArray<HTMLElement>('[data-card]', root);
  const dims = cards.map((c) => c.querySelector<HTMLElement>('.dim')!);
  const imgs = cards.map((c) => c.querySelector<HTMLImageElement>('img')!);
  const titleEl = root.querySelector<HTMLElement>('[data-caption-title]')!;
  const tagEl = root.querySelector<HTMLElement>('[data-caption-tag]')!;
  const dotsEl = root.querySelector<HTMLElement>('[data-dots]')!;
  const n = cards.length;

  let reduced = prefersReducedMotion();
  let width = cards[0].offsetWidth;
  const state = { progress: 0 };
  let dir = 0; // +1 moving to next, -1 to previous
  let ready = false;
  let shownIndex = -1;
  let tween: gsap.core.Tween | null = null;
  const enter = cards.map(() => ({ e: 0 })); // 0 = stacked deck; the entry deals it out to 1
  const seeds = cards.map((_, i) => ((i * 37) % 11) - 5); // fixed little tilts for the stacked deck

  const idx = (p: number) => ((Math.round(p) % n) + n) % n;

  // --- accessibility scaffolding ---
  cards.forEach((card, i) => {
    card.setAttribute('role', 'group');
    card.setAttribute('aria-roledescription', 'slide');
    card.setAttribute('aria-label', `${i + 1} of ${n}`);
  });
  const dots = cards.map((_, i) => {
    const b = document.createElement('button');
    b.type = 'button';
    b.className = 'dot';
    b.setAttribute('aria-label', `Go to slide ${i + 1}`);
    b.addEventListener('click', () => goTo(i));
    dotsEl.appendChild(b);
    return b;
  });

  // --- rendering: one pass sets every card from state.progress ---
  const setters = cards.map((c) => ({
    x: gsap.quickSetter(c, 'x', 'px'),
    y: gsap.quickSetter(c, 'y', 'px'),
    scale: gsap.quickSetter(c, 'scale'),
    rotY: gsap.quickSetter(c, 'rotationY', 'deg'),
    rotZ: gsap.quickSetter(c, 'rotation', 'deg'),
  }));

  function render() {
    for (let i = 0; i < n; i++) {
      const o = wrapOffset(i - state.progress, n);
      const p = poseAt(o, width, dir, reduced);
      const e = enter[i].e;
      if (e < 1) {
        // Entry: blend from the stacked deck (centre, small, tilted, dark) to the fanned-out pose.
        p.x *= e;
        p.y = (1 - e) * 24;
        p.scale = lerp(0.62, p.scale, e);
        p.rotY *= e;
        p.rotZ = (1 - e) * seeds[i];
        p.dim = lerp(0.75, p.dim, e);
        p.z = Math.round(lerp(200 - Math.abs(o) * 5, p.z, e)); // front card stays on top while the deck deals out
      }
      const s = setters[i];
      s.x(p.x); s.y(p.y); s.scale(p.scale); s.rotY(p.rotY); s.rotZ(p.rotZ);
      cards[i].style.zIndex = String(p.z);
      cards[i].style.opacity = String(p.alpha);
      cards[i].style.visibility = p.alpha <= 0 ? 'hidden' : 'visible';
      dims[i].style.opacity = String(p.dim);
    }
    const active = idx(state.progress);
    if (active !== shownIndex) showIndex(active);
  }

  function showIndex(active: number) {
    const first = shownIndex === -1;
    shownIndex = active;
    cards.forEach((c, i) => c.setAttribute('aria-hidden', String(i !== active)));
    dots.forEach((d, i) => d.setAttribute('aria-current', String(i === active)));
    const title = cards[active].dataset.title ?? '';
    const tag = cards[active].dataset.tag ?? '';
    if (first || reduced) {
      titleEl.textContent = title;
      tagEl.textContent = tag;
      return;
    }
    // Caption swap: old text slides out the way the deck is moving, new text comes in behind it.
    const d = dir || 1;
    gsap.killTweensOf([titleEl, tagEl]);
    gsap.timeline()
      .to([titleEl, tagEl], { xPercent: -40 * d, autoAlpha: 0, duration: 0.16, ease: 'power2.in' })
      .add(() => { titleEl.textContent = title; tagEl.textContent = tag; })
      .fromTo([titleEl, tagEl], { xPercent: 40 * d }, { xPercent: 0, autoAlpha: 1, duration: 0.4, ease: 'expo.out', stagger: 0.04 });
  }

  // --- programmatic moves (buttons, keys, dots, release snap) ---
  function tweenTo(target: number) {
    tween?.kill();
    const dist = Math.abs(target - state.progress);
    if (dist < 0.0005) { state.progress = target; render(); return; }
    dir = Math.sign(target - state.progress);
    tween = gsap.to(state, {
      progress: target,
      duration: reduced ? motionTokens.dur.xs : Math.min(1.1, motionTokens.dur.m * (0.6 + 0.4 * Math.min(dist, 2))),
      ease: reduced ? 'power1.out' : motionTokens.ease.land,
      onUpdate: render,
      onComplete: () => { state.progress = target; tween = null; scheduleAutoplay(); },
    });
  }

  function goTo(i: number) {
    if (!ready) return;
    const current = Math.round(state.progress);
    const delta = wrapOffset(i - idx(current), n); // shortest way round the loop
    tweenTo(current + Math.round(delta));
  }
  const next = () => ready && tweenTo(Math.round(state.progress) + 1);
  const prev = () => ready && tweenTo(Math.round(state.progress) - 1);

  // --- swipe / drag: the deck follows the finger 1:1, then snaps ---
  let startProgress = 0;
  let dragged = false;
  const observer = Observer.create({
    target: stage,
    type: 'pointer,touch',
    dragMinimum: 3,
    lockAxis: true,
    preventDefault: false,
    onPress: () => {
      if (!ready) return;
      tween?.kill();
      tween = null;
      startProgress = state.progress;
      dragged = false;
      autoplayCall?.kill();
    },
    onDragStart: (self) => {
      if (!ready || self.axis === 'y') return;
      stage.classList.add('is-dragging');
    },
    onDrag: (self) => {
      if (!ready || self.axis === 'y') return;
      dragged = true;
      const dp = -self.deltaX / (width * SPACING);
      if (dp !== 0) dir = Math.sign(dp);
      state.progress += dp;
      // Never more than 2 slides away from where the drag started.
      state.progress = Math.max(startProgress - 2, Math.min(startProgress + 2, state.progress));
      render();
    },
    onRelease: (self) => {
      stage.classList.remove('is-dragging');
      if (!ready) return;
      if (!dragged) {
        // A tap on a side card brings it to the front.
        const hit = (self.event?.target as Element | null)?.closest<HTMLElement>('[data-card]');
        const i = hit ? cards.indexOf(hit) : -1;
        if (i >= 0 && i !== idx(state.progress)) goTo(i);
        else tweenTo(Math.round(state.progress));
        return;
      }
      const v = self.velocityX; // px/s, negative = finger moving left = next slide
      const moved = state.progress - startProgress;
      let target: number;
      if (Math.abs(v) > 300) {
        target = v < 0 ? Math.floor(state.progress) + 1 : Math.ceil(state.progress) - 1;
        if (Math.abs(v) > 2200) target += v < 0 ? 1 : -1; // a hard flick carries one more
      } else if (Math.abs(moved) > 0.15) {
        target = moved > 0 ? Math.ceil(state.progress) : Math.floor(state.progress);
      } else {
        target = Math.round(startProgress);
      }
      const base = Math.round(startProgress);
      target = Math.max(base - 2, Math.min(base + 2, target));
      tweenTo(target);
    },
  });
  observer.disable();

  // --- buttons and keyboard ---
  const prevBtn = root.querySelector<HTMLButtonElement>('[data-prev]');
  const nextBtn = root.querySelector<HTMLButtonElement>('[data-next]');
  prevBtn?.addEventListener('click', prev);
  nextBtn?.addEventListener('click', next);
  root.tabIndex = 0;
  const onKey = (e: KeyboardEvent) => {
    const t = e.target as HTMLElement | null;
    if (t && (t.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName))) return;
    if (e.key === 'ArrowRight') { e.preventDefault(); next(); }
    else if (e.key === 'ArrowLeft') { e.preventDefault(); prev(); }
  };
  document.addEventListener('keydown', onKey);

  // --- optional autoplay (off by default) ---
  let autoplayCall: gsap.core.Tween | null = null;
  let hovering = false;
  function scheduleAutoplay() {
    autoplayCall?.kill();
    if (!options.autoplay || reduced || hovering || document.hidden) return;
    autoplayCall = gsap.delayedCall(options.autoplayDelay ?? 1.6, next);
  }
  root.addEventListener('pointerenter', () => { hovering = true; autoplayCall?.kill(); });
  root.addEventListener('pointerleave', () => { hovering = false; scheduleAutoplay(); });
  const onVisibility = () => (document.hidden ? autoplayCall?.kill() : scheduleAutoplay());
  document.addEventListener('visibilitychange', onVisibility);

  // --- resize + reduced-motion changes ---
  const ro = new ResizeObserver(() => { width = cards[0].offsetWidth; render(); });
  ro.observe(stage);
  const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
  const onMq = () => { reduced = mq.matches; render(); };
  mq.addEventListener('change', onMq);

  // --- entry: the deck lands stacked, then deals out to both sides ---
  function finishEntry() {
    ready = true;
    observer.enable();
    document.documentElement.classList.add('motion-ready');
    scheduleAutoplay();
  }

  function playEntry() {
    const header = gsap.utils.toArray<HTMLElement>('.masthead .word > span');
    const after = ['.caption', '.controls', '.hint'];
    if (reduced) {
      enter.forEach((o) => (o.e = 1));
      render();
      gsap.set(header, { visibility: 'visible' });
      gsap.fromTo([stage, ...after], { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.3, ease: 'power1.out', onComplete: finishEntry });
      return;
    }
    // Deal order: outermost cards fan out first, the front card rises last and on top.
    const order = cards
      .map((_, i) => i)
      .sort((a, b) => Math.abs(wrapOffset(b - state.progress, n)) - Math.abs(wrapOffset(a - state.progress, n)));
    enter.forEach((o) => (o.e = 0));
    render();
    const front = idx(state.progress);

    gsap.timeline({ onComplete: finishEntry })
      .set(header, { visibility: 'visible' })
      .fromTo(header, { yPercent: 115 }, { yPercent: 0, duration: 0.9, ease: 'expo.out', stagger: motionTokens.stagger.words }, 0)
      .fromTo(stage, { autoAlpha: 0, y: 70 }, { autoAlpha: 1, y: 0, duration: 0.8, ease: 'expo.out' }, 0.05)
      .to(order.map((i) => enter[i]), { e: 1, duration: 1.15, ease: motionTokens.ease.land, stagger: motionTokens.stagger.cards, onUpdate: render }, 0.45)
      .fromTo(imgs[front], { scale: 1.2 }, { scale: 1, duration: 1.6, ease: 'expo.out' }, 0.45)
      .fromTo(after, { autoAlpha: 0, y: 18 }, { autoAlpha: 1, y: 0, duration: 0.7, ease: 'expo.out', stagger: 0.08 }, 1.05);
  }

  // Start once fonts and the first images are ready (with a cap so a slow network never blocks it).
  render();
  const loaded = Promise.all([
    document.fonts?.ready ?? Promise.resolve(),
    ...imgs.slice(0, 3).map((im) => im.decode().catch(() => undefined)),
  ]);
  Promise.race([loaded, new Promise((r) => setTimeout(r, 1500))]).then(() => {
    width = cards[0].offsetWidth;
    playEntry();
  });

  return {
    get index() { return idx(state.progress); },
    get progress() { return state.progress; },
    get ready() { return ready; },
    goTo, next: () => { next(); }, prev: () => { prev(); },
    destroy() {
      observer.kill();
      tween?.kill();
      autoplayCall?.kill();
      ro.disconnect();
      mq.removeEventListener('change', onMq);
      document.removeEventListener('keydown', onKey);
      document.removeEventListener('visibilitychange', onVisibility);
    },
  };
}
