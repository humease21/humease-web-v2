import { Hero } from '@/components/brand/Hero';
import { Section, CapabilityRows } from '@/components/sections/Section';
import { ButtonLink } from '@/components/ui/Button';
import { assets } from '@/content/assets';
import { pageMeta } from '@/lib/seo';

export const metadata = pageMeta({
  title: 'Applied AI · AI 서비스 개발 | 휴미즈',
  description: 'AI 서비스, 업무 자동화, 웹 애플리케이션과 MVP를 사용자 흐름에 맞게 설계하고 구현하는 휴미즈 Applied AI.',
  path: '/consulting/ai-transformation',
});

export default function Page() {
  return (
    <>
      <Hero
        eyebrow="APPLIED AI"
        titleKo="아이디어를, 실제로 쓰이는 AI로."
        lead="어떤 AI를 도입할지보다, 누구의 어떤 문제를 해결할지에서 시작합니다. 사용자 흐름과 업무 맥락을 기반으로 서비스를 설계하고 구현합니다."
        ctas={[{ label: 'AI 프로젝트 상담', href: '/contact' }]}
        image={assets.A08}
        priority
      />
      <Section eyebrow="SCOPE" title="적용 영역">
        <CapabilityRows
          items={[
            { title: 'AI 서비스 설계·구현', body: '대화형 서비스와 AI 기능을 사용자 경험에 맞게 구체화합니다.' },
            { title: '업무 자동화·에이전트', body: '반복 업무와 정보 흐름을 분석하고, 검증 가능한 자동화 범위를 설계합니다.' },
            { title: '웹 애플리케이션·MVP', body: '핵심 가설을 확인할 수 있는 사용 흐름과 구현 범위를 정합니다.' },
          ]}
        />
      </Section>
      <Section
        title="작게 검증하고, 필요한 만큼 확장합니다."
        lead="문제와 성공 기준을 정리합니다. 핵심 사용자 흐름을 설계합니다. 우선순위에 맞춰 구현합니다. 사용성과 비용, 개인정보와 운영 조건을 점검합니다."
      />
      <Section
        title="만드는 경험도, 다음 설계의 기준이 됩니다."
        lead="휴미즈는 가족 소통 AI 서비스 맘이음을 준비하고 있습니다. 직접 제품을 설계하며 얻는 질문과 검증 과정을 서비스 개발 역량으로 연결합니다."
      >
        <div className="mt-8"><ButtonLink href="/ai-services/mom-ie" variant="ghost">맘이음 프로젝트 보기</ButtonLink></div>
        <p className="body-lg prose-measure mt-12">
          범위와 일정·비용은 요구사항과 연계 환경을 확인한 뒤 제안합니다. AI가 항상 정확하게 답하거나 모든 업무를 무인으로 처리한다고 보장하지 않습니다.
        </p>
      </Section>
    </>
  );
}
