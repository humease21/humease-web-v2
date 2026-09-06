# 07. 배포·운영 전환·롤백

- 최초 작성 2026-09-06 / **전면 재작성 2026-09-06 (v2)**
- 재작성 사유: v1 은 Vercel 프로젝트 배포를 전제로 작성됐다. 대표 지시로 호스팅이
  **GitHub Pages** 로 확정되면서(`docs/reports/ADR-001`) Vercel 설정 계약·도메인 절차·
  Deployment Protection·Hobby 플랜 관련 내용이 전부 무효가 됐다. 파일명도 함께 바꿨다.
- 이 문서는 **실제 구성**만 담는다. 미실행은 `NOT RUN`, 승인 대기는 `BLOCKED` 로 표시한다.

## 1. 시스템과 저장소

| 구분 | 값 |
|---|---|
| 신규 저장소 | `humease21/humease-web-v2` (public) |
| 기본 브랜치 | `main` |
| 배포 | GitHub Actions → GitHub Pages |
| 검증 주소 | `https://humease21.github.io/humease-web-v2/` |
| 운영 주소(전환 후) | `https://www.humease.com` |
| 구 운영 저장소 | `Humease/Homepage` — **READ-ONLY** |

⚠ **`main` push 는 즉시 검증 배포를 실행한다.** 승인 없이 push 하지 않는다.

⚠ 두 로그인 계정(`humease21`, `markanitp-maker`) 모두 구 저장소 `Humease/Homepage` 에
**`pull` 권한만** 있다. 도메인 전환에는 `Humease` 계정 권한이 필요하다.

## 2. 빌드 계약

정적 Export 다. 서버가 없다. 상세는 `docs/04`.

```
NEXT_PUBLIC_SITE_DEPLOY_TARGET   preview | production
NEXT_PUBLIC_SITE_ORIGIN          산출물을 제공할 origin
NEXT_PUBLIC_BASE_PATH            /humease-web-v2 또는 빈 값
NEXT_PUBLIC_SEARCH_INDEXING_ENABLED  색인 승인
INDEXNOW_ENABLED                 기본 false
```

`NODE_ENV`·브랜치·`basePath` 중 어느 하나로도 검색 공개를 결정하지 않는다.
`production` 대상과 명시 승인 두 값이 모두 있어야 색인한다.
모순된 조합은 빌드를 실패시킨다.

### CI 파이프라인 (`.github/workflows/deploy.yml`)

```
checkout → setup-node(.nvmrc) → npm ci → tsc --noEmit → eslint
→ next build (preview: basePath=/humease-web-v2)
→ verify: routes · copy · request-copy · content · aliases · indexing-policy
          · assets · client-exposure · font-subset
→ 운영 dry-run 빌드 → verify: indexing-policy · entities → 산출물 폐기
→ touch out/.nojekyll → upload-pages-artifact → deploy-pages
```

**운영 dry-run 산출물은 업로드하지 않는다.** 검증 Pages 에 게시하면 색인 가능한 복제본이 생긴다.

## 3. 단계별 절차

| 게이트 | 내용 | 현재 |
|---|---|---|
| G0 | 구·신 저장소 경계, 배포 커밋, DNS·Pages 현황 확인 | **완료** — `docs/reports/G0_BASELINE.md` |
| G1 | Next.js 기반 구축, 정적 Export (당시 공개 12개 → 현재 19개) | **완료** — `G1_QA_RESULTS.md` |
| G2 | 시각 레이어 재설계, 콘텐츠·포트폴리오·Arctera 확장 | **완료** — `G2_REDESIGN_QA.md` |
| G3 | 검색·색인 정책, 구조화 데이터, 표시 언어 정리 | **완료** — `G3_SEO_AEO_GEO.md` |
| G4 | 독립 점검(Antigravity), 대표님 검토 | **NOT RUN** |
| G5 | 운영 도메인 전환 | **BLOCKED** — 승인·계정 권한 필요 |
| G6 | 운영 확인·검색 등록·측정 | **BLOCKED** — 전환 후 권한자 작업 |

## 4. 도메인·검색 노출

| 항목 | 검증(preview) | 운영(production, 승인 후) |
|---|---|---|
| origin | `humease21.github.io` | `www.humease.com` |
| basePath | `/humease-web-v2` | 빈 값 |
| meta robots | `noindex, follow` | `index, follow` |
| canonical | 미출력 | 자기참조 운영 URL |
| sitemap | 빈 목록 | 19건 |
| JSON-LD | 미출력 | 출력 |
| robots.txt | `Allow: /`, sitemap 없음 | 봇별 규칙 + `Sitemap:` + `Host:` |

⚠ **호스트 루트 robots 제약.** `https://humease21.github.io/robots.txt` 는 404 이고,
프로젝트 하위 `robots.txt` 는 호스트 루트 정책을 대체하지 못한다(실측).
검증 환경의 색인 제외는 **HTML meta noindex 로만** 관리한다.
크롤링을 `Disallow` 로 막으면 크롤러가 noindex 를 읽지 못하므로 막지 않는다.

## 5. 운영 전환 절차 — 미실행

아래는 **승인 후** 절차다. 이번 범위에서 실행하지 않았다.

1. `Humease` 계정 권한 확보. 현재 두 로그인 계정 모두 `pull` 뿐이다.
2. 신규 저장소를 운영 소유 계정으로 옮길지, 도메인을 신규 저장소로 붙일지 결정.
   커스텀 도메인은 한 시점에 한 저장소에만 붙는다. 계정 간 이동은 소유자 조작이 필요하다.
3. `NEXT_PUBLIC_BASE_PATH` 를 비우고 `SITE_DEPLOY_TARGET=production`,
   `SEARCH_INDEXING_ENABLED=true` 로 **재빌드**한다. 배포 파일의 문자열 치환으로 처리하지 않는다.
4. 별칭 11개(`/jtbd/*`, `/services/*`, `/consulting/ai-consulting`)가 새 도메인에서 동작하는지 확인한다.
5. 구 Pages 를 종료하기 전에 새 사이트의 전 경로를 실측한다.
6. 검색 등록·사이트맵 제출은 전환 확인 후 권한자가 수행한다.

### DNS 현황 — 변경하지 않았다

| 이름 | 타입 | 값 |
|---|---|---|
| `humease.com` | A | `185.199.108–111.153` (GitHub Pages) |
| `www.humease.com` | CNAME→ | `humease.github.io` |

HTTPS 인증서: `humease.com` + `www.humease.com`, **만료 2026-10-23**.

⚠ **CNAME 불일치.** 구 저장소의 `public/CNAME` 은 `humease.com`(apex) 인데
Pages API 는 `cname: www.humease.com` 을 보고한다. 전환 전에 대표 주소를 확정해야 한다.

보호 대상: `blog.humease.com`, `build.humease.com`, 맘이음 앱, `app.k-bestie.com`,
메일 관련 DNS 레코드. 이번 작업에서 건드리지 않는다.

## 6. 롤백

정적 사이트라 롤백이 단순하다.

| 상황 | 조치 |
|---|---|
| 배포 내용 문제 | `git revert <sha>` 후 push. Actions 가 이전 상태를 재배포 |
| 특정 시점 복구 | `git reset --hard <sha>` 후 강제 push. 단독 저장소이므로 영향 범위가 제한적 |
| 도메인 전환 실패 | 커스텀 도메인을 구 저장소로 되돌린다. 구 Pages 를 종료하지 않았다면 즉시 복구된다 |

**구 사이트를 종료하지 않는 한 언제든 되돌릴 수 있다.** 전환 후에도 일정 기간 유지한다.

주요 복구 지점:

| 커밋 | 내용 |
|---|---|
| `82986d5` | 리디자인 완료 시점 |
| `46362f6` | 콘텐츠·포트폴리오·Arctera 병합 |
| `435dc82` | SEO·AEO·GEO 적용 |
| `3953a0b` | Korean-first 전환 |

## 7. 하지 않은 것

Vercel 프로젝트 생성·설정, 유료 플랜 가입, DNS·CNAME 변경, 구 저장소 수정,
구 Pages 종료, 운영 DB·메일 설정 변경, 검색 등록, IndexNow 제출.
전부 별도 승인 대상이다.
