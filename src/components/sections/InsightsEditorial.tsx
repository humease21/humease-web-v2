import { Reveal } from '@/components/interactive/Reveal';
import { stagger } from '@/lib/stagger';
import { company } from '@/content/company';
import { Arrow } from '@/components/ui/Icon';
import { A } from '@/components/ui/Link';

export type Article = {
  title: string; date: string; category: string; href: string; summary: string; image?: string;
};

/** 실제 글이 없으면 dummy article 을 만들지 않는다(docs/03 P12). 블로그로 안내하는 배너만 둔다. */
export function InsightsEditorial({ articles }: { articles: Article[] }) {
  if (articles.length === 0) {
    return (
      <div className="grid gap-8 rounded-2xl border border-[var(--color-line)] bg-[var(--color-surface)] p-6 md:p-10 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] lg:items-center lg:gap-12">
        <div>
          <Reveal as="p" className="eyebrow">인사이트</Reveal>
          <Reveal delay={1}><h2 className="heading-xl mt-4">기술에서,<br />실제 적용까지</h2></Reveal>
          <Reveal delay={2}>
            <p className="lead mt-5">기업 데이터 관리와 AX 전환에 따른 휴미즈 컨설팅을 만나보세요</p>
          </Reveal>
        </div>
        <Reveal delay={3}>
          <div>
            <p className="body">휴미즈 블로그에서 다양한 뉴스와 AI 정보들을 확인하실 수 있습니다</p>
            <A href={company.blogUrl} target="_blank" rel="noopener noreferrer" className="btn btn-secondary mt-6">
              휴미즈 블로그 보기<Arrow external /><span className="sr-only">(새 탭에서 열림)</span>
            </A>
          </div>
        </Reveal>
      </div>
    );
  }

  return (
    <div>
      <Reveal as="p" className="eyebrow">인사이트</Reveal>
      <ul className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {articles.map((a, i) => (
          <Reveal as="li" key={a.href} delay={stagger(i)} className="card card-link">
            <p className="caption">{a.category} · {a.date}</p>
            <h3 className="heading-md mt-2"><A href={a.href} className="stretched">{a.title}</A></h3>
            <p className="body-sm mt-3">{a.summary}</p>
          </Reveal>
        ))}
      </ul>
    </div>
  );
}
