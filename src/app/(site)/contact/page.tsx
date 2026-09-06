import Image from 'next/image';
import { Hero } from '@/components/brand/Hero';
import { Section } from '@/components/sections/Section';
import { ButtonLink } from '@/components/ui/Button';
import { assets } from '@/content/assets';
import { company } from '@/content/company';
import { CONTACT_MODE, contactFields } from '@/content/contact';
import { pageMeta } from '@/lib/seo';

export const metadata = pageMeta({
  title: '프로젝트 문의 | 휴미즈',
  description: 'Enterprise Data와 Applied AI 프로젝트를 문의하세요. 현재 환경과 해결하고 싶은 과제를 알려주시면 확인 후 회신드리겠습니다.',
  path: '/contact',
});

export default function Page() {
  return (
    <>
      <Hero
        eyebrow="LET'S TALK"
        titleKo="어떤 문제를 함께 해결할까요?"
        lead="현재 상황과 기대하는 변화를 알려주세요. 필요한 접근 방식과 다음 단계를 함께 살펴보겠습니다."
        ctas={[{ label: company.email, href: `mailto:${company.email}` }]}
        priority
      />

      <Section eyebrow="CONTACT" title="문의 방법">
        {/*
          docs/03 P11 — 실제 동의·정책·저장경로 검증 전에는 비활성 폼을 억지로 공개하지 않고
          이메일 CTA 를 우선 노출한다. 운영자 확인 없이 응답 시간을 약속하지 않는다.
        */}
        {CONTACT_MODE === 'disabled' ? (
          <div className="mt-10 max-w-2xl rounded-2xl border border-[var(--color-line)] bg-[var(--color-surface)] p-7 md:p-9">
            <p className="text-lg font-medium text-[var(--color-text)]">
              온라인 문의 폼은 준비 중입니다.
            </p>
            <p className="body-lg mt-3">
              지금은 이메일로 연락해 주세요. 회사명, 담당자명, 연락처와 함께 현재 환경과 해결하고 싶은 과제를 알려주시면 확인 후 회신드리겠습니다.
            </p>
            <p className="mt-4 text-sm text-[var(--color-muted)]">
              개인정보와 영업기밀 등 민감한 내용은 적지 말아 주세요.
            </p>
            <div className="mt-7">
              <ButtonLink href={`mailto:${company.email}`}>{company.email}</ButtonLink>
            </div>
            <div className="mt-9 border-t border-[var(--color-line)]/60 pt-6">
              <p className="text-sm font-medium text-[var(--color-muted)]">준비 중인 문의 항목</p>
              <ul className="mt-3 flex flex-wrap gap-x-4 gap-y-2 text-sm text-[var(--color-muted)]">
                {contactFields.map((f) => (
                  <li key={f.name}>{f.label}{f.required ? ' *' : ''}</li>
                ))}
              </ul>
            </div>
          </div>
        ) : null}

        <div className="mt-14 max-w-md overflow-hidden rounded-2xl border border-[var(--color-line)]/50">
          <Image src={assets.A13.src} alt="" width={assets.A13.width} height={assets.A13.height}
            sizes="(max-width: 767px) 100vw, 380px" className="h-40 w-full object-cover" />
        </div>
      </Section>
    </>
  );
}
