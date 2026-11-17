/** All copy is from studio/CREATIVE_DIRECTION.md (approved). Penumbra and every project are fictional. */

export type ProjectType = 'Sacred' | 'Museum' | 'House' | 'Hospitality';

export type Project = {
  slug: string;
  no: string;
  name: string;
  place: string;
  year: number;
  type: ProjectType;
  typeLabel: string;
  intent: string;
  spec: string;
  cct: [number, number];
  featured: boolean;
  plate?: string;          // public/media basename
  /** vertical focal point of the plate for wide crops (object-position y %): the plates are portrait 4:5, and on the
   *  ≥ 1024 px detail hero only ~31 % of their height shows. Measured as the centroid of the brightest 5 % of pixels
   *  (the subject is the light), then solved so the strip centres on it; capped at 100 %. */
  focusY?: number;
  alt?: string;
  narrative?: string[];
  hours?: { time: string; k: number | null; note: string }[];
};

export const site = {
  name: 'Penumbra',
  email: 'studio@penumbra.example',
  h1: 'We design the dark first.',
  sub: 'Penumbra is a lighting atelier in Lisbon. Sacred spaces, museums, hotels and houses, lit with precision hour by hour.',
  manifesto:
    'Most rooms are over-lit. We start by deciding where darkness must stay — over the nave, behind the vitrine, along the corridor at night. Then we place light only where it gives meaning, at the temperature the hour asks for. Shadow is not what is left over. It is the first thing we\u00a0design.',
  manifestoMark: 'where darkness must stay',
  method: [
    { title: 'Survey the dark.', text: 'We map where shadow must remain before a single fitting is drawn.' },
    { title: 'Place the light.', text: 'Each source earns its position with an angle, a surface and a reason.' },
    { title: 'Schedule the hour.', text: 'Colour temperature and level are specified for every hour, from dawn to the last visitor.' },
  ],
  methodClose: 'Every hour has its own light.',
  hourIntro: 'Drag through a day in the Capela do Silêncio. Watch where the sun stops and we begin.',
  atelier: 'Nine people in Lisbon. Our luminaires are spun, blown and finished by hand, two streets away.',
  contact: "Send us your plans. We'll show you where the dark should stay.",
  cta: 'Start a project',
  secondaryCta: 'See the room',
  footer: 'Penumbra — Atelier de Luz · Rua fictícia 12, Lisbon · A fictional studio, made as a demo.',
};

export const projects: Project[] = [
  {
    slug: 'capela-do-silencio', no: '01', name: 'Capela do Silêncio', place: 'Évora, Portugal', year: 2025,
    type: 'Sacred', typeLabel: 'Sacred space', intent: 'One slit of dawn; the altar answers it at night.',
    spec: '2400–2700 K · 40 lux · 3 sources', cct: [2200, 5800], featured: true, plate: 'capela-do-silencio', focusY: 40,
    alt: 'A dark barrel-vaulted nave; a single blade of dawn light from a high slit falls on the limewashed apse wall.',
    narrative: [
      'A sixteenth-century chapel had been lit like a supermarket: eleven floodlights, one level, all day.',
      'We removed every fitting, then waited a year of mornings. The east slit already did the most important work at dawn — so the scheme begins by staying out of its way.',
      'At night three concealed sources take over: a 2700 K wash on the altar, a 2200 K mark at the door, and nothing at all over the nave.',
    ],
    hours: [
      { time: '06:10', k: 2400, note: 'Daylight only' }, { time: '10:00', k: 5000, note: 'Daylight only' },
      { time: '13:30', k: 5800, note: 'Slit shaded' }, { time: '18:20', k: 3000, note: 'Altar at 20%' },
      { time: '21:00', k: 2700, note: 'Nave dark' }, { time: '00:00', k: 2200, note: 'Door only' },
    ],
  },
  {
    slug: 'museu-das-mares', no: '02', name: 'Museu das Marés', place: 'Peniche, Portugal', year: 2024,
    type: 'Museum', typeLabel: 'Museum', intent: 'Vitrines glow like rock pools in a dark hall.',
    spec: '4000 K · 50 lux on objects · 2 lux hall', cct: [3000, 4000], featured: true, plate: 'museu-das-mares', focusY: 100,
    alt: 'A dark exhibition hall with three low vitrines glowing from within, their light pooling on a polished floor.',
    narrative: [
      'A maritime collection in a former cannery: salt-fragile objects, a hall the size of a hangar.',
      'Light lives inside the vitrines only. The hall itself stays at two lux, so the cases read like rock pools at low tide and conservation limits are met by design, not by dimming.',
    ],
    hours: [
      { time: '10:00', k: 4000, note: 'Opening' }, { time: '13:00', k: 4000, note: 'Steady' }, { time: '16:00', k: 4000, note: 'Steady' },
      { time: '18:00', k: 3500, note: 'Last visitors' }, { time: '19:00', k: 3000, note: 'Cleaning' }, { time: '00:00', k: null, note: 'Dark' },
    ],
  },
  {
    slug: 'casa-sombra', no: '03', name: 'Casa Sombra', place: 'Comporta, Portugal', year: 2023,
    type: 'House', typeLabel: 'Private house', intent: 'Louvre shadows that tell the time across the floor.',
    spec: '3000 K · 4 sources · daylight-led', cct: [2700, 5600], featured: true, plate: 'casa-sombra', focusY: 100,
    alt: 'Soft-edged stripes of late-afternoon louvre shadow across a concrete floor and up a wall.',
    narrative: [
      'A single-storey house in pine and sand. The architect drew deep timber louvres; we drew their shadows.',
      'Floor finishes were chosen for how they hold a soft edge. After dark, four sources at knee height continue the stripe rhythm at 3000 K.',
    ],
    hours: [
      { time: '07:00', k: 3200, note: 'East louvres' }, { time: '12:00', k: 5600, note: 'Overhead' }, { time: '17:00', k: 4200, note: 'Long stripes' },
      { time: '19:30', k: 3000, note: 'Handover' }, { time: '22:00', k: 2700, note: 'Knee height' }, { time: '00:00', k: null, note: 'Dark' },
    ],
  },
  {
    slug: 'hotel-alva', no: '04', name: 'Hotel Alva', place: 'Porto, Portugal', year: 2026,
    type: 'Hospitality', typeLabel: 'Hospitality', intent: 'Corridors lit at ankle height; faces lit only at the bar.',
    spec: '2200 K · grazing slots · 1.5 lux corridor', cct: [2200, 2700], featured: true, plate: 'hotel-alva', focusY: 95,
    alt: 'A long stone corridor in perspective, lit only by low grazing slots that leave regular warm pools on the floor.',
    narrative: [
      'Sixty rooms in a granite warehouse by the river. Guests arrive late; the building should feel like it is already asleep.',
      'Corridors are lit only at ankle height, so faces stay in shadow until the bar, where light finally rises to eye level.',
    ],
    hours: [
      { time: '08:00', k: 2700, note: 'Breakfast' }, { time: '14:00', k: 2700, note: 'Daylight-led' }, { time: '19:00', k: 2400, note: 'Bar rises' },
      { time: '22:00', k: 2200, note: 'Corridors low' }, { time: '01:00', k: 2200, note: 'Night path' }, { time: '04:00', k: 2200, note: 'Minimum' },
    ],
  },
  { slug: 'arquivo-municipal', no: '05', name: 'Arquivo Municipal', place: 'Tomar, Portugal', year: 2022, type: 'Museum', typeLabel: 'Museum', intent: 'Reading light without a single visible fitting.', spec: '3500 K · 300 lux desks', cct: [3500, 3500], featured: false },
  { slug: 'igreja-de-sao-bras', no: '06', name: 'Igreja de São Brás (restoration)', place: 'Mértola, Portugal', year: 2021, type: 'Sacred', typeLabel: 'Sacred space', intent: 'Candle-level light for a mosque-church.', spec: '2200 K · 15 lux', cct: [2200, 2400], featured: false },
  { slug: 'casa-do-patio', no: '07', name: 'Casa do Pátio', place: 'Lisbon, Portugal', year: 2022, type: 'House', typeLabel: 'Private house', intent: 'The courtyard is the only lamp.', spec: '2700 K · 2 sources', cct: [2700, 5000], featured: false },
  { slug: 'pousada-da-serra', no: '08', name: 'Pousada da Serra', place: 'Manteigas, Portugal', year: 2024, type: 'Hospitality', typeLabel: 'Hospitality', intent: 'Fireside levels after snowfall.', spec: '2200 K · dim-to-warm', cct: [1900, 2700], featured: false },
  { slug: 'galeria-do-rio', no: '09', name: 'Galeria do Rio', place: 'Coimbra, Portugal', year: 2025, type: 'Museum', typeLabel: 'Museum', intent: 'Daylight drawn down a light well onto paper.', spec: '4500 K · 50 lux', cct: [4000, 5600], featured: false },
  { slug: 'ermida-do-cabo', no: '10', name: 'Ermida do Cabo', place: 'Sagres, Portugal', year: 2023, type: 'Sacred', typeLabel: 'Sacred space', intent: 'A lamp for sailors, a dark nave for prayer.', spec: '2400 K · 1 source', cct: [2400, 2400], featured: false },
];

export const featured = projects.filter((p) => p.featured);
export const projectBySlug = (slug: string) => projects.find((p) => p.slug === slug && p.featured);

/** Kelvin → sRGB hex (Tanner Helland approximation, clamped 1000–40000 K). Used for CCT swatches. */
export function kelvinToHex(k: number): string {
  const t = Math.min(40000, Math.max(1000, k)) / 100;
  const r = t <= 66 ? 255 : 329.698727446 * Math.pow(t - 60, -0.1332047592);
  const g = t <= 66 ? 99.4708025861 * Math.log(t) - 161.1195681661 : 288.1221695283 * Math.pow(t - 60, -0.0755148492);
  const b = t >= 66 ? 255 : t <= 19 ? 0 : 138.5177312231 * Math.log(t - 10) - 305.0447927307;
  const c = (v: number) => Math.round(Math.min(255, Math.max(0, v))).toString(16).padStart(2, '0');
  return `#${c(r)}${c(g)}${c(b)}`;
}

/** Shader-rendered stills of The Hour's six presets (ai-visual-producer, lab capture mode). */
export const HOUR_STILLS = [
  { time: '06:10', minutes: 370, id: 'hour-0610' }, { time: '10:00', minutes: 600, id: 'hour-1000' },
  { time: '13:30', minutes: 810, id: 'hour-1330' }, { time: '18:20', minutes: 1100, id: 'hour-1820' },
  { time: '21:00', minutes: 1260, id: 'hour-2100' }, { time: '00:00', minutes: 0, id: 'hour-0000' },
];
const toMin = (t: string) => { const [h, m] = t.split(':').map(Number); return h * 60 + m; };
/** Nearest preset still on the 24 h circle. */
export const stillFor = (time: string) => {
  const m = toMin(time);
  return HOUR_STILLS.reduce((a, b) => (Math.abs(((b.minutes - m + 720 + 1440) % 1440) - 720) < Math.abs(((a.minutes - m + 720 + 1440) % 1440) - 720) ? b : a));
};
