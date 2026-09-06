import { CinematicHero } from '@/components/brand/CinematicHero';
import { Scene, Statement } from '@/components/sections/Scene';
import { ClosingContact } from '@/components/sections/ClosingContact';
import { Reveal } from '@/components/interactive/Reveal';
import { assets } from '@/content/assets';
import { challenges, products, RELATIONSHIP_NOTICE, PRODUCT_INFO_VERIFIED_AT } from '@/content/solutions';
import { pageMeta } from '@/lib/seo';
import { A } from '@/components/ui/Link';

export const metadata = pageMeta({
  title: 'Arctera Solutions | 휴미즈',
  description: '기업 데이터의 보존부터 컴플라이언스와 eDiscovery까지. Enterprise Vault, Capture (formerly Merge1), Data Insight, eDiscovery Platform의 역할과 적용 검토 항목을 한국어로 안내합니다.',
  path: '/solutions',
});

export default function Page() {
  return (
    <>
      <CinematicHero
        eyebrow="ARCTERA SOLUTIONS"
        titleKo="기업 데이터의 보존부터, 컴플라이언스와 eDiscovery까지."
        lead="기업의 커뮤니케이션과 정보를 수집하고, 보존하고, 필요한 순간 찾을 수 있도록. 주요 Arctera 솔루션의 역할과 적용 시 검토할 사항을 한국어로 안내합니다."
        ctas={[
          { label: '주요 제품 살펴보기', href: '#products' },
          { label: '솔루션 상담', href: '/contact', primary: false },
        ]}
        image={assets.A12}
        ambient="silver"
      />

      <Scene mask="none">
        <Statement
          eyebrow="OUR ROLE"
          titleKo="휴미즈는 고객의 데이터 환경과 운영 요구를 바탕으로 제품의 적용 범위와 연계 구성을 함께 검토합니다."
        />
      </Scene>

      <Scene image={assets.A04} mask="scene">
        <Reveal as="p" className="eyebrow">해결할 수 있는 6가지 업무 과제</Reveal>
        <ul className="mt-10">
          {challenges.map((c, i) => (
            <Reveal as="li" key={c.en} delay={((i % 4) + 1) as 1 | 2 | 3 | 4} className="cap-row">
              <div>
                <h2 className="text-[15px] font-semibold text-[var(--color-text)]">{c.ko}</h2>
                <p className="mt-1 text-[12px] uppercase tracking-[0.14em] text-[var(--color-muted)]">{c.en}</p>
              </div>
              <p className="text-[15px] leading-[1.75] text-[var(--color-muted)]">{c.body}</p>
            </Reveal>
          ))}
        </ul>
        <Reveal delay={4}>
          <p className="mt-10 text-[13px] leading-relaxed text-[var(--color-muted)]">
            위 분류는 Arctera 공식 솔루션 분류를 바탕으로 정리했습니다. 분류 전체가 아래 네 제품의 단일 라이선스에 모두 포함된다는 뜻은 아닙니다.
          </p>
        </Reveal>
      </Scene>

      <section id="products" className="scene overflow-hidden">
        <div className="shell w-full">
          <Reveal as="p" className="eyebrow">핵심 제품</Reveal>
          <ul className="mt-10">
            {products.map((p, i) => (
              <Reveal as="li" key={p.slug} delay={((i % 4) + 1) as 1 | 2 | 3 | 4}>
                {/* 구 사이트 앵커 진입 보존. sticky header 에 가리지 않도록 scroll-margin 을 둔다. */}
                <article id={p.anchor} className="cap-row scroll-mt-28">
                  <h2 className="text-[17px] font-semibold leading-snug text-[var(--color-text)]">
                    <A href={`/solutions/${p.slug}`} className="transition-colors hover:text-[var(--color-accent)]">{p.name}</A>
                  </h2>
                  <div>
                    <p className="text-[15px] leading-[1.75] text-[var(--color-muted)]">{p.role}</p>
                    <A href={`/solutions/${p.slug}`} className="mt-3 inline-block text-[14px] font-medium text-[var(--color-accent)]">
                      자세히 보기 →
                    </A>
                  </div>
                </article>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      <Scene mask="none">
        <Statement
          eyebrow="REVIEW TOGETHER"
          titleKo="고객 환경에서 함께 검토할 항목"
          paragraphs={['현재 시스템과 데이터 소스, 보존 및 검색 요구, 사용자와 운영자 흐름, 연계 조건, 도입·이관 범위.']}
        />
        <Reveal delay={3}>
          <ul className="mt-12 flex flex-wrap gap-x-10 gap-y-3 text-[14px] text-[var(--color-muted)]">
            <li><A className="transition-colors hover:text-[var(--color-accent)]" href="/consulting/e-discovery">e-Discovery 컨설팅</A></li>
            <li><A className="transition-colors hover:text-[var(--color-accent)]" href="/consulting/internal-control">Internal Control 컨설팅</A></li>
            <li><A className="transition-colors hover:text-[var(--color-accent)]" href="/consulting/exchange-archive">Exchange Archive 컨설팅</A></li>
          </ul>
        </Reveal>
        <Reveal delay={4}>
          <div className="mt-16 border-t border-[color-mix(in_srgb,var(--color-line)_55%,transparent)] pt-8">
            <p className="measure text-[14px] leading-[1.8] text-[var(--color-muted)]">{RELATIONSHIP_NOTICE}</p>
            <p className="mt-3 text-[13px] text-[var(--color-muted)]">제품 정보 확인일: {PRODUCT_INFO_VERIFIED_AT}</p>
          </div>
        </Reveal>
      </Scene>

      <ClosingContact />
    </>
  );
}
