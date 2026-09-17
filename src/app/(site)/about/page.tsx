import { CinematicHero } from '@/components/brand/CinematicHero';
import { Scene, Statement } from '@/components/sections/Scene';
import { ExperienceScene } from '@/components/sections/ExperienceScene';
import { ClosingContact } from '@/components/sections/ClosingContact';
import { Reveal } from '@/components/interactive/Reveal';
import { assets } from '@/content/assets';
import { pageMeta } from '@/lib/seo';
import { metaForPath } from '@/content/search-pages';

export const metadata = pageMeta({ ...metaForPath('/about'), path: '/about' });

export default function AboutPage() {
  return (
    <>
      <CinematicHero
        eyebrow="휴미즈 소개"
        titleKo={<>Enterprise IT에서,<br />AX까지</>}
        lead={<>20년 이상의 기업 IT 경험을 바탕으로<br />데이터 거버넌스와 AI를 실제 비즈니스 환경에 연결합니다</>}
        image={assets.A11}
        ambient="silver"
        align="center"
      />

      <Scene mask="none">
        <Statement
          titleKo={<>기술보다 먼저,<br />문제의 본질</>}
          paragraphs={[
            <>기업의 IT 환경에는 데이터뿐 아니라<br />업무 방식, 보안 정책, 기존 시스템과 운영 제약이 함께 존재합니다</>,
            <>휴미즈는 현재 환경을 먼저 이해한 뒤<br />필요한 기술과 실행 순서를 설계합니다</>,
          ]}
        />
      </Scene>

      <Scene mask="none">
        <Statement
          titleKo={<>데이터 기반에서,<br />AI 활용으로</>}
          paragraphs={[
            '기업 데이터와 AI는 분리된 영역이 아닙니다',
            <>신뢰할 수 있는 데이터 기반 위에서<br />AI가 실제 업무와 서비스에 활용될 수 있도록 연결합니다</>,
          ]}
        />
      </Scene>

      <Scene mask="none">
        <Reveal as="p" className="eyebrow">우리가 일하는 방식</Reveal>
        <Reveal delay={1} slow>
          <p className="title-ko mt-6">이해 · 설계 · 구현 · 검증</p>
        </Reveal>
      </Scene>

      <ExperienceScene aboutCopy />
      <ClosingContact />
    </>
  );
}
