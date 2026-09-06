/**
 * 공개 가능한 근거 자료와 확인일. (요청서 §7.2)
 * 주장에는 근거를 붙이고, 근거가 없으면 주장하지 않는다.
 * 확인일을 빌드 날짜로 자동 대체하지 않는다.
 */
export type Source = {
  id: string;
  label: string;
  url: string | null;
  /** 이 자료로 뒷받침되는 범위 */
  scope: string;
  checkedAt: string;
};

export const sources: Source[] = [
  {
    id: 'arctera-official',
    label: 'Arctera 공식 제품 정보',
    url: 'https://www.arctera.io/',
    scope: 'Enterprise Vault Complete·Capture·Data Insight·eDiscovery Platform 의 제품 역할과 기능 범위',
    checkedAt: '2026-09-06',
  },
  {
    id: 'humease-legacy-portfolio',
    label: '휴미즈 기존 홈페이지 AI 서비스 목록',
    url: null,
    scope: 'AnyBuild·HairAI·내친구 케이의 포트폴리오 등록 사실',
    checkedAt: '2026-09-06',
  },
  {
    id: 'humease-internal-momie',
    label: '휴미즈 내부 프로젝트(맘이음) 승인 공개 문구',
    url: null,
    scope: '맘이음의 서비스 방향과 개발 중 상태',
    checkedAt: '2026-09-06',
  },
  {
    id: 'anthropic-crawlers',
    label: 'Anthropic — 웹 크롤링 및 사이트 소유자 차단 방법',
    url: 'https://support.claude.com/en/articles/8896518-does-anthropic-crawl-data-from-the-web-and-how-can-site-owners-block-the-crawler',
    scope: 'Anthropic 현행 크롤러 토큰(ClaudeBot·Claude-User·Claude-SearchBot)과 robots.txt 준수 여부. Claude-Web·anthropic-ai 는 공식 목록에 없음',
    checkedAt: '2026-09-06',
  },
];

export const sourceById = (id: string) => sources.find((s) => s.id === id);
export const sourcesByIds = (ids: string[]) => ids.map(sourceById).filter((s): s is Source => Boolean(s));
