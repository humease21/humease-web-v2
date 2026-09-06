import { CinematicHero } from '@/components/brand/CinematicHero';
import { Scene, Statement } from '@/components/sections/Scene';
import { ExperienceScene } from '@/components/sections/ExperienceScene';
import { ClosingContact } from '@/components/sections/ClosingContact';
import { Reveal } from '@/components/interactive/Reveal';
import { assets } from '@/content/assets';
import { pageMeta } from '@/lib/seo';

export const metadata = pageMeta({
  title: '회사소개 | 휴미즈',
  description: '기업 데이터의 신뢰와 AI 서비스의 실행을 연결하는 휴미즈. 문제를 이해하고, 설계하고, 구현하는 접근 방식을 소개합니다.',
  path: '/about',
});

const WAYS = [
  { k: '먼저 이해합니다.', v: '현재 환경, 해결할 문제, 기대하는 결과를 구체화합니다.' },
  { k: '필요한 만큼 설계합니다.', v: '과한 기능보다 실제 운영할 수 있는 구조와 우선순위를 정합니다.' },
  { k: '구현하고 검증합니다.', v: '작동 여부뿐 아니라 사용성과 운영 조건까지 함께 살펴봅니다.' },
];

export default function AboutPage() {
  return (
    <>
      <CinematicHero
        eyebrow="ABOUT HUMEASE"
        titleKo="복잡한 기술을, 사람에게 필요한 가치로."
        lead="휴미즈는 기업 데이터의 신뢰를 설계하고, AI를 실제 사용되는 서비스로 연결하는 기술회사입니다."
        image={assets.A11}
        ambient="silver"
        align="center"
      />

      <Scene mask="none">
        <Statement
          titleKo="기술을 더하는 것보다, 문제를 제대로 이해하는 일."
          paragraphs={[
            '기업의 시스템에는 데이터만 있는 것이 아닙니다. 운영 방식과 사람의 역할, 보안 기준과 업무의 제약이 함께 있습니다. 휴미즈는 이러한 맥락을 먼저 이해하고, 필요한 기술과 실행 순서를 설계합니다.',
            'Enterprise Data와 Applied AI는 서로 다른 서비스를 나열한 것이 아닙니다. 데이터를 다뤄 온 경험을 바탕으로 신뢰할 수 있는 기술을 만들고, 그 기술이 실제로 쓰이게 한다는 같은 원칙을 공유합니다.',
          ]}
        />
      </Scene>

      <Scene mask="none">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,4fr)_minmax(0,6fr)] lg:gap-24">
          <Reveal as="p" className="eyebrow lg:pt-3">HOW WE WORK</Reveal>
          <ul>
            {WAYS.map((w, i) => (
              <Reveal as="li" key={w.k} delay={((i % 3) + 1) as 1 | 2 | 3} className="cap-row">
                <h2 className="title-ko-sm">{w.k}</h2>
                <p className="lead">{w.v}</p>
              </Reveal>
            ))}
          </ul>
        </div>
      </Scene>

      <ExperienceScene aboutCopy />
      <ClosingContact />
    </>
  );
}
