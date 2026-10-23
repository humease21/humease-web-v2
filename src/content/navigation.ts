export type NavChild = { label: string; href: string; description?: string };
export type NavItem = { label: string; href: string; children?: NavChild[] };

/**
 * 글로벌 메뉴 — SPEC §4: 사업영역(기업 데이터 · AI 서비스 · Arctera 솔루션) / AI 포트폴리오 / 인사이트 / 회사소개 / 문의.
 * '문의'는 헤더 우측 CTA 버튼으로 분리해 렌더한다(primaryCta).
 * 설명 문구는 각 페이지의 승인 카피를 줄인 것이다.
 */
export const primaryNav: NavItem[] = [
  {
    label: '사업영역',
    href: '/enterprise-data',
    children: [
      { label: '기업 데이터', href: '/enterprise-data', description: '보존·검색·접근·통제·조사까지' },
      { label: 'e-Discovery', href: '/consulting/e-discovery', description: '조사·감사·분쟁 대응 체계' },
      { label: '내부 통제', href: '/consulting/internal-control', description: '커뮤니케이션 위험 탐지·검토·조치' },
      { label: 'Exchange 아카이빙', href: '/consulting/exchange-archive', description: '메일 보존·검색·복원·운영' },
      { label: 'AI 서비스', href: '/consulting/ai-transformation', description: 'AI 서비스 설계·자동화·구현' },
    ],
  },
  {
    label: 'Arctera 솔루션',
    href: '/solutions',
    children: [
      { label: 'Arctera 솔루션 전체', href: '/solutions', description: 'Capture에서, Compliance까지' },
      { label: 'Enterprise Vault Complete', href: '/solutions/enterprise-vault' },
      { label: 'Enterprise Vault Capture', href: '/solutions/enterprise-vault-capture' },
      { label: 'Data Insight', href: '/solutions/data-insight' },
      { label: 'eDiscovery Platform', href: '/solutions/ediscovery-platform' },
    ],
  },
  { label: 'AI 포트폴리오', href: '/ai-services' },
  { label: '인사이트', href: '/insights' },
  { label: '회사소개', href: '/about' },
];

export const primaryCta = { label: '프로젝트 문의', href: '/contact' } as const;

/**
 * 공개 라우트. sitemap 의 단일 출처.
 * 포트폴리오·제품 상세는 각 데이터에서 생성하므로 여기에 하드코딩하지 않는다.
 */
export const staticPublicRoutes = [
  '/', '/about', '/enterprise-data',
  '/consulting/e-discovery', '/consulting/internal-control',
  '/consulting/exchange-archive', '/consulting/ai-transformation',
  '/ai-services', '/solutions', '/contact', '/insights',
  '/privacy', '/terms',
] as const;
