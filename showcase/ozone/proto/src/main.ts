import './style.css';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { registerPlugins } from './tokens';
import { pickRig, params, LABELS, STATIC_QUERY, RIG_QUERIES, type LabelName } from './config';
import { buildArt, buildPage, finalizeMask } from './art';
import { assembleWorld } from './world';
import { buildMaster, createTrigger } from './master';
import { audio } from './audio';
import { exposeHooks } from './qa';
import { on } from './cleanup';

registerPlugins();
ScrollTrigger.config({ ignoreMobileResize: true });
history.scrollRestoration = 'manual';

const root = document.documentElement;
const rig = pickRig();
const staticMode = matchMedia(STATIC_QUERY).matches;
root.dataset.rig = rig;
root.dataset.mode = staticMode ? 'static' : 'story';
// art tier: no loader in the prototype, so "auto" is always full; ?art= overrides and is logged (TEST_PLAN §1)
const tier: 'lite' | 'full' = params.art ?? 'full';
const source = params.art ? 'query' : 'auto';
root.dataset.art = tier;
console.info(`[ozone] art-tier=${tier} source=${source}`);
console.info(`[ozone] proto cuts=${JSON.stringify(params.cuts)} filters=${params.filters ? 3 : 0} rig=${rig} (placeholder art; AUDIO IS A LOAD STAND-IN)`);

const stage = document.getElementById('stage')!;
const W = stage.clientWidth, H = stage.clientHeight;
const lite = tier === 'lite' || params.cuts.includes(3);

const art = buildArt({ rig, W, H, lite, cuts: params.cuts, filters: params.filters });
const page = buildPage(art);
const world = assembleWorld(art, page, params.cuts.includes(6), { lite });
finalizeMask(art);

async function boot() {
  await document.fonts.ready;
  if (staticMode) { handOff(null); return; }
  const mm = gsap.matchMedia();
  mm.add(`${RIG_QUERIES[rig]} and (prefers-reduced-motion:no-preference)`, () => {
    const { tl } = buildMaster({ art, page, world, rig, audio, lite, cuts: params.cuts });
    const st = createTrigger(tl);
    ScrollTrigger.refresh();
    handOff({ tl, st });
    return () => { /* gsap.matchMedia reverts the master and the trigger */ };
  });
  // a rig-bucket change rebuilds the whole world: the prototype reloads and restores the scroll fraction
  let t: number | undefined;
  const bounce = () => {
    window.clearTimeout(t);
    t = window.setTimeout(() => {
      const st = ScrollTrigger.getAll()[0];
      if (st) sessionStorage.setItem('proto-progress', String(st.progress));
      if (pickRig() !== rig || stage.clientWidth !== W || stage.clientHeight !== H) location.reload();
    }, 150);
  };
  on(window, 'resize', bounce);
  on(window, 'orientationchange', bounce);
}

function cueFor(tl: gsap.core.Timeline, L: Record<LabelName, number>): number {
  const t = tl.time();
  const mid = (a: LabelName, b: LabelName) => L[a] + 0.5 * (L[b] - L[a]);
  return t < mid('t45', 's5') ? 4 : t < mid('t56', 's6') ? 5 : t < mid('t67', 'end') ? 6 : 7;
}

function handOff(s: { tl: gsap.core.Timeline; st: ScrollTrigger } | null) {
  exposeHooks({ rig, st: s?.st ?? null, tl: s?.tl ?? null, audio, art, tier, source, cuts: params.cuts, filters: params.filters, lite });
  if (s) {
    const L = LABELS[rig];
    const saved = sessionStorage.getItem('proto-progress');
    sessionStorage.removeItem('proto-progress');
    let target: number | null = null;
    if (saved) target = s.st.start + Number(saved) * (s.st.end - s.st.start);
    else if (params.at) {
      const m = /^([a-z0-9]+)(?:\+(-?[\d.]+))?$/.exec(params.at);
      if (m && m[1] in L) target = s.st.start + ((L[m[1] as LabelName] + Number(m[2] ?? 0)) / L.end) * (s.st.end - s.st.start);
    }
    if (target !== null) window.scrollTo(0, target);
    initAudio(() => cueFor(s.tl, L));
  }
  // prototype hand-off is immediate on load
  performance.mark('story-ready');
}

function initAudio(cue: () => number) {
  if (!params.audio) return;
  const prompt = document.getElementById('audio-prompt')!;
  const toggle = document.getElementById('sound') as HTMLButtonElement;
  const started = () => {
    prompt.hidden = true;
    toggle.hidden = false;
    toggle.textContent = 'SOUND ON (load stand-in)';
    toggle.setAttribute('aria-pressed', 'true');
    audio.setCue(cue(), 1);
  };
  audio.prepare();
  if (audio.probe()) {
    void audio.begin(false).then((ok) => { if (ok) started(); else prompt.hidden = false; });
  } else {
    prompt.hidden = false;
  }
  on(document.getElementById('enter')!, 'click', () => { void audio.begin(true).then((ok) => { if (ok) started(); }); });
  on(document.getElementById('continue')!, 'click', () => { prompt.hidden = true; });
  on(toggle, 'click', () => {
    const next = toggle.getAttribute('aria-pressed') !== 'true';
    toggle.setAttribute('aria-pressed', String(next));
    toggle.textContent = next ? 'SOUND ON (load stand-in)' : 'SOUND OFF';
    audio.setEnabled(next);
  });
}

void boot();
