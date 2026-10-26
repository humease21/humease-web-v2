import { notFound } from 'next/navigation';
import { LegacyRedirect, legacyMetadata } from '@/components/layout/LegacyRedirect';
import { legacySlugMap } from '@/content/aliases';

/** 구 사이트 /services/* 경로 보존. 목록에 없는 slug 는 정상 404 다. */
export function generateStaticParams() {
  return Object.keys(legacySlugMap).map((slug) => ({ slug }));
}
export const dynamicParams = false;

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return legacyMetadata(legacySlugMap[slug]?.to ?? '/');
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const t = legacySlugMap[slug];
  if (!t) notFound();
  return <LegacyRedirect to={t.to} label={t.label} />;
}
