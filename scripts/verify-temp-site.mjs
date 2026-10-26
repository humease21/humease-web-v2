/**
 * 임시 축소 운영(src/content/site-mode.ts) 공개 구조 검사.
 *
 * 1) 산출물에 임시 공개 경로·관리자 외의 HTML 페이지가 없다(닫힌 상세·별칭 페이지 비노출)
 * 2) 홈은 회사소개 5개 섹션을 정해진 순서와 승인 카피로 담는다. 브레드크럼 없음
 * 3) 헤더는 로고(→ /)만, 푸터는 로고 + 개인정보처리방침 링크만 둔다
 * 4) 문의 폼·동의 UI 에서 개인정보처리방침·이용약관을 열람할 수 있다
 * 5) 공개 HTML 의 내부 링크가 전부 산출물에 존재하는 경로를 가리킨다(닫힌 페이지로 가는 링크 없음)
 * 6) 운영 사이트맵은 임시 공개 경로와 정확히 일치한다
 */
import { readFile, readdir, access } from 'node:fs/promises';
import path from 'node:path';
import { TEMP_SITE, TEMP_PUBLIC_PATHS } from '../src/content/site-mode.ts';
import { staticPublicRoutes as fullSiteStaticRoutes } from '../src/content/navigation.ts';
import { aliases } from '../src/content/aliases.ts';
import { projects } from '../src/content/portfolio.ts';
import { products } from '../src/content/solutions.ts';

if (!TEMP_SITE) { console.log('SKIP  임시 축소 운영 모드가 아니다'); process.exit(0); }

const OUT = path.join(process.cwd(), 'out');
const BASE = process.env.NEXT_PUBLIC_BASE_PATH ?? '';
const indexing = process.env.NEXT_PUBLIC_SITE_DEPLOY_TARGET === 'production'
  && process.env.NEXT_PUBLIC_SEARCH_INDEXING_ENABLED === 'true';
const fails = [];

const norm = (s) => s.replace(/\s+/g, ' ').trim();
const decode = (s) => s.replace(/&quot;/g, '"').replace(/&amp;/g, '&')
  .replace(/&#x27;|&#39;/g, "'").replace(/&nbsp;/g, ' ').replace(/&lt;/g, '<').replace(/&gt;/g, '>');
const text = (h) => norm(decode(h.replace(/<script[\s\S]*?<\/script>|<style[\s\S]*?<\/style>/g, ' ').replace(/<[^>]+>/g, ' ')));
const fileOf = (r) => path.join(OUT, r === '/' ? 'index.html' : `${r.replace(/^\//, '')}/index.html`);
const exists = async (p) => { try { await access(p); return true; } catch { return false; } };

// ── 1) 산출물 HTML 페이지 전수 — 허용 목록 밖은 전부 실패 ─────────────────
const htmlFiles = [];
const walk = async (d) => {
  for (const e of await readdir(d, { withFileTypes: true })) {
    const p = path.join(d, e.name);
    if (e.isDirectory()) { if (e.name !== '_next') await walk(p); }
    else if (e.name.endsWith('.html')) htmlFiles.push(path.relative(OUT, p).split(path.sep).join('/'));
  }
};
await walk(OUT);
const allowed = new Set([...TEMP_PUBLIC_PATHS.map((r) => path.relative(OUT, fileOf(r)).split(path.sep).join('/')), '404.html']);
const isAllowed = (rel) => allowed.has(rel) || rel.startsWith('admin/') || rel.startsWith('_not-found/') || rel.startsWith('404/');
for (const rel of htmlFiles) if (!isAllowed(rel)) fails.push(`공개 범위 밖 HTML 이 산출물에 있음: ${rel}`);

// 닫힌 경로를 명시적으로도 확인한다 — 디렉터리·RSC 페이로드(.txt)까지 없어야 한다
const closed = [
  ...fullSiteStaticRoutes.filter((r) => !TEMP_PUBLIC_PATHS.includes(r)),
  ...projects.map((p) => `/ai-services/${p.slug}`),
  ...products.map((p) => `/solutions/${p.slug}`),
  ...aliases.map((a) => a.from),
];
for (const r of closed) {
  const seg = r.replace(/^\//, '');
  for (const p of [path.join(OUT, seg), path.join(OUT, `${seg}.html`), path.join(OUT, `${seg}.txt`)]) {
    if (await exists(p)) fails.push(`닫힌 경로 산출물 잔존: ${path.relative(OUT, p)}`);
  }
}

// ── 2) 홈 5개 섹션 ───────────────────────────────────────────────────────
const home = await readFile(fileOf('/'), 'utf8');
const main = home.match(/<main[\s\S]*?<\/main>/)?.[0] ?? '';
const homeText = text(main);
const SECTIONS = [
  ['휴미즈 소개', 'Enterprise IT에서, AX까지', '20년 이상의 기업 IT 경험을 바탕으로 데이터 거버넌스와 AI를 실제 비즈니스 환경에 연결합니다', '프로젝트 문의'],
  ['관점', '기술보다 먼저, 문제의 본질', '기업의 IT 환경에는 데이터뿐 아니라 업무 방식, 보안 정책, 기존 시스템과 운영 제약이 함께 존재합니다', '휴미즈는 현재 환경을 먼저 이해한 뒤 필요한 기술과 실행 순서를 설계합니다'],
  ['연결', '데이터 기반에서, AI 활용으로', '기업 데이터와 AI는 분리된 영역이 아닙니다', '신뢰할 수 있는 데이터 기반 위에서 AI가 실제 업무와 서비스에 활용될 수 있도록 연결합니다'],
  ['우리가 일하는 방식', '이해 · 설계 · 구현 · 검증', '이해', '환경과 문제 정의', '설계', '데이터·업무·기술 연결', '구현', '실제 서비스 개발', '검증', '사용과 운영을 통한 개선'],
  ['문의', '데이터와 AI, 다음 단계로', '현재 환경과 해결해야 할 문제를 알려주세요', '필요한 기술과 실행 방향을 함께 검토합니다', '프로젝트 문의', 'contact@humease.com'],
];
let cursor = 0;
for (const [i, sec] of SECTIONS.entries()) {
  for (const c of sec) {
    const at = homeText.indexOf(c, cursor);
    if (at < 0) { fails.push(`홈 섹션 ${i + 1} 카피 누락 또는 순서 어긋남: ${c}`); continue; }
    cursor = at + c.length;
  }
}
if ((main.match(/<section\b/g) ?? []).length !== 5) fails.push(`홈 <section> 이 ${(main.match(/<section\b/g) ?? []).length}개 — 5개여야 한다`);
if (/aria-label="현재 위치"/.test(home)) fails.push('홈에 브레드크럼이 남아 있음');
if (!new RegExp(`href="${BASE}/contact/?"`).test(main)) fails.push('홈 프로젝트 문의 CTA 가 /contact 로 연결되지 않음');
if (!/href="mailto:contact@humease\.com"/.test(main)) fails.push('홈 이메일 CTA 누락');

// ── 3) 헤더·푸터 — 모든 공개 페이지 ─────────────────────────────────────
const publicPages = [...TEMP_PUBLIC_PATHS.map((r) => [r, fileOf(r)]), ['404', path.join(OUT, '404.html')]];
for (const [r, f] of publicPages) {
  const h = await readFile(f, 'utf8');
  const header = h.match(/<header[\s\S]*?<\/header>/)?.[0];
  const footer = h.match(/<footer[\s\S]*?<\/footer>/)?.[0];
  if (!header) { fails.push(`${r} 헤더 없음`); continue; }
  const hLinks = [...header.matchAll(/<a\b[^>]*href="([^"]*)"/g)].map((m) => m[1]);
  if (hLinks.length !== 1 || hLinks[0].replace(BASE, '') !== '/') fails.push(`${r} 헤더 링크가 로고(/) 하나가 아님: ${hLinks.join(', ')}`);
  if (/<nav\b|<button\b/.test(header)) fails.push(`${r} 헤더에 메뉴·버튼이 남아 있음`);
  if ((header.match(/<img\b/g) ?? []).length !== 1) fails.push(`${r} 헤더 로고 이미지 수 이상`);
  if (text(header) !== '') fails.push(`${r} 헤더에 로고 외 텍스트: ${text(header)}`);
  if (!footer) { fails.push(`${r} 푸터 없음`); continue; }
  const fLinks = [...footer.matchAll(/<a\b[^>]*href="([^"]*)"/g)].map((m) => m[1].replace(BASE, ''));
  if (fLinks.length !== 1 || !/^\/privacy\/?$/.test(fLinks[0])) fails.push(`${r} 푸터 링크가 개인정보처리방침 하나가 아님: ${fLinks.join(', ')}`);
  if (text(footer) !== '개인정보처리방침') fails.push(`${r} 푸터에 로고·처리방침 외 텍스트: ${text(footer)}`);
  if ((footer.match(/<img\b/g) ?? []).length !== 1) fails.push(`${r} 푸터 로고 이미지 수 이상`);
}

// ── 4) 문의 폼·동의 UI ───────────────────────────────────────────────────
const contact = await readFile(fileOf('/contact'), 'utf8');
for (const n of ['company_name', 'contact_name', 'email', 'message', 'privacy_consent', 'website']) {
  if (!new RegExp(`name="${n}"`).test(contact)) fails.push(`문의 폼 필드 누락: ${n}`);
}
const form = contact.match(/<form[\s\S]*?<\/form>/)?.[0] ?? '';
if (!new RegExp(`href="${BASE}/privacy/?"`).test(form)) fails.push('문의 동의 영역에 개인정보처리방침 링크 없음(basePath 포함)');
if (!new RegExp(`href="${BASE}/terms/?"`).test(form)) fails.push('문의 동의 영역에 이용약관 링크 없음(basePath 포함)');
if (/aria-label="현재 위치"/.test(contact)) fails.push('문의 페이지에 브레드크럼이 남아 있음');

// ── 5) 내부 링크 무결성 — 공개 페이지에서 닫힌 페이지로 가는 링크가 없어야 한다 ──
for (const [r, f] of publicPages) {
  const h = await readFile(f, 'utf8');
  const body = h.replace(/<head[\s\S]*?<\/head>/, '');
  for (const m of body.matchAll(/<a\b[^>]*href="([^"#?]*)[^"]*"/g)) {
    let u = m[1];
    if (!u.startsWith('/') || u.startsWith('//')) continue;
    // basePath 환경에서 접두사 없는 내부 링크는 호스트 루트로 이탈한다
    if (BASE && u !== BASE && !u.startsWith(`${BASE}/`)) { fails.push(`${r} 의 내부 링크에 basePath 누락: ${m[1]}`); continue; }
    if (BASE) u = u.slice(BASE.length) || '/';
    const target = u === '/' ? path.join(OUT, 'index.html') : path.join(OUT, u.replace(/^\//, ''), u.endsWith('/') ? 'index.html' : '');
    const ok = await exists(target) || await exists(path.join(OUT, u.replace(/^\//, ''), 'index.html'));
    if (!ok) fails.push(`${r} 의 링크가 없는 경로를 가리킴: ${m[1]}`);
  }
}

// ── 6) 사이트맵 ─────────────────────────────────────────────────────────
const sitemap = await readFile(path.join(OUT, 'sitemap.xml'), 'utf8');
const locs = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]).sort();
if (indexing) {
  const want = TEMP_PUBLIC_PATHS.map((r) => `https://www.humease.com${r === '/' ? '/' : `${r}/`}`).sort();
  if (JSON.stringify(locs) !== JSON.stringify(want)) fails.push(`운영 사이트맵 불일치\n      기대: ${want.join(' ')}\n      실제: ${locs.join(' ')}`);
} else if (locs.length) fails.push(`검증본 사이트맵에 URL ${locs.length}건`);

if (fails.length) { console.error(`FAIL  임시 공개 구조 ${fails.length}건:\n  ` + fails.slice(0, 30).join('\n  ')); process.exit(1); }
console.log(`PASS  임시 공개 구조 — HTML ${htmlFiles.length}개(공개 ${TEMP_PUBLIC_PATHS.length} + 404 + 관리자) · 닫힌 경로 ${closed.length}개 부재 · 홈 5개 섹션 · 헤더/푸터 로고 전용 · 동의 UI 법률 링크 · 내부 링크 무결 · 사이트맵 ${locs.length}건`);
