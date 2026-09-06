/**
 * docs/08 필수 테스트 자동 검수.
 * 대상은 production build(배포된 GitHub Pages).
 */
import { chromium, devices } from 'playwright';
import { AxeBuilder } from '@axe-core/playwright';
import { writeFile, mkdir } from 'node:fs/promises';

const BASE = process.env.AUDIT_BASE ?? 'https://humease21.github.io/humease-web-v2';
const ROUTES = ['/', '/about/', '/enterprise-data/', '/consulting/e-discovery/',
  '/consulting/internal-control/', '/consulting/exchange-archive/',
  '/consulting/ai-transformation/', '/ai-services/', '/ai-services/mom-ie/',
  '/solutions/', '/contact/', '/insights/'];
const EV = 'docs/reports/evidence';
const results = [];
const add = (id, name, status, detail) => results.push({ id, name, status, detail });

const browser = await chromium.launch();
await mkdir(EV, { recursive: true });

// ---------- S01 메타데이터 / U02 첫 화면 / I04 이미지 ----------
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
const page = await ctx.newPage();
const metaIssues = [], imgIssues = [], linkIssues = [];
const titles = new Set(), canonicals = new Set();

for (const route of ROUTES) {
  const res = await page.goto(BASE + route, { waitUntil: 'networkidle' });
  if (res.status() !== 200) { metaIssues.push(`${route} HTTP ${res.status()}`); continue; }

  const d = await page.evaluate(() => ({
    h1: [...document.querySelectorAll('h1')].map((e) => e.textContent.trim()),
    title: document.title,
    desc: document.querySelector('meta[name="description"]')?.content ?? null,
    canonical: document.querySelector('link[rel="canonical"]')?.href ?? null,
    og: document.querySelector('meta[property="og:title"]')?.content ?? null,
    lang: document.documentElement.lang,
    imgs: [...document.querySelectorAll('img')].map((i) => ({
      src: i.getAttribute('src'), alt: i.getAttribute('alt'),
      w: i.getAttribute('width'), h: i.getAttribute('height'),
    })),
    links: [...document.querySelectorAll('a[href]')].map((a) => a.getAttribute('href')),
  }));

  if (d.h1.length !== 1) metaIssues.push(`${route} H1 ${d.h1.length}개`);
  if (!d.title) metaIssues.push(`${route} title 없음`);
  if (!d.desc) metaIssues.push(`${route} description 없음`);
  if (!d.canonical) metaIssues.push(`${route} canonical 없음`);
  if (!d.og) metaIssues.push(`${route} og:title 없음`);
  if (d.lang !== 'ko') metaIssues.push(`${route} lang=${d.lang}`);
  titles.add(d.title); canonicals.add(d.canonical);

  for (const i of d.imgs) {
    if (i.alt === null) imgIssues.push(`${route} alt 속성 없음 ${i.src}`);
    if (!i.w || !i.h) imgIssues.push(`${route} 크기 미지정 ${i.src}`);
  }
  for (const h of d.links) {
    if (h === '#' || h === '') linkIssues.push(`${route} 빈 링크`);
    if (/^(javascript|data):/i.test(h)) linkIssues.push(`${route} unsafe ${h}`);
  }
}

add('S01', 'HTML/메타 (H1 1개·title·description·canonical·OG·lang)',
  metaIssues.length ? 'FAIL' : 'PASS', metaIssues.join('; ') || `${ROUTES.length}개 페이지 정상`);
add('S01b', 'title·canonical 페이지별 고유',
  titles.size === ROUTES.length && canonicals.size === ROUTES.length ? 'PASS' : 'FAIL',
  `title ${titles.size}종 / canonical ${canonicals.size}종 (기대 ${ROUTES.length})`);
add('I04', '이미지 dimensions·alt',
  imgIssues.length ? 'FAIL' : 'PASS', imgIssues.join('; ') || '전 이미지 width/height/alt 지정');
add('R04', '빈 # CTA·unsafe scheme',
  linkIssues.length ? 'FAIL' : 'PASS', linkIssues.join('; ') || '없음');

// ---------- U03 반응형 가로 넘침 ----------
const overflow = [];
for (const w of [320, 390, 768, 1280, 1440]) {
  await page.setViewportSize({ width: w, height: 900 });
  for (const route of ROUTES) {
    await page.goto(BASE + route, { waitUntil: 'networkidle' });
    const over = await page.evaluate(() =>
      document.documentElement.scrollWidth > document.documentElement.clientWidth + 1);
    if (over) overflow.push(`${w}px ${route}`);
  }
}
add('U03', '반응형 가로 넘침 (320·390·768·1280·1440)',
  overflow.length ? 'FAIL' : 'PASS', overflow.join('; ') || '5개 뷰포트 × 12페이지 넘침 없음');

// ---------- U04 모바일 메뉴 키보드·Escape ----------
const mCtx = await browser.newContext({ ...devices['Pixel 7'] });
const m = await mCtx.newPage();
await m.goto(BASE + '/', { waitUntil: 'networkidle' });
const trigger = m.locator('button[aria-controls="mobile-menu"]');
const tag = await trigger.evaluate((e) => e.tagName);
await trigger.click();
const openState = await trigger.getAttribute('aria-expanded');
const visible = await m.locator('#mobile-menu').isVisible();
await m.keyboard.press('Escape');
await m.waitForTimeout(200);
const closed = (await trigger.getAttribute('aria-expanded')) === 'false';
const focusBack = await m.evaluate(() => document.activeElement?.getAttribute('aria-controls') === 'mobile-menu');
add('U04', '모바일 메뉴 (button·aria-expanded·Escape·focus 복귀)',
  tag === 'BUTTON' && openState === 'true' && visible && closed && focusBack ? 'PASS' : 'FAIL',
  `tag=${tag} open=${openState} visible=${visible} escape닫힘=${closed} focus복귀=${focusBack}`);

// ---------- I03 모바일에서 desktop Hero 미요청 ----------
const reqs = [];
const m2Ctx = await browser.newContext({ ...devices['Pixel 7'] });
const m2 = await m2Ctx.newPage();
m2.on('request', (r) => { if (r.resourceType() === 'image') reqs.push(r.url()); });
await m2.goto(BASE + '/', { waitUntil: 'networkidle' });
const gotDesktop = reqs.some((u) => u.includes('a01-home-hero-desktop'));
const gotMobile = reqs.some((u) => u.includes('a02-home-hero-mobile'));
add('I03', '모바일 Hero 중복 요청',
  gotMobile && !gotDesktop ? 'PASS' : 'FAIL',
  `mobile=${gotMobile} desktop=${gotDesktop} (요청 이미지 ${reqs.length}건)`);

// ---------- A01/A03 접근성 (axe) ----------
const a11y = [];
for (const route of ['/', '/contact/', '/ai-services/mom-ie/', '/insights/']) {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto(BASE + route, { waitUntil: 'networkidle' });
  const r = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze();
  for (const v of r.violations) a11y.push(`${route} [${v.impact}] ${v.id} ×${v.nodes.length}`);
}
add('A01', '접근성 axe (WCAG 2.1 AA)',
  a11y.length ? 'FAIL' : 'PASS', a11y.join('; ') || '4개 대표 페이지 위반 0건');

// ---------- A01 skip link ----------
await page.goto(BASE + '/', { waitUntil: 'networkidle' });
await page.keyboard.press('Tab');
const skip = await page.evaluate(() => {
  const el = document.activeElement;
  return { text: el?.textContent?.trim(), href: el?.getAttribute('href') };
});
add('A01b', 'skip link 최초 Tab 노출',
  skip.href === '#main' ? 'PASS' : 'FAIL', `첫 Tab → "${skip.text}" (${skip.href})`);

// ---------- A02 200% 확대 ----------
await page.setViewportSize({ width: 640, height: 900 });
await page.goto(BASE + '/', { waitUntil: 'networkidle' });
const zoomOver = await page.evaluate(() =>
  document.documentElement.scrollWidth > document.documentElement.clientWidth + 1);
add('A02', '200% 확대 상당(640px) 가로 넘침',
  zoomOver ? 'FAIL' : 'PASS', zoomOver ? '가로 스크롤 발생' : '넘침 없음');

// ---------- P01 비밀 노출 ----------
const bodies = [];
const p3Ctx = await browser.newContext();
const p3 = await p3Ctx.newPage();
p3.on('response', async (r) => {
  if (r.url().endsWith('.js')) { try { bodies.push(await r.text()); } catch {} }
});
await p3.goto(BASE + '/', { waitUntil: 'networkidle' });
const html = await p3.content();
const hay = bodies.join('\n') + html;
const leaks = [];
if (/service_role/i.test(hay)) leaks.push('service_role 문자열');
if (/eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9/.test(hay)) leaks.push('JWT');
if (/github_pat_|ghp_|gho_/.test(hay)) leaks.push('GitHub 토큰');
if (/discord\.com\/api\/webhooks/.test(hay)) leaks.push('Discord webhook');
add('P01', '클라이언트 번들 비밀 노출',
  leaks.length ? 'FAIL' : 'PASS', leaks.join(', ') || `JS ${bodies.length}개 + HTML 검사, 노출 0`);

// ---------- B02 스택 ----------
add('B02', 'Vite/React Router/SPA 프리렌더 미사용',
  /vite|react-router/i.test(hay) ? 'FAIL' : 'PASS',
  /vite|react-router/i.test(hay) ? '잔재 발견' : '번들에 흔적 없음');

// ---------- 시각 증거 ----------
for (const [w, h, label] of [[1440, 900, 'desktop'], [390, 844, 'mobile']]) {
  const sCtx = await browser.newContext({ viewport: { width: w, height: h } });
  const s = await sCtx.newPage();
  for (const [route, name] of [['/', 'home'], ['/ai-services/mom-ie/', 'momieum'], ['/contact/', 'contact']]) {
    await s.goto(BASE + route, { waitUntil: 'networkidle' });
    await s.screenshot({ path: `${EV}/${label}-${w}-${name}.png`, fullPage: name === 'home' });
  }
  await sCtx.close();
}

await browser.close();
await writeFile(`${EV}/audit-results.json`, JSON.stringify(results, null, 2));

const w = { PASS: 0, FAIL: 0 };
for (const r of results) { w[r.status] = (w[r.status] ?? 0) + 1; console.log(`${r.status.padEnd(5)} ${r.id.padEnd(5)} ${r.name}\n      ${r.detail}`); }
console.log(`\n== PASS ${w.PASS} / FAIL ${w.FAIL} ==`);
