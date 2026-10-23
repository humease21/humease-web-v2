import Link from 'next/link';
import { primaryCta, primaryNav } from '@/content/navigation';
import { asset } from '@/lib/asset-path';
import { HeaderShell } from '@/components/interactive/HeaderShell';
import { MobileNav } from '@/components/interactive/MobileNav';
import { NavDropdown } from '@/components/interactive/NavDropdown';
import { NavLink } from '@/components/interactive/NavLink';

/** 상단 고정 헤더. 데스크톱(lg↑)은 5개 메뉴 + 문의 CTA, 그 미만은 전체 메뉴 패널. */
export function SiteHeader() {
  return (
    <HeaderShell>
      <div className="shell flex h-16 items-center justify-between gap-6 lg:h-[72px]">
        <Link href="/" className="inline-flex min-h-11 items-center" aria-label="휴미즈 홈">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={asset('/brand/logo-horizontal-en-ink.webp')} alt="휴미즈" width={337} height={56} className="h-[19px] w-auto lg:h-[21px]" />
        </Link>

        <nav aria-label="주요 메뉴" className="hidden lg:block">
          <ul className="flex items-center gap-1">
            {primaryNav.map((item) => (
              <li key={item.label}>
                {item.children?.length ? (
                  <NavDropdown label={item.label} items={item.children} />
                ) : (
                  <NavLink
                    href={item.href}
                    className="flex min-h-11 items-center rounded-md px-3 text-[15px] font-semibold text-[var(--color-body)] transition-colors hover:text-[var(--color-text)] data-[active]:text-[var(--color-text)]"
                  >
                    {item.label}
                  </NavLink>
                )}
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-3">
          <Link href={primaryCta.href} className="btn btn-primary hidden !min-h-11 !px-5 !text-[15px] lg:inline-flex">
            {primaryCta.label}
          </Link>
          <MobileNav />
        </div>
      </div>
    </HeaderShell>
  );
}
