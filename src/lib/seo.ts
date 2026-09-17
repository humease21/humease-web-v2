import type { Metadata } from 'next';
import { company } from '@/content/company';
import {
  canonicalUrl, deployedUrl, deployedAssetUrl, searchIndexingEnabled, deployTarget,
} from '@/lib/search-config';

/**
 * 페이지 메타데이터. (요청서 §4.2, §5.2)
 *
 * 검증 환경(preview)
 *  - canonical 을 출력하지 않는다. 검증본을 검색에서 제외하는 것이 목적이며
 *    중복 URL 의 대표를 고르는 상황이 아니다.
 *  - robots: noindex, follow — 크롤링은 허용해야 noindex 를 읽을 수 있다.
 * 운영(production + 색인 승인)
 *  - 정규화된 자기참조 canonical 을 출력하고 index, follow 를 허용한다.
 *
 * basePath 변경만으로 공개 여부가 바뀌지 않는다. 대상과 승인 두 값이 모두 필요하다.
 */
/**
 * 관리자 콘솔 페이지 메타데이터.
 *
 * `/admin/**` 은 어떤 배포 대상에서도 색인 대상이 아니다. `pageMeta` 와 달리
 * `searchIndexingEnabled` 를 보지 않는다 — 운영 승인 여부와 무관하게 항상 noindex 다.
 * canonical·OG 도 내지 않는다. 검색 결과에 관리자 URL 의 존재 자체를 남기지 않는다.
 * 이 경로들은 `src/content/navigation.ts` 의 `staticPublicRoutes` 와
 * `src/content/search-pages.ts` 어디에도 등록하지 않으므로 sitemap·llms.txt 에도 나오지 않는다.
 */
export function adminMeta(title: string): Metadata {
  return {
    title: `${title} | 휴미즈 관리자`,
    robots: { index: false, follow: false, nocache: true, googleBot: { index: false, follow: false } },
  };
}

export function pageMeta(opts: {
  title: string;
  description: string;
  path: string;
  /** 승인된 기존 자산 경로. 없으면 OG 이미지를 만들지 않는다. */
  socialImagePath?: string;
  /** 개별 페이지를 색인에서 제외할 때 */
  noindex?: boolean;
}): Metadata {
  const indexable = searchIndexingEnabled && !opts.noindex;

  return {
    title: opts.title,
    description: opts.description,
    // 운영 색인 대상에만 canonical 을 낸다.
    ...(indexable ? { alternates: { canonical: canonicalUrl(opts.path) } } : {}),
    robots: indexable
      ? { index: true, follow: true }
      : { index: false, follow: true },
    openGraph: {
      title: opts.title,
      description: opts.description,
      // OG url·image 는 **현재 산출물에서 실제로 열리는 주소**여야 한다.
      url: deployedUrl(opts.path),
      siteName: company.nameEn,
      locale: 'ko_KR',
      type: 'website',
      ...(opts.socialImagePath ? { images: [{ url: deployedAssetUrl(opts.socialImagePath) }] } : {}),
    },
    other: { 'x-deploy-target': deployTarget },
  };
}
