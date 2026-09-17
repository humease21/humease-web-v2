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
  { k: '이해', v: '환경과 문제 정의' },
  { k: '설계', v: '데이터·업무·기술 연결' },
  { k: '구현', v: '실제 서비스 개발' },
  { k: '검증', v: '사용과 운영을 통한 개선' },
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
        titleKo={<>기업 데이터에서,<br />AX 실행까지</>}
        lead={<>기업 데이터의 보존·통제·컴플라이언스부터<br />AI 서비스 설계와 구현까지<br /><br />휴미즈는 20년 이상의 Enterprise IT 경험을<br />실제 AX 실행으로 연결합니다</>}
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
          titleKo={<>Enterprise IT 경험,<br />AX의 기반</>}
          paragraphs={[<>기업의 복잡한 IT 환경과 운영 제약을 이해하고<br />데이터 거버넌스부터 AI 활용까지<br />실행 가능한 구조로 설계합니다</>]}
          measure={false}
        />
      </Scene>

      {/* 01 ENTERPRISE DATA */}
      <NumberedScene
        ordinal="01"
        eyebrow="기업 데이터"
        titleKo={<>보관을 넘어,<br />데이터 거버넌스로</>}
        lead={<>무엇을 남기고, 누가 접근하며<br />필요한 순간 어떻게 찾고 활용할지<br /><br />기업 데이터의 전체 수명주기를<br />정책과 운영 기준에 맞춰 설계합니다</>}
        capabilities={[
          { title: '보존', body: '정책에 따라 필요한 데이터를 보존' },
          { title: '검색', body: '필요한 기록을 빠르게 탐색' },
          { title: '통제', body: '접근·검토·관리 기준 수립' },
          { title: '대응', body: '감사·조사·eDiscovery 대응 체계' },
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
            제품의 기능과 고객 환경에 맞는 해결방안을 살펴보세요
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
        titleKo={<>AI 도입에서,<br />업무 혁신으로</>}
        lead={<>기업의 문제와 업무 흐름을 먼저 정의하고<br />데이터·AI·사용자 경험을 연결해<br />실제 운영되는 서비스로 구현합니다</>}
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
        <Reveal delay={1} slow><h2 className="title-ko mt-6">문제에서,<br />작동하는 서비스까지</h2></Reveal>
        <ul className="mt-12">
          {HOW_WE_WORK.map((w, i) => (
            <Reveal as="li" key={w.k} delay={((i % 4) + 1) as 1 | 2 | 3 | 4} className="cap-row">
              <h3 className="font-[family-name:var(--font-sans)] text-[22px] text-[var(--color-accent)] md:text-[28px]">{w.k}</h3>
              <p className="lead">{w.v}</p>
            </Reveal>
          ))}
        </ul>
      </Scene>

      {/* AI PORTFOLIO — 데이터 기반 */}
      <Scene mask="none">
        <Reveal as="p" className="eyebrow">AI 포트폴리오</Reveal>
        <Reveal delay={1} slow><h2 className="title-ko mt-6">아이디어에서,<br />실제 서비스로</h2></Reveal>
        <Reveal delay={2}>
          <p className="lead mt-8">
            직접 기획하고 설계하며 구현한 AI 프로젝트를 통해<br />휴미즈의 실행 경험을 보여드립니다
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
              a: '휴미즈는 기업 데이터의 보존·검색·통제와 AI 서비스의 설계·구현을 전문 영역으로 하는 기술 기업입니다. 사업 영역은 전문 컨설팅 서비스, AI 개발 포트폴리오, Arctera 제품 정보를 구분하여 소개합니다.' },
            { q: 'AI 서비스와 AI 포트폴리오는 무엇이 다른가요?',
              a: 'AI 서비스는 고객의 문제를 업무 시스템으로 구체화하는 컨설팅 서비스를 설명합니다. AI 포트폴리오는 실제 구현된 프로젝트의 문제 정의, 해결 방안과 현재 단계를 보여줍니다.' },
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
