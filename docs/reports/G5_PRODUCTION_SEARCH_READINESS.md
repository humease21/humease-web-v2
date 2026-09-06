# G5 — 운영 도메인 실측 보고

- 작성: 2026-09-06 23:51 KST
- 대상: `https://www.humease.com` (운영 전환 완료 후 실측)
- 배포 커밋: `10345db1823f968b5f975b9234493072bc124e18` / Actions run `34040383646` success
- 근거 요청서: `REQUEST_HUMEASE_SEO_AEO_GEO_20260906.md` (`HUMEASE-WEB-20260906-SEARCH-02`)

> G3 는 **산출물** 기준이었다. 이 문서는 **운영 도메인 실측** 기준이다. 둘을 합산하지 않는다.
> 검색 도구가 확인해 준 범위(G6 관측)는 여전히 없다. 색인·순위·AI 인용을 보장하지 않는다.

## 1. 전환으로 해소된 최대 제약 — BOT-01

G3 시점의 실측은 이랬다.

| 항목 | G3 (프로젝트 Pages) |
|---|---|
| `humease21.github.io/robots.txt` | **404** — 호스트 루트 robots 없음 |
| 프로젝트 하위 `robots.txt` | 200 이지만 **호스트 루트 정책을 대체하지 못함**(§10.1) |

robots.txt 는 **호스트 루트에서만** 적용된다[G16][N02]. 계정 루트 저장소를 권한 없이 만들 수 없어 BOT-01 은 구조적으로 BLOCKED 였다.

운영 도메인 전환으로 `https://www.humease.com/robots.txt` 가 **호스트 루트**가 됐다. 이제 우리 정책이 실제로 적용된다.

| 항목 | 실측 (23:51 KST) |
|---|---|
| `https://www.humease.com/robots.txt` | **200** |
| `Disallow` 줄 수 | **0** — noindex 페이지를 크롤러가 읽을 수 있다(BOT-04) |
| 명시 User-Agent | `*` · `OAI-SearchBot` · `PerplexityBot` · `Claude-SearchBot` · `GPTBot` · `ChatGPT-User` · `ClaudeBot` · `Claude-User` · `Claude-Web` |
| `Host` | `www.humease.com` |
| `Sitemap` | `https://www.humease.com/sitemap.xml` |

`Claude-Web` 은 Anthropic 공식 목록에 없는 레거시 토큰이다. 이것이 있다고 Claude 접근이 설정됐다고 보지 않는다. 현행 토큰 `ClaudeBot`·`Claude-SearchBot`·`Claude-User` 가 별도로 명시돼 있다[A01].

## 2. 전환 연속성 — 구 사이트에서 잃은 것이 있는가

### 2.1 구 sitemap 9개 URL

| 구 URL | 신규 응답 | 최종 |
|---|---|---|
| `/` | 200 | `/` |
| `/about` `/solutions` `/contact` `/ai-services` | 301 | 각 `…/` |
| `/consulting/{e-discovery,internal-control,exchange-archive,ai-transformation}` | 301 | 각 `…/` |

**손실 0건.** 301 은 trailing-slash 정규화이며 최종 200 이다. 리다이렉트 루프 없음.

*(초기 판정에서 301 을 손실 8건으로 표시했다. 리다이렉트를 따라가지 않은 검사 오류였고, 추적 후 0건으로 정정했다.)*

### 2.2 소유권 인증 — SEO-09

| 수단 | 구 사이트 | 신규 운영 | 상태 |
|---|---|---|---|
| 네이버 `naver-site-verification` meta | `62dfd1cc…6e76` | **동일 값 유지** | 보존 |
| Google | DNS TXT ×2 | DNS TXT ×2 | 전환 무관 |
| Microsoft `MS=ms42929545` | DNS TXT | DNS TXT | 전환 무관 |
| Bing `BingSiteAuth.xml` | 404 (구에도 없음) | 404 | 변화 없음 |

인증값을 삭제하지 않았고 DNS TXT 도 변경하지 않았다.

### 2.3 llms.txt — 전환으로 사라졌던 파일

구 사이트는 `/llms.txt` 를 게시하고 있었고 전환 직후 **404** 가 됐다. §10.4 는 "기존 파일이 있으면 존재 자체를 이유로 삭제하지 않고 동기화만 한다"고 정한다. 이 조항 위반이므로 복구했다.

sitemap 과 **같은 단일 소스**에서 생성한다(`src/app/llms.txt/route.ts`). 손으로 쓴 목록이 없으므로 draft 유출·구 명칭 잔존이 구조적으로 불가능하다.

구 파일이 담고 있던 미승인 주장은 전부 빠졌다.

| 구 llms.txt | 처리 |
|---|---|
| "Microsoft MVP 출신 전문가" | 제거 — 대표 승인 전 항목 |
| "Symantec, Veritas 전문가 그룹" | 제거 — 파트너 오인 표현 |
| "Merge1" 단독 표기 | `Enterprise Vault Capture (formerly Merge1)` 로 통일 |
| "React, TypeScript" | 제거 — 구 스택 |
| 관계 고지 없음 | Arctera 관계 고지 + 지원 범위 고지 추가 |

라이브 실측 — `/llms.txt` 200, 52줄, `Microsoft MVP` 0건, `Symantec` 0건, `Veritas` 0건, `독점` 0건, 관계 고지 1건.

llms.txt 는 **완료 기준이 아니다.** Google 최신 가이드는 검색 노출 필수 파일로 사용하지 않는다고 설명한다[G01].

## 3. 인수 기준 — 이번 실측으로 판정이 바뀐 항목

| ID | 이전 | 현재 | 근거 |
|---|---|---|---|
| BOT-01 | **BLOCKED** (호스트 루트 robots 불가) | **PASS** | 호스트 루트 200, 우리 정책 적용 |
| BOT-02 | 산출물 기준 | **PASS** | 라이브 robots 에 검색·AI 봇 명시, Disallow 0 |
| BOT-04 | 산출물 기준 | **PASS** | Disallow 0 — noindex 와 충돌 없음, 필수 자원 미차단 |
| SEO-02 | 산출물 기준 | **PASS** | 운영 canonical 19/19 자기참조 일치 |
| SEO-04 | 산출물 기준 | **PASS** | 19개 200, 별칭 11개 200, 없는 경로 404 |
| SEO-06 | 산출물 기준 | **PASS** | sitemap 19 = 색인 대상, 별칭·중복 없음 |
| SEO-09 | 산출물 기준 | **PASS** | 인증값 보존 확인 |
| SEO-10 | preview basePath 기준 | **PASS** | 라이브 자산 22종 200, basePath 잔재 0 |
| CAP-02 | 산출물 기준 | **PASS** | `#ev` `#merge1` `#datainsight` 라이브 유효 |
| CAP-03 | 산출물 기준 | **PASS** | 가짜 서버 301 없음, 중복 제품 페이지 없음 |
| IDX-01 | **NOT RUN** | **PASS** | dry-run 구현·CI 배선·키 파일 200·host 제한 검증 |
| IDX-02 | **NOT RUN** | **PASS** | 승인 없이 외부 전송 0건 (CI 로그) |

## 4. IndexNow — IDX-01 / IDX-02

`scripts/indexnow.mjs`. **기본 dry-run 이며 외부 전송을 하지 않는다.**

| 계약 (§13) | 구현 |
|---|---|
| `INDEXNOW_ENABLED=false` → 후보만 출력 | 미설정이면 후보 출력 후 종료. CI 로그로 전송 0건 확인 |
| 공개 검증용 키, PAT 금지 | `gh[ps]_`·`github_pat_` 패턴이면 즉시 실패 |
| 키 파일 UTF-8 본문·배포 URL 검증 | 산출물 존재·본문 일치·UTF-8 검사. 라이브 200 확인 |
| `keyLocation` 명시 | `https://www.humease.com/490d0de5…f842.txt` |
| host 를 운영 하나로 제한 | `www.humease.com` 외 URL 이 섞이면 실패. 검증 github.io 제출 불가 |
| 무변경 전체 재전송 금지 | 페이지 HTML SHA-256 해시로 신규·변경·삭제만 선별 |
| 브라우저 실행·공개 API 금지 | Node 스크립트 전용. `/api/indexnow` 없음 |
| 4xx 무한 재시도 금지 | 4xx 는 설정 오류로 즉시 실패 처리 |
| 202 를 색인으로 보지 않음 | 성공 메시지에 명시 |

현재 후보 19건(전부 신규 — 최초 실행). **전송하지 않았다.** 실전송은 대표님 승인 후 `INDEXNOW_ENABLED=true` 수동 실행이다.

## 5. 라이브 스모크 (23:38–23:51 KST)

| 검사 | 결과 |
|---|---|
| sitemap 19개 URL | 200 · canonical 자기참조 일치 · `index, follow` · basePath 잔재 0 — **실패 0** |
| 별칭 11개 | 200 — **실패 0** |
| 자산 22종 (JS·CSS·woff2 2·webp 8·로고·아이콘) | 200 — **실패 0** |
| `humease.com` → `www` | 301 → 200, 루프 없음 |
| `http://` www·apex | 301 → https |
| 없는 경로 | 404 |
| TLS | `CN=www.humease.com`, Let's Encrypt, ~2026-10-23, SAN 양쪽 |
| HSTS | `max-age=31556952` |
| GitHub DNS check | www `is_valid: true` / apex `is_valid: true` |

## 6. 여전히 BLOCKED · NOT RUN — PASS 로 합산하지 않는다

| ID | 항목 | 상태 | 사유 |
|---|---|---|---|
| OBS-01 | Google 생성형 AI 포함 설정·상속 확인 | **BLOCKED** | Search Console 계정 접근 권한 없음 |
| OBS-02 | Google AI 보고서와 일반 Performance 구분 | **BLOCKED** | 동일 |
| OBS-03 | Bing AI 지표·제공 상태 | **BLOCKED** | Bing Webmaster Tools 접근 권한 없음 |
| OBS-04 | 네이버 수집·색인과 AI 인용 구분 | **BLOCKED** | 서치어드바이저 접근 권한 없음 |
| — | Search Console·Bing·네이버 소유권 현황 읽기 | **BLOCKED** | 계정 접근 권한 없음 |
| — | 사이트맵 제출 | **NOT RUN** | 권한자 작업 |
| — | IndexNow 실전송 | **NOT RUN** | 대표님 승인 대기 (구현은 완료) |
| — | 실제 색인·AI 인용 확인 | **NOT RUN** | G6 관측 단계 |
| UX-01 / UX-02 / PERF-01 | 실기기 QA·성능 회귀 | **NOT RUN** | 사람 확인 필요 |

`GitHub Actions 성공만으로 운영 색인 가능 상태를 확정하지 않는다`(§17 G5). 위 항목은 대표님 또는 권한자만 수행할 수 있다.

## 7. 이번 단계에서 하지 않은 것 — SAFE-01 / SAFE-02

이미지 생성·재생성 없음. Vercel·서버 API·유료 SDK 추가 없음. 신규 의존성 0.
운영 DNS 수정 없음(조회만). DB/RLS·메일·문의 실전송 없음. 구 저장소 수정·삭제·archive 없음.
외부 검색 서비스로의 전송 0건.

## 8. 대표님 확인 요청

1. **검색 도구 계정** — Search Console / Bing / 네이버 접근 권한. 소유권 현황을 읽어야 OBS-01~04 를 진행할 수 있다. 기존 속성·인증 태그는 삭제하지 않는다(§12.1).
2. **IndexNow 실전송 승인** — 구현·dry-run 은 끝났다. 승인 시 `INDEXNOW_ENABLED=true` 로 19건을 1회 전송한다.
3. **실기기 QA** — 1440·390·320px 육안 확인(UX-01), 키보드·JS off·reduced-motion(UX-02).
4. **미결 콘텐츠 판단** — Microsoft MVP 표현 승인 여부, 회사 정보(대표자·사업자번호·주소), A02–A07 이미지 선택.
