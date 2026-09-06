/**
 * docs/08 C01 — 공개 카피가 docs/03 과 일치하는지 검사한다.
 * docs/03: "따옴표 안의 문구는 바로 적용할 공개 카피다. '구현 규칙'은 내부 지시이며 화면에 노출하지 않는다."
 * 본문 카피는 렌더 텍스트와, SEO Title/Description 은 메타 태그와 각각 대조한다.
 */
import { readFile } from 'node:fs/promises';
import path from 'node:path';

const SPEC = '/mnt/e/VibeCoding/Humease-homepage-v2/docs/03_PAGES_AND_COPY.md';
const OUT = path.join(process.cwd(), 'out');

const PAGE_OF = {
  P01: '/', P02: '/about', P03: '/enterprise-data',
  P04: '/consulting/e-discovery', P05: '/consulting/internal-control',
  P06: '/consulting/exchange-archive', P07: '/consulting/ai-transformation',
  P08: '/ai-services', P09: '/ai-services/mom-ie',
  P10: '/solutions', P11: '/contact', P12: '/insights',
};

const norm = (s) => s.replace(/\s+/g, ' ').replace(/[“”]/g, '"').replace(/[‘’]/g, "'").trim();
const decode = (s) => s.replace(/&quot;/g, '"').replace(/&amp;/g, '&')
  .replace(/&#x27;|&#39;/g, "'").replace(/&nbsp;/g, ' ').replace(/&lt;/g, '<').replace(/&gt;/g, '>');

async function page(route) {
  const f = path.join(OUT, route === '/' ? 'index.html' : `${route.replace(/^\//, '')}/index.html`);
  const html = await readFile(f, 'utf8');
  const body = norm(decode(
    html.replace(/<head[\s\S]*?<\/head>/, ' ')
        .replace(/<script[\s\S]*?<\/script>|<style[\s\S]*?<\/style>/g, ' ')
        .replace(/<[^>]+>/g, ' ')));
  const title = decode(html.match(/<title>([^<]*)<\/title>/)?.[1] ?? '');
  const desc = decode(html.match(/<meta name="description" content="([^"]*)"/)?.[1] ?? '');
  return { body, title, desc };
}

const spec = await readFile(SPEC, 'utf8');
// 각 페이지 절은 다음 '## ' 제목 직전까지다. 마지막 절이 §13·§14 까지 삼키지 않게 자른다.
const sections = spec.split(/\n## (?=P\d\d\.)/).slice(1)
  .map((sec) => sec.split(/\n## /)[0]);

let checked = 0;
const fails = [];

for (const sec of sections) {
  const id = sec.slice(0, 3);
  const route = PAGE_OF[id];
  if (!route) continue;
  const p = await page(route);

  // SEO 는 메타 태그와 대조
  const seoTitle = sec.match(/SEO Title:\s*\*\*(.+?)\*\*/)?.[1] ?? sec.match(/Title:\s*\*\*(.+?)\*\*/)?.[1];
  const seoDesc = sec.match(/Description:\s*\*\*(.+?)\*\*/)?.[1];
  if (seoTitle) { checked++; if (norm(p.title) !== norm(seoTitle)) fails.push(`${id} title\n      기대: ${norm(seoTitle)}\n      실제: ${norm(p.title)}`); }
  if (seoDesc)  { checked++; if (norm(p.desc)  !== norm(seoDesc))  fails.push(`${id} description\n      기대: ${norm(seoDesc).slice(0,70)}…\n      실제: ${norm(p.desc).slice(0,70)}…`); }

  // 본문 카피 — 한 줄 안에 닫힌 따옴표만, 내부 지시 줄 제외
  for (const line of sec.split('\n')) {
    if (/^(구현|이미지|SEO|링크|보조|CTA|하단 문구|연결|공통 안내|산출물 표현|관련 페이지|상태 배지|프로젝트|카테고리|직접 연락|입력 안내|제출|폼 라벨|문의 placeholder)/.test(line.trim())) continue;
    if (/^###|^\*\*\d/.test(line.trim())) continue;
    for (const m of line.matchAll(/[“"]([^”"]{15,})[”"]/g)) {
      const c = norm(m[1]);
      checked++;
      if (!p.body.includes(c)) fails.push(`${id} ${route} 본문\n      기대: ${c.slice(0, 70)}${c.length > 70 ? '…' : ''}`);
    }
  }
}

// §13 — 404 카피는 별도 페이지다
{
  const nf = await readFile(path.join(OUT, '404.html'), 'utf8');
  const body = norm(decode(nf.replace(/<head[\s\S]*?<\/head>/, ' ')
    .replace(/<script[\s\S]*?<\/script>|<style[\s\S]*?<\/style>/g, ' ').replace(/<[^>]+>/g, ' ')));
  for (const c of ['페이지를 찾을 수 없습니다.', '주소가 변경되었거나 존재하지 않는 페이지입니다.', '홈으로 돌아가기', '문의하기']) {
    checked++;
    if (!body.includes(c)) fails.push(`404 페이지\n      기대: ${c}`);
  }
}

console.log(`  대조 ${checked}건 / 12개 페이지 + 404`);
if (fails.length) { console.error(`FAIL  불일치 ${fails.length}건:`); for (const f of fails) console.error('    ' + f); process.exit(1); }
console.log('PASS  docs/03 공개 카피·SEO 메타가 렌더 결과와 일치');
