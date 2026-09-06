import { Hero } from '@/components/brand/Hero';
import { Section, CapabilityRows } from '@/components/sections/Section';
import { ButtonLink } from '@/components/ui/Button';
import { assets } from '@/content/assets';
import { pageMeta } from '@/lib/seo';

export const metadata = pageMeta({
  title: 'Enterprise Data | 휴미즈',
  description: 'e-Discovery, 내부 통제, Exchange 아카이빙을 위한 정책과 시스템 설계. 휴미즈와 기업 데이터 환경의 과제를 검토하세요.',
  path: '/enterprise-data',
});

export default function EnterpriseDataPage() {
  return (
    <>
      <Hero
        eyebrow="ENTERPRISE DATA"
        titleKo="중요한 데이터를, 믿고 활용할 수 있도록."
        lead="보존과 검색, 통제와 운영까지. 기업의 데이터가 필요한 순간 제 역할을 할 수 있도록 정책과 시스템을 함께 설계합니다."
        ctas={[{ label: '데이터 환경 상담', href: '/contact' }]}
        image={assets.A04}
        priority
      />
      <Section eyebrow="CAPABILITIES" title="역량 영역">
        <CapabilityRows
          items={[
            { title: 'e-Discovery', body: '조사와 감사, 분쟁 대응에 필요한 데이터를 찾고 검토할 수 있는 체계를 설계합니다.', href: '/consulting/e-discovery', linkLabel: '자세히 보기' },
            { title: 'Internal Control', body: '민감정보와 커뮤니케이션 리스크를 살펴보고, 점검·조치·기록의 흐름을 정리합니다.', href: '/consulting/internal-control', linkLabel: '자세히 보기' },
            { title: 'Exchange Archive', body: '메일 보존 정책과 사용 환경을 함께 고려해, 아카이빙과 검색 구조를 설계합니다.', href: '/consulting/exchange-archive', linkLabel: '자세히 보기' },
          ]}
        />
      </Section>
      <Section title="환경에 맞는 구조가, 오래 작동합니다.">
        <CapabilityRows
          items={[
            { title: '진단', body: '데이터 소스, 보존 정책, 검색 요구, 시스템 제약을 확인합니다.' },
            { title: '설계', body: '업무와 운영 기준에 맞는 아키텍처와 적용 범위를 정리합니다.' },
            { title: '검증', body: '도입·이관·운영 단계에서 확인할 조건과 시험 항목을 수립합니다.' },
          ]}
        />
        <p className="body-lg mt-10">어떤 제품을 쓸지보다, 어떤 문제를 해결할지가 먼저입니다.</p>
        <div className="mt-6"><ButtonLink href="/solutions" variant="ghost">검토 가능한 솔루션 보기</ButtonLink></div>
      </Section>
    </>
  );
}
