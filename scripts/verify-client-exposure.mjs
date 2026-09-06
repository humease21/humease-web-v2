/** docs/04 §2 — 빌드 산출물에 서버 비밀이 섞이지 않았는지 검사한다. */
import { readFile, readdir } from 'node:fs/promises';
import path from 'node:path';

const OUT = path.join(process.cwd(), 'out');
const PATTERNS = [
  [/service_role/i, 'service_role 문자열'],
  [/eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9/, 'Supabase JWT'],
  [/github_pat_[A-Za-z0-9_]{20,}|ghp_[A-Za-z0-9]{30,}|gho_[A-Za-z0-9]{30,}/, 'GitHub 토큰'],
  [/discord\.com\/api\/webhooks/, 'Discord webhook URL'],
  [/SUPABASE_SERVICE_ROLE_KEY/, 'service_role 환경변수명'],
];
const hits = [];
const walk = async (d) => {
  for (const e of await readdir(d, { withFileTypes: true })) {
    const p = path.join(d, e.name);
    if (e.isDirectory()) { await walk(p); continue; }
    if (!/\.(html|js|css|json|txt|xml|map)$/.test(e.name)) continue;
    const t = await readFile(p, 'utf8');
    for (const [re, label] of PATTERNS) if (re.test(t)) hits.push(`${label} → ${path.relative(OUT, p)}`);
  }
};
await walk(OUT);
if (hits.length) { console.error('FAIL  비밀 노출:\n  ' + hits.join('\n  ')); process.exit(1); }
console.log('PASS  빌드 산출물에 서버 비밀 노출 없음');
