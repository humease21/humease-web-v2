import { Reveal } from '@/components/interactive/Reveal';

/**
 * 실제 질문과 답변. (요청서 §6.1)
 * 펼치기 전에도 답변 텍스트가 HTML 에 있어야 한다 → details/summary 로 구현하고
 * 기본 열림 상태를 쓰지 않더라도 내용은 항상 DOM 에 존재한다. 키보드로 열 수 있다.
 * 질문마다 같은 상담 문구를 반복하지 않는다.
 */
export function QuestionList({
  items, heading = '자주 묻는 질문',
}: {
  items: { q: string; a: string; note?: string }[];
  heading?: string;
}) {
  if (!items.length) return null;
  return (
    <section>
      <Reveal as="p" className="eyebrow">{heading}</Reveal>
      <dl className="mt-8">
        {items.map((it, i) => (
          <Reveal key={it.q} delay={((i % 4) + 1) as 1 | 2 | 3 | 4} className="cap-row">
            <dt className="text-[15px] font-semibold leading-snug text-[var(--color-text)]">{it.q}</dt>
            <dd>
              <p className="text-[15px] leading-[1.75] text-[var(--color-muted)]">{it.a}</p>
              {it.note && (
                <p className="mt-2 text-[13px] leading-[1.7] text-[var(--color-muted)]">{it.note}</p>
              )}
            </dd>
          </Reveal>
        ))}
      </dl>
    </section>
  );
}
