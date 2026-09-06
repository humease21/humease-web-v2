# HUMEASE 홈페이지 개발명세서

## v3.1 · Next.js App Router · 정적 Export · GitHub Pages · Korean-first

- 최초 작성 2026-09-06 / **개정 2026-09-06 (v3.1)**
- 개정 사유: v3.0 은 Vercel 배포와 영문 메인 문구를 전제로 작성됐다. 이후 대표 지시로
  호스팅이 **GitHub Pages** 로, 표시 언어가 **Korean-first** 로 확정되면서 두 전제가 무효가 됐다.
  이 문서는 **실제 구현과 일치하는 내용만** 담는다. 미구현은 `미구현` 으로 표시한다.
- 문서 상태: 개발·검수 기준. 실제 배포·DNS 변경 완료를 의미하지 않는다.
- 저장소 / 프로젝트 기준 이름: `humease-web-v2`
- 최종 대표 주소: `https://www.humease.com` (전환 전까지 구 사이트가 서비스 중)
- 검증 주소: `https://humease21.github.io/humease-web-v2/`
- 이미지: **대표님이 이미 생성한 자산만 사용.** 신규 생성·재생성·프롬프트 작성은 범위 밖.

## 1. 이 문서가 대체하는 것

v1·v2 설계서의 실행 지침을 전부 대체한다. v3.0 대비 변경점은 아래 §9 에 정리했다.

| 구버전 지침 | 현행 |
|---|---|
| 기존 Vite 프로젝트 수정·재사용 | 폐기. 신규 Next.js 프로젝트 |
| 기존 저장소에서 feature 브랜치 작업 | 폐기. 새 저장소 안에서만 작업 |
| React Router·SPA·Puppeteer 프리렌더 | 폐기. App Router 정적 Export |
| `vite build` · `dist` | 폐기. `next build` · `out` |
| **Vercel 프로젝트 배포** | **폐기(v3.1).** GitHub Actions → GitHub Pages |
| 이미지 17개 신규 생성 | 폐기. 기존 A01–A17 매핑 |
| 운영 DB·메일 설정 자동 복사 | 금지. 문의는 현재 mock/disabled |

## 2. 고정 기술 기준 — 실측값

`package-lock.json` 기준 실제 설치 버전이다. 버전 문자열을 조사 없이 만들어 넣지 않는다.

| 영역 | 기준 | 실측 |
|---|---|---|
| 프레임워크 | Next.js 16.x App Router | **16.3.4** |
| React | react / react-dom 동일 버전 | **19.2.8** |
| 언어 | TypeScript strict | **5.9.3** |
| 스타일 | Tailwind CSS 4.x | **4.3.3** |
| 런타임 | Node.js 24.x | `engines >=24 <25`, `.nvmrc` 24 |
| 패키지 | npm, lockfile 커밋, CI `npm ci` | 적용 |
| 빌드 | **`output: 'export'` 완전 정적** | 적용 |
| 배포 | **GitHub Actions → GitHub Pages** | 적용 |
| 문의 | **서버 없음.** 현재 mock/disabled, 이메일 CTA 우선 | 적용 |
| 모션 | CSS + IntersectionObserver. 라이브러리 없음 | 적용 |
| 이미지·폰트 | 사전 최적화본 + `next/font/local` 서브셋 | 적용 |
| 검색 메타 | Metadata API / `sitemap.ts` / `robots.ts` | 적용 |

정적 Export 에서 쓰지 않는 것: Route Handler 런타임 동작, Server Actions, Middleware,
ISR, `next.config` 의 `redirects()`, 서버 의존 이미지 최적화. 상세는 `docs/04`.

## 3. 회사·브랜드 방향

**Quiet Intelligence — 조용하지만 수준이 느껴지는 기술회사.**

브랜드 정의: 기업 데이터의 전문성을 바탕으로, 실제 사용되는 AI 서비스와 시스템을 설계·구현하는 회사.

- 메인 메시지: **복잡한 데이터와 아이디어를, 실제로 작동하는 기술로.**
- 두 사업축: **기업 데이터 / AI 서비스**
- 자체 프로젝트: **맘이음 — 개발 중**
- 맘이음 핵심 문구: **친구처럼 곁에 있고, 비서처럼 도와주고, 가족과 연결해주는 AI**

> **v3.1 변경.** v3.0 의 영문 메인 `Complexity, made intelligent.` 는 삭제됐다.
> Korean-first 원칙에 따라 한국어 메시지가 첫 화면을 감당한다.
> 고급스러움은 영어 문구가 아니라 타이포그래피·여백·이미지·모션·레이아웃에서 만든다.

Harvey 50% / Sierra 25% / Cohere 25% 는 내부 디자인 참고 비중이다. 성능 점수나 측정값이 아니며
타사 코드·로고·사진·문구를 복제하지 않는다.

### 표시 언어 원칙 (Korean-first)

사용자가 읽는 설명·섹션명·CTA·질문·프로세스는 한국어를 우선한다.
영문은 브랜드명, 공식 제품명, 업계 표준 용어, SEO 연속성에 필요한 경우에만 유지한다.
**장식용 영문 병기는 사용하지 않는다.**

유지하는 영문: HUMEASE · Arctera · Enterprise Vault Complete ·
**Enterprise Vault Capture (formerly Merge1)** · Data Insight · eDiscovery Platform ·
e-Discovery · Exchange · Microsoft 365 · Microsoft Teams · Slack ·
Microsoft MVP · Symantec · Veritas · Enterprise IT · AnyBuild · HairAI.

우선순위: 한국어 메시지 > 공식 제품·브랜드명 > 업계 전문용어 > SEO용 영문 > 장식용 영문(제거).

## 4. 홈 구성과 공개 범위

홈 장면 순서: **Hero → 흩어진 데이터/이해할 수 있는 정보로 → 왜 휴미즈인가 →
기업 데이터 → Arctera 솔루션 연결 → AI 서비스 → 일하는 방식 → AI 포트폴리오 →
전문성 → 자주 묻는 질문 → 인사이트 → 문의.** Header·Footer 는 별도다.

글로벌 메뉴: **사업영역(기업 데이터 · AI 서비스 · Arctera 솔루션) / AI 포트폴리오 / 인사이트 / 회사소개 / 문의**

**공개 페이지 19개.** v3.0 의 "12개" 기준은 대체됐다.

```text
/                                     홈
/about                                회사소개
/enterprise-data                      기업 데이터
/consulting/e-discovery               e-Discovery
/consulting/internal-control          내부 통제
/consulting/exchange-archive          Exchange 아카이빙
/consulting/ai-transformation         AI 서비스
/ai-services                          AI 포트폴리오 허브
/ai-services/mom-ie                   맘이음
/ai-services/anybuild                 AnyBuild
/ai-services/hairai                   HairAI
/ai-services/k-bestie                 내친구 케이
/solutions                            Arctera 솔루션 허브
/solutions/enterprise-vault           Enterprise Vault Complete
/solutions/enterprise-vault-capture   Enterprise Vault Capture (formerly Merge1)
/solutions/data-insight               Data Insight
/solutions/ediscovery-platform        eDiscovery Platform
/contact                              문의
/insights                             인사이트
```

별칭 11개(`/jtbd/*`, `/services/*`, `/consulting/ai-consulting`)는 구 사이트 URL 보존용
**정적 이동 페이지**다. 서버 리다이렉트가 없으므로 **HTTP 301 이 아니라 200** 이며
canonical·meta refresh·실제 링크로 최종 경로를 가리킨다. 사이트맵에는 넣지 않는다.

**URL 은 변경하지 않는다.** 표시 언어를 한국어로 바꿔도 영문 경로는 SEO 연속성을 위해 유지한다.

개인정보처리방침·약관·관리자 기능은 **별도 시스템 범위**이며 이번 구현에 포함하지 않았다.
회원가입·결제·채팅·AI 추론 API·신규 제품 기능은 만들지 않는다.

## 5. 기존 운영 보호

기존 홈페이지 저장소·작업 폴더·GitHub Pages·워크플로·DB·DNS 는 **READ-ONLY** 기준이다.
기존 코드를 새 저장소에 복사하거나 기존 저장소를 덮어쓰지 않는다.

참고 가능한 것은 확인된 공개 카피, URL, 회사정보, 사용권이 있는 로고·이미지, 기능 요구와 데이터 계약이다.
실행 코드·환경변수·인증 방식은 자동 재사용하지 않는다.

대표님의 명시적 승인 전에는 `www.humease.com` 연결·DNS 변경·운영 메일 발송·운영 DB 쓰기·
기존 Pages 종료를 하지 않는다. **검증 Pages 배포와 실제 회사 도메인 공개는 서로 다른 단계다.**

### 검색 색인 정책

배포 대상과 색인 승인은 별개 값이다. `basePath` 가 비었다는 이유만으로 공개되지 않는다.

| 항목 | 검증(preview) | 운영(production, 승인 후) |
|---|---|---|
| 색인 | `noindex, follow` | `index, follow` |
| canonical | 미출력 | 자기참조 운영 URL |
| sitemap | 빈 목록 | 19건 |
| JSON-LD | 미출력 | 출력 |

## 6. 문서 구성

| 순서 | 파일 | 책임 |
|---|---|---|
| 1 | [01_SCOPE_AND_BASELINE.md](docs/01_SCOPE_AND_BASELINE.md) | 기존·신규 경계, 사실 검증 |
| 2 | [02_DESIGN_SYSTEM.md](docs/02_DESIGN_SYSTEM.md) | 레이아웃, 색, 타이포, 모션, 접근성 |
| 3 | [03_PAGES_AND_COPY.md](docs/03_PAGES_AND_COPY.md) | 페이지별 최종 문구·CTA·경로 |
| 4 | [04_NEXTJS_ARCHITECTURE.md](docs/04_NEXTJS_ARCHITECTURE.md) | App Router·정적 Export·SEO·CI |
| 5 | [05_EXISTING_ASSETS.md](docs/05_EXISTING_ASSETS.md) | 기존 이미지의 연결·최적화 |
| 6 | [06_CONTACT_SECURITY_OPERATIONS.md](docs/06_CONTACT_SECURITY_OPERATIONS.md) | 문의·환경·보안 |
| 7 | [07_VERCEL_RELEASE_AND_ROLLBACK.md](docs/07_VERCEL_RELEASE_AND_ROLLBACK.md) | **이름이 Vercel 이나 내용은 폐기.** Pages 릴리스는 `docs/04` §8 |
| 8 | [08_QA_AND_HANDOFF.md](docs/08_QA_AND_HANDOFF.md) | 게이트·검수·작업자 지시 |
| 9 | [09_SOURCES_AND_CHANGELOG.md](docs/09_SOURCES_AND_CHANGELOG.md) | 출처·구버전 대체 내역 |

보조 파일 `docs/ASSET_MAP.csv` 는 이미지 ID·페이지 연결표다.
후속 요청서가 대체한 카피는 `scripts/copy-supersessions.json` 에 근거와 함께 기록한다.
보고서는 `docs/reports/` 에 있다(G0 기준선, G1·G2·G3 검수, ADR-001, 자산 인벤토리).

## 7. 구현·검수 역할과 완료 기준

**Claude Code:** 구현·테스트·검증 배포·변경 보고. **Antigravity:** 독립 READ-ONLY 검수.
**대표님:** 브랜드 공개 내용과 운영 전환·비용·권한 변경 승인.

검수 상태는 `PASS / FAIL / BLOCKED / NOT RUN` 으로 구분한다.
테스트를 수행하지 않고 PASS 라고 쓰지 않는다.
설계서 작성 완료, 구현 완료, 검증 배포, 실서비스 전환 완료를 구분한다.

CI 가 매 배포마다 도는 자동 검증(`npm run verify:*`):
라우트 · 승인 카피 · 요청서 카피 · 콘텐츠 · 별칭 · 색인 정책 · 구조화 데이터 ·
자산 · 비밀 노출 · 폰트 서브셋.

## 8. 사실·자산 공개 원칙

근거 없는 '국내 유일', '최고', 고객사 로고, 인증, 처리량, 수상, 재직·파트너 관계를 표시하지 않는다.
고객 제안 중인 프로젝트는 수행 실적으로 표시하지 않는다.

**Arctera 관계 고지**: 휴미즈는 Arctera 의 공식 파트너가 아니다.
허브와 전 제품 상세에 이 사실을 표시한다.

맘이음은 **개발 중인 프로젝트**로 표시한다. 공개 베타·상용 운영·유료 서비스·이용자 수는 표시하지 않는다.

포트폴리오의 개발 참여·운영 주체·권리 주체·공개 단계는 각각 관리한다.
홈페이지에 올라왔다는 이유로 모두 휴미즈 소유의 상용 서비스가 되지 않는다.
확인되지 않은 단계는 표시하지 않고 "확인 후 표기합니다"로 남긴다.

회사 경력과 개인 경력을 분리한다. Microsoft MVP 등 이력은 **전문가 개인 경력**으로만 표기하고
회사의 현재 소속·공식 파트너 관계로 읽히지 않게 한다.

생성 이미지는 브랜드를 설명하는 장식이다. 실제 사무실·직원·고객·제품 화면·운영 데이터의 증거로 쓰지 않는다.

## 9. v3.0 → v3.1 변경 내역

| 항목 | v3.0 | v3.1 (현행) |
|---|---|---|
| 호스팅 | Vercel 신규 프로젝트 | **GitHub Actions → GitHub Pages** |
| 빌드 | Next.js 기본(서버 포함) | **`output: 'export'` 완전 정적** |
| 문의 | 서버 Route Handler | **서버 없음. mock/disabled + 이메일 CTA** |
| 영문 메인 | `Complexity, made intelligent.` | **삭제.** 한국어 메시지가 대체 |
| 사업축 표기 | Enterprise Data / Applied AI | **기업 데이터 / AI 서비스** (제품명은 영문 유지) |
| 솔루션 영역명 | 엔터프라이즈 솔루션 | **Arctera 솔루션** |
| 포트폴리오 | 맘이음 단일 | **누적형 포트폴리오 4건** |
| 공개 페이지 | 12개 | **19개** + 별칭 11개 |
| 홈 구성 | 6개 영역 | **12개 장면** |

변경 근거는 각각 대표 지시와 요청서에 있다.
`ADR-001`(호스팅), `HUMEASE-WEB-20260906-CONTENT-01`(포트폴리오·Arctera),
`HUMEASE-SEO-AEO-GEO-20260906`(검색), `HUMEASE-KOREAN-FIRST-PREMIUM-20260906`(표시 언어).
