-- object-inventory-before.sql 과 동일 쿼리. 정리 후 실행해 before 결과와 비교한다.
-- 기대 결과: public.inquiries, public.view_logs 테이블이 사라지고 나머지는 before 와 동일해야 한다.
select table_schema, table_name
from information_schema.tables
where table_schema = 'public'
order by table_name;

select trigger_schema, trigger_name, event_object_table
from information_schema.triggers
where trigger_schema = 'public'
order by event_object_table, trigger_name;
