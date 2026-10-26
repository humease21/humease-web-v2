import { test, expect, type Page } from '@playwright/test';

test.describe('temp-site E2E Scenarios', () => {
  // T1: 홈(/)
  test('T1: 홈(/) 기본 구조, 헤딩, 카드, 접근성 및 시각적 안정성 검증', async ({ page }) => {
    const consoleErrors: string[] = [];
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
      }
    });
    page.on('pageerror', (err) => {
      consoleErrors.push(err.message);
    });

    const response = await page.goto('/');
    expect(response?.status()).toBe(200);

    // main 안 section 정확히 5개
    const sections = page.locator('main section');
    await expect(sections).toHaveCount(5);

    // 순서대로 eyebrow 텍스트 "휴미즈 소개", "관점", "연결", "우리가 일하는 방식", "문의"
    const expectedEyebrows = ['휴미즈 소개', '관점', '연결', '우리가 일하는 방식', '문의'];
    for (let i = 0; i < expectedEyebrows.length; i++) {
      await expect(sections.nth(i)).toContainText(expectedEyebrows[i]);
    }

    // h1 텍스트에 "Enterprise IT에서" 와 "AX까지"
    const h1 = page.locator('h1');
    await expect(h1).toContainText('Enterprise IT에서');
    await expect(h1).toContainText('AX까지');

    // 4개 카드 제목 이해/설계/구현/검증
    const cardTitles = ['이해', '설계', '구현', '검증'];
    for (const title of cardTitles) {
      await expect(page.getByText(title, { exact: true }).first()).toBeVisible();
    }

    // 브레드크럼(nav[aria-label="현재 위치"]) 없음
    await expect(page.locator('nav[aria-label="현재 위치"]')).toHaveCount(0);

    // 가로 스크롤 없음 (scrollWidth <= innerWidth)
    const hasHorizontalScroll = await page.evaluate(() => {
      return document.documentElement.scrollWidth > window.innerWidth;
    });
    expect(hasHorizontalScroll).toBe(false);

    // 깨진 이미지 0
    const brokenImages = await page.evaluate(() => {
      const imgs = Array.from(document.querySelectorAll('img'));
      return imgs
        .filter((img) => !img.complete || img.naturalWidth === 0)
        .map((img) => img.src || img.getAttribute('src') || '');
    });
    expect(brokenImages).toHaveLength(0);

    // 콘솔 error 0
    expect(consoleErrors).toEqual([]);
  });

  // T2: 헤더
  test('T2: 헤더 요소 구성 및 네비게이션 무결성', async ({ page }) => {
    await page.goto('/');

    const header = page.locator('header');
    const headerLinks = header.locator('a');

    // header 안 a 정확히 1개(href "/")
    await expect(headerLinks).toHaveCount(1);
    await expect(headerLinks.first()).toHaveAttribute('href', '/');

    // header 안 img 1개
    await expect(header.locator('img')).toHaveCount(1);

    // header 안 nav·button 0개
    await expect(header.locator('nav')).toHaveCount(0);
    await expect(header.locator('button')).toHaveCount(0);

    // 메뉴 텍스트(사업영역, Arctera 솔루션, AI 포트폴리오, 인사이트, 회사소개) 페이지 어디에도 링크로 없음
    const prohibitedMenuTexts = ['사업영역', 'Arctera 솔루션', 'AI 포트폴리오', '인사이트', '회사소개'];
    for (const text of prohibitedMenuTexts) {
      await expect(page.locator(`a:has-text("${text}")`)).toHaveCount(0);
    }

    // 로고 클릭 시 / 유지
    await headerLinks.first().click();
    await expect(page).toHaveURL(/\/$/);
  });

  // T3: 푸터
  test('T3: 푸터 구성 및 개인정보처리방침 링크 검증', async ({ page }) => {
    await page.goto('/');

    const footer = page.locator('footer');

    // footer 안 img 1개
    await expect(footer.locator('img')).toHaveCount(1);

    // footer 안 a 정확히 1개 텍스트 "개인정보처리방침"
    const footerLinks = footer.locator('a');
    await expect(footerLinks).toHaveCount(1);
    await expect(footerLinks.first()).toHaveText('개인정보처리방침');

    // 클릭 시 /privacy/ 로 이동, 200
    const [response] = await Promise.all([
      page.waitForResponse((res) => res.url().includes('/privacy') && res.status() === 200),
      footerLinks.first().click(),
    ]);
    expect(response.status()).toBe(200);
    await expect(page).toHaveURL(/\/privacy\/?$/);
  });

  // T4: CTA 링크
  test('T4: 홈 히어로 CTA 및 하단 문의 섹션 링크 확인', async ({ page }) => {
    await page.goto('/');

    // 히어로 CTA "프로젝트 문의" 클릭 → /contact/ 로 이동
    const heroSection = page.locator('main section').first();
    const heroCta = heroSection.locator('a:has-text("프로젝트 문의")');
    await expect(heroCta).toBeVisible();
    await heroCta.click();
    await expect(page).toHaveURL(/\/contact\/?$/);

    // 홈으로 돌아가서 하단 문의 섹션 확인
    await page.goto('/');
    const bottomSection = page.locator('main section').last();

    // 하단 문의 섹션의 "프로젝트 문의" href /contact/
    const bottomCta = bottomSection.locator('a:has-text("프로젝트 문의")');
    await expect(bottomCta).toBeVisible();
    await expect(bottomCta).toHaveAttribute('href', /^\/contact\/?$/);

    // 이메일 버튼 href "mailto:contact@humease.com"
    const emailLink = bottomSection.locator('a[href^="mailto:"]');
    await expect(emailLink).toBeVisible();
    await expect(emailLink).toHaveAttribute('href', 'mailto:contact@humease.com');
  });

  // T5: /contact/
  test('T5: /contact/ 폼 필드, 동의 체크, 모달 동작, 정책 링크 확인', async ({ page }) => {
    await page.goto('/contact/');

    // 폼 필드 company_name, contact_name, email, message, privacy_consent 존재
    await expect(page.locator('[name="company_name"]')).toBeVisible();
    await expect(page.locator('[name="contact_name"]')).toBeVisible();
    await expect(page.locator('[name="email"]')).toBeVisible();
    await expect(page.locator('[name="message"]')).toBeVisible();
    const consent = page.locator('[name="privacy_consent"]');
    await expect(consent).toBeVisible();

    // 동의 체크 전 "문의 보내기" 버튼 disabled
    const submitBtn = page.locator('button:has-text("문의 보내기")');
    await expect(submitBtn).toBeDisabled();

    // 체크 후 enabled (제출은 하지 않는다)
    await consent.check();
    await expect(submitBtn).toBeEnabled();

    // "내용 보기" 클릭 → role=dialog 열림, 제목 "개인정보 수집·이용 동의", Escape 로 닫힘
    const viewDetailBtn = page.getByRole('button', { name: '내용 보기' });
    await expect(viewDetailBtn).toBeVisible();
    await viewDetailBtn.click();

    const dialog = page.getByRole('dialog');
    await expect(dialog).toBeVisible();
    await expect(dialog.getByRole('heading', { name: '개인정보 수집·이용 동의' })).toBeVisible();

    await page.keyboard.press('Escape');
    await expect(dialog).toBeHidden();

    // 폼 안에 /privacy/ 와 /terms/ 링크 존재(target _blank)
    const formPrivacy = page.locator('form a[href*="/privacy"]');
    await expect(formPrivacy).toBeVisible();
    await expect(formPrivacy).toHaveAttribute('target', '_blank');

    const formTerms = page.locator('form a[href*="/terms"]');
    await expect(formTerms).toBeVisible();
    await expect(formTerms).toHaveAttribute('target', '_blank');
  });

  // 공통 헬퍼: 헤더/푸터 검증
  async function verifyHeaderAndFooter(page: Page) {
    const header = page.locator('header');
    const headerLinks = header.locator('a');
    await expect(headerLinks).toHaveCount(1);
    await expect(headerLinks.first()).toHaveAttribute('href', '/');
    await expect(header.locator('img')).toHaveCount(1);
    await expect(header.locator('nav')).toHaveCount(0);
    await expect(header.locator('button')).toHaveCount(0);

    const prohibitedMenuTexts = ['사업영역', 'Arctera 솔루션', 'AI 포트폴리오', '인사이트', '회사소개'];
    for (const text of prohibitedMenuTexts) {
      await expect(page.locator(`a:has-text("${text}")`)).toHaveCount(0);
    }

    const footer = page.locator('footer');
    await expect(footer.locator('img')).toHaveCount(1);
    const footerLinks = footer.locator('a');
    await expect(footerLinks).toHaveCount(1);
    await expect(footerLinks.first()).toHaveText('개인정보처리방침');
  }

  // T6: /privacy/ 와 /terms/
  test('T6: /privacy/ 와 /terms/ 직접 접근 200, h1 존재, 헤더·푸터 규칙 동일', async ({ page }) => {
    // /privacy/
    const resPrivacy = await page.goto('/privacy/');
    expect(resPrivacy?.status()).toBe(200);
    await expect(page.locator('h1')).toBeVisible();
    await verifyHeaderAndFooter(page);

    // /terms/
    const resTerms = await page.goto('/terms/');
    expect(resTerms?.status()).toBe(200);
    await expect(page.locator('h1')).toBeVisible();
    await verifyHeaderAndFooter(page);
  });

  // T7: 닫힌 URL HTTP 404 및 404 화면 확인 (1440만 실행)
  test('T7: 닫힌 URL HTTP 404 및 404 화면 확인', async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== '1440', '1440 viewport only');

    const closedUrls = [
      '/about/',
      '/enterprise-data/',
      '/consulting/e-discovery/',
      '/consulting/internal-control/',
      '/consulting/exchange-archive/',
      '/consulting/ai-transformation/',
      '/consulting/ai-consulting/',
      '/ai-services/',
      '/ai-services/mom-ie/',
      '/solutions/',
      '/solutions/enterprise-vault/',
      '/insights/',
      '/jtbd/e-discovery/',
      '/services/e-discovery/',
    ];

    for (const url of closedUrls) {
      const response = await page.goto(url);
      expect(response?.status(), `Status for ${url} should be 404`).toBe(404);

      // 리다이렉트 없음 확인 (현재 url 에 해당 경로 포함)
      expect(page.url()).toContain(url);

      // 404 화면("페이지를 찾을 수 없습니다.") 확인
      await expect(page.locator('body')).toContainText('페이지를 찾을 수 없습니다.');
    }
  });

  // T8: sitemap.xml, robots.txt, llms.txt (1440만 실행)
  test('T8: sitemap.xml, robots.txt, llms.txt 검증', async ({ request }, testInfo) => {
    test.skip(testInfo.project.name !== '1440', '1440 viewport only');

    // /sitemap.xml
    const sitemapRes = await request.get('/sitemap.xml');
    expect(sitemapRes.status()).toBe(200);
    const sitemapText = await sitemapRes.text();
    const locMatches = [...sitemapText.matchAll(/<loc>(.*?)<\/loc>/g)].map((m) => m[1]);

    const expectedLocs = [
      'https://www.humease.com/',
      'https://www.humease.com/contact/',
      'https://www.humease.com/privacy/',
      'https://www.humease.com/terms/',
    ].sort();
    expect(locMatches.sort()).toEqual(expectedLocs);

    // /robots.txt
    const robotsRes = await request.get('/robots.txt');
    expect(robotsRes.status()).toBe(200);
    const robotsText = await robotsRes.text();
    expect(robotsText).toContain('Disallow: /admin');
    expect(robotsText).toContain('Sitemap: https://www.humease.com/sitemap.xml');

    // /llms.txt
    const llmsRes = await request.get('/llms.txt');
    expect(llmsRes.status()).toBe(200);
    const llmsText = await llmsRes.text();

    // about·solutions·ai-services URL 없음
    expect(llmsText).not.toMatch(/https?:\/\/[^\s]*\/about/i);
    expect(llmsText).not.toMatch(/https?:\/\/[^\s]*\/solutions/i);
    expect(llmsText).not.toMatch(/https?:\/\/[^\s]*\/ai-services/i);
  });

  // T9: /admin/ 비로그인 접근 검증 (1440만 실행)
  test('T9: /admin/ 비로그인 접근 시 로그인 화면 노출 및 관리자 데이터 비노출', async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== '1440', '1440 viewport only');

    await page.goto('/admin/');

    // 로그인 화면(/admin/login/)으로 가거나 로그인 UI 가 보이고 관리자 데이터가 노출되지 않는다.
    const isLoginUrl = page.url().includes('/admin/login');
    const loginHeading = page.getByRole('heading', { name: '관리자 로그인' });

    if (!isLoginUrl) {
      // 클라이언트 측 인증 상태 확인 후 로그인 UI가 노출될 때까지 auto-wait
      await expect(loginHeading).toBeVisible();
      await expect(page.getByRole('button', { name: /로그인/ })).toBeVisible();
    }

    // 관리자 데이터 비노출 확인 (관리자 테이블, 통계 등 노출 없음)
    await expect(page.locator('table')).toHaveCount(0);

    // 로그인 버튼은 누르지 않는다.
  });
});
