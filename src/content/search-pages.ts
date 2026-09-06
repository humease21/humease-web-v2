/**
 * 공개 페이지 목록과 검색 의도. (요청서 §3.2, §5.3)
 *
 * 정적 페이지의 title·description·색인 여부·수정일을 여기서만 관리한다.
 * 페이지·사이트맵·JSON-LD 가 모두 이 목록에서 생성된다.
 *
 * ⚠ contentUpdatedAt 은 **실제 본문·주요 정보가 바뀐 날**이다.
 *    빌드 시각·재배포·CSS 수정으로 갱신하지 않는다. 모르면 비운다(사이트맵에서 lastmod 생략).
 * 포트폴리오·제품 상세는 각 데이터에서 생성하므로 여기에 넣지 않는다.
 */
import type { Metadata } from 'next';

export type PublicationState = 'draft' | 'published' | 'archived';
export type PageKind =
  | 'home' | 'about' | 'service' | 'solution-hub' | 'solution-detail'
  | 'portfolio-hub' | 'project' | 'insight-hub' | 'article' | 'contact' | 'legal';

export type SearchPage = {
  id: string;
  path: string;
  kind: PageKind;
  publication: PublicationState;
  indexable: boolean;
  title: string;
  description: string;
  /** 내부 관리용. meta keywords 가 아니다. */
  primaryIntent: string;
  sourceIds: string[];
  contentUpdatedAt?: string;
  sourcesCheckedAt?: string;
  relatedPaths: string[];
};

export const searchPages: SearchPage[] = [
  {
    id: 'home', path: '/', kind: 'home', publication: 'published', indexable: true,
    title: '휴미즈 | Enterprise Data · Applied AI',
    description: '기업 데이터의 보존·검색·통제와 AI 서비스 설계·구현을 연결합니다. 휴미즈의 전문 영역, AI 포트폴리오와 Arctera Solutions를 소개합니다.',
    primaryIntent: '휴미즈가 무엇을 하는 회사인지 확인',
    sourceIds: [], contentUpdatedAt: '2026-09-06',
    relatedPaths: ['/enterprise-data', '/consulting/ai-transformation', '/ai-services', '/solutions'],
  },
  {
    id: 'about', path: '/about', kind: 'about', publication: 'published', indexable: true,
    title: '회사소개 · 데이터와 AI 전문 영역 | 휴미즈',
    description: '휴미즈의 사업 방향과 전문 영역, 확인된 실무 경험을 소개합니다. 기업 데이터와 AI 서비스를 어떤 관점으로 다루는지 확인하세요.',
    primaryIntent: '회사의 배경과 전문성 확인',
    sourceIds: [], contentUpdatedAt: '2026-09-06',
    relatedPaths: ['/contact', '/enterprise-data'],
  },
  {
    id: 'enterprise-data', path: '/enterprise-data', kind: 'service', publication: 'published', indexable: true,
    title: '기업 데이터 보존·검색·통제 컨설팅 | 휴미즈',
    description: '아카이빙, e-Discovery, 내부통제를 고객의 데이터 환경과 운영 요구에 연결합니다. 보존·검색·접근·자료 제출 시 검토할 항목을 안내합니다.',
    primaryIntent: '기업 데이터 문제 해결 범위 확인',
    sourceIds: [], contentUpdatedAt: '2026-09-06',
    relatedPaths: ['/consulting/e-discovery', '/consulting/internal-control', '/consulting/exchange-archive', '/solutions'],
  },
  {
    id: 'applied-ai', path: '/consulting/ai-transformation', kind: 'service', publication: 'published', indexable: true,
    title: 'Applied AI · AI 서비스 기획 및 구현 | 휴미즈',
    description: '해결할 문제와 사용자 경험을 정의하고 데이터 흐름, AI 적용 범위, 검증 기준을 설계합니다. 실제 AI 포트폴리오와 함께 접근 방식을 소개합니다.',
    primaryIntent: 'AI 서비스 개발 역량 확인',
    sourceIds: [], contentUpdatedAt: '2026-09-06',
    relatedPaths: ['/ai-services'],
  },
  {
    id: 'e-discovery', path: '/consulting/e-discovery', kind: 'service', publication: 'published', indexable: true,
    title: 'e-Discovery 컨설팅 · 조사와 자료 제출 | 휴미즈',
    description: '조사 범위, 데이터 수집·보존, 검색·검토·내보내기 절차를 검토합니다. eDiscovery Platform 등 관련 제품과 컨설팅의 역할을 구분해 설명합니다.',
    primaryIntent: 'e-Discovery 대응 체계 수립',
    sourceIds: [], contentUpdatedAt: '2026-09-06',
    relatedPaths: ['/solutions/ediscovery-platform', '/enterprise-data'],
  },
  {
    id: 'internal-control', path: '/consulting/internal-control', kind: 'service', publication: 'published', indexable: true,
    title: '데이터 내부통제 · 검토 정책과 운영 절차 | 휴미즈',
    description: '커뮤니케이션 검토, 접근 현황, 이상 징후 확인과 조치 기록을 연결하는 내부통제 접근 방식을 소개합니다. 실제 적용 범위는 환경별로 검토합니다.',
    primaryIntent: '내부통제 정책·절차 설계',
    sourceIds: [], contentUpdatedAt: '2026-09-06',
    relatedPaths: ['/solutions/data-insight', '/solutions/enterprise-vault-capture'],
  },
  {
    id: 'exchange-archive', path: '/consulting/exchange-archive', kind: 'service', publication: 'published', indexable: true,
    title: 'Exchange 아카이빙 · 보존 정책과 운영 설계 | 휴미즈',
    description: 'Exchange 메일 보존, 검색, 사서함 운영과 아카이브 요구를 함께 검토합니다. Enterprise Vault 적용 시 확인할 구성과 운영 조건을 안내합니다.',
    primaryIntent: 'Exchange 아카이빙 도입 검토',
    sourceIds: [], contentUpdatedAt: '2026-09-06',
    relatedPaths: ['/solutions/enterprise-vault'],
  },
  {
    id: 'portfolio-hub', path: '/ai-services', kind: 'portfolio-hub', publication: 'published', indexable: true,
    title: 'AI Portfolio · 개발 프로젝트 | 휴미즈',
    description: '휴미즈의 AI 개발 포트폴리오를 소개합니다. 프로젝트별 해결 과제, 구현 범위, 개발 참여와 현재 단계를 확인할 수 있습니다.',
    primaryIntent: '실제 만든 AI 프로젝트 확인',
    sourceIds: ['humease-legacy-portfolio'], contentUpdatedAt: '2026-09-06', sourcesCheckedAt: '2026-09-06',
    relatedPaths: ['/consulting/ai-transformation'],
  },
  {
    id: 'solution-hub', path: '/solutions', kind: 'solution-hub', publication: 'published', indexable: true,
    title: 'Arctera Solutions · 제품과 적용 영역 | 휴미즈',
    description: 'Enterprise Vault Complete, Enterprise Vault Capture (formerly Merge1), Data Insight, eDiscovery Platform의 역할과 적용 검토 항목을 한국어로 안내합니다.',
    primaryIntent: 'Arctera 제품의 역할과 적용 범위 확인',
    sourceIds: ['arctera-official'], contentUpdatedAt: '2026-09-06', sourcesCheckedAt: '2026-09-06',
    relatedPaths: ['/enterprise-data'],
  },
  {
    id: 'insights', path: '/insights', kind: 'insight-hub', publication: 'published', indexable: true,
    title: 'Insights · 데이터와 AI 기술 기록 | 휴미즈',
    description: 'Enterprise Data와 Applied AI에 관한 휴미즈의 공개 기술 기록을 모았습니다. 작성자, 확인 시점과 근거가 있는 콘텐츠로 연결합니다.',
    primaryIntent: '기술 관점과 설명 방식 확인',
    sourceIds: [], contentUpdatedAt: '2026-09-06',
    relatedPaths: [],
  },
  {
    id: 'contact', path: '/contact', kind: 'contact', publication: 'published', indexable: true,
    title: '프로젝트·솔루션 문의 | 휴미즈',
    description: 'Enterprise Data, Applied AI, Arctera 솔루션 검토와 개발 협업 문의를 받습니다. 현재 환경과 해결하고 싶은 과제를 알려주세요.',
    primaryIntent: '상담 시작',
    sourceIds: [], contentUpdatedAt: '2026-09-06',
    relatedPaths: [],
  },
];

export const pageByPath = (path: string) =>
  searchPages.find((p) => p.path === path.replace(/\/$/, '') || (path === '/' && p.path === '/'));

export const indexablePages = () =>
  searchPages.filter((p) => p.publication === 'published' && p.indexable);

/** §5.3 지정 메타데이터를 Metadata 로. 개별 페이지에서 경로만 넘긴다. */
export function metaForPath(path: string): Pick<SearchPage, 'title' | 'description'> {
  const p = pageByPath(path);
  if (!p) throw new Error(`[search-pages] 등록되지 않은 경로: ${path}`);
  return { title: p.title, description: p.description };
}
export type { Metadata };
