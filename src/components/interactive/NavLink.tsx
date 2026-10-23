'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

/** 현재 경로 하위에 있으면 aria-current 를 붙인다. trailingSlash 설정과 무관하게 비교한다. */
export function isActivePath(pathname: string | null, href: string) {
  const p = (pathname ?? '/').replace(/\/$/, '') || '/';
  const h = href.replace(/\/$/, '') || '/';
  return h === '/' ? p === '/' : p === h || p.startsWith(`${h}/`);
}

export function NavLink({ href, children, className }: { href: string; children: React.ReactNode; className?: string }) {
  const pathname = usePathname();
  const active = isActivePath(pathname, href);
  return (
    <Link href={href} aria-current={active ? 'page' : undefined} className={className} data-active={active || undefined}>
      {children}
    </Link>
  );
}
