/**
 * Hairline architectural section of the chapel (pure SVG, original drawing).
 * Renders the FINAL state of `step` from props alone (reduced-motion path renders 3 copies);
 * the animated Method renders step={3} and GSAP hides layers at timeline build (data-layer hooks).
 */
type Props = { step: 1 | 2 | 3; idPrefix: string; animated?: boolean };

const BEAMS = [
  { id: 'altar', from: [655, 92], to: [[600, 318], [712, 318]], label: '12° · 40 lux', lx: 594, ly: 300, anchor: 'end' },
  { id: 'threshold', from: [170, 120], to: [[108, 318], [190, 318]], label: '24° · 8 lux', lx: 182, ly: 136 }, // beside the beam's source: inside its own cone it was crossed by the door outline (critique r2 #2)
  // label sits LEFT of its beam (right-anchored) so it never collides with the AMBULATORY label on small screens
  { id: 'niche', from: [470, 70], to: [[512, 200], [548, 200]], label: '8° · 25 lux', lx: 500, ly: 214, anchor: 'end' },
] as { id: string; from: readonly [number, number]; to: readonly (readonly [number, number])[]; label: string; lx: number; ly: number; anchor?: 'start' | 'end' }[];

const HATCH = [
  { x: 230, y: 150, w: 300, h: 168, label: 'NAVE · ≤ 2 lux' },
  { x: 60, y: 60, w: 110, h: 90, label: 'VAULT · DARK' },
  { x: 730, y: 150, w: 70, h: 168, label: 'AMBULATORY · 0 lux' },
];

export function MethodDrawing({ step, idPrefix, animated }: Props) {
  const showHatch = step >= 1;
  const showBeams = step >= 2;
  const showCct = step >= 3;
  const p = (s: string) => `${idPrefix}-${s}`;
  return (
    <svg
      className="method-drawing"
      viewBox="0 0 860 400"
      role="img"
      aria-label={[
        'Section drawing of a small chapel.',
        showHatch && 'Hatched zones mark where darkness is protected: nave at or below 2 lux, vault dark, ambulatory 0 lux.',
        showBeams && 'Three narrow beams: altar 12 degrees 40 lux, threshold 24 degrees 8 lux, niche 8 degrees 25 lux.',
        showCct && 'A colour-temperature band shows the day running from 2200 K to 5600 K and back.',
      ].filter(Boolean).join(' ')}
      style={{ ['--beam-tint' as string]: '#d9a05b' }}
    >
      <defs>
        <pattern id={p('hatch')} width="7" height="7" patternUnits="userSpaceOnUse" patternTransform="rotate(-35)">
          <line x1="0" y1="0" x2="0" y2="7" stroke="var(--ink-muted)" strokeWidth="0.6" opacity="0.45" />
        </pattern>
        {BEAMS.map((b) => (
          <linearGradient key={b.id} id={p(`g-${b.id}`)} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="var(--beam-tint)" stopOpacity="0.85" />
            <stop offset="1" stopColor="var(--beam-tint)" stopOpacity="0.08" />
          </linearGradient>
        ))}
        <linearGradient id={p('cct')} x1="0" x2="1">
          <stop offset="0" stopColor="#ff9329" /><stop offset="0.25" stopColor="#ffd1a3" />
          <stop offset="0.5" stopColor="#ffeee3" /><stop offset="0.75" stopColor="#ffd1a3" />
          <stop offset="1" stopColor="#ff9329" />
        </linearGradient>
      </defs>

      {/* room: ground, walls, barrel vault, clerestory slit, altar, niche, door */}
      <g data-layer="room" fill="none" stroke="var(--ink-muted)" strokeWidth="1" vectorEffect="non-scaling-stroke">
        <line x1="20" y1="318" x2="840" y2="318" />
        <path d="M60 318 V150 M800 318 V150" />
        <path d="M60 150 Q430 -40 800 150" />
        <path d="M60 150 H800" strokeDasharray="2 5" opacity="0.5" />
        <rect x="600" y="270" width="112" height="48" />
        <path d="M512 200 V150 Q530 128 548 150 V200 Z" />
        <rect x="108" y="230" width="60" height="88" />
        <path d="M32 112 L60 104 M32 128 L60 120" opacity="0.7" />
        <circle cx="655" cy="92" r="3" /><circle cx="170" cy="120" r="3" /><circle cx="470" cy="70" r="3" />
      </g>

      {showHatch && (
        <>
          <rect data-layer="flood" x="60" y="40" width="740" height="278" fill="var(--ground)" opacity={animated ? 0 : 0.82} />
          <g data-layer="hatch">
            {HATCH.map((h) => (
              <g key={h.label} data-zone>
                <rect x={h.x} y={h.y} width={h.w} height={h.h} fill={`url(#${p('hatch')})`} />
                {/* narrow zones (the ambulatory) carry a vertical label along the zone, as architectural drawings do:
                    it can't collide with neighbouring labels at any width (CD Gate B fix 6) */}
                {h.w < 100
                  ? <text data-label className="mono" x={h.x + h.w / 2 + 4} y={h.y + h.h - 8} transform={`rotate(-90 ${h.x + h.w / 2 + 4} ${h.y + h.h - 8})`} fill="var(--ink)" fontSize="11" letterSpacing="0.08em">{h.label}</text>
                  : <text data-label className="mono" x={h.x + 6} y={h.y + 16} fill="var(--ink)" fontSize="11" letterSpacing="0.08em">{h.label}</text>}
              </g>
            ))}
          </g>
        </>
      )}

      {showBeams && BEAMS.map((b) => (
        <g key={b.id} data-layer="beam" data-beam={b.id}>
          <polygon
            points={`${b.from[0]},${b.from[1]} ${b.to[0][0]},${b.to[0][1]} ${b.to[1][0]},${b.to[1][1]}`}
            fill={`url(#${p(`g-${b.id}`)})`}
          />
          <text data-label className="mono" x={b.lx} y={b.ly - 8} textAnchor={b.anchor ?? 'start'} fill="var(--accent-warm)" fontSize="11">{b.label}</text>
        </g>
      ))}

      {showCct && (
        <g data-layer="cct">
          <rect x="60" y="358" width="740" height="8" fill={`url(#${p('cct')})`} opacity="0.85" />
          <line data-cct-marker x1="60" y1="350" x2="60" y2="374" stroke="var(--ink)" strokeWidth="1.5" />
          <g className="mono" fill="var(--ink-muted)" fontSize="11">
            <text x="60" y="392">00:00 · 2200 K</text><text x="430" y="392" textAnchor="middle">13:30 · 5600 K</text><text x="800" y="392" textAnchor="end">24:00 · 2200 K</text>
          </g>
        </g>
      )}
      {/* room labels last so neither the dark flood nor the hatching paints over them */}
      <g className="method-drawing__labels mono" fill="var(--ink-muted)" fontSize="11">
        <text x="612" y="338">ALTAR</text><text x="110" y="338">THRESHOLD</text><text x="506" y="218">NICHE</text>
        <text x="20" y="100">E. SLIT</text>
      </g>
    </svg>
  );
}
