import type { Metadata } from 'next';
import { company } from '@/content/company';

/** docs/03 §14 — 페이지마다 고유 title/description/canonical */
export function pageMeta(opts: { title: string; description: string; path: string }): Metadata {
  return {
    title: opts.title,
    description: opts.description,
    alternates: { canonical: `${company.siteUrl}${opts.path}` },
    openGraph: {
      title: opts.title,
      description: opts.description,
      url: `${company.siteUrl}${opts.path}`,
      siteName: company.nameEn,
      locale: 'ko_KR',
      type: 'website',
    },
  };
}
