/**
 * 요청서 §10.5 콘텐츠 검증.
 * slug 중복·필수 누락·draft 노출·제품 경로·Capture 표기·파트너 주장·출처 누락을 검사한다.
 */
import { readFile, access } from 'node:fs/promises';
import path from 'node:path';
import { projects, publishedProjects } from '../src/content/portfolio.ts';
import { products } from '../src/content/solutions.ts';

const OUT = path.join(process.cwd(), 'out');
const fails = [];
const html = async (r) => readFile(path.join(OUT, r === '/' ? 'index.html' : `${r.replace(/^\//, '')}/index.html`), 'utf8');

// 1. slug 중복·필수 항목
const slugs = projects.map((p) => p.slug);
if (new Set(slugs).size !== slugs.length) fails.push('프로젝트 slug 중복');
for (const p of publishedProjects()) {
  for (const f of ['name', 'summary', 'currentStageNote', 'reviewedAt']) {
    if (!p[f]) fails.push(`${p.slug} 필수 항목 누락: ${f}`);
  }
  if (!p.sourceRefs.length) fails.push(`${p.slug} sourceRefs 없음`);
  if (p.stage && !p.stageVerifiedAt) fails.push(`${p.slug} stage 는 있는데 확인일 없음`);
  if (p.externalUrl && !p.externalLinkVerifiedAt) fails.push(`${p.slug} 외부링크 확인일 없음`);
}

// 2. draft 가 공개 산출물에 없어야 한다
const drafts = projects.filter((p) => p.publication !== 'published' || !p.publicationApproved);
const sitemap = await readFile(path.join(OUT, 'sitemap.xml'), 'utf8');
for (const d of drafts) {
  if (sitemap.includes(`/ai-services/${d.slug}`)) fails.push(`draft ${d.slug} 가 사이트맵에 있음`);
  try { await access(path.join(OUT, 'ai-services', d.slug, 'index.html')); fails.push(`draft ${d.slug} HTML 생성됨`); } catch { /* 정상 */ }
}

// 3. 제품 4종 경로와 전체 제품명
for (const p of products) {
  let h;
  try { h = await html(`/solutions/${p.slug}`); } catch { fails.push(`제품 경로 없음: /solutions/${p.slug}`); continue; }
  if (!h.includes(p.name)) fails.push(`${p.slug} 전체 제품명 미포함`);
  if (!h.includes('공식 파트너가 아닙니다')) fails.push(`${p.slug} 관계 고지 누락`);
  if (!h.includes('제품 정보 확인일')) fails.push(`${p.slug} 정보 확인일 누락`);
  if (!h.includes(p.officialSource.url)) fails.push(`${p.slug} 공식 출처 링크 누락`);
}

// 4. Capture — H1·title·본문·FAQ 에 Merge1
{
  const h = await html('/solutions/enterprise-vault-capture');
  const h1 = h.match(/<h1[^>]*>(.*?)<\/h1>/s)?.[1]?.replace(/<[^>]+>/g, '') ?? '';
  const title = h.match(/<title>([^<]*)<\/title>/)?.[1] ?? '';
  if (!h1.includes('Merge1')) fails.push('Capture H1 에 Merge1 없음');
  if (!h1.includes('Enterprise Vault Capture')) fails.push('Capture H1 에 현재 제품명 없음');
  if (!title.includes('Merge1')) fails.push('Capture title 에 Merge1 없음');
  if ((title.match(/휴미즈/g) ?? []).length > 1) fails.push('Capture title 브랜드 중복');
  if (!h.includes('기존 Merge1으로 알려진')) fails.push('Capture 첫 문단 누락');
  if (!h.includes('Merge1과 Enterprise Vault Capture는 다른 제품인가요?')) fails.push('Capture FAQ 누락');
  // Merge1 을 단독 제품으로 남긴 별도 페이지가 없어야 한다
  if (products.filter((p) => p.name === 'Merge1').length) fails.push('Merge1 단독 제품 존재');
}

// 5. 미확인 주장 — 부정 고지와 긍정 주장을 구분한다
const PARTNER = /(공식\s*파트너|Official Partner|Authorized Partner|Strategic Partner|공식\s*총판|독점\s*공급)/g;
const SUPERLATIVE = /한국\s*시장\s*유일|국내\s*유일|완벽한\s*규제\s*준수|즉시\s*규제\s*통과|모든\s*데이터\s*완전\s*수집/;
// 부정 고지와 긍정 주장을 구분한다(요청서 §10.5).
const NEGATED = /(아닙니다|아니며|뜻하지\s*않습니다|없습니다|않습니다)/;
for (const r of ['/solutions', '/solutions/enterprise-vault', '/solutions/enterprise-vault-capture',
  '/solutions/data-insight', '/solutions/ediscovery-platform', '/', '/about']) {
  const h = await html(r);
  // Next 의 RSC 페이로드(self.__next_f)가 본문으로 새면 문장 단위 부정 판정이 깨진다.
  // script/style 블록을 먼저 제거한다.
  const text = h
    .replace(/<script[\s\S]*?<\/script>/g, ' ')
    .replace(/<style[\s\S]*?<\/style>/g, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ');
  for (const m of text.matchAll(PARTNER)) {
    // 해당 표현이 등장한 문장 단위로 부정 여부를 판정한다
    const start = text.lastIndexOf('.', m.index) + 1;
    const end = text.indexOf('.', m.index + m[0].length);
    const sentence = text.slice(start, end === -1 ? text.length : end + 1);
    if (!NEGATED.test(sentence)) fails.push(`${r} 파트너 주장(부정 아님): ${sentence.trim().slice(0, 60)}`);
  }
  const sup = text.match(SUPERLATIVE);
  if (sup) fails.push(`${r} 미확인 최상급 표현: ${sup[0]}`);
}

// 6. 앵커 보존
{
  const h = await html('/solutions');
  for (const a of ['ev', 'merge1', 'datainsight']) {
    if (!h.includes(`id="${a}"`)) fails.push(`/solutions 앵커 #${a} 없음`);
  }
}

// 7. basePath 이중 적용·이탈
const bp = process.env.NEXT_PUBLIC_BASE_PATH ?? '';
if (bp) {
  for (const r of ['/', '/solutions', '/ai-services']) {
    const h = await html(r);
    if (h.includes(`${bp}${bp}`)) fails.push(`${r} basePath 이중 적용`);
    if (/href="\/(solutions|ai-services|about|contact)\//.test(h)) fails.push(`${r} basePath 누락 링크`);
  }
}

if (fails.length) { console.error('FAIL  ' + fails.length + '건:\n  ' + fails.join('\n  ')); process.exit(1); }
console.log(`PASS  프로젝트 ${publishedProjects().length}개(draft ${drafts.length}) · 제품 ${products.length}개 · Capture 표기 · 관계 고지 · 앵커 · basePath`);
