import { PageHero } from '@/components/sections/PageHero';
import { Section, SectionHeader } from '@/components/sections/Section';
import { PortfolioList } from '@/components/sections/PortfolioList';
import { ClosingContact } from '@/components/sections/ClosingContact';
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
      <PageHero
        eyebrow="AI 포트폴리오"
        title={<>아이디어에서,<br />실제 AI 서비스로</>}
        lead={<>직접 문제를 정의하고<br className="hidden sm:inline" /> 기획·설계·개발한 AI 프로젝트와<br className="hidden sm:inline" /> 그 과정에서 해결한 문제를 소개합니다</>}
        ctas={[{ label: '프로젝트 보기', href: '#projects' }, { label: '협업 문의', href: '/contact', primary: false }]}
        image={assets.A09}
        breadcrumbs={[{ name: '홈', href: '/' }, { name: 'AI 포트폴리오', href: '/ai-services' }]}
      />

      <Section id="projects" labelledBy="projects-title">
        <SectionHeader eyebrow="AI 프로젝트" id="projects-title" title={`${items.length}개의 AI 프로젝트`} />
        <div className="mt-10"><PortfolioList items={items} columns={2} /></div>
        <Reveal>
          <p className="caption mt-8">
            포트폴리오 등록은 개발 참여 사실을 정리한 것이며, 각 서비스의 사업자·운영 주체와는 별개입니다.
          </p>
        </Reveal>
      </Section>

      <ClosingContact
        title={<>아이디어에서,<br />첫 번째 사용자까지</>}
        lead="해결하고 싶은 문제와 사용할 사람을 알려주세요. 검증 가능한 범위부터 함께 정리합니다."
        ctaLabel="협업 문의"
      />
    </>
  );
}
