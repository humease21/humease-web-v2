/**
 * 문의 기능 계약 — 기존 운영 사이트 READ-ONLY 조사 결과(2026-09-06).
 *
 * 확인된 기존 경로
 *  1. client → Supabase `inquiries` insert (anon key, RLS 보호)
 *     필드: company_name, manager_name, phone, email, interested_services(쉼표 문자열), message, created_at
 *  2. Supabase DB Webhook → Edge Function `discord-webhook` → Discord
 *     DISCORD_WEBHOOK_URL 은 Supabase Secrets 에 있고 클라이언트에 노출되지 않는다. → 안전, 재사용 가능
 *  3. client → https://formsubmit.co/ajax/contact@humease.com (메일 알림)
 *     secret 은 없으나 개인정보를 제3자에게 직접 전송한다. → 개인정보 처리위탁 검토 전 재사용 보류
 *
 * 현재 상태: 대표 지시에 따라 mock/disabled.
 * 운영 자격정보·동의·개인정보처리방침 승인 전까지 어떤 전송도 하지 않는다.
 * secret 은 client bundle 에 넣지 않는다. Supabase anon key 는 공개 전제이나
 * RLS 확인 전까지는 연결 자체를 하지 않는다.
 */
export const CONTACT_MODE: 'disabled' | 'live' = 'disabled';

export const contactFields = [
  { name: 'company_name', label: '회사명', required: true },
  { name: 'manager_name', label: '담당자명', required: true },
  { name: 'email', label: '이메일', required: true },
  { name: 'phone', label: '연락처', required: false },
  { name: 'interested_services', label: '관심 분야', required: false },
  { name: 'message', label: '문의 내용', required: false },
] as const;
