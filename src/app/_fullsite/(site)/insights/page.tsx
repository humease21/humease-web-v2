import { PageHero } from '@/components/sections/PageHero';
import { Section } from '@/components/sections/Section';
import { InsightsEditorial, type Article } from '@/components/sections/InsightsEditorial';
import { ClosingContact } from '@/components/sections/ClosingContact';
import { RelatedLinks, SERVICE_LINKS } from '@/components/sections/RelatedLinks';
import { assets } from '@/content/assets';
import { pageMeta } from '@/lib/seo';
import { metaForPath } from '@/content/search-pages';

export const metadata = pageMeta({ ...metaForPath('/insights'), path: '/insights' });

/** docs/03 P12 — 확인한 실제 글만 노출. 없으면 빈 카드·빈 필터를 만들지 않는다. */
const articles: Article[] = [];

export default function Page() {
  return (
    <>
      <PageHero
        eyebrow="인사이트"
        title={<>Enterprise Data와<br />AX의 현장</>}
        lead={<>기업 데이터, 컴플라이언스, AI 전환 과정에서<br className="hidden sm:inline" /> 마주하는 기술과 운영의 문제를 다룹니다</>}
        image={assets.A03}
        breadcrumbs={[{ name: '홈', href: '/' }, { name: '인사이트', href: '/insights' }]}
      />
      <Section>
        <InsightsEditorial articles={articles} />
      </Section>
      <Section tone="alt" tight>
        <RelatedLinks title="사업영역 살펴보기" items={SERVICE_LINKS.slice(0, 4)} />
      </Section>
      <ClosingContact />
    </>
  );
}
