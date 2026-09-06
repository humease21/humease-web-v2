import { CinematicHero } from '@/components/brand/CinematicHero';
import { Scene, Statement, NumberedScene } from '@/components/sections/Scene';
import { ClosingContact } from '@/components/sections/ClosingContact';
import { Reveal } from '@/components/interactive/Reveal';
import { assets } from '@/content/assets';
import { pageMeta } from '@/lib/seo';
import { metaForPath } from '@/content/search-pages';

export const metadata = pageMeta({ ...metaForPath('/consulting/ai-transformation'), path: '/consulting/ai-transformation' });

export default function Page() {
  return (
    <>
      <CinematicHero
        eyebrow="AI 서비스"
        titleKo="아이디어를, 실제로 쓰이는 AI로."
        lead="어떤 AI를 도입할지보다, 누구의 어떤 문제를 해결할지에서 시작합니다. 사용자 흐름과 업무 맥락을 기반으로 서비스를 설계하고 구현합니다."
        ctas={[{ label: 'AI 프로젝트 상담', href: '/contact' }]}
        image={assets.A08}
        ambient="cool"
      />

      <NumberedScene
        ordinal="01"
        eyebrow="제공 영역"
        titleKo="세 가지 방식으로 실행합니다."
        lead="작게 검증하고, 필요한 만큼 확장합니다."
        capabilities={[
          { title: 'AI 서비스 설계·구현', body: '대화형 서비스와 AI 기능을 사용자 경험에 맞게 구체화합니다.' },
          { title: '업무 자동화·에이전트', body: '반복 업무와 정보 흐름을 분석하고, 검증 가능한 자동화 범위를 설계합니다.' },
          { title: '웹 애플리케이션·MVP', body: '핵심 가설을 확인할 수 있는 사용 흐름과 구현 범위를 정합니다.' },
        ]}
        image={assets.A09}
        ambient="cool"
      />

      <Scene mask="none">
        <Statement
          eyebrow="진행 방식"
          titleKo="작게 검증하고, 필요한 만큼 확장합니다."
          paragraphs={['문제와 성공 기준을 정리합니다. 핵심 사용자 흐름을 설계합니다. 우선순위에 맞춰 구현합니다. 사용성과 비용, 개인정보와 운영 조건을 점검합니다.']}
        />
      </Scene>

      <Scene image={assets.A10} mask="scene" ambient="warm">
        <Statement
          eyebrow="AI 포트폴리오"
          titleKo="만드는 경험도, 다음 설계의 기준이 됩니다."
          paragraphs={['휴미즈는 가족 소통 AI 서비스 맘이음을 준비하고 있습니다. 직접 제품을 설계하며 얻는 질문과 검증 과정을 서비스 개발 역량으로 연결합니다.']}
          cta={{ label: '맘이음 프로젝트 보기', href: '/ai-services/mom-ie' }}
        />
        <Reveal delay={4}>
          <p className="lead measure mt-14">
            범위와 일정·비용은 요구사항과 연계 환경을 확인한 뒤 제안합니다. AI가 항상 정확하게 답하거나 모든 업무를 무인으로 처리한다고 보장하지 않습니다.
          </p>
        </Reveal>
      </Scene>

      <ClosingContact />
    </>
  );
}
