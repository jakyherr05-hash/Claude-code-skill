// The only place an AudioContext is constructed (TECH §6). getContext(): get-or-create, no sound.
// unlock(): resume() + silent buffer, to be called synchronously inside a click handler.
let ctx: AudioContext | null = null;
let constructed = 0;

/** AUDIO §6: mobile profile when (pointer:coarse), hardwareConcurrency <= 4 or html[data-art=lite]. `?audioprofile=desktop|mobile`
 *  overrides it (this lab machine reports few cores, which would otherwise always select the mobile profile). */
export function isMobileProfile(): boolean {
  const o = new URLSearchParams(location.search).get('audioprofile');
  if (o === 'desktop') return false;
  if (o === 'mobile') return true;
  return matchMedia('(pointer:coarse)').matches || (navigator.hardwareConcurrency ?? 8) <= 4
    || document.documentElement.dataset.art === 'lite'
    || ['S', 'P'].includes(document.documentElement.dataset.rig ?? '');
}

export function getContext(): AudioContext {
  if (!ctx) {
    ctx = new AudioContext({ latencyHint: isMobileProfile() ? 'balanced' : 'interactive' });
    constructed++;
  }
  return ctx;
}
export const contextsConstructed = () => constructed;

export function unlock(): Promise<AudioContext> {
  const c = getContext();
  const p = c.resume(); // must start inside the user gesture
  const b = c.createBuffer(1, 1, c.sampleRate);
  const s = c.createBufferSource();
  s.buffer = b;
  s.connect(c.destination);
  s.start(0);
  return p.then(() => c);
}
