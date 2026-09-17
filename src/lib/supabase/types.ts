/**
 * humease_* 테이블 타입. 실제 DB 마이그레이션 적용 후
 * `supabase gen types typescript`로 재생성해 교체하는 것을 권장한다.
 * 지금은 supabase/migrations/20260917000000_humease_core_schema.sql 스키마를 그대로 반영한 수기 타입이다.
 */

export type InquiryStatus = 'new' | 'reviewing' | 'replied' | 'closed' | 'spam';
export type DiscordNotificationStatus = 'pending' | 'sent' | 'failed';
export type InterestArea =
  | 'Enterprise Data' | 'eDiscovery' | '내부 통제' | 'Exchange 아카이빙'
  | 'Arctera 솔루션' | 'AI/AX' | 'AI 서비스 개발' | '기타';

export type HumeaseInquiry = {
  id: string;
  created_at: string;
  updated_at: string | null;
  company_name: string;
  contact_name: string;
  email: string;
  phone: string | null;
  interest_area: InterestArea | null;
  message: string;
  privacy_consent: boolean;
  privacy_consent_at: string;
  privacy_policy_version: string;
  source_page: string;
  utm_source: string | null;
  utm_medium: string | null;
  utm_campaign: string | null;
  status: InquiryStatus;
  admin_memo: string | null;
  discord_notification_status: DiscordNotificationStatus;
  discord_notified_at: string | null;
};

export type HumeaseAdminUser = {
  user_id: string;
  email: string;
  role: 'admin';
  created_at: string;
};

export type HumeasePageView = {
  id: number;
  created_at: string;
  session_id: string;
  path: string;
  landing_path: string | null;
  referrer_domain: string | null;
  utm_source: string | null;
  utm_medium: string | null;
  utm_campaign: string | null;
  device_type: 'desktop' | 'mobile' | 'tablet' | 'other' | null;
  browser_family: string | null;
  os_family: string | null;
};

export type Database = {
  public: {
    Tables: {
      humease_inquiries: { Row: HumeaseInquiry };
      humease_admin_users: { Row: HumeaseAdminUser };
      humease_page_views: { Row: HumeasePageView };
    };
  };
};
