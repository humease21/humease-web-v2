import { CinematicHero } from '@/components/brand/CinematicHero';
import { Scene, Statement } from '@/components/sections/Scene';
import { PortfolioList } from '@/components/sections/PortfolioList';
import { Reveal } from '@/components/interactive/Reveal';
import { assets } from '@/content/assets';
import { publishedProjects } from '@/content/portfolio';
import { pageMeta } from '@/lib/seo';
import { metaForPath, pageByPath } from '@/content/search-pages';
import { JsonLd, organizationNode, websiteNode, webPageNode, breadcrumbNode, itemListNode } from '@/lib/structured-data';

export const metadata = pageMeta({ ...metaForPath('/ai-services'), path: '/ai-services' });

export default function Page() {
  const items = publishedProjects();
  const meta = pageByPath('/ai-services')!;
  return (
    <>
      <JsonLd graph={[
        organizationNode(),
        websiteNode(),
        webPageNode({ path: '/ai-services', name: meta.title, description: meta.description, type: 'CollectionPage' }),
        breadcrumbNode('/ai-services', [{ name: '홈', path: '/' }, { name: 'AI 포트폴리오', path: '/ai-services' }]),
        itemListNode('/ai-services', items.map((p) => ({ name: p.name, path: `/ai-services/${p.slug}` }))),
      ]} />
      <CinematicHero
        eyebrow="AI 포트폴리오"
        titleKo={<>아이디어에서,<br />실제 AI 서비스로</>}
        lead={<>직접 문제를 정의하고<br />기획·설계·개발한 AI 프로젝트와<br />그 과정에서 해결한 문제를 소개합니다</>}
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
          titleKo={<>아이디어에서,<br />첫 번째 사용자까지</>}
          cta={{ label: '협업 문의', href: '/contact', primary: true }}
          align="center"
        />
      </Scene>
    </>
  );
}
