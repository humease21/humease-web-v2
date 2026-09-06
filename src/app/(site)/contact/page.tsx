import { CinematicHero } from '@/components/brand/CinematicHero';
import { Scene } from '@/components/sections/Scene';
import { Reveal } from '@/components/interactive/Reveal';
import { assets } from '@/content/assets';
import { company } from '@/content/company';
import { CONTACT_MODE, contactFields } from '@/content/contact';
import { pageMeta } from '@/lib/seo';
import { metaForPath } from '@/content/search-pages';
import { A } from '@/components/ui/Link';

export const metadata = pageMeta({ ...metaForPath('/contact'), path: '/contact' });

export default function Page() {
  return (
    <>
      <CinematicHero
        eyebrow="문의"
        titleKo="어떤 문제를 함께 해결할까요?"
        lead="현재 상황과 기대하는 변화를 알려주세요. 필요한 접근 방식과 다음 단계를 함께 살펴보겠습니다."
        ctas={[{ label: company.email, href: `mailto:${company.email}` }]}
        image={assets.A13}
        ambient="silver"
      />

      <Scene mask="none">
        {/*
          docs/03 P11 — 실제 동의·정책·저장경로 검증 전에는 비활성 폼을 억지로 공개하지 않고
          이메일 CTA 를 우선 노출한다. 운영자 확인 없이 응답 시간을 약속하지 않는다.
        */}
        {CONTACT_MODE === 'disabled' && (
          <div className="grid gap-12 lg:grid-cols-[minmax(0,5fr)_minmax(0,5fr)] lg:gap-24">
            <div>
              <Reveal as="p" className="eyebrow">연락 방법</Reveal>
              <Reveal delay={1} slow>
                <h2 className="title-ko-sm mt-6">온라인 문의 폼은 준비 중입니다.</h2>
              </Reveal>
              <Reveal delay={2}>
                <p className="lead measure mt-7">
                  지금은 이메일로 연락해 주세요. 회사명, 담당자명, 연락처와 함께 현재 환경과 해결하고 싶은 과제를 알려주시면 확인 후 회신드리겠습니다.
                </p>
              </Reveal>
              <Reveal delay={3}>
                <p className="mt-5 text-[14px] text-[var(--color-muted)]">
                  개인정보와 영업기밀 등 민감한 내용은 적지 말아 주세요.
                </p>
              </Reveal>
              <Reveal delay={4}>
                <A href={`mailto:${company.email}`} className="cta-primary mt-11">
                  {company.email}<span aria-hidden="true">→</span>
                </A>
              </Reveal>
            </div>

            <div className="self-end">
              <Reveal delay={2}>
                <p className="text-[12px] uppercase tracking-[0.18em] text-[var(--color-muted)]">준비 중인 문의 항목</p>
              </Reveal>
              <ul className="mt-6">
                {contactFields.map((f, i) => (
                  <Reveal as="li" key={f.name} delay={((i % 4) + 1) as 1 | 2 | 3 | 4}>
                    <span className="block border-t border-[color-mix(in_srgb,var(--color-line)_50%,transparent)] py-4 text-[15px] text-[var(--color-muted)]">
                      {f.label}{f.required ? ' *' : ''}
                    </span>
                  </Reveal>
                ))}
              </ul>
            </div>
          </div>
        )}
      </Scene>
    </>
  );
}
