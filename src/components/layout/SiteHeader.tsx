import Link from 'next/link';
import { primaryNav } from '@/content/navigation';
import { MobileNav } from '@/components/interactive/MobileNav';

/** docs/02 §9 — 로고·링크·본문은 서버 렌더. 상호작용만 Client 로 분리한다. */
export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-[var(--color-line)]/60 bg-[var(--color-bg)]/92 backdrop-blur">
      <div className="shell flex h-16 items-center justify-between md:h-[76px]">
        <Link href="/" className="font-[family-name:var(--font-display)] text-xl tracking-tight md:text-2xl">
          HUMEASE
        </Link>

        <nav aria-label="주요 메뉴" className="hidden md:block">
          <ul className="flex items-center gap-8">
            {primaryNav.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="text-[15px] font-medium text-[var(--color-muted)] transition-colors hover:text-[var(--color-text)]"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <MobileNav />
      </div>
    </header>
  );
}
