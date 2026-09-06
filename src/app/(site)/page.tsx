import { CinematicHero } from '@/components/brand/CinematicHero';
import { DataTransition } from '@/components/sections/DataTransition';
import { NumberedScene } from '@/components/sections/Scene';
import { ProductReveal } from '@/components/sections/ProductReveal';
import { ExperienceScene } from '@/components/sections/ExperienceScene';
import { InsightsEditorial } from '@/components/sections/InsightsEditorial';
import { ClosingContact } from '@/components/sections/ClosingContact';
import { Scene } from '@/components/sections/Scene';
import { assets } from '@/content/assets';
import { pageMeta } from '@/lib/seo';

export const metadata = pageMeta({
  title: '휴미즈 | Enterprise Data & Applied AI',
  description:
    '기업 데이터의 보존·검색·통제부터 AI 서비스 설계와 구현까지. 휴미즈의 Enterprise Data, Applied AI, 맘이음 프로젝트를 만나보세요.',
  path: '/',
});

/** docs/03 P12 — 확인된 실제 글이 없으면 dummy 를 만들지 않는다. */
const articles: never[] = [];

export default function HomePage() {
  return (
    <>
      {/* HERO */}
      <CinematicHero
        eyebrow="HUMEASE · ENTERPRISE DATA & APPLIED AI"
        titleEn="Complexity, made intelligent."
        titleKo="복잡한 데이터와 아이디어를, 실제로 작동하는 기술로."
        lead="기업 데이터의 보존과 통제부터 AI 서비스의 설계와 구현까지. 휴미즈는 기술을 현실의 문제 해결로 연결합니다."
        ctas={[
          { label: '사업영역 살펴보기', href: '#business' },
          { label: '프로젝트 문의', href: '/contact', primary: false },
        ]}
        image={assets.A01}
        imageMobile={assets.A02}
        ambient="silver"
      />

      {/* FROM DATA → TO INTELLIGENCE */}
      <div id="business">
        <DataTransition image={assets.A03} />
      </div>

      {/* 01 ENTERPRISE DATA — graphite / smoked glass / silver */}
      <NumberedScene
        ordinal="01"
        eyebrow="ENTERPRISE DATA"
        titleKo="기업의 중요한 데이터를, 필요한 순간 찾을 수 있도록."
        lead="기업의 중요한 데이터를 보존하고, 통제하고, 필요한 순간 찾을 수 있도록 설계합니다."
        capabilities={[
          { title: 'e-Discovery', body: '조사와 감사, 분쟁 대응에 필요한 데이터를 찾고 검토할 수 있는 체계를 설계합니다.' },
          { title: 'Internal Control', body: '민감정보와 커뮤니케이션 리스크를 살펴보고, 점검·조치·기록의 흐름을 정리합니다.' },
          { title: 'Exchange Archive', body: '메일 보존 정책과 사용 환경을 함께 고려해, 아카이빙과 검색 구조를 설계합니다.' },
        ]}
        cta={{ label: 'Enterprise Data 알아보기', href: '/enterprise-data' }}
        image={assets.A04}
        ambient="silver"
      />

      {/* 02 APPLIED AI — 동일 팔레트 + 아주 제한적인 cool ambient */}
      <NumberedScene
        ordinal="02"
        eyebrow="APPLIED AI"
        titleKo="아이디어와 업무 과제를, 실제로 쓰이는 AI 서비스로."
        lead="아이디어와 업무 과제를 사용자에게 필요한 AI 서비스로 구체화합니다. 기획부터 구현과 검증까지 연결합니다."
        capabilities={[
          { title: 'AI 서비스', body: '대화형 서비스와 AI 기능을 사용자 경험에 맞게 구체화합니다.' },
          { title: '업무 자동화', body: '반복 업무와 정보 흐름을 분석하고, 검증 가능한 자동화 범위를 설계합니다.' },
          { title: '웹 애플리케이션', body: '핵심 가설을 확인할 수 있는 사용 흐름과 구현 범위를 정합니다.' },
        ]}
        cta={{ label: 'Applied AI 알아보기', href: '/consulting/ai-transformation' }}
        image={assets.A08}
        ambient="cool"
      />

      {/* BUILT BY HUMEASE — 맘이음 */}
      <ProductReveal image={assets.A10} />

      {/* EXPERIENCE */}
      <ExperienceScene />

      {/* INSIGHTS */}
      <Scene mask="none">
        <InsightsEditorial articles={articles} />
      </Scene>

      {/* CONTACT */}
      <ClosingContact image={assets.A13} />
    </>
  );
}
