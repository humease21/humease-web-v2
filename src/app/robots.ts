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
    /*
     * 검증 환경은 meta robots noindex 로 색인을 막는다.
     * robots.txt 로 크롤링까지 막으면 크롤러가 noindex 를 읽지 못해
     * 오히려 색인이 남을 수 있다(요청서 §8.6). 크롤링은 허용하고 사이트맵만 내지 않는다.
     */
    return { rules: [{ userAgent: '*', allow: '/' }] };
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
