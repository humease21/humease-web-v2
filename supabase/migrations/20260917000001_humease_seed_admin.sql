-- markanitp@gmail.com 은 이미 이 프로젝트의 auth.users 에 Google OAuth 로 연동되어 있다
-- (app_metadata.providers: ["email","google"], user_id 3a7969f6-529a-4e89-b6f8-790461d874fa).
-- 새 계정을 만들지 않고, 기존 UUID 를 그대로 humease_admin_users 에 연결한다.
insert into public.humease_admin_users (user_id, email, role)
values ('3a7969f6-529a-4e89-b6f8-790461d874fa', 'markanitp@gmail.com', 'admin')
on conflict (user_id) do nothing;
