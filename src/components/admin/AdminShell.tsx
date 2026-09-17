'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { signOut } from '@/lib/supabase/auth';
import { AdminGuard } from './AdminGuard';

/**
 * 관리자 콘솔 전용 레이아웃 껍데기.
 *
 * 공개 사이트의 SiteHeader/SiteFooter 를 쓰지 않는다 — 내비게이션도 SEO 문맥도 다르다.
 * 데스크톱은 고정 sidebar, 모바일은 drawer 다.
 * `/admin/login` 은 로그인 전이라 sidebar·topbar 를 숨기고 권한 게이트도 태우지 않는다.
 *
 * 로그아웃은 K-Bestie 의 Server Action 폼이 아니라 `onClick` 버튼이다 —
 * `output:'export'` 에서는 Server Action 이 동작하지 않는다.
 */

const NAV = [
  { href: '/admin', label: '대시보드', exact: true },
  { href: '/admin/analytics', label: '사이트 분석', exact: false },
  { href: '/admin/inquiries', label: '문의 관리', exact: false },
  { href: '/admin/portfolio', label: '포트폴리오', exact: false },
  { href: '/admin/settings', label: '사이트 설정', exact: false },
] as const;

/** `trailingSlash: true` 라 usePathname 이 `/admin/` 형태로 올 수 있다. 비교 전에 맞춘다. */
const normalize = (p: string | null): string => {
  if (!p) return '/';
  const trimmed = p.replace(/\/+$/, '');
  return trimmed === '' ? '/' : trimmed;
};

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = normalize(usePathname());
  const router = useRouter();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [signingOut, setSigningOut] = useState(false);

  const isLogin = pathname === '/admin/login';

  const handleSignOut = async () => {
    setSigningOut(true);
    await signOut().catch(() => null);
    router.replace('/admin/login');
  };

  if (isLogin) {
    return <main className="admin-ui min-h-screen bg-[var(--color-bg)]">{children}</main>;
  }

  const navLinks = (
    <nav aria-label="관리자 메뉴" className="flex flex-col gap-1">
      {NAV.map(({ href, label, exact }) => {
        const active = exact ? pathname === href : pathname.startsWith(href);
        return (
          <Link
            key={href}
            href={href}
            // 이동 시 drawer 를 닫는다. 효과로 pathname 을 지켜보면 동기 setState 가 되어
            // 연쇄 렌더가 생긴다(react-hooks/set-state-in-effect) — 클릭 시점에 닫는다.
            onClick={() => setDrawerOpen(false)}
            aria-current={active ? 'page' : undefined}
            className={`px-3 py-2.5 text-[14px] transition-colors ${
              active
                ? 'bg-[var(--color-raised)] text-[var(--color-accent)]'
                : 'text-[var(--color-muted)] hover:bg-[var(--color-raised)] hover:text-[var(--color-text)]'
            }`}
          >
            {label}
          </Link>
        );
      })}
      <button
        type="button"
        onClick={() => void handleSignOut()}
        disabled={signingOut}
        className="mt-2 border-t border-[var(--color-line)] px-3 py-2.5 text-left text-[14px] text-[var(--color-muted)] transition-colors hover:text-[var(--color-accent)] disabled:opacity-50"
      >
        {signingOut ? '로그아웃 중…' : '로그아웃'}
      </button>
    </nav>
  );

  return (
    <div className="admin-ui min-h-screen bg-[var(--color-bg)] lg:flex">
      {/* 데스크톱 sidebar */}
      <aside className="hidden w-[228px] shrink-0 border-r border-[var(--color-line)] bg-[var(--color-surface)] lg:block">
        <div className="sticky top-0 flex h-screen flex-col px-3 py-5">
          <Link href="/admin" className="px-3 pb-5 text-[13px] font-semibold tracking-[0.16em] text-[var(--color-text)]">
            HUMEASE ADMIN
          </Link>
          {navLinks}
        </div>
      </aside>

      <div className="min-w-0 flex-1">
        {/* 모바일 topbar */}
        <header className="flex items-center justify-between gap-3 border-b border-[var(--color-line)] bg-[var(--color-surface)] px-4 py-3 lg:px-8">
          <Link href="/admin" className="text-[12px] font-semibold tracking-[0.16em] text-[var(--color-text)] lg:hidden">
            HUMEASE ADMIN
          </Link>
          <p className="hidden text-[12px] tracking-[0.16em] text-[var(--color-muted)] lg:block">관리자 콘솔</p>
          <div className="flex items-center gap-2">
            <Link
              href="/"
              className="text-[12px] text-[var(--color-muted)] transition-colors hover:text-[var(--color-accent)]"
            >
              사이트 보기
            </Link>
            <button
              type="button"
              onClick={() => setDrawerOpen(true)}
              aria-expanded={drawerOpen}
              aria-controls="admin-drawer"
              className="border border-[var(--color-line)] px-3 py-1.5 text-[12px] text-[var(--color-text)] lg:hidden"
            >
              메뉴
            </button>
          </div>
        </header>

        <main className="px-4 py-6 lg:px-8 lg:py-10">
          <AdminGuard>{children}</AdminGuard>
        </main>
      </div>

      {/* 모바일 drawer */}
      {drawerOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            aria-label="메뉴 닫기"
            onClick={() => setDrawerOpen(false)}
            className="absolute inset-0 bg-black/60"
          />
          <div
            id="admin-drawer"
            className="absolute inset-y-0 right-0 flex w-[248px] flex-col border-l border-[var(--color-line)] bg-[var(--color-surface)] px-3 py-5"
          >
            <div className="flex items-center justify-between px-3 pb-5">
              <span className="text-[12px] font-semibold tracking-[0.16em] text-[var(--color-text)]">메뉴</span>
              <button
                type="button"
                onClick={() => setDrawerOpen(false)}
                className="text-[13px] text-[var(--color-muted)]"
              >
                닫기
              </button>
            </div>
            {navLinks}
          </div>
        </div>
      )}
    </div>
  );
}
