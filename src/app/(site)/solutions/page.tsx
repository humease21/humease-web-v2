import { CinematicHero } from '@/components/brand/CinematicHero';
import { Scene, Statement } from '@/components/sections/Scene';
import { ClosingContact } from '@/components/sections/ClosingContact';
import { Reveal } from '@/components/interactive/Reveal';
import { AnswerBlock } from '@/components/content/AnswerBlock';
import { QuestionList } from '@/components/content/QuestionList';
import { SourceNotes } from '@/components/content/SourceNotes';
import { assets } from '@/content/assets';
import { challenges, products, RELATIONSHIP_NOTICE, PRODUCT_INFO_VERIFIED_AT } from '@/content/solutions';
import { pageMeta } from '@/lib/seo';
import { metaForPath, pageByPath } from '@/content/search-pages';
import { JsonLd, organizationNode, websiteNode, webPageNode, breadcrumbNode, itemListNode } from '@/lib/structured-data';
import { A } from '@/components/ui/Link';

export const metadata = pageMeta({ ...metaForPath('/solutions'), path: '/solutions' });

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
      <CinematicHero
        eyebrow="Arctera 솔루션"
        titleKo="기업 데이터의 보존부터, 컴플라이언스와 eDiscovery까지."
        lead="기업의 커뮤니케이션과 정보를 수집하고, 보존하고, 필요한 순간 찾을 수 있도록. 주요 Arctera 솔루션의 역할과 적용 시 검토할 사항을 한국어로 안내합니다."
        ctas={[
          { label: '주요 제품 살펴보기', href: '#products' },
          { label: '솔루션 상담', href: '/contact', primary: false },
        ]}
        image={assets.A12}
        ambient="silver"
      />

      <Scene mask="none">
        <AnswerBlock
          term="Arctera 솔루션이란?"
          definition="Arctera Solutions는 기업 데이터의 수집, 보존, 검토와 조사에 활용되는 제품 정보를 한국어로 소개하는 영역입니다. 제품의 역할과 휴미즈가 함께 검토할 적용 항목을 구분해 안내합니다."
        />
        <div className="mt-14">
          <Statement
            eyebrow="휴미즈의 역할"
            titleKo="휴미즈는 고객의 데이터 환경과 운영 요구를 바탕으로 제품의 적용 범위와 연계 구성을 함께 검토합니다."
          />
        </div>
      </Scene>

      <Scene image={assets.A04} mask="scene">
        <Reveal as="p" className="eyebrow">해결할 수 있는 여섯 가지 과제</Reveal>
        <ul className="mt-10">
          {challenges.map((c, i) => (
            <Reveal as="li" key={c.en} delay={((i % 4) + 1) as 1 | 2 | 3 | 4} className="cap-row">
              {/* 화면에는 한국어만 노출한다. solutions.ts 의 공식 영문 분류값은 SEO 정합성을 위해 유지한다. */}
              <h2 className="text-[15px] font-semibold text-[var(--color-text)]">{c.ko}</h2>
              <p className="text-[15px] leading-[1.75] text-[var(--color-muted)]">{c.body}</p>
            </Reveal>
          ))}
        </ul>
        <Reveal delay={4}>
          <p className="mt-10 text-[13px] leading-relaxed text-[var(--color-muted)]">
            위 분류는 Arctera 공식 솔루션 분류를 바탕으로 정리했습니다. 분류 전체가 아래 네 제품의 단일 라이선스에 모두 포함된다는 뜻은 아닙니다.
          </p>
        </Reveal>
      </Scene>

      <section id="products" className="scene overflow-hidden">
        <div className="shell w-full">
          <Reveal as="p" className="eyebrow">핵심 제품</Reveal>
          <ul className="mt-10">
            {products.map((p, i) => (
              <Reveal as="li" key={p.slug} delay={((i % 4) + 1) as 1 | 2 | 3 | 4}>
                {/* 구 사이트 앵커 진입 보존. sticky header 에 가리지 않도록 scroll-margin 을 둔다. */}
                <article id={p.anchor} className="cap-row scroll-mt-28">
                  <h2 className="text-[17px] font-semibold leading-snug text-[var(--color-text)]">
                    <A href={`/solutions/${p.slug}`} className="transition-colors hover:text-[var(--color-accent)]">{p.name}</A>
                  </h2>
                  <div>
                    <p className="text-[15px] leading-[1.75] text-[var(--color-muted)]">{p.role}</p>
                    <A href={`/solutions/${p.slug}`} className="mt-3 inline-block text-[14px] font-medium text-[var(--color-accent)]">
                      자세히 보기 →
                    </A>
                  </div>
                </article>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      <Scene mask="none">
        <Statement
          eyebrow="함께 검토할 항목"
          titleKo="고객 환경에서 함께 검토할 항목"
          paragraphs={['현재 시스템과 데이터 소스, 보존 및 검색 요구, 사용자와 운영자 흐름, 연계 조건, 도입·이관 범위.']}
        />
        <Reveal delay={3}>
          <ul className="mt-12 flex flex-wrap gap-x-10 gap-y-3 text-[14px] text-[var(--color-muted)]">
            <li><A className="transition-colors hover:text-[var(--color-accent)]" href="/consulting/e-discovery">e-Discovery 컨설팅</A></li>
            <li><A className="transition-colors hover:text-[var(--color-accent)]" href="/consulting/internal-control">내부 통제 컨설팅</A></li>
            <li><A className="transition-colors hover:text-[var(--color-accent)]" href="/consulting/exchange-archive">Exchange Archive 컨설팅</A></li>
          </ul>
        </Reveal>
        <div className="mt-20">
          <QuestionList
            items={[
              { q: 'Arctera Solutions에서는 무엇을 확인할 수 있나요?',
                a: 'Arctera Solutions는 기업 데이터의 수집, 보존, 검토와 조사에 활용되는 제품 정보를 한국어로 소개하는 영역입니다. 제품의 역할과 휴미즈가 함께 검토할 적용 항목을 구분해 안내합니다.' },
              { q: '휴미즈는 Arctera 공식 파트너인가요?',
                a: '휴미즈는 Arctera의 공식 파트너가 아닙니다. 이 페이지는 제품 정보와 기술 검토 영역을 소개하며 공식 파트너·총판·공인 판매자 지위를 뜻하지 않습니다.' },
            ]}
          />
        </div>

        <SourceNotes
          sourcesCheckedAt={PRODUCT_INFO_VERIFIED_AT}
          references={[{ label: 'Arctera 공식 제품 정보', url: 'https://www.arctera.io/' }]}
          scopeNotice="실제 지원 기능과 연결 범위는 제품 버전, 라이선스, 데이터 소스 및 구성에 따라 달라질 수 있습니다."
          relationshipNotice={RELATIONSHIP_NOTICE}
        />
      </Scene>

      <ClosingContact />
    </>
  );
}
