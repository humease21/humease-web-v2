import { Hero } from '@/components/brand/Hero';
import { Section, CapabilityRows } from '@/components/sections/Section';
import { ButtonLink } from '@/components/ui/Button';
import { assets } from '@/content/assets';
import { pageMeta } from '@/lib/seo';

export const metadata = pageMeta({
  title: '맘이음 — 개발 중인 가족 소통 AI | 휴미즈',
  description: '친구처럼 곁에 있고, 비서처럼 도와주고, 가족과 연결해주는 AI. 휴미즈가 개발 중인 맘이음의 서비스 방향을 소개합니다.',
  path: '/ai-services/mom-ie',
});

export default function Page() {
  return (
    <>
      <Hero
        eyebrow="HUMEASE AI PROJECT"
        badge="개발 중"
        titleKo="맘이음"
        lead="부모님에게는 일상을 함께하는 대화 상대를, 가족에게는 더 자연스럽게 연결되는 계기를. 맘이음은 이런 일상을 위해 준비하고 있는 AI 서비스입니다."
        image={assets.A10}
        priority
      />
      <Section title="친구처럼 곁에 있고, 비서처럼 도와주고, 가족과 연결해주는 AI">
        <CapabilityRows
          items={[
            { title: '친구처럼 곁에', body: '부모님의 일상과 관심사를 나누고, 지난 이야기에서 자연스럽게 이어지는 대화를 지향합니다.' },
            { title: '비서처럼 도움을', body: '일정과 생활의 작은 부탁을 말로 쉽게 요청하고 도움받을 수 있는 경험을 준비합니다.' },
            { title: '가족과 연결되도록', body: '부모님의 의사를 존중하면서, 가족이 안부를 이해하고 대화를 시작할 계기를 만드는 것이 목표입니다.' },
          ]}
        />
      </Section>
      <Section
        title="가까워지기 위해, 지켜야 할 경계도 생각합니다."
        lead="부모님을 감시하거나 가족의 대화를 대신하기보다, 사람 사이의 연결을 돕는 방향으로 설계합니다. 공유 범위와 개인정보, AI가 도울 수 있는 일의 한계를 함께 고려합니다."
      />
      <Section
        title="지금은 개발 중입니다."
        lead="이 페이지는 맘이음의 서비스 방향을 소개합니다. 기능과 제공 범위는 개발 및 검증 과정에서 달라질 수 있습니다."
      >
        <div className="mt-8 flex flex-wrap gap-3">
          <ButtonLink href="/contact">맘이음 협업 문의</ButtonLink>
          <ButtonLink href="/ai-services" variant="ghost">AI 프로젝트 목록</ButtonLink>
        </div>
      </Section>
    </>
  );
}
