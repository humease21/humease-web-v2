# SEO · AEO · GEO 구현 보고

- Request ID: `HUMEASE-SEO-AEO-GEO-20260906`
- 기준 commit `32537ea` → 결과 `499f1ea`
- 검증 주소: https://humease21.github.io/humease-web-v2/
- 운영 도메인 전환·검색 등록·IndexNow 제출은 **수행하지 않음**

## 1. G0 기준선에서 확인한 사실

| 항목 | 실측 |
|---|---|
| `humease21.github.io/robots.txt` | **404** — 호스트 루트 robots 가 없다 |
| 프로젝트 하위 `robots.txt` | 200 — 그러나 **호스트 루트 정책을 대체하지 못한다**(§10.1) |
| `www.humease.com/robots.txt` | 200 (구 운영 사이트) |

→ 검증 환경의 색인 제외는 **HTML meta noindex 로만** 관리한다. 계정 루트 저장소를 만들지 않았다.

§2 의 우선 수정 4건은 모두 문서 기재대로 존재함을 확인하고 수정했다.

## 2. 환경 계약 (§4.1)

```
NEXT_PUBLIC_SITE_DEPLOY_TARGET   preview | production
NEXT_PUBLIC_SITE_ORIGIN          산출물을 제공할 origin
NEXT_PUBLIC_BASE_PATH            /humease-web-v2 또는 빈 값
NEXT_PUBLIC_SEARCH_INDEXING_ENABLED  색인 승인
INDEXNOW_ENABLED                 기본 false
```

**`NODE_ENV`·브랜치·`basePath` 중 어느 하나로도 검색 공개를 결정하지 않는다.**
`production` 대상과 명시 승인 두 값이 모두 있어야 색인한다.
모순된 조합은 빌드를 실패시킨다 — `production` + basePath, 비운영 origin 색인 승인.

## 3. 두 배포 대상의 산출물 — 실측 대조

| 항목 | preview (배포됨) | production (dry-run) |
|---|---|---|
| robots.txt | `Allow: /` · sitemap 없음 | `Allow: /` + 봇별 규칙 + `Sitemap:` + `Host:` |
| sitemap `<loc>` | **0건** | **19건** |
| `<lastmod>` | — | 19건 (실제 확인일) |
| meta robots | `noindex, follow` | `index, follow` |
| canonical | **미출력** | 자기참조 운영 URL |
| JSON-LD | **미출력** | 11개 그래프 |
| OG url | `humease21.github.io/humease-web-v2/…` | `www.humease.com/…` |

검증본을 제외하는 이유는 대표 URL 선택이 아니라 **검증 환경을 검색에 공개하지 않기 위함**이다.
크롤링은 막지 않는다 — `Disallow` 로 막으면 크롤러가 noindex 를 읽지 못한다.

**운영 dry-run 산출물은 업로드하지 않는다.** CI 가 별도 빌드로 검사만 하고 폐기한다.
검증 Pages 에 게시하면 색인 가능한 복제본이 생기기 때문이다.

## 4. 사이트맵 (§11)

- `lastModified: new Date()` **제거**. 실제 콘텐츠 수정일이 없으면 `lastmod` 를 생략한다.
- **결정성 실측**: 같은 입력으로 2회 빌드한 사이트맵 md5 가 동일하다 (`72ded738…`).
- `priority`·`changefreq` 를 쓰지 않는다. 순위 효과를 주장하지 않는다.
- 별칭 11개·draft·외부 URL 은 포함하지 않는다.

## 5. 구조화 데이터 (§8)

| 페이지 | 노드 |
|---|---|
| 홈 | Organization · WebSite · WebPage |
| 솔루션 허브 / 포트폴리오 허브 | CollectionPage · BreadcrumbList · ItemList |
| 제품 상세 | WebPage(about→SoftwareApplication) · BreadcrumbList · SoftwareApplication |
| 프로젝트 상세 | WebPage · BreadcrumbList · CreativeWork |

- **제품의 publisher·provider 를 HUMEASE 로 쓰지 않는다.** 휴미즈는 설명 페이지의 게시자다.
- `Organization` 에 `legalName`·`address`·`telephone`·`founder`·`sameAs` 를 넣지 않았다. 확인된 공개 데이터가 없다.
- `FAQPage`·`HowTo`·`QAPage`·`Speakable`·`SearchAction` 을 생성하지 않았다.
  Google 변경 기록상 FAQ 리치 결과는 2026-05-07부터 표시되지 않으며, 질문·답변은 HTML 본문으로 구현했다.
- 개발 중 프로젝트에 `offers`·`aggregateRating`·`downloadUrl` 을 넣지 않았다.
- `</script>`·U+2028·U+2029 를 escape 하는 안전 직렬화를 사용한다.

## 6. 봇 정책 (§10.2)

검색용 봇과 학습용 봇을 분리했다. **학습 봇 정책은 기존 상태를 보존**했고 SEO 를 이유로 바꾸지 않았다.
`OAI-SearchBot`·`PerplexityBot` 을 검색용으로 명시했다.
`Claude-Web` 은 기존 항목이라 유지했고, 현재 공식 토큰(`Claude-SearchBot`·`Claude-User`) 검증은 **NOT RUN** 이다.

봇 User-Agent 로 요청을 보낸 결과를 "해당 봇이 실제 방문했다"는 증거로 쓰지 않았다.

## 7. 자동 검수

| 스크립트 | 검사 |
|---|---|
| `verify-indexing-policy` | 대상별 robots·sitemap·canonical·noindex 계약. 학습 봇 차단 변경 감지 |
| `verify-entities` | JSON-LD 금지 필드·엔터티 관계·안전 직렬화 (운영 산출물 전용) |

기존 8종과 합쳐 **검증 10종**이 CI 에서 돈다. CI 는 preview 를 배포하고 운영 dry-run 은 검사만 한다.

## 8. 메타데이터 충돌 처리

§0.2 대로 메타데이터 충돌은 이 요청서를 우선했다. `docs/03` 의 title·description 20건을
`scripts/copy-supersessions.json` 에 대체 근거와 함께 기록했다(누적 33건).
Capture title 은 콘텐츠 요청서 `| 휴미즈` 대신 SEO 요청서 `| HUMEASE` 를 따른다.

## 9. NOT RUN · BLOCKED

| 항목 | 상태 | 사유 |
|---|---|---|
| Search Console·Bing·네이버 계정 설정·소유권 | **BLOCKED** | 계정 접근 권한 없음 |
| Google 생성형 AI 설정·성과 보고서 확인 | **BLOCKED** | 동일 |
| IndexNow 제출 | **NOT RUN** | 기본 비활성. 운영 배포·승인 후 |
| 검색 등록·사이트맵 제출 | **NOT RUN** | 도메인 전환 후 권한자가 수행 |
| Claude 현재 공식 봇 토큰 검증 | **NOT RUN** | 공식 자료 재확인 필요 |
| AEO 질문·답변 콘텐츠 확장 (§6) | **부분** | 기존 FAQ·정의 유지. 신규 질문 세트는 미작성 |
| GEO 고유 정보·출처 컴포넌트 (§7.3) | **부분** | `sources.ts` 는 만들었고 화면 컴포넌트는 미적용 |
| 운영 도메인 전환 | **금지** | 별도 승인 |

BLOCKED·NOT RUN 을 PASS 로 합산하지 않았다.
