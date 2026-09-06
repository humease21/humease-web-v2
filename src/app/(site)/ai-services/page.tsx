import { CinematicHero } from '@/components/brand/CinematicHero';
import { Scene, Statement } from '@/components/sections/Scene';
import { PortfolioList } from '@/components/sections/PortfolioList';
import { Reveal } from '@/components/interactive/Reveal';
import { assets } from '@/content/assets';
import { publishedProjects } from '@/content/portfolio';
import { pageMeta } from '@/lib/seo';

export const metadata = pageMeta({
  title: 'AI 포트폴리오 | 휴미즈',
  description: '휴미즈가 직접 만든 AI 프로젝트를 소개합니다. 아이디어를 어떻게 서비스로 구체화했는지, 어떤 문제를 풀고 무엇을 구현했는지 확인하세요.',
  path: '/ai-services',
});

export default function Page() {
  const items = publishedProjects();
  return (
    <>
      <CinematicHero
        eyebrow="BUILT BY HUMEASE"
        titleKo="직접 만든 서비스로, AI의 가능성을 보여줍니다."
        lead="아이디어를 어떻게 서비스로 구체화했는지, 어떤 문제를 풀고 무엇을 구현했는지. 휴미즈의 AI 개발 포트폴리오를 소개합니다."
        image={assets.A09}
        ambient="cool"
      />

      <Scene mask="none">
        <Reveal as="p" className="eyebrow">AI 프로젝트</Reveal>
        <div className="mt-10"><PortfolioList items={items} /></div>
        <Reveal delay={2}>
          <p className="mt-10 text-[13px] leading-relaxed text-[var(--color-muted)]">
            포트폴리오 등록은 개발 참여 사실을 정리한 것이며, 각 서비스의 사업자·운영 주체와는 별개입니다.
          </p>
        </Reveal>
      </Scene>

      <Scene mask="none">
        <Statement
          titleKo="AI 아이디어를 함께 구체화하고 싶으신가요?"
          cta={{ label: '협업 문의', href: '/contact', primary: true }}
          align="center"
        />
      </Scene>
    </>
  );
}
