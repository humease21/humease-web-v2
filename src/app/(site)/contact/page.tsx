import { PageHero } from '@/components/sections/PageHero';
import { Section } from '@/components/sections/Section';
import { Reveal } from '@/components/interactive/Reveal';
import { ContactForm } from '@/components/contact/ContactForm';
import { assets } from '@/content/assets';
import { company } from '@/content/company';
import { CONTACT_MODE } from '@/content/contact';
import { pageMeta } from '@/lib/seo';
import { metaForPath } from '@/content/search-pages';
import { Arrow, Icon } from '@/components/ui/Icon';
import { A } from '@/components/ui/Link';

export const metadata = pageMeta({ ...metaForPath('/contact'), path: '/contact' });

/** 문의 전에 알면 좋은 진행 순서. 응답 시간 등 운영자가 확인하지 않은 약속은 쓰지 않는다. */
const NEXT_STEPS = [
  '문의 내용을 확인합니다',
  '필요한 경우 현재 환경과 요구 사항을 추가로 여쭙니다',
  '검토 방향과 진행 방식을 안내드립니다',
];

function ContactAside() {
  return (
    <div className="space-y-8">
      <Reveal delay={2}>
        <div>
          <h2 className="heading-md">이메일로 문의</h2>
          <A href={`mailto:${company.email}`} className="link-arrow mt-1">
            <Icon name="mail" size={18} />{company.email}
          </A>
        </div>
      </Reveal>
      <Reveal delay={3}>
        <div>
          <h2 className="heading-md">문의 후 진행</h2>
          <ol className="mt-3 space-y-3">
            {NEXT_STEPS.map((s, i) => (
              <li key={s} className="flex gap-3">
                <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full border border-[var(--color-line-strong)] text-[13px] font-semibold tabular-nums">{i + 1}</span>
                <span className="body pt-0.5">{s}</span>
              </li>
            ))}
          </ol>
        </div>
      </Reveal>
      <Reveal delay={4}>
        <p className="caption rounded-xl border border-[var(--color-line)] bg-[var(--color-subtle)] p-4">
          개인정보와 영업기밀 등 민감한 내용은 적지 말아 주세요.
        </p>
      </Reveal>
    </div>
  );
}

export default function Page() {
  // docs/03 P11 — 실제 동의·정책·저장경로 검증 전에는 비활성 폼을 억지로 공개하지 않고
  // 이메일 CTA 를 우선 노출한다. 운영자 확인 없이 응답 시간을 약속하지 않는다.
  if (CONTACT_MODE === 'disabled') {
    return (
      <>
        <PageHero
          eyebrow="문의"
          title={<>데이터와 AI,<br />다음 단계로</>}
          lead={<>기업의 현재 환경과 해결해야 할 문제를 알려주세요<br className="hidden sm:inline" /> 필요한 기술과 적용 방향을 함께 검토합니다</>}
          ctas={[{ label: company.email, href: `mailto:${company.email}` }]}
          image={assets.A13}
          breadcrumbs={[{ name: '홈', href: '/' }, { name: '문의', href: '/contact' }]}
        />
        <Section>
          <div className="max-w-[720px]">
            <Reveal as="h2" className="heading-xl">프로젝트 상담</Reveal>
            <Reveal delay={1}>
              <p className="lead mt-5">
                이메일로 연락해 주세요. 회사명, 담당자명, 연락처와 함께 현재 환경과 해결하고 싶은 과제를 알려주시면 확인 후 회신드리겠습니다.
              </p>
            </Reveal>
            <Reveal delay={2}>
              <A href={`mailto:${company.email}`} className="btn btn-primary mt-8">{company.email}<Arrow /></A>
            </Reveal>
          </div>
        </Section>
      </>
    );
  }

  // live 상태 — 요청서 017 §3-1: 스크롤 없이 첫 화면에서 바로 입력을 시작할 수 있도록
  // 안내(좌)와 실제 문의 폼(우)을 같은 화면에 둔다. 1024px(lg) 미만은 안내 → 폼 순서로 쌓인다.
  return (
    <PageHero
      eyebrow="문의"
      title={<>데이터와 AI,<br />다음 단계로</>}
      lead={<>기업의 현재 환경과 해결해야 할 문제를 알려주세요<br className="hidden sm:inline" /> 필요한 기술과 적용 방향을 함께 검토합니다</>}
      breadcrumbs={[{ name: '홈', href: '/' }, { name: '문의', href: '/contact' }]}
      aside={
        <div className="card !p-6 md:!p-10">
          <h2 className="heading-lg">프로젝트 상담</h2>
          <p className="body-sm mt-1">* 표시는 필수 항목입니다.</p>
          <ContactForm sourcePage="/contact" />
        </div>
      }
      belowLead={<ContactAside />}
    />
  );
}
