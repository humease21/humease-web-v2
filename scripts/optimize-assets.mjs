/**
 * docs/05 §4 — 원본 보존, 웹용 출력본만 생성.
 * 재색상·합성·인페인팅·생성형 업스케일 없음. 포맷 변환·리사이즈·압축만 수행한다.
 */
import { mkdir, readdir } from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const SRC = '/mnt/e/VibeCoding/Humease-homepage-v2/Images';
const OUT = path.join(process.cwd(), 'public/images');

// G0 §6 제안 매핑. 파일명 접두로 원본을 찾는다.
const MAP = [
  ['a01-home-hero-desktop',    'Create_a_169_horizontal_premium_enterprise_websit', 1600, 88],
  ['a02-home-hero-mobile',     'A_premium_45_vertical_background_image_for_a_mobi',  912, 82],
  ['a03-data-to-intelligence', 'A_premium_169_horizontal_abstract_brand_image_On',  1600, 82],
  ['a04-enterprise-data',      'A_premium_169_horizontal_image_for_an_Enterprise_', 1600, 82],
  ['a05-ediscovery',           'A_premium_169_horizontal_precise_abstract_image_',  1600, 82],
  ['a06-internal-control',     'A_premium_169_horizontal_abstract_image_for_an_in', 1600, 82],
  ['a07-exchange-archive',     'A_premium_169_horizontal_abstract_image_for_a_mai', 1600, 82],
  ['a08-applied-ai',           'Create_a_169_hero_image_for_an_Applied_AI_page_O',  1376, 82],
  ['a09-ai-projects',          'Create_a_169_abstract_image_for_an_AI_projects_in', 1376, 82],
  ['a10-momieum-connection',   'Create_a_169_brand_concept_image_for_a_family_com', 1376, 82],
  ['a11-about-craft',          'Create_a_43_abstract_material_image_for_an_about_', 1200, 82],
  ['a12-enterprise-solutions', 'Create_a_169_abstract_image_for_an_enterprise_sol', 1376, 82],
  ['a13-contact-connection',   'A_premium_169_horizontal_background_image_for_a_c', 1400, 82],
];

const files = await readdir(SRC);
await mkdir(OUT, { recursive: true });

let ok = 0;
for (const [name, prefix, width, quality] of MAP) {
  const match = files.find((f) => f.startsWith(prefix));
  if (!match) { console.error(`MISS  ${name}  (원본 없음: ${prefix})`); continue; }
  const dest = path.join(OUT, `${name}.webp`);
  const info = await sharp(path.join(SRC, match))
    .resize({ width, withoutEnlargement: true })
    .webp({ quality })
    .toFile(dest);
  console.log(`  ${name}.webp  ${info.width}x${info.height}  ${(info.size / 1024).toFixed(0)}KB`);
  ok++;
}
console.log(`\n${ok}/${MAP.length} 생성`);
