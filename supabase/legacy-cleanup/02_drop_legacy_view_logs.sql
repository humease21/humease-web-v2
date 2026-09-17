-- 2단계: public.view_logs 삭제 (890 rows, 백업 불필요 — 대표 승인 2026-09-17).
-- CASCADE 로 종속 PK/RLS policy 를 함께 제거한다.

drop table if exists public.view_logs cascade;
