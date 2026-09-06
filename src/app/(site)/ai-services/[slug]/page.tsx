import { notFound } from 'next/navigation';
import { CinematicHero } from '@/components/brand/CinematicHero';
import { Scene } from '@/components/sections/Scene';
import { Reveal } from '@/components/interactive/Reveal';
import { assets } from '@/content/assets';
import { publishedProjects, projectBySlug } from '@/content/portfolio';
import { pageMeta } from '@/lib/seo';
import {
  JsonLd, organizationNode, websiteNode, webPageNode, breadcrumbNode, creativeWorkNode,
} from '@/lib/structured-data';
import { A } from '@/components/ui/Link';

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
      : `${p.summary} 휴미즈 AI 포트폴리오에서 프로젝트의 배경과 현재 단계를 확인하세요.`,
    path: `/ai-services/${p.slug}`,
  });
}

function Block({ title, children }: { title: string; children: React.ReactNode }) {
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
          { name: 'AI Portfolio', path: '/ai-services' },
          { name: p.name, path },
        ]),
        creativeWorkNode({ name: p.name, description: p.summary, path }),
      ]} />
      <CinematicHero
        eyebrow="HUMEASE AI PROJECT"
        badge={p.stage ?? undefined}
        titleKo={p.name}
        lead={p.summary}
        image={cover}
        ambient={isMomIe ? 'warm' : 'cool'}
      />

      {isMomIe && (
        <Scene mask="none" ambient="warm">
          <Reveal>
            <p className="text-[20px] leading-[1.55] text-[var(--color-warm)] md:text-[34px] md:leading-[1.45]">
              친구처럼 곁에 있고, 비서처럼 도와주고, 가족과 연결해주는 AI
            </p>
          </Reveal>
          <Reveal delay={1}>
            <p className="lead measure mt-8">
              부모님에게는 일상을 함께하는 대화 상대를, 가족에게는 더 자연스럽게 연결되는 계기를. 맘이음은 이런 일상을 위해 준비하고 있는 AI 서비스입니다.
            </p>
          </Reveal>
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
        <Reveal as="p" className="eyebrow">PROJECT DETAIL</Reveal>
        <div className="mt-10">
          <Block title="어떤 문제에서 시작했나요?">
            {p.problem.map((t) => <p key={t} className="lead">{t}</p>)}
          </Block>

          <Block title="어떻게 풀었나요?">
            {p.approach.map((t) => <p key={t} className="lead">{t}</p>)}
          </Block>

          <Block title="무엇을 구현했나요?">
            {p.implementedFeatures.length > 0
              ? <ul className="space-y-2">{p.implementedFeatures.map((t) => <li key={t} className="lead">· {t}</li>)}</ul>
              : <p className="lead">확인된 구현 기능은 별도 검토 후 표기합니다.</p>}
            {p.plannedFeatures.length > 0 && (
              <div className="pt-2">
                <p className="text-[13px] uppercase tracking-[0.16em] text-[var(--color-muted)]">계획</p>
                <ul className="mt-2 space-y-2">{p.plannedFeatures.map((t) => <li key={t} className="lead">· {t}</li>)}</ul>
              </div>
            )}
          </Block>

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

          <Block title="휴미즈의 역할">
            <p className="lead">{p.contribution ?? '실제 참여 범위는 확인 후 표기합니다.'}</p>
            {p.operatorLabel && <p className="text-[14px] text-[var(--color-muted)]">{p.operatorLabel}</p>}
          </Block>

          <Block title="현재 단계">
            <p className="lead">{p.currentStageNote}</p>
            {p.stage && p.stageVerifiedAt && (
              <p className="text-[14px] text-[var(--color-muted)]">단계 확인일: {p.stageVerifiedAt}</p>
            )}
          </Block>
        </div>

        {isMomIe && (
          <Reveal delay={2}>
            <h2 className="title-ko mt-20">지금은 개발 중입니다.</h2>
            <p className="lead measure mt-7">
              이 페이지는 맘이음의 서비스 방향을 소개합니다. 기능과 제공 범위는 개발 및 검증 과정에서 달라질 수 있습니다.
            </p>
          </Reveal>
        )}

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
            <A href="/ai-services" className="cta-ghost">AI 프로젝트 목록</A>
          </div>
        </Reveal>
      </Scene>
    </>
  );
}
