import Link from 'next/link';
import { company } from '@/content/company';
import { primaryCta, primaryNav } from '@/content/navigation';
import { asset } from '@/lib/asset-path';

/**
 * docs/03 §13 — 대표자·사업자등록번호·주소는 승인값 확인 전 표시하지 않는다.
 * 개인정보처리방침/이용약관 V1.0 승인(2026-09-18)으로 /privacy, /terms 를 링크한다.
 */
export function SiteFooter() {
  const details = [company.representative, company.businessNumber, company.address].filter(Boolean);
  const groups = primaryNav.filter((i) => i.children?.length);
  const singles = primaryNav.filter((i) => !i.children?.length);

  const linkCls = 'inline-flex min-h-9 items-center text-[15px] text-[var(--color-muted)] transition-colors hover:text-[var(--color-text)]';

  return (
    <footer className="on-dark border-t border-[var(--color-line)]">
      <div className="shell pb-10 pt-16 md:pt-20">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,4fr)_minmax(0,8fr)] lg:gap-16">
          <div>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={asset('/brand/logo-horizontal-en.webp')} alt="휴미즈" width={337} height={56} className="h-[21px] w-auto" />
            <p className="mt-4 text-[14px] leading-relaxed text-[var(--color-muted)]">
              Enterprise Data · Data Governance · Compliance · AX · AI Services
            </p>
            <dl className="mt-8 space-y-1.5 text-[15px] text-[var(--color-muted)]">
              <div><dt className="sr-only">회사명</dt><dd className="text-[var(--color-body)]">{company.nameKo}</dd></div>
              {details.length > 0 && <div><dt className="sr-only">회사 정보</dt><dd>{details.join(' · ')}</dd></div>}
              <div>
                <dt className="sr-only">이메일</dt>
                <dd><a href={`mailto:${company.email}`} className={linkCls}>{company.email}</a></dd>
              </div>
            </dl>
          </div>

          <nav aria-label="하단 메뉴" className="grid grid-cols-2 gap-x-8 gap-y-10 md:grid-cols-3">
            {groups.map((g) => (
              <div key={g.label}>
                <p className="text-[14px] font-semibold text-[var(--color-text)]">{g.label}</p>
                <ul className="mt-3 space-y-0.5">
                  {g.children!.map((c) => (
                    <li key={c.href}><Link href={c.href} className={linkCls}>{c.label}</Link></li>
                  ))}
                </ul>
              </div>
            ))}
            <div>
              <p className="text-[14px] font-semibold text-[var(--color-text)]">휴미즈</p>
              <ul className="mt-3 space-y-0.5">
                {singles.map((i) => (
                  <li key={i.href}><Link href={i.href} className={linkCls}>{i.label}</Link></li>
                ))}
                <li><Link href={primaryCta.href} className={linkCls}>문의</Link></li>
              </ul>
            </div>
          </nav>
        </div>

        <div className="mt-14 flex flex-col gap-3 border-t border-[var(--color-line)] pt-6 text-[14px] text-[var(--color-muted)] md:flex-row md:items-center md:justify-between">
          <p>Copyright © {new Date().getFullYear()} HUMEASE. All rights reserved.</p>
          <nav aria-label="법률 정보" className="flex items-center gap-5">
            <Link href="/privacy" className="inline-flex min-h-9 items-center font-semibold text-[var(--color-body)] transition-colors hover:text-[var(--color-text)]">개인정보처리방침</Link>
            <Link href="/terms" className="inline-flex min-h-9 items-center transition-colors hover:text-[var(--color-text)]">이용약관</Link>
          </nav>
        </div>
      </div>
    </footer>
  );
}
