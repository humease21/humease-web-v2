# 06. 문의·관리자·환경·보안

- 개정 2026-09-06 (v2) — 정적 Export 기준으로 재정리.

> **⚠ v1 의 서버 전제는 폐기됐다.** GitHub Pages 는 정적 호스팅이라
> Next.js Route Handler·Server Actions·서버 인증·rate limit·honeypot 서버 검사를
> 구현할 수 없다. 아래 v1 본문의 서버 측 계약은 **미구현**이며,
> 실제 문의 어댑터를 붙일 때 아래 현행 계약을 따른다.
>
> ### 현행 문의 상태 — mock/disabled
>
> - `src/content/contact.ts` 의 `CONTACT_MODE = 'disabled'`
> - 화면에는 폼 대신 이메일 CTA 를 노출한다. 죽은 폼을 공개하지 않는다(`docs/03` P11).
> - 운영 문의·메일·로그에 쓰지 않는다. 운영 자격정보를 번들에 넣지 않는다.
>
> ### 기존 운영 사이트의 문의 계약 — READ-ONLY 조사 결과(2026-09-06)
>
> | 경로 | secret 노출 | 재사용 판정 |
> |---|---|---|
> | client → Supabase `inquiries` insert (anon key + RLS) | 없음(anon 은 공개 전제) | 재사용 가능 — RLS 확인 후 |
> | Supabase DB Webhook → Edge Function → Discord | webhook URL 이 Supabase Secrets 에 있음 | **안전·재사용 가능** |
> | client → FormSubmit → contact@humease.com | secret 없음. 개인정보를 제3자에 직접 전송 | **보류** — 처리위탁 검토 필요 |
>
> 실제 어댑터 선택은 동의·개인정보처리방침 승인 시점의 결정 사항이다.
> 서버가 필요한 방식을 고르면 호스팅 결정부터 다시 논의해야 한다.


## 1. 기능 이관 원칙

새 프런트엔드는 Next.js로 새로 작성한다. 기존 문의 저장소·메일·관리자 업무는 실제 계약을 조사해 필요한 동작을 이어받되 실행 코드·키·인증 우회 방법을 복사하지 않는다. 기존 v2 자료의 Supabase·FormSubmit 설명은 확인 단서이며 현재 운영이 그렇다고 단정하지 않는다.

이 문서는 문의 기능의 기본 구현까지 범위에 포함한다. 자격정보나 정책이 없다고 조용히 폼을 없애고 ‘전체 완료’로 보고하지 않는다. 연결 전에는 모의 어댑터로 개발·검수하고, 공개 조건 미충족은 `BLOCKED`로 명시한다.

## 2. 요청 경로

```text
ContactForm (Client Component)
  → POST /api/contact (Node.js Route Handler)
  → 환경·host·Origin·입력·남용 방지 검사
  → contact-service
  → 승인된 contact-store 저장
  → 승인된 notification 알림
  → 접수 결과 반환
```

브라우저가 DB나 메일 발송 서비스에 직접 접속하지 않는다. `route.ts`의 POST handler를 사용하며 HTTP method·JSON 응답·상태를 명확히 정의한다. route handler 실행과 서버 전용 모듈은 Client Component에 import하지 않는다. [S08]

홈페이지 문의 내용을 LLM에 보내지 않는다. 호스팅 빌드나 페이지 렌더만으로 문의·메일·관리자 작업이 실행되면 실패다.

## 3. 입력 계약

| 필드 | UX / 검증 기준 |
|---|---|
| company_name | 회사명, 필수, trim 후 1–100자 |
| manager_name | 담당자명, 필수, trim 후 1–50자 |
| email | 필수, 형식 검증, 254자 이하 |
| phone | 선택, 30자 이하, 국제번호 등 합리적인 입력 허용 |
| interested_services | 고정 enum 배열, 1개 이상, 중복 제거 |
| message | 선택, 2,000자 이하, 제어문자·HTML 주입 방지 |
| consent | 필수 수집 동의 true, 초기 체크 금지 |
| consent_version | 실제 승인된 정책 버전과 서버에서 대조 |
| request_id | 클라이언트 생성 UUID, 형식 검증·추적용; 멱등 보장을 자동 의미하지 않음 |
| website | honeypot, 일반 사용자에게 노출·탐색되지 않게 구현 |

관심 분야 enum: `enterprise-data`, `e-discovery`, `internal-control`, `exchange-archive`, `applied-ai`, `momieum`, `other`. 페이지 query의 `service`는 이 목록에 있을 때만 사전 선택한다. 임의 query를 HTML·알림 제목에 넣지 않는다.

알 수 없는 필드는 제거하거나 400으로 거부하는 정책을 통일한다. 요청 본문 제한은 16KiB로 정하고 실제 바이트 제한을 적용한다. Content-Length만 신뢰하지 말고 수신 크기를 제한한다. 연락처와 문의 본문을 로컬스토리지·URL·analytics에 저장하지 않는다.

클라이언트 검증은 편의 기능이고 서버에서 같은 검증을 다시 수행한다. 저장소 필드명·NOT NULL·길이·동의 기록 방식은 G0에서 확인한 스키마와 어댑터로 맞춘다. 기존 스키마로 표현할 수 없으면 DB 변경 요청으로 기록하고 무단 migration하지 않는다.

## 4. HTTP·사용자 상태 계약

| 상황 | HTTP / 응답 코드 | 사용자 처리 |
|---|---|---|
| 저장 확인 성공 | 201 / RECEIVED | 접수 완료, 재제출 유도하지 않음 |
| 모의 환경 성공 | 200 / MOCK_RECEIVED | Preview 전용 ‘테스트 접수이며 실제 전송되지 않았습니다’ |
| 잘못된 입력 | 400 / VALIDATION_ERROR | 해당 필드 오류, 입력 보존 |
| Origin 거부 | 403 / FORBIDDEN_ORIGIN | 일반 오류, 내부 허용목록 노출 금지 |
| 요청 과다 | 429 / RATE_LIMITED | 제한 안내·Retry-After, 입력 보존 |
| 본문/형식 위반 | 413 또는 415 | 크기·형식 안내 |
| 기능 꺼짐·미승인 연결 | 503 / CONTACT_UNAVAILABLE | 이메일 연락 경로 제공 |
| 저장 실패가 확인됨 | 503 / STORE_FAILED | 접수되지 않았다고 안내, 입력 보존 |
| 저장 여부 불명확한 타임아웃 | 504 / SUBMISSION_UNCERTAIN | 무조건 재전송하지 않음, 중복 가능성 없는 확인 경로 안내 |
| 저장 성공·알림 실패 | 201 / RECEIVED | 성공 유지, 내부 비식별 경고만 기록 |

성공 문구: **문의가 접수되었습니다. 남겨주신 연락처로 회신드리겠습니다.**
실패 문구: **문의가 접수되지 않았습니다. 입력 내용은 유지됩니다. 다시 시도하거나 contact@humease.com으로 연락해 주세요.**
불확실 문구: **접수 여부를 확인하지 못했습니다. 중복 제출을 피하기 위해 잠시 후 확인하거나 contact@humease.com으로 연락해 주세요.**

여기서 ‘잠시 후 확인’은 시스템이 내구성 있는 상태 조회 기능을 제공할 때만 UI에 사용한다. 그 기능이 없으면 **접수 여부를 확인하지 못했습니다. 중복 제출을 피하기 위해 contact@humease.com으로 연락해 주세요.**로 고정한다. 없는 자동 확인 기능을 약속하지 않는다.

폼 상태: idle → validating → submitting → received / failed / uncertain. 제출 중 중복 클릭을 막는다. failed에서는 입력을 보존하고 실제 확인된 재시도 조건에서만 재전송한다. uncertain에서는 자동 retry하지 않는다. 미수신 실패와 저장 후 알림 실패를 혼동하지 않는다.

## 5. 중복·알림·실행 종료

기존 저장소에 내구성 있는 request_id 유일성 또는 검증된 멱등 API가 있으면 그것을 이용한다. 없다면 클라이언트 중복 클릭 차단만으로 ‘정확히 한 번 저장’을 보장하지 않는다. 네트워크 불확실 상태를 위 계약대로 처리한다.

메일 전송은 서버 응답 전에 제한된 시간 안에 결과를 await한다. 승인된 내구성 큐가 이미 있는 경우에만 큐 등록 후 처리할 수 있다. 응답 이후 끝날지 모르는 fire-and-forget fetch·임의 백그라운드 재시도·새 크론을 추가하지 않는다.

알림 실패 기록에는 request_id·비식별 에러 코드·발생 시각만 남긴다. 저장 데이터와 운영자가 연결해 처리할 수 있는지 검증한다. 자동 재시도 작업이 없는데 ‘알림은 곧 재발송됩니다’라고 안내하지 않는다.

## 6. 환경과 비밀정보

| 변수 | 기본 / 범위 | 규칙 |
|---|---|---|
| SITE_ORIGIN | https://www.humease.com | canonical용 고정 공용 값 |
| SITE_RELEASE_STATE | staging / live, 기본 staging | live도 운영 전환 승인 없이 활성화하지 않음 |
| CONTACT_MODE | disabled / mock / live / email-only | Preview는 mock 또는 disabled |
| ANALYTICS_ENABLED | 기본 false | 승인 후 실제 운영 host에서만 |
| 서버 저장소 자격정보 | 실제 확인 후 필요한 항목만 | 서버 전용, Preview에 운영 값 금지 |
| 서버 알림 자격정보 | 실제 승인 공급자 항목만 | 브라우저 공개·로그 출력 금지 |
| 관리자 인증 설정 | 확인된 공급자·역할 계약 | 공개 키와 비밀키를 분리 |

`NEXT_PUBLIC_`에는 비밀을 넣지 않는다. `.env.local`·실제 키·원본 문의 데이터는 Git에 커밋하지 않는다. `.env.example`에는 이름과 빈 값·설명만 둔다. 비밀을 `next.config`의 공개 env 치환이나 클라이언트 props에 넣지 않는다.

실제 운영 쓰기는 서버에서 **호스팅 production 환경 + SITE_RELEASE_STATE=live + CONTACT_MODE=live + 요청 host가 www.humease.com + 검증된 저장·정책 준비 상태**를 모두 충족할 때만 허용한다. 사용자가 보내는 `environment=production` 등의 값은 신뢰하지 않는다.

빌드·테스트·정적 렌더·Preview에서는 운영 어댑터를 로드해도 부작용이 없어야 한다. 가장 안전하게 운영 자격정보 자체를 제공하지 않는다. 환경변수 변경이 빌드 산출물·화면에 영향을 주면 재배포하고 해당 배포를 다시 검증한다.

## 7. 남용 방지·권한·응답 보안

POST는 JSON만 받으며 실제 Origin을 고정 허용목록과 비교한다. 임의 전체 `.vercel.app` 도메인을 운영 허용목록에 넣지 않는다. 같은 Origin의 브라우저 폼만 사용하고 CORS 와일드카드를 열지 않는다. Origin 검사는 사용자 인증이나 강력한 봇 방지를 대체하지 않는다.

문의 공개 전 공유 가능한 요청 제한 또는 승인된 플랫폼 방어 규칙을 실제로 검증한다. 서버리스 인스턴스 내부 메모리 카운터만으로 전역 제한이 된다고 쓰지 않는다. 제한 기준의 초기 목표는 동일 출처/IP의 10분당 5회이며 프록시·공유망·개인정보 처리와 운영 오탐을 검토해 승인한다. 원본 IP를 명세서·로그에 무제한 저장하지 않는다.

body·메일 header injection·과도한 길이·허용 enum·honeypot을 검사한다. 외부 링크의 URL scheme을 제한하고 사용자 입력을 HTML로 직접 실행하지 않는다. 저장·관리자 API는 `Cache-Control: no-store`를 사용하고 인증 실패 응답에도 데이터 조각을 넣지 않는다.

CSP는 실제 Next.js 인라인 script와 도입한 서비스 도메인을 조사해 report-only 검증 후 적용한다. 정책 문구만 강하게 써놓고 페이지가 깨지게 만들지 않는다. `X-Content-Type-Options`, 적절한 Referrer-Policy, frame 제한을 적용한다. HSTS의 includeSubDomains·preload는 다른 하위 도메인에 영향이 있으므로 별도 승인 없이 추가하지 않는다.

## 8. 관리자 기능

기존에 실제 사용 중인 업무를 G0에서 목록화한다. 기본 후보는 문의 목록·상세·처리 상태 확인이며, 기존 스키마에 없는 상태 변경·대량 내보내기·삭제 기능은 새로 발명하지 않는다.

`/admin`은 신규 Next.js의 운영 영역으로 구현한다. 기존과 동일한 인증 주체를 사용할 수 있는지 확인하되 새 도메인·redirect URI·쿠키·세션 갱신을 검증한다. 기존 인증 설정 변경이 필요하면 영향과 승인 대상을 분리한다.

서버 layout의 진입 검사뿐 아니라 각 관리자 API·데이터 접근 함수에서도 인증과 역할 권한을 검증한다. public UI에서 링크를 숨기거나 proxy에서만 확인하는 것은 충분하지 않다. 타 사용자 또는 무권한 토큰, 만료 세션, 직접 API 요청을 거부해야 한다.

서비스 역할 키로 모든 요청을 대신 수행하면서 권한 확인을 생략하지 않는다. DB/RLS를 약하게 바꿔 UI를 작동시키지 않는다. 문의 개인정보를 정적 HTML·sitemap·OG·캐시·빌드 로그에 남기지 않는다. 관리자 경로는 noindex이며 공개 포트폴리오 모션·이미지를 사용하지 않는다.

기존 관리자 업무를 제외하려면 대표님의 명시적 제외 승인과 대체 운영 절차가 필요하다. ‘새 프로젝트라서 없어짐’은 허용하지 않는다.

## 9. 개인정보·분석·장애 시 공개 방식

문의 수집 목적·항목·보유기간·동의와 정책 버전은 실제 승인 문서에서 가져온다. 법률 확정 문서를 이 개발명세서에서 임의로 만들어 넣지 않는다. 회사 홈페이지 정책과 맘이음 서비스 정책은 별개다.

정책·저장 경로·안전장치가 준비되지 않은 동안에는 mock 개발을 진행한다. 공개를 이메일 CTA만으로 제한해야 한다면 `CONTACT_MODE=email-only`로 명시하고 대표님이 기능 축소를 승인한 릴리스 예외로 기록한다. 이 예외 없이 폼 이관 완료라고 보고하지 않는다.

Analytics의 허용 이벤트는 CTA·고정 page path·서비스 enum·비식별 오류 코드뿐이다. 이메일·전화·문의 본문·DOM 전체 텍스트·민감 query·세션 리플레이를 수집하지 않는다. Preview·자동 테스트·관리자에서는 비활성화한다. 도구를 새로 결제·가입하거나 기존 로그 DB를 변경하지 않는다.
