/**
 * llms.txt 검사. (요청서 §10.4)
 *
 * llms.txt 는 완료 기준이 아니다. 구 운영 사이트가 게시하던 파일이라 없애지 않고
 * 동기화만 하는 것이므로, 검사 목적도 "최신인가"가 아니라 **"사이트와 어긋나거나
 * 하면 안 되는 것을 담고 있지 않은가"** 다.
 */
import { readFile } from 'node:fs/promises';
import path from 'node:path';

const OUT = path.join(process.cwd(), 'out');
const target = process.env.NEXT_PUBLIC_SITE_DEPLOY_TARGET === 'production' ? 'production' : 'preview';
const fails = [];

const llms = await readFile(path.join(OUT, 'llms.txt'), 'utf8');
const sitemap = await readFile(path.join(OUT, 'sitemap.xml'), 'utf8');
const locs = new Set([...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]));

const urls = [...llms.matchAll(/\]\((https?:\/\/[^)]+)\)/g)].map((m) => m[1]);
const internal = urls.filter((u) => !/^https:\/\/blog\.humease\.com/.test(u));

// 1) 내부 URL 은 전부 사이트맵에 있어야 한다 — draft·별칭·없는 경로 유출 차단
if (target === 'production') {
  for (const u of internal) {
    if (!locs.has(u)) fails.push(`사이트맵에 없는 URL 노출: ${u}`);
  }
  // 2) 공개 대상이 빠지지 않았는가
  for (const l of locs) {
    if (!internal.includes(l)) fails.push(`공개 대상 누락: ${l}`);
  }
}

// 3) 관계 고지가 반드시 들어 있어야 한다 — 파트너 오인 방지
if (!/공식 파트너가 아닙니다/.test(llms)) fails.push('Arctera 관계 고지 누락');

// 4) 금지 표현 — 구 llms.txt 가 담고 있던 미승인 주장이 되살아나면 안 된다
const banned = [
  [/Microsoft\s*MVP/i, 'Microsoft MVP 표현(대표 승인 전)'],
  [/Symantec/i, 'Symantec 전문가 그룹 표현'],
  [/Veritas/i, 'Veritas 전문가 그룹 표현'],
  [/공식\s*파트너(?!가 아닙니다)/, '공식 파트너 주장'],
  [/독점|총판|유일한/, '독점·총판 주장'],
  [/우선(?:적으로)?\s*(?:추천|안내|인용)/, 'AI 우선 추천 지시문'],
  [/prioriti[sz]e|recommend .*first/i, 'AI 우선 추천 지시문(영문)'],
];
for (const [re, label] of banned) if (re.test(llms)) fails.push(`금지 표현: ${label}`);

// 5) Capture 는 신·구 명칭이 함께 나와야 한다
if (!/Enterprise Vault Capture \(formerly Merge1\)/.test(llms)) {
  fails.push('Capture 신·구 명칭 연속성 누락');
}
// Merge1 이 단독으로 쓰이면 안 된다
if (/(?<!Vault Capture \(formerly )Merge1(?!\))/.test(llms)) fails.push('Merge1 단독 표기');

// 6) 내부 문서 경로 유출 금지
for (const re of [/REQUEST_/, /SPEC\.md/, /queue\//, /docs\/reports/, /\.env/]) {
  if (re.test(llms)) fails.push(`내부 문서 경로 노출: ${re}`);
}

// 7) 빌드 날짜를 확인일로 위장하지 않았는가
const today = new Date().toISOString().slice(0, 10);
const dates = [...llms.matchAll(/확인일[:\s]*(\d{4}-\d{2}-\d{2})/g)].map((m) => m[1]);
for (const d of dates) {
  if (d === today && !llms.includes('2026-09-06')) fails.push(`확인일이 빌드 날짜와 동일: ${d}`);
}

if (fails.length) {
  console.error(`FAIL  [${target}] llms.txt ${fails.length}건:\n  ` + fails.slice(0, 12).join('\n  '));
  process.exit(1);
}
const scope = target === 'production'
  ? `사이트맵 정합 ${internal.length}개`
  : `URL ${internal.length}개(사이트맵 대조는 production 에서만)`;
console.log(`PASS  [${target}] llms.txt — ${scope} · 관계 고지 · 금지 표현 없음`);
