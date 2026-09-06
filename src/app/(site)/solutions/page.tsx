import { Hero } from '@/components/brand/Hero';
import { Section, CapabilityRows } from '@/components/sections/Section';
import { ButtonLink } from '@/components/ui/Button';
import { assets } from '@/content/assets';
import { pageMeta } from '@/lib/seo';

export const metadata = pageMeta({
  title: '엔터프라이즈 솔루션 | 휴미즈',
  description: 'Enterprise Vault, Merge1, Data Insight 등 기존 데이터 환경과 요구에 맞는 솔루션 적용과 구성 검토를 지원합니다.',
  path: '/solutions',
});

export default function Page() {
  return (
    <>
      <Hero
        eyebrow="ENTERPRISE SOLUTIONS"
        titleKo="제품보다 먼저, 환경에 맞는 구조를 봅니다."
        lead="데이터 보존과 검색, 수집과 통제의 요구를 확인하고 적합한 구성을 검토합니다."
        image={assets.A12}
        priority
      />
      {/* docs/03 P10 — 파트너 로고 띠 없음. 지원 버전·커넥터 수·인증·성능은 공식 재확인 전 기재하지 않는다. */}
      <Section eyebrow="PRODUCTS" title="상담 대상 제품">
        <CapabilityRows
          items={[
            { title: 'Enterprise Vault', body: '아카이빙과 검색 요구에 맞는 적용 범위, 구성과 운영 조건을 검토합니다.' },
            { title: 'Merge1', body: '수집 대상 데이터와 연결 요구를 기준으로 적용 가능성과 연계 구성을 검토합니다.' },
            { title: 'Data Insight', body: '비정형 데이터의 현황과 관리 과제를 이해하기 위한 분석 요구를 검토합니다.' },
          ]}
        />
        <p className="body-lg prose-measure mt-10">
          제품별 지원 범위는 버전·라이선스·데이터 소스·구성에 따라 달라질 수 있으므로 상담 과정에서 확인합니다.
        </p>
      </Section>
      <Section
        title="요구에 맞춰 함께 검토할 항목"
        lead="현재 시스템과 데이터 소스, 보존 및 검색 요구, 사용자와 운영자 흐름, 연계 조건, 도입·이관 범위."
      >
        <div className="mt-8"><ButtonLink href="/contact">솔루션 상담</ButtonLink></div>
        <ul className="mt-10 flex flex-wrap gap-x-6 gap-y-2 text-sm text-[var(--color-muted)]">
          <li><a className="underline underline-offset-4 hover:text-[var(--color-text)]" href="/consulting/e-discovery">e-Discovery</a></li>
          <li><a className="underline underline-offset-4 hover:text-[var(--color-text)]" href="/consulting/internal-control">Internal Control</a></li>
          <li><a className="underline underline-offset-4 hover:text-[var(--color-text)]" href="/consulting/exchange-archive">Exchange Archive</a></li>
        </ul>
      </Section>
    </>
  );
}
