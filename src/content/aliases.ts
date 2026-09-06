/**
 * 구 운영 사이트의 별칭 경로 → 신 사이트 최종 경로.
 *
 * 2026-09-06 실측: https://www.humease.com/services/e-discovery 등은 구 사이트에서
 * 301(trailing slash 정규화) 후 200 으로 콘텐츠를 제공한다. 신 사이트에서는 404 였다.
 * 도메인 전환 시 이 URL 들이 깨지므로 정적 이동 페이지를 생성한다.
 *
 * ⚠ 정적 Export 에는 서버 리다이렉트가 없다. next.config 의 redirects() 는 동작하지 않는다.
 *    따라서 이 페이지들은 **HTTP 301 이 아니라 200** 이며, canonical·meta refresh·실제 링크로
 *    최종 경로를 가리킨다. 보고 시 301 을 구현한 것처럼 쓰지 않는다.
 */
export type Alias = { from: string; to: string; label: string };

/** /jtbd/[slug] 와 /services/[slug] 가 공유하는 슬러그 → 최종 경로 */
export const legacySlugMap: Record<string, { to: string; label: string }> = {
  'e-discovery': { to: '/consulting/e-discovery', label: 'e-Discovery 컨설팅' },
  'internal-control': { to: '/consulting/internal-control', label: '내부 통제 컨설팅' },
  'exchange-archive': { to: '/consulting/exchange-archive', label: 'Exchange 아카이빙 컨설팅' },
  'ai-transformation': { to: '/consulting/ai-transformation', label: 'Applied AI' },
  'ai-consulting': { to: '/consulting/ai-transformation', label: 'Applied AI' },
};

/** 전체 별칭 11개 — 검증 스크립트의 단일 출처 */
export const aliases: Alias[] = [
  { from: '/consulting/ai-consulting', to: '/consulting/ai-transformation', label: 'Applied AI' },
  ...Object.entries(legacySlugMap).map(([slug, v]) => ({ from: `/jtbd/${slug}`, ...v })),
  ...Object.entries(legacySlugMap).map(([slug, v]) => ({ from: `/services/${slug}`, ...v })),
];
