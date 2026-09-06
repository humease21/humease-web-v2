import type { MetadataRoute } from 'next';
import { company } from '@/content/company';

// output: 'export' 에서는 정적 생성으로 고정해야 한다.
export const dynamic = 'force-static';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: '*', allow: '/' }],
    sitemap: `${company.siteUrl}/sitemap.xml`,
  };
}
