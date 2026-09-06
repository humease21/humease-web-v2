import { Reveal } from '@/components/interactive/Reveal';

/**
 * Hero 뒤 첫 정보 구간의 정의. (요청서 §6.1)
 * 철학 문구가 아니라 '무엇인지'를 첫 문장부터 답한다.
 */
export function AnswerBlock({ term, definition }: { term: string; definition: string }) {
  return (
    <div className="measure">
      <Reveal as="p" className="eyebrow">{term}</Reveal>
      <Reveal delay={1}>
        <p className="mt-6 text-[18px] leading-[1.75] text-[var(--color-text)] md:text-[21px]">
          {definition}
        </p>
      </Reveal>
    </div>
  );
}
