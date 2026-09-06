import type { MetadataRoute } from 'next';
import { canonicalUrl, deployTarget, searchIndexingEnabled } from '@/lib/search-config';

export const dynamic = 'force-static';

/**
 * robots.txt. (요청서 §10)
 *
 * ⚠ GitHub 프로젝트 사이트에서 이 파일은 **호스트 루트 robots 를 대체하지 못한다.**
 *   실측: https://humease21.github.io/robots.txt 는 404 이고, 프로젝트 하위 robots.txt 는
 *   검증 페이지에 적용되지 않는다. 검증 환경의 색인 제외는 HTML meta noindex 로 관리한다.
 *
 * 검색용 봇과 학습용 봇을 분리한다. 학습 정책은 **기존 상태를 보존**하며
 * SEO 구현을 이유로 허용·차단을 바꾸지 않는다.
 */
export default function robots(): MetadataRoute.Robots {
  // 색인 대상이 아니면 사이트맵을 내지 않는다. 크롤링 자체는 막지 않는다
  // (Disallow 로 막으면 크롤러가 meta noindex 를 읽지 못한다).
  if (!searchIndexingEnabled) {
    return {
      rules: [{ userAgent: '*', allow: '/' }],
      // sitemap 없음 — 검증 URL 목록을 검색에 노출하지 않는다.
    };
  }

  return {
    rules: [
      // 일반 검색 수집
      { userAgent: '*', allow: '/' },
      // 검색용 AI 봇 — 공개 콘텐츠 접근 허용
      { userAgent: 'OAI-SearchBot', allow: '/' },
      { userAgent: 'PerplexityBot', allow: '/' },
      // 학습 관련 봇 — 기존 정책 보존. 임의로 바꾸지 않는다.
      { userAgent: 'GPTBot', allow: '/' },
      { userAgent: 'ChatGPT-User', allow: '/' },
      { userAgent: 'Claude-Web', allow: '/' },
    ],
    sitemap: `${canonicalUrl('/')}sitemap.xml`.replace('//sitemap.xml', '/sitemap.xml'),
    host: deployTarget === 'production' ? 'www.humease.com' : undefined,
  };
}
