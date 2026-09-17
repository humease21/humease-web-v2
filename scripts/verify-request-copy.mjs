/**
 * 요청서 HUMEASE-WEB-20260906-CONTENT-01 의 지정 카피가 실제 렌더 결과에 있는지 검사한다.
 * docs/03 을 대체한 부분은 이 검사가 담당한다.
 */
import { readFile } from 'node:fs/promises';
import path from 'node:path';

const OUT = path.join(process.cwd(), 'out');
const norm = (s) => s.replace(/\s+/g, ' ').replace(/[“”]/g, '"').trim();
const decode = (s) => s.replace(/&quot;/g, '"').replace(/&amp;/g, '&')
  .replace(/&#x27;|&#39;/g, "'").replace(/&nbsp;/g, ' ').replace(/&lt;/g, '<').replace(/&gt;/g, '>')
  .replace(/&rsquo;/g, '’');

async function body(route) {
  const f = path.join(OUT, route === '/' ? 'index.html' : `${route.replace(/^\//, '')}/index.html`);
  const h = await readFile(f, 'utf8');
  return norm(decode(h.replace(/<head[\s\S]*?<\/head>/, ' ')
    .replace(/<script[\s\S]*?<\/script>|<style[\s\S]*?<\/style>/g, ' ').replace(/<[^>]+>/g, ' ')));
}
async function title(route) {
  const f = path.join(OUT, route === '/' ? 'index.html' : `${route.replace(/^\//, '')}/index.html`);
  return decode((await readFile(f, 'utf8')).match(/<title>([^<]*)<\/title>/)?.[1] ?? '');
}

const CHECKS = [
  // 요청서 003 §3-3 1) 홈 — 왜 휴미즈인가
  ['/', 'Enterprise IT 경험, AX의 기반'],
  ['/', '기업의 복잡한 IT 환경과 운영 제약을 이해하고 데이터 거버넌스부터 AI 활용까지 실행 가능한 구조로 설계합니다'],
  // 요청서 003 §3-3 1) 홈 — Enterprise Data
  ['/', '보관을 넘어, 데이터 거버넌스로'],
  ['/', '정책에 따라 필요한 데이터를 보존'],
  ['/', '감사·조사·eDiscovery 대응 체계'],
  // Korean-first 요청서 §4 로 'Arctera Solutions' → 'Arctera 솔루션'
  ['/', '제품의 기능과 고객 환경에 맞는 해결방안을 살펴보세요'],
  // 요청서 003 §3-3 1) 홈 — AI Service
  ['/', 'AI 도입에서, 업무 혁신으로'],
  // 요청서 003 §3-3 1) 홈 — Work Process
  ['/', '문제에서, 작동하는 서비스까지'],
  ['/', '데이터·업무·기술 연결'],
  // 요청서 003 §3-3 1) 홈 — AI Portfolio
  ['/', '아이디어에서, 실제 서비스로'],
  ['/', '전체 AI 포트폴리오 보기'],
  // 요청서 003 §3-3 8) AI 포트폴리오 허브
  ['/ai-services', '아이디어에서, 실제 AI 서비스로'],
  ['/ai-services', '아이디어에서, 첫 번째 사용자까지'],
  // §5.2 이관 데이터
  ['/ai-services', 'AnyBuild'],
  ['/ai-services', 'HairAI'],
  ['/ai-services', '내친구 케이'],
  ['/ai-services', '맘이음'],
  // 요청서 003 §3-3 12~15) 프로젝트 상세 Lead
  ['/ai-services/anybuild', '막연한 아이디어를 사용자 문제·기능·서비스 구조와 개발 범위로 구체화합니다'],
  ['/ai-services/hairai', '사진 한 장으로 나에게 어울리는 헤어스타일을 탐색하는 AI 이미지 서비스'],
  ['/ai-services/k-bestie', 'AI 친구와 아이의 자연스러운 대화를 부모의 이해와 가족 소통으로 연결합니다'],
  ['/ai-services/mom-ie', '친구처럼 곁에, 가족과 더 가까이'],
  ['/ai-services/mom-ie', '개발 중'],
  // 요청서 003 §3-3 9) Arctera 솔루션 허브
  ['/solutions', 'Capture에서, Compliance까지'],
  ['/solutions', '고객의 데이터 환경과 운영 정책을 확인하고 제품 적용 범위, 연계 구조와 이관 조건을 검토합니다'],
  ['/solutions', '휴미즈는 Arctera의 공식 파트너가 아닙니다.'],
  // §6.4 6개 과제
  ['/solutions', '커뮤니케이션 컴플라이언스'],
  ['/solutions', '커뮤니케이션 감독 및 모니터링'],
  ['/solutions', '기록 관리 및 보존 정책'],
  ['/solutions', '조사 및 eDiscovery'],
  ['/solutions', '커뮤니케이션 인사이트 및 분석'],
  ['/solutions', '아카이브 및 데이터 마이그레이션'],
  // §6.5 제품 4종
  ['/solutions', 'Enterprise Vault Complete'],
  ['/solutions', 'Enterprise Vault Capture (formerly Merge1)'],
  ['/solutions', 'Data Insight'],
  ['/solutions', 'eDiscovery Platform'],
  // 요청서 003 §3-3 16~19) 제품 상세 — 대표메시지
  ['/solutions/enterprise-vault', 'Enterprise Archiving에서, Information Governance까지'],
  ['/solutions/enterprise-vault', 'Discovery Accelerator'],
  ['/solutions/enterprise-vault-capture', '모든 업무 대화를, 하나의 컴플라이언스 흐름으로'],
  ['/solutions/enterprise-vault-capture', '기존 Merge1으로 알려진 Enterprise Vault Capture'],
  ['/solutions/data-insight', 'Enterprise Vault Data Insight'],
  ['/solutions/data-insight', '보이지 않는 데이터에서, 관리 가능한 데이터로'],
  ['/solutions/ediscovery-platform', 'Enterprise Vault eDiscovery Platform'],
  ['/solutions/ediscovery-platform', 'Search에서, Evidence까지'],
];

const TITLES = [
  /*
   * 콘텐츠 요청서 §8.2 는 `| 휴미즈`, SEO 요청서 §5.3 은 `| HUMEASE` 를 지정한다.
   * SEO 요청서 §0.2 가 "메타데이터 충돌은 이 요청을 우선한다"고 명시하므로 후자를 따른다.
   * 제품명 본체(Enterprise Vault Capture (formerly Merge1))는 두 문서가 동일하다.
   */
  ['/solutions/enterprise-vault-capture', 'Enterprise Vault Capture (formerly Merge1) | HUMEASE'],
];

const fails = [];
for (const [route, text] of CHECKS) {
  const t = await body(route);
  if (!t.includes(norm(text))) fails.push(`${route}\n      기대: ${text.slice(0, 64)}${text.length > 64 ? '…' : ''}`);
}
for (const [route, expected] of TITLES) {
  const t = await title(route);
  if (norm(t) !== norm(expected)) fails.push(`${route} title\n      기대: ${expected}\n      실제: ${t}`);
}

console.log(`  요청서 지정 카피 ${CHECKS.length + TITLES.length}건 대조`);
if (fails.length) { console.error(`FAIL  불일치 ${fails.length}건:`); for (const f of fails) console.error('    ' + f); process.exit(1); }
console.log('PASS  요청서 카피가 렌더 결과와 일치');
