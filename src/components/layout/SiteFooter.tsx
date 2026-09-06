import Link from 'next/link';
import { company } from '@/content/company';
import { primaryNav } from '@/content/navigation';
import { asset } from '@/lib/asset-path';

/**
 * docs/03 §13 — 대표자·사업자등록번호·주소는 승인값 확인 전 표시하지 않는다.
 * /privacy 는 승인 본문이 없어 링크하지 않는다.
 */
export function SiteFooter() {
  const details = [company.representative, company.businessNumber, company.address].filter(Boolean);

  return (
    <footer className="border-t border-[color-mix(in_srgb,var(--color-line)_45%,transparent)]">
      <div className="shell py-16 md:py-24">
        <div className="flex flex-col gap-14 md:flex-row md:items-start md:justify-between">
          <div>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={asset('/brand/logo-horizontal-en.webp')} alt="휴미즈" width={337} height={56} className="h-5 w-auto" />
            <p className="mt-6 text-[14px] text-[var(--color-muted)]">{company.nameKo}</p>
            <a href={`mailto:${company.email}`} className="mt-1 inline-block text-[14px] text-[var(--color-muted)] transition-colors hover:text-[var(--color-text)]">
              {company.email}
            </a>
            {details.length > 0 && <p className="mt-2 text-[14px] text-[var(--color-muted)]">{details.join(' · ')}</p>}
          </div>

          <nav aria-label="하단 메뉴">
            <ul className="grid grid-cols-2 gap-x-14 gap-y-3 md:grid-cols-1">
              {primaryNav.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="text-[14px] text-[var(--color-muted)] transition-colors hover:text-[var(--color-text)]">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <p className="mt-16 text-[12px] tracking-[0.04em] text-[var(--color-muted)]">
          Copyright © {new Date().getFullYear()} HUMEASE.
        </p>
      </div>
    </footer>
  );
}
