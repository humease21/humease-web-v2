# 레거시 Supabase 객체 정리 (프로젝트 cgydvjqhsllpeuxbephb)

**이 디렉터리는 `supabase/migrations/`가 아니다.** `supabase db push`로 자동 적용되지 않는다.
대표가 명시적으로 확정한 삭제 승인(2026-09-17, Deep Interview 델타 D5)을 근거로, 해당 프로젝트에
실제 접근 권한을 가진 사람이 **수동으로, 순서대로** 실행해야 한다.

## 실행 전 필수 확인
1. `object-inventory-before.sql`을 실행하고 결과를 저장한다.
2. 아래 "절대 보존" 목록에 있는 객체가 삭제 대상에 전혀 없는지 다시 확인한다.
3. `01_drop_legacy_inquiries.sql` → `02_drop_legacy_view_logs.sql` → `03_drop_swift_responder_function.sql` 순서로 실행한다.
4. `object-inventory-after.sql`을 실행하고 before와 비교해 **정확히 이 4개 객체(테이블 2개 + 트리거 1개 + Edge Function 1개)만** 사라졌는지 검증한다.

## 삭제 승인 대상 (백업 불필요, 영구 삭제 가능)
- `public.inquiries` TABLE (2 rows) — 레거시 Humease 문의. 신규 `humease_inquiries`로 대체.
- `public.inquiries`에 연결된 `send_discord_notification` TRIGGER
- `public.view_logs` TABLE (890 rows) — 레거시. 신규 `humease_page_views`로 대체.
- `swift-responder` Edge Function (위 두 테이블 참조가 없어지면 삭제)

## 절대 삭제·변경 금지 (다른 프로젝트/서비스 자산)
- `public.blog_posts` 및 Humease-Auto-Blog 관련 자산
- `public.kbestie_*`, `public.kbestiebeta_*` 테이블 및 관련 RPC 전체 (K-Bestie-Beta-Site 운영 중)
- `public.md_*` 테이블, Modoo 관련 함수·Storage, `pmf-evaluation-report`
- `anybuild_v3` schema 전체
- `matgong` schema 전체, `matgong-*` Edge Functions, Storage 4개 bucket
- pgvector 관련 함수
- Supabase 시스템 schema (`auth`, `storage`, `realtime` 등 내부 구조)
- **Auth 사용자 17명 전원** — 특히 관리자 계정 `markanitp@gmail.com`과 그 UUID는 절대 삭제·변경 금지
- `public.kbestiebeta_admins` — K-Bestie-Beta-Site 전용 관리자 테이블. HUMEASE 관리자 권한 테이블로 재사용하지 않는다(별도로 `humease_admin_users`를 새로 만든다).
