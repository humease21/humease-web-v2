import type { Asset } from '@/content/assets';
import { PageHero } from '@/components/sections/PageHero';
import { Section, Statement, SectionHeader } from '@/components/sections/Section';
import { ClosingContact } from '@/components/sections/ClosingContact';
import { RelatedLinks, relatedServices } from '@/components/sections/RelatedLinks';
import { QuestionList } from '@/components/content/QuestionList';
import { Reveal } from '@/components/interactive/Reveal';
import { stagger } from '@/lib/stagger';
import { Arrow, Icon, type IconName } from '@/components/ui/Icon';
import { A } from '@/components/ui/Link';

/**
 * 전문 컨설팅 상세(e-Discovery · 내부 통제 · Exchange 아카이빙) 공통 골격.
 * 히어로 → 과제 정의 → 검토 범위 → FAQ·상담 → 연관 서비스 → 문의 순서로 같은 경험을 준다.
 */
export function ConsultingPage({
  path, eyebrow, title, lead, image, problemTitle, problemBody, scope, faq, ctaLabel,
}: {
  path: string;
  eyebrow: string;
  title: React.ReactNode;
  lead: React.ReactNode;
  image: Asset;
  problemTitle: React.ReactNode;
  problemBody: string;
  scope: { k: string; v: string; icon: IconName }[];
  faq: { q: string; a: string }[];
  ctaLabel: string;
}) {
  return (
    <>
      <PageHero
        eyebrow={eyebrow}
        title={title}
        lead={lead}
        ctas={[{ label: ctaLabel, href: '/contact' }, { label: '검토 범위 보기', href: '#scope', primary: false }]}
        image={image}
        breadcrumbs={[{ name: '홈', href: '/' }, { name: '사업영역' }, { name: eyebrow, href: path }]}
      />

      <Section tone="alt">
        <Statement eyebrow="과제" title={problemTitle} paragraphs={[problemBody]} />
      </Section>

      <Section id="scope" labelledBy="scope-title">
        <SectionHeader eyebrow="검토 범위" id="scope-title" title="휴미즈가 함께 정리하는 것" />
        <ol className="mt-10 grid gap-4 md:grid-cols-3">
          {scope.map((s, i) => (
            <Reveal as="li" key={s.k} delay={stagger(i)} className="card">
              <div className="flex items-center justify-between">
                <span className="icon-tile"><Icon name={s.icon} /></span>
                <span className="text-[14px] font-semibold tabular-nums text-[var(--color-muted)]">{String(i + 1).padStart(2, '0')}</span>
              </div>
              <h3 className="heading-lg mt-5">{s.k}</h3>
              <p className="body-sm mt-2">{s.v}</p>
            </Reveal>
          ))}
        </ol>
      </Section>

      <Section tone="alt">
        <QuestionList items={faq} lead={
          <A href="/contact" className="btn btn-primary mt-2">{ctaLabel}<Arrow /></A>
        } />
      </Section>

      <Section tight>
        <RelatedLinks items={relatedServices(path)} />
      </Section>

      <ClosingContact />
    </>
  );
}
