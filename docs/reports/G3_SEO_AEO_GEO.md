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
**Anthropic 토큰 재검증 (2026-09-06, 공식 문서 확인).**
출처: `support.claude.com/en/articles/8896518`

| 토큰 | 용도 | robots.txt 준수 | 상태 |
|---|---|---|---|
| `ClaudeBot` | 모델 학습 | 예 | **현행** |
| `Claude-User` | 사용자 요청 기반 접근 | 예 | **현행** |
| `Claude-SearchBot` | 검색 색인 | 예 | **현행** |
| `Claude-Web` · `anthropic-ai` | — | — | **공식 목록에 없음** |

`Claude-Web` 만으로 Claude 접근이 설정됐다고 판단하지 않는다. 현행 3종을 명시적으로 추가했고,
기존 허용 정책은 그대로 두었다. `Claude-Web` 은 `User-agent: *` 가 이미 허용이라
유무가 실제 접근 결과를 바꾸지 않으며, 과거 정책의 연속성 기록으로만 남겼다.
`verify-indexing-policy` 가 현행 3종의 존재와 기존 봇 정책의 차단 전환을 감지한다.

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
| Claude 현재 공식 봇 토큰 검증 | **PASS** | 2026-09-06 공식 문서 확인. §6 참조 |
| AEO 질문·답변 콘텐츠 확장 (§6) | **PASS** | §6.2~§6.6 전부 구현. 아래 §10 참조 |
| GEO 고유 정보·출처 컴포넌트 (§7.3) | **PASS** | SourceNotes 적용. 아래 §10 참조 |
| 운영 도메인 전환 | **금지** | 별도 승인 |

BLOCKED·NOT RUN 을 PASS 로 합산하지 않았다.

## 10. AEO · GEO 구현 (§6, §7)

### 컴포넌트

| 컴포넌트 | 역할 |
|---|---|
| `AnswerBlock` | Hero 뒤 첫 정보 구간의 정의. '무엇인지'를 첫 문장부터 답한다 |
| `QuestionList` | 질문·답변. 펼치기 전에도 답변이 HTML 에 존재하고 키보드로 접근 가능 |
| `SourceNotes` | 제품 정보 확인일 · 참고 자료 · 지원 범위 안내 · 관계 고지 |

### 반영 위치

| 페이지 | 정의 | 질문 |
|---|---|---|
| 홈 | — | §6.2 3종 (회사 정의 / Applied AI vs AI Portfolio / 문의 전 준비) |
| Arctera 허브 | §6.3 영역 정의 | §6.3 2종 (확인 가능한 것 / 공식 파트너 여부) |
| Enterprise Vault | §6.4 정의 | §6.6 3종 |
| Capture | §6.4 정의 | §6.5 **4종** (이름 관계 / 수집 대상 / 수집과 보존 구분 / 기존 환경 검토) |
| Data Insight | §6.4 정의 | §6.6 3종 |
| eDiscovery Platform | §6.4 정의 | §6.6 3종 |

§7.1 제품별 '휴미즈 검토 항목'을 데이터로 분리하고, **수행 실적 주장이 아니라 검토 기준**임을 화면에 명시했다.

### 편집 규칙 준수

- 상담 문구를 질문마다 반복하지 않았다.
- 제한 조건을 각주로 숨기지 않고 같은 답변에 넣었다(Capture 4번 문항의 `note`).
- `FAQPage` 스키마를 만들지 않았다. 질문·답변은 HTML 본문이다.
- 정적 HTML 에 정의·질문·출처가 존재함을 빌드 산출물에서 확인했다.

### 검증 스크립트 결함 2건 수정

- Capture FAQ 문구가 §6.5 로 바뀐 것을 반영하지 못했다.
- `verify-content` 가 `script`/`style` 내용을 제거하지 않아 Next 의 RSC 페이로드가 본문 분석에 섞였다.
  문장 단위 부정 판정이 깨져 **관계 고지를 '파트너 주장'으로 오탐**했다. 두 건 모두 고쳤다.
