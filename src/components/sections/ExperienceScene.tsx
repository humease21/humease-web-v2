import { Reveal } from '@/components/interactive/Reveal';
import { A } from '@/components/ui/Link';

/**
 * Experience — 작은 경력 카드 나열 대신 대형 문장 + 키워드 editorial layout.
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
    <section className="scene scene-tall relative overflow-hidden">
      <div className="shell w-full">
        <div className="grid gap-14 lg:grid-cols-[minmax(0,6fr)_minmax(0,4fr)] lg:gap-24">
          <div>
            <Reveal as="p" className="eyebrow">전문성</Reveal>
            <Reveal delay={1} slow>
              {aboutCopy ? (
                <p className="display-ko mt-7">경험에서 축적된<br />기술의 깊이</p>
              ) : (
                <p className="display-ko mt-7">
                  <span className="text-[clamp(20px,2.8vw,36px)]">20년의 Enterprise IT 경험,</span><br />
                  <span className="text-[var(--color-accent)]">AX 실행력으로</span>
                </p>
              )}
            </Reveal>
            <Reveal delay={3}>
              <p className="lead measure mt-7">
                {aboutCopy
                  ? <>Enterprise IT와 데이터 컴플라이언스<br className="sm:hidden" /> 현장에서 축적한 경험을 바탕으로<br />복잡한 기업 환경을<br className="sm:hidden" /> 실행 가능한 구조로 전환합니다</>
                  : <>수많은 기업 IT 환경에서<br className="sm:hidden" /> 문제를 해결해 온 경험을 바탕으로<br />필요한 기술을 선택하고<br className="sm:hidden" /> 실행 가능한 구조로 연결합니다</>}
              </p>
            </Reveal>
            <Reveal delay={4}>
              <A href={aboutCopy ? '/contact' : '/about'} className="cta-ghost mt-11">
                {aboutCopy ? '함께할 프로젝트 문의' : '휴미즈 알아보기'}<span aria-hidden="true">→</span>
              </A>
            </Reveal>
          </div>

          <div className="self-center">
            <Reveal delay={2}>
              <p className="text-[12px] font-medium uppercase tracking-[0.18em] text-[var(--color-muted)]">
                전문가 개인 경력
              </p>
            </Reveal>
            <ul className="mt-7">
              {KEYWORDS.map((k, i) => (
                <Reveal as="li" key={k} delay={((i % 4) + 1) as 1 | 2 | 3 | 4}>
                  <span className="block border-t border-[color-mix(in_srgb,var(--color-line)_55%,transparent)] py-4 font-[family-name:var(--font-sans)] text-[20px] tracking-[-0.01em] text-[var(--color-text)] md:text-[26px]">
                    {k}
                  </span>
                </Reveal>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
