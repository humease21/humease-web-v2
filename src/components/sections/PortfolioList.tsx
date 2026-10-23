/* eslint-disable @next/next/no-img-element -- 사전 최적화된 정적 자산을 raw <img> 로 쓴다(docs/05 §5). */
import { Reveal } from '@/components/interactive/Reveal';
import { stagger } from '@/lib/stagger';
import { assets } from '@/content/assets';
import type { Project } from '@/content/portfolio';
import { Arrow, Icon } from '@/components/ui/Icon';
import { A } from '@/components/ui/Link';

/**
 * 프로젝트 카드 그리드. 대표 이미지가 없는 프로젝트는 가짜 화면을 만들지 않고 분류만 담은 중립 패널을 쓴다.
 * 카드 전체가 상세로 가는 링크이며(stretched link), 외부 서비스 링크는 별도 버튼으로 둔다.
 */
export function PortfolioList({ items, columns = 3 }: { items: Project[]; columns?: 2 | 3 }) {
  return (
    <ul className={`grid gap-5 md:grid-cols-2 ${columns === 3 ? 'lg:grid-cols-3' : ''}`}>
      {items.map((p, i) => {
        const cover = p.coverAssetId ? assets[p.coverAssetId] : null;
        return (
          <Reveal as="li" key={p.slug} delay={stagger(i)} className="flex">
            <article className="card card-link w-full !p-0">
              <div className="media aspect-[16/10] !rounded-b-none !rounded-t-[13px]">
                {cover ? (
                  <img src={cover.src} alt={p.coverAlt} width={cover.width} height={cover.height} loading="lazy" decoding="async" style={{ objectPosition: '70% 50%' }} />
                ) : (
                  <div className="flex h-full flex-col justify-between bg-[linear-gradient(145deg,#141922,#0B0E12)] p-6 text-[#D5D9DF]">
                    <Icon name="spark" size={28} className="text-[#C7B99D]" />
                    <p aria-hidden="true" className="text-[28px] font-bold tracking-[-0.02em] text-[#F2EFE8]">{p.name}</p>
                  </div>
                )}
              </div>
              <div className="flex flex-1 flex-col p-6 md:p-7">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-[14px] font-semibold text-[var(--color-brand-ink)]">{p.category}</span>
                  {p.stage && <span className="badge badge-brand">{p.stage}</span>}
                </div>
                <h3 className="heading-lg mt-3">
                  <A href={`/ai-services/${p.slug}`} className="stretched">{p.name}</A>
                </h3>
                <p className="body-sm mt-3 flex-1">{p.summary}</p>
                {p.contribution && <p className="caption mt-3">휴미즈의 참여: {p.contribution}</p>}
                <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2">
                  <span className="inline-flex items-center gap-2 text-[15px] font-semibold text-[var(--color-text)]">
                    프로젝트 자세히 보기<Arrow />
                  </span>
                  {p.externalUrl && p.externalLinkVerifiedAt && (
                    <A href={p.externalUrl} target="_blank" rel="noopener noreferrer"
                      className="relative z-10 inline-flex min-h-11 items-center gap-1.5 text-[15px] font-semibold text-[var(--color-muted)] underline underline-offset-4 hover:text-[var(--color-text)]">
                      서비스 방문<Arrow external />
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
