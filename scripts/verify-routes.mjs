/**
 * docs/04 §2 — 공개 라우트가 정적 산출물로 실제 존재하는지 검사한다.
 * 임시 축소 운영(site-mode.ts) 중에는 임시 공개 경로가 대상이다. 닫힌 경로의 부재는 verify-temp-site.mjs 가 검사한다.
 */
import { access } from 'node:fs/promises';
import path from 'node:path';
import { staticPublicRoutes } from '../src/content/navigation.ts';
import { TEMP_SITE, TEMP_PUBLIC_PATHS } from '../src/content/site-mode.ts';

const publicRoutes = TEMP_SITE ? TEMP_PUBLIC_PATHS : staticPublicRoutes;

const OUT = path.join(process.cwd(), 'out');
const missing = [];
for (const r of publicRoutes) {
  const f = path.join(OUT, r === '/' ? 'index.html' : `${r.replace(/^\//, '')}/index.html`);
  try { await access(f); } catch { missing.push(r); }
}
for (const extra of ['404.html', 'sitemap.xml', 'robots.txt']) {
  try { await access(path.join(OUT, extra)); } catch { missing.push(extra); }
}
if (missing.length) { console.error('FAIL  누락: ' + missing.join(', ')); process.exit(1); }
console.log(`PASS  공개 라우트 ${publicRoutes.length}개 + 404·sitemap·robots 생성 확인`);
