# E2E 테스트 보고서: redesign-b2b-uiux

- **작업명**: redesign-b2b-uiux
- **실행 명령**: `npx playwright test -c tests/e2e/playwright.config.ts`
- **실행 시각**: 2026-10-23T12:30:12+09:00
- **테스트 환경**: http://localhost:4310 (정적 배포 서버)
- **Supabase 호스트 격리**: `https://e2e-dummy.supabase.co` 외 외부 실제 호스트 요청 차단 확인 완료

---

## 1. 프로젝트별 실행 요약

| 프로젝트 | 뷰포트 / 디바이스 사양 | 실행 결과 | 통과 | 실패 | 건너뜀 (Skip) | 소요 시간 |
|---|---|---|---|---|---|---|
| **pc** | 1440 × 900 (Desktop Chromium) | **PASS** | 10 | 0 | 1 (S4 모바일 전용) | 약 27s |
| **tablet** | 834 × 1112 (Chromium) | **PASS** | 10 | 0 | 1 (S3 데스크톱 전용) | 약 27s |
| **mobile** | 390 × 844 (Chromium, Touch/Mobile) | **PASS** | 10 | 0 | 1 (S3 데스크톱 전용) | 약 27s |
| **전체 합계** | 3개 프로젝트 (4 workers) | **PASS** | **30** | **0** | **3** | **27.4s** |

---

## 2. 시나리오별 검증 결과

| 시나리오 | 검증 내용 | pc (1440) | tablet (834) | mobile (390) | 최종 판정 |
|---|---|---|---|---|---|
| **S1** | **전체 21개 라우트 기본 검증**<br>HTTP 200, h1 정확히 1개, 콘솔 error 0, pageerror 0, localhost 4xx/5xx 0, 깨진 이미지 0, 가로 스크롤 없음, header·main·footer 존재 | pass | pass | pass | **pass** |
| **S2** | **내부 링크 & 외부 링크 속성 검증**<br>21개 라우트의 내부 링크 수집 및 GET 200 검증, `#id` 해시 대상 요소 존재 확인, 외부 링크 target="_blank" 및 rel="noopener" 검증 | pass | pass | pass | **pass** |
| **S3** | **데스크톱(≥1024) 내비게이션**<br>'사업영역' 드롭다운 open/close, aria-expanded, 서브메뉴 5개 노출, Escape 닫힘 및 포커스 복귀, 'Data Insight' 이동 후 메뉴 닫힘, aria-current="page" | pass | skip | skip | **pass** |
| **S4** | **모바일·태블릿(<1024) 내비게이션**<br>'메뉴 열기' 클릭 시 role=dialog 노출, '메뉴 닫기' 포커스, body overflow=hidden, 링크 이동 시 dialog 닫힘, Escape 닫힘 및 버튼 포커스 복귀, 메뉴 링크 높이 ≥ 44px | skip | pass | pass | **pass** |
| **S5** | **문의(/contact/) 폼 제출 및 피드백 검증**<br>동의 전 제출 버튼 disabled, '내용 보기' 모달 open/close, 필수값 입력 + 동의 후 제출 시 (a) 200 응답 성공 메시지 표시, (b) 500 응답 실패 alert 표시, Supabase 외부 통신 차단 확인 | pass | pass | pass | **pass** |
| **S6** | **FAQ 키보드 접근성**<br>홈 첫 번째 summary 키보드 포커스 후 Enter 시 details open 및 답변 본문 노출 | pass | pass | pass | **pass** |
| **S7** | **접근성 키보드 이동**<br>홈 첫 Tab 입력 시 '본문으로 건너뛰기' 링크 노출 및 포커스, Enter 시 `#main` 이동 | pass | pass | pass | **pass** |
| **S8** | **별칭(alias) 라우트 검증**<br>aliases.ts 11개 별칭 경로 HTML 에 meta refresh 및 대상 경로 링크 존재 확인 | pass | pass | pass | **pass** |
| **S9** | **앵커(Anchor) 보존 검증**<br>/solutions/ 내 ev, merge1, datainsight, ediscovery, products id 요소 존재, 홈 내 #business 요소 존재 확인 | pass | pass | pass | **pass** |
| **S10** | **JS 비활성 환경 검증**<br>javaScriptEnabled=false 환경에서 홈 및 /solutions/ 의 모든 `[data-reveal]` 요소 opacity=1 확인 | pass | pass | pass | **pass** |
| **S11** | **CTA 링크 동작**<br>홈 히어로의 '프로젝트 문의' 클릭 시 /contact/ 이동, 헤더 우측 '프로젝트 문의'(데스크톱) 클릭 시 /contact/ 이동 | pass | pass | pass | **pass** |

---

## 3. 테스트 코드 결함 수정 내역

1차 실행 시 발생한 테스트 코드 자체의 결함 2건을 수정하였습니다 (제품 코드는 수정하지 않았으며, 기대값을 변조하지 않고 셀렉터 및 설정만 보정함).

### 1) `tests/e2e/playwright.config.ts` 모듈 형식 오류
- **현상**: CommonJS 변환 환경에서 `import.meta.url` 사용으로 인한 `SyntaxError: Cannot use 'import.meta' outside a module` 발생
- **수정**: `import.meta.url` 대신 `process.cwd()` 기반 절대 경로로 변경하여 모듈 환경 호환성 확보

### 2) `tests/e2e/redesign.spec.ts` S5의 Next.js 기본 `role="alert"` 충돌
- **현상**: Next.js App Router가 라우팅 안내용으로 DOM에 기본 주입하는 `<div role="alert" id="__next-route-announcer__">` 때문에, `page.getByRole('alert')` 호출 시 Playwright strict mode violation 발생 (2개 요소 탐색됨)
- **오류 원문**:
```text
Error: expect(locator).toBeVisible() failed

Locator: getByRole('alert')
Expected: visible
Error: strict mode violation: getByRole('alert') resolved to 2 elements:
    1) <p role="alert" class="rounded-lg border border-[#E7B4AE] bg-[#FDF3F2] px-4 py-3 text-[15px] text-[#9B2C20] sm:col-span-2">접수에 실패했습니다. 잠시 후 다시 시도하거나 이메일로 연락해 주세요</p> aka getByText('접수에 실패했습니다. 잠시 후 다시 시도하거나 이메일로 연락해 주세요')
    2) <div role="alert" aria-live="assertive" id="__next-route-announcer__"></div> aka locator('[id="__next-route-announcer__"]')
```
- **1차 실패 스크린샷 경로**:
  - `docs/agent/redesign/e2e-shots/redesign-redesign-b2b-uiux-efddb-S5-문의-contact-폼-제출-및-피드백-검증-pc/test-failed-1.png`
  - `docs/agent/redesign/e2e-shots/redesign-redesign-b2b-uiux-efddb-S5-문의-contact-폼-제출-및-피드백-검증-tablet/test-failed-1.png`
  - `docs/agent/redesign/e2e-shots/redesign-redesign-b2b-uiux-efddb-S5-문의-contact-폼-제출-및-피드백-검증-mobile/test-failed-1.png`
- **수정**: `page.getByRole('alert')`를 문의 폼 내부의 알림 요소를 명시하도록 `page.locator('form [role="alert"]')`로 구체화하여 셀렉터 충돌 해소 (기대값 `toContainText('접수에 실패했습니다')`는 동일 유지)

---

## 4. 1차 실행 결론

- **VERDICT: PASS**
- 11개 시나리오 전 항목(S1 ~ S11)이 3개 디바이스 뷰포트(PC, Tablet, Mobile)에서 모두 통과했습니다.
- 실제 운영 Supabase 호스트로의 외부 네트워크 유출 없이 모든 E2E 검증이 안전하게 완료되었습니다.

---

## 5. 2차 실행 (리뷰 지적 반영 시나리오 추가 검증)

- **실행 명령**: `npx playwright test -c tests/e2e/playwright.config.ts`
- **실행 시각**: 2026-10-23T14:17:40+09:00
- **테스트 환경**: http://localhost:4310 (새 빌드 배포본)

### 추가된 시나리오 명세
1. **S4 (1) 포커스 트랩(Focus Trap)**: 모바일 메뉴 열린 상태에서 '메뉴 닫기' 버튼에서 `Shift+Tab`, 그리고 패널 마지막 요소에서 `Tab` 입력 시 `document.activeElement`가 `#mobile-menu` 내부에 유지되는지 검증
2. **S4 (2) main 요소 inert 속성**: 모바일 메뉴 열림 시 `main` 요소에 `inert` 속성 적용, 닫힘 시 해제 검증
3. **S4 (3) BFCache 탐색 후 모바일 메뉴 상태**: 홈에서 메뉴 열고 'e-Discovery' 링크로 이동한 뒤 `page.goBack()` → `page.goForward()` 수행 시 `#mobile-menu`가 미노출(닫힘) 상태인지 검증
4. **S3 (4) 데스크톱 드롭다운 BFCache 상태**: 데스크톱 '사업영역' 드롭다운을 연 채 하위 링크로 이동 후 `goBack()` → `goForward()` 수행 시 드롭다운 닫힘 유지 검증

---

### 프로젝트별 2차 실행 요약

| 프로젝트 | 뷰포트 / 디바이스 사양 | 실행 결과 | 통과 | 실패 | 건너뜀 (Skip) | 소요 시간 |
|---|---|---|---|---|---|---|
| **pc** | 1440 × 900 (Desktop Chromium) | **PASS** | 10 | 0 | 1 (S4 모바일 전용) | 약 27s |
| **tablet** | 834 × 1112 (Chromium) | **FAIL** | 9 | 1 (S4) | 1 (S3 데스크톱 전용) | 약 28s |
| **mobile** | 390 × 844 (Chromium, Touch/Mobile) | **FAIL** | 9 | 1 (S4) | 1 (S3 데스크톱 전용) | 약 28s |
| **전체 합계** | 3개 프로젝트 (4 workers) | **FAIL** | **28** | **2** | **3** | **36.5s** |

---

### 새 시나리오 검증 결과

| 검증 항목 | 대상 시나리오 | pc (1440) | tablet (834) | mobile (390) | 판정 |
|---|---|---|---|---|---|
| **(1) 모바일 메뉴 포커스 트랩 (Shift+Tab / Tab)** | S4 | skip | **fail** | **fail** | **fail** |
| **(2) 모바일 메뉴 열림 시 main 요소 inert 적용** | S4 | skip | **pass** | **pass** | **pass** |
| **(3) 모바일 이동 후 goBack() → goForward() 시 메뉴 닫힘** | S4 | skip | 미검증 | 미검증 | **미검증** (앞단 (1) 실패로 중단) |
| **(4) 데스크톱 드롭다운 goBack() → goForward() 시 닫힘 유지** | S3 | **pass** | skip | skip | **pass** |

---

### 실패 상세 분석 (S4 모바일·태블릿 내비게이션)

#### 1) 실패 원인
- `src/components/interactive/MobileNav.tsx`에서 모바일 메뉴가 열렸을 때 `document.body.children`에 `el.inert = true`를 부여했으나, `#mobile-menu`는 네이티브 `<dialog>`(`showModal()`)가 아닌 일반 `<div>` 요소(`role="dialog"`, `aria-modal="true"`)로 렌더링되어 있습니다.
- 일반 `<div>` 모달은 브라우저 기본 포커스 트랩 기능을 제공하지 않으므로, '메뉴 닫기' 버튼(첫 번째 포커스 요소)에서 `Shift+Tab`을 눌렀을 때 이벤트 리스너 레벨에서 마지막 포커스 가능 요소로 순환시켜주지 않으면 포커스가 `document.body`로 이탈합니다 (`document.activeElement`가 `#mobile-menu` 바깥이 됨).

#### 2) 재현 절차
1. 뷰포트 < 1024 환경(태블릿 또는 모바일)에서 `http://localhost:4310/` 접속
2. '메뉴 열기' 버튼 클릭 → `#mobile-menu` 노출 및 '메뉴 닫기' 버튼에 포커스 위치
3. 키보드 `Shift+Tab` 입력
4. 포커스가 `#mobile-menu` 내부의 마지막 링크/버튼으로 순환하지 않고 `document.body`로 이탈하여 `isInside1` 검증 실패

#### 3) 오류 원문 (스택 트레이스)
```text
  1) [tablet] › tests/e2e/redesign.spec.ts:224:7 › redesign-b2b-uiux E2E Tests › S4 모바일·태블릿(<1024) 내비 

    Error: Shift+Tab 후 activeElement 가 #mobile-menu 안에 있어야 함

    expect(received).toBe(expected) // Object.is equality

    Expected: true
    Received: false

      254 |       return !!menu && menu.contains(document.activeElement);
      255 |     });
    > 256 |     expect(isInside1, 'Shift+Tab 후 activeElement 가 #mobile-menu 안에 있어야 함').toBe(true);
          |                                                                            ^
        at /mnt/e/VibeCoding/humease-web-v2/worktrees/redesign-e2e/tests/e2e/redesign.spec.ts:256:76

  2) [mobile] › tests/e2e/redesign.spec.ts:224:7 › redesign-b2b-uiux E2E Tests › S4 모바일·태블릿(<1024) 내비 

    Error: Shift+Tab 후 activeElement 가 #mobile-menu 안에 있어야 함

    expect(received).toBe(expected) // Object.is equality

    Expected: true
    Received: false

      254 |       return !!menu && menu.contains(document.activeElement);
      255 |     });
    > 256 |     expect(isInside1, 'Shift+Tab 후 activeElement 가 #mobile-menu 안에 있어야 함').toBe(true);
          |                                                                            ^
        at /mnt/e/VibeCoding/humease-web-v2/worktrees/redesign-e2e/tests/e2e/redesign.spec.ts:256:76
```

#### 4) 스크린샷 경로
- **tablet**: `docs/agent/redesign/e2e-shots/redesign-redesign-b2b-uiux-E2E-Tests-S4-모바일·태블릿-1024-내비-tablet/test-failed-1.png`
- **mobile**: `docs/agent/redesign/e2e-shots/redesign-redesign-b2b-uiux-E2E-Tests-S4-모바일·태블릿-1024-내비-mobile/test-failed-1.png`

---

## 6. 2차 실행 최종 결론

- **VERDICT: FAIL** (S4 모바일·태블릿 내비게이션 포커스 트랩 미구현)
- 데스크톱 내비게이션 BFCache 복귀 시 드롭다운 닫힘(S3-(4)) 및 모바일 메뉴 열림 시 main 요소 inert 속성 적용(S4-(2))은 정상 통과했습니다.
- 모바일 메뉴(S4)의 키보드 순환 포커스 트랩(1) 미구현으로 인해 tablet 및 mobile 프로젝트에서 실패가 발생했습니다.

---

## 7. 3차 실행 (포커스 트랩 수정 및 반응형 해제·닫기 포커스 복귀 검증)

- **실행 명령**: `npx playwright test -c tests/e2e/playwright.config.ts`
- **실행 시각**: 2026-10-23T14:24:27+09:00
- **테스트 환경**: http://localhost:4310 (포커스 트랩 구현 및 반응형 해제 보정 빌드)

### 추가된 시나리오 명세
1. **S4 (5) 뷰포트 확대 반응형 해제 및 상태 보존**: 모바일 메뉴가 열린 상태에서 `page.setViewportSize({ width: 1280, height: 900 })` 로 확장 시 `#mobile-menu` 미노출, `main` 의 `inert` 해제, `body.style.overflow !== 'hidden'` 확인 후, 다시 원래 크기(390/834)로 복귀해도 메뉴가 다시 열리지 않음 검증
2. **S4 (6) 메뉴 닫기 버튼을 통한 포커스 복귀**: '메뉴 닫기' 버튼 클릭 시 `inert`·`overflow` 가 정상 해제되고 포커스가 '메뉴 열기' 버튼으로 복귀하는지 검증

---

### 프로젝트별 3차 실행 요약

| 프로젝트 | 뷰포트 / 디바이스 사양 | 실행 결과 | 통과 | 실패 | 건너뜀 (Skip) | 소요 시간 |
|---|---|---|---|---|---|---|
| **pc** | 1440 × 900 (Desktop Chromium) | **PASS** | 10 | 0 | 1 (S4 모바일 전용) | 약 38s |
| **tablet** | 834 × 1112 (Chromium) | **PASS** | 10 | 0 | 1 (S3 데스크톱 전용) | 약 38s |
| **mobile** | 390 × 844 (Chromium, Touch/Mobile) | **PASS** | 10 | 0 | 1 (S3 데스크톱 전용) | 약 38s |
| **전체 합계** | 3개 프로젝트 (4 workers) | **PASS** | **30** | **0** | **3** | **38.1s** |

---

### 세부 항목 (1)~(6) 검증 결과

| 번호 | 검증 항목 | 대상 시나리오 | pc (1440) | tablet (834) | mobile (390) | 판정 |
|---|---|---|---|---|---|---|
| **(1)** | **모바일 메뉴 포커스 트랩**<br>'메뉴 닫기'에서 `Shift+Tab`, 마지막 요소에서 `Tab` 입력 시 activeElement가 `#mobile-menu` 안에 유지 | S4 | skip | **pass** | **pass** | **pass** |
| **(2)** | **main 요소 inert 속성 제어**<br>메뉴 열림 시 `main` 요소에 `inert` 적용, 닫힘 시 해제 확인 | S4 | skip | **pass** | **pass** | **pass** |
| **(3)** | **BFCache 탐색 후 모바일 메뉴 상태**<br>홈에서 메뉴 열고 'e-Discovery' 이동 후 `goBack()` → `goForward()` 해도 메뉴 닫힘 유지 | S4 | skip | **pass** | **pass** | **pass** |
| **(4)** | **데스크톱 드롭다운 BFCache 탐색 상태**<br>'사업영역' 드롭다운 연 채 이동 후 `goBack()` → `goForward()` 해도 드롭다운 닫힘 유지 | S3 | **pass** | skip | skip | **pass** |
| **(5)** | **뷰포트 1280px 확대 시 메뉴 해제 및 원래 크기 복귀**<br>1280px 확대 시 메뉴 숨김, main inert 해제, overflow hidden 해제, 원래 크기 복귀 후 메뉴 닫힘 유지 | S4 | skip | **pass** | **pass** | **pass** |
| **(6)** | **'메뉴 닫기' 버튼 클릭 시 해제 및 포커스 복귀**<br>'메뉴 닫기' 클릭 시 inert·overflow 해제 및 포커스가 '메뉴 열기' 버튼으로 복귀 | S4 | skip | **pass** | **pass** | **pass** |

---

### 실패 항목
- 없음 (실패 0건, 전 항목 통과)

---

## 8. 3차 실행 최종 결론

- **VERDICT: PASS**
- 2차 실행에서 확인되었던 S4 모바일 메뉴의 포커스 트랩 이탈 결함이 새 빌드(`MobileNav.tsx`의 Tab/Shift+Tab 순환 처리)에서 완벽히 해결되었습니다.
- 추가된 (5) 1280px 확대 시의 상태 초기화 및 반응형 복귀, (6) '메뉴 닫기' 버튼에 의한 포커스 복귀 및 inert/overflow 해제 검증 또한 PC, Tablet, Mobile 전 환경에서 성공적으로 통과했습니다.

> 반영 메모(Claude, 2026-10-23): 3차 실행 결과를 Claude 가 독립 재실행해 30 pass / 3 skip(뷰포트 분기) / 0 fail 을 확인했다. 앞선 `any` 타입 보정(ConsoleMessage·Response)은 2·3차 실행본에도 유지돼 있다.
