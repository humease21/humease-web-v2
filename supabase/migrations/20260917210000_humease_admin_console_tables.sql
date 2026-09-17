-- 관리자 콘솔 V0 가 쓰는 두 테이블.
-- 적용은 Supabase Management API(`/v1/projects/{ref}/database/query`)로 직접 수행했다.
-- 이 프로젝트는 다른 앱과 DB 를 공유하므로 `supabase db push` 를 쓰지 않는다
-- (다른 앱의 마이그레이션 이력과 충돌한다). 이 파일은 재현용 기록이다.

-- ── humease_portfolio_overrides ──────────────────────────────────────
-- 포트폴리오 카피의 SSOT 는 코드(src/content/portfolio.ts)다. 원본 §3-17 에 따라
-- 관리자 화면에서 카피를 고칠 수 없다. 이 테이블은 slug 단위의 **운영 메타**만 담는다.
-- list_visible 은 "목록 노출 여부"이며 접근 제어가 아니다 — 상세 페이지는 정적 HTML 로
-- 이미 배포돼 있어 URL 로 직접 접근할 수 있다. 화면에도 같은 경고를 표시한다.
create table if not exists public.humease_portfolio_overrides (
  slug text primary key check (char_length(slug) between 1 and 100),
  list_visible boolean not null default true,
  status_badge text check (status_badge is null or char_length(status_badge) <= 40),
  external_url text check (external_url is null or char_length(external_url) <= 500),
  updated_at timestamptz not null default now()
);

alter table public.humease_portfolio_overrides enable row level security;

-- anon 에게는 어떤 정책도 부여하지 않는다 → SELECT/INSERT/UPDATE/DELETE 전부 차단.
create policy humease_portfolio_overrides_admin_select on public.humease_portfolio_overrides
  for select to authenticated using (
    exists (select 1 from public.humease_admin_users a where a.user_id = auth.uid())
  );

create policy humease_portfolio_overrides_admin_insert on public.humease_portfolio_overrides
  for insert to authenticated with check (
    exists (select 1 from public.humease_admin_users a where a.user_id = auth.uid())
  );

create policy humease_portfolio_overrides_admin_update on public.humease_portfolio_overrides
  for update to authenticated using (
    exists (select 1 from public.humease_admin_users a where a.user_id = auth.uid())
  ) with check (
    exists (select 1 from public.humease_admin_users a where a.user_id = auth.uid())
  );

-- DELETE 정책은 만들지 않는다. 행은 slug 당 하나이며 지울 일이 없다.

-- ── humease_site_settings ────────────────────────────────────────────
-- 단일 행 패턴. id 는 'default' 하나만 허용해 행이 늘어나지 않게 제약으로 막는다.
-- Discord Webhook URL·Service Role Key·Supabase Secret 은 이 테이블에 두지 않는다(원본 §3-18).
create table if not exists public.humease_site_settings (
  id text primary key default 'default' check (id = 'default'),
  contact_email text check (contact_email is null or char_length(contact_email) <= 200),
  contact_phone text check (contact_phone is null or char_length(contact_phone) <= 30),
  sns_links jsonb not null default '{}'::jsonb,
  inquiry_enabled boolean not null default true,
  updated_at timestamptz not null default now()
);

alter table public.humease_site_settings enable row level security;

create policy humease_site_settings_admin_select on public.humease_site_settings
  for select to authenticated using (
    exists (select 1 from public.humease_admin_users a where a.user_id = auth.uid())
  );

create policy humease_site_settings_admin_insert on public.humease_site_settings
  for insert to authenticated with check (
    exists (select 1 from public.humease_admin_users a where a.user_id = auth.uid())
  );

create policy humease_site_settings_admin_update on public.humease_site_settings
  for update to authenticated using (
    exists (select 1 from public.humease_admin_users a where a.user_id = auth.uid())
  ) with check (
    exists (select 1 from public.humease_admin_users a where a.user_id = auth.uid())
  );

-- 기본 행. 값은 전부 비워 둔다 — 승인되지 않은 연락처를 추측해 넣지 않는다.
insert into public.humease_site_settings (id) values ('default') on conflict (id) do nothing;
