import { PageHero } from '@/components/sections/PageHero';
import { Section, SectionHeader } from '@/components/sections/Section';
import { FeatureSplit } from '@/components/sections/FeatureSplit';
import { ProcessSteps } from '@/components/sections/ProcessSteps';
import { ClosingContact } from '@/components/sections/ClosingContact';
import { RelatedLinks, relatedServices } from '@/components/sections/RelatedLinks';
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
      <PageHero
        eyebrow="기업 데이터"
        title={<>기업 데이터의 수명주기,<br />하나의 기준으로</>}
        lead={<>보존·검색·접근·통제·조사까지<br /> 기업 데이터가 필요한 순간 제 역할을 할 수 있도록<br className="hidden sm:inline" /> 정책과 시스템을 함께 설계합니다</>}
        ctas={[{ label: '데이터 환경 상담', href: '/contact' }, { label: '전문 영역 보기', href: '#expertise', primary: false }]}
        image={assets.A04}
        breadcrumbs={[{ name: '홈', href: '/' }, { name: '사업영역' }, { name: '기업 데이터', href: '/enterprise-data' }]}
      />

      <Section id="expertise" labelledBy="ed-expertise-title">
        <FeatureSplit
          eyebrow="전문 영역"
          headingId="ed-expertise-title"
          title="보존 · 통제 · 조사"
          lead="어떤 제품을 쓸지보다, 어떤 문제를 해결할지가 먼저입니다."
          capabilities={[
            { title: 'e-Discovery', body: '조사와 분쟁 대응을 위한 데이터 검색·보존·검토', icon: 'scale', href: '/consulting/e-discovery' },
            { title: '내부 통제', body: '커뮤니케이션 위험 탐지·검토·후속 조치', icon: 'shield', href: '/consulting/internal-control' },
            { title: 'Exchange 아카이빙', body: '메일 보존·검색·복원·운영 체계', icon: 'mail', href: '/consulting/exchange-archive' },
          ]}
          cta={{ label: '검토 가능한 솔루션 보기', href: '/solutions' }}
          image={assets.A05}
        />
      </Section>

      <Section tone="alt" labelledBy="ed-approach-title">
        <SectionHeader eyebrow="접근 방식" id="ed-approach-title" title={<>진단에서,<br />안정적인 운영까지</>} />
        <div className="mt-10"><ProcessSteps steps={STEPS} /></div>
      </Section>

      <Section tight>
        <RelatedLinks title="전문 컨설팅 살펴보기" items={relatedServices('/enterprise-data')} />
      </Section>

      <ClosingContact />
    </>
  );
}
