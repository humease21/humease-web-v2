import { Reveal } from '@/components/interactive/Reveal';
import { Arrow } from '@/components/ui/Icon';
import { A } from '@/components/ui/Link';

type Tone = 'default' | 'alt' | 'dark';

/** 페이지의 한 구간. 배경 톤은 default(오프화이트) · alt(보조 톤) · dark(브랜드 다크 밴드) 셋뿐이다. */
export function Section({
  id, tone = 'default', tight, className = '', children, labelledBy,
}: {
  id?: string;
  tone?: Tone;
  tight?: boolean;
  className?: string;
  children: React.ReactNode;
  labelledBy?: string;
}) {
  const toneCls = tone === 'alt' ? 'section-alt' : tone === 'dark' ? 'on-dark' : '';
  return (
    <section id={id} aria-labelledby={labelledBy} className={`${tight ? 'section-tight' : 'section'} ${toneCls} scroll-mt-20 ${className}`}>
      <div className="shell">{children}</div>
    </section>
  );
}

/** 구간 머리글 — eyebrow · 제목 · 리드 · 보조 링크. */
export function SectionHeader({
  eyebrow, title, lead, action, align = 'left', id, level = 2, className = '',
}: {
  eyebrow?: string;
  title: React.ReactNode;
  lead?: React.ReactNode;
  action?: { label: string; href: string; external?: boolean };
  align?: 'left' | 'center' | 'split';
  id?: string;
  level?: 1 | 2;
  className?: string;
}) {
  const H = level === 1 ? 'h1' : 'h2';
  const heading = (
    <>
      {eyebrow && <Reveal as="p" className="eyebrow">{eyebrow}</Reveal>}
      <Reveal delay={1}><H id={id} className={`heading-xl ${eyebrow ? 'mt-4' : ''}`}>{title}</H></Reveal>
    </>
  );
  const actionEl = action && (
    <Reveal delay={2}>
      <A href={action.href} className="link-arrow" {...(action.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}>
        {action.label}<Arrow external={action.external} />
        {action.external && <span className="sr-only">(새 탭에서 열림)</span>}
      </A>
    </Reveal>
  );

  if (align === 'split') {
    return (
      <div className={`grid gap-6 lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)] lg:gap-16 ${className}`}>
        <div>{heading}</div>
        <div className="lg:pt-9">
          {lead && <Reveal delay={2}><p className="lead">{lead}</p></Reveal>}
          {actionEl && <div className="mt-5">{actionEl}</div>}
        </div>
      </div>
    );
  }

  return (
    <div className={`${align === 'center' ? 'mx-auto max-w-[760px] text-center' : 'max-w-[780px]'} ${className}`}>
      {heading}
      {lead && <Reveal delay={2}><p className={`lead mt-5 ${align === 'center' ? 'mx-auto' : ''}`}>{lead}</p></Reveal>}
      {actionEl && <div className="mt-6">{actionEl}</div>}
    </div>
  );
}

/** 제목과 본문 문단 — 2열(제목 | 본문) 편집형 블록. */
export function Statement({
  eyebrow, title, paragraphs, cta, id,
}: {
  eyebrow?: string;
  title: React.ReactNode;
  paragraphs?: React.ReactNode[];
  cta?: { label: string; href: string; primary?: boolean };
  id?: string;
}) {
  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)] lg:gap-16">
      <div>
        {eyebrow && <Reveal as="p" className="eyebrow">{eyebrow}</Reveal>}
        <Reveal delay={1}><h2 id={id} className={`heading-xl ${eyebrow ? 'mt-4' : ''}`}>{title}</h2></Reveal>
      </div>
      <div className="lg:pt-9">
        {paragraphs?.map((p, i) => (
          <Reveal key={i} delay={2}><p className={`lead ${i > 0 ? 'mt-5' : ''}`}>{p}</p></Reveal>
        ))}
        {cta && (
          <Reveal delay={3}>
            <A href={cta.href} className={cta.primary ? 'btn btn-primary mt-8' : 'link-arrow mt-6'}>
              {cta.label}<Arrow />
            </A>
          </Reveal>
        )}
      </div>
    </div>
  );
}
