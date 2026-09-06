import { Hero } from '@/components/brand/Hero';
import { Section, CapabilityRows, FaqList } from '@/components/sections/Section';
import { ButtonLink } from '@/components/ui/Button';
import { assets } from '@/content/assets';
import { pageMeta } from '@/lib/seo';

export const metadata = pageMeta({
  title: 'e-Discovery 컨설팅 | 휴미즈',
  description: '조사·감사·분쟁 대응을 위한 데이터 보존, 검색, 검토 흐름을 기업 환경에 맞게 설계하는 휴미즈 e-Discovery 컨설팅.',
  path: '/consulting/e-discovery',
});

export default function Page() {
  return (
    <>
      <Hero
        eyebrow="ENTERPRISE DATA / E-DISCOVERY"
        titleKo="필요한 증거를, 설명 가능한 과정으로."
        lead="조사·감사·분쟁 대응에 필요한 데이터의 보존, 수집, 검색과 검토 흐름을 기업 환경에 맞게 설계합니다."
        image={assets.A05}
        priority
      />
      <Section
        title="자료를 찾는 일보다, 대응 체계를 만드는 일."
        lead="데이터가 여러 시스템에 흩어져 있거나, 요청할 때마다 담당자가 수작업으로 대응하고 있다면 범위·권한·절차부터 정리해야 합니다."
      />
      <Section eyebrow="SCOPE" title="지원 범위">
        <CapabilityRows
          items={[
            { title: '대상과 범위 정리', body: '요청 목적, 기간, 관련 데이터와 보존 요건을 함께 확인합니다.' },
            { title: '검색·검토 구조', body: '검색 조건과 검토 역할, 처리 흐름을 설계합니다.' },
            { title: '운영과 증적', body: '접근 권한과 수행 기록 등 운영에 필요한 점검 항목을 정리합니다.' },
          ]}
        />
        <p className="body-lg mt-10">프로젝트 범위에 따라 요구사항 정리, 데이터 흐름·아키텍처, 적용 계획과 검증 항목을 제공합니다.</p>
      </Section>
      <Section eyebrow="FAQ" title="자주 묻는 질문">
        <FaqList
          items={[
            { q: '기존 아카이브와 연계할 수 있나요?', a: '데이터 소스와 제품 버전, 연결 방식, 사용 권한을 확인한 뒤 적용 범위를 검토합니다.' },
            { q: '법률 판단도 제공하나요?', a: '휴미즈는 기술과 운영 체계의 설계를 지원합니다. 법률 판단과 제출 의무의 해석은 고객의 법무 담당자 또는 법률 전문가와 함께 확인해야 합니다.' },
            { q: '특정 제품만 사용하나요?', a: '현재 환경과 요구를 먼저 확인하고 적합한 구성을 검토합니다.' },
          ]}
        />
        <div className="mt-10 flex flex-wrap gap-3">
          <ButtonLink href="/contact">e-Discovery 상담</ButtonLink>
          <ButtonLink href="/enterprise-data" variant="ghost">Enterprise Data 전체 보기</ButtonLink>
        </div>
      </Section>
    </>
  );
}
