import { PageHero } from '@/components/sections/PageHero';
import { Section, Statement, SectionHeader } from '@/components/sections/Section';
import { ProcessSteps } from '@/components/sections/ProcessSteps';
import { ExperienceScene } from '@/components/sections/ExperienceScene';
import { ClosingContact } from '@/components/sections/ClosingContact';
import { Reveal } from '@/components/interactive/Reveal';
import { stagger } from '@/lib/stagger';
import { assets } from '@/content/assets';
import { company } from '@/content/company';
import { pageMeta } from '@/lib/seo';
import { metaForPath } from '@/content/search-pages';
import { Arrow, Icon, type IconName } from '@/components/ui/Icon';
import { A } from '@/components/ui/Link';

export const metadata = pageMeta({ ...metaForPath('/about'), path: '/about' });

/** 휴미즈가 다루는 영역 — 각 사업 페이지로 연결한다. 설명은 승인 카피를 줄였다. */
const DOMAINS: { title: string; body: string; href: string; icon: IconName }[] = [
  { title: '기업 데이터', body: '보존·검색·접근·통제·조사', href: '/enterprise-data', icon: 'database' },
  { title: 'AI 서비스', body: '설계·자동화·구현', href: '/consulting/ai-transformation', icon: 'spark' },
  { title: 'Arctera 솔루션', body: 'Capture에서, Compliance까지', href: '/solutions', icon: 'layers' },
  { title: 'AI 포트폴리오', body: '아이디어에서, 실제 AI 서비스로', href: '/ai-services', icon: 'compass' },
];

export default function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="휴미즈 소개"
        title={<>Enterprise IT에서,<br />AX까지</>}
        lead={<>20년 이상의 기업 IT 경험을 바탕으로<br className="hidden sm:inline" /> 데이터 거버넌스와 AI를 실제 비즈니스 환경에 연결합니다</>}
        ctas={[{ label: '프로젝트 문의', href: '/contact' }]}
        image={assets.A11}
        focus="60% 50%"
        breadcrumbs={[{ name: '홈', href: '/' }, { name: '회사소개', href: '/about' }]}
      />

      <Section>
        <Statement
          eyebrow="관점"
          title={<>기술보다 먼저,<br />문제의 본질</>}
          paragraphs={[
            <>기업의 IT 환경에는 데이터뿐 아니라<br className="hidden md:inline" /> 업무 방식, 보안 정책, 기존 시스템과 운영 제약이 함께 존재합니다</>,
            <>휴미즈는 현재 환경을 먼저 이해한 뒤<br className="hidden md:inline" /> 필요한 기술과 실행 순서를 설계합니다</>,
          ]}
        />
      </Section>

      <Section tone="alt">
        <Statement
          eyebrow="연결"
          title={<>데이터 기반에서,<br />AI 활용으로</>}
          paragraphs={[
            '기업 데이터와 AI는 분리된 영역이 아닙니다',
            <>신뢰할 수 있는 데이터 기반 위에서<br className="hidden md:inline" /> AI가 실제 업무와 서비스에 활용될 수 있도록 연결합니다</>,
          ]}
        />
        <ul className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {DOMAINS.map((d, i) => (
            <Reveal as="li" key={d.href} delay={stagger(i)} className="card card-link">
              <span className="icon-tile"><Icon name={d.icon} /></span>
              <h3 className="heading-md mt-4"><A href={d.href} className="stretched">{d.title}</A></h3>
              <p className="body-sm mt-1">{d.body}</p>
              <span className="mt-4 text-[var(--color-muted)]"><Arrow /></span>
            </Reveal>
          ))}
        </ul>
      </Section>

      <Section>
        <SectionHeader eyebrow="우리가 일하는 방식" title="이해 · 설계 · 구현 · 검증" />
        <div className="mt-10">
          <ProcessSteps steps={[
            { k: '이해', v: '환경과 문제 정의' },
            { k: '설계', v: '데이터·업무·기술 연결' },
            { k: '구현', v: '실제 서비스 개발' },
            { k: '검증', v: '사용과 운영을 통한 개선' },
          ]} />
        </div>
      </Section>

      <ExperienceScene aboutCopy />

      <Section tight>
        <dl className="grid gap-6 rounded-2xl border border-[var(--color-line)] bg-[var(--color-surface)] p-6 sm:grid-cols-3 md:p-8">
          <div>
            <dt className="caption">회사명</dt>
            <dd className="mt-1 text-[17px] font-semibold">{company.nameKo}</dd>
          </div>
          {company.representative && (
            <div>
              <dt className="caption">대표</dt>
              <dd className="mt-1 text-[17px] font-semibold">{company.representative}</dd>
            </div>
          )}
          <div>
            <dt className="caption">문의</dt>
            <dd className="mt-1 text-[17px] font-semibold">
              <a href={`mailto:${company.email}`} className="underline decoration-[var(--color-line-strong)] underline-offset-[6px] hover:decoration-current">{company.email}</a>
            </dd>
          </div>
        </dl>
      </Section>

      <ClosingContact />
    </>
  );
}
