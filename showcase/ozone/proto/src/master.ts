// One paused master timeline per rig, one ScrollTrigger, spans s4 -> t45 -> s5 -> t56 -> s6 -> t67 -> s7.
// Before s4 (t12..t34) the prototype has no art: the master sits at the s4 hold state (initial state).
// Unit = 1vh (1svh at rig S). Every position is label + pct * span (ANIMATION §2 and §5).
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { LABELS, LABEL_NAMES, params, isCoarse, type LabelName, type Rig } from './config';
import { DRIFT, ease } from './tokens';
import type { Art, PageArt } from './art';
import type { World } from './world';
import type { Standin } from './audio/standin';

interface Ctx { art: Art; page: PageArt; world: World; rig: Rig; audio: Standin; lite: boolean; cuts: number[] }

const INK_START = 'polygon(0% 0%, 0% 0%, -30% 100%, 0% 100%)';
const INK_END = 'polygon(0% 0%, 130% 0%, 100% 100%, 0% 100%)';
const $ = (s: string) => document.querySelector<HTMLElement>(s)!;

/** scale(t) crosses `thr` going from `from` to `to` with the named ease: progress in 0..1 or null */
function crossing(from: number, to: number, thr: number, easeName: string): number | null {
  if ((from - thr) * (to - thr) >= 0) return null;
  const f = gsap.parseEase(easeName);
  let lo = 0, hi = 1;
  for (let i = 0; i < 40; i++) {
    const mid = (lo + hi) / 2;
    const v = from + (to - from) * f(mid);
    if ((v - thr) * (from - thr) > 0) lo = mid; else hi = mid;
  }
  return (lo + hi) / 2;
}

export function buildMaster(cx: Ctx) {
  const { art, page, world, rig, audio, lite, cuts } = cx;
  const L = LABELS[rig];
  const W = art.W, H = art.H;
  const has = (n: number) => cuts.includes(n);
  const tl = gsap.timeline({ paused: true, defaults: { ease: 'none' } });
  for (const n of LABEL_NAMES) tl.addLabel(n, L[n]);
  tl.set({}, {}, L.end); // master duration == --budget in units
  const sp = (a: LabelName, b: LabelName) => L[b] - L[a];
  const t45 = (p: number) => L.t45 + p * sp('t45', 's5');
  const t56 = (p: number) => L.t56 + p * sp('t56', 's6');
  const t67 = (p: number) => L.t67 + p * sp('t67', 'end');
  const S45 = sp('t45', 's5'), S56 = sp('t56', 's6'), S67 = sp('t67', 'end');
  const holdPct = (a: LabelName, b: LabelName, p: number) => L[a] + p * sp(a, b);

  // ---------------------------------------------------------------- camera ---------------------------------------
  const camAt = (s: number, cxw: number, cyw: number, dx = 0) => ({ x: -s * cxw + dx, y: -s * cyw, scale: s });
  const f4 = art.frames.f4, f5 = art.frames.f5, f6 = art.frames.f6;
  const H4 = camAt(f4.s, f4.cx, f4.cy), H4e = camAt(f4.s * (1 + DRIFT.scale), f4.cx, f4.cy, DRIFT.x * W);
  const H5 = camAt(f5.s, f5.cx, f5.cy), H5e = camAt(f5.s * (1 + DRIFT.scale), f5.cx, f5.cy, DRIFT.x * W);
  const H6 = camAt(f6.s, f6.cx, f6.cy), H6e = camAt(f6.s * (1 + DRIFT.scale), f6.cx, f6.cy, DRIFT.x * W);
  const A56 = camAt(1.0, f6.cx, f6.cy);
  // t67: pull out to 1.0, then shrink the street framing into the panel-7 geometry
  const p7 = page.p7;
  const sEnd = Math.max(p7.w / W, p7.h / H);
  const P7c = { x: p7.x + p7.w / 2, y: p7.y + p7.h / 2 };
  const Hend = { x: P7c.x - sEnd * f6.cx, y: P7c.y - sEnd * f6.cy, scale: sEnd };

  // The camera is one proxy {x, y, scale}, tweened by GSAP (cam ease, per leg) and written once per update to every
  // camera element: the `transform` attribute of the camera <g> (default) or the wrapper <div> transform (cut-line 6).
  // (GSAP's own svgOrigin handling put the camera <g> at a wrong offset in this viewBox, so it is not used here.)
  const cam = { ...H4 };
  const applyCam = () => {
    if (world.mode === 'svg') {
      const m = `matrix(${cam.scale} 0 0 ${cam.scale} ${cam.x} ${cam.y})`;
      for (const e of world.camEls) e.setAttribute('transform', m);
    } else {
      const m = `translate3d(${cam.x}px,${cam.y}px,0) scale(${cam.scale})`;
      for (const e of world.camEls) (e as HTMLElement).style.transform = m;
    }
  };
  applyCam();
  const camTween = (from: object, to: object, dur: number, easeName: string, at: number) =>
    tl.fromTo(cam, from, { ...to, duration: dur, ease: easeName, immediateRender: false, onUpdate: applyCam }, at);

  camTween(H4, H4e, L.t45 - L.s4, 'none', L.s4);                 // s4 hold drift
  camTween(H4e, H5, 0.65 * S45, ease.cam, t45(0.35));            // t45: 0-35 % locked, 35-100 % pull-back and crane
  camTween(H5, H5e, L.t56 - L.s5, 'none', L.s5);                 // s5 drift
  camTween(H5e, A56, 0.4 * S56, ease.cam, t56(0));               // t56 leg A: crane down and right to street level
  camTween(A56, H6, 0.3 * S56, ease.cam, t56(0.4));              // t56 leg B: push through the glass
  camTween(H6, H6e, L.t67 - L.s6, 'none', L.s6);                 // s6 drift
  camTween(H6e, A56, 0.4 * S67, ease.cam, t67(0));               // t67: pull out onto the street
  camTween(A56, Hend, 0.4 * S67, ease.cam, t67(0.4));            // t67: shrink to panel-7 geometry (camera becomes the clip)

  // parallax planes (data-depth): offset (1-d)*(c - c_authored), same window and ease as the camera move
  const par = (id: string, d: number, from: number, to: number, dur: number, at: number) => {
    if (lite && d < 0.5) return; // lite tier freezes far planes
    const p = world.planeEl(id);
    gsap.set(p, { x: from });
    tl.fromTo(p, { x: from }, { x: to, duration: dur, ease: ease.cam, immediateRender: false }, at);
  };
  par('s5-far', 0.3, -(1 - 0.3) * f5.cx, 0, 0.65 * S45, t45(0.35));
  par('s5-near', 1.6, -(1 - 1.6) * f5.cx, 0, 0.65 * S45, t45(0.35));

  // ---------------------------------------------------------------- mount (display on aria-hidden art only) -------
  const disp = (els: Element[], on: boolean) => ({ display: on ? (world.mode === 'div' && els[0] instanceof HTMLElement ? 'block' : 'inline') : 'none' });
  const T = (s: string) => world.mountTargets(s);
  const setMount = (scene: string, on: boolean, at: number) => { tl.set(T(scene), disp(T(scene), on), at); };
  const initMount = (scene: string, on: boolean) => gsap.set(T(scene), disp(T(scene), on));
  if (!has(4)) {
    initMount('3', true); initMount('6', false); initMount('7', false);
    setMount('3', false, t45(0.5)); setMount('6', true, t45(0.5));
    setMount('4', false, t56(0.5)); setMount('7', true, t56(0.5));
    setMount('5', false, t67(0.4));
  } else {
    // cut-line 4 (node cull): only the scene on screen plus the next one during a transition
    initMount('3', false); initMount('5', false); initMount('6', false); initMount('7', false);
    setMount('5', true, L.t45); setMount('4', false, L.s5);
    setMount('6', true, L.t56); setMount('5', false, L.s6);
    setMount('7', true, L.t67);
  }

  // ---------------------------------------------------------------- audio wrappers -------------------------------
  let prev = 0;
  let pendingCue: number | null = null;
  const dirNow = () => Math.sign(tl.time() - prev) || 1;
  const jumped = () => Math.abs(tl.time() - prev) > 60;
  const sfx = (id: string, at: number) => tl.call(() => {
    if (jumped() || dirNow() < 0) return; // forward only; > 60 units: skip every sfx
    audio.sfx(id, { direction: 1 });
  }, [], at);
  const cue = (n: number, at: number) => tl.call(() => {
    const d = dirNow();
    const target = d > 0 ? n : n - 1; // crossed backwards: master applies N-1 itself
    if (jumped()) { pendingCue = target; return; }
    audio.setCue(target, d > 0 ? 1 : -1);
  }, [], at);
  tl.eventCallback('onUpdate', () => {
    const t = tl.time();
    if (pendingCue !== null) { audio.setCue(pendingCue, Math.sign(t - prev) >= 0 ? 1 : -1); pendingCue = null; }
    audio.setPlayhead(t, Math.sign(t - prev));
    prev = t;
  });

  // ---------------------------------------------------------------- character ------------------------------------
  const rigG = art.rigG;
  gsap.set(rigG, { x: art.rigHome.x, y: art.rigHome.y });
  const vis = (el: Element, v: 'visible' | 'hidden', at: number) => tl.set(el, { visibility: v }, at);
  const walk = { d: 0 };
  let shown = -1;
  const showFrame = () => {
    const idx = Math.floor(walk.d * 4) % 8;
    if (idx === shown) return;
    shown = idx;
    art.walkFrames.forEach((g, i) => { g.style.visibility = i === idx ? 'visible' : 'hidden'; });
    if (idx === 0 || idx === 4) audio.sfx('footstep', { direction: Math.sign(tl.time() - prev) });
  };
  const hideFrames = () => { shown = -1; art.walkFrames.forEach((g) => { g.style.visibility = 'hidden'; }); };
  const walkTween = (from: number, to: number, dur: number, at: number, first = false) =>
    tl.fromTo(walk, { d: from }, { d: to, duration: dur, ease: ease.none, immediateRender: false, onUpdate: showFrame, ...(first ? { onReverseComplete: hideFrames } : {}) }, at);

  // ---------------------------------------------------------------- text ----------------------------------------
  const h4 = $('#h-s4'), h5 = $('#h-s5'), h6 = $('#h-s6'), h7 = $('#h-s7');
  const caps = ['#cap-m6', '#cap-m4', '#cap-m35'].map($);
  const cap6 = $('#cap-s6');
  const lines = (h: HTMLElement) => [h.querySelector<HTMLElement>('.l1')!, h.querySelector<HTMLElement>('.l2')!];
  gsap.set([h5, h6, h7, ...caps, cap6], { opacity: 0 });
  gsap.set([h5, h6, h7].flatMap((h) => lines(h)), { clipPath: INK_START });
  gsap.set(h5, { opacity: 1 });
  gsap.set(h6, { opacity: 1 });
  gsap.set(h7, { opacity: 1 });
  gsap.set(h4, { opacity: 1, y: 0 });
  const narrow = art.narrow;

  // s4 hold: captions M6 -> M4 -> M3+M5 sequential (position-based sets at 20 / 50 / 80 % of the hold)
  tl.set(caps[0], { opacity: 1 }, holdPct('s4', 't45', 0.2));
  tl.set(caps[1], { opacity: 1 }, holdPct('s4', 't45', 0.5));
  tl.set(caps[2], { opacity: 1 }, holdPct('s4', 't45', 0.8));
  if (narrow) tl.set([caps[0], caps[1]], { opacity: 0 }, holdPct('s4', 't45', 0.8)); // two at a time, then the combined box

  // ---------------------------------------------------------------- t45 -----------------------------------------
  // type: S4 exits with the alley by 30 % (before the erase); no type 35-60 %
  tl.to([h4, ...caps], { opacity: 0, duration: 0.2 * S45, ease: ease.lift }, t45(0.1));
  // S5 l1 70-88 %, l2 85-100 % (ink)
  const [l1_5, l2_5] = lines(h5);
  tl.fromTo(l1_5, { clipPath: INK_START }, { clipPath: INK_END, duration: 0.18 * S45, ease: ease.ink, immediateRender: false }, t45(0.7));
  tl.fromTo(l2_5, { clipPath: INK_START }, { clipPath: INK_END, duration: 0.15 * S45, ease: ease.ink, immediateRender: false }, t45(0.85));

  // character
  tl.set(art.jacket[0], { opacity: 0 }, t45(0.075));            // jacket re-ink: fill swap between two stacked layers
  tl.set(art.jacket[1], { opacity: 1 }, t45(0.075));
  vis(art.poses.front, 'hidden', t45(0.15)); vis(art.poses.sayno, 'visible', t45(0.15)); // say no (open palm)
  vis(art.poses.hpNeck, 'hidden', t45(0.5)); vis(art.poses.hpEars, 'visible', t45(0.5));  // headphones neck -> ears
  tl.to(art.flash, { opacity: 1, duration: 6, ease: 'power1.out' }, t45(0.5));            // 12-unit yellow flash, <= 2.5 % of frame
  tl.to(art.flash, { opacity: 0, duration: 6, ease: 'power1.in' }, t45(0.5) + 6);
  vis(art.poses.sayno, 'hidden', t45(0.55));                                                // back 3/4 stride from 55 %
  walkTween(0, 6, 0.45 * S45, t45(0.55), true);
  const home = art.rigHome;
  const s5pos = { x: f5.cx + 0.0 * W, y: f5.y(narrow ? 0.88 : 0.85) };
  tl.fromTo(rigG, { x: home.x, y: home.y }, { x: s5pos.x, y: s5pos.y, duration: 0.45 * S45, ease: 'none', immediateRender: false }, t45(0.55));

  // eraser front: ONE SVG <mask> over red-all; the mask circle scale 0 -> 1 from the palm, 35-60 %
  if (!has(1)) {
    gsap.set(art.eraser, { scale: 0 });
    tl.fromTo(art.eraser, { scale: 0 }, { scale: 1, duration: 0.25 * S45, ease: ease.cam, immediateRender: false }, t45(0.35));
  } else {
    // cut-line 1: per-rough opacity stagger ordered by distance from the palm, same window
    const rs = art.roughs.map((r) => ({ ...r, d: Math.hypot(r.x - art.palm.x, r.y - art.palm.y) })).sort((a, b) => a.d - b.d);
    const dmax = rs[rs.length - 1].d || 1;
    const win = 0.25 * S45, each = 0.06 * S45;
    rs.forEach((r) => tl.to(r.g, { opacity: 0, duration: each, ease: 'none' }, t45(0.35) + (r.d / dmax) * (win - each)));
  }
  // crumbs: grey specks translating out of the palm, 40-62 %
  art.crumbs.forEach((c, i) => {
    const a = (i / art.crumbs.length) * Math.PI * 2 + 0.4;
    const r = (60 + ((i * 37) % 80)) ;
    tl.fromTo(c, { x: 0, y: 0, opacity: 1 }, { x: Math.cos(a) * r, y: Math.sin(a) * r - 30, opacity: 0, duration: 0.22 * S45, ease: ease.lift, immediateRender: false }, t45(0.4));
  });
  tl.set(art.redAll, { display: 'none' }, t45(0.6)); // no red on screen from 60 %
  // alley walls slide out (depth 1.8), 40-85 %
  tl.to(art.wallL, { x: -0.32 * W, duration: 0.45 * S45, ease: ease.cam }, t45(0.4));
  tl.to(art.wallR, { x: 0.32 * W, duration: 0.45 * S45, ease: ease.cam }, t45(0.4));
  // avenue light points switch on toward the horizon, 65-95 %
  const lights = art.lights.slice().reverse();
  const lightWin = 0.3 * S45, lightDur = 0.06 * S45;
  tl.to(lights, { opacity: 1, duration: lightDur, ease: ease.settle, stagger: { each: (lightWin - lightDur) / Math.max(1, lights.length - 1), from: 'end' } }, t45(0.65));
  // sky plane grows (scale y), 60-100 %
  gsap.set(art.sky, { transformOrigin: '50% 100%', scaleY: 0.3 });
  tl.fromTo(art.sky, { scaleY: 0.3 }, { scaleY: 1, duration: 0.4 * S45, ease: ease.cam, immediateRender: false }, t45(0.6));

  // halftone hand-over: pattern -> flat tint below a 3 CSS px dot pitch (the S4 art during the pull-back)
  const swapFlat = (scene: string, flat: boolean, at: number) => {
    const gs = art.htGroups[scene] ?? [];
    const v = flat ? 1 : 0;
    gs.forEach((g) => { if (!flat && g.hasAttribute('data-keepflat')) return; tl.set(g, { attr: { 'data-fm': v } }, at); });
  };
  const p4 = art.pitchPx / f4.s;
  const x4 = crossing(H4e.scale, H5.scale, 3 / p4, ease.cam);
  if (x4 !== null) swapFlat('s4', true, t45(0.35) + x4 * 0.65 * S45);
  // Narrow rigs: the S5 road would exceed t45's 40 % cap while the camera is closer than the s5 hold, so S5's halftone
  // hands in (flat -> pattern) at 95 % of t45. Wide rigs stay under the 35 % cap without it.
  if (art.narrow) swapFlat('s5', false, t45(0.95));
  // S6 sits small in the window: flat at the s5 hold, halftone once the camera is close enough (t56)
  const p6 = art.pitchPx / f6.s;
  art.htGroups.s6?.forEach((g) => g.setAttribute('data-fm', '1'));
  const x6 = crossing(H5e.scale, A56.scale, 3 / p6, ease.cam);
  swapFlat('s5', true, t56(0.45)); // S5 art hands over to flat tint behind the mullion wipe, so only the street/interior carries halftone at s6
  if (x6 !== null) swapFlat('s6', false, t56(0) + x6 * 0.4 * S56);
  else if (3 / p6 <= A56.scale) swapFlat('s6', false, t56(0));

  // audio labels (ANIMATION §5): the label names are the contract
  sfx('t45:eraser-rub', t45(0.36));
  sfx('t45:crumbs', t45(0.45));
  tl.call(() => { if (!jumped() && dirNow() > 0) audio.sfx('t45:lowpass-open', { direction: 1 }); }, [], t45(0.5));
  [0.68, 0.74, 0.8, 0.86, 0.92].forEach((p, i) => sfx(`t45:pluck${i + 1}`, t45(p)));
  cue(5, t45(0.5));

  // ---------------------------------------------------------------- t56 -----------------------------------------
  tl.to(h5, { y: -0.12 * H, opacity: 0, duration: 0.25 * S56, ease: ease.lift }, t56(0.1));  // S5 exits up with the sky by 35 %
  tl.set(art.window5, { display: 'none' }, t56(0.45));                                        // LOD: distant window hidden behind the mullion
  const [l1_6, l2_6] = lines(h6);
  tl.fromTo(l1_6, { clipPath: INK_START }, { clipPath: INK_END, duration: 0.18 * S56, ease: ease.ink, immediateRender: false }, t56(0.7));
  tl.fromTo(l2_6, { clipPath: INK_START }, { clipPath: INK_END, duration: 0.15 * S56, ease: ease.ink, immediateRender: false }, t56(0.85));
  tl.set(cap6, { opacity: 1 }, holdPct('s6', 't67', 0.3));
  // the teen walks by and exits right by 55 %
  const exitX = f6.cx + 0.75 * W, street = { x: f6.cx - 0.12 * W, y: f6.cy + 0.16 * H };
  walkTween(6, 10, 0.55 * S56, t56(0));
  tl.fromTo(rigG, { x: s5pos.x, y: s5pos.y }, { x: exitX, y: street.y + 0.06 * H, duration: 0.55 * S56, ease: 'none', immediateRender: false }, t56(0));
  // mullion + sign plane sweeps the lens as the wipe, 40-70 %
  gsap.set(art.mullion, { x: 0.9 * W });
  tl.fromTo(art.mullion, { x: 0.9 * W }, { x: -0.9 * W, duration: 0.3 * S56, ease: 'none', immediateRender: false }, t56(0.4));
  sfx('t56:card-tap', t56(0.9));
  cue(6, t56(0.5));

  // ---------------------------------------------------------------- t67 -----------------------------------------
  const rest = 6;                                         // 0-motion rest, units
  const endInk = L.end - rest;
  // S6 copy shrinks into panel 6, retires by opacity to 0 below 40 % scale (never visibility/display)
  const r6 = page.rects[5];
  const shrink = (el: HTMLElement) => {
    gsap.set(el, { transformOrigin: '0 0' });
    tl.to(el, {
      x: () => (r6.x + W / 2) - el.offsetLeft, y: () => (r6.y + H / 2) - el.offsetTop,
      scale: () => Math.min(0.35, r6.w / Math.max(1, el.offsetWidth)), duration: 0.4 * S67, ease: ease.cam,
    }, t67(0.4));
    tl.to(el, { opacity: 0, duration: 0.04 * S67, ease: 'none' }, t67(0.4) + 0.36 * S67);
  };
  shrink(h6); shrink(cap6);
  // page: paper rises from the gutters (40-70 %), borders draw in reading order (50-78 %), panels clip in (42-78 %)
  const paper = page.paper;
  gsap.set(paper, { y: H });
  tl.set(page.uses, { display: 'inline' }, t67(0.4));                                          // panels become rendered at 40 %
  tl.fromTo(paper, { y: H }, { y: 0, duration: 0.3 * S67, ease: ease.settle, immediateRender: false }, t67(0.4));
  const bWin = 0.28 * S67, bDur = Math.max(6, bWin / 3);
  page.borders.forEach((b, i) => tl.fromTo(b, { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: bDur, ease: ease.ink, immediateRender: false }, t67(0.5) + (i / 6) * (bWin - bDur)));
  const cDur = Math.max(8, 0.36 * S67 - 5 * 6);
  page.uses.forEach((u, i) => {
    gsap.set(u, { clipPath: 'inset(0% 100% 0% 0%)' });
    tl.fromTo(u, { clipPath: 'inset(0% 100% 0% 0%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: cDur, ease: ease.ink, immediateRender: false }, t67(0.42) + i * 6);
  });
  // the camera frame becomes the panel-7 clip
  const inset = `inset(${p7.y + H / 2}px ${W / 2 - (p7.x + p7.w)}px ${H / 2 - (p7.y + p7.h)}px ${p7.x + W / 2}px)`;
  gsap.set(world.wrap, { clipPath: 'inset(0px 0px 0px 0px)' });
  tl.fromTo(world.wrap, { clipPath: 'inset(0px 0px 0px 0px)' }, { clipPath: inset, duration: 0.4 * S67, ease: ease.cam, immediateRender: false }, t67(0.4));
  // halftone hand-over again as the street frame shrinks (S6 art below 3 px pitch -> flat)
  const x6b = crossing(A56.scale, sEnd, 3 / p6, ease.cam);
  if (x6b !== null) swapFlat('s6', true, t67(0.4) + x6b * 0.4 * S67);
  // the walker joins panel 7 (walkDist 40-100 %, stops before the rest)
  const wStart = { x: f6.cx - 0.1 * W, y: f6.cy + 0.14 * H };
  tl.set(rigG, { x: wStart.x, y: wStart.y }, t67(0.4));
  walkTween(10, 14, endInk - t67(0.4), t67(0.4));
  tl.to(rigG, { x: wStart.x + 0.1 * W, y: wStart.y - 0.04 * H, duration: endInk - t67(0.4), ease: 'none' }, t67(0.4));
  // final copy inks 80-100 % (S7 l1 then l2, then the ID lines), then the rest
  const [l1_7, l2_7] = lines(h7);
  const id7 = h7.querySelector<HTMLElement>('.id7')!;
  gsap.set(id7, { opacity: 0 });
  const inkLen = endInk - t67(0.8);
  tl.fromTo(l1_7, { clipPath: INK_START }, { clipPath: INK_END, duration: inkLen * 0.5, ease: ease.ink, immediateRender: false }, t67(0.8));
  tl.fromTo(l2_7, { clipPath: INK_START }, { clipPath: INK_END, duration: inkLen * 0.5, ease: ease.ink, immediateRender: false }, t67(0.8) + inkLen * 0.4);
  tl.fromTo(id7, { opacity: 0 }, { opacity: 1, duration: inkLen * 0.25, ease: 'none', immediateRender: false }, endInk - inkLen * 0.25);
  [44, 50, 56, 62, 68, 74].forEach((p, i) => sfx(`t67:rule-pen${i + 1}`, t67(p / 100)));
  sfx('t67:paper-settle', t67(0.98));
  cue(7, t67(0.5));

  return { tl, labels: L };
}

export function createTrigger(tl: gsap.core.Timeline) {
  const track = document.getElementById('track')!;
  const scrub = params.scrub === 'true' ? true : params.scrub ? Number(params.scrub) : isCoarse() ? true : 0.5;
  return ScrollTrigger.create({
    trigger: '.story', start: 'top top', end: () => '+=' + track.offsetHeight,
    scrub, animation: tl, invalidateOnRefresh: true,
  });
}
