import { CinematicHero } from '@/components/brand/CinematicHero';
import { Scene, Statement, NumberedScene } from '@/components/sections/Scene';
import { ClosingContact } from '@/components/sections/ClosingContact';
import { Reveal } from '@/components/interactive/Reveal';
import { assets } from '@/content/assets';
import { pageMeta } from '@/lib/seo';
import { metaForPath } from '@/content/search-pages';

export const metadata = pageMeta({ ...metaForPath('/enterprise-data'), path: '/enterprise-data' });

const STEPS = [
  { k: '진단', v: '데이터 소스, 보존 정책, 검색 요구, 시스템 제약을 확인합니다.' },
  { k: '설계', v: '업무와 운영 기준에 맞는 아키텍처와 적용 범위를 정리합니다.' },
  { k: '검증', v: '도입·이관·운영 단계에서 확인할 조건과 시험 항목을 수립합니다.' },
];

export default function Page() {
  return (
    <>
      <CinematicHero
        eyebrow="기업 데이터"
        titleKo={<>기업 데이터의 수명주기,<br />하나의 기준으로</>}
        lead={
          <>
            보존·검색·접근·통제·조사까지
            <br />
            기업 데이터가 필요한 순간 제 역할을 할 수 있도록
            <br />
            정책과 시스템을 함께 설계합니다
          </>
        }
        ctas={[{ label: '데이터 환경 상담', href: '/contact' }]}
        image={assets.A04}
        ambient="silver"
      />

      <NumberedScene
        ordinal="01"
        eyebrow="전문 영역"
        titleKo="보존 · 통제 · 조사"
        lead="어떤 제품을 쓸지보다, 어떤 문제를 해결할지가 먼저입니다."
        capabilities={[
          { title: 'e-Discovery', body: '조사와 분쟁 대응을 위한 데이터 검색·보존·검토' },
          { title: '내부 통제', body: '커뮤니케이션 위험 탐지·검토·후속 조치' },
          { title: 'Exchange 아카이빙', body: '메일 보존·검색·복원·운영 체계' },
        ]}
        cta={{ label: '검토 가능한 솔루션 보기', href: '/solutions' }}
        image={assets.A05}
        ambient="silver"
      />

      <Scene mask="none">
        <Statement eyebrow="접근 방식" titleKo={<>진단에서,<br />안정적인 운영까지</>} />
        <ul className="mt-12">
          {STEPS.map((s, i) => (
            <Reveal as="li" key={s.k} delay={((i % 3) + 1) as 1 | 2 | 3} className="cap-row">
              <h3 className="text-[24px] font-medium text-[var(--color-accent)] md:text-[30px]">{s.k}</h3>
              <p className="lead">{s.v}</p>
            </Reveal>
          ))}
        </ul>
      </Scene>

      <ClosingContact image={assets.A13} />
    </>
  );
}
