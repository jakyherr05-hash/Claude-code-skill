// Rig selection, label table and URL parameters for the T6b prototype.
// The rig media strings are a PROTOTYPE stand-in for production `src/motion/rig.ts` (frontend-engineer's
// file; strings not yet published). Label values are ANIMATION_SPECIFICATION §2 verbatim.

export type Rig = 'L' | 'M' | 'P' | 'S';

export const RIG_QUERIES: Record<Rig, string> = {
  L: '(min-width:1280px)',
  M: '(min-width:600px) and (max-width:1279px) and (orientation:landscape)',
  P: '(min-width:600px) and (max-width:1279px) and (orientation:portrait)',
  S: '(max-width:599px)',
};
export const STATIC_QUERY = '(prefers-reduced-motion:reduce), (max-height:359px)';

export function pickRig(): Rig {
  for (const r of ['L', 'M', 'P', 'S'] as Rig[]) if (matchMedia(RIG_QUERIES[r]).matches) return r;
  return 'S';
}

export const LABEL_NAMES = ['s1', 't12', 's2', 't23', 's3', 't34', 's4', 't45', 's5', 't56', 's6', 't67', 'end'] as const;
export type LabelName = (typeof LABEL_NAMES)[number];

const row = (a: number[]): Record<LabelName, number> =>
  Object.fromEntries(LABEL_NAMES.map((n, i) => [n, a[i]])) as Record<LabelName, number>;

const DESKTOP = row([0, 50, 150, 220, 310, 400, 510, 640, 790, 860, 970, 1060, 1210]);
export const LABELS: Record<Rig, Record<LabelName, number>> = {
  L: DESKTOP,
  M: DESKTOP,
  P: row([0, 45, 135, 200, 280, 360, 460, 575, 710, 775, 875, 955, 1090]),
  S: row([0, 40, 120, 180, 250, 330, 420, 540, 660, 720, 810, 890, 1010]),
};

export const HOLD_ORDER: LabelName[] = ['s4', 't45', 's5', 't56', 's6', 't67', 'end'];

// ---- URL parameters -------------------------------------------------------------------------
const q = new URLSearchParams(location.search);

export const params = {
  art: (q.get('art') === 'lite' || q.get('art') === 'full' ? q.get('art') : null) as 'lite' | 'full' | null,
  /** ?cut=N is cumulative (lines 1..N); ?cutonly=6 or ?cutonly=2,6 is an exact set. */
  cuts: parseCuts(q.get('cut'), q.get('cutonly')),
  /** report-only variant: three live ink-edge filters. Fails the fidelity gate on purpose (filteredLayers must be []). */
  filters: q.get('filters') === '1',
  /** ?at=s5 or ?at=t45+30 (label plus units) : scroll there after the hand-off (convenience for screenshots). */
  at: q.get('at'),
  audio: q.get('audio') !== 'off',
  /** scrub override for the wheel check: ?scrub=0.5|true */
  scrub: q.get('scrub'),
};

function parseCuts(cum: string | null, only: string | null): number[] {
  if (only) return only.split(',').map(Number).filter((n) => n >= 1 && n <= 6);
  const n = Number(cum ?? 0);
  return Array.from({ length: Math.max(0, Math.min(6, n)) }, (_, i) => i + 1);
}

export const isCoarse = () => matchMedia('(pointer:coarse)').matches;
