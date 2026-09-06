import type { MetadataRoute } from 'next';
import { company } from '@/content/company';
import { publicRoutes } from '@/content/navigation';

// output: 'export' 에서는 정적 생성으로 고정해야 한다.
export const dynamic = 'force-static';

/** 공개 12개 페이지만. 승인 전 /privacy·/terms 는 포함하지 않는다(docs/03 §14). */
export default function sitemap(): MetadataRoute.Sitemap {
  return publicRoutes.map((path) => ({
    url: `${company.siteUrl}${path}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: path === '/' ? 1 : 0.7,
  }));
}
