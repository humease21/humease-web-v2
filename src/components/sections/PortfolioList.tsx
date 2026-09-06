import { Reveal } from '@/components/interactive/Reveal';
import { assets } from '@/content/assets';
import type { Project } from '@/content/portfolio';
import { A } from '@/components/ui/Link';

/**
 * 편집형 프로젝트 목록. 작은 카드 3개 반복이 아니라 항목마다 충분히 보여준다.
 * 항목이 늘어도 각각 풀스크린으로 길어지지 않는다.
 */
export function PortfolioList({ items }: { items: Project[] }) {
  return (
    <ul>
      {items.map((p, i) => {
        const cover = p.coverAssetId ? assets[p.coverAssetId] : null;
        return (
          <Reveal as="li" key={p.slug} delay={((i % 3) + 1) as 1 | 2 | 3}>
            <article className="grid gap-6 border-t border-[color-mix(in_srgb,var(--color-line)_55%,transparent)] py-12 md:grid-cols-[minmax(0,4fr)_minmax(0,6fr)] md:gap-16 md:py-16">
              <div>
                {cover ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={cover.src} alt={p.coverAlt} width={cover.width} height={cover.height}
                    loading="lazy" decoding="async"
                    className="h-40 w-full object-cover md:h-56"
                  />
                ) : (
                  <p className="text-[13px] uppercase tracking-[0.2em] text-[var(--color-muted)]">
                    {p.category}
                  </p>
                )}
              </div>

              <div>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                  <h3 className="title-ko-sm">{p.name}</h3>
                  {p.stage && (
                    <span className="border border-[color-mix(in_srgb,var(--color-accent)_45%,transparent)] px-3 py-1 text-[11px] font-medium tracking-[0.12em] text-[var(--color-accent)]">
                      {p.stage}
                    </span>
                  )}
                </div>
                <p className="lead measure mt-5">{p.summary}</p>
                {p.contribution && (
                  <p className="mt-4 text-[14px] text-[var(--color-muted)]">휴미즈의 참여: {p.contribution}</p>
                )}
                {!p.stage && (
                  <p className="mt-4 text-[14px] text-[var(--color-muted)]">현재 단계는 확인 후 표기합니다.</p>
                )}
                <div className="mt-8 flex flex-wrap items-center gap-x-8 gap-y-3">
                  <A href={`/ai-services/${p.slug}`} className="cta-ghost">
                    프로젝트 자세히 보기<span aria-hidden="true">→</span>
                  </A>
                  {p.externalUrl && p.externalLinkVerifiedAt && (
                    <A href={p.externalUrl} target="_blank" rel="noopener noreferrer" className="cta-ghost">
                      서비스 방문<span aria-hidden="true">↗</span>
                      <span className="sr-only">(새 탭에서 열림)</span>
                    </A>
                  )}
                </div>
              </div>
            </article>
          </Reveal>
        );
      })}
    </ul>
  );
}
