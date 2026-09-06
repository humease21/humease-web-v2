import { Reveal } from '@/components/interactive/Reveal';

/**
 * Experience — 작은 경력 카드 나열 대신 대형 문장 + 키워드 editorial layout.
 *
 * docs/01 §5 준수: 회사 경력과 개인 경력을 분리한다.
 * 아래 키워드는 **전문가 개인 경력**이라는 제목 아래에만 둔다.
 * 현재 소속·공식 파트너 관계로 오인될 표현을 쓰지 않는다(과거 이력임을 명시).
 */
const KEYWORDS = [
  'Microsoft MVP',
  'Symantec',
  'Veritas',
  'Arctera',
  'Enterprise Data',
  'AI Product Development',
];

export function ExperienceScene({ aboutCopy }: { aboutCopy?: boolean } = {}) {
  return (
    <section className="scene scene-tall relative overflow-hidden">
      <div className="shell w-full">
        <div className="grid gap-14 lg:grid-cols-[minmax(0,6fr)_minmax(0,4fr)] lg:gap-24">
          <div>
            <Reveal as="p" className="eyebrow">EXPERTISE, APPLIED</Reveal>
            <Reveal delay={1} slow>
              <p className="display-en mt-7">
                20+ years of<br />Enterprise IT experience.<br />
                <span className="text-[var(--color-accent)]">Now applied to AI.</span>
              </p>
            </Reveal>
            <Reveal delay={2}>
              <h2 className="title-ko-sm mt-10">기술의 깊이는, 문제를 해결해 온 경험에서 나옵니다.</h2>
            </Reveal>
            <Reveal delay={3}>
              <p className="lead measure mt-7">
                기업 데이터 환경과 운영 제약을 이해하는 전문성을 바탕으로, 필요한 기술을 선택하고 실행 가능한 구조를 설계합니다.
              </p>
            </Reveal>
            {/* docs/03 P02 승인 공개 문구 — 회사소개에서만 노출한다 */}
            {aboutCopy && (
              <Reveal delay={3}>
                <p className="lead measure mt-5">
                  Enterprise IT와 데이터 컴플라이언스에 대한 실무 경험을 바탕으로 설계와 구현을 지원합니다.
                </p>
              </Reveal>
            )}
            <Reveal delay={4}>
              <a href={aboutCopy ? '/contact' : '/about'} className="cta-ghost mt-11">
                {aboutCopy ? '함께할 프로젝트 문의' : '휴미즈 알아보기'}<span aria-hidden="true">→</span>
              </a>
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
                  <span className="block border-t border-[color-mix(in_srgb,var(--color-line)_55%,transparent)] py-4 font-[family-name:var(--font-display)] text-[20px] tracking-[-0.01em] text-[var(--color-text)] md:text-[26px]">
                    {k}
                  </span>
                </Reveal>
              ))}
            </ul>
            <Reveal delay={4}>
              <p className="mt-6 text-[13px] leading-relaxed text-[var(--color-muted)]">
                개인이 쌓아 온 경력이며, 회사의 현재 소속·공식 파트너 관계를 뜻하지 않습니다.
              </p>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
