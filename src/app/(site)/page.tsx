import { PageHero } from '@/components/sections/PageHero';
import { Section, Statement, SectionHeader } from '@/components/sections/Section';
import { ProcessSteps } from '@/components/sections/ProcessSteps';
import { ClosingContact } from '@/components/sections/ClosingContact';
import { assets } from '@/content/assets';
import { pageMeta } from '@/lib/seo';
import { metaForPath, pageByPath } from '@/content/search-pages';
import { JsonLd, organizationNode, websiteNode, webPageNode } from '@/lib/structured-data';

export const metadata = pageMeta({ ...metaForPath('/'), path: '/' });

/**
 * 임시 단일 홈 (src/content/site-mode.ts). 기존 회사소개(/about) 페이지의 승인 카피와 구성을 그대로 재사용한다.
 * 순서: 휴미즈 소개 → 관점 → 연결 → 우리가 일하는 방식 → 문의.
 * 닫힌 상세 페이지로 가는 링크(연결 구간의 영역 카드, 브레드크럼)는 두지 않는다.
 */
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
        eyebrow="휴미즈 소개"
        title={<>Enterprise IT에서,<br />AX까지</>}
        lead={<>20년 이상의 기업 IT 경험을 바탕으로<br className="hidden sm:inline" /> 데이터 거버넌스와 AI를 실제 비즈니스 환경에 연결합니다</>}
        ctas={[{ label: '프로젝트 문의', href: '/contact' }]}
        image={assets.A11}
        focus="60% 50%"
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

      <ClosingContact />
    </>
  );
}
