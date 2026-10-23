import { Reveal } from '@/components/interactive/Reveal';
import { company } from '@/content/company';
import { Arrow, Icon } from '@/components/ui/Icon';
import { A } from '@/components/ui/Link';

/** 페이지 마지막 문의 유도 밴드. 브랜드 다크 톤 위에 핵심 CTA 하나와 이메일 대안을 둔다. */
export function ClosingContact({
  title = <>데이터와 AI,<br />다음 단계로</>,
  lead = <>현재 환경과 해결해야 할 문제를 알려주세요<br className="hidden sm:inline" /> 필요한 기술과 실행 방향을 함께 검토합니다</>,
  ctaLabel = '프로젝트 문의',
}: {
  title?: React.ReactNode;
  lead?: React.ReactNode;
  ctaLabel?: string;
}) {
  return (
    <section className="on-dark section" aria-labelledby="closing-contact-title">
      <div className="shell">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] lg:items-end lg:gap-16">
          <div>
            <Reveal as="p" className="eyebrow">문의</Reveal>
            <Reveal delay={1}><h2 id="closing-contact-title" className="heading-xl mt-4">{title}</h2></Reveal>
            <Reveal delay={2}><p className="lead mt-5">{lead}</p></Reveal>
          </div>
          <Reveal delay={3}>
            <div className="flex flex-col gap-3 sm:flex-row lg:flex-col lg:items-stretch">
              <A href="/contact" className="btn btn-primary">{ctaLabel}<Arrow /></A>
              <A href={`mailto:${company.email}`} className="btn btn-secondary">
                <Icon name="mail" size={18} />{company.email}
              </A>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
