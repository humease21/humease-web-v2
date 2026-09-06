/**
 * IndexNow 제출. (요청서 §13)
 *
 * **기본값은 dry-run 이며 외부 전송을 하지 않는다.** 후보 목록만 출력한다.
 * 실제 전송은 INDEXNOW_ENABLED=true 이고 운영 대상일 때만 일어난다.
 *
 * 접수(202)는 색인이 아니다. Google·네이버·모든 AI 서비스가 IndexNow 통지를
 * 처리한다고 일반화하지 않는다.
 */
import { readFile, writeFile, stat } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import path from 'node:path';

const OUT = path.join(process.cwd(), 'out');
const STATE = path.join(process.cwd(), 'scripts', 'indexnow-state.json');

/** 공개 검증용 키. PAT·API secret 이 아니다. 공개 파일로 게시된다. */
const KEY = process.env.INDEXNOW_KEY ?? '490d0de58da5a99ffe3e93be85d4f842';
const APPROVED_HOST = 'www.humease.com';

const enabled = process.env.INDEXNOW_ENABLED === 'true';
const target = process.env.NEXT_PUBLIC_SITE_DEPLOY_TARGET === 'production' ? 'production' : 'preview';

const fail = (m) => { console.error(`FAIL  IndexNow — ${m}`); process.exit(1); };

// ── 키 파일 계약 검사 ────────────────────────────────────────────────
if (!/^[a-zA-Z0-9-]{8,128}$/.test(KEY)) fail('키 형식이 IndexNow 규격에 맞지 않는다');
if (/^gh[ps]_|^github_pat_/.test(KEY)) fail('PAT 를 키로 쓰려 했다 — 공개 파일에 절대 넣지 않는다');

const keyFile = path.join(OUT, `${KEY}.txt`);
try { await stat(keyFile); } catch { fail(`키 파일이 산출물에 없다: ${KEY}.txt`); }
const keyBody = await readFile(keyFile, 'utf8');
if (keyBody.trim() !== KEY) fail('키 파일 본문이 키와 다르다');
if (Buffer.from(keyBody, 'utf8').toString('utf8') !== keyBody) fail('키 파일이 UTF-8 이 아니다');

// ── 제출 후보 = 사이트맵 대상의 내용 변경분 ──────────────────────────
const sitemap = await readFile(path.join(OUT, 'sitemap.xml'), 'utf8');
const locs = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
if (!locs.length) fail('사이트맵이 비어 있다 — 검증 환경에서는 제출 후보가 없다');

const current = {};
for (const loc of locs) {
  const host = new URL(loc).host;
  if (host !== APPROVED_HOST) fail(`승인된 host 가 아니다: ${host} — 검증 URL 은 제출하지 않는다`);
  const rel = new URL(loc).pathname.replace(/^\/|\/$/g, '');
  const file = path.join(OUT, rel, 'index.html');
  const html = await readFile(rel ? file : path.join(OUT, 'index.html'), 'utf8');
  current[loc] = createHash('sha256').update(html).digest('hex').slice(0, 16);
}

let previous = {};
try { previous = JSON.parse(await readFile(STATE, 'utf8')).urls ?? {}; } catch { /* 최초 실행 */ }

const added = locs.filter((u) => !(u in previous));
const changed = locs.filter((u) => u in previous && previous[u] !== current[u]);
const removed = Object.keys(previous).filter((u) => !(u in current));
const candidates = [...added, ...changed, ...removed];

console.log(`대상          : ${target}`);
console.log(`keyLocation   : https://${APPROVED_HOST}/${KEY}.txt`);
console.log(`신규          : ${added.length}`);
console.log(`변경          : ${changed.length}`);
console.log(`삭제(404 예정): ${removed.length}`);
for (const u of candidates.slice(0, 30)) console.log(`  - ${u}`);

if (!enabled || target !== 'production') {
  console.log(`\nPASS  IndexNow dry-run — 외부 전송 없음 (INDEXNOW_ENABLED=${process.env.INDEXNOW_ENABLED ?? 'unset'}, target=${target})`);
  console.log('      실제 전송은 대표님 승인 후 INDEXNOW_ENABLED=true 로만 실행한다.');
  process.exit(0);
}

// ── 여기부터는 승인된 실전송 경로 ────────────────────────────────────
if (!candidates.length) { console.log('\nPASS  변경 없음 — 전송하지 않는다(무변경 전체 재전송 금지)'); process.exit(0); }

const res = await fetch('https://api.indexnow.org/IndexNow', {
  method: 'POST',
  headers: { 'content-type': 'application/json; charset=utf-8' },
  body: JSON.stringify({
    host: APPROVED_HOST,
    key: KEY,
    keyLocation: `https://${APPROVED_HOST}/${KEY}.txt`,
    urlList: candidates,
  }),
});
const at = new Date().toISOString();
console.log(`\n전송 시각: ${at}\n상태 코드: ${res.status}`);
if (res.status >= 400 && res.status < 500) {
  fail(`${res.status} 설정 오류 — 재시도하지 않는다. 키·host·keyLocation 을 확인한다`);
}
if (!res.ok) fail(`전송 실패 ${res.status}`);
await writeFile(STATE, JSON.stringify({ submittedAt: at, status: res.status, urls: current }, null, 2) + '\n');
console.log('PASS  접수됨. 접수는 색인이 아니다. Google·네이버·AI 서비스의 처리 여부를 일반화하지 않는다.');
