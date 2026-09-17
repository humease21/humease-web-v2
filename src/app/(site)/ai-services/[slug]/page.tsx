import { notFound } from 'next/navigation';
import { CinematicHero } from '@/components/brand/CinematicHero';
import { Scene, Statement } from '@/components/sections/Scene';
import { Reveal } from '@/components/interactive/Reveal';
import { assets } from '@/content/assets';
import { publishedProjects, projectBySlug } from '@/content/portfolio';
import { pageMeta } from '@/lib/seo';
import {
  JsonLd, organizationNode, websiteNode, webPageNode, breadcrumbNode, creativeWorkNode,
} from '@/lib/structured-data';
import { A } from '@/components/ui/Link';

/**
 * 상세 페이지 전용 대표메시지·Lead·Problem/Solution 헤드라인.
 * 줄바꿈이 필요해 JSX 로 두며(데이터 파일은 .ts 라 JSX 를 담지 못한다), 프로젝트 데이터(portfolio.ts)와는 분리한다.
 */
const detailCopy: Record<string, {
  headline: React.ReactNode;
  lead: React.ReactNode;
  problem: React.ReactNode;
  solution: React.ReactNode;
}> = {
  'mom-ie': {
    headline: <>친구처럼 곁에,<br />가족과 더 가까이</>,
    lead: <>말 한마디로 일상을 돕고<br />지난 이야기를 기억하며<br />가족과 연결되는 AI 친구</>,
    problem: <>짧은 안부를,<br />더 깊은 대화로</>,
    solution: <>부모님의 이야기에서<br />시작되는 연결</>,
  },
  anybuild: {
    headline: <>아이디어에서,<br />실행 가능한 서비스로</>,
    lead: <>막연한 아이디어를<br />사용자 문제·기능·서비스 구조와<br />개발 범위로 구체화합니다</>,
    problem: '아이디어와 실행 사이의 간격',
    solution: <>생각을,<br />구현 가능한 구조로</>,
  },
  hairai: {
    headline: <>변화 전에,<br />먼저 확인</>,
    lead: <>사진 한 장으로<br />나에게 어울리는 헤어스타일을 탐색하는<br />AI 이미지 서비스</>,
    problem: <>선택하기 어려운<br />스타일 변화</>,
    solution: <>사진 한 장에서 시작되는<br />스타일 탐색</>,
  },
  'k-bestie': {
    headline: <>아이의 이야기에서,<br />가족의 대화로</>,
    lead: <>AI 친구와 아이의 자연스러운 대화를<br />부모의 이해와 가족 소통으로 연결합니다</>,
    problem: <>&quot;몰라&quot; 너머의<br />아이 이야기</>,
    solution: <>AI 친구가 만드는<br />새로운 대화의 계기</>,
  },
};

/** 공개 승인된 slug 만 정적 생성한다. draft 는 HTML 도 만들지 않는다. */
export function generateStaticParams() {
  return publishedProjects().map((p) => ({ slug: p.slug }));
}

export const dynamicParams = false;

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const p = projectBySlug(slug);
  if (!p) return {};
  const isMomIe = p.slug === 'mom-ie';
  return pageMeta({
    // §5.3 — 미확인 상태를 '정식 출시'·'고객 운영 중'·'휴미즈 소유 제품'으로 추정하지 않는다.
    title: isMomIe
      ? '맘이음 · 가족 소통 AI 개발 프로젝트 | 휴미즈'
      : `${p.name} · ${p.category} | 휴미즈 포트폴리오`,
    description: isMomIe
      ? '친구처럼 곁에 있고, 비서처럼 도와주고, 가족과 연결해주는 AI 맘이음의 개발 방향을 소개합니다. 현재 개발 중인 프로젝트입니다.'
      : `${p.summary}. 휴미즈 AI 포트폴리오에서 프로젝트의 배경과 현재 단계를 확인하세요.`,
    path: `/ai-services/${p.slug}`,
  });
}

function Block({ title, children }: { title: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="cap-row">
      <h2 className="text-[15px] font-semibold tracking-[-0.005em] text-[var(--color-text)]">{title}</h2>
      <div className="space-y-3">{children}</div>
    </div>
  );
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const p = projectBySlug(slug);
  if (!p) notFound();

  const cover = p.coverAssetId ? assets[p.coverAssetId] : assets.A09;
  const isMomIe = p.slug === 'mom-ie';
  const copy = detailCopy[p.slug];

  const path = `/ai-services/${p.slug}`;

  return (
    <>
      {/* 개발 중 프로젝트에 가짜 다운로드·가격·별점을 넣지 않는다. CreativeWork 로만 표현한다. */}
      <JsonLd graph={[
        organizationNode(),
        websiteNode(),
        webPageNode({ path, name: p.name, description: p.summary }),
        breadcrumbNode(path, [
          { name: '홈', path: '/' },
          { name: 'AI 포트폴리오', path: '/ai-services' },
          { name: p.name, path },
        ]),
        creativeWorkNode({ name: p.name, description: p.summary, path }),
      ]} />
      <CinematicHero
        eyebrow="휴미즈 AI 프로젝트"
        badge={p.stage ?? undefined}
        titleKo={p.name}
        lead={copy ? copy.lead : p.summary}
        image={cover}
        ambient={isMomIe ? 'warm' : 'cool'}
      />

      {copy && (
        <Scene mask="none" ambient={isMomIe ? 'warm' : 'cool'}>
          <Statement titleKo={copy.headline} />
        </Scene>
      )}

      {p.highlights.length > 0 && (
        <Scene mask="none">
          <ul>
            {p.highlights.map((h, i) => (
              <Reveal as="li" key={h.title} delay={((i % 3) + 1) as 1 | 2 | 3} className="cap-row">
                <h2 className="title-ko-sm">{h.title}</h2>
                <p className="lead">{h.body}</p>
              </Reveal>
            ))}
          </ul>
        </Scene>
      )}

      {p.principle && (
        <Scene mask="none">
          <Reveal as="h2" className="title-ko">{p.principle.title}</Reveal>
          <Reveal delay={1}><p className="lead measure mt-8">{p.principle.body}</p></Reveal>
        </Scene>
      )}

      <Scene mask="none">
        <Reveal as="p" className="eyebrow">프로젝트 이야기</Reveal>
        <div className="mt-10">
          <Block title={copy ? copy.problem : '어떤 문제에서 시작했나요?'}>
            {p.problem.map((t) => <p key={t} className="lead">{t}</p>)}
          </Block>

          <Block title={copy ? copy.solution : '어떻게 풀었나요?'}>
            {p.approach.map((t) => <p key={t} className="lead">{t}</p>)}
          </Block>

          {(p.implementedFeatures.length > 0 || p.plannedFeatures.length > 0) && (
            <Block title="무엇을 구현했나요?">
              {p.implementedFeatures.length > 0 && (
                <ul className="space-y-2">{p.implementedFeatures.map((t) => <li key={t} className="lead">· {t}</li>)}</ul>
              )}
              {p.plannedFeatures.length > 0 && (
                <div className="pt-2">
                  <p className="text-[13px] uppercase tracking-[0.16em] text-[var(--color-muted)]">계획</p>
                  <ul className="mt-2 space-y-2">{p.plannedFeatures.map((t) => <li key={t} className="lead">· {t}</li>)}</ul>
                </div>
              )}
            </Block>
          )}

          {p.aiRole.length > 0 && (
            <Block title="AI는 어디에서 작동하나요?">
              {p.aiRole.map((t) => <p key={t} className="lead">{t}</p>)}
            </Block>
          )}

          {p.validationNotes.length > 0 && (
            <Block title="어떻게 검증하고 있나요?">
              {p.validationNotes.map((t) => <p key={t} className="lead">{t}</p>)}
            </Block>
          )}

          {(p.contribution || p.operatorLabel) && (
            <Block title="휴미즈의 역할">
              {p.contribution && <p className="lead">{p.contribution}</p>}
              {p.operatorLabel && <p className="text-[14px] text-[var(--color-muted)]">{p.operatorLabel}</p>}
            </Block>
          )}

          {(p.currentStageNote || (p.stage && p.stageVerifiedAt)) && (
            <Block title="현재 단계">
              {p.currentStageNote && <p className="lead">{p.currentStageNote}</p>}
              {p.stage && p.stageVerifiedAt && (
                <p className="text-[14px] text-[var(--color-muted)]">단계 확인일: {p.stageVerifiedAt}</p>
              )}
            </Block>
          )}
        </div>

        <Reveal delay={3}>
          <div className="mt-14 flex flex-wrap items-center gap-x-10 gap-y-4">
            <A href="/contact" className="cta-primary">
              {isMomIe ? '맘이음 협업 문의' : '협업 문의'}<span aria-hidden="true">→</span>
            </A>
            {p.externalUrl && p.externalLinkVerifiedAt && (
              <A href={p.externalUrl} target="_blank" rel="noopener noreferrer" className="cta-ghost">
                서비스 방문<span aria-hidden="true">↗</span><span className="sr-only">(새 탭에서 열림)</span>
              </A>
            )}
            <A href="/ai-services" className="cta-ghost">AI 포트폴리오</A>
          </div>
        </Reveal>
      </Scene>
    </>
  );
}
