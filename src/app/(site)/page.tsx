import { PageHero } from '@/components/sections/PageHero';
import { Section, SectionHeader } from '@/components/sections/Section';
import { FeatureSplit } from '@/components/sections/FeatureSplit';
import { ProcessSteps } from '@/components/sections/ProcessSteps';
import { PortfolioList } from '@/components/sections/PortfolioList';
import { ExperienceScene } from '@/components/sections/ExperienceScene';
import { InsightsEditorial } from '@/components/sections/InsightsEditorial';
import { ClosingContact } from '@/components/sections/ClosingContact';
import { Reveal } from '@/components/interactive/Reveal';
import { stagger } from '@/lib/stagger';
import { QuestionList } from '@/components/content/QuestionList';
import { assets } from '@/content/assets';
import { featuredProjects } from '@/content/portfolio';
import { products } from '@/content/solutions';
import { pageMeta } from '@/lib/seo';
import { metaForPath, pageByPath } from '@/content/search-pages';
import { JsonLd, organizationNode, websiteNode, webPageNode } from '@/lib/structured-data';
import { Arrow, Icon, type IconName } from '@/components/ui/Icon';
import { A } from '@/components/ui/Link';

export const metadata = pageMeta({ ...metaForPath('/'), path: '/' });

/** 첫 화면 바로 아래의 사업영역 바로가기. 설명은 각 페이지의 승인 카피를 줄였다. */
const AREAS: { title: string; body: string; href: string; icon: IconName }[] = [
  { title: '기업 데이터', body: '보존·검색·접근·통제·조사까지 기업 데이터의 수명주기를 설계합니다.', href: '/enterprise-data', icon: 'database' },
  { title: 'AI 서비스', body: '데이터·업무·사용자 경험을 연결해 실제 운영되는 AI 서비스를 구현합니다.', href: '/consulting/ai-transformation', icon: 'spark' },
  { title: 'Arctera 솔루션', body: '기업 커뮤니케이션의 수집·보존·감독·조사를 위한 제품 정보를 소개합니다.', href: '/solutions', icon: 'layers' },
];

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

      <PageHero
        home
        eyebrow="HUMEASE · Enterprise Data & AI"
        title={<>기업 데이터에서,<br />AX 실행까지</>}
        lead={<>기업 데이터의 보존·통제·컴플라이언스부터<br className="hidden sm:inline" /> AI 서비스 설계와 구현까지<br /><br />휴미즈는 20년 이상의 Enterprise IT 경험을<br className="hidden sm:inline" /> 실제 AX 실행으로 연결합니다</>}
        ctas={[
          { label: '프로젝트 문의', href: '/contact' },
          { label: '사업영역 살펴보기', href: '#business', primary: false },
        ]}
        image={assets.A01}
        imagePortrait={assets.A02}
        focus="70% 50%"
      />

      {/* 사업영역 한눈에 */}
      <Section id="business" tight labelledBy="areas-title">
        <h2 id="areas-title" className="sr-only">사업영역</h2>
        <ul className="grid gap-4 md:grid-cols-3">
          {AREAS.map((a, i) => (
            <Reveal as="li" key={a.href} delay={stagger(i)} className="card card-link">
              <span className="icon-tile"><Icon name={a.icon} /></span>
              <h3 className="heading-lg mt-5"><A href={a.href} className="stretched">{a.title}</A></h3>
              <p className="body-sm mt-2 flex-1">{a.body}</p>
              <span className="mt-5 inline-flex items-center gap-2 text-[15px] font-semibold">자세히 보기<Arrow /></span>
            </Reveal>
          ))}
        </ul>
      </Section>

      {/* 문제 → 해답 */}
      <Section tone="alt" labelledBy="why-title">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
          <div>
            <Reveal as="p" className="eyebrow">왜 휴미즈인가</Reveal>
            <Reveal delay={1}><h2 id="why-title" className="heading-xl mt-4">Enterprise IT 경험,<br />AX의 기반</h2></Reveal>
            <Reveal delay={2}>
              <p className="lead mt-5">기업의 복잡한 IT 환경과 운영 제약을 이해하고<br className="hidden md:inline" /> 데이터 거버넌스부터 AI 활용까지<br className="hidden md:inline" /> 실행 가능한 구조로 설계합니다</p>
            </Reveal>
          </div>
          <Reveal delay={2}>
            <div className="grid gap-3">
              <div className="rounded-xl border border-[var(--color-line)] bg-[var(--color-bg)] p-6 md:p-7">
                <p className="text-[14px] font-semibold text-[var(--color-muted)]">흩어진 데이터</p>
                <p className="heading-lg mt-2 text-[var(--color-body)]">흩어진 데이터,<br />제각각인 관리 기준</p>
              </div>
              <div aria-hidden="true" className="flex justify-center text-[var(--color-muted)]">
                <Icon name="arrow-right" size={22} className="rotate-90" />
              </div>
              <div className="rounded-xl bg-[var(--color-text)] p-6 text-[var(--color-bg)] md:p-7">
                <p className="text-[14px] font-semibold text-[#C7B99D]">이해할 수 있는 정보로</p>
                <p className="heading-lg mt-2">데이터 거버넌스에서,<br />AX 실행까지</p>
              </div>
            </div>
          </Reveal>
        </div>
      </Section>

      {/* 01 기업 데이터 */}
      <Section labelledBy="enterprise-data-title">
        <FeatureSplit
          index="01"
          eyebrow="기업 데이터"
          headingId="enterprise-data-title"
          title={<>보관을 넘어,<br />데이터 거버넌스로</>}
          lead={<>무엇을 남기고, 누가 접근하며<br className="hidden md:inline" /> 필요한 순간 어떻게 찾고 활용할지<br /><br />기업 데이터의 전체 수명주기를<br className="hidden md:inline" /> 정책과 운영 기준에 맞춰 설계합니다</>}
          capabilities={[
            { title: '보존', body: '정책에 따라 필요한 데이터를 보존', icon: 'archive' },
            { title: '검색', body: '필요한 기록을 빠르게 탐색', icon: 'search' },
            { title: '통제', body: '접근·검토·관리 기준 수립', icon: 'shield' },
            { title: '대응', body: '감사·조사·eDiscovery 대응 체계', icon: 'scale' },
          ]}
          cta={{ label: '기업 데이터 알아보기', href: '/enterprise-data' }}
          image={assets.A04}
        />
      </Section>

      {/* Arctera 솔루션 연결 */}
      <Section tone="alt" tight labelledBy="arctera-title">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:items-center lg:gap-14">
          <div>
            <Reveal as="p" className="eyebrow">Arctera 솔루션</Reveal>
            <Reveal delay={1}>
              <h2 id="arctera-title" className="heading-lg mt-4">제품의 기능과 고객 환경에 맞는 해결방안을 살펴보세요</h2>
            </Reveal>
            <Reveal delay={2}>
              <A href="/solutions" className="link-arrow mt-4">Arctera 솔루션 보기<Arrow /></A>
            </Reveal>
          </div>
          <ul className="grid gap-3 sm:grid-cols-2">
            {products.map((p, i) => (
              <Reveal as="li" key={p.slug} delay={stagger(i)}>
                <A href={`/solutions/${p.slug}`}
                  className="flex min-h-[72px] items-center justify-between gap-4 rounded-xl border border-[var(--color-line)] bg-[var(--color-surface)] px-5 py-4 text-[16px] font-semibold transition-colors hover:border-[var(--color-line-strong)]">
                  <span>{p.name}</span><Arrow />
                </A>
              </Reveal>
            ))}
          </ul>
        </div>
      </Section>

      {/* 02 AI 서비스 */}
      <Section labelledBy="ai-service-title">
        <FeatureSplit
          index="02"
          eyebrow="AI 서비스"
          headingId="ai-service-title"
          reverse
          title={<>AI 도입에서,<br />업무 혁신으로</>}
          lead={<>기업의 문제와 업무 흐름을 먼저 정의하고<br className="hidden md:inline" /> 데이터·AI·사용자 경험을 연결해<br className="hidden md:inline" /> 실제 운영되는 서비스로 구현합니다</>}
          capabilities={[
            { title: 'AI 서비스 기획', body: '해결할 문제와 사용할 사람을 먼저 정합니다.', icon: 'target' },
            { title: '대화형 서비스', body: '대화 경험과 데이터 흐름을 설계합니다.', icon: 'chat' },
            { title: '업무 자동화', body: '반복 업무와 정보 흐름을 검증 가능한 범위로 연결합니다.', icon: 'flow' },
            { title: '웹 애플리케이션·프로토타입', body: '핵심 가설을 확인할 수 있는 범위부터 구현합니다.', icon: 'code' },
          ]}
          cta={{ label: 'AI 서비스 알아보기', href: '/consulting/ai-transformation' }}
          image={assets.A08}
        />
      </Section>

      {/* 일하는 방식 */}
      <Section tone="alt" labelledBy="process-title">
        <SectionHeader eyebrow="일하는 방식" id="process-title" title={<>문제에서,<br />작동하는 서비스까지</>} />
        <div className="mt-10 md:mt-12"><ProcessSteps steps={HOW_WE_WORK} /></div>
      </Section>

      {/* AI 포트폴리오 */}
      <Section labelledBy="portfolio-title">
        <SectionHeader
          align="split"
          eyebrow="AI 포트폴리오"
          id="portfolio-title"
          title={<>아이디어에서,<br />실제 서비스로</>}
          lead={<>직접 기획하고 설계하며 구현한 AI 프로젝트를 통해<br className="hidden md:inline" /> 휴미즈의 실행 경험을 보여드립니다</>}
          action={{ label: '전체 AI 포트폴리오 보기', href: '/ai-services' }}
        />
        <div className="mt-10 md:mt-12"><PortfolioList items={featuredProjects(3)} /></div>
      </Section>

      <ExperienceScene />

      {/* §6.2 — 홈에서 실제로 궁금해할 것만. 상담 문구를 반복하지 않는다. */}
      <Section>
        <QuestionList
          headingLevel="title"
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
      </Section>

      <Section tone="alt" tight>
        <InsightsEditorial articles={[]} />
      </Section>

      <ClosingContact />
    </>
  );
}
