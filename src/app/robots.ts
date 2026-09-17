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
  //
  // /admin 의 Disallow 는 보안 위생 차원의 크롤링 힌트일 뿐이다 — 개인정보 법률 준수
  // 항목이나 접근통제 수단으로 취급하지 않는다. 실제 보호는 Google OAuth + Supabase Auth
  // 세션 + humease_admin_users + RLS 가 한다(AdminGuard.tsx). noindex meta 도 그대로 유지한다.
  if (!searchIndexingEnabled) {
    return {
      rules: [{ userAgent: '*', allow: '/', disallow: '/admin' }],
      // sitemap 없음 — 검증 URL 목록을 검색에 노출하지 않는다.
    };
  }

  return {
    rules: [
      // 일반 검색 수집
      { userAgent: '*', allow: '/', disallow: '/admin' },
      /*
       * 검색용 AI 봇 — 공개 콘텐츠 접근 허용.
       * Claude 토큰은 2026-09-06 Anthropic 공식 문서로 재확인했다.
       * 현행 토큰은 ClaudeBot(학습) · Claude-User(사용자 요청) · Claude-SearchBot(검색) 셋이며,
       * Claude-Web 과 anthropic-ai 는 공식 목록에 없다.
       * 출처: support.claude.com/en/articles/8896518
       */
      // 명명된 User-agent 블록은 `*` 블록을 상속하지 않는다(robots.txt 는 가장 구체적인
      // 블록 하나만 적용) — /admin Disallow 도 각 블록에 반복해서 넣어야 실제로 적용된다.
      { userAgent: 'OAI-SearchBot', allow: '/', disallow: '/admin' },
      { userAgent: 'PerplexityBot', allow: '/', disallow: '/admin' },
      { userAgent: 'Claude-SearchBot', allow: '/', disallow: '/admin' },
      /*
       * 학습·사용자 요청 관련 봇 — 기존 허용 정책을 그대로 보존한다.
       * SEO 구현을 이유로 허용·차단을 바꾸지 않는다(요청서 §10.2).
       */
      { userAgent: 'GPTBot', allow: '/', disallow: '/admin' },
      { userAgent: 'ChatGPT-User', allow: '/', disallow: '/admin' },
      { userAgent: 'ClaudeBot', allow: '/', disallow: '/admin' },
      { userAgent: 'Claude-User', allow: '/', disallow: '/admin' },
      /*
       * 레거시 토큰. 현재 Anthropic 공식 목록에 없으므로 공식 토큰으로 간주하지 않는다.
       * `User-agent: *` 가 이미 허용이라 이 항목의 유무는 실제 접근 결과를 바꾸지 않는다.
       * 과거 정책의 연속성 기록을 위해 남기며, 제거해도 영향이 없음을 확인했다.
       */
      { userAgent: 'Claude-Web', allow: '/', disallow: '/admin' },
    ],
    sitemap: `${canonicalUrl('/')}sitemap.xml`.replace('//sitemap.xml', '/sitemap.xml'),
    host: deployTarget === 'production' ? 'www.humease.com' : undefined,
  };
}
