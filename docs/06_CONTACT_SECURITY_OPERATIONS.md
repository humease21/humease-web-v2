# 06. 문의·보안·운영

- 작성 2026-09-06 / **전면 재작성 2026-09-06 (v2)**
- 재작성 사유: v1 은 Next.js Route Handler 기반 서버 문의 API 를 전제로 §1~§9 를 구성했다.
  호스팅이 GitHub Pages 로 확정되면서 서버가 없어졌고, 요청 경로·HTTP 상태 계약·
  rate limit·서버 권한 검증·관리자 인증 조항이 전부 실행 불가가 됐다. v1 본문은 삭제했다.
- 서버가 필요한 방식을 다시 선택하면 **호스팅 결정부터 재논의**한다.

## 1. 현재 상태 — mock/disabled

| 항목 | 상태 |
|---|---|
| 문의 폼 | **비활성.** `src/content/contact.ts` 의 `CONTACT_MODE = 'disabled'` |
| 화면 | 폼 대신 이메일 CTA 우선 노출 |
| 저장·알림 | 없음. 운영 문의·메일·로그에 쓰지 않는다 |
| 자격정보 | 클라이언트 번들에 넣지 않는다 |

`docs/03` P11 에 따라 **죽은 폼을 억지로 공개하지 않는다.** 준비 중인 문의 항목만
목록으로 보여주고 실제 접수는 이메일로 받는다. 운영자 확인 없이 응답 시간을 약속하지 않는다.

## 2. 기존 운영 사이트의 문의 계약 — READ-ONLY 조사 결과 (2026-09-06)

구 사이트를 읽기 전용으로 조사해 확인한 실제 동작이다.

| 경로 | 구현 | secret 노출 | 재사용 판정 |
|---|---|---|---|
| 문의 저장 | client → Supabase `inquiries` insert (anon key + RLS) | 없음. anon key 는 공개 전제 | **재사용 가능** — RLS 확인 후 |
| 알림 | Supabase DB Webhook → Edge Function `discord-webhook` → Discord | webhook URL 이 Supabase Secrets 에 있어 클라이언트 미노출 | **안전·재사용 가능** |
| 메일 | client → `formsubmit.co/ajax/…` | secret 없음. 개인정보를 제3자에 직접 전송 | **보류** — 처리위탁 검토 필요 |
| 분석 로그 | `logEvent()` → Supabase `view_logs`. `/admin` 에서는 전송 차단 | 없음 | 이번 범위 밖 |

계약은 `src/content/contact.ts` 주석에 기록돼 있다. **어떤 것도 아직 연결하지 않았다.**

## 3. 실제 어댑터를 붙일 때의 선택지

정적 호스팅에는 서버가 없다. 승인 시점에 아래 중 하나를 고른다.

1. **클라이언트 → Supabase 직접 insert.** 기존 사이트가 이미 이 방식이다.
   기능 계약을 그대로 승계한다. anon key 노출을 전제로 RLS 로 보호해야 한다.
2. **외부 폼 서비스.** 서버 불필요. 개인정보 처리위탁 검토가 필요하다.
3. **외부 서버리스 함수 1개만 별도 호스팅.** 교차 Origin 이므로 CORS 설계가 필요하다.

어느 쪽이든 **개인정보처리방침 승인이 선행 조건**이다.
수집 기능을 켜면서 `/privacy` 를 생략하지 않는다.

## 4. 환경과 비밀정보

```
NEXT_PUBLIC_SITE_DEPLOY_TARGET   preview | production
NEXT_PUBLIC_SITE_ORIGIN          산출물을 제공할 origin
NEXT_PUBLIC_BASE_PATH            /humease-web-v2 또는 빈 값
NEXT_PUBLIC_SEARCH_INDEXING_ENABLED  색인 승인
INDEXNOW_ENABLED                 기본 false
```

- `NEXT_PUBLIC_` 접두사가 붙은 값은 **빌드 산출물에 그대로 들어간다.**
- **`service_role` 키에는 절대 `NEXT_PUBLIC_` 을 붙이지 않는다.** RLS 를 전부 우회하는 키이며,
  정적 사이트에는 이를 쓸 서버 자리 자체가 없다.
- `.env.local` 은 gitignore 대상이다. 저장소에 커밋하지 않는다.
- `npm run verify:exposure` 가 빌드 산출물에서 `service_role`·JWT·GitHub 토큰·
  Discord webhook 패턴을 검사하고, CI 가 매 배포마다 실행한다.

## 5. 관리자 기능 — 미구현

`SPEC.md` §4 에서 **별도 시스템 범위**로 분리했다. 정적 Export 에는 서버 인증이 없으므로
이 저장소에 관리자 영역을 만들지 않았다.

구 사이트의 관리자는 `/admin` 에서 Google OAuth + 이메일 화이트리스트로 동작한다.
이관 범위와 인증 주체는 별도 확인 대상이며, **확인 전에는 릴리스 게이트에서 차단한다.**
robots 에 경로를 적는 것은 보호가 아니다. 인증·권한으로 처리해야 한다.

## 6. 개인정보

- `/privacy` 는 **승인 본문이 없어 페이지를 만들지 않았다.** 메뉴·푸터·사이트맵에도 넣지 않았다.
- 문의가 비활성이므로 현재 수집하는 개인정보가 없다.
- 분석 도구는 도입하지 않았다. 광고 추적·세션 리플레이도 없다.
- 스크린샷·로그·보고서에 실제 문의 원문·연락처·토큰을 포함하지 않는다.

## 7. 하지 않은 것

운영 DB·RLS 변경, 운영 메일 발송, 실제 개인정보를 이용한 테스트,
구 저장소 수정, 관리자 인증 구조 변경, 분석 서비스 도입.
전부 별도 승인 대상이다.
