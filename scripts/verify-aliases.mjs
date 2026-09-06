/**
 * 별칭 정적 이동 페이지 검증.
 * 정적 Export 이므로 HTTP 301 이 아니라 200 이다. 그 사실까지 확인한다.
 */
import { readFile, access } from 'node:fs/promises';
import path from 'node:path';
import { aliases } from '../src/content/aliases.ts';

const OUT = path.join(process.cwd(), 'out');
const company = 'https://www.humease.com';
const fails = [];
const sitemap = await readFile(path.join(OUT, 'sitemap.xml'), 'utf8');

for (const a of aliases) {
  const file = path.join(OUT, a.from.replace(/^\//, ''), 'index.html');
  try { await access(file); } catch { fails.push(`${a.from} HTML 미생성`); continue; }
  const h = await readFile(file, 'utf8');

  // 1) meta refresh 가 최종 경로를 가리키는가
  const refresh = h.match(/http-equiv="refresh"[^>]*content="0;\s*url=([^"]+)"/i)?.[1];
  if (!refresh) fails.push(`${a.from} meta refresh 없음`);
  else if (!refresh.endsWith(`${a.to}/`)) fails.push(`${a.from} refresh 대상 불일치: ${refresh}`);

  // 2) canonical 이 최종 경로(운영 도메인)를 가리키는가
  const canonical = h.match(/rel="canonical"\s+href="([^"]+)"/)?.[1];
  if (!canonical) fails.push(`${a.from} canonical 없음`);
  else if (canonical.replace(/\/$/, '') !== company + a.to) fails.push(`${a.from} canonical 불일치: ${canonical}`);

  // 3) 별칭 자체는 색인하지 않는다
  if (!/name="robots"[^>]*content="[^"]*noindex/.test(h)) fails.push(`${a.from} noindex 없음`);

  // 4) 자동 이동이 실패해도 실제 링크로 갈 수 있어야 한다
  const bp = process.env.NEXT_PUBLIC_BASE_PATH ?? '';
  if (!h.includes(`href="${bp}${a.to}/"`)) fails.push(`${a.from} 실제 링크 없음`);

  // 5) 별칭은 사이트맵에 넣지 않는다
  if (sitemap.includes(`${a.from}<`) || sitemap.includes(`${a.from}/<`)) fails.push(`${a.from} 사이트맵 포함됨`);
}

// 6) 목록에 없는 slug 는 정상 404 여야 한다(HTML 이 생성되지 않아야 한다)
for (const p of ['jtbd/unknown-service', 'services/unknown-service']) {
  try { await access(path.join(OUT, p, 'index.html')); fails.push(`${p} 가 생성됨 — 404 여야 한다`); } catch { /* 정상 */ }
}

if (fails.length) { console.error(`FAIL  ${fails.length}건:\n  ` + fails.join('\n  ')); process.exit(1); }
console.log(`PASS  별칭 ${aliases.length}개 — meta refresh·canonical·noindex·실제링크·사이트맵 제외 확인`);
console.log('      정적 이동이므로 응답은 HTTP 200 이다(301 아님).');
