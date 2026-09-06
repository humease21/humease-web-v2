/**
 * 사실 기반 JSON-LD 생성. (요청서 §8)
 *
 * - 본문에 없는 실적·가격·파트너십·연락처를 넣지 않는다.
 * - 제품의 publisher/provider 를 HUMEASE 로 쓰지 않는다. 휴미즈는 **설명 페이지의 게시자**다.
 * - FAQPage·HowTo·QAPage·Speakable·SearchAction 을 점수 목적으로 추가하지 않는다.
 * - 검증 환경에서는 운영 Organization/WebSite 공개 식별자를 생성하지 않는다.
 */
import { canonicalUrl, searchIndexingEnabled } from '@/lib/search-config';
import { company } from '@/content/company';

const ORG_ID = 'https://www.humease.com/#organization';
const SITE_ID = 'https://www.humease.com/#website';

type Node = Record<string, unknown>;

/**
 * `</script>` 로 스크립트를 종료시키지 못하게 escape 한다.
 * JSON.stringify 결과를 검증 없이 삽입하지 않는다.
 */
export function serializeJsonLd(graph: Node[]): string {
  return JSON.stringify({ '@context': 'https://schema.org', '@graph': graph })
    .replace(/</g, '\\u003c')
    .replace(/>/g, '\\u003e')
    .replace(/&/g, '\\u0026')
    .replace(/\u2028/g, '\\u2028')
    .replace(/\u2029/g, '\\u2029');
}

export const organizationNode = (): Node => ({
  '@type': 'Organization',
  '@id': ORG_ID,
  name: company.nameKo.replace('주식회사 ', ''),
  alternateName: company.nameEn,
  url: canonicalUrl('/'),
  // legalName·address·telephone·founder·sameAs 는 확인된 공개 데이터가 있을 때만 추가한다.
});

export const websiteNode = (): Node => ({
  '@type': 'WebSite',
  '@id': SITE_ID,
  url: canonicalUrl('/'),
  name: company.nameEn,
  inLanguage: 'ko-KR',
  publisher: { '@id': ORG_ID },
});

export const webPageNode = (opts: {
  path: string; name: string; description: string;
  type?: 'WebPage' | 'AboutPage' | 'CollectionPage' | 'ContactPage';
  about?: Node | { '@id': string };
  citation?: string;
}): Node => ({
  '@type': opts.type ?? 'WebPage',
  '@id': `${canonicalUrl(opts.path)}#webpage`,
  url: canonicalUrl(opts.path),
  name: opts.name,
  description: opts.description,
  inLanguage: 'ko-KR',
  isPartOf: { '@id': SITE_ID },
  publisher: { '@id': ORG_ID },
  ...(opts.about ? { about: opts.about } : {}),
  ...(opts.citation ? { citation: opts.citation } : {}),
});

export const breadcrumbNode = (path: string, trail: { name: string; path: string }[]): Node => ({
  '@type': 'BreadcrumbList',
  '@id': `${canonicalUrl(path)}#breadcrumb`,
  itemListElement: trail.map((t, i) => ({
    '@type': 'ListItem', position: i + 1, name: t.name, item: canonicalUrl(t.path),
  })),
});

export const itemListNode = (path: string, items: { name: string; path: string }[]): Node => ({
  '@type': 'ItemList',
  '@id': `${canonicalUrl(path)}#itemlist`,
  itemListElement: items.map((it, i) => ({
    '@type': 'ListItem', position: i + 1, name: it.name, url: canonicalUrl(it.path),
  })),
});

/** 외부 제조사 제품. 휴미즈를 publisher 로 지정하지 않는다. */
export const softwareApplicationNode = (opts: {
  name: string; alternateName?: string; url: string;
}): Node => ({
  '@type': 'SoftwareApplication',
  '@id': `${opts.url}#softwareapplication`,
  name: opts.name,
  ...(opts.alternateName ? { alternateName: opts.alternateName } : {}),
  url: opts.url,
  applicationCategory: 'BusinessApplication',
});

/** 휴미즈가 제공하는 서비스 */
export const serviceNode = (opts: { name: string; description: string }): Node => ({
  '@type': 'Service',
  name: opts.name,
  description: opts.description,
  provider: { '@id': ORG_ID },
  areaServed: 'KR',
});

/** 개발 중 프로젝트. 다운로드·가격·별점을 넣지 않는다. */
export const creativeWorkNode = (opts: { name: string; description: string; path: string }): Node => ({
  '@type': 'CreativeWork',
  '@id': `${canonicalUrl(opts.path)}#project`,
  name: opts.name,
  description: opts.description,
  creator: { '@id': ORG_ID },
  inLanguage: 'ko-KR',
});

/**
 * 검증 환경에서는 JSON-LD 를 출력하지 않는다.
 * 운영 공개 식별자를 검증본에 심으면 잘못된 엔터티가 수집될 수 있다.
 */
export function JsonLd({ graph }: { graph: Node[] }) {
  if (!searchIndexingEnabled) return null;
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: serializeJsonLd(graph) }}
    />
  );
}
