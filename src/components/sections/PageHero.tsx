/* eslint-disable @next/next/no-img-element -- raw <img>/<picture> 를 쓴다.
   next/image 의 priority preload 주입이 <picture> 의 media 선택을 우회해
   모바일에서 desktop 원본까지 받는 문제가 실측 확인됐다(docs/05 §5). */
import type { Asset } from '@/content/assets';
import { Arrow } from '@/components/ui/Icon';
import { A } from '@/components/ui/Link';

type Cta = { label: string; href: string; primary?: boolean };
/** href 가 없으면 분류 이름만 표시한다(예: 사업영역 — 별도 허브 페이지가 없다). */
export type Crumb = { name: string; href?: string };

/**
 * 페이지 첫 화면. 등장 모션을 쓰지 않는다 — 첫 화면은 JS 없이 즉시 그려져야 LCP 가 늦어지지 않는다. 좌측 메시지 · 우측 비주얼 패널의 2열 구성(lg↑), 그 미만은 메시지 → 패널 순서.
 * 이미지는 장식이다(alt=""). 피사체가 오른쪽에 있는 자산이 많아 기본 크롭 기준을 오른쪽에 둔다.
 */
export function PageHero({
  eyebrow, title, lead, ctas, badge, image, imagePortrait, breadcrumbs, home, focus = '72% 50%', aside, belowLead,
}: {
  eyebrow: string;
  title: React.ReactNode;
  lead?: React.ReactNode;
  ctas?: Cta[];
  badge?: string;
  image?: Asset;
  /** lg↑ 의 세로형 패널에 쓸 세로 자산(홈) */
  imagePortrait?: Asset;
  breadcrumbs?: Crumb[];
  /** 홈 — 더 큰 제목과 높은 패널 */
  home?: boolean;
  focus?: string;
  /** 이미지 대신 우측 열에 둘 요소(예: 문의 폼) */
  aside?: React.ReactNode;
  /** 좌측 메시지 아래에 덧붙일 요소 */
  belowLead?: React.ReactNode;
}) {
  const hasSide = Boolean(image || aside);
  return (
    <section className={`relative overflow-hidden border-b border-[var(--color-line)] ${home ? 'pb-14 pt-10 md:pb-20 md:pt-16 lg:pb-24 lg:pt-20' : 'pb-12 pt-8 md:pb-16 md:pt-12 lg:pb-20 lg:pt-14'}`}>
      <div className="shell">
        {breadcrumbs && breadcrumbs.length > 0 && (
          <nav aria-label="현재 위치" className="mb-8 md:mb-10">
            <ol className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[14px] text-[var(--color-muted)]">
              {breadcrumbs.map((c, i) => (
                <li key={`${i}-${c.name}`} className="flex items-center gap-2">
                  {i > 0 && <span aria-hidden="true" className="text-[var(--color-line-strong)]">/</span>}
                  {i === breadcrumbs.length - 1 ? (
                    <span aria-current="page" className="text-[var(--color-body)]">{c.name}</span>
                  ) : !c.href ? (
                    <span>{c.name}</span>
                  ) : (
                    <A href={c.href} className="inline-flex min-h-8 items-center hover:text-[var(--color-text)] hover:underline">{c.name}</A>
                  )}
                </li>
              ))}
            </ol>
          </nav>
        )}

        <div className={hasSide ? `grid items-center gap-10 lg:gap-14 ${aside ? 'lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:items-start' : 'lg:grid-cols-[minmax(0,6fr)_minmax(0,6fr)]'}` : ''}>
          <div className={hasSide ? '' : 'max-w-[880px]'}>
            <div className="flex flex-wrap items-center gap-3">
              <p className="eyebrow">{eyebrow}</p>
              {badge && <span className="badge badge-brand">{badge}</span>}
            </div>
            <h1 className={`${home ? 'display-hero' : 'display-page'} mt-5`}>{title}</h1>
            {lead && <p className="lead measure mt-6">{lead}</p>}
            {ctas && ctas.length > 0 && (
              <div>
                <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
                  {ctas.map((c) => {
                    const external = /^https?:\/\//.test(c.href);
                    return (
                      <A key={c.href} href={c.href} className={`btn ${c.primary === false ? 'btn-secondary' : 'btn-primary'}`}>
                        {c.label}<Arrow external={external} />
                        {external && <span className="sr-only">(새 탭에서 열림)</span>}
                      </A>
                    );
                  })}
                </div>
              </div>
            )}
            {belowLead && <div className="mt-10 hidden border-t border-[var(--color-line)] pt-8 lg:block">{belowLead}</div>}
          </div>

          {aside ? (
            <div>{aside}</div>
          ) : image ? (
            <div>
              <div className={`media ${home ? 'aspect-[4/3] lg:aspect-[5/5.2]' : 'aspect-[16/10] lg:aspect-[4/3.4]'}`} aria-hidden="true">
                {imagePortrait ? (
                  <picture>
                    <source media="(max-width: 1023px)" srcSet={image.src} width={image.width} height={image.height} />
                    <source media="(min-width: 1024px)" srcSet={imagePortrait.src} width={imagePortrait.width} height={imagePortrait.height} />
                    <img src={image.src} alt="" width={image.width} height={image.height} fetchPriority="high" decoding="async" style={{ objectPosition: focus }} />
                  </picture>
                ) : (
                  <img src={image.src} alt="" width={image.width} height={image.height} fetchPriority="high" decoding="async" style={{ objectPosition: focus }} />
                )}
              </div>
            </div>
          ) : null}
        </div>
        {/* 좁은 화면에서는 폼이 먼저 보이도록 보조 안내를 폼 뒤로 보낸다. */}
        {belowLead && <div className="mt-10 border-t border-[var(--color-line)] pt-8 lg:hidden">{belowLead}</div>}
      </div>
    </section>
  );
}
