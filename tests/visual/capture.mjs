/**
 * 공개 페이지 전체를 PC·태블릿·모바일로 캡처하고 기본 결함을 수집한다.
 * 사용: node tests/visual/capture.mjs <baseUrl> <outDir>
 * 정적 out/ 을 띄운 서버를 대상으로 한다. 문의 제출은 하지 않는다.
 */
import { chromium } from 'playwright';
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { ROUTES } from './routes.mjs';

const BASE = (process.argv[2] ?? 'http://localhost:4300').replace(/\/$/, '');
const OUT = process.argv[3] ?? 'shots';


const VIEWPORTS = [
  { name: 'pc', width: 1440, height: 900 },
  { name: 'tablet', width: 834, height: 1112 },
  { name: 'mobile', width: 390, height: 844 },
];

const slug = (r) => (r === '/' ? 'home' : r.replace(/^\/|\/$/g, '').replace(/\//g, '__'));

await mkdir(OUT, { recursive: true });
const browser = await chromium.launch();
const report = [];

for (const vp of VIEWPORTS) {
  const ctx = await browser.newContext({ viewport: { width: vp.width, height: vp.height }, reducedMotion: 'reduce' });
  for (const route of ROUTES) {
    const page = await ctx.newPage();
    const consoleErrors = [];
    const failed = [];
    page.on('console', (m) => { if (m.type() === 'error') consoleErrors.push(m.text()); });
    page.on('pageerror', (e) => consoleErrors.push(String(e)));
    page.on('response', (r) => { if (r.status() >= 400 && r.url().startsWith(BASE)) failed.push(`${r.status()} ${r.url()}`); });
    const res = await page.goto(BASE + route, { waitUntil: 'networkidle' });
    // reveal 요소가 전부 보이도록 끝까지 스크롤
    await page.evaluate(async () => {
      for (let y = 0; y < document.body.scrollHeight; y += 600) { window.scrollTo(0, y); await new Promise((r) => setTimeout(r, 40)); }
      window.scrollTo(0, 0);
    });
    await page.waitForTimeout(300);
    const info = await page.evaluate(() => {
      const docW = document.documentElement.scrollWidth;
      const vw = window.innerWidth;
      const broken = [...document.images].filter((i) => i.complete && i.naturalWidth === 0).map((i) => i.currentSrc || i.src);
      const small = [...document.querySelectorAll('p, li, a, span, dd, dt, label, button')]
        .filter((el) => el.offsetParent && el.textContent.trim() && el.children.length === 0)
        .filter((el) => parseFloat(getComputedStyle(el).fontSize) < 12).length;
      const tapTargets = [...document.querySelectorAll('a, button')]
        .filter((el) => el.offsetParent).filter((el) => { const r = el.getBoundingClientRect(); return r.height > 0 && r.height < 24; }).length;
      const h1 = document.querySelectorAll('h1').length;
      return { horizontalOverflow: docW > vw + 1, docW, broken, smallText: small, smallTapTargets: tapTargets, h1 };
    });
    const file = path.join(OUT, `${vp.name}--${slug(route)}.png`);
    await page.screenshot({ path: file, fullPage: true });
    report.push({ viewport: vp.name, route, status: res?.status(), consoleErrors, failed, ...info, file });
    await page.close();
  }
  await ctx.close();
}
await browser.close();
await writeFile(path.join(OUT, 'report.json'), JSON.stringify(report, null, 2));
const issues = report.filter((r) => r.status !== 200 || r.consoleErrors.length || r.failed.length || r.horizontalOverflow || r.broken.length || r.h1 !== 1);
console.log(`captured ${report.length} shots; pages with issues: ${issues.length}`);
for (const i of issues) console.log(JSON.stringify({ vp: i.viewport, route: i.route, status: i.status, err: i.consoleErrors.slice(0, 2), failed: i.failed.slice(0, 3), overflow: i.horizontalOverflow, broken: i.broken, h1: i.h1 }));
