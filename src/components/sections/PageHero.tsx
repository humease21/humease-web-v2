/* eslint-disable @next/next/no-img-element -- raw <img>/<picture> 를 쓴다.
   next/image 의 priority preload 주입이 <picture> 의 media 선택을 우회해
   모바일에서 desktop 원본까지 받는 문제가 실측 확인됐다(docs/05 §5). */
import type { Asset } from '@/content/assets';
import { Arrow } from '@/components/ui/Icon';
import { A } from '@/components/ui/Link';

type Cta = { label: string; href: string; primary?: boolean };
/** href 가 없으면 분류 이름만 표시한다(예: 사업영역 — 별도 허브 페이지가 없다). */
export type Crumb = { name: string; href?: string };

function Breadcrumbs({ items }: { items: Crumb[] }) {
  return (
    <nav aria-label="현재 위치" className="mb-8 md:mb-10">
      <ol className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[14px] text-[var(--color-muted)]">
        {items.map((c, i) => (
          <li key={`${i}-${c.name}`} className="flex items-center gap-2">
            {i > 0 && <span aria-hidden="true" className="text-[var(--color-line-strong)]">/</span>}
            {i === items.length - 1 ? (
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
  );
}

function Message({ eyebrow, badge, title, lead, ctas, home }: {
  eyebrow: string; badge?: string; title: React.ReactNode; lead?: React.ReactNode; ctas?: Cta[]; home?: boolean;
}) {
  return (
    <>
      <div className="flex flex-wrap items-center gap-3">
        <p className="eyebrow">{eyebrow}</p>
        {badge && <span className="badge badge-brand">{badge}</span>}
      </div>
      <h1 className={`${home ? 'display-hero' : 'display-page'} mt-5`}>{title}</h1>
      {lead && <p className="lead measure mt-6">{lead}</p>}
      {ctas && ctas.length > 0 && (
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
      )}
    </>
  );
}

/**
 * 페이지 첫 화면. 등장 모션을 쓰지 않는다 — 첫 화면은 JS 없이 즉시 그려져야 LCP 가 늦어지지 않는다.
 *
 * 이미지가 있으면 기존 홈페이지의 배치를 잇는 풀블리드 다크 장면이다 — 이미지를 배경으로 깔고
 * 왼쪽·아래 그라데이션 마스크 위에 메시지를 둔다. 이미지는 장식이다(alt="").
 * aside(예: 문의 폼)가 있으면 밝은 2열(메시지 | aside) 구성이다.
 */
export function PageHero({
  eyebrow, title, lead, ctas, badge, image, imageMobile, breadcrumbs, home, focus = '70% 50%', aside, belowLead,
}: {
  eyebrow: string;
  title: React.ReactNode;
  lead?: React.ReactNode;
  ctas?: Cta[];
  badge?: string;
  image?: Asset;
  /** 768px 미만에 쓸 세로형 자산(홈 A02) */
  imageMobile?: Asset;
  breadcrumbs?: Crumb[];
  /** 홈 — 더 큰 제목과 더 높은 첫 화면 */
  home?: boolean;
  focus?: string;
  /** 이미지 대신 우측 열에 둘 요소(예: 문의 폼) */
  aside?: React.ReactNode;
  /** 좌측 메시지 아래에 덧붙일 요소 */
  belowLead?: React.ReactNode;
}) {
  const message = <Message eyebrow={eyebrow} badge={badge} title={title} lead={lead} ctas={ctas} home={home} />;

  if (image && !aside) {
    return (
      <section className={`on-dark relative flex overflow-hidden ${home ? 'min-h-[86svh] md:min-h-[88svh]' : 'min-h-[68svh] md:min-h-[72svh]'} items-end`}>
        <div className="bleed mask-hero" aria-hidden="true">
          {imageMobile ? (
            <picture>
              <source media="(max-width: 767px)" srcSet={imageMobile.src} width={imageMobile.width} height={imageMobile.height} />
              <source media="(min-width: 768px)" srcSet={image.src} width={image.width} height={image.height} />
              <img src={image.src} alt="" width={image.width} height={image.height} fetchPriority="high" decoding="async" className={home ? 'crop-top' : undefined} style={{ objectPosition: focus }} />
            </picture>
          ) : (
            <img src={image.src} alt="" width={image.width} height={image.height} fetchPriority="high" decoding="async" style={{ objectPosition: focus }} />
          )}
        </div>
        <div className={`shell layer w-full ${home ? 'pb-16 pt-28 md:pb-24 md:pt-36' : 'pb-14 pt-10 md:pb-20 md:pt-14'}`}>
          {breadcrumbs && breadcrumbs.length > 0 && <Breadcrumbs items={breadcrumbs} />}
          <div className="max-w-[760px]">{message}</div>
        </div>
      </section>
    );
  }

  return (
    <section className="relative overflow-hidden border-b border-[var(--color-line)] pb-12 pt-8 md:pb-16 md:pt-12 lg:pb-20 lg:pt-14">
      <div className="shell">
        {breadcrumbs && breadcrumbs.length > 0 && <Breadcrumbs items={breadcrumbs} />}
        <div className={aside ? 'grid gap-10 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:items-start lg:gap-14' : ''}>
          <div className={aside ? '' : 'max-w-[880px]'}>
            {message}
            {belowLead && <div className="mt-10 hidden border-t border-[var(--color-line)] pt-8 lg:block">{belowLead}</div>}
          </div>
          {aside && <div>{aside}</div>}
        </div>
        {/* 좁은 화면에서는 폼이 먼저 보이도록 보조 안내를 폼 뒤로 보낸다. */}
        {belowLead && <div className="mt-10 border-t border-[var(--color-line)] pt-8 lg:hidden">{belowLead}</div>}
      </div>
    </section>
  );
}
