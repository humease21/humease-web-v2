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
        eyebrow="인사이트"
        titleKo={<>Enterprise Data와<br />AX의 현장</>}
        lead={<>기업 데이터, 컴플라이언스, AI 전환 과정에서<br />마주하는 기술과 운영의 문제를 다룹니다</>}
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
