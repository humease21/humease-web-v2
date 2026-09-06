export type NavChild = { label: string; href: string };
export type NavItem = { label: string; href: string; children?: NavChild[] };

/** docs/03 §0 글로벌 메뉴 */
export const primaryNav: NavItem[] = [
  {
    label: '사업영역',
    href: '/enterprise-data',
    children: [
      { label: 'Enterprise Data', href: '/enterprise-data' },
      { label: 'Applied AI', href: '/consulting/ai-transformation' },
      { label: '엔터프라이즈 솔루션', href: '/solutions' },
    ],
  },
  { label: 'AI 프로젝트', href: '/ai-services' },
  { label: '인사이트', href: '/insights' },
  { label: '회사소개', href: '/about' },
  { label: '문의', href: '/contact' },
];

/** docs/03 §14 — 공개 12개 페이지. sitemap 의 단일 출처. */
export const publicRoutes = [
  '/', '/about', '/enterprise-data',
  '/consulting/e-discovery', '/consulting/internal-control',
  '/consulting/exchange-archive', '/consulting/ai-transformation',
  '/ai-services', '/ai-services/mom-ie',
  '/solutions', '/contact', '/insights',
] as const;
