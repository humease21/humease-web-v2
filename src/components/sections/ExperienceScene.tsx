import { Reveal } from '@/components/interactive/Reveal';
import { stagger } from '@/lib/stagger';
import { Arrow } from '@/components/ui/Icon';
import { A } from '@/components/ui/Link';

/**
 * 전문성 — 브랜드 다크 밴드.
 *
 * docs/01 §5 준수: 회사 경력과 개인 경력을 분리한다.
 * 아래 키워드는 **전문가 개인 경력**이라는 제목 아래에만 둔다.
 */
const KEYWORDS = [
  'Microsoft MVP',
  'Symantec',
  'Veritas',
  'Arctera',
  '기업 데이터',
  'AI 제품 개발',
];

export function ExperienceScene({ aboutCopy }: { aboutCopy?: boolean } = {}) {
  return (
    <section className="on-dark section" aria-labelledby="experience-title">
      <div className="shell">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] lg:gap-20">
          <div>
            <Reveal as="p" className="eyebrow">전문성</Reveal>
            <Reveal delay={1}>
              <h2 id="experience-title" className="heading-xl mt-4">
                {aboutCopy ? <>경험에서 축적된<br />기술의 깊이</> : <>20년의 Enterprise IT 경험,<br /><span className="text-[var(--color-brand-ink)]">AX 실행력으로</span></>}
              </h2>
            </Reveal>
            <Reveal delay={2}>
              <p className="lead measure mt-5">
                {aboutCopy
                  ? <>Enterprise IT와 데이터 컴플라이언스 현장에서 축적한 경험을 바탕으로<br className="hidden md:inline" /> 복잡한 기업 환경을 실행 가능한 구조로 전환합니다</>
                  : <>수많은 기업 IT 환경에서 문제를 해결해 온 경험을 바탕으로<br className="hidden md:inline" /> 필요한 기술을 선택하고 실행 가능한 구조로 연결합니다</>}
              </p>
            </Reveal>
            <Reveal delay={3}>
              <A href={aboutCopy ? '/contact' : '/about'} className="btn btn-secondary mt-8">
                {aboutCopy ? '함께할 프로젝트 문의' : '휴미즈 알아보기'}<Arrow />
              </A>
            </Reveal>
          </div>

          <div>
            <Reveal><h3 className="text-[15px] font-semibold text-[var(--color-muted)]">전문가 개인 경력</h3></Reveal>
            <ul className="mt-4 grid grid-cols-2 gap-3">
              {KEYWORDS.map((k, i) => (
                <Reveal as="li" key={k} delay={stagger(i)}
                  className="flex min-h-16 items-center rounded-xl border border-[var(--color-line)] bg-[var(--color-surface)] px-5 text-[17px] font-semibold text-[var(--color-text)]">
                  {k}
                </Reveal>
              ))}
            </ul>
            <p className="caption mt-4">위 항목은 구성원 개인의 경력이며, 회사의 소속·파트너 관계를 뜻하지 않습니다.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
