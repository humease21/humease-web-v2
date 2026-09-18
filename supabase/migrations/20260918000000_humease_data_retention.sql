-- 개인정보처리방침 V1.0 제3조/제7조 보유기간 이행.
-- humease_inquiries: 접수 후 3년 경과 시 hard delete.
-- humease_page_views: 수집 후 12개월 경과 시 hard delete.
--
-- pg_cron 으로 매일 실행되며, cron job 은 postgres(슈퍼유저, RLS 우회)로 동작한다.
-- 클라이언트·일반 관리자에게는 이 함수를 호출할 권한도, humease_inquiries/humease_page_views
-- 에 대한 DELETE RLS 정책도 주지 않는다 — 기존 RLS(anon 전면 차단, admin 은 select/update만)
-- 는 이 마이그레이션으로 바뀌지 않는다.
--
-- 적용은 Supabase Management API(`/v1/projects/{ref}/database/query`)로 직접 수행했다
-- (2026-09-18). 이 프로젝트는 다른 앱과 DB 를 공유하므로 `supabase db push` 를 쓰지 않는다.
-- pg_cron jobid 9, jobname 'humease_purge_expired_data' 로 등록 확인됨. 함수 EXECUTE 권한은
-- service_role/postgres 뿐이며 anon/authenticated 에는 없음을 information_schema 로 확인.

create extension if not exists pg_cron with schema extensions;

create or replace function public.humease_purge_expired_data()
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  delete from public.humease_inquiries
  where created_at < now() - interval '3 years';

  delete from public.humease_page_views
  where created_at < now() - interval '12 months';
end;
$$;

-- 클라이언트 role 에는 이 함수 실행 권한을 주지 않는다. pg_cron job(postgres)만 호출한다.
revoke all on function public.humease_purge_expired_data() from public, anon, authenticated;

select cron.schedule(
  'humease_purge_expired_data',
  '0 18 * * *', -- 매일 UTC 18:00 = KST 03:00
  $$select public.humease_purge_expired_data();$$
);
