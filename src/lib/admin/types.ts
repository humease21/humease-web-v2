/**
 * 관리자 콘솔 V0 에서 추가된 두 테이블의 행 타입.
 * 기존 3개 테이블 타입은 `@/lib/supabase/types` 에 그대로 둔다(그 파일은 수정하지 않는다).
 * 스키마 출처: supabase/migrations/20260917210000_humease_admin_console_tables.sql
 */

export type HumeasePortfolioOverride = {
  slug: string;
  list_visible: boolean;
  status_badge: string | null;
  external_url: string | null;
  updated_at: string;
};

export type HumeaseSiteSettings = {
  id: 'default';
  contact_email: string | null;
  contact_phone: string | null;
  /** 라벨 → URL. 값의 형태는 관리자 화면이 강제한다. */
  sns_links: Record<string, string>;
  inquiry_enabled: boolean;
  updated_at: string;
};

export const SITE_SETTINGS_ID = 'default';
