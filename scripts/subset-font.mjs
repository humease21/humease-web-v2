/**
 * 사이트가 실제로 사용하는 글자만 남긴 Noto Sans KR 서브셋을 만든다.
 *
 * next/font/google 의 Noto Sans KR 은 unicode-range 청크마다 @font-face 를 만들어
 * 248개 · 150KB 의 렌더 블로킹 CSS 를 생성한다(gzip 51KB). 공개 카피가 고정된
 * 마케팅 사이트에서는 낭비다. 빌드 산출물의 실제 글자만 서브셋해 @font-face 1개로 줄인다.
 *
 * 디자인 지정 폰트(docs/02 §3)는 그대로 Noto Sans KR 이다. 폰트를 바꾸는 것이 아니라
 * 같은 폰트의 필요한 글리프만 담는다.
 */
import { readFile, writeFile, readdir } from 'node:fs/promises';
import path from 'node:path';
import subsetFont from 'subset-font';

const SRC = '/tmp/fontsrc/NotoSansKR-var.ttf';
const OUT = path.join(process.cwd(), 'public/fonts');

async function collectChars(dir) {
  const chars = new Set(' ');
  const walk = async (d) => {
    for (const e of await readdir(d, { withFileTypes: true })) {
      const p = path.join(d, e.name);
      if (e.isDirectory()) await walk(p);
      else if (e.name.endsWith('.html')) {
        let t = await readFile(p, 'utf8');
        t = t.replace(/<script[\s\S]*?<\/script>|<style[\s\S]*?<\/style>/g, '').replace(/<[^>]+>/g, ' ');
        for (const c of t) chars.add(c);
      }
    }
  };
  await walk(dir);
  return chars;
}

const all = await collectChars(path.join(process.cwd(), 'out'));
// 한글 음절·자모 + 인쇄 가능한 ASCII + 자주 쓰는 문장부호
const keep = [...all].filter((c) => {
  const n = c.codePointAt(0);
  return (n >= 0x20 && n < 0x7f) || (c >= '가' && c <= '힣') || (n >= 0x3130 && n <= 0x318f)
    || '·—–…“”‘’®©'.includes(c);
});
const text = keep.join('');

// 가변 폰트 1개로 400~500 두 weight 를 모두 커버한다. 파일 하나, @font-face 하나.
const buf = await subsetFont(await readFile(SRC), text, {
  targetFormat: 'woff2',
  variationAxes: { wght: { min: 400, max: 500 } },
});
await writeFile(path.join(OUT, 'noto-sans-kr-subset.woff2'), buf);
console.log(`  noto-sans-kr-subset.woff2  ${(buf.length / 1024).toFixed(1)}KB (wght 400-500 가변)`);
console.log(`  포함 글자 ${keep.length}자`);
