-- HUMEASE v2 신규 스키마. 레거시(public.inquiries, public.view_logs)와 이름 분리.
-- 실행 전 반드시 확인: 이 마이그레이션은 markanitp@gmail.com 의 기존 Supabase Auth
-- 계정(UUID 유지)을 그대로 admin 으로 연결한다. 새 계정을 만들지 않는다.
-- 실제 적용은 프로젝트 cgydvjqhsllpeuxbephb 접근 권한을 가진 사람이 수행한다
-- (이 저장소의 CLI 계정은 해당 프로젝트에 접근 권한이 없어 `supabase db push`를 실행할 수 없음).

-- ── humease_admin_users ──────────────────────────────────────────────
create table if not exists public.humease_admin_users (
  user_id uuid primary key references auth.users(id) on delete cascade,
  email text not null unique,
  role text not null default 'admin' check (role in ('admin')),
  created_at timestamptz not null default now()
);

alter table public.humease_admin_users enable row level security;

-- anon: 전면 차단
create policy humease_admin_users_no_anon_select on public.humease_admin_users
  for select to anon using (false);

-- authenticated: 본인이 admin 테이블에 있는 경우에만 자기 행 조회 가능(로그인 후 권한 확인용)
create policy humease_admin_users_self_select on public.humease_admin_users
  for select to authenticated using (auth.uid() = user_id);

-- INSERT/UPDATE/DELETE 는 어떤 role 에도 정책을 열지 않는다(service_role 은 RLS 우회로 관리).

-- ── humease_inquiries ────────────────────────────────────────────────
create table if not exists public.humease_inquiries (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz,
  company_name text not null check (char_length(company_name) between 1 and 100),
  contact_name text not null check (char_length(contact_name) between 1 and 50),
  email text not null check (char_length(email) <= 200),
  phone text check (phone is null or char_length(phone) <= 30),
  interest_area text check (
    interest_area is null or interest_area in (
      'Enterprise Data', 'eDiscovery', '내부 통제', 'Exchange 아카이빙',
      'Arctera 솔루션', 'AI/AX', 'AI 서비스 개발', '기타'
    )
  ),
  message text not null check (char_length(message) between 1 and 4000),
  privacy_consent boolean not null,
  privacy_consent_at timestamptz not null,
  privacy_policy_version text not null,
  source_page text not null,
  utm_source text check (utm_source is null or char_length(utm_source) <= 100),
  utm_medium text check (utm_medium is null or char_length(utm_medium) <= 100),
  utm_campaign text check (utm_campaign is null or char_length(utm_campaign) <= 100),
  status text not null default 'new' check (status in ('new', 'reviewing', 'replied', 'closed', 'spam')),
  admin_memo text,
  discord_notification_status text not null default 'pending' check (discord_notification_status in ('pending', 'sent', 'failed')),
  discord_notified_at timestamptz,
  constraint humease_inquiries_privacy_consent_true check (privacy_consent = true)
);

create index if not exists humease_inquiries_created_at_idx on public.humease_inquiries (created_at desc);
create index if not exists humease_inquiries_status_idx on public.humease_inquiries (status);
create index if not exists humease_inquiries_email_idx on public.humease_inquiries (email);
create index if not exists humease_inquiries_company_name_idx on public.humease_inquiries (company_name);

alter table public.humease_inquiries enable row level security;

-- anon: SELECT/UPDATE/DELETE 전부 차단. INSERT 도 클라이언트에서 직접 하지 않는다
-- (submit-inquiry Edge Function 이 service_role 로 INSERT). anon 에게는 아무 정책도 부여하지 않는다.

create policy humease_inquiries_admin_select on public.humease_inquiries
  for select to authenticated using (
    exists (select 1 from public.humease_admin_users a where a.user_id = auth.uid())
  );

create policy humease_inquiries_admin_update on public.humease_inquiries
  for update to authenticated using (
    exists (select 1 from public.humease_admin_users a where a.user_id = auth.uid())
  ) with check (
    exists (select 1 from public.humease_admin_users a where a.user_id = auth.uid())
  );

-- 물리 DELETE 는 V0 범위 밖. DELETE 정책을 만들지 않는다(관리자도 삭제 불가, status 로만 종결 처리).

-- ── humease_page_views ───────────────────────────────────────────────
create table if not exists public.humease_page_views (
  id bigint generated always as identity primary key,
  created_at timestamptz not null default now(),
  session_id text not null,
  path text not null,
  landing_path text,
  referrer_domain text,
  utm_source text,
  utm_medium text,
  utm_campaign text,
  device_type text check (device_type is null or device_type in ('desktop', 'mobile', 'tablet', 'other')),
  browser_family text,
  os_family text
);

create index if not exists humease_page_views_created_at_idx on public.humease_page_views (created_at desc);
create index if not exists humease_page_views_path_idx on public.humease_page_views (path);
create index if not exists humease_page_views_session_id_idx on public.humease_page_views (session_id);
create index if not exists humease_page_views_utm_source_idx on public.humease_page_views (utm_source);

alter table public.humease_page_views enable row level security;

-- anon: SELECT 전부 차단. INSERT 는 log-page-view Edge Function(service_role)이 처리하므로
-- anon 에게 직접 INSERT 정책도 부여하지 않는다(원본 요청서 §3-15: anon 이 raw data 를 읽을 수 없어야 함).

create policy humease_page_views_admin_select on public.humease_page_views
  for select to authenticated using (
    exists (select 1 from public.humease_admin_users a where a.user_id = auth.uid())
  );
