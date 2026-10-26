import { PageHero } from '@/components/sections/PageHero';
import { Section, Statement, SectionHeader } from '@/components/sections/Section';
import { ClosingContact } from '@/components/sections/ClosingContact';
import { RelatedLinks } from '@/components/sections/RelatedLinks';
import { Reveal } from '@/components/interactive/Reveal';
import { stagger } from '@/lib/stagger';
import { AnswerBlock } from '@/components/content/AnswerBlock';
import { QuestionList } from '@/components/content/QuestionList';
import { SourceNotes } from '@/components/content/SourceNotes';
import { assets } from '@/content/assets';
import { challenges, products, RELATIONSHIP_NOTICE, PRODUCT_INFO_VERIFIED_AT } from '@/content/solutions';
import { pageMeta } from '@/lib/seo';
import { metaForPath, pageByPath } from '@/content/search-pages';
import { JsonLd, organizationNode, websiteNode, webPageNode, breadcrumbNode, itemListNode } from '@/lib/structured-data';
import { Arrow, Icon, type IconName } from '@/components/ui/Icon';
import { A } from '@/components/ui/Link';

export const metadata = pageMeta({ ...metaForPath('/solutions'), path: '/solutions' });

const CHALLENGE_ICONS: IconName[] = ['shield', 'eye', 'archive', 'scale', 'search', 'flow'];
const PRODUCT_ICONS: Record<string, IconName> = {
  'enterprise-vault': 'archive',
  'enterprise-vault-capture': 'layers',
  'data-insight': 'database',
  'ediscovery-platform': 'scale',
};

export default function Page() {
  const meta = pageByPath('/solutions')!;
  return (
    <>
      <JsonLd graph={[
        organizationNode(),
        websiteNode(),
        webPageNode({ path: '/solutions', name: meta.title, description: meta.description, type: 'CollectionPage' }),
        breadcrumbNode('/solutions', [{ name: '홈', path: '/' }, { name: 'Arctera 솔루션', path: '/solutions' }]),
        itemListNode('/solutions', products.map((p) => ({ name: p.name, path: `/solutions/${p.slug}` }))),
      ]} />
      <PageHero
        eyebrow="Arctera 솔루션"
        title={<>Capture에서,<br />Compliance까지</>}
        lead={<>기업 커뮤니케이션의<br className="hidden sm:inline" /> 수집·보존·분류·감독·조사를 연결하는<br className="hidden sm:inline" /> Arctera 솔루션을 소개합니다</>}
        ctas={[
          { label: '주요 제품 살펴보기', href: '#products' },
          { label: '솔루션 상담', href: '/contact', primary: false },
        ]}
        image={assets.A12}
        breadcrumbs={[{ name: '홈', href: '/' }, { name: 'Arctera 솔루션', href: '/solutions' }]}
      />

      <Section>
        <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
          <AnswerBlock
            term="Enterprise Information Governance"
            definition={<>이메일과 협업 커뮤니케이션을 수집·보존하고<br className="hidden md:inline" /> 정책에 따라 관리하며<br className="hidden md:inline" /> 컴플라이언스와 eDiscovery에 활용할 수 있는 제품군입니다</>}
          />
          <div className="lg:pt-6">
            <Reveal as="p" className="eyebrow">휴미즈의 역할</Reveal>
            <Reveal delay={1}><h2 className="heading-xl mt-4">제품에서,<br />실제 적용 환경까지</h2></Reveal>
            <Reveal delay={2}><p className="lead mt-5">고객의 데이터 환경과 운영 정책을 확인하고<br className="hidden md:inline" /> 제품 적용 범위, 연계 구조와 이관 조건을 검토합니다</p></Reveal>
          </div>
        </div>
      </Section>

      <Section tone="alt" labelledBy="challenges-title">
        <SectionHeader eyebrow="해결 과제" id="challenges-title" title="해결할 수 있는 여섯 가지 과제" />
        <ul className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {challenges.map((c, i) => (
            <Reveal as="li" key={c.en} delay={stagger(i)} className="card">
              <span className="icon-tile"><Icon name={CHALLENGE_ICONS[i] ?? 'check'} /></span>
              {/* 화면에는 한국어만 노출한다. solutions.ts 의 공식 영문 분류값은 SEO 정합성을 위해 유지한다. */}
              <h3 className="heading-md mt-4">{c.ko}</h3>
              <p className="body-sm mt-2">{c.body}</p>
            </Reveal>
          ))}
        </ul>
        <Reveal>
          <p className="caption mt-8">
            위 분류는 Arctera 공식 솔루션 분류를 바탕으로 정리했습니다. 분류 전체가 아래 네 제품의 단일 라이선스에 모두 포함된다는 뜻은 아닙니다.
          </p>
        </Reveal>
      </Section>

      <Section id="products" labelledBy="products-title">
        <SectionHeader eyebrow="핵심 제품" id="products-title" title="네 가지 핵심 제품" />
        <ul className="mt-10 grid gap-4 md:grid-cols-2">
          {products.map((p, i) => (
            <Reveal as="li" key={p.slug} delay={stagger(i)} className="flex">
              {/* 구 사이트 앵커 진입 보존. sticky header 에 가리지 않도록 scroll-margin 을 둔다. */}
              <article id={p.anchor} className="card card-link w-full scroll-mt-28">
                <span className="icon-tile"><Icon name={PRODUCT_ICONS[p.slug] ?? 'layers'} /></span>
                <h3 className="heading-lg mt-5"><A href={`/solutions/${p.slug}`} className="stretched">{p.name}</A></h3>
                <p className="body-sm mt-2 flex-1">{p.role}</p>
                <span className="mt-6 inline-flex items-center gap-2 text-[15px] font-semibold">자세히 보기<Arrow /></span>
              </article>
            </Reveal>
          ))}
        </ul>
      </Section>

      <Section tone="alt">
        <Statement
          eyebrow="함께 검토할 항목"
          title="고객 환경에서 함께 검토할 항목"
          paragraphs={['현재 시스템과 데이터 소스, 보존 및 검색 요구, 사용자와 운영자 흐름, 연계 조건, 도입·이관 범위.']}
        />
        <div className="mt-12">
          <RelatedLinks title="관련 컨설팅" items={[
            { label: 'e-Discovery 컨설팅', href: '/consulting/e-discovery' },
            { label: '내부 통제 컨설팅', href: '/consulting/internal-control' },
            { label: 'Exchange Archive 컨설팅', href: '/consulting/exchange-archive' },
            { label: '기업 데이터', href: '/enterprise-data' },
          ]} />
        </div>
      </Section>

      <Section>
        <QuestionList
          items={[
            { q: 'Arctera Solutions에서는 무엇을 확인할 수 있나요?',
              a: 'Arctera Solutions는 기업 데이터의 수집, 보존, 검토와 조사에 활용되는 제품 정보를 한국어로 소개하는 영역입니다. 제품의 역할과 휴미즈가 함께 검토할 적용 항목을 구분해 안내합니다.' },
            { q: '휴미즈는 Arctera 공식 파트너인가요?',
              a: '휴미즈는 Arctera의 공식 파트너가 아닙니다. 이 페이지는 제품 정보와 기술 검토 영역을 소개하며 공식 파트너·총판·공인 판매자 지위를 뜻하지 않습니다.' },
          ]}
        />
        <div className="mt-14">
          <SourceNotes
            sourcesCheckedAt={PRODUCT_INFO_VERIFIED_AT}
            references={[{ label: 'Arctera 공식 제품 정보', url: 'https://www.arctera.io/' }]}
            scopeNotice="실제 지원 기능과 연결 범위는 제품 버전, 라이선스, 데이터 소스 및 구성에 따라 달라질 수 있습니다."
            relationshipNotice={RELATIONSHIP_NOTICE}
          />
        </div>
      </Section>

      <ClosingContact ctaLabel="솔루션 상담" />
    </>
  );
}
