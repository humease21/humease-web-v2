/* eslint-disable @next/next/no-img-element -- 사전 최적화된 정적 자산을 raw <img> 로 쓴다(docs/05 §5). */
import { PageHero } from '@/components/sections/PageHero';
import { Section, SectionHeader } from '@/components/sections/Section';
import { FeatureSplit } from '@/components/sections/FeatureSplit';
import { ProcessSteps } from '@/components/sections/ProcessSteps';
import { ClosingContact } from '@/components/sections/ClosingContact';
import { RelatedLinks, relatedServices } from '@/components/sections/RelatedLinks';
import { Reveal } from '@/components/interactive/Reveal';
import { assets } from '@/content/assets';
import { pageMeta } from '@/lib/seo';
import { metaForPath } from '@/content/search-pages';
import { Arrow } from '@/components/ui/Icon';
import { A } from '@/components/ui/Link';

export const metadata = pageMeta({ ...metaForPath('/consulting/ai-transformation'), path: '/consulting/ai-transformation' });

const PATH = '/consulting/ai-transformation';

/** 승인 카피 한 문단(P07)은 리드로 그대로 두고, 단계 이름만 시각적으로 나열한다. */
const STEPS = [{ k: '정의' }, { k: '설계' }, { k: '구현' }, { k: '점검' }];

export default function Page() {
  return (
    <>
      <PageHero
        eyebrow="AI 서비스"
        title={<>AI 도입에서,<br />AX 실행으로</>}
        lead={<>기업의 데이터와 시스템<br /> 업무 프로세스를 AI와 연결해<br className="hidden sm:inline" /> 실제 사용되는 서비스와 업무 구조를 만듭니다</>}
        ctas={[{ label: 'AI 프로젝트 상담', href: '/contact' }, { label: 'AI 포트폴리오 보기', href: '/ai-services', primary: false }]}
        image={assets.A08}
        breadcrumbs={[{ name: '홈', href: '/' }, { name: '사업영역' }, { name: 'AI 서비스', href: PATH }]}
      />

      <Section labelledBy="offer-title">
        <FeatureSplit
          eyebrow="제공 영역"
          headingId="offer-title"
          title="설계 · 자동화 · 구현"
          lead="작게 검증하고, 필요한 만큼 확장합니다."
          capabilities={[
            { title: 'AI 서비스 설계·구현', body: '대화형 서비스와 AI 기능을 사용자 경험에 맞게 구체화합니다.', icon: 'chat' },
            { title: '업무 자동화·에이전트', body: '반복 업무와 정보 흐름을 분석하고, 검증 가능한 자동화 범위를 설계합니다.', icon: 'flow' },
            { title: '웹 애플리케이션·MVP', body: '핵심 가설을 확인할 수 있는 사용 흐름과 구현 범위를 정합니다.', icon: 'code' },
          ]}
          image={assets.A09}
        />
      </Section>

      <Section tone="alt" labelledBy="ai-process-title">
        <SectionHeader
          align="split"
          eyebrow="진행 방식"
          id="ai-process-title"
          title={<>PoC를 넘어,<br />실제 운영으로</>}
          lead="문제와 성공 기준을 정리합니다. 핵심 사용자 흐름을 설계합니다. 우선순위에 맞춰 구현합니다. 사용성과 비용, 개인정보와 운영 조건을 점검합니다."
        />
        <div className="mt-10"><ProcessSteps steps={STEPS} /></div>
      </Section>

      <Section labelledBy="ai-portfolio-title">
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
          <Reveal>
            <div className="media aspect-[16/10]" aria-hidden="true">
              <img src={assets.A10.src} alt="" width={assets.A10.width} height={assets.A10.height} loading="lazy" decoding="async" style={{ objectPosition: '68% 50%' }} />
            </div>
          </Reveal>
          <div>
            <Reveal as="p" className="eyebrow">AI 포트폴리오</Reveal>
            <Reveal delay={1}><h2 id="ai-portfolio-title" className="heading-xl mt-4">직접 만든 경험,<br />더 나은 AX 설계로</h2></Reveal>
            <Reveal delay={2}>
              <p className="lead mt-5">휴미즈는 가족 소통 AI 서비스 맘이음을 준비하고 있습니다. 직접 제품을 설계하며 얻는 질문과 검증 과정을 서비스 개발 역량으로 연결합니다.</p>
            </Reveal>
            <Reveal delay={3}>
              <A href="/ai-services/mom-ie" className="link-arrow mt-5">맘이음 프로젝트 보기<Arrow /></A>
            </Reveal>
          </div>
        </div>
        <Reveal>
          <p className="caption mt-12 rounded-xl border border-[var(--color-line)] bg-[var(--color-surface)] p-5 md:p-6">
            범위와 일정·비용은 요구사항과 연계 환경을 확인한 뒤 제안합니다. AI가 항상 정확하게 답하거나 모든 업무를 무인으로 처리한다고 보장하지 않습니다.
          </p>
        </Reveal>
      </Section>

      <Section tone="alt" tight>
        <RelatedLinks items={relatedServices(PATH)} />
      </Section>

      <ClosingContact />
    </>
  );
}
