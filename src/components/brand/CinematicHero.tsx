/* eslint-disable @next/next/no-img-element -- full-bleed 배경 이미지는 raw <img> 를 쓴다.
   next/image 의 priority preload 주입이 <picture> 의 media 선택을 우회해
   모바일에서 desktop 원본까지 받는 문제가 실측 확인됐다(docs/05 §5). */
import type { Asset } from '@/content/assets';
import { Reveal } from '@/components/interactive/Reveal';

type Cta = { label: string; href: string; primary?: boolean };

/**
 * 첫 화면. 88~96svh full-screen.
 * 이미지는 카드에 넣지 않는다 — full-bleed 배경으로 두고 gradient mask 로 텍스트와 하나의 장면을 만든다.
 * rounded 프레임·border wrapper 를 쓰지 않는다.
 */
export function CinematicHero({
  eyebrow, titleEn, titleKo, lead, ctas, badge, image, imageMobile, ambient = 'silver', align = 'bottom',
}: {
  eyebrow: string;
  titleEn?: string;
  titleKo: string;
  lead?: string;
  ctas?: Cta[];
  badge?: string;
  image: Asset;
  imageMobile?: Asset;
  ambient?: 'silver' | 'cool' | 'warm' | 'none';
  align?: 'bottom' | 'center';
}) {
  const ambientClass =
    ambient === 'cool' ? 'ambient-cool' : ambient === 'warm' ? 'ambient-warm'
    : ambient === 'silver' ? 'ambient-silver' : '';

  return (
    <section
      className={`relative flex min-h-[88svh] items-end overflow-hidden md:min-h-[94svh] ${ambientClass} ${
        align === 'center' ? 'md:items-center' : ''
      }`}
    >
      <div className="bleed mask-hero" aria-hidden="true">
        {imageMobile ? (
          <picture>
            <source media="(max-width: 767px)" srcSet={imageMobile.src} width={imageMobile.width} height={imageMobile.height} />
            <source media="(min-width: 768px)" srcSet={image.src} width={image.width} height={image.height} />
            <img src={image.src} alt="" width={image.width} height={image.height} fetchPriority="high" decoding="async" />
          </picture>
        ) : (
          <img src={image.src} alt="" width={image.width} height={image.height} fetchPriority="high" decoding="async" />
        )}
      </div>

      <div className="shell layer w-full pb-20 pt-36 md:pb-28 md:pt-44">
        <div className="max-w-[min(100%,900px)]">
          <Reveal as="p" className="eyebrow">{eyebrow}</Reveal>

          {badge && (
            <Reveal delay={1}>
              <span className="mt-6 inline-block border border-[color-mix(in_srgb,var(--color-accent)_45%,transparent)] px-3 py-1.5 text-[11px] font-medium tracking-[0.14em] text-[var(--color-accent)]">
                {badge}
              </span>
            </Reveal>
          )}

          {titleEn ? (
            <>
              <Reveal delay={1} slow><h1 className="display-hero mt-7">{titleEn}</h1></Reveal>
              <Reveal delay={2}><p className="title-ko-sm mt-7 text-[var(--color-text)]">{titleKo}</p></Reveal>
            </>
          ) : (
            <Reveal delay={1} slow><h1 className="display-en mt-7">{titleKo}</h1></Reveal>
          )}

          {lead && <Reveal delay={3}><p className="lead measure mt-7">{lead}</p></Reveal>}

          {ctas && ctas.length > 0 && (
            <Reveal delay={4}>
              <div className="mt-11 flex flex-wrap items-center gap-x-8 gap-y-4">
                {ctas.map((c) => (
                  <a key={c.href} href={c.href} className={c.primary === false ? 'cta-ghost' : 'cta-primary'}>
                    {c.label}
                    <span aria-hidden="true">→</span>
                  </a>
                ))}
              </div>
            </Reveal>
          )}
        </div>
      </div>
    </section>
  );
}
