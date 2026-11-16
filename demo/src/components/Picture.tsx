/** Responsive AVIF/WebP <picture> for assets produced by ai-visual-pipeline/optimize-images.mjs (`<id>-<w>.<fmt>`). */
const BASE = `${import.meta.env.BASE_URL}media/`;

type Props = {
  id: string;
  widths: number[];
  sizes: string;
  alt: string;
  width: number;   // intrinsic aspect (any unit) to reserve space → no CLS
  height: number;
  priority?: boolean;
  className?: string;
  /** Art direction: a separate composition for portrait viewports (e.g. hero with the light above the text). */
  portrait?: { id: string; widths: number[] };
};

export const PORTRAIT_MEDIA = '(max-aspect-ratio: 1/1)';

export function Picture({ id, widths, sizes, alt, width, height, priority, className, portrait }: Props) {
  const setOf = (pid: string, ws: number[], fmt: string) => ws.map((w) => `${BASE}${pid}-${w}.${fmt} ${w}w`).join(', ');
  const set = (fmt: string) => setOf(id, widths, fmt);
  const fallback = `${BASE}${id}-${widths[Math.min(1, widths.length - 1)]}.webp`;
  return (
    <picture className={className}>
      {portrait && <source type="image/avif" media={PORTRAIT_MEDIA} srcSet={setOf(portrait.id, portrait.widths, 'avif')} sizes={sizes} />}
      {portrait && <source type="image/webp" media={PORTRAIT_MEDIA} srcSet={setOf(portrait.id, portrait.widths, 'webp')} sizes={sizes} />}
      <source type="image/avif" srcSet={set('avif')} sizes={sizes} />
      <source type="image/webp" srcSet={set('webp')} sizes={sizes} />
      <img
        src={fallback}
        alt={alt}
        width={width}
        height={height}
        loading={priority ? 'eager' : 'lazy'}
        decoding="async"
        fetchPriority={priority ? 'high' : 'auto'}
      />
    </picture>
  );
}
