import { Reveal } from '@/components/interactive/Reveal';

/**
 * Hero 뒤 첫 정보 구간의 정의. (요청서 §6.1)
 * 철학 문구가 아니라 '무엇인지'를 첫 문장부터 답한다.
 */
export function AnswerBlock({ term, definition }: { term: string; definition: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-[var(--color-line)] bg-[var(--color-surface)] p-6 md:p-10">
      <Reveal as="p" className="eyebrow">{term}</Reveal>
      <Reveal delay={1}>
        <p className="mt-4 text-[19px] font-medium leading-[1.7] text-[var(--color-text)] md:text-[22px]">
          {definition}
        </p>
      </Reveal>
    </div>
  );
}
