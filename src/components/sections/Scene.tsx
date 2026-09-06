/* eslint-disable @next/next/no-img-element -- full-bleed 배경 이미지는 raw <img> 를 쓴다.
   next/image 의 priority preload 주입이 <picture> 의 media 선택을 우회해
   모바일에서 desktop 원본까지 받는 문제가 실측 확인됐다(docs/05 §5). */
import type { Asset } from '@/content/assets';
import { Reveal } from '@/components/interactive/Reveal';
import { A } from '@/components/ui/Link';

type Ambient = 'cool' | 'warm' | 'silver' | 'none';

const ambientClass = (a: Ambient) =>
  a === 'cool' ? 'ambient-cool' : a === 'warm' ? 'ambient-warm' : a === 'silver' ? 'ambient-silver' : '';

/**
 * 하나의 장면. 카드 묶음이 아니라 70~100svh 안에 메시지 하나.
 * 이미지는 배경으로 깔거나 큰 비정형 crop 으로 쓰고, 프레임을 두르지 않는다.
 */
export function Scene({
  id, children, image, ambient = 'none', mask = 'scene', tall, className = '',
}: {
  id?: string;
  children: React.ReactNode;
  image?: Asset;
  ambient?: Ambient;
  mask?: 'scene' | 'soft' | 'none';
  tall?: boolean;
  className?: string;
}) {
  const maskClass = mask === 'scene' ? 'mask-scene' : mask === 'soft' ? 'mask-soft' : '';
  return (
    <section
      id={id}
      className={`scene ${tall ? 'scene-tall' : ''} overflow-hidden ${ambientClass(ambient)} ${className}`}
    >
      {image && (
        <div className={`bleed ${maskClass}`} aria-hidden="true">
          <img src={image.src} alt="" width={image.width} height={image.height} loading="lazy" decoding="async" />
        </div>
      )}
      <div className="shell layer w-full">{children}</div>
    </section>
  );
}

/** 대형 숫자 + 제목 + 짧은 문장 + capability 3~5개. 카드 그리드 금지. */
export function NumberedScene({
  ordinal, eyebrow, titleKo, lead, capabilities, cta, image, ambient, id,
}: {
  ordinal: string;
  eyebrow: string;
  titleKo: string;
  lead: string;
  capabilities: { title: string; body: string }[];
  cta?: { label: string; href: string };
  image?: Asset;
  ambient?: Ambient;
  id?: string;
}) {
  return (
    <Scene id={id} image={image} ambient={ambient} mask="scene" tall>
      <div className="grid gap-12 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] lg:gap-24">
        <div>
          <div className="flex items-start gap-7">
            <Reveal><span className="ordinal block">{ordinal}</span></Reveal>
            <Reveal delay={1} className="pt-3">
              <p className="eyebrow">{eyebrow}</p>
            </Reveal>
          </div>
          <Reveal delay={1} slow><h2 className="title-ko mt-6">{titleKo}</h2></Reveal>
          <Reveal delay={2}><p className="lead measure mt-8">{lead}</p></Reveal>
          {cta && (
            <Reveal delay={3}>
              <A href={cta.href} className="cta-ghost mt-10">{cta.label}<span aria-hidden="true">→</span></A>
            </Reveal>
          )}
        </div>

        <ul className="self-end">
          {capabilities.map((c, i) => (
            <Reveal as="li" key={c.title} delay={((i % 4) + 1) as 1 | 2 | 3 | 4} className="cap-row">
              <h3 className="text-[15px] font-semibold tracking-[-0.005em] text-[var(--color-text)]">{c.title}</h3>
              <p className="text-[15px] leading-[1.75] text-[var(--color-muted)]">{c.body}</p>
            </Reveal>
          ))}
        </ul>
      </div>
    </Scene>
  );
}

/** 편집형 본문 블록 — 반복 카드 대신 문장 중심 */
export function Statement({
  eyebrow, titleKo, paragraphs, cta, align = 'left',
}: {
  eyebrow?: string;
  titleKo: string;
  paragraphs?: string[];
  cta?: { label: string; href: string; primary?: boolean };
  align?: 'left' | 'center';
}) {
  return (
    <div className={align === 'center' ? 'mx-auto max-w-[900px] text-center' : ''}>
      {eyebrow && <Reveal as="p" className="eyebrow">{eyebrow}</Reveal>}
      <Reveal delay={1} slow><h2 className="title-ko mt-6">{titleKo}</h2></Reveal>
      {paragraphs?.map((p, i) => (
        <Reveal key={p.slice(0, 24)} delay={((i % 3) + 2) as 2 | 3 | 4}>
          <p className={`lead mt-7 ${align === 'center' ? 'mx-auto measure' : 'measure'}`}>{p}</p>
        </Reveal>
      ))}
      {cta && (
        <Reveal delay={4}>
          <A href={cta.href} className={`${cta.primary ? 'cta-primary' : 'cta-ghost'} mt-11`}>
            {cta.label}<span aria-hidden="true">→</span>
          </A>
        </Reveal>
      )}
    </div>
  );
}

/** FAQ — JS 없이도 본문이 읽혀야 한다(docs/03 §14) */
export function Faq({ items }: { items: { q: string; a: string }[] }) {
  return (
    <dl className="mt-4">
      {items.map((it, i) => (
        <Reveal key={it.q} delay={((i % 4) + 1) as 1 | 2 | 3 | 4} className="cap-row">
          <dt className="text-[15px] font-semibold text-[var(--color-text)]">{it.q}</dt>
          <dd className="text-[15px] leading-[1.75] text-[var(--color-muted)]">{it.a}</dd>
        </Reveal>
      ))}
    </dl>
  );
}
