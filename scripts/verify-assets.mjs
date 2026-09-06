/**
 * docs/04 §2 · docs/05 §3 — 자산 manifest 와 실제 배포 파일의 정합성을 검사하고
 * ASSET_MAP.csv · ASSET_INVENTORY.md 를 생성한다.
 * 원본 절대경로·해시는 리포트에만 남기고 브라우저로 보내는 manifest 에는 넣지 않는다.
 */
import { readFile, writeFile, readdir, stat } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import path from 'node:path';
import sharp from 'sharp';

const ORIG_DIR = '/mnt/e/VibeCoding/Humease-homepage-v2/Images';
const WEB_DIR = path.join(process.cwd(), 'public/images');
const REPORTS = path.join(process.cwd(), 'docs/reports');

// G0 §6 제안 매핑 → 실제 검증
const MAP = [
  ['A01', 'home-hero-desktop', 'a01-home-hero-desktop', 'Create_a_169_horizontal_premium_enterprise_websit', '/'],
  ['A02', 'home-hero-mobile', 'a02-home-hero-mobile', 'A_premium_45_vertical_background_image_for_a_mobi', '/'],
  ['A03', 'data-to-intelligence', 'a03-data-to-intelligence', 'A_premium_169_horizontal_abstract_brand_image_On', '/'],
  ['A04', 'enterprise-data', 'a04-enterprise-data', 'A_premium_169_horizontal_image_for_an_Enterprise_', '/enterprise-data'],
  ['A05', 'ediscovery', 'a05-ediscovery', 'A_premium_169_horizontal_precise_abstract_image_', '/consulting/e-discovery'],
  ['A06', 'internal-control', 'a06-internal-control', 'A_premium_169_horizontal_abstract_image_for_an_in', '/consulting/internal-control'],
  ['A07', 'exchange-archive', 'a07-exchange-archive', 'A_premium_169_horizontal_abstract_image_for_a_mai', '/consulting/exchange-archive'],
  ['A08', 'applied-ai', 'a08-applied-ai', 'Create_a_169_hero_image_for_an_Applied_AI_page_O', '/consulting/ai-transformation'],
  ['A09', 'ai-projects', 'a09-ai-projects', 'Create_a_169_abstract_image_for_an_AI_projects_in', '/ai-services'],
  ['A10', 'momieum-connection', 'a10-momieum-connection', 'Create_a_169_brand_concept_image_for_a_family_com', '/;/ai-services;/ai-services/mom-ie'],
  ['A11', 'about-craft', 'a11-about-craft', 'Create_a_43_abstract_material_image_for_an_about_', '/about'],
  ['A12', 'enterprise-solutions', 'a12-enterprise-solutions', 'Create_a_169_abstract_image_for_an_enterprise_sol', '/solutions'],
  ['A13', 'contact-connection', 'a13-contact-connection', 'A_premium_169_horizontal_background_image_for_a_c', '/contact'],
];
const UNUSED = {
  A14: ['insight-enterprise-data', '실제 Enterprise Data 글 미확인 — 화면 미사용'],
  A15: ['insight-applied-ai', '실제 Applied AI 글 미확인 — 화면 미사용'],
  A16: ['insight-product-notes', '실제 제품 개발 글 미확인 — 화면 미사용'],
  A17: ['og-background', 'OG 카드 합성 미확정 — 연결 보류'],
};

const md5 = async (f) => createHash('md5').update(await readFile(f)).digest('hex');
const files = await readdir(ORIG_DIR);
const rows = [], inv = [], problems = [];

for (const [id, base, webBase, prefix, pages] of MAP) {
  const origName = files.find((f) => f.startsWith(prefix));
  const webFile = path.join(WEB_DIR, `${webBase}.webp`);
  if (!origName) { problems.push(`${id} 원본 없음 (${prefix})`); continue; }
  try { await stat(webFile); } catch { problems.push(`${id} 웹 출력본 없음 (${webBase}.webp)`); continue; }

  const origPath = path.join(ORIG_DIR, origName);
  const [om, wm] = [await md5(origPath), await md5(webFile)];
  const [os_, ws] = [(await stat(origPath)).size, (await stat(webFile)).size];
  const meta = await sharp(webFile).metadata();
  const omet = await sharp(origPath).metadata();

  rows.push([id, base, pages, 'Hero/섹션', `Images/${origName}`, `public/images/${webBase}.webp`,
    meta.width, meta.height, 'optimized'].join(','));
  inv.push({ id, origName, om, os_, ow: omet.width, oh: omet.height,
    webBase, wm, ws, ww: meta.width, wh: meta.height });
}

// CSV — 원본 절대경로·해시는 넣지 않는다
await writeFile(path.join(process.cwd(), 'docs/ASSET_MAP.csv'),
  'asset_id,reference_basename,page_paths,placement,actual_file_path,web_file_path,width,height,verification_status\n'
  + rows.join('\n')
  + '\n' + Object.entries(UNUSED).map(([id, [b, why]]) => `${id},${b},,,${''},,,,미사용 — ${why}`).join('\n') + '\n');

// 인벤토리 — 내부용
const lines = [
  '# 자산 인벤토리', '',
  `- 생성: ${new Date().toISOString().slice(0, 10)} / \`npm run verify:assets\` 자동 생성`,
  '- 원본 보관 위치: `/mnt/e/VibeCoding/Humease-homepage-v2/Images/` (배포 디렉터리 밖, 무변경)',
  '- 웹 출력본: `public/images/` — 포맷 변환·리사이즈·압축만 수행. 재색상·합성·생성형 업스케일 없음',
  '- **내부 문서.** 브라우저로 전달하는 `src/content/assets.ts` 에는 이 정보를 넣지 않는다.', '',
  '## 매핑·해시', '',
  '| ID | 원본 파일 | 원본 md5 | 원본 크기 | 웹 출력본 | 웹 md5 | 웹 크기 | 감축 |',
  '|---|---|---|---|---|---|---|---|',
];
for (const r of inv) {
  lines.push(`| ${r.id} | \`${r.origName.slice(0, 46)}\` | \`${r.om.slice(0, 10)}\` | ${r.ow}×${r.oh} ${(r.os_ / 1048576).toFixed(1)}MB `
    + `| \`${r.webBase}.webp\` | \`${r.wm.slice(0, 10)}\` | ${r.ww}×${r.wh} ${(r.ws / 1024).toFixed(0)}KB `
    + `| ${(100 - r.ws / r.os_ * 100).toFixed(1)}% |`);
}
const totO = inv.reduce((a, r) => a + r.os_, 0), totW = inv.reduce((a, r) => a + r.ws, 0);
lines.push('', `합계 원본 ${(totO / 1048576).toFixed(1)}MB → 웹 ${(totW / 1024).toFixed(0)}KB (${(100 - totW / totO * 100).toFixed(1)}% 감축)`, '');
lines.push('## 미사용 자산과 사유', '', '| ID | basename | 사유 |', '|---|---|---|');
for (const [id, [b, why]] of Object.entries(UNUSED)) lines.push(`| ${id} | ${b} | ${why} |`);
lines.push('', '## 확인 상태', '',
  '`verification_status: optimized` — 원본을 찾아 연결하고 웹 최적화까지 마쳤다.',
  '파일명(생성 프롬프트)에 근거한 매핑이며 **시각 확인은 대표님 승인 대상이다.**',
  '승인 후 `verified` 로 올린다. 시각 확인 전에는 최종 시각 PASS 로 보고하지 않는다.', '');
await writeFile(path.join(REPORTS, 'ASSET_INVENTORY.md'), lines.join('\n'));

if (problems.length) { console.error('FAIL  ' + problems.join('; ')); process.exit(1); }
console.log(`PASS  자산 ${rows.length}종 원본·웹 출력본 정합 · 미사용 ${Object.keys(UNUSED).length}종 사유 기록`);
console.log(`      원본 ${(totO / 1048576).toFixed(1)}MB → 웹 ${(totW / 1024).toFixed(0)}KB`);
