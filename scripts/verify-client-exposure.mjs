/** docs/04 §2 — 빌드 산출물에 서버 비밀이 섞이지 않았는지 검사한다. */
import { readFile, readdir } from 'node:fs/promises';
import path from 'node:path';

const OUT = path.join(process.cwd(), 'out');
const PATTERNS = [
  [/service_role/i, 'service_role 문자열'],
  [/github_pat_[A-Za-z0-9_]{20,}|ghp_[A-Za-z0-9]{30,}|gho_[A-Za-z0-9]{30,}/, 'GitHub 토큰'],
  [/discord\.com\/api\/webhooks/, 'Discord webhook URL'],
  [/SUPABASE_SERVICE_ROLE_KEY/, 'service_role 환경변수명'],
  [/sb_secret_[A-Za-z0-9_-]{10,}/, 'Supabase 신형 secret 키'],
];

/*
 * JWT 는 존재 자체로 판정하지 않는다. `NEXT_PUBLIC_SUPABASE_ANON_KEY` 는 **공개 전제**이며
 * (RLS 가 실제 보호막이다) 관리자 로그인·페이지뷰 수집을 위해 번들에 반드시 들어간다.
 * 대신 payload 를 열어 `role` 을 확인한다 — anon 이 아닌 토큰(특히 service_role)은 즉시 실패다.
 * 이 검사는 "JWT 가 있나"보다 강하다. 어떤 권한의 JWT 인지까지 본다.
 */
const JWT_RE = /eyJ[A-Za-z0-9_-]{10,}\.eyJ[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}/g;

const jwtRole = (token) => {
  try {
    return JSON.parse(Buffer.from(token.split('.')[1], 'base64url').toString()).role ?? '(role 없음)';
  } catch {
    return '(해독 불가)';
  }
};

const hits = [];
const walk = async (d) => {
  for (const e of await readdir(d, { withFileTypes: true })) {
    const p = path.join(d, e.name);
    if (e.isDirectory()) { await walk(p); continue; }
    if (!/\.(html|js|css|json|txt|xml|map)$/.test(e.name)) continue;
    const t = await readFile(p, 'utf8');
    for (const [re, label] of PATTERNS) if (re.test(t)) hits.push(`${label} → ${path.relative(OUT, p)}`);
    for (const token of new Set(t.match(JWT_RE) ?? [])) {
      const role = jwtRole(token);
      if (role !== 'anon') hits.push(`role="${role}" JWT → ${path.relative(OUT, p)}`);
    }
  }
};
await walk(OUT);
if (hits.length) { console.error('FAIL  비밀 노출:\n  ' + hits.join('\n  ')); process.exit(1); }
console.log('PASS  빌드 산출물에 서버 비밀 노출 없음');
