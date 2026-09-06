/**
 * 서브셋 폰트가 현재 카피를 모두 담고 있는지 검사한다.
 * 카피를 바꾸고 `npm run subset:font` 를 잊으면 새 글자가 폴백 폰트로 렌더된다.
 * 빌드 산출물이 필요하므로 build 이후에 실행한다.
 */
import { readFile, readdir } from 'node:fs/promises';
import path from 'node:path';

const OUT = path.join(process.cwd(), 'out');

async function htmlChars(dir) {
  const chars = new Set();
  const walk = async (d) => {
    for (const e of await readdir(d, { withFileTypes: true })) {
      const p = path.join(d, e.name);
      if (e.isDirectory()) await walk(p);
      else if (e.name.endsWith('.html')) {
        let t = await readFile(p, 'utf8');
        t = t.replace(/<script[\s\S]*?<\/script>|<style[\s\S]*?<\/style>/g, '').replace(/<[^>]+>/g, ' ');
        for (const c of t) if (c >= '가' && c <= '힣') chars.add(c);
      }
    }
  };
  await walk(dir);
  return chars;
}

// woff2 의 cmap 을 직접 읽는 대신, 서브셋 생성 시 기록한 목록과 대조한다.
const manifestPath = path.join(process.cwd(), 'public/fonts/subset-manifest.json');
let covered;
try {
  covered = new Set(JSON.parse(await readFile(manifestPath, 'utf8')).chars);
} catch {
  console.error('FAIL  subset-manifest.json 이 없다. `npm run subset:font` 를 실행하라.');
  process.exit(1);
}

const used = await htmlChars(OUT);
const missing = [...used].filter((c) => !covered.has(c));

if (missing.length) {
  console.error(`FAIL  서브셋에 없는 한글 ${missing.length}자: ${missing.slice(0, 40).join('')}`);
  console.error('      `npm run subset:font` 를 실행하고 다시 커밋하라.');
  process.exit(1);
}
console.log(`PASS  폰트 서브셋 최신 — 사용 한글 ${used.size}자 전부 포함`);
