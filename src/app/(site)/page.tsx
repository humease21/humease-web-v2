import Image from 'next/image';
import { Hero } from '@/components/brand/Hero';
import { Section, CapabilityRows } from '@/components/sections/Section';
import { ButtonLink } from '@/components/ui/Button';
import { assets } from '@/content/assets';
import { company } from '@/content/company';
import { pageMeta } from '@/lib/seo';

export const metadata = pageMeta({
  title: '휴미즈 | Enterprise Data & Applied AI',
  description:
    '기업 데이터의 보존·검색·통제부터 AI 서비스 설계와 구현까지. 휴미즈의 Enterprise Data, Applied AI, 맘이음 프로젝트를 만나보세요.',
  path: '/',
});

export default function HomePage() {
  return (
    <>
      <Hero
        eyebrow="HUMEASE · ENTERPRISE DATA & APPLIED AI"
        titleEn="Complexity, made intelligent."
        titleKo="복잡한 데이터와 아이디어를, 실제로 작동하는 기술로."
        lead="기업 데이터의 보존과 통제부터 AI 서비스의 설계와 구현까지. 휴미즈는 기술을 현실의 문제 해결로 연결합니다."
        ctas={[
          { label: '사업영역 살펴보기', href: '#business' },
          { label: '프로젝트 문의', href: '/contact' },
        ]}
        image={assets.A01}
        imageMobile={assets.A02}
        priority
      />

      <Section
        id="business"
        eyebrow="FROM DATA TO INTELLIGENCE"
        title="데이터의 신뢰에서, AI의 실행으로."
      >
        <div className="mt-10 overflow-hidden rounded-2xl border border-[var(--color-line)]/50">
          <Image
            src={assets.A03.src} alt="" width={assets.A03.width} height={assets.A03.height}
            sizes="100vw" className="h-40 w-full object-cover md:h-56"
          />
        </div>
        <CapabilityRows
          items={[
            {
              title: 'Enterprise Data',
              body: '기업의 중요한 데이터를 보존하고, 통제하고, 필요한 순간 찾을 수 있도록 설계합니다. e-Discovery · Internal Control · Exchange Archive',
              href: '/enterprise-data',
              linkLabel: 'Enterprise Data 알아보기',
            },
            {
              title: 'Applied AI',
              body: '아이디어와 업무 과제를 사용자에게 필요한 AI 서비스로 구체화합니다. 기획부터 구현과 검증까지 연결합니다. AI 서비스 · 업무 자동화 · 웹 애플리케이션',
              href: '/consulting/ai-transformation',
              linkLabel: 'Applied AI 알아보기',
            },
          ]}
        />
      </Section>

      <Section eyebrow="BUILT BY HUMEASE" title="우리는 직접 만들며, 가능성을 검증합니다.">
        <div className="mt-10 grid gap-10 md:grid-cols-[45fr_55fr] md:items-center">
          <div className="overflow-hidden rounded-2xl border border-[var(--color-line)]/50">
            <Image
              src={assets.A10.src} alt="" width={assets.A10.width} height={assets.A10.height}
              sizes="(max-width: 767px) 100vw, 45vw" className="h-full w-full object-cover"
            />
          </div>
          <div>
            <p className="inline-block rounded-full border border-[var(--color-accent)]/50 px-3 py-1 text-xs font-medium text-[var(--color-accent)]">
              개발 중
            </p>
            <h3 className="mt-4 text-3xl font-medium">맘이음</h3>
            <p className="mt-4 text-lg text-[var(--color-text)]">
              친구처럼 곁에 있고, 비서처럼 도와주고, 가족과 연결해주는 AI
            </p>
            <p className="body-lg mt-4">
              부모님에게는 일상을 함께하는 대화 상대를, 가족에게는 더 자연스럽게 연결되는 계기를. 휴미즈가 준비하고 있는 가족 소통 AI 서비스입니다.
            </p>
            <div className="mt-8">
              <ButtonLink href="/ai-services/mom-ie" variant="ghost">맘이음 프로젝트 보기</ButtonLink>
            </div>
          </div>
        </div>
      </Section>

      <Section
        eyebrow="EXPERTISE, APPLIED"
        title="기술의 깊이는, 문제를 해결해 온 경험에서 나옵니다."
        lead="기업 데이터 환경과 운영 제약을 이해하는 전문성을 바탕으로, 필요한 기술을 선택하고 실행 가능한 구조를 설계합니다."
      >
        <div className="mt-8">
          <ButtonLink href="/about" variant="ghost">휴미즈 알아보기</ButtonLink>
        </div>
      </Section>

      <Section
        title="현장에서 생각하고, 기술로 답합니다."
        lead="Enterprise Data와 Applied AI에 대한 휴미즈의 생각과 기록을 만나보세요."
      >
        <div className="mt-8">
          <ButtonLink href="/insights" variant="ghost">인사이트 보기</ButtonLink>
        </div>
      </Section>

      <Section
        title="해결하고 싶은 문제가 있다면, 함께 살펴보겠습니다."
        lead="데이터 환경의 고민부터 AI 서비스 아이디어까지. 현재 상황과 기대하는 변화를 알려주세요."
      >
        <div className="mt-8 flex flex-wrap gap-3">
          <ButtonLink href="/contact">프로젝트 문의</ButtonLink>
          <ButtonLink href={`mailto:${company.email}`} variant="ghost">{company.email}</ButtonLink>
        </div>
      </Section>
    </>
  );
}
