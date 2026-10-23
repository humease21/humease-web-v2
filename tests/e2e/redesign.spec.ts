import { test, expect, type ConsoleMessage, type Response } from '@playwright/test';
import { aliases } from '../../src/content/aliases';

const ROUTES = [
  '/', '/about/', '/enterprise-data/',
  '/consulting/e-discovery/', '/consulting/internal-control/',
  '/consulting/exchange-archive/', '/consulting/ai-transformation/',
  '/ai-services/', '/ai-services/mom-ie/', '/ai-services/anybuild/',
  '/ai-services/hairai/', '/ai-services/k-bestie/',
  '/solutions/', '/solutions/enterprise-vault/', '/solutions/enterprise-vault-capture/',
  '/solutions/data-insight/', '/solutions/ediscovery-platform/',
  '/contact/', '/insights/', '/privacy/', '/terms/',
];

test.describe('redesign-b2b-uiux E2E Tests', () => {

  // S1: 전체 21개 라우트 기본 상태 검증
  test('S1 전체 21개 라우트 검증', async ({ page }) => {
    test.setTimeout(120000);

    for (const route of ROUTES) {
      const consoleErrors: string[] = [];
      const pageErrors: string[] = [];
      const failedRequests: string[] = [];

      const onConsole = (msg: ConsoleMessage) => {
        if (msg.type() === 'error') {
          consoleErrors.push(`[${route}] console.error: ${msg.text()}`);
        }
      };
      const onPageError = (err: Error) => {
        pageErrors.push(`[${route}] pageerror: ${err.message}`);
      };
      const onResponse = (resp: Response) => {
        if (resp.url().includes('localhost:4310') && resp.status() >= 400) {
          failedRequests.push(`[${route}] failed req ${resp.status()}: ${resp.url()}`);
        }
      };

      page.on('console', onConsole);
      page.on('pageerror', onPageError);
      page.on('response', onResponse);

      const response = await page.goto(route, { waitUntil: 'load' });
      expect(response?.status(), `Route ${route} status`).toBe(200);

      // h1 정확히 1개
      const h1Count = await page.locator('h1').count();
      expect(h1Count, `Route ${route} h1 count`).toBe(1);

      // 콘솔 error 0, pageerror 0, localhost 4xx/5xx 0
      expect(consoleErrors, `Route ${route} console errors`).toEqual([]);
      expect(pageErrors, `Route ${route} page errors`).toEqual([]);
      expect(failedRequests, `Route ${route} failed localhost requests`).toEqual([]);

      // 깨진 이미지 0 (complete && naturalWidth === 0)
      const brokenImages = await page.evaluate(() => {
        return Array.from(document.images)
          .filter((img) => img.complete && img.naturalWidth === 0)
          .map((img) => img.src);
      });
      expect(brokenImages, `Route ${route} broken images`).toEqual([]);

      // 가로 스크롤 없음 (documentElement.scrollWidth <= innerWidth + 1)
      const hasHorizontalOverflow = await page.evaluate(() => {
        return document.documentElement.scrollWidth > window.innerWidth + 1;
      });
      expect(hasHorizontalOverflow, `Route ${route} horizontal overflow`).toBe(false);

      // 헤더·푸터·main 존재
      await expect(page.locator('header'), `Route ${route} header`).toBeVisible();
      await expect(page.locator('main'), `Route ${route} main`).toBeVisible();
      await expect(page.locator('footer'), `Route ${route} footer`).toBeVisible();

      // 리스너 정리
      page.off('console', onConsole);
      page.off('pageerror', onPageError);
      page.off('response', onResponse);
    }
  });

  // S2: 내부 링크 & 외부 링크 검증
  test('S2 내부 링크 및 외부 링크 속성 검증', async ({ page, request }) => {
    test.setTimeout(180000);

    const internalPaths = new Set<string>();
    const hashLinks: { pageUrl: string; hash: string }[] = [];
    const externalLinks: { href: string; target: string | null; rel: string | null }[] = [];

    // 21개 페이지를 순회하며 모든 a[href] 수집
    for (const route of ROUTES) {
      await page.goto(route, { waitUntil: 'domcontentloaded' });
      const pageLinks = await page.locator('a[href]').evaluateAll((elements) => {
        return elements.map((el) => ({
          href: el.getAttribute('href') || '',
          target: el.getAttribute('target'),
          rel: el.getAttribute('rel'),
        }));
      });

      for (const link of pageLinks) {
        const href = link.href.trim();
        if (!href || href.startsWith('mailto:') || href.startsWith('tel:') || href.startsWith('javascript:')) {
          continue;
        }

        const isExternal = /^https?:\/\//i.test(href) && !href.includes('localhost:4310');
        if (isExternal) {
          externalLinks.push(link);
        } else {
          const parsed = new URL(href, 'http://localhost:4310' + route);
          internalPaths.add(parsed.pathname);
          if (parsed.hash) {
            hashLinks.push({ pageUrl: parsed.pathname, hash: parsed.hash.replace(/^#/, '') });
          }
        }
      }
    }

    // 1) 외부 링크 검증: target=_blank 와 rel 에 noopener 가 있는지만 확인(접속하지 않음)
    for (const ext of externalLinks) {
      expect(ext.target, `외부 링크 target: ${ext.href}`).toBe('_blank');
      expect(ext.rel ?? '', `외부 링크 rel noopener: ${ext.href}`).toContain('noopener');
    }

    // 2) 내부 링크 GET 200 확인
    for (const path of internalPaths) {
      const res = await request.get(path);
      expect(res.status(), `내부 링크 GET 200 확인 실패: ${path}`).toBe(200);
    }

    // 3) `#id` 해시가 붙은 링크는 대상 페이지에 그 id 요소가 있는지 확인
    const uniqueHashLinks = Array.from(
      new Set(hashLinks.map((h) => `${h.pageUrl}#${h.hash}`))
    ).map((item) => {
      const idx = item.indexOf('#');
      return { pageUrl: item.slice(0, idx), hash: item.slice(idx + 1) };
    });

    for (const { pageUrl, hash } of uniqueHashLinks) {
      await page.goto(pageUrl, { waitUntil: 'domcontentloaded' });
      const targetElement = page.locator(`#${hash}`);
      const count = await targetElement.count();
      expect(count, `해시 대상 요소 #${hash} 누락 (${pageUrl})`).toBeGreaterThanOrEqual(1);
    }
  });

  // S3: 데스크톱(≥1024) 내비
  test('S3 데스크톱(≥1024) 내비', async ({ page, viewport }) => {
    test.skip((viewport?.width ?? 0) < 1024, '데스크톱 전용 시나리오');

    await page.goto('/');

    // '사업영역' 버튼 클릭 → aria-expanded=true, 서브메뉴 링크 5개 보임
    const bizBtn = page.getByRole('button', { name: '사업영역' });
    await expect(bizBtn).toBeVisible();
    await expect(bizBtn).toHaveAttribute('aria-expanded', 'false');

    await bizBtn.click();
    await expect(bizBtn).toHaveAttribute('aria-expanded', 'true');

    const bizControlsId = await bizBtn.getAttribute('aria-controls');
    expect(bizControlsId).toBeTruthy();
    const bizMenu = page.locator(`[id="${bizControlsId}"]`);
    const bizLinks = bizMenu.getByRole('link');
    await expect(bizLinks).toHaveCount(5);
    for (let i = 0; i < 5; i++) {
      await expect(bizLinks.nth(i)).toBeVisible();
    }

    // Escape 로 닫히고 포커스가 버튼으로 복귀
    await page.keyboard.press('Escape');
    await expect(bizBtn).toHaveAttribute('aria-expanded', 'false');
    await expect(bizBtn).toBeFocused();

    // 'Arctera 솔루션' 서브메뉴의 'Data Insight' 클릭 시 /solutions/data-insight/ 로 이동하고 메뉴가 닫혀 있음
    const arcteraBtn = page.getByRole('button', { name: 'Arctera 솔루션' });
    await arcteraBtn.click();
    await expect(arcteraBtn).toHaveAttribute('aria-expanded', 'true');

    const arcteraControlsId = await arcteraBtn.getAttribute('aria-controls');
    const arcteraMenu = page.locator(`[id="${arcteraControlsId}"]`);
    const dataInsightLink = arcteraMenu.getByRole('link', { name: /Data Insight/ });
    await expect(dataInsightLink).toBeVisible();

    await dataInsightLink.click();
    await page.waitForURL('**/solutions/data-insight/**');
    await expect(arcteraBtn).toHaveAttribute('aria-expanded', 'false');

    // 현재 페이지 링크에 aria-current="page"
    await arcteraBtn.click();
    const activeLink = arcteraMenu.locator('a[aria-current="page"]');
    await expect(activeLink).toBeVisible();
    await expect(activeLink).toContainText('Data Insight');
    await page.keyboard.press('Escape');

    // (4) 데스크톱 '사업영역' 드롭다운을 연 채로 하위 링크로 이동 후 goBack()/goForward() 해도 드롭다운이 닫혀 있다.
    await page.goto('/');
    const bizBtn2 = page.getByRole('button', { name: '사업영역' });
    await bizBtn2.click();
    await expect(bizBtn2).toHaveAttribute('aria-expanded', 'true');
    const bizControlsId2 = await bizBtn2.getAttribute('aria-controls');
    const bizMenu2 = page.locator(`[id="${bizControlsId2}"]`);
    await expect(bizMenu2).toBeVisible();

    const subLink = bizMenu2.getByRole('link', { name: '기업 데이터' });
    await subLink.click();
    await page.waitForURL('**/enterprise-data/**');
    await expect(bizBtn2).toHaveAttribute('aria-expanded', 'false');
    await expect(bizMenu2).not.toBeVisible();

    await page.goBack();
    await expect(bizBtn2).toHaveAttribute('aria-expanded', 'false');
    await expect(page.locator(`[id="${bizControlsId2}"]`)).not.toBeVisible();

    await page.goForward();
    const bizBtnFwd = page.getByRole('button', { name: '사업영역' });
    await expect(bizBtnFwd).toHaveAttribute('aria-expanded', 'false');
    const bizControlsIdFwd = await bizBtnFwd.getAttribute('aria-controls');
    await expect(page.locator(`[id="${bizControlsIdFwd}"]`)).not.toBeVisible();
  });

  // S4: 모바일·태블릿(<1024) 내비
  test('S4 모바일·태블릿(<1024) 내비', async ({ page, viewport }) => {
    test.skip((viewport?.width ?? 0) >= 1024, '모바일·태블릿 전용 시나리오');

    await page.goto('/');

    // '메뉴 열기' 버튼 → role=dialog 표시, '메뉴 닫기' 버튼에 포커스, body overflow hidden
    const openBtn = page.getByRole('button', { name: '메뉴 열기' });
    await expect(openBtn).toBeVisible();
    await openBtn.click();

    const dialog = page.getByRole('dialog', { name: '전체 메뉴' });
    await expect(dialog).toBeVisible();

    const closeBtn = page.getByRole('button', { name: '메뉴 닫기' });
    await expect(closeBtn).toBeFocused();

    const overflow = await page.evaluate(() => document.body.style.overflow);
    expect(overflow).toBe('hidden');

    // (2) 메뉴가 열린 상태에서 main 요소에 inert 속성이 있고, 닫으면 사라진다.
    const isMainInertOpen = await page.locator('main').evaluate((el) => {
      return el.hasAttribute('inert') || el.closest('[inert]') !== null;
    });
    expect(isMainInertOpen, '메뉴 열림 시 main 요소에 inert 적용').toBe(true);

    // (1) 메뉴가 열린 상태에서 '메뉴 닫기' 버튼에서 Shift+Tab, 그리고 패널의 마지막 링크/버튼에서 Tab 을 눌러도 document.activeElement 가 #mobile-menu 안에 있다.
    await closeBtn.focus();
    await page.keyboard.press('Shift+Tab');
    const isInside1 = await page.evaluate(() => {
      const menu = document.getElementById('mobile-menu');
      return !!menu && menu.contains(document.activeElement);
    });
    expect(isInside1, 'Shift+Tab 후 activeElement 가 #mobile-menu 안에 있어야 함').toBe(true);

    const lastFocusable = dialog.locator('a, button').last();
    await lastFocusable.focus();
    await page.keyboard.press('Tab');
    const isInside2 = await page.evaluate(() => {
      const menu = document.getElementById('mobile-menu');
      return !!menu && menu.contains(document.activeElement);
    });
    expect(isInside2, '마지막 요소에서 Tab 후 activeElement 가 #mobile-menu 안에 있어야 함').toBe(true);

    // 메뉴 닫힘 시 inert 사라짐 검증
    await page.keyboard.press('Escape');
    await expect(dialog).not.toBeVisible();
    const isMainInertClosed = await page.locator('main').evaluate((el) => {
      return el.hasAttribute('inert') || el.closest('[inert]') !== null;
    });
    expect(isMainInertClosed, '메뉴 닫힘 시 main 의 inert 속성 해제').toBe(false);

    // 다시 열기
    await openBtn.click();
    await expect(dialog).toBeVisible();

    // 'e-Discovery' 링크 클릭 → 이동 후 dialog 사라짐
    const eDiscoveryLink = dialog.getByRole('link', { name: 'e-Discovery' });
    await expect(eDiscoveryLink).toBeVisible();
    await eDiscoveryLink.click();

    await page.waitForURL('**/consulting/e-discovery/**');
    await expect(dialog).not.toBeVisible();

    // (3) 홈에서 메뉴를 열고 'e-Discovery' 로 이동한 뒤 page.goBack() → page.goForward() 를 해도 #mobile-menu 가 보이지 않는다.
    await page.goBack();
    await expect(page.locator('#mobile-menu')).not.toBeVisible();

    await page.goForward();
    await expect(page.locator('#mobile-menu')).not.toBeVisible();

    // 홈으로 돌아가서 나머지 테스트 수행
    await page.goto('/');
    const openBtnAgain = page.getByRole('button', { name: '메뉴 열기' });
    await openBtnAgain.click();
    await expect(dialog).toBeVisible();

    // 다시 열고 Escape → 닫히고 포커스가 '메뉴 열기' 버튼으로 복귀
    await page.keyboard.press('Escape');
    await expect(dialog).not.toBeVisible();
    await expect(openBtnAgain).toBeFocused();

    // 메뉴의 모든 링크 높이 ≥ 44px
    await openBtnAgain.click();
    await expect(dialog).toBeVisible();
    const menuLinks = dialog.getByRole('link');
    const linkCount = await menuLinks.count();
    expect(linkCount).toBeGreaterThan(0);

    for (let i = 0; i < linkCount; i++) {
      const box = await menuLinks.nth(i).boundingBox();
      expect(box, `메뉴 링크 ${i} boundingBox`).not.toBeNull();
      expect(box!.height, `메뉴 링크 ${i} 높이 44px 이상`).toBeGreaterThanOrEqual(44);
    }

    await page.keyboard.press('Escape');

    // (5) 메뉴를 연 상태에서 page.setViewportSize({width:1280,height:900}) 로 넓히면 #mobile-menu 가 사라지고, main 의 inert 속성이 없고, document.body.style.overflow 가 'hidden' 이 아니다. 이후 원래 크기로 되돌려도 메뉴가 다시 열려 있지 않다.
    const originalViewport = viewport ?? { width: 390, height: 844 };
    await openBtnAgain.click();
    await expect(dialog).toBeVisible();

    await page.setViewportSize({ width: 1280, height: 900 });
    await expect(page.locator('#mobile-menu')).not.toBeVisible();

    const isMainInertAfterResize = await page.locator('main').evaluate((el) => {
      return el.hasAttribute('inert') || el.closest('[inert]') !== null;
    });
    expect(isMainInertAfterResize, '1280px 확대 시 main 의 inert 해제').toBe(false);

    const overflowAfterResize = await page.evaluate(() => document.body.style.overflow);
    expect(overflowAfterResize, '1280px 확대 시 body overflow hidden 해제').not.toBe('hidden');

    await page.setViewportSize({ width: originalViewport.width, height: originalViewport.height });
    await expect(page.locator('#mobile-menu')).not.toBeVisible();

    // (6) '메뉴 닫기' 버튼으로 닫으면 inert·overflow 가 해제되고 포커스가 '메뉴 열기' 버튼으로 돌아온다.
    const openBtnForCloseTest = page.getByRole('button', { name: '메뉴 열기' });
    await openBtnForCloseTest.click();
    await expect(dialog).toBeVisible();

    const closeBtnInPanel = dialog.getByRole('button', { name: '메뉴 닫기' });
    await closeBtnInPanel.click();
    await expect(dialog).not.toBeVisible();

    const isMainInertAfterCloseBtn = await page.locator('main').evaluate((el) => {
      return el.hasAttribute('inert') || el.closest('[inert]') !== null;
    });
    expect(isMainInertAfterCloseBtn, '메뉴 닫기 버튼으로 닫았을 때 main inert 해제').toBe(false);

    const overflowAfterCloseBtn = await page.evaluate(() => document.body.style.overflow);
    expect(overflowAfterCloseBtn, '메뉴 닫기 버튼으로 닫았을 때 body overflow hidden 해제').not.toBe('hidden');

    await expect(openBtnForCloseTest).toBeFocused();
  });

  // S5: 문의(/contact/)
  test('S5 문의(/contact/) 폼 제출 및 피드백 검증', async ({ page }) => {
    let unmockedSupabase = false;
    let submitCount = 0;

    page.on('request', (req) => {
      const url = req.url();
      if (url.includes('supabase.co') && !url.includes('e2e-dummy.supabase.co')) {
        unmockedSupabase = true;
      }
    });

    // (a) page.route 로 {ok:true} 200 응답 시 '문의가 접수되었습니다' 표시
    await page.route('**/functions/v1/submit-inquiry**', async (route) => {
      submitCount++;
      return route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ ok: true }),
      });
    });

    await page.goto('/contact/');

    // 체크 전 '문의 보내기' 버튼 disabled
    const submitBtn = page.getByRole('button', { name: '문의 보내기' });
    await expect(submitBtn).toBeDisabled();

    // '내용 보기' → dialog 열림 → '닫기' 로 닫힘
    const viewTermsBtn = page.getByRole('button', { name: '내용 보기' });
    await viewTermsBtn.click();
    const modalDialog = page.locator('dialog[open]');
    await expect(modalDialog).toBeVisible();

    const modalCloseBtn = modalDialog.getByRole('button', { name: '닫기' });
    await modalCloseBtn.click();
    await expect(page.locator('dialog[open]')).toHaveCount(0);

    // 필수값 입력 + 동의 체크
    await page.locator('input[name="company_name"]').fill('휴미즈테스트');
    await page.locator('input[name="contact_name"]').fill('홍길동');
    await page.locator('input[name="email"]').fill('test@humease.com');
    await page.locator('textarea[name="message"]').fill('E2E 테스트 문의 내용입니다.');
    await page.locator('input[name="privacy_consent"]').check();

    // 버튼 활성화 후 제출
    await expect(submitBtn).toBeEnabled();
    await submitBtn.click();

    // '문의가 접수되었습니다' 표시
    await expect(page.getByText('문의가 접수되었습니다')).toBeVisible();
    expect(unmockedSupabase, '실제 Supabase 호스트로 요청이 나가지 않아야 함').toBe(false);
    expect(submitCount, 'submit-inquiry 라우트 호출됨').toBeGreaterThan(0);

    // (b) 같은 경로를 500 으로 주면 role=alert 에 '접수에 실패했습니다' 표시
    await page.unroute('**/functions/v1/submit-inquiry**');

    await page.route('**/functions/v1/submit-inquiry**', async (route) => {
      return route.fulfill({
        status: 500,
        contentType: 'application/json',
        body: JSON.stringify({ error: 'internal server error' }),
      });
    });

    await page.goto('/contact/');
    const submitBtn500 = page.getByRole('button', { name: '문의 보내기' });
    await expect(submitBtn500).toBeDisabled();

    await page.locator('input[name="company_name"]').fill('휴미즈테스트');
    await page.locator('input[name="contact_name"]').fill('홍길동');
    await page.locator('input[name="email"]').fill('test@humease.com');
    await page.locator('textarea[name="message"]').fill('E2E 테스트 실패 케이스 문의 내용입니다.');
    await page.locator('input[name="privacy_consent"]').check();

    await expect(submitBtn500).toBeEnabled();
    await submitBtn500.click();

    const alert = page.locator('form [role="alert"]');
    await expect(alert).toBeVisible();
    await expect(alert).toContainText('접수에 실패했습니다');
    expect(unmockedSupabase, '실제 Supabase 호스트로 요청이 나가지 않아야 함').toBe(false);
  });

  // S6: FAQ
  test('S6 FAQ: summary 포커스 후 Enter 시 details open 및 답변 보임', async ({ page }) => {
    await page.goto('/');

    const firstSummary = page.locator('details summary').first();
    await expect(firstSummary).toBeVisible();

    await firstSummary.focus();
    await page.keyboard.press('Enter');

    const firstDetails = page.locator('details').first();
    await expect(firstDetails).toHaveAttribute('open', '');

    const answer = firstDetails.locator('p.body');
    await expect(answer).toBeVisible();
  });

  // S7: 접근성 키보드
  test('S7 접근성 키보드: 첫 Tab 시 건너뛰기 링크 포커스, Enter 시 #main 이동', async ({ page }) => {
    await page.goto('/');

    await page.keyboard.press('Tab');
    const skipLink = page.getByRole('link', { name: '본문으로 건너뛰기' });
    await expect(skipLink).toBeFocused();
    await expect(skipLink).toBeVisible();

    await page.keyboard.press('Enter');
    expect(page.url()).toContain('#main');
  });

  // S8: 별칭
  test('S8 별칭: 각 별칭 경로 HTML 에 meta refresh 와 대상 경로 링크 존재', async ({ request }) => {
    for (const a of aliases) {
      const res = await request.get(a.from);
      expect(res.status(), `별칭 ${a.from} 응답 200 확인`).toBe(200);

      const html = await res.text();

      // meta refresh 확인
      const refreshMatch = html.match(/http-equiv="refresh"[^>]*content="0;\s*url=([^"]+)"/i);
      expect(refreshMatch, `별칭 ${a.from} 에 meta refresh 존재`).not.toBeNull();
      expect(refreshMatch![1], `별칭 ${a.from} refresh 대상 일치`).toContain(a.to);

      // 대상 경로 링크 존재 확인
      const linkRegex = new RegExp(`<a[^>]*href="[^"]*${a.to}\/?"`, 'i');
      expect(html, `별칭 ${a.from} 에 대상 링크 <a href="${a.to}..."> 존재`).toMatch(linkRegex);
    }
  });

  // S9: 앵커 보존
  test('S9 앵커 보존: /solutions/ 의 앵커들과 홈의 #business 존재', async ({ page }) => {
    await page.goto('/solutions/');
    const solutionAnchors = ['ev', 'merge1', 'datainsight', 'ediscovery', 'products'];
    for (const anchor of solutionAnchors) {
      const el = page.locator(`#${anchor}`);
      await expect(el, `/solutions/#${anchor} 존재`).toHaveCount(1);
    }

    await page.goto('/');
    const businessAnchor = page.locator('#business');
    await expect(businessAnchor, `/#business 존재`).toHaveCount(1);
  });

  // S10: JS 비활성 (javaScriptEnabled: false)
  test('S10 JS 비활성 컨텍스트에서 홈·/solutions/ 의 [data-reveal] 요소 opacity 1', async ({ browser }) => {
    const noJsContext = await browser.newContext({ javaScriptEnabled: false });
    const noJsPage = await noJsContext.newPage();

    for (const targetPath of ['/', '/solutions/']) {
      await noJsPage.goto(targetPath);
      const reveals = noJsPage.locator('[data-reveal]');
      const count = await reveals.count();
      expect(count, `${targetPath} 에 [data-reveal] 요소 존재`).toBeGreaterThan(0);

      for (let i = 0; i < count; i++) {
        await expect(reveals.nth(i), `${targetPath} reveal ${i} opacity 1`).toHaveCSS('opacity', '1');
      }
    }

    await noJsContext.close();
  });

  // S11: CTA
  test('S11 CTA: 홈 히어로 및 헤더의 프로젝트 문의 클릭 시 /contact/ 도착', async ({ page, viewport }) => {
    // 1) 홈 히어로의 '프로젝트 문의' 클릭
    await page.goto('/');
    const heroCta = page.locator('main').getByRole('link', { name: '프로젝트 문의' }).first();
    await expect(heroCta).toBeVisible();
    await heroCta.click();
    await page.waitForURL('**/contact/**');
    expect(page.url()).toContain('/contact');

    // 2) 헤더 우측 '프로젝트 문의' (데스크톱 ≥1024 전용)
    if ((viewport?.width ?? 0) >= 1024) {
      await page.goto('/');
      const headerCta = page.locator('header').getByRole('link', { name: '프로젝트 문의' });
      await expect(headerCta).toBeVisible();
      await headerCta.click();
      await page.waitForURL('**/contact/**');
      expect(page.url()).toContain('/contact');
    }
  });

});
