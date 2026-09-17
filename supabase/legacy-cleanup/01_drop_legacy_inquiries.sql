-- 1단계: public.inquiries 삭제 (2 rows, 백업 불필요 — 대표 승인 2026-09-17).
-- CASCADE 로 send_discord_notification TRIGGER 와 종속 PK/RLS policy 를 함께 제거한다.
-- 이 문은 public.inquiries 와 그에 직접 종속된 객체만 지운다. 다른 테이블은 건드리지 않는다.

drop table if exists public.inquiries cascade;
