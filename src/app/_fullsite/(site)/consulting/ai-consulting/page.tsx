import { LegacyRedirect, legacyMetadata } from '@/components/layout/LegacyRedirect';
import { legacySlugMap } from '@/content/aliases';

export const metadata = legacyMetadata(legacySlugMap['ai-consulting'].to);

export default function Page() {
  const t = legacySlugMap['ai-consulting'];
  return <LegacyRedirect to={t.to} label={t.label} />;
}
