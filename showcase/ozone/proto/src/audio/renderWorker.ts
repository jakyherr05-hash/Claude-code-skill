// Worker-rendered buffer job (load stand-in): damped partial recurrences, sized like AUDIO_SPECIFICATION §6
// (desktop about 14 MB, mobile about 11 MB of Float32). Posts each buffer as a transferable. NOT the score's sounds.
const w = self as unknown as { postMessage(m: unknown, t?: Transferable[]): void; onmessage: ((e: MessageEvent) => void) | null };

interface Job { sampleRate: number; mobile: boolean }

/** y[n] = 2cos(w) y[n-1] - y[n-2] recurrence oscillators with a per-partial decay recurrence (no Math.sin per sample). */
function voice(freq: number, seconds: number, sr: number, partials: number, decay: number): Float32Array {
  const n = Math.floor(seconds * sr);
  const out = new Float32Array(n);
  for (let p = 1; p <= partials; p++) {
    const f = freq * p * (1 + 0.0004 * p * p);
    if (f > sr * 0.45) break;
    const wv = (2 * Math.PI * f) / sr;
    const c = 2 * Math.cos(wv);
    let y1 = Math.sin(-wv), y0 = 0;
    const amp = 1 / (p * p * 0.7 + p);
    let env = amp;
    const d = Math.exp(-(decay * (1 + p * 0.35)) / sr);
    for (let i = 0; i < n; i++) {
      const y = c * y0 - y1;
      y1 = y0; y0 = y;
      out[i] += y * env;
      env *= d;
    }
  }
  let peak = 0;
  for (let i = 0; i < n; i++) peak = Math.max(peak, Math.abs(out[i]));
  const g = peak > 0 ? 0.8 / peak : 1;
  for (let i = 0; i < n; i++) out[i] *= g;
  // 3 ms attack
  const a = Math.min(n, Math.floor(sr * 0.003));
  for (let i = 0; i < a; i++) out[i] *= i / a;
  return out;
}

function noise(seconds: number, sr: number, seed: number): Float32Array {
  const n = Math.floor(seconds * sr);
  const out = new Float32Array(n);
  let s = seed >>> 0;
  let lp = 0;
  for (let i = 0; i < n; i++) {
    s = (Math.imul(s, 1664525) + 1013904223) >>> 0;
    const r = (s / 4294967296) * 2 - 1;
    lp += 0.35 * (r - lp);
    out[i] = lp * 0.6;
  }
  return out;
}

function ir(seconds: number, sr: number, seed: number): Float32Array {
  const n = Math.floor(seconds * sr);
  const out = noise(seconds, sr, seed);
  const k = Math.exp(-6.9 / n); // -60 dB over the length
  let e = 1;
  for (let i = 0; i < n; i++) { out[i] *= e; e *= k; }
  return out;
}

w.onmessage = (e: MessageEvent) => {
  const job = e.data as Job;
  const t0 = performance.now();
  const sr = job.sampleRate, half = Math.round(sr / 2);
  const m = job.mobile;
  const sets: { name: string; sr: number; channels: Float32Array[] }[] = [];
  const notes = [110, 123.5, 130.8, 146.8, 164.8, 174.6, 196, 220, 246.9, 261.6, 293.7, 329.6, 349.2];
  // piano-ish: 13 notes, half rate
  notes.slice(0, 13).forEach((f, i) => sets.push({ name: `piano${i}`, sr: half, channels: [voice(f, m ? 2.5 : 3.5, half, 10, 2.2)] }));
  // pluck: 10 notes
  notes.slice(0, 10).forEach((f, i) => sets.push({ name: `pluck${i}`, sr, channels: [voice(f * 2, m ? 1.8 : 2.5, sr, 8, 4.5)] }));
  // mallet: 9 notes, half rate
  notes.slice(0, 9).forEach((f, i) => sets.push({ name: `mallet${i}`, sr: half, channels: [voice(f * 4, m ? 1.5 : 2, half, 5, 6)] }));
  sets.push({ name: 'noise', sr, channels: [noise(10.9, sr, 7)] });
  // hall IR (stereo) and, on desktop, a second room IR
  sets.push({ name: 'hall', sr, channels: [ir(m ? 1.6 : 1.8, sr, 11), ir(m ? 1.6 : 1.8, sr, 13)] });
  if (!m) sets.push({ name: 'room', sr, channels: [ir(1.8, sr, 17), ir(1.8, sr, 19)] });

  let bytes = 0;
  for (const s of sets) {
    const tr = s.channels.map((c) => c.buffer as ArrayBuffer);
    for (const c of s.channels) bytes += c.byteLength;
    w.postMessage({ type: 'buffer', name: s.name, sr: s.sr, channels: s.channels }, tr);
  }
  w.postMessage({ type: 'done', ms: performance.now() - t0, bytes, count: sets.length });
};

export {};
