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
  /** Art direction: a separate wide composition for >= 1024 px strips, where a portrait plate would show ~31% of its height. */
  wide?: { id: string; widths: number[] };
};

export const PORTRAIT_MEDIA = '(max-aspect-ratio: 1/1)';
export const WIDE_MEDIA = '(min-width: 64rem) and (min-aspect-ratio: 1001/1000)'; // landscape only: a portrait tablet would stretch it

export function Picture({ id, widths, sizes, alt, width, height, priority, className, portrait, wide }: Props) {
  const setOf = (pid: string, ws: number[], fmt: string) => ws.map((w) => `${BASE}${pid}-${w}.${fmt} ${w}w`).join(', ');
  const set = (fmt: string) => setOf(id, widths, fmt);
  const fallback = `${BASE}${id}-${widths[Math.min(1, widths.length - 1)]}.webp`;
  return (
    <picture className={className}>
      {portrait && <source type="image/avif" media={PORTRAIT_MEDIA} srcSet={setOf(portrait.id, portrait.widths, 'avif')} sizes={sizes} />}
      {portrait && <source type="image/webp" media={PORTRAIT_MEDIA} srcSet={setOf(portrait.id, portrait.widths, 'webp')} sizes={sizes} />}
      {wide && <source type="image/avif" media={WIDE_MEDIA} srcSet={setOf(wide.id, wide.widths, 'avif')} sizes={sizes} />}
      {wide && <source type="image/webp" media={WIDE_MEDIA} srcSet={setOf(wide.id, wide.widths, 'webp')} sizes={sizes} />}
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
