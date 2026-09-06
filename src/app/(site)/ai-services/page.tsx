import { CinematicHero } from '@/components/brand/CinematicHero';
import { ProductReveal } from '@/components/sections/ProductReveal';
import { Scene, Statement } from '@/components/sections/Scene';
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
      <CinematicHero
        eyebrow="BUILT BY HUMEASE"
        titleEn="We build what we believe in."
        titleKo="우리는 직접 만들며, 가능성을 검증합니다."
        lead="사람의 일상과 업무에 필요한 AI를 서비스로 구체화합니다. 휴미즈가 준비하고 있는 프로젝트를 소개합니다."
        image={assets.A09}
        ambient="cool"
      />

      {/* docs/03 P08 — 프로젝트가 하나면 하나를 크게. 빈 3열 그리드·가짜 Coming Soon 금지 */}
      <ProductReveal
        image={assets.A10}
        body="부모님과 자연스럽게 대화하고 일상을 돕는 경험을 통해 가족의 연결을 지원하는 AI 서비스를 준비합니다."
      />

      <Scene mask="none">
        <Statement
          titleKo="함께 구체화하고 싶은 AI 아이디어가 있으신가요?"
          cta={{ label: '협업 문의', href: '/contact', primary: true }}
          align="center"
        />
      </Scene>
    </>
  );
}
