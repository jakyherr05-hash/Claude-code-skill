// AUDIO LOAD STAND-IN. This is NOT music and must never be presented as the score.
// Purpose (TEST_PLAN §3.3 "audio running through S4 to S5"): put a representative load on the same browser while the
// scroll runs: one AudioContext, a Worker clock plus main-thread look-ahead scheduler (120 ms desktop / 200 ms mobile),
// a Worker-rendered buffer job, a ConvolverNode, and source-node / sounding-note counts that reach the
// AUDIO_SPECIFICATION §6 worst-case table for the s4 -> s5 crossfade (including the fling that skips the near-silence).
import { getContext, unlock, isMobileProfile, contextsConstructed } from './unlock';

export type AudioState = 'idle' | 'starting' | 'running' | 'blocked' | 'muted';

interface CueSpec { osc: number; buf: number } // slots: an osc slot plays 2 detuned oscillators, a buf slot plays 1 buffer source
// Counts from AUDIO_SPECIFICATION §6 (peak / incoming source nodes): osc*2 + buf
//   desktop s4 54 (24*2+6), s5 63 (27*2+9), s6 30, s7 56 ; mobile s4 38, s5 39, s6 23, s7 33
const SPECS: Record<'desktop' | 'mobile', Record<number, CueSpec>> = {
  desktop: { 4: { osc: 24, buf: 6 }, 5: { osc: 27, buf: 9 }, 6: { osc: 12, buf: 6 }, 7: { osc: 22, buf: 12 } },
  mobile: { 4: { osc: 16, buf: 6 }, 5: { osc: 13, buf: 13 }, 6: { osc: 8, buf: 7 }, 7: { osc: 12, buf: 9 } },
};
// Outgoing tail when the near-silence is skipped (fling): 19 sources / 12 notes desktop, 15 / 10 mobile (AUDIO §6)
const FLING_TAIL = { desktop: { osc: 7, buf: 5 }, mobile: { osc: 5, buf: 5 } };
const NEAR_SILENCE_TAIL = { osc: 0, buf: 2 }; // 2 sources

interface Note { start: number; end: number; srcs: AudioScheduledSourceNode[]; gain: GainNode; sfx: boolean }
interface Slot { kind: 'osc' | 'buf'; idx: number; next: number; period: number; freq: number; alive: boolean; note: Note | null }
interface CueState { n: number; bus: GainNode; slots: Slot[]; silenced: boolean; gone: boolean }

const CHORD = [1, 1.5, 2, 2.25, 3, 3.375, 4, 1.2, 1.8, 2.4]; // loosely consonant ratios; stand-in pitches only

export class Standin {
  readonly mobile = isMobileProfile();
  readonly lookahead = (isMobileProfile() ? 200 : 120) / 1000;
  state: AudioState = 'idle';
  ctx!: AudioContext;
  private master!: GainNode;
  private lp!: BiquadFilterNode;
  private analyser!: AnalyserNode;
  private convolver?: ConvolverNode;
  private cues = new Map<number, CueState>();
  private cue = 0;
  private pendingCue = 0;
  private notes: Note[] = [];
  private buffers = new Map<string, AudioBuffer>();
  private clock?: Worker;
  private rw?: Worker;
  private ready = false;
  private ticks = 0;
  readonly stats = {
    label: 'AUDIO LOAD STAND-IN, NOT THE SCORE',
    lookaheadMs: this.lookahead * 1000,
    sources: { sounding: 0, peakSounding: 0, graphAlive: 0, peakGraph: 0, created: 0 },
    notes: { sounding: 0, peak: 0 },
    peakWindow: { sources: 0, notes: 0 },
    late: { count: 0, maxMs: 0 },
    tickMaxMs: 0,
    render: { ms: 0, bytes: 0, buffers: 0, mainCopyMaxMs: 0, done: false },
    cue: 0,
    cueLog: [] as { t: number; cue: number; tail: number; fling: boolean }[],
    playhead: 0,
  };

  /** audio-engine: build the graph and start the Worker buffer job. No sound. */
  prepare() {
    if (this.ready) return;
    this.ready = true;
    this.ctx = getContext();
    const c = this.ctx;
    this.master = c.createGain();
    this.master.gain.value = 0;
    this.lp = c.createBiquadFilter();
    this.lp.type = 'lowpass';
    this.lp.frequency.value = 20000;
    const comp = c.createDynamicsCompressor();
    this.analyser = c.createAnalyser();
    this.analyser.fftSize = 1024;
    this.lp.connect(this.master);
    this.master.connect(comp).connect(this.analyser).connect(c.destination);
    // render job in a file-based Worker
    const t0 = performance.now();
    performance.mark('audio-render-start');
    this.rw = new Worker(new URL('./renderWorker.ts', import.meta.url), { type: 'module' });
    const queue: { name: string; sr: number; channels: Float32Array[] }[] = [];
    let draining = false;
    const drain = () => {
      const j = queue.shift();
      if (!j) { draining = false; return; }
      const a = performance.now();
      const b = c.createBuffer(j.channels.length, j.channels[0].length, j.sr);
      j.channels.forEach((ch, i) => b.copyToChannel(ch as Float32Array<ArrayBuffer>, i));
      this.stats.render.mainCopyMaxMs = Math.max(this.stats.render.mainCopyMaxMs, performance.now() - a);
      this.buffers.set(j.name, b);
      if (j.name === 'hall') this.attachConvolver(b);
      setTimeout(drain, 0); // one buffer per task, each well under 16 ms
    };
    this.rw.onmessage = (e: MessageEvent) => {
      const m = e.data as { type: string; name?: string; sr?: number; channels?: Float32Array[]; ms?: number; bytes?: number; count?: number };
      if (m.type === 'buffer') {
        queue.push({ name: m.name!, sr: m.sr!, channels: m.channels! });
        if (!draining) { draining = true; setTimeout(drain, 0); }
      } else if (m.type === 'done') {
        this.stats.render = { ...this.stats.render, ms: m.ms!, bytes: m.bytes!, buffers: m.count!, done: true };
        performance.mark('audio-render-end');
        performance.measure('audio-render', { start: t0, end: performance.now() });
      }
    };
    this.rw.postMessage({ sampleRate: c.sampleRate, mobile: this.mobile });
    c.addEventListener('statechange', () => {
      if (c.state === 'running' && this.state === 'blocked') this.state = 'running';
    });
  }

  private attachConvolver(ir: AudioBuffer) {
    if (this.convolver) return;
    this.convolver = this.ctx.createConvolver();
    this.convolver.buffer = ir;
    const wet = this.ctx.createGain();
    wet.gain.value = 0.25;
    this.lp.connect(this.convolver).connect(wet).connect(this.master);
  }

  /** G-1 case (b): the context already runs. Case (a): returns false and the caller shows the prompt. */
  probe(): boolean {
    this.prepare();
    return this.ctx.state === 'running';
  }

  /** Called inside the ENTER click (unlock) or at the hand-off when autoplay is allowed. */
  async begin(fromGesture: boolean): Promise<boolean> {
    this.prepare();
    this.state = 'starting';
    try { if (fromGesture) await unlock(); else if (this.ctx.state !== 'running') await this.ctx.resume(); } catch { /* blocked */ }
    if (this.ctx.state !== 'running') { this.state = 'blocked'; return false; }
    this.state = 'running';
    const now = this.ctx.currentTime;
    this.master.gain.cancelScheduledValues(now);
    this.master.gain.setValueAtTime(0, now);
    this.master.gain.linearRampToValueAtTime(0.35, now + 1.5); // --dur-xl score fade
    this.bloom(now);
    this.startClock();
    if (this.pendingCue) this.setCue(this.pendingCue, 1);
    return true;
  }

  private startClock() {
    this.clock = new Worker(new URL('./clockWorker.ts', import.meta.url), { type: 'module' });
    this.clock.onmessage = () => this.tick();
    this.clock.postMessage({ cmd: 'start', interval: 25 });
  }

  setEnabled(on: boolean) {
    if (!this.ready) return;
    const c = this.ctx, now = c.currentTime;
    this.master.gain.cancelScheduledValues(now);
    if (!on) {
      this.master.gain.setValueAtTime(this.master.gain.value, now);
      this.master.gain.linearRampToValueAtTime(0, now + 0.4);
      setTimeout(() => { if (this.master.gain.value === 0) void c.suspend(); }, 450);
      this.state = 'muted';
    } else {
      void c.resume().then(() => {
        this.state = 'running';
        const n = c.currentTime;
        this.master.gain.setValueAtTime(0, n);
        this.master.gain.linearRampToValueAtTime(0.35, n + 0.4);
      });
    }
  }

  // ---- cues -------------------------------------------------------------------------------------
  setCue(n: number, dir: 1 | -1) {
    if (this.state !== 'running') { this.pendingCue = n; return; }
    if (n === this.cue) return;
    const spec = SPECS[this.mobile ? 'mobile' : 'desktop'][n] ?? SPECS[this.mobile ? 'mobile' : 'desktop'][4];
    const c = this.ctx, now = c.currentTime;
    const fade = dir > 0 ? 1.5 : 0.8;
    const old = this.cues.get(this.cue);
    // incoming
    const bus = c.createGain();
    bus.gain.setValueAtTime(0, now);
    bus.gain.linearRampToValueAtTime(1, now + fade);
    bus.connect(this.lp);
    const cs: CueState = { n, bus, slots: [], silenced: false, gone: false };
    const mk = (kind: 'osc' | 'buf', count: number) => {
      for (let i = 0; i < count; i++) {
        const idx = cs.slots.length;
        cs.slots.push({
          kind, idx, next: now + 0.05 + (idx % 16) * 0.025 + Math.floor(idx / 16) * 0.2,
          period: kind === 'osc' ? 1.2 + ((idx * 37) % 14) / 10 : 0.7 + ((idx * 23) % 10) / 10,
          freq: 55 * CHORD[(idx * 7 + n) % CHORD.length] * (kind === 'osc' ? 2 ** ((idx % 3) - 0.5) : 4), alive: true, note: null,
        });
      }
    };
    mk('osc', spec.osc);
    mk('buf', spec.buf);
    this.cues.set(n, cs);
    this.cue = n;
    this.stats.cue = n;
    // outgoing
    let tail = 0, fling = false;
    if (old) {
      const keep = old.silenced ? NEAR_SILENCE_TAIL : FLING_TAIL[this.mobile ? 'mobile' : 'desktop'];
      fling = !old.silenced && dir > 0;
      tail = this.trimTo(old, keep, 1.5);
    }
    this.stats.cueLog.push({ t: now, cue: n, tail, fling });
    this.peakWindowReset();
  }

  /** keep the first `keep.osc` osc slots and `keep.buf` buf slots as a fading tail; stop scheduling everywhere */
  private trimTo(cs: CueState, keep: { osc: number; buf: number }, fadeS: number): number {
    const now = this.ctx.currentTime;
    let ko = 0, kb = 0, kept = 0;
    for (const s of cs.slots) {
      const isKept = s.kind === 'osc' ? ko++ < keep.osc : kb++ < keep.buf;
      s.alive = isKept; // kept tail voices keep re-triggering until the fade ends (the cue is torn down then)
      const sounding = !!s.note && s.note.end > now;
      if (isKept) { if (sounding) kept += s.note!.srcs.length; continue; }
      if (s.note && sounding) this.dropNote(s.note, now + 0.12);
    }
    cs.bus.gain.cancelScheduledValues(now);
    cs.bus.gain.setValueAtTime(cs.bus.gain.value, now);
    cs.bus.gain.linearRampToValueAtTime(0, now + fadeS);
    setTimeout(() => {
      cs.gone = true;
      for (const s of cs.slots) if (s.note && s.note.end > this.ctx.currentTime) this.dropNote(s.note, this.ctx.currentTime + 0.02);
      cs.bus.disconnect();
      if (this.cues.get(cs.n) === cs && this.cue !== cs.n) this.cues.delete(cs.n);
    }, fadeS * 1000 + 100);
    return kept;
  }

  private dropNote(n: Note, at: number) {
    n.gain.gain.cancelScheduledValues(this.ctx.currentTime);
    n.gain.gain.setTargetAtTime(0, this.ctx.currentTime, 0.03);
    for (const s of n.srcs) { try { s.stop(at); } catch { /* already stopped */ } }
    n.end = Math.min(n.end, at);
  }

  /** the near-silence (eraser-rub): everything but two buffer voices stops; the two keep sounding as the tail */
  private nearSilence() {
    const cs = this.cues.get(this.cue);
    if (!cs || cs.silenced || cs.gone) return;
    cs.silenced = true;
    const now = this.ctx.currentTime;
    let kb = 0;
    for (const s of cs.slots) {
      if (s.kind === 'buf' && kb < NEAR_SILENCE_TAIL.buf) { kb++; continue; }
      s.alive = false;
      if (s.note && s.note.end > now) this.dropNote(s.note, now + 0.12);
    }
    cs.bus.gain.cancelScheduledValues(now);
    cs.bus.gain.setValueAtTime(cs.bus.gain.value, now);
    cs.bus.gain.linearRampToValueAtTime(0.1, now + 0.8);
  }

  private openLowpass() {
    const now = this.ctx.currentTime;
    this.lp.frequency.cancelScheduledValues(now);
    this.lp.frequency.setValueAtTime(900, now);
    this.lp.frequency.exponentialRampToValueAtTime(20000, now + 0.35);
  }

  setPlayhead(units: number, _dir: number) {
    this.stats.playhead = units;
    if (this.state !== 'running') return;
    // within-scene intensity: cheap AudioParam write once per frame
    this.lp.Q.setTargetAtTime(0.7 + 0.3 * Math.sin(units / 40), this.ctx.currentTime, 0.1);
  }

  // ---- scheduler ----------------------------------------------------------------------------------
  private tick() {
    const t0 = performance.now();
    const c = this.ctx, now = c.currentTime, ahead = now + this.lookahead;
    this.ticks++;
    for (const cs of this.cues.values()) {
      if (cs.gone) continue;
      for (const s of cs.slots) {
        while (s.alive && s.next < ahead) this.schedule(cs, s, now);
      }
    }
    // stats
    this.notes = this.notes.filter((n) => n.end > now - 0.05);
    let src = 0, nn = 0, alive = 0;
    for (const n of this.notes) {
      alive += n.srcs.length;
      if (n.start <= now && now < n.end) { src += n.srcs.length; if (!n.sfx) nn++; }
    }
    const st = this.stats;
    st.sources.sounding = src; st.sources.graphAlive = alive; st.notes.sounding = nn;
    st.sources.peakSounding = Math.max(st.sources.peakSounding, src);
    st.sources.peakGraph = Math.max(st.sources.peakGraph, alive);
    st.notes.peak = Math.max(st.notes.peak, nn);
    st.peakWindow.sources = Math.max(st.peakWindow.sources, src);
    st.peakWindow.notes = Math.max(st.peakWindow.notes, nn);
    const dt = performance.now() - t0;
    st.tickMaxMs = Math.max(st.tickMaxMs, dt);
  }
  private peakWindowReset() { this.stats.peakWindow = { sources: 0, notes: 0 }; }

  private schedule(cs: CueState, s: Slot, now: number) {
    const c = this.ctx;
    let start = s.next;
    if (start < now) { // the main thread was late: the note starts late, as in the real scheduler
      this.stats.late.count++;
      this.stats.late.maxMs = Math.max(this.stats.late.maxMs, (now - start) * 1000);
      start = now;
    }
    const dur = s.period;
    s.next = start + dur;
    const g = c.createGain();
    const level = s.kind === 'osc' ? 0.016 : 0.05;
    g.gain.setValueAtTime(0, start);
    g.gain.linearRampToValueAtTime(level, start + 0.04);
    g.gain.setValueAtTime(level, start + dur - 0.05);
    g.gain.linearRampToValueAtTime(0, start + dur);
    g.connect(cs.bus);
    const srcs: AudioScheduledSourceNode[] = [];
    const pick = this.pickBuffer(s);
    if (s.kind === 'osc' || !pick) {
      const f = c.createBiquadFilter();
      f.type = 'lowpass'; f.frequency.value = 900 + (s.idx % 5) * 400; f.Q.value = 0.7;
      f.connect(g);
      const n = s.kind === 'osc' ? 2 : 1;
      for (let j = 0; j < n; j++) {
        const o = c.createOscillator();
        o.type = j === 0 ? 'sawtooth' : 'triangle';
        o.frequency.value = s.freq;
        o.detune.value = j === 0 ? -6 : 6;
        o.connect(f);
        o.start(start); o.stop(start + dur);
        srcs.push(o);
      }
    } else {
      const b = c.createBufferSource();
      b.buffer = pick;
      b.playbackRate.value = 2 ** (((s.idx * 5) % 7) / 12);
      b.connect(g);
      b.start(start); b.stop(start + dur);
      srcs.push(b);
    }
    this.stats.sources.created += srcs.length;
    const note: Note = { start, end: start + dur, srcs, gain: g, sfx: false };
    srcs[0].onended = () => { g.disconnect(); };
    s.note = note;
    this.notes.push(note);
  }

  private pickBuffer(s: Slot): AudioBuffer | undefined {
    const sets = ['pluck', 'piano', 'mallet'] as const;
    const kind = sets[s.idx % 3];
    const max = kind === 'pluck' ? 10 : kind === 'piano' ? 13 : 9;
    return this.buffers.get(`${kind}${(s.idx * 3) % max}`);
  }

  // ---- sfx (one-shots, all through the master) ---------------------------------------------------
  private oneShot(srcs: AudioScheduledSourceNode[], g: GainNode, start: number, dur: number) {
    const note: Note = { start, end: start + dur, srcs, gain: g, sfx: true };
    this.stats.sources.created += srcs.length;
    srcs[0].onended = () => g.disconnect();
    this.notes.push(note);
  }
  private noiseSrc(start: number, dur: number, rate = 1): AudioBufferSourceNode {
    const c = this.ctx;
    const s = c.createBufferSource();
    let b = this.buffers.get('noise');
    if (!b) { b = c.createBuffer(1, Math.ceil(c.sampleRate * 0.5), c.sampleRate); const d = b.getChannelData(0); for (let i = 0; i < d.length; i++) d[i] = (Math.random() * 2 - 1) * 0.4; }
    s.buffer = b; s.loop = true; s.playbackRate.value = rate;
    s.start(start); s.stop(start + dur);
    return s;
  }
  private blip(kind: 'noise' | 'thud', start: number, dur: number, level: number, freq = 1800) {
    const c = this.ctx;
    const g = c.createGain();
    g.gain.setValueAtTime(level, start);
    g.gain.exponentialRampToValueAtTime(0.0001, start + dur);
    g.connect(this.master);
    let s: AudioScheduledSourceNode;
    if (kind === 'noise') {
      const f = c.createBiquadFilter(); f.type = 'bandpass'; f.frequency.value = freq; f.connect(g);
      const n = this.noiseSrc(start, dur); n.connect(f); s = n;
    } else {
      const o = c.createOscillator(); o.frequency.value = freq; o.connect(g); o.start(start); o.stop(start + dur); s = o;
    }
    this.oneShot([s], g, start, dur);
  }

  sfx(id: string, opts: { direction: number }) {
    if (this.state !== 'running' || opts.direction < 0) return;
    const c = this.ctx, now = c.currentTime + 0.01;
    if (id === 'lowpass-open' || id === 't45:lowpass-open') { this.openLowpass(); return; }
    if (id.includes('eraser-rub')) { this.nearSilence(); this.blip('noise', now, 0.9, 0.25, 1400); return; }
    if (id.includes('crumbs')) { for (let i = 0; i < 6; i++) this.blip('noise', now + i * 0.07, 0.03, 0.2, 3000 + i * 300); return; }
    if (id.includes('pluck')) {
      const k = Number(id.replace(/\D/g, '')) || 1;
      const b = this.buffers.get(`pluck${(k * 2) % 10}`);
      const g = c.createGain(); g.gain.value = 0.2; g.connect(this.master);
      if (b) { const s = c.createBufferSource(); s.buffer = b; s.connect(g); s.start(now); s.stop(now + 1.2); this.oneShot([s], g, now, 1.2); }
      else this.blip('thud', now, 0.5, 0.15, 220 * k);
      return;
    }
    if (id.includes('footstep')) { this.blip('thud', now, 0.1, 0.25, 70); this.blip('noise', now, 0.05, 0.1, 900); return; }
    if (id.includes('rule-pen')) { this.blip('noise', now, 0.08, 0.12, 2400); this.blip('thud', now, 0.05, 0.06, 1200); return; }
    if (id.includes('paper-settle')) { this.blip('noise', now, 0.5, 0.15, 500); return; }
    this.blip('noise', now, 0.06, 0.15, 2000);
  }

  private bloom(start: number) {
    const c = this.ctx;
    const g = c.createGain();
    g.gain.setValueAtTime(0, start);
    g.gain.linearRampToValueAtTime(0.08, start + 0.3);
    g.gain.exponentialRampToValueAtTime(0.0001, start + 1.4);
    g.connect(this.master);
    const o = c.createOscillator(); o.frequency.value = 220; o.connect(g); o.start(start); o.stop(start + 1.4);
    this.oneShot([o], g, start, 1.4);
  }

  rms(): number {
    if (!this.analyser) return 0;
    const a = new Float32Array(this.analyser.fftSize);
    this.analyser.getFloatTimeDomainData(a);
    let s = 0;
    for (const v of a) s += v * v;
    return Math.sqrt(s / a.length);
  }

  snapshot() {
    return {
      ...this.stats, state: this.state, ctxState: this.ctx?.state ?? 'none', sampleRate: this.ctx?.sampleRate ?? 0,
      mobileProfile: this.mobile, profileOverride: new URLSearchParams(location.search).get('audioprofile'), hardwareConcurrency: navigator.hardwareConcurrency, contexts: contextsConstructed(), ticks: this.ticks, masterGain: this.master?.gain.value ?? 0,
      rms: this.rms(), cues: [...this.cues.keys()],
    };
  }

  dispose() {
    this.clock?.terminate(); this.rw?.terminate();
    void this.ctx?.close();
  }
}
