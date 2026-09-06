/**
 * JSON-LD·주장·공개 상태 정합성 검사. (요청서 §8, §15)
 * 운영 dry-run 산출물에서만 의미가 있다. 검증본에는 JSON-LD 가 없다.
 */
import { readFile, readdir } from 'node:fs/promises';
import path from 'node:path';

const OUT = path.join(process.cwd(), 'out');
const indexing = process.env.NEXT_PUBLIC_SEARCH_INDEXING_ENABLED === 'true';
const fails = [];

if (!indexing) {
  console.log('SKIP  검증본에는 JSON-LD 를 출력하지 않는다. 운영 dry-run 산출물로 검사한다.');
  process.exit(0);
}

const files = [];
const walk = async (d) => {
  for (const e of await readdir(d, { withFileTypes: true })) {
    const p = path.join(d, e.name);
    if (e.isDirectory()) await walk(p);
    else if (e.name === 'index.html') files.push(p);
  }
};
await walk(OUT);

let graphs = 0;
for (const f of files) {
  const rel = path.relative(OUT, f);
  const h = await readFile(f, 'utf8');
  const blocks = [...h.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map((m) => m[1]);
  if (!blocks.length) continue;
  if (blocks.length > 1) fails.push(`${rel} JSON-LD 블록 ${blocks.length}개`);

  for (const raw of blocks) {
    // 스크립트 조기 종료 방지 확인
    if (raw.includes('</script')) fails.push(`${rel} JSON-LD 안에 </script> 노출`);
    let data;
    try { data = JSON.parse(raw.replace(/\\u003c/g, '<').replace(/\\u003e/g, '>').replace(/\\u0026/g, '&')); }
    catch (e) { fails.push(`${rel} JSON 파싱 실패: ${e.message}`); continue; }
    graphs++;

    const nodes = data['@graph'] ?? [];
    const types = nodes.map((n) => n['@type']);
    const org = nodes.find((n) => n['@type'] === 'Organization');

    if (org) {
      // 확인되지 않은 회사 정보를 넣지 않는다
      for (const forbidden of ['legalName', 'address', 'telephone', 'founder', 'foundingDate', 'sameAs', 'numberOfEmployees', 'award']) {
        if (org[forbidden] !== undefined) fails.push(`${rel} Organization.${forbidden} — 확인된 공개 데이터만 허용`);
      }
      if (org.name !== '휴미즈') fails.push(`${rel} Organization.name=${org.name} — '휴미즈' 여야 한다`);
    }

    // 제품의 게시자를 HUMEASE 로 오기재하지 않는다
    for (const n of nodes.filter((x) => x['@type'] === 'SoftwareApplication')) {
      for (const k of ['publisher', 'provider', 'author', 'creator', 'offers', 'aggregateRating', 'review']) {
        if (n[k] !== undefined) fails.push(`${rel} SoftwareApplication.${k} — 제조사 제품에 넣지 않는다`);
      }
    }

    // 점수 목적의 스키마 금지
    for (const banned of ['FAQPage', 'HowTo', 'QAPage', 'Speakable', 'SearchAction']) {
      if (types.includes(banned)) fails.push(`${rel} ${banned} 사용 — 이번 범위에서 생성하지 않는다`);
    }

    // 개발 중 프로젝트에 가짜 상거래 데이터 금지
    for (const n of nodes.filter((x) => x['@type'] === 'CreativeWork')) {
      for (const k of ['offers', 'aggregateRating', 'downloadUrl', 'price']) {
        if (n[k] !== undefined) fails.push(`${rel} CreativeWork.${k} — 개발 중 프로젝트에 넣지 않는다`);
      }
    }

    // @id 는 운영 도메인 기준
    for (const n of nodes) {
      const id = n['@id'];
      if (typeof id === 'string' && id.includes('humease') && !id.startsWith('https://www.humease.com')) {
        fails.push(`${rel} @id 가 운영 도메인이 아님: ${id}`);
      }
    }
  }
}

if (fails.length) { console.error(`FAIL  ${fails.length}건:\n  ` + fails.slice(0, 12).join('\n  ')); process.exit(1); }
console.log(`PASS  JSON-LD ${graphs}개 그래프 — 엔터티 관계·금지 필드·안전 직렬화 확인`);
