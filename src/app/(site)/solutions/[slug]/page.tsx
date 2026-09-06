import { notFound } from 'next/navigation';
import { CinematicHero } from '@/components/brand/CinematicHero';
import { Scene, Faq } from '@/components/sections/Scene';
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
          { name: 'Arctera Solutions', path: '/solutions' },
          { name: p.name, path },
        ]),
        swNode,
      ]} />
      <CinematicHero
        eyebrow="ARCTERA SOLUTIONS"
        titleKo={p.name}
        lead={p.subtitleKo}
        image={COVER[p.slug as keyof typeof COVER] ?? assets.A12}
        ambient="silver"
      />

      <Scene mask="none">
        <Reveal as="p" className="eyebrow">제품 역할</Reveal>
        <Reveal delay={1}><p className="lead measure mt-7">{p.intro}</p></Reveal>

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
        <Reveal delay={2}>
          <p className="measure mt-6 text-[13px] leading-[1.8] text-[var(--color-muted)]">
            위 항목은 휴미즈가 제안하는 검토 프레임이며, 제조사가 제공하는 기능이나 보장 조건과 구분됩니다.
          </p>
        </Reveal>

        {p.faq && p.faq.length > 0 && (
          <>
            <Reveal as="p" delay={2} className="eyebrow mt-20">자주 묻는 질문</Reveal>
            <Faq items={p.faq} />
          </>
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

        <Reveal delay={4}>
          <div className="mt-16 border-t border-[color-mix(in_srgb,var(--color-line)_55%,transparent)] pt-8">
            <p className="measure text-[14px] leading-[1.8] text-[var(--color-muted)]">{SUPPORT_SCOPE_NOTICE}</p>
            <p className="measure mt-4 text-[14px] leading-[1.8] text-[var(--color-muted)]">{RELATIONSHIP_NOTICE}</p>
            <p className="mt-4 text-[13px] text-[var(--color-muted)]">
              <A className="underline underline-offset-4 transition-colors hover:text-[var(--color-accent)]"
                 href={p.officialSource.url} target="_blank" rel="noopener noreferrer">
                {p.officialSource.label}<span aria-hidden="true"> ↗</span>
              </A>
              <span className="ml-4">제품 정보 확인일: {PRODUCT_INFO_VERIFIED_AT}</span>
            </p>
          </div>
        </Reveal>
      </Scene>
    </>
  );
}
