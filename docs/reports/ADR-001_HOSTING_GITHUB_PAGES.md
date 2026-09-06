# ADR-001. 호스팅을 Vercel 에서 GitHub Pages 로 변경

- 결정일: 2026-09-06 / Asia/Seoul
- 결정: 대표 지시 — "Vercel 말고, GitHub 로 변경하자"
- 상태: **채택.** SPEC v3 의 Vercel 조항을 대체한다.
- 선행 근거: `docs/reports/G0_BASELINE.md` §7

## 1. 배경

G0 §7 에서 Vercel 팀 `markanitp` 의 플랜이 `hobby` 로 확인됐다. Hobby 는 비상업적 용도 전용이라 회사 홈페이지 운영에 부적합하고, Pro 상향은 비용 발생이라 승인 대상이었다. 이 항목은 G0 의 유일한 `FAIL` 이었다.

## 2. 결정이 해소하는 것

- **Vercel Pro 비용 승인 불필요.** G0 §7 `FAIL` → 해소.
- 기존 사이트가 이미 GitHub Pages 에서 운영 중이므로 호스팅 특성·인증서·도메인 절차가 검증되어 있다.
- 전환·롤백이 단순해진다. 커스텀 도메인을 구 저장소에서 신 저장소로 옮기고, 문제 시 되돌리면 된다.

## 3. 결정이 무너뜨리는 SPEC v3 조항

GitHub Pages 는 **정적 호스팅 전용**이다. 서버 런타임이 없다. Next.js 는 `output: 'export'` 로 빌드해야 한다.

| SPEC v3 조항 | 상태 | 대체 |
|---|---|---|
| §2 배포 "새 GitHub 저장소 → 새 Vercel 프로젝트" | **폐기** | 새 GitHub 저장소 → GitHub Pages (Actions) |
| §2 문의 "같은 Origin 의 Next.js **Route Handler**" | **폐기 — 실행 불가** | 아래 §4 |
| §2 이미지 "`next/image`" | **수정** | `images.unoptimized: true` 또는 커스텀 로더 |
| §5 "Vercel 의 Production 배포와 도메인 공개는 다른 단계" | **수정** | Pages 배포와 커스텀 도메인 연결로 재기술 |
| `docs/07_VERCEL_RELEASE_AND_ROLLBACK.md` | **전면 재작성** | Pages 릴리스·롤백 절차 |

정적 export 에서 함께 사용할 수 없는 것: Route Handler 의 런타임 동작, Server Actions, Middleware, ISR·on-demand revalidate, `cookies()`/`headers()` 기반 동적 렌더링, `generateStaticParams` 없는 동적 라우트.

계속 사용 가능한 것: App Router, Server Components 의 빌드 타임 렌더링, Metadata API, `sitemap.ts`, `robots.ts`, Tailwind 4, TypeScript strict.

## 4. 문의 기능

SPEC v3 §2 의 Route Handler 방식은 정적 호스팅에서 실행되지 않는다.

**당면 조치는 변화 없다.** 대표 지시 "운영 자격정보가 없는 동안 문의는 mock/disabled 로 구현하라" 가 그대로 유효하므로, 어댑터 인터페이스 뒤에 mock 구현을 두고 진행한다. 실제 어댑터 선택은 승인 시점으로 미룬다.

승인 시점의 선택지 — 결정 전까지 어느 것도 구현하지 않는다.

1. **클라이언트 → Supabase 직접 insert.** 기존 운영 사이트가 이미 이 방식이다(`Contact.tsx` → `inquiries`). 기능 계약을 그대로 승계하므로 `docs/01` §3 "서버 어댑터의 기능 계약만 이어받는다" 에 부합한다. anon key 노출을 전제로 RLS 로 보호해야 한다.
2. **외부 폼 서비스.** 서버 불필요. 개인정보 처리 위탁 검토 필요.
3. **외부 서버리스 함수 1개만 별도 호스팅.** Pages 는 정적, 함수만 분리. 교차 Origin 이므로 CORS 설계 필요.

## 5. Preview 환경 — 새로 생긴 공백

Vercel 은 PR 마다 Preview 를 자동 생성한다. **GitHub Pages 에는 이 기능이 없다.**

대체안: 신규 저장소 `humease-web-v2` 의 프로젝트 Pages 자체를 Preview 로 사용한다.
`https://<owner>.github.io/humease-web-v2/` 에서 검증하고, 승인 후 커스텀 도메인을 이 저장소로 옮긴다. 기존 `Humease/Homepage` 는 그때까지 `www.humease.com` 을 계속 서빙한다.

⚠ **basePath 함정.** 프로젝트 Pages 는 하위 경로(`/humease-web-v2/`)로 서빙되므로 `basePath`·`assetPrefix` 가 필요하다. 커스텀 도메인 연결 후에는 루트가 되어 `basePath` 가 없어야 한다. 이 값을 하드코딩하면 도메인 전환 순간 모든 자산 경로가 깨진다. **처음부터 환경변수로 주입하고 두 상태 모두 빌드 검증한다.**

## 6. 저장소 소유 — 미해결 차단

G0 조사 결과 계정 관계가 이렇다.

| 계정 | 타입 | 역할 |
|---|---|---|
| `Humease` | **User** (조직 아님) | `Humease/Homepage` 소유. `www.humease.com` 연결 주체 |
| `markanitp-maker` | User | gh CLI **활성 계정**. `Homepage` 에 `pull` 권한만 (`admin:false`, `push:false`) |
| `humease21` | User | gh CLI 로그인돼 있으나 비활성 |

- 활성 계정은 **어떤 조직에도 속해 있지 않다.** 조직 소유 저장소를 만들 수 없다.
- 활성 계정은 기존 저장소에 **쓰기 권한이 없다.** READ-ONLY 준수에는 문제없지만, **최종 도메인 전환도 이 계정으로는 불가능하다.**
- 커스텀 도메인은 한 시점에 한 저장소에만 붙는다. `humease.com` 을 `markanitp-maker` 소유 저장소로 옮기려면 `Humease` 계정에서 먼저 해제해야 한다. **계정 간 이동이라 소유자 조작이 필요하다.**

→ **신규 저장소를 `Humease` 계정 아래 만드는 것을 권고한다.** 도메인 소유 주체와 일치해야 전환이 단순해진다. 이 경우 `Humease` 권한을 가진 계정으로 생성해야 한다.

## 7. GitHub Pages 이용 약관 경계

GitHub Pages 약관은 상거래를 주목적으로 하는 사이트나 상용 SaaS 제공에 무료 호스팅을 쓰는 것을 금지한다. 회사 소개·서비스 안내 중심의 마케팅 사이트는 통상 허용 범위이며, **기존 사이트가 이미 같은 조건으로 운영 중**이다.

Vercel Hobby 의 명시적 비상업 제한보다 완화된 조건이지만 무제한 허용은 아니다. 결제·회원가입·SaaS 기능을 추가하면 재검토 대상이다. 이번 범위에 그런 기능은 없다(`SPEC.md` §4).

## 8. 후속 조치

| # | 항목 | 상태 |
|---|---|---|
| 1 | `docs/07` 을 Pages 릴리스·롤백으로 재작성 | 대기 |
| 2 | SPEC v3 §2 문의·이미지·배포 행 수정 | **대표 확인 필요** — 패키지 개정본을 받을지 이 저장소에서 수정할지 |
| 3 | 신규 저장소 소유 계정 확정 | **대표 확인 필요** |
| 4 | `basePath` 환경변수 설계 | 구현 시 반영 |
| 5 | 문의 실제 어댑터 선택 | 승인 시점으로 연기 |

로컬 구현(Next.js 초기화, 디자인 토큰, 12개 페이지, 이미지 최적화, mock 문의)은 위 항목과 무관하게 진행 가능하다.
