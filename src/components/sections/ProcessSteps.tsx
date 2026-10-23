import { Reveal } from '@/components/interactive/Reveal';
import { stagger } from '@/lib/stagger';

/** 단계형 진행 방식. 데스크톱은 가로 단계, 모바일은 세로 목록. 순서가 의미이므로 <ol> 이다. */
export function ProcessSteps({ steps }: { steps: { k: string; v?: string }[] }) {
  const cols = steps.length === 4 ? 'grid-cols-2 lg:grid-cols-4' : 'md:grid-cols-3';
  return (
    <ol className={`grid gap-4 ${cols}`}>
      {steps.map((s, i) => (
        <Reveal as="li" key={s.k} delay={stagger(i)} className="card">
          <span className="text-[14px] font-semibold tabular-nums text-[var(--color-brand-ink)]">
            {String(i + 1).padStart(2, '0')}
          </span>
          <h3 className="heading-lg mt-3">{s.k}</h3>
          {s.v && <p className="body-sm mt-2">{s.v}</p>}
        </Reveal>
      ))}
    </ol>
  );
}
