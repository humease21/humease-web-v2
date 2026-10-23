/* eslint-disable @next/next/no-img-element -- 사전 최적화된 정적 자산을 raw <img> 로 쓴다(docs/05 §5). */
import type { Asset } from '@/content/assets';
import { Reveal } from '@/components/interactive/Reveal';
import { stagger } from '@/lib/stagger';
import { Arrow, Icon, type IconName } from '@/components/ui/Icon';
import { A } from '@/components/ui/Link';

export type Capability = { title: string; body: string; icon?: IconName; href?: string };

/**
 * 사업영역 소개 블록 — 메시지와 비주얼 패널, 그 아래 핵심 역량 목록.
 * 역량은 카드 반복 대신 아이콘 + 짧은 설명의 그리드로 둔다.
 */
export function FeatureSplit({
  index, eyebrow, title, lead, capabilities, cta, image, reverse, focus = '72% 50%', headingId,
}: {
  index?: string;
  eyebrow: string;
  title: React.ReactNode;
  lead: React.ReactNode;
  capabilities: Capability[];
  cta?: { label: string; href: string };
  image?: Asset;
  reverse?: boolean;
  focus?: string;
  headingId?: string;
}) {
  const cols = capabilities.length === 4 ? 'sm:grid-cols-2 xl:grid-cols-4' : 'sm:grid-cols-2 lg:grid-cols-3';
  return (
    <div>
      <div className={`grid items-center gap-10 lg:grid-cols-2 lg:gap-16 ${reverse ? 'lg:[&>*:first-child]:order-2' : ''}`}>
        <div>
          <Reveal as="p" className="eyebrow">
            {index && <span className="tabular-nums text-[var(--color-muted)]">{index}</span>}
            {eyebrow}
          </Reveal>
          <Reveal delay={1}><h2 id={headingId} className="heading-xl mt-4">{title}</h2></Reveal>
          <Reveal delay={2}><p className="lead measure mt-5">{lead}</p></Reveal>
          {cta && (
            <Reveal delay={3}>
              <A href={cta.href} className="btn btn-secondary mt-8">{cta.label}<Arrow /></A>
            </Reveal>
          )}
        </div>
        {image && (
          <Reveal delay={2}>
            <div className="media aspect-[16/10]" aria-hidden="true">
              <img src={image.src} alt="" width={image.width} height={image.height} loading="lazy" decoding="async" style={{ objectPosition: focus }} />
            </div>
          </Reveal>
        )}
      </div>

      <ul className={`mt-12 grid gap-x-8 gap-y-8 border-t border-[var(--color-line)] pt-10 md:mt-14 ${cols}`}>
        {capabilities.map((c, i) => (
          <Reveal as="li" key={c.title} delay={stagger(i)} className="flex gap-4">
            <span className="icon-tile"><Icon name={c.icon ?? 'check'} /></span>
            <div>
              <h3 className="heading-md">
                {c.href ? <A href={c.href} className="underline decoration-[var(--color-line-strong)] underline-offset-[6px] hover:decoration-current">{c.title}</A> : c.title}
              </h3>
              <p className="body-sm mt-1.5">{c.body}</p>
            </div>
          </Reveal>
        ))}
      </ul>
    </div>
  );
}
