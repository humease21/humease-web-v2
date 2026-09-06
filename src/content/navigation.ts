export type NavChild = { label: string; href: string };
export type NavItem = { label: string; href: string; children?: NavChild[] };

/** docs/03 §0 글로벌 메뉴 */
export const primaryNav: NavItem[] = [
  {
    label: '사업영역',
    href: '/enterprise-data',
    children: [
      { label: '기업 데이터', href: '/enterprise-data' },
      { label: 'AI 서비스', href: '/consulting/ai-transformation' },
      { label: 'Arctera 솔루션', href: '/solutions' },
    ],
  },
  { label: 'AI 포트폴리오', href: '/ai-services' },
  { label: '인사이트', href: '/insights' },
  { label: '회사소개', href: '/about' },
  { label: '문의', href: '/contact' },
];

/**
 * 공개 라우트. sitemap 의 단일 출처.
 * 포트폴리오·제품 상세는 각 데이터에서 생성하므로 여기에 하드코딩하지 않는다.
 */
export const staticPublicRoutes = [
  '/', '/about', '/enterprise-data',
  '/consulting/e-discovery', '/consulting/internal-control',
  '/consulting/exchange-archive', '/consulting/ai-transformation',
  '/ai-services', '/solutions', '/contact', '/insights',
] as const;
