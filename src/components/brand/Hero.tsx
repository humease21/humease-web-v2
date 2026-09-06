import Image from 'next/image';
import type { Asset } from '@/content/assets';
import { ButtonLink } from '@/components/ui/Button';

type Cta = { label: string; href: string };
type Props = {
  eyebrow: string;
  titleEn?: string;
  titleKo: string;
  lead: string;
  ctas?: Cta[];
  badge?: string;
  image?: Asset;
  imageMobile?: Asset;
  priority?: boolean;
};

/** docs/02 §4 — 좌 52–58% / 우 42–48%, min-height 640px, 100vh 고정 금지 */
export function Hero({ eyebrow, titleEn, titleKo, lead, ctas, badge, image, imageMobile, priority }: Props) {
  return (
    <section className="border-b border-[var(--color-line)]/40">
      <div className="shell grid items-center gap-10 py-16 md:min-h-[640px] md:grid-cols-[55fr_45fr] md:gap-14 md:py-24">
        <div>
          <p className="eyebrow">{eyebrow}</p>
          {badge && (
            <p className="mt-4 inline-block rounded-full border border-[var(--color-accent)]/50 px-3 py-1 text-xs font-medium text-[var(--color-accent)]">
              {badge}
            </p>
          )}
          {titleEn ? (
            <>
              <h1 className="display-en mt-5">{titleEn}</h1>
              <p className="display-ko mt-5 text-[var(--color-text)]">{titleKo}</p>
            </>
          ) : (
            <h1 className="display-ko mt-5">{titleKo}</h1>
          )}
          <p className="body-lg prose-measure mt-6">{lead}</p>
          {ctas && ctas.length > 0 && (
            <div className="mt-9 flex flex-wrap gap-3">
              {ctas.map((c, i) => (
                <ButtonLink key={c.href} href={c.href} variant={i === 0 ? 'primary' : 'ghost'}>
                  {c.label}
                </ButtonLink>
              ))}
            </div>
          )}
        </div>

        {image && (
          <div className="overflow-hidden rounded-2xl border border-[var(--color-line)]/50">
            {imageMobile ? (
              <picture>
                <source media="(max-width: 767px)" srcSet={imageMobile.src} />
                <Image
                  src={image.src} alt={image.alt} width={image.width} height={image.height}
                  priority={priority} sizes="(max-width: 767px) 100vw, 45vw"
                  className="h-full w-full object-cover"
                />
              </picture>
            ) : (
              <Image
                src={image.src} alt={image.alt} width={image.width} height={image.height}
                priority={priority} sizes="(max-width: 767px) 100vw, 45vw"
                className="h-full w-full object-cover"
              />
            )}
          </div>
        )}
      </div>
    </section>
  );
}
