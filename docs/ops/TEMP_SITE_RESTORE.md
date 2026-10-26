# 임시 축소 운영 기록과 전체 홈페이지 원복 절차

> 대표가 **"휴미즈 홈페이지 원복"** 을 요청하면 이 문서대로 진행한다.
> 기준 원본은 태그 `humease-fullsite-2026-10-26` 이다. 이 태그와 브랜치 `archive/humease-fullsite-2026-10-26` 은
> 원복 완료 전까지 **삭제·수정·force push 하지 않는다.**

## 1. 보관 정보 (2026-10-26)

| 항목 | 값 |
|---|---|
| 원본 Production commit | `4f69fefaf6b5a7ada116b24345075635f3be1157` (`chore: 자산 인벤토리 생성일 갱신, 후속 배포·종료 기록`) |
| 원본 배포 Actions | run `40105477519` — Build and deploy to GitHub Pages, success, github-pages deployment 2026-10-24T15:07:42Z |
| 보관 태그 | `humease-fullsite-2026-10-26` (annotated, 태그 객체 `cb9458ca31c8d07e4e25a251d71a88d0bc532612` → `4f69fef`) |
| 보관 브랜치 | `archive/humease-fullsite-2026-10-26` → `4f69fef` |
| 원격 확인 | `git ls-remote origin` 으로 두 ref 모두 `4f69fef` 확인 |
| 독립 빌드 검증 | 태그를 새 디렉터리에 clone → `npm ci` → tsc · eslint · production build · verify 11종 전부 PASS (2026-10-26) |
| 원복 절차 리허설 | 임시 운영 main(`9be48d7`)의 clone 에 3절 절차를 그대로 적용 → 태그 대비 소스 diff 0, `npm ci`·tsc·eslint·production build·verify 11종 전부 PASS(공개 라우트 13 · 별칭 11 · 사이트맵 21 · JSON-LD 11) (2026-10-26) |
| 임시 홈페이지 commit | 이 문서 하단 "배포 기록" 참조 |

### 태그에 포함된 것 (Git 추적 대상 전체)
공개 페이지 전체(홈·회사소개·사업영역·Arctera·AI 포트폴리오·인사이트·별칭 11개), `/admin/**`, 문의 폼, Supabase 클라이언트·Edge Function 소스,
Discord 연동 코드, SEO/AEO/GEO(메타·JSON-LD·sitemap·robots·llms.txt·IndexNow), 이미지·로고·폰트·CSS·컴포넌트, `.github/workflows/deploy.yml`, 검증 스크립트.

### 태그에 포함되지 않는 것 — 별도로 유지되는 운영 자산
Git 에 저장되지 않으며 임시 운영 중에도 **변경하지 않았다.** 원복 시 현재 상태를 재확인만 한다.
- GitHub 저장소 설정: Actions Variables(`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`), Pages 커스텀 도메인 `www.humease.com`, github-pages environment
- Supabase 프로젝트 `cgydvjqhsllpeuxbephb`: Auth(Google OAuth·Redirect URL), `humease_admin_users`, `humease_inquiries`, `humease_page_views`, Edge Functions·Secrets(Discord Webhook 포함), RLS, pg_cron, 데이터
- DNS·도메인 설정

## 2. 임시 축소 운영 구조 (main)
- 스위치: `src/content/site-mode.ts` 의 `TEMP_SITE = true`, 공개 경로 `TEMP_PUBLIC_PATHS = / · /contact · /privacy · /terms`
- 홈: 회사소개 5개 섹션(`src/app/(site)/page.tsx`). 헤더 로고만, 푸터 로고 + 개인정보처리방침
- 닫힌 페이지 소스: `src/app/_fullsite/` (private folder — 라우팅·빌드 제외, 내용은 원본 그대로 이동만 함)
- 닫힌 URL: 산출물에 파일이 없어 GitHub Pages 가 **404** 를 반환한다. 301·meta refresh 없음 → 원복 시 같은 URL 이 그대로 되살아난다
- 검증: `scripts/verify-temp-site.mjs` 가 공개 범위를 검사, 전체 사이트 카피 검증 4종(copy·request-copy·content·aliases)은 `TEMP_SITE` 에서 SKIP

## 3. 원복 절차

전제: 작업 트리가 깨끗한 main. 원복도 Production 배포이므로 대표 승인 후 진행한다.

```bash
cd /mnt/e/VibeCoding/humease-web-v2
git fetch origin --tags
git switch main && git pull --ff-only
git switch -c restore/fullsite

# 1) 사이트 소스·설정을 태그 상태로 되돌린다(문서·로그는 main 의 기록을 유지)
PATHS="src scripts public .github package.json package-lock.json next.config.ts tsconfig.json eslint.config.mjs .nvmrc"
git rm -r -q --cached $PATHS            # 임시 운영 중 추가된 파일(_fullsite, site-mode.ts, verify-temp-site.mjs 등)까지 정리
rm -rf src scripts public .github
git checkout humease-fullsite-2026-10-26 -- $PATHS
git diff --stat humease-fullsite-2026-10-26 -- $PATHS   # 출력이 비어 있어야 한다(소스가 태그와 완전히 동일)

# 2) 로컬 검증 — CI 와 같은 순서
npm ci
npx tsc --noEmit && npx eslint .
NEXT_PUBLIC_SITE_DEPLOY_TARGET=production NEXT_PUBLIC_SITE_ORIGIN=https://www.humease.com \
NEXT_PUBLIC_BASE_PATH= NEXT_PUBLIC_SEARCH_INDEXING_ENABLED=true npm run build
for s in routes indexing-policy copy request-copy content aliases assets client-exposure font-subset entities llms; do
  NEXT_PUBLIC_SITE_DEPLOY_TARGET=production NEXT_PUBLIC_SEARCH_INDEXING_ENABLED=true node scripts/verify-$s.mjs || break
done

# 3) 커밋 → main 반영 → push (push 가 곧 운영 배포)
git add -A && git commit -m "restore: 전체 홈페이지 원복 (humease-fullsite-2026-10-26)"
git switch main && git merge --ff-only restore/fullsite && git push origin main
```

임시 운영 이후 main 에서 사이트 소스를 별도로 고친 내용이 있다면 1)에서 덮어써진다. 그런 변경이 있었는지
`git log humease-fullsite-2026-10-26..main -- src` 로 먼저 확인하고, 필요한 변경은 원복 후 다시 적용한다.

## 4. 원복 후 확인
1. GitHub Actions 실행 성공, github-pages deployment 의 sha 가 원복 commit 인지
2. `https://www.humease.com/` 이 기존 홈(사업영역·포트폴리오·Arctera·인사이트 메뉴)으로 표시
3. 기존 URL 21개 + 별칭 11개 200, sitemap 21건, robots·canonical·JSON-LD 정상
4. 문의 접수 1건(회사명 `[테스트]`) → 200 · 관리자 문의 목록 표시 · Discord 알림 수신 → 테스트 건 삭제
5. 관리자 Google 로그인 → Dashboard·Analytics·문의 목록/상세/상태/메모
6. 검색 재노출: Google Search Console·네이버 서치어드바이저에 sitemap 재제출, 필요 시 IndexNow(대표 승인 후 `INDEXNOW_ENABLED=true`)

### 원복 시 재검증할 외부 설정 호환성
- Supabase Auth Redirect URL 에 `https://www.humease.com/admin/...` 가 그대로 있는지
- Actions Variables 값이 바뀌지 않았는지(anon key 교체 시 문의·관리자 동작 확인)
- Edge Function `submit-inquiry`·`log-page-view` 배포 상태와 Discord Webhook Secret
- DB 는 원복 대상이 아니다 — 임시 운영 중 접수된 문의·페이지뷰는 그대로 남는다(삭제·초기화 금지)

## 5. 배포 기록
(아래에 임시 홈페이지 배포 결과를 기록한다)
