import { Reveal } from '@/components/interactive/Reveal';
import { stagger } from '@/lib/stagger';
import { Icon } from '@/components/ui/Icon';

/**
 * 실제 질문과 답변. (요청서 §6.1)
 * details/summary 로 구현해 펼치기 전에도 답변 텍스트가 HTML 에 있고, 키보드로 열 수 있다.
 * 질문마다 같은 상담 문구를 반복하지 않는다.
 */
export function QuestionList({
  items, heading = '자주 묻는 질문', headingLevel = 'eyebrow', lead,
}: {
  items: { q: string; a: string; note?: string }[];
  heading?: string;
  /** eyebrow — 작은 라벨, title — 구간 제목(h2) */
  headingLevel?: 'eyebrow' | 'title';
  lead?: React.ReactNode;
}) {
  if (!items.length) return null;
  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,4fr)_minmax(0,8fr)] lg:gap-16">
      <div>
        {headingLevel === 'title' ? (
          <>
            <Reveal as="p" className="eyebrow">FAQ</Reveal>
            <Reveal delay={1}><h2 className="heading-xl mt-4">{heading}</h2></Reveal>
          </>
        ) : (
          <Reveal as="h2" className="heading-lg">{heading}</Reveal>
        )}
        {lead && <Reveal delay={2}><p className="body mt-4">{lead}</p></Reveal>}
      </div>
      <div className="border-t border-[var(--color-line)]">
        {items.map((it, i) => (
          <Reveal key={it.q} delay={stagger(i)}>
            <details className="group border-b border-[var(--color-line)]">
              <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-6 py-5 text-[17px] font-semibold leading-snug text-[var(--color-text)] [&::-webkit-details-marker]:hidden">
                {it.q}
                <Icon name="chevron-down" size={20} className="shrink-0 text-[var(--color-muted)] transition-transform duration-200 group-open:rotate-180" />
              </summary>
              <div className="pb-6 pr-10">
                <p className="body">{it.a}</p>
                {it.note && <p className="caption mt-2">{it.note}</p>}
              </div>
            </details>
          </Reveal>
        ))}
      </div>
    </div>
  );
}
