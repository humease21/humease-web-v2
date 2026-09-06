import type { MetadataRoute } from 'next';
import { canonicalUrl, searchIndexingEnabled } from '@/lib/search-config';
import { indexablePages } from '@/content/search-pages';
import { publishedProjects } from '@/content/portfolio';
import { products, PRODUCT_INFO_VERIFIED_AT } from '@/content/solutions';

export const dynamic = 'force-static';

/**
 * 사이트맵. (요청서 §11)
 *
 * - 승인된 운영 빌드에서만 URL 을 낸다. 검증본은 빈 목록이다.
 * - lastModified 에 `new Date()` 를 쓰지 않는다. 실제 콘텐츠 수정일이 없으면 **생략**한다.
 *   같은 입력으로 두 번 빌드하면 결과가 동일해야 한다.
 * - 별칭·리다이렉트·draft·외부 URL 은 포함하지 않는다.
 * - priority·changefreq 는 쓰지 않는다. 순위에 영향을 준다고 주장하지 않는다.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  if (!searchIndexingEnabled) return [];

  const entries: MetadataRoute.Sitemap = [];
  const seen = new Set<string>();

  const push = (path: string, lastModified?: string) => {
    const url = canonicalUrl(path);
    if (seen.has(url)) return;
    seen.add(url);
    entries.push(lastModified ? { url, lastModified: new Date(lastModified) } : { url });
  };

  for (const p of indexablePages()) push(p.path, p.contentUpdatedAt);
  // 프로젝트: 단계 확인일이 있으면 그것이 마지막 실제 정보 변경일이다.
  for (const p of publishedProjects()) push(`/ai-services/${p.slug}`, p.stageVerifiedAt ?? p.reviewedAt);
  // 제품: 제품 정보 확인일
  for (const p of products) push(`/solutions/${p.slug}`, PRODUCT_INFO_VERIFIED_AT);

  return entries;
}
