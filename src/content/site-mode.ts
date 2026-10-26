/**
 * 임시 축소 운영 모드 (대표 지시, 2026-10-26).
 *
 * 공개 사이트를 회사소개 핵심 5개 섹션의 단일 홈과 문의·법률 페이지로 줄인다.
 * 기존 상세 페이지 소스는 src/app/_fullsite/ (라우팅 제외 private folder)에 보존돼 빌드되지 않는다.
 * 관리자(/admin)·문의 접수·Supabase·Discord 연동은 그대로다.
 *
 * 원복: 태그 humease-fullsite-2026-10-26 기준으로 다시 배포한다 — docs/ops/TEMP_SITE_RESTORE.md
 */
export const TEMP_SITE = true;

/** 임시 운영 중 공개되는 경로. sitemap·llms.txt·검증 스크립트의 단일 출처다. */
export const TEMP_PUBLIC_PATHS = ['/', '/contact', '/privacy', '/terms'] as const;

export const isTempPublicPath = (path: string) =>
  (TEMP_PUBLIC_PATHS as readonly string[]).includes(path);
