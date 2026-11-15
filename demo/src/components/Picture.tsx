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
};

export function Picture({ id, widths, sizes, alt, width, height, priority, className }: Props) {
  const set = (fmt: string) => widths.map((w) => `${BASE}${id}-${w}.${fmt} ${w}w`).join(', ');
  const fallback = `${BASE}${id}-${widths[Math.min(1, widths.length - 1)]}.webp`;
  return (
    <picture className={className}>
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
