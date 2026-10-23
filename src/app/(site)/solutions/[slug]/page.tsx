import { Fragment } from 'react';
import { notFound } from 'next/navigation';
import { PageHero } from '@/components/sections/PageHero';
import { Section } from '@/components/sections/Section';
import { ClosingContact } from '@/components/sections/ClosingContact';
import { RelatedLinks } from '@/components/sections/RelatedLinks';
import { AnswerBlock } from '@/components/content/AnswerBlock';
import { NoticeBar } from '@/components/content/NoticeBar';
import { QuestionList } from '@/components/content/QuestionList';
import { SourceNotes } from '@/components/content/SourceNotes';
import { Reveal } from '@/components/interactive/Reveal';
import { stagger } from '@/lib/stagger';
import { Arrow, Icon } from '@/components/ui/Icon';
import { assets } from '@/content/assets';
import {
  products, productBySlug, RELATIONSHIP_NOTICE, SUPPORT_SCOPE_NOTICE, PRODUCT_INFO_VERIFIED_AT,
} from '@/content/solutions';
import { pageMeta } from '@/lib/seo';
import {
  JsonLd, organizationNode, websiteNode, webPageNode, breadcrumbNode, softwareApplicationNode,
} from '@/lib/structured-data';
import { A } from '@/components/ui/Link';

export function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}
export const dynamicParams = false;

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const p = productBySlug(slug);
  if (!p) return {};
  return pageMeta({ title: p.seoTitle, description: p.metaDescription, path: `/solutions/${p.slug}` });
}

/** '\n' 이 있는 콘텐츠 문자열을 화면 줄바꿈으로 렌더링한다. */
function withLineBreaks(text: string) {
  return text.split('\n').map((line, i, arr) => (
    <Fragment key={i}>
      {line}
      {i < arr.length - 1 && <br />}
    </Fragment>
  ));
}

const COVER = {
  'enterprise-vault': assets.A07,
  'enterprise-vault-capture': assets.A06,
  'data-insight': assets.A04,
  'ediscovery-platform': assets.A05,
} as const;

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const p = productBySlug(slug);
  if (!p) notFound();

  const path = `/solutions/${p.slug}`;
  const swNode = softwareApplicationNode({
    name: p.officialName ?? p.name.replace(/\s*\(formerly [^)]+\)/, ''),
    alternateName: p.alternateName,
    url: p.officialSource.url,
  });

  return (
    <>
      <JsonLd graph={[
        organizationNode(),
        websiteNode(),
        webPageNode({
          path, name: p.seoTitle, description: p.metaDescription,
          // 휴미즈는 이 설명 페이지의 게시자이며, 제품의 게시자가 아니다.
          about: { '@id': swNode['@id'] as string },
          citation: p.officialSource.url,
        }),
        breadcrumbNode(path, [
          { name: '홈', path: '/' },
          { name: 'Arctera 솔루션', path: '/solutions' },
          { name: p.name, path },
        ]),
        swNode,
      ]} />
      <PageHero
        eyebrow="Arctera 솔루션"
        title={p.name}
        lead={withLineBreaks(p.subtitleKo)}
        ctas={[{ label: p.ctaLabel, href: '/contact' }, { label: '주요 기능 보기', href: '#features', primary: false }]}
        image={COVER[p.slug as keyof typeof COVER] ?? assets.A12}
        breadcrumbs={[{ name: '홈', href: '/' }, { name: 'Arctera 솔루션', href: '/solutions' }, { name: p.name, href: path }]}
      />
      <NoticeBar>휴미즈는 Arctera의 공식 파트너가 아닙니다. 제품명과 상표는 각 권리자에게 귀속됩니다.</NoticeBar>

      <Section>
        <div className="grid gap-10 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-16">
          <Reveal><h2 className="heading-xl">{withLineBreaks(p.statement)}</h2></Reveal>
          <div>
            <AnswerBlock term={`${p.name}란?`} definition={p.definition} />
            <Reveal delay={2}><p className="lead mt-8">{p.intro}</p></Reveal>
          </div>
        </div>
      </Section>

      <Section id="features" tone="alt" labelledBy="features-title">
        <Reveal as="p" className="eyebrow">기능</Reveal>
        <Reveal delay={1}><h2 id="features-title" className="heading-xl mt-4">{p.featuresTitle}</h2></Reveal>
        <dl className="mt-10 grid gap-4 md:grid-cols-2">
          {p.features.map((f, i) => (
            <Reveal key={f.area} delay={stagger(i)} className="card">
              <dt className="heading-md">{f.area}</dt>
              <dd className="body-sm mt-2">{f.body}</dd>
            </Reveal>
          ))}
        </dl>

        {p.extras && p.extras.length > 0 && (
          <>
            <Reveal as="h2" className="heading-lg mt-16">관련 구성요소</Reveal>
            <dl className="mt-6">
              {p.extras.map((e, i) => (
                <Reveal key={e.title} delay={stagger(i)} className="def-row">
                  <dt className="heading-md">{withLineBreaks(e.title)}</dt>
                  <dd className="body">{e.body}</dd>
                </Reveal>
              ))}
            </dl>
          </>
        )}
      </Section>

      <Section labelledBy="review-title">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-16">
          <div>
            <Reveal as="p" className="eyebrow">휴미즈 적용 검토</Reveal>
            <Reveal delay={1}><h2 id="review-title" className="heading-xl mt-4">도입 전에 함께 확인할 항목</h2></Reveal>
            <Reveal delay={2}><p className="lead mt-5">{p.review}</p></Reveal>
            <Reveal delay={3}>
              <A href="/contact" className="btn btn-primary mt-8">{p.ctaLabel}<Arrow /></A>
            </Reveal>
          </div>
          <div>
            <ul className="rounded-2xl border border-[var(--color-line)] bg-[var(--color-surface)] p-2 md:p-3">
              {p.reviewChecklist.map((c, i) => (
                <Reveal as="li" key={c} delay={stagger(i)} className="flex items-start gap-3 border-b border-[var(--color-line)] px-4 py-4 last:border-b-0">
                  <Icon name="check" size={20} className="mt-0.5 shrink-0 text-[var(--color-navy)]" />
                  <span className="body">{c}</span>
                </Reveal>
              ))}
            </ul>
            <p className="caption mt-4">위 항목은 휴미즈가 제안하는 검토 프레임이며, 제조사가 제공하는 기능이나 보장 조건과 구분됩니다.</p>
          </div>
        </div>
      </Section>

      {p.faq && p.faq.length > 0 && (
        <Section tone="alt">
          <QuestionList items={p.faq} />
        </Section>
      )}

      <Section tight>
        <RelatedLinks title="관련 페이지" items={p.related} />
        <div className="mt-12">
          <SourceNotes
            sourcesCheckedAt={PRODUCT_INFO_VERIFIED_AT}
            references={[{ label: p.officialName ?? p.name, url: p.officialSource.url }]}
            scopeNotice={SUPPORT_SCOPE_NOTICE}
            relationshipNotice={RELATIONSHIP_NOTICE}
          />
        </div>
      </Section>

      <ClosingContact ctaLabel={p.ctaLabel} />
    </>
  );
}
