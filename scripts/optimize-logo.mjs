/**
 * 기존 운영 사이트의 승인 로고를 웹용으로 변환한다. 원본은 건드리지 않는다.
 * 기존 프로덕션은 CSS `brightness-0 invert` 로 흰색화해 어두운 배경에 올린다
 * (Humease/Homepage · src/components/Logo.tsx). 같은 결과를 빌드 시점에 만든다 —
 * 런타임 필터 비용이 없고 CSS 없이도 올바르게 보인다.
 * 색을 새로 정하는 것이 아니라 기존 처리 방식의 승계다.
 */
import { mkdir } from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const SRC = '/mnt/e/VibeCoding/Humease-homepage/public';
const OUT = path.join(process.cwd(), 'public/brand');
await mkdir(OUT, { recursive: true });

// 알파를 유지한 채 모든 불투명 픽셀을 흰색으로 = brightness-0 invert 와 동일
async function toWhite(src, dest, height) {
  const img = sharp(src).resize({ height, withoutEnlargement: false });
  const { data, info } = await img.ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  for (let i = 0; i < data.length; i += 4) { data[i] = 255; data[i + 1] = 255; data[i + 2] = 255; }
  const out = await sharp(data, { raw: { width: info.width, height: info.height, channels: 4 } })
    .webp({ quality: 92, alphaQuality: 100 }).toFile(dest);
  console.log(`  ${path.basename(dest)}  ${out.width}x${out.height}  ${(out.size / 1024).toFixed(1)}KB`);
  return out;
}

await toWhite(`${SRC}/humease_logo_horizontal_en.png`, `${OUT}/logo-horizontal-en.webp`, 56);

// favicon 은 원본이 이미 밝은 색이라 변환 없이 크기만 맞춘다
const fav = await sharp(`${SRC}/favicon.png`).resize(180, 180).png({ compressionLevel: 9 })
  .toFile(path.join(process.cwd(), 'src/app/icon.png'));
console.log(`  icon.png  ${fav.width}x${fav.height}  ${(fav.size / 1024).toFixed(1)}KB`);
