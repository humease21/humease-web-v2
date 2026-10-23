# DESIGN.md — 휴미즈 공개 사이트 디자인 시스템 v2

- 작성 2026-10-23 · 브랜치 `redesign/b2b-uiux-2026-10`
- 적용 범위: 공개 사이트 `(site)` 와 404. **관리자 콘솔(/admin)은 범위 밖**이며 기존 다크 토큰을 그대로 쓴다.
- 대체 관계: `docs/02_DESIGN_SYSTEM.md` 의 시네마틱 다크 레이어(풀블리드 이미지·대형 서체 장면·스크롤 전환)를 이 문서가 대체한다.
  브랜드 메시지·카피·사실 공개 원칙(SPEC §3·§8, docs/03)은 바뀌지 않았다.

## 1. 방향 — Quiet Intelligence, 라이트 퍼스트 B2B

방문한 기업 담당자가 **무슨 회사인지 → 무엇을 하는지 → 왜 휴미즈인지 → 어떻게 문의하는지**를
스크롤 몇 번 안에 파악하게 한다. 분위기보다 정보 전달력과 신뢰감이 우선이다.

| 원칙 | 적용 |
|---|---|
| 읽히는 화면 | 오프화이트 바탕 + 잉크 텍스트, 본문 16–19px, 최소 13px |
| 절제 | 그라데이션 장식·광원 효과·스크롤 연출 없음. 등장 모션은 520ms 페이드 1회 |
| 브랜드 연속성 | 기존 로고 형태 유지, 샴페인(#C7B99D)·다크(#0B0E12)는 포인트와 다크 밴드로 계승 |
| 이미지 | 기존 승인 자산(A01–A13)만 사용. 둥근 미디어 패널에 담고 피사체 쪽(오른쪽)으로 크롭 |
| 사실 | 고객사 로고·수치·인증·수상 없음. 개인 경력은 "전문가 개인 경력" 아래에만 |

## 2. 색 토큰

`.theme-site`(공개 사이트 루트)와 `.on-dark`(다크 밴드)가 같은 이름의 CSS 변수를 재정의한다.
컴포넌트는 항상 `var(--color-*)` 만 쓴다 — 밝은 구간과 어두운 구간에서 같은 컴포넌트가 그대로 동작한다.

| 토큰 | 라이트(.theme-site) | 다크(.on-dark) | 용도 |
|---|---|---|---|
| `--color-bg` | #FAFAF8 | #0B0E12 | 페이지 바탕 |
| `--color-surface` | #FFFFFF | #141922 | 카드·폼 |
| `--color-subtle` | #F1F0EB | #141922 | 보조 구간(alt) 바탕, 아이콘 타일 |
| `--color-text` | #0E1217 | #F2EFE8 | 제목·강조 |
| `--color-body` | #3D4552 | #D5D9DF | 본문 |
| `--color-muted` | #5A6371 | #A9B1BC | 보조 설명·캡션 |
| `--color-line` / `-strong` | #E2E0D9 / #C9C6BC | #2A313B / #3E4652 | 구분선·테두리 |
| `--color-brand` | #C7B99D | #C7B99D | 다크 위 주 버튼, 선택 영역 |
| `--color-brand-ink` | #80694A | #C7B99D | eyebrow·번호·포커스 링(텍스트용 브랜드색) |
| `--color-navy` | #1F3A5F | #9DB3CE | 아이콘·체크·폼 포커스 |

명암 대비(WCAG 2.x, 실측 계산): text/bg 17.98 · body/bg 9.25 · muted/bg 5.81 · muted/subtle 5.32 ·
brand-ink/bg 4.98 · 다크 muted 7.6 이상 · 샴페인 버튼 위 잉크 9.71. 본문 계열은 모두 AA(4.5) 이상.

## 3. 타이포그래피

- 서체: Noto Sans KR 가변 서브셋 1개(wght **400–700**). 사용 글자만 담는다 — 카피를 바꾸면 `npm run subset:font`.
- Source Serif(영문 디스플레이)는 제거했다. 한·영 혼용 제목에서 서체가 갈리는 문제를 없앤다.
- 줄바꿈: `word-break: keep-all`. 데스크톱 전용 줄바꿈은 `<br className="hidden sm:inline" />`.

| 클래스 | 크기 | 무게 | 용도 |
|---|---|---|---|
| `.display-hero` | clamp(34–60px) | 700 | 홈 H1 |
| `.display-page` | clamp(30–50px) | 700 | 서브페이지 H1 |
| `.heading-xl` | clamp(26–40px) | 700 | 구간 제목 H2 |
| `.heading-lg` | clamp(22–28px) | 700 | 카드 제목·소제목 |
| `.heading-md` | 19–20px | 600 | 항목 제목 |
| `.lead` | 17 → 19px | 400 | 리드 문단 |
| `.body` / `.body-sm` / `.caption` | 16 / 15 / 14px | 400 | 본문·보조·캡션 |
| `.eyebrow` | 13 → 14px | 600 | 구간 라벨(앞에 20px 선) |

## 4. 레이아웃·간격

- 컨테이너 `.shell`: 최대 1280px, 좌우 20 / 40 / 48px(모바일 / 태블릿 / 데스크톱).
- 구간 `.section`: 상하 72 / 96 / 112px. `.section-tight`: 56 / 72px.
- 구간 톤은 셋뿐 — 기본(오프화이트) · `alt`(#F1F0EB) · `dark`(다크 밴드). 같은 톤이 연속되면 1px 구분선.
- 브레이크포인트: sm 640 · md 768 · **lg 1024(데스크톱 내비 전환)** · xl 1280.

## 5. 컴포넌트

| 컴포넌트 | 파일 | 규칙 |
|---|---|---|
| 헤더 | `layout/SiteHeader` | sticky 72px, 로고(잉크 버전) · 5개 메뉴 · 우측 "프로젝트 문의" 버튼. lg 미만은 전체 메뉴 패널 |
| 서브메뉴 | `interactive/NavDropdown` | 클릭·키보드 전용(hover 없음), Esc·바깥 클릭·경로 변경 시 닫힘, 항목에 한 줄 설명 |
| 모바일 메뉴 | `interactive/MobileNav` | 전체 화면 dialog, 그룹 라벨 + 48px 행, 하단 고정 CTA, 열리면 닫기 버튼에 포커스 |
| 푸터 | `layout/SiteFooter` | 다크, 회사 정보(승인값만) · 3개 링크 그룹 · 법률 링크 |
| 히어로 | `sections/PageHero` | 좌 메시지 / 우 미디어 패널. 브레드크럼(분류명은 링크 없음), CTA 최대 2개(주·보조) |
| 구간 | `sections/Section` | `Section`·`SectionHeader`(left·center·split)·`Statement`(제목 | 본문 2열) |
| 사업 소개 | `sections/FeatureSplit` | 메시지 + 패널, 아래 아이콘 역량 그리드(카드 아님) |
| 단계 | `sections/ProcessSteps` | 번호 카드 `<ol>`. 4단계는 모바일 2열 |
| 포트폴리오 | `sections/PortfolioList` | 카드 전체 링크(stretched), 외부 링크는 별도. 이미지 없으면 이름만 담은 중립 패널 |
| FAQ | `content/QuestionList` | `details/summary` — 답변은 항상 HTML 에 존재, 좌 제목 / 우 목록 |
| 고지 | `content/NoticeBar`, `SourceNotes` | Arctera 관계 고지는 히어로 바로 아래 + 하단 자료 안내 |
| 연관 이동 | `sections/RelatedLinks` | 페이지 하단 다음 탐색 4개 |
| 마무리 CTA | `sections/ClosingContact` | 다크 밴드, 주 버튼 + 이메일 버튼 |
| 상담 페이지 | `templates/ConsultingPage` | e-Discovery·내부 통제·Exchange 아카이빙 공통 골격 |

버튼: `.btn` + `.btn-primary`(라이트: 잉크 / 다크: 샴페인) · `.btn-secondary`(테두리). 높이 52px(헤더 44px), 반경 8px.
텍스트 링크: `.link-arrow`(밑줄 + 화살표, 44px 터치 높이). 카드: `.card`(반경 14px, 1px 테두리, hover 시 그림자),
`.card-link .stretched` 로 카드 전체를 하나의 링크로.

아이콘: `ui/Icon` — 직접 그린 24px 라인 아이콘 20종(외부 패키지·저작권 자산 없음). 장식은 `aria-hidden`.

## 6. 인터랙션·접근성

- 모션: `Reveal` 페이드+12px 1회, 520ms. `prefers-reduced-motion` 에서 즉시 표시. 스크롤 하이재킹·패럴랙스 없음.
- 포커스: 모든 대화형 요소 `:focus-visible` 2px 링(`--color-brand-ink`). 건너뛰기 링크 유지.
- 터치 대상 44px 이상(헤더·메뉴·링크·체크박스·모달 닫기).
- 현재 위치: 헤더·모바일 메뉴 `aria-current="page"`, 브레드크럼.
- 외부 링크: 새 탭 + `(새 탭에서 열림)` 스크린리더 문구 + ↗ 아이콘.
- 페이지마다 H1 1개, 구간마다 H2.

## 7. 보존한 계약 (변경 금지)

URL·별칭·sitemap·robots·canonical·noindex 정책, JSON-LD, 메타 제목/설명, docs/03·요청서 승인 카피(검증 스크립트 10종),
문의 폼 제출 로직(Supabase Edge Function·honeypot·동의 모달 문구), 관리자 콘솔, 자산 파일.
