import { CinematicHero } from '@/components/brand/CinematicHero';
import { DataTransition } from '@/components/sections/DataTransition';
import { NumberedScene, Scene, Statement } from '@/components/sections/Scene';
import { PortfolioList } from '@/components/sections/PortfolioList';
import { ExperienceScene } from '@/components/sections/ExperienceScene';
import { InsightsEditorial } from '@/components/sections/InsightsEditorial';
import { ClosingContact } from '@/components/sections/ClosingContact';
import { Reveal } from '@/components/interactive/Reveal';
import { QuestionList } from '@/components/content/QuestionList';
import { assets } from '@/content/assets';
import { featuredProjects } from '@/content/portfolio';
import { pageMeta } from '@/lib/seo';
import { metaForPath, pageByPath } from '@/content/search-pages';
import { JsonLd, organizationNode, websiteNode, webPageNode } from '@/lib/structured-data';
import { A } from '@/components/ui/Link';

export const metadata = pageMeta({ ...metaForPath('/'), path: '/' });

const HOW_WE_WORK = [
  { k: '이해', v: '현재 환경, 사용자, 실제 문제를 확인합니다.' },
  { k: '설계', v: '데이터·기술·운영의 연결 구조를 설계합니다.' },
  { k: '구현', v: '합의한 범위부터 실제 사용할 수 있게 구현합니다.' },
  { k: '검증', v: '사용 흐름과 운영 조건을 확인하고 개선합니다.' },
];

export default function HomePage() {
  const meta = pageByPath('/')!;

  return (
    <>
      <JsonLd graph={[
        organizationNode(),
        websiteNode(),
        webPageNode({ path: '/', name: meta.title, description: meta.description }),
      ]} />
      <CinematicHero
        eyebrow="HUMEASE"
        titleKo="복잡한 데이터와 아이디어를, 실제로 작동하는 기술로."
        lead="기업 데이터의 보존과 통제부터 AI 서비스의 설계와 구현까지. 휴미즈는 기술을 현실의 문제 해결로 연결합니다."
        ctas={[
          { label: '사업영역 살펴보기', href: '#business' },
          { label: '프로젝트 문의', href: '/contact', primary: false },
        ]}
        image={assets.A01}
        imageMobile={assets.A02}
        ambient="silver"
        heroScale
      />

      <div id="business">
        <DataTransition image={assets.A03} />
      </div>

      {/* WHY HUMEASE */}
      <Scene mask="none">
        <Statement
          eyebrow="왜 휴미즈인가"
          titleKo="데이터의 신뢰에서, AI의 실행으로."
          paragraphs={['필요한 정보를 보존하고, 찾아내고, 올바르게 다루는 일. 휴미즈는 기업 데이터 환경에 대한 이해를 바탕으로 실제 사용되는 AI 서비스와 시스템을 설계합니다.']}
        />
      </Scene>

      {/* 01 ENTERPRISE DATA */}
      <NumberedScene
        ordinal="01"
        eyebrow="기업 데이터"
        titleKo="중요한 데이터는, 보관한 뒤에도 관리할 수 있어야 합니다."
        lead="무엇을 얼마나 보존하고, 누가 접근하며, 필요한 순간 어떻게 찾아 제출할지. 데이터의 전체 흐름을 고객 환경과 운영 요구에 맞춰 검토합니다."
        capabilities={[
          { title: '보존', body: '필요한 데이터를 정책에 맞게 남깁니다.' },
          { title: '검색', body: '필요한 정보와 관련 기록을 찾는 구조를 설계합니다.' },
          { title: '통제', body: '접근과 검토의 기준을 명확히 합니다.' },
          { title: '대응', body: '감사·조사·자료 제출에 필요한 절차를 준비합니다.' },
        ]}
        cta={{ label: '기업 데이터 알아보기', href: '/enterprise-data' }}
        image={assets.A04}
        ambient="silver"
      />

      {/* Arctera 연결 — 허브로 가는 짧은 증거 영역 */}
      <Scene mask="none">
        <Reveal as="p" className="eyebrow">Arctera 솔루션</Reveal>
        <Reveal delay={1}>
          <p className="title-ko-sm measure mt-6">
            Arctera 솔루션 — 제품의 기능과 고객 환경에 맞는 적용 범위를 살펴보세요.
          </p>
        </Reveal>
        <Reveal delay={2}>
          <A href="/solutions" className="cta-ghost mt-9">Arctera 솔루션 보기<span aria-hidden="true">→</span></A>
        </Reveal>
      </Scene>

      {/* 02 APPLIED AI */}
      <NumberedScene
        ordinal="02"
        eyebrow="AI 서비스"
        titleKo="아이디어를, 실제로 쓰이는 AI로."
        lead="해결할 문제와 사용할 사람을 먼저 정하고, 대화 경험·데이터 흐름·업무 연결을 설계합니다. 필요한 기능을 구현한 뒤 실제 사용 과정에서 확인하고 개선합니다."
        capabilities={[
          { title: 'AI 서비스 기획', body: '해결할 문제와 사용할 사람을 먼저 정합니다.' },
          { title: '대화형 서비스', body: '대화 경험과 데이터 흐름을 설계합니다.' },
          { title: '업무 자동화', body: '반복 업무와 정보 흐름을 검증 가능한 범위로 연결합니다.' },
          { title: '웹 애플리케이션·프로토타입', body: '핵심 가설을 확인할 수 있는 범위부터 구현합니다.' },
        ]}
        cta={{ label: 'AI 서비스 알아보기', href: '/consulting/ai-transformation' }}
        image={assets.A08}
        ambient="cool"
      />

      {/* HOW WE WORK — 방법론은 한 번만 */}
      <Scene mask="none">
        <Reveal as="p" className="eyebrow">일하는 방식</Reveal>
        <Reveal delay={1} slow><h2 className="title-ko mt-6">문제를 이해하는 데서, 작동을 확인하는 데까지.</h2></Reveal>
        <ul className="mt-12">
          {HOW_WE_WORK.map((w, i) => (
            <Reveal as="li" key={w.k} delay={((i % 4) + 1) as 1 | 2 | 3 | 4} className="cap-row">
              <h3 className="font-[family-name:var(--font-display)] text-[22px] text-[var(--color-accent)] md:text-[28px]">{w.k}</h3>
              <p className="lead">{w.v}</p>
            </Reveal>
          ))}
        </ul>
      </Scene>

      {/* AI PORTFOLIO — 데이터 기반 */}
      <Scene mask="none">
        <Reveal as="p" className="eyebrow">AI 포트폴리오</Reveal>
        <Reveal delay={1} slow><h2 className="title-ko mt-6">우리가 만든 것들이, 우리의 역량을 설명합니다.</h2></Reveal>
        <Reveal delay={2}>
          <p className="lead measure mt-8">
            아이디어에서 출발해 서비스로 이어지는 과정. 휴미즈의 AI 개발 프로젝트와 그 안에서 풀어가는 문제를 소개합니다.
          </p>
        </Reveal>
        <div className="mt-12"><PortfolioList items={featuredProjects(3)} /></div>
        <Reveal delay={3}>
          <A href="/ai-services" className="cta-ghost mt-10">전체 AI 포트폴리오 보기<span aria-hidden="true">→</span></A>
        </Reveal>
      </Scene>

      <ExperienceScene />

      {/* §6.2 — 홈에서 실제로 궁금해할 것만. 상담 문구를 반복하지 않는다. */}
      <Scene mask="none">
        <QuestionList
          items={[
            { q: '휴미즈는 어떤 회사인가요?',
              a: '휴미즈는 기업 데이터의 보존·검색·통제와 AI 서비스의 설계·구현을 전문 영역으로 하는 기술 기업입니다. 홈페이지에서는 제공하는 전문 서비스, 개발 포트폴리오, Arctera 제품 정보를 구분해 소개합니다.' },
            { q: 'AI 서비스와 AI 포트폴리오는 무엇이 다른가요?',
              a: 'AI 서비스는 고객의 문제를 AI 서비스와 업무 시스템으로 구체화하는 휴미즈의 접근 방식을 설명합니다. AI 포트폴리오는 실제 개발 프로젝트의 문제 정의, 구현 범위와 현재 단계를 보여줍니다.' },
            { q: '프로젝트 문의 전에 무엇을 준비하면 되나요?',
              a: '해결하고 싶은 문제, 현재 사용하는 시스템이나 데이터, 예상 사용자와 검토 일정을 알려주시면 됩니다.',
              note: '초기 문의에는 비밀번호, 개인정보 원문, 실제 고객 데이터 등 민감한 자료를 보내지 마세요.' },
          ]}
        />
      </Scene>

      <Scene mask="none">
        <InsightsEditorial articles={[]} />
      </Scene>

      <ClosingContact image={assets.A13} />
    </>
  );
}
