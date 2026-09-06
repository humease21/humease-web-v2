import type { MetadataRoute } from 'next';
import { company } from '@/content/company';
import { basePath } from '@/lib/asset-path';

// output: 'export' 에서는 정적 생성으로 고정해야 한다.
export const dynamic = 'force-static';

/**
 * basePath 가 있으면 프로젝트 Pages(Preview)다 → 전면 noindex.
 * 운영 도메인 전환 시 basePath 가 비므로 자동으로 공개 정책이 된다.
 * 기존 운영 robots.txt 의 AI 크롤러 허용 정책을 승계한다(S04).
 */
export default function robots(): MetadataRoute.Robots {
  const isPreview = basePath !== '';

  if (isPreview) {
    return { rules: [{ userAgent: '*', disallow: '/' }] };
  }

  return {
    rules: [
      { userAgent: '*', allow: '/' },
      // 기존 운영 사이트가 명시 허용하던 AI 크롤러를 그대로 유지한다.
      { userAgent: 'GPTBot', allow: '/' },
      { userAgent: 'ChatGPT-User', allow: '/' },
      { userAgent: 'Claude-Web', allow: '/' },
      { userAgent: 'PerplexityBot', allow: '/' },
    ],
    sitemap: `${company.siteUrl}/sitemap.xml`,
  };
}
