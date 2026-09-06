import { Reveal } from '@/components/interactive/Reveal';
import { company } from '@/content/company';
import { A } from '@/components/ui/Link';

export type Article = {
  title: string; date: string; category: string; href: string; summary: string; image?: string;
};

/**
 * premium editorial/magazine 스타일. 3-card SaaS 레이아웃을 쓰지 않는다.
 * 실제 글이 없으면 dummy article 을 만들지 않는다(docs/03 P12).
 */
export function InsightsEditorial({ articles, compact }: { articles: Article[]; compact?: boolean }) {
  if (articles.length === 0) {
    return (
      <div className={compact ? '' : 'max-w-[820px]'}>
        <Reveal as="p" className="eyebrow">인사이트</Reveal>
        <Reveal delay={1} slow>
          <h2 className="title-ko mt-6">현장에서 생각하고, 기술로 답합니다.</h2>
        </Reveal>
        <Reveal delay={2}>
          <p className="lead measure mt-8">
            기업 데이터와 AI 서비스에 대한 휴미즈의 생각과 기록을 만나보세요.
          </p>
        </Reveal>
        <Reveal delay={3}>
          <p className="lead measure mt-5">
            휴미즈 블로그에서 기술과 프로젝트에 대한 기록을 확인하실 수 있습니다.
          </p>
        </Reveal>
        <Reveal delay={4}>
          <A href={company.blogUrl} target="_blank" rel="noopener noreferrer" className="cta-ghost mt-10">
            휴미즈 블로그 보기<span aria-hidden="true">↗</span>
          </A>
        </Reveal>
      </div>
    );
  }

  const [lead, ...rest] = articles;
  return (
    <div>
      <Reveal as="p" className="eyebrow">인사이트</Reveal>
      <article className="mt-10 border-t border-[color-mix(in_srgb,var(--color-line)_55%,transparent)] pt-10">
        <Reveal>
          <p className="text-[12px] uppercase tracking-[0.16em] text-[var(--color-accent)]">
            {lead.category} · {lead.date}
          </p>
          <A href={lead.href} className="mt-4 block title-ko-sm hover:text-[var(--color-accent)]">{lead.title}</A>
          <p className="lead measure mt-5">{lead.summary}</p>
        </Reveal>
      </article>
      {rest.length > 0 && (
        <ul className="mt-4">
          {rest.map((a, i) => (
            <Reveal as="li" key={a.href} delay={((i % 3) + 1) as 1 | 2 | 3} className="cap-row">
              <p className="text-[12px] uppercase tracking-[0.16em] text-[var(--color-muted)]">{a.category} · {a.date}</p>
              <A href={a.href} className="text-[17px] font-medium hover:text-[var(--color-accent)]">{a.title}</A>
            </Reveal>
          ))}
        </ul>
      )}
    </div>
  );
}
