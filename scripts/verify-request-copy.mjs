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
  // §4.3 WHY HUMEASE
  ['/', '데이터의 신뢰에서, AI의 실행으로.'],
  ['/', '필요한 정보를 보존하고, 찾아내고, 올바르게 다루는 일. 휴미즈는 기업 데이터 환경에 대한 이해를 바탕으로 실제 사용되는 AI 서비스와 시스템을 설계합니다.'],
  // §4.4 Enterprise Data
  ['/', '중요한 데이터는, 보관한 뒤에도 관리할 수 있어야 합니다.'],
  ['/', '필요한 데이터를 정책에 맞게 남깁니다.'],
  ['/', '감사·조사·자료 제출에 필요한 절차를 준비합니다.'],
  ['/', 'Arctera Solutions — 제품의 기능과 고객 환경에 맞는 적용 범위를 살펴보세요.'],
  // §4.5 Applied AI
  ['/', '아이디어를, 실제로 쓰이는 AI로.'],
  // §4.6 HOW WE WORK
  ['/', '문제를 이해하는 데서, 작동을 확인하는 데까지.'],
  ['/', '데이터·기술·운영의 연결 구조를 설계합니다.'],
  // §4.7 AI Portfolio
  ['/', '우리가 만든 것들이, 우리의 역량을 설명합니다.'],
  ['/', '전체 AI 포트폴리오 보기'],
  // §5.1 허브
  ['/ai-services', '직접 만든 서비스로, AI의 가능성을 보여줍니다.'],
  ['/ai-services', 'AI 아이디어를 함께 구체화하고 싶으신가요?'],
  // §5.2 이관 데이터
  ['/ai-services', 'AnyBuild'],
  ['/ai-services', 'HairAI'],
  ['/ai-services', '내친구 케이'],
  ['/ai-services', '맘이음'],
  ['/ai-services/anybuild', '아이디어를 서비스 기획과 구현으로 연결하는 AI 프로젝트.'],
  ['/ai-services/hairai', '사진을 바탕으로 어울리는 헤어스타일을 살펴보는 AI 프로젝트.'],
  ['/ai-services/k-bestie', '아이와 대화하는 AI 친구와 부모를 위한 인사이트를 연결하는 가족 소통 서비스.'],
  ['/ai-services/mom-ie', '친구처럼 곁에 있고, 비서처럼 도와주고, 가족과 연결해주는 AI'],
  ['/ai-services/mom-ie', '지금은 개발 중입니다.'],
  // §6.2 Arctera 허브
  ['/solutions', '기업 데이터의 보존부터, 컴플라이언스와 eDiscovery까지.'],
  ['/solutions', '휴미즈는 고객의 데이터 환경과 운영 요구를 바탕으로 제품의 적용 범위와 연계 구성을 함께 검토합니다.'],
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
  // §7 제품 상세
  ['/solutions/enterprise-vault', '중요한 정보를 오래 보존하고, 필요한 순간 활용할 수 있도록.'],
  ['/solutions/enterprise-vault', 'Discovery Accelerator'],
  ['/solutions/enterprise-vault-capture', '이메일 밖의 업무 대화도, 보존과 검토의 흐름 안으로.'],
  ['/solutions/enterprise-vault-capture', '기존 Merge1으로 알려진 Enterprise Vault Capture'],
  ['/solutions/data-insight', 'Enterprise Vault Data Insight'],
  ['/solutions/data-insight', '어떤 데이터가 어디에 있고, 어떻게 사용되는지부터.'],
  ['/solutions/ediscovery-platform', 'Enterprise Vault eDiscovery Platform'],
  ['/solutions/ediscovery-platform', '필요한 자료를 찾고, 보존하고, 검토 가능한 과정으로 제출합니다.'],
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
