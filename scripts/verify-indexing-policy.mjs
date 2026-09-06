/**
 * 환경·robots·sitemap·색인 정책 검사. (요청서 §4, §10, §11, §15)
 * preview 와 production 산출물의 계약이 서로 다르므로 대상별로 다르게 검사한다.
 */
import { readFile, readdir, access } from 'node:fs/promises';
import path from 'node:path';

const OUT = path.join(process.cwd(), 'out');
const target = process.env.NEXT_PUBLIC_SITE_DEPLOY_TARGET === 'production' ? 'production' : 'preview';
const indexing = target === 'production' && process.env.NEXT_PUBLIC_SEARCH_INDEXING_ENABLED === 'true';
const fails = [];

const htmlFiles = [];
const walk = async (d) => {
  for (const e of await readdir(d, { withFileTypes: true })) {
    const p = path.join(d, e.name);
    if (e.isDirectory()) await walk(p);
    else if (e.name.endsWith('.html')) htmlFiles.push(p);
  }
};
await walk(OUT);

const sitemap = await readFile(path.join(OUT, 'sitemap.xml'), 'utf8');
const robots = await readFile(path.join(OUT, 'robots.txt'), 'utf8');
const locs = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);

if (!indexing) {
  // 검증본 계약
  if (locs.length) fails.push(`검증본 사이트맵에 URL ${locs.length}건 — 0이어야 한다`);
  if (/Disallow:\s*\/\s*$/m.test(robots)) fails.push('검증본이 크롤링을 전면 차단 — noindex 를 읽지 못한다');
  if (/Sitemap:/i.test(robots)) fails.push('검증본 robots 가 사이트맵을 노출');
  for (const f of htmlFiles) {
    const h = await readFile(f, 'utf8');
    const rel = path.relative(OUT, f);
    if (!/name="robots"[^>]*content="[^"]*noindex/.test(h)) fails.push(`${rel} noindex 없음`);
    // 별칭 페이지는 최종 경로를 가리키는 canonical 을 의도적으로 낸다.
    const isAlias = rel.startsWith('jtbd') || rel.startsWith('services') || rel.includes('ai-consulting');
    if (/rel="canonical"/.test(h) && !isAlias) fails.push(`${rel} 검증본에 canonical 출력됨`);
    if (/application\/ld\+json/.test(h)) fails.push(`${rel} 검증본에 JSON-LD 출력됨`);
  }
} else {
  // 운영 계약
  if (!locs.length) fails.push('운영 사이트맵이 비어 있음');
  for (const u of locs) {
    if (!u.startsWith('https://www.humease.com/')) fails.push(`사이트맵 비운영 호스트: ${u}`);
    if (/[?#]/.test(u)) fails.push(`사이트맵 쿼리·fragment 포함: ${u}`);
    if (u.includes('humease-web-v2')) fails.push(`사이트맵에 basePath 유입: ${u}`);
    if (!u.endsWith('/')) fails.push(`사이트맵 HTML URL 슬래시 누락: ${u}`);
  }
  if (new Set(locs).size !== locs.length) fails.push('사이트맵 중복 URL');
  // 별칭·리다이렉트는 사이트맵에 없어야 한다
  for (const u of locs) {
    if (/\/(jtbd|services)\//.test(u) || u.includes('ai-consulting')) fails.push(`사이트맵에 별칭 포함: ${u}`);
  }
  if (!/Sitemap:\s*https:\/\/www\.humease\.com\/sitemap\.xml/.test(robots)) fails.push('운영 robots 에 사이트맵 없음');
  // 색인 대상 HTML 은 canonical 정확히 1개 + index
  // 별칭·404·not-found 는 색인 대상이 아니다.
  const skip = (rel) => rel.startsWith('jtbd') || rel.startsWith('services')
    || rel.includes('ai-consulting') || rel.startsWith('404') || rel.includes('_not-found');
  for (const f of htmlFiles) {
    const rel = path.relative(OUT, f);
    if (skip(rel)) continue;
    const h = await readFile(f, 'utf8');
    const c = [...h.matchAll(/rel="canonical"\s+href="([^"]+)"/g)].map((m) => m[1]);
    if (c.length !== 1) fails.push(`${rel} canonical ${c.length}개 — 정확히 1개여야 한다`);
    else if (c[0].includes('humease-web-v2') || /[?#]/.test(c[0])) fails.push(`${rel} canonical 오염: ${c[0]}`);
    if (!/name="robots"[^>]*content="index/.test(h)) fails.push(`${rel} index 아님`);
  }
}

// 공통: 학습 봇 정책을 임의로 차단하지 않았는지
if (/User-Agent:\s*GPTBot[\s\S]{0,40}Disallow:\s*\//i.test(robots)) {
  fails.push('학습 봇 정책이 차단으로 변경됨 — 기존 정책 보존 위반');
}

if (fails.length) { console.error(`FAIL  [${target}] ${fails.length}건:\n  ` + fails.slice(0, 12).join('\n  ')); process.exit(1); }
console.log(`PASS  [${target}] 색인 정책 — robots·sitemap·canonical·noindex 계약 일치 (HTML ${htmlFiles.length}개)`);
