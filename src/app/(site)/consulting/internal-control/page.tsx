import { CinematicHero } from '@/components/brand/CinematicHero';
import { Scene, Statement, Faq } from '@/components/sections/Scene';
import { ClosingContact } from '@/components/sections/ClosingContact';
import { Reveal } from '@/components/interactive/Reveal';
import { assets } from '@/content/assets';
import { pageMeta } from '@/lib/seo';
import { A } from '@/components/ui/Link';

export const metadata = pageMeta({
  title: 'Internal Control 컨설팅 | 휴미즈',
  description: '민감정보와 업무 커뮤니케이션의 관리 기준, 점검, 조치와 기록을 연결하는 휴미즈 내부 통제 컨설팅.',
  path: '/consulting/internal-control',
});

const SCOPE = [
  { k: '관리 범위', v: '데이터 유형과 대상 시스템, 확인할 리스크를 정리합니다.' },
  { k: '점검 흐름', v: '정책·규칙·검토 절차와 담당자 역할을 설계합니다.' },
  { k: '후속 조치', v: '검토 결과의 기록, 예외 처리, 운영 점검 항목을 연결합니다.' },
];
const FAQ = [
  { q: '기존 보안·아카이빙 환경과 함께 검토하나요?', a: '현재 시스템과 운영 정책을 확인하고 필요한 연계 범위를 살펴봅니다.' },
  { q: '리스크 탐지 정확도를 보장하나요?', a: '데이터·정책·제품 구성에 따라 결과가 달라집니다. 적용 전 시험과 운영 중 점검 기준을 함께 정하는 것이 중요합니다.' },
  { q: '모든 직원 데이터를 수집해야 하나요?', a: '업무 목적과 허용 범위를 먼저 검토하며, 불필요한 수집을 기본 전제로 삼지 않습니다.' },
];

export default function Page() {
  return (
    <>
      <CinematicHero
        eyebrow="ENTERPRISE DATA / INTERNAL CONTROL"
        titleKo="리스크를 발견하고, 대응을 기록하는 구조."
        lead="민감정보와 업무 커뮤니케이션을 관리하는 기준부터 점검·조치의 흐름까지. 실제 운영을 고려한 통제 체계를 설계합니다."
        image={assets.A06}
        ambient="silver"
        align="center"
      />

      <Scene mask="none">
        <Statement titleKo="도구보다 먼저, 무엇을 어떻게 관리할지 정합니다." paragraphs={['모든 데이터를 무작정 수집하거나 경고를 늘리는 대신, 필요한 범위와 담당자의 역할, 예외 상황과 조치 기준을 구체화합니다.']} />
      </Scene>

      <Scene image={assets.A06} mask="scene" ambient="silver">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,4fr)_minmax(0,6fr)] lg:gap-24">
          <Reveal as="p" className="eyebrow lg:pt-3">SCOPE</Reveal>
          <ul>
            {SCOPE.map((s, i) => (
              <Reveal as="li" key={s.k} delay={((i % 3) + 1) as 1 | 2 | 3} className="cap-row">
                <h3 className="title-ko-sm">{s.k}</h3>
                <p className="lead">{s.v}</p>
              </Reveal>
            ))}
          </ul>
        </div>
      </Scene>

      <Scene mask="none">
        <Reveal as="p" className="eyebrow">FAQ</Reveal>
        <div className="mt-10"><Faq items={FAQ} /></div>
        <Reveal delay={3}>
          <A href="/contact" className="cta-primary mt-14">내부 통제 상담<span aria-hidden="true">→</span></A>
        </Reveal>
      </Scene>

      <ClosingContact />
    </>
  );
}
