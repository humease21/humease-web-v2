import { CinematicHero } from '@/components/brand/CinematicHero';
import { Scene } from '@/components/sections/Scene';
import { InsightsEditorial, type Article } from '@/components/sections/InsightsEditorial';
import { ClosingContact } from '@/components/sections/ClosingContact';
import { assets } from '@/content/assets';
import { pageMeta } from '@/lib/seo';
import { metaForPath } from '@/content/search-pages';

export const metadata = pageMeta({ ...metaForPath('/insights'), path: '/insights' });

/** docs/03 P12 — 확인한 실제 글만 노출. 없으면 빈 카드·빈 필터를 만들지 않는다. */
const articles: Article[] = [];

export default function Page() {
  return (
    <>
      <CinematicHero
        eyebrow="INSIGHTS"
        titleKo="기술을 이해하고, 현장에 연결하는 기록."
        lead="Enterprise Data와 Applied AI의 실무에서 마주하는 질문과 생각을 나눕니다."
        image={assets.A03}
        ambient="silver"
        align="center"
      />
      <Scene mask="none">
        <InsightsEditorial articles={articles} />
      </Scene>
      <ClosingContact />
    </>
  );
}
