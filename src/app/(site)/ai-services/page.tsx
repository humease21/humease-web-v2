import Image from 'next/image';
import { Hero } from '@/components/brand/Hero';
import { Section } from '@/components/sections/Section';
import { ButtonLink } from '@/components/ui/Button';
import { assets } from '@/content/assets';
import { pageMeta } from '@/lib/seo';

export const metadata = pageMeta({
  title: 'AI 프로젝트 | 휴미즈',
  description: '휴미즈가 직접 준비하는 AI 프로젝트를 소개합니다. 가족 소통 AI 서비스 맘이음의 방향과 개발 이야기를 만나보세요.',
  path: '/ai-services',
});

export default function Page() {
  return (
    <>
      <Hero
        eyebrow="BUILT BY HUMEASE"
        titleKo="우리는 직접 만들며, 가능성을 검증합니다."
        lead="사람의 일상과 업무에 필요한 AI를 서비스로 구체화합니다. 휴미즈가 준비하고 있는 프로젝트를 소개합니다."
        image={assets.A09}
        priority
      />
      {/* docs/03 P08 — 프로젝트가 하나면 하나를 크게. 빈 3열 그리드·가짜 Coming Soon 금지 */}
      <Section eyebrow="PROJECT" title="대표 프로젝트">
        <div className="mt-10 grid gap-10 md:grid-cols-[55fr_45fr] md:items-center">
          <div className="overflow-hidden rounded-2xl border border-[var(--color-line)]/50">
            <Image src={assets.A10.src} alt="" width={assets.A10.width} height={assets.A10.height}
              sizes="(max-width: 767px) 100vw, 55vw" className="h-full w-full object-cover" />
          </div>
          <div>
            <p className="inline-block rounded-full border border-[var(--color-accent)]/50 px-3 py-1 text-xs font-medium text-[var(--color-accent)]">개발 중</p>
            <h3 className="mt-4 text-3xl font-medium">맘이음</h3>
            <p className="mt-4 text-lg">친구처럼 곁에 있고, 비서처럼 도와주고, 가족과 연결해주는 AI</p>
            <p className="body-lg mt-4">부모님과 자연스럽게 대화하고 일상을 돕는 경험을 통해 가족의 연결을 지원하는 AI 서비스를 준비합니다.</p>
            <div className="mt-8"><ButtonLink href="/ai-services/mom-ie">프로젝트 자세히 보기</ButtonLink></div>
          </div>
        </div>
      </Section>
      <Section title="함께 구체화하고 싶은 AI 아이디어가 있으신가요?">
        <div className="mt-8"><ButtonLink href="/contact">협업 문의</ButtonLink></div>
      </Section>
    </>
  );
}
