import { notFound } from 'next/navigation';
import { CinematicHero } from '@/components/brand/CinematicHero';
import { Scene } from '@/components/sections/Scene';
import { AnswerBlock } from '@/components/content/AnswerBlock';
import { QuestionList } from '@/components/content/QuestionList';
import { SourceNotes } from '@/components/content/SourceNotes';
import { Reveal } from '@/components/interactive/Reveal';
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
      <CinematicHero
        eyebrow="Arctera 솔루션"
        titleKo={p.name}
        lead={p.subtitleKo}
        image={COVER[p.slug as keyof typeof COVER] ?? assets.A12}
        ambient="silver"
      />

      <Scene mask="none">
        <AnswerBlock term={`${p.name}란?`} definition={p.definition} />
        <Reveal delay={2}><p className="lead measure mt-9">{p.intro}</p></Reveal>

        <Reveal as="p" delay={2} className="eyebrow mt-20">주요 기능</Reveal>
        <dl className="mt-8">
          {p.features.map((f, i) => (
            <Reveal key={f.area} delay={((i % 4) + 1) as 1 | 2 | 3 | 4} className="cap-row">
              <dt className="text-[15px] font-semibold text-[var(--color-text)]">{f.area}</dt>
              <dd className="text-[15px] leading-[1.75] text-[var(--color-muted)]">{f.body}</dd>
            </Reveal>
          ))}
        </dl>

        {p.extras && p.extras.length > 0 && (
          <>
            <Reveal as="p" delay={2} className="eyebrow mt-20">관련 구성요소</Reveal>
            <dl className="mt-8">
              {p.extras.map((e, i) => (
                <Reveal key={e.title} delay={((i % 4) + 1) as 1 | 2 | 3 | 4} className="cap-row">
                  <dt className="text-[15px] font-semibold text-[var(--color-text)]">{e.title}</dt>
                  <dd className="text-[15px] leading-[1.75] text-[var(--color-muted)]">{e.body}</dd>
                </Reveal>
              ))}
            </dl>
          </>
        )}
      </Scene>

      <Scene mask="none">
        <Reveal as="p" className="eyebrow">휴미즈 적용 검토</Reveal>
        <Reveal delay={1}><p className="lead measure mt-7">{p.review}</p></Reveal>
        <ul className="mt-8">
          {p.reviewChecklist.map((c, i) => (
            <Reveal as="li" key={c} delay={((i % 4) + 1) as 1 | 2 | 3 | 4}>
              <span className="block border-t border-[color-mix(in_srgb,var(--color-line)_45%,transparent)] py-3 text-[15px] text-[var(--color-muted)]">
                {c}
              </span>
            </Reveal>
          ))}
        </ul>
        <Reveal delay={2}>
          <p className="measure mt-6 text-[13px] leading-[1.8] text-[var(--color-muted)]">
            위 항목은 휴미즈가 제안하는 검토 프레임이며, 제조사가 제공하는 기능이나 보장 조건과 구분됩니다.
          </p>
        </Reveal>

        {p.faq && p.faq.length > 0 && (
          <div className="mt-20"><QuestionList items={p.faq} /></div>
        )}

        <Reveal delay={3}>
          <p className="eyebrow mt-20">관련 페이지</p>
          <ul className="mt-6 flex flex-wrap gap-x-10 gap-y-3 text-[14px] text-[var(--color-muted)]">
            {p.related.map((r) => (
              <li key={r.href}>
                <A className="transition-colors hover:text-[var(--color-accent)]" href={r.href}>{r.label}</A>
              </li>
            ))}
          </ul>
        </Reveal>

        <Reveal delay={4}>
          <A href="/contact" className="cta-primary mt-14">{p.ctaLabel}<span aria-hidden="true">→</span></A>
        </Reveal>

        <SourceNotes
          sourcesCheckedAt={PRODUCT_INFO_VERIFIED_AT}
          references={[{ label: p.officialName ?? p.name, url: p.officialSource.url }]}
          scopeNotice={SUPPORT_SCOPE_NOTICE}
          relationshipNotice={RELATIONSHIP_NOTICE}
        />
      </Scene>
    </>
  );
}
