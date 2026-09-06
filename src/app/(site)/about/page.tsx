import { Hero } from '@/components/brand/Hero';
import { Section, CapabilityRows } from '@/components/sections/Section';
import { ButtonLink } from '@/components/ui/Button';
import { assets } from '@/content/assets';
import { pageMeta } from '@/lib/seo';

export const metadata = pageMeta({
  title: '회사소개 | 휴미즈',
  description: '기업 데이터의 신뢰와 AI 서비스의 실행을 연결하는 휴미즈. 문제를 이해하고, 설계하고, 구현하는 접근 방식을 소개합니다.',
  path: '/about',
});

export default function AboutPage() {
  return (
    <>
      <Hero
        eyebrow="ABOUT HUMEASE"
        titleKo="복잡한 기술을, 사람에게 필요한 가치로."
        lead="휴미즈는 기업 데이터의 신뢰를 설계하고, AI를 실제 사용되는 서비스로 연결하는 기술회사입니다."
        image={assets.A11}
      />
      <Section title="기술을 더하는 것보다, 문제를 제대로 이해하는 일.">
        <div className="prose-measure mt-6 space-y-5">
          <p className="body-lg">기업의 시스템에는 데이터만 있는 것이 아닙니다. 운영 방식과 사람의 역할, 보안 기준과 업무의 제약이 함께 있습니다. 휴미즈는 이러한 맥락을 먼저 이해하고, 필요한 기술과 실행 순서를 설계합니다.</p>
          <p className="body-lg">Enterprise Data와 Applied AI는 서로 다른 서비스를 나열한 것이 아닙니다. 데이터를 다뤄 온 경험을 바탕으로 신뢰할 수 있는 기술을 만들고, 그 기술이 실제로 쓰이게 한다는 같은 원칙을 공유합니다.</p>
        </div>
      </Section>
      <Section eyebrow="HOW WE WORK" title="일하는 방식">
        <CapabilityRows
          items={[
            { title: '먼저 이해합니다.', body: '현재 환경, 해결할 문제, 기대하는 결과를 구체화합니다.' },
            { title: '필요한 만큼 설계합니다.', body: '과한 기능보다 실제 운영할 수 있는 구조와 우선순위를 정합니다.' },
            { title: '구현하고 검증합니다.', body: '작동 여부뿐 아니라 사용성과 운영 조건까지 함께 살펴봅니다.' },
          ]}
        />
      </Section>
      <Section
        title="경험은 이름이 아니라, 실행의 기준이 됩니다."
        lead="Enterprise IT와 데이터 컴플라이언스에 대한 실무 경험을 바탕으로 설계와 구현을 지원합니다."
      >
        <div className="mt-8"><ButtonLink href="/contact">함께할 프로젝트 문의</ButtonLink></div>
      </Section>
    </>
  );
}
