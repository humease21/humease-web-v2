import { Hero } from '@/components/brand/Hero';
import { Section } from '@/components/sections/Section';
import { ButtonLink } from '@/components/ui/Button';
import { company } from '@/content/company';
import { pageMeta } from '@/lib/seo';

export const metadata = pageMeta({
  title: '인사이트 | 휴미즈',
  description: 'Enterprise Data와 Applied AI를 현장에 연결하는 휴미즈의 생각과 기록. 데이터 컴플라이언스와 AI 서비스 개발 인사이트를 만나보세요.',
  path: '/insights',
});

/** docs/03 P12 — 확인한 실제 글만 노출. 없으면 빈 카드·빈 필터를 만들지 않는다. */
const articles: { title: string; date: string; category: string; href: string; summary: string }[] = [];

export default function Page() {
  return (
    <>
      <Hero
        eyebrow="INSIGHTS"
        titleKo="기술을 이해하고, 현장에 연결하는 기록."
        lead="Enterprise Data와 Applied AI의 실무에서 마주하는 질문과 생각을 나눕니다."
        priority
      />
      <Section>
        {articles.length === 0 ? (
          <div className="max-w-2xl">
            <p className="body-lg">
              휴미즈 블로그에서 기술과 프로젝트에 대한 기록을 확인하실 수 있습니다.
            </p>
            <div className="mt-8">
              <ButtonLink href={company.blogUrl}>휴미즈 블로그 보기</ButtonLink>
            </div>
          </div>
        ) : null}
      </Section>
    </>
  );
}
