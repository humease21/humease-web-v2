/**
 * Arctera Solutions — 제품 정보 단일 출처.
 *
 * 관계 고지(요청서 §6.1): 휴미즈는 Arctera 의 공식 파트너가 아니다.
 * Official/Authorized/Strategic Partner, 총판, 독점 같은 표현을 쓰지 않는다.
 * 공급·가격·라이선스·유지보수 보장을 약속하지 않는다.
 */

export const RELATIONSHIP_NOTICE =
  '본 페이지는 휴미즈가 Arctera 솔루션 정보를 정리한 안내 페이지입니다. 휴미즈는 Arctera의 공식 파트너가 아닙니다. 제품명과 상표는 각 권리자에게 귀속됩니다.';

export const SUPPORT_SCOPE_NOTICE =
  '실제 지원 기능과 연결 범위는 제품 버전, 라이선스, 데이터 소스 및 구성에 따라 달라질 수 있습니다. 도입·이관 전에는 공식 지원 자료와 고객 환경을 함께 확인해야 합니다.';

/** 제품 정보 확인일. 빌드 날짜로 자동 대체하지 않는다(요청서 §11.2). */
export const PRODUCT_INFO_VERIFIED_AT = '2026-09-06';

/** 6개 해결 과제. 네 제품의 단일 라이선스에 모두 포함된다는 뜻이 아니다. */
export const challenges = [
  { en: 'Communications Compliance', ko: '커뮤니케이션 컴플라이언스',
    body: '이메일·메시징·협업 도구의 업무 기록에 일관된 수집·보존·검토 기준을 적용하도록 돕습니다.' },
  { en: 'Supervision & Surveillance', ko: '커뮤니케이션 감독 및 모니터링',
    body: '검토가 필요한 커뮤니케이션을 선별하고 담당자의 검토·후속 조치·감사 기록을 연결합니다.' },
  { en: 'Records & Retention', ko: '기록 관리 및 보존 정책',
    body: '필요한 기록을 적정 기간 보존하고, 보존 의무와 삭제 제한을 확인하며 정보의 생명주기를 관리합니다.' },
  { en: 'Investigations & eDiscovery', ko: '조사 및 eDiscovery',
    body: '분산된 관련 기록을 찾아 보존하고 검토·제출하는 조사 과정을 지원합니다.' },
  { en: 'Insights & Analytics', ko: '커뮤니케이션 인사이트 및 분석',
    body: '커뮤니케이션의 패턴과 위험 신호를 살펴보고 거버넌스 의사결정에 필요한 정보를 제공합니다.' },
  { en: 'Data Migration', ko: '아카이브 및 데이터 마이그레이션',
    body: '기존 아카이브를 이전·통합할 때 데이터의 무결성, 메타데이터, 보존 맥락을 유지하는 과제를 다룹니다.' },
] as const;

export type Product = {
  slug: string;
  /** 공개 표시명. 목록·H1·title 이 모두 이 값을 쓴다. */
  name: string;
  /** 공식 자료상의 전체 명칭. 본문 첫 문장에서 함께 안내한다. */
  officialName?: string;
  alternateName?: string;
  /** 기존 앵커 id (구 사이트 진입 보존) */
  anchor: string;
  role: string;
  subtitleKo: string;
  intro: string;
  features: { area: string; body: string }[];
  extras?: { title: string; body: string }[];
  review: string;
  faq?: { q: string; a: string }[];
  related: { label: string; href: string }[];
  ctaLabel: string;
  officialSource: { label: string; url: string };
  metaDescription: string;
};

export const products: Product[] = [
  {
    slug: 'enterprise-vault',
    name: 'Enterprise Vault Complete',
    anchor: 'ev',
    role: '기업 정보를 보존하고 정책에 따라 관리하는 아카이빙·거버넌스',
    subtitleKo: '중요한 정보를 오래 보존하고, 필요한 순간 활용할 수 있도록.',
    intro:
      'Enterprise Vault Complete는 기업의 커뮤니케이션과 콘텐츠를 보존·관리하는 정보 아카이빙 및 거버넌스 제품입니다. 수집, 분류, 보존, 감독, 조사와 데이터 분석을 연결해 정보 관리 업무를 지원합니다. 공식 자료는 조직이 데이터 위치와 운영을 통제하는 온프레미스 중심의 구성을 설명합니다.',
    features: [
      { area: '기업 정보 아카이빙', body: '지원되는 이메일·기업 콘텐츠를 보존하고 검색할 수 있게 관리합니다.' },
      { area: '분류 및 보존 정책', body: '정보의 속성과 정책에 따라 분류·보존 기준을 적용합니다.' },
      { area: '조사·검토 연계', body: '관련 구성요소와 연계하여 자료 검색과 조사·검토 업무를 지원합니다.' },
      { area: '거버넌스 운영', body: '데이터와 정책을 통제하면서 장기 정보 관리 요구에 대응합니다.' },
    ],
    extras: [
      { title: 'Exchange Mailbox Archiving', body: '사서함 아카이빙 요구와 사용자 이용 흐름을 다룹니다. 지원 버전과 호환성은 환경 확인 후 판단합니다.' },
      { title: 'Classification', body: '분류와 보존·생명주기 정책을 연결하는 역할을 담당합니다.' },
      { title: 'Surveillance', body: '아카이브된 기록의 감독 검토, 담당자 배정, 검토 이력과 후속 조치를 다룹니다.' },
      { title: 'Discovery Accelerator', body: 'Enterprise Vault 아카이브 안의 케이스 중심 검토와 기록 관리를 담당합니다. eDiscovery Platform과 같은 제품이 아닙니다.' },
    ],
    review:
      '대상 데이터와 증가량, 보존 정책, 검색·복원 요구, 기존 메시징 환경, 운영 역할과 변경 범위를 먼저 정리합니다. 신규 도입과 기존 환경 개선·이관은 서로 다른 조건으로 검토합니다.',
    related: [
      { label: 'Exchange Archive 컨설팅', href: '/consulting/exchange-archive' },
      { label: 'e-Discovery 컨설팅', href: '/consulting/e-discovery' },
      { label: 'Enterprise Vault Capture (formerly Merge1)', href: '/solutions/enterprise-vault-capture' },
    ],
    ctaLabel: 'Enterprise Vault 적용 상담',
    officialSource: { label: 'Arctera 공식 제품 정보', url: 'https://www.arctera.io/' },
    metaDescription:
      'Enterprise Vault Complete의 기업 정보 아카이빙과 보존·거버넌스 역할을 한국어로 안내합니다. Arctera 제품 정보와 휴미즈의 적용 검토 항목을 확인하세요.',
  },
  {
    slug: 'enterprise-vault-capture',
    name: 'Enterprise Vault Capture (formerly Merge1)',
    alternateName: 'Merge1',
    anchor: 'merge1',
    role: '여러 커뮤니케이션 채널의 데이터를 수집해 보존·검토 환경으로 연결',
    subtitleKo: '이메일 밖의 업무 대화도, 보존과 검토의 흐름 안으로.',
    intro:
      '기존 Merge1으로 알려진 Enterprise Vault Capture는 기업의 협업·메시징 등 여러 커뮤니케이션 채널에서 데이터를 수집하는 제품입니다. 대화 참여자, 시간, 첨부파일과 같은 맥락을 함께 유지하면서 아카이브와 후속 거버넌스 업무로 연결합니다.',
    features: [
      { area: '협업·메시징 데이터 수집', body: 'Microsoft Teams, Slack 등 지원 채널의 커뮤니케이션을 수집합니다.' },
      { area: '대화 맥락 유지', body: '참여자·타임스탬프·첨부파일 등 관련 메타데이터를 함께 다룹니다.' },
      { area: '형식 정규화', body: '수집 데이터를 후속 아카이빙과 검토에 이용하기 쉬운 형태로 정리합니다.' },
      { area: '아카이브 연계', body: '수집한 기록을 Enterprise Vault 또는 지원되는 아카이브 환경으로 전달합니다.' },
    ],
    extras: [
      { title: '기존 이름으로 찾아오셨나요?', body: 'Merge1, Arctera Merge1 또는 Veritas Merge1이라는 이름으로 찾아오셨나요? 이 페이지에서는 현재 공식 명칭인 Enterprise Vault Capture를 기준으로 제품의 역할을 안내합니다.' },
    ],
    review:
      '수집 대상과 채널별 API·권한, 필요한 데이터 범위, 기존 기록의 처리 조건, 목적지 아카이브, 누락 확인 및 재처리 절차를 검토합니다.',
    faq: [
      { q: 'Merge1과 Enterprise Vault Capture는 서로 다른 제품인가요?',
        a: '공식 사이트는 Enterprise Vault Capture (formerly Merge1)로 표기합니다. 휴미즈도 기존 이름과 현재 이름을 함께 안내하며, 두 이름을 별도 제품으로 나누지 않습니다.' },
      { q: '현재 사용하는 Merge1 환경을 그대로 변경할 수 있나요?',
        a: '이름이 변경되었다는 사실만으로 업그레이드 가능 여부나 계약·라이선스 조건이 확정되지는 않습니다. 설치 버전, 사용 커넥터, 수집 방식, 연결 아카이브와 계약 조건을 확인해야 합니다.' },
    ],
    related: [
      { label: 'Enterprise Vault Complete', href: '/solutions/enterprise-vault' },
      { label: 'Internal Control 컨설팅', href: '/consulting/internal-control' },
      { label: 'e-Discovery 컨설팅', href: '/consulting/e-discovery' },
    ],
    ctaLabel: 'Capture / Merge1 적용 상담',
    officialSource: { label: 'Arctera 공식 제품 정보', url: 'https://www.arctera.io/' },
    metaDescription:
      'Enterprise Vault Capture (formerly Merge1)의 협업·메시징 데이터 수집과 아카이브 연계를 한국어로 안내합니다. Arctera 제품 정보와 휴미즈의 적용 검토 항목을 확인하세요.',
  },
  {
    slug: 'data-insight',
    name: 'Data Insight',
    officialName: 'Enterprise Vault Data Insight',
    anchor: 'datainsight',
    role: '데이터 현황·사용·접근 패턴을 분석해 관리 판단 지원',
    subtitleKo: '어떤 데이터가 어디에 있고, 어떻게 사용되는지부터.',
    intro:
      'Enterprise Vault Data Insight는 데이터 현황과 사용·접근 패턴을 분석하여 정보 거버넌스 판단을 돕는 제품입니다. 데이터의 위치, 크기, 노후도, 소유 관련 정보와 접근 활동을 살펴보고 관리 우선순위를 정하는 데 활용합니다. 데이터를 보관하는 아카이브 자체가 아니라 분석·리포팅 역할에 초점을 둡니다.',
    features: [
      { area: '데이터 현황 파악', body: '지원 저장소의 분포와 용량·증가 추이를 살펴봅니다.' },
      { area: '사용·접근 분석', body: '접근 빈도와 활동을 통해 관리가 필요한 영역을 확인합니다.' },
      { area: '책임·소유 정보', body: '확인 가능한 소유·관리 단서를 활용해 관리 공백을 파악합니다.' },
      { area: '정리·보존 판단', body: '오래되거나 중복·과다 노출 가능성이 있는 데이터의 검토를 돕습니다.' },
      { area: '거버넌스 보고', body: '정리, 보존 정책, 접근 검토에 필요한 분석 결과를 제공합니다.' },
    ],
    review:
      '대상 파일·저장소, 접근 로그 수집 조건, 소유자 판단 기준, 민감정보 관리 범위와 정리 승인 절차를 검토합니다. 분석 결과를 실제 삭제나 권한 변경으로 연결할 때는 별도의 승인·검증 절차를 둡니다.',
    faq: [
      { q: 'Data Insight가 데이터를 자동으로 보관하거나 삭제하나요?',
        a: '이 페이지에서 소개하는 중심 역할은 데이터 분석과 보고입니다. 보관·삭제·권한 변경 기능이나 다른 제품과의 연계 범위는 실제 구성에 따라 확인해야 합니다.' },
    ],
    related: [
      { label: 'Enterprise Data', href: '/enterprise-data' },
      { label: 'Internal Control 컨설팅', href: '/consulting/internal-control' },
      { label: 'Enterprise Vault Complete', href: '/solutions/enterprise-vault' },
    ],
    ctaLabel: 'Data Insight 적용 상담',
    officialSource: { label: 'Arctera 공식 제품 정보', url: 'https://www.arctera.io/' },
    metaDescription:
      'Enterprise Vault Data Insight의 데이터 현황·사용·접근 분석 역할을 한국어로 안내합니다. Arctera 제품 정보와 휴미즈의 적용 검토 항목을 확인하세요.',
  },
  {
    slug: 'ediscovery-platform',
    name: 'eDiscovery Platform',
    officialName: 'Enterprise Vault eDiscovery Platform',
    anchor: 'ediscovery',
    role: '조사 자료의 검색·보존·수집·검토·제출 과정 지원',
    subtitleKo: '필요한 자료를 찾고, 보존하고, 검토 가능한 과정으로 제출합니다.',
    intro:
      'Enterprise Vault eDiscovery Platform은 법적 분쟁, 내부 조사와 규제 대응에 필요한 정보의 검색·보존·수집·검토·제출을 지원합니다. 사건의 범위와 검색 조건을 정의하고, 관련 기록과 처리 이력을 관리하는 데 활용합니다.',
    features: [
      { area: '사건 및 범위 관리', body: '조사 대상, 기간, 관련자와 데이터 범위를 정리합니다.' },
      { area: '검색·수집', body: '키워드와 메타데이터 조건으로 관련 자료를 찾고 수집합니다.' },
      { area: 'Legal Hold', body: '조사에 필요한 기록의 보존과 삭제 제한을 관리합니다.' },
      { area: '검토', body: '자료를 필터링·분류·태깅하고 필요한 내용을 검토합니다.' },
      { area: '마스킹·제출', body: '지원 범위에서 민감한 부분을 가리고 제출용 결과를 준비합니다.' },
      { area: '감사 기록', body: '검색·보존·수집·제출 과정의 이력을 남깁니다.' },
    ],
    review:
      '자료 소스와 규모, 조사 범위, 수집 권한, 검토 역할, 보존 조건, 필요한 제출 형식을 확인합니다. 법률적 판단과 제출 적합성의 최종 확인은 고객의 법무·컴플라이언스 담당 범위와 구분합니다.',
    faq: [
      { q: 'Discovery Accelerator와 같은 제품인가요?',
        a: '같은 제품으로 소개하지 않습니다. Enterprise Vault 아카이브의 케이스 기반 검토 요구와 여러 자료의 검색·보존·수집·검토 요구를 구분하여 제품 및 구성의 적용 범위를 확인합니다.' },
    ],
    related: [
      { label: 'e-Discovery 컨설팅', href: '/consulting/e-discovery' },
      { label: 'Enterprise Vault Complete', href: '/solutions/enterprise-vault' },
    ],
    ctaLabel: 'eDiscovery 적용 상담',
    officialSource: { label: 'Arctera 공식 제품 정보', url: 'https://www.arctera.io/' },
    metaDescription:
      'Enterprise Vault eDiscovery Platform의 검색·보존·수집·검토·제출 지원 역할을 한국어로 안내합니다. Arctera 제품 정보와 휴미즈의 적용 검토 항목을 확인하세요.',
  },
];

export const productBySlug = (slug: string) => products.find((p) => p.slug === slug);
