import Link from 'next/link';
import { primaryNav } from '@/content/navigation';
import { asset } from '@/lib/asset-path';
import { HeaderShell } from '@/components/interactive/HeaderShell';
import { MobileNav } from '@/components/interactive/MobileNav';
import { NavDropdown } from '@/components/interactive/NavDropdown';

/** 초기 transparent overlay → 스크롤 후 반투명 dark backdrop. desktop 내비게이션은 최소화한다. */
export function SiteHeader() {
  return (
    <HeaderShell>
      <div className="shell flex h-16 items-center justify-between md:h-20">
        <Link href="/" className="inline-flex items-center" aria-label="휴미즈 홈">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={asset('/brand/logo-horizontal-en.webp')} alt="휴미즈" width={337} height={56} className="h-[18px] w-auto md:h-5" />
        </Link>

        <nav aria-label="주요 메뉴" className="hidden md:block">
          <ul className="flex items-center gap-9">
            {primaryNav.map((item) => (
              <li key={item.href}>
                {item.children?.length ? (
                  <NavDropdown label={item.label} items={item.children} />
                ) : (
                  <Link
                    href={item.href}
                    className="text-[13px] font-medium tracking-[0.01em] text-[var(--color-muted)] transition-colors duration-200 hover:text-[var(--color-text)]"
                  >
                    {item.label}
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </nav>

        <MobileNav />
      </div>
    </HeaderShell>
  );
}
