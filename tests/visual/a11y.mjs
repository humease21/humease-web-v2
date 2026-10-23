/**
 * axe-core 접근성 스캔 — 공개 페이지 전체, PC·모바일.
 * 사용: node tests/visual/a11y.mjs <baseUrl>
 */
import { chromium } from 'playwright';
import { AxeBuilder } from '@axe-core/playwright';
import { ROUTES } from './routes.mjs';

const BASE = (process.argv[2] ?? 'http://localhost:4300').replace(/\/$/, '');
const browser = await chromium.launch();
let total = 0;
for (const vp of [{ name: 'pc', width: 1440, height: 900 }, { name: 'mobile', width: 390, height: 844 }]) {
  const ctx = await browser.newContext({ viewport: { width: vp.width, height: vp.height }, reducedMotion: 'reduce' });
  for (const route of ROUTES) {
    const page = await ctx.newPage();
    await page.goto(BASE + route, { waitUntil: 'networkidle' });
    const r = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa']).analyze();
    for (const v of r.violations) {
      total++;
      console.log(`[${vp.name}] ${route} ${v.impact} ${v.id} — ${v.help} (${v.nodes.length}) e.g. ${v.nodes[0]?.target?.join(' ')}`);
    }
    await page.close();
  }
  await ctx.close();
}
await browser.close();
console.log(`axe violations: ${total}`);
process.exit(total ? 1 : 0);
