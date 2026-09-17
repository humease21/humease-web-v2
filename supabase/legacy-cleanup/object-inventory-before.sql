-- 삭제 전 스냅샷. 결과를 저장해 두고 정리 후 object-inventory-after.sql 결과와 비교한다.
select table_schema, table_name
from information_schema.tables
where table_schema = 'public'
order by table_name;

select trigger_schema, trigger_name, event_object_table
from information_schema.triggers
where trigger_schema = 'public'
order by event_object_table, trigger_name;

-- Edge Functions 는 Dashboard > Edge Functions 목록 또는 `supabase functions list`로 별도 확인한다
-- (information_schema 로는 조회되지 않는다).
