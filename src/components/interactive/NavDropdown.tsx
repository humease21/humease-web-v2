'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useId, useRef, useState } from 'react';
import type { NavChild } from '@/content/navigation';
import { Icon } from '@/components/ui/Icon';
import { isActivePath } from '@/components/interactive/NavLink';

/**
 * 데스크톱 서브메뉴. 실제 button + aria-expanded, Escape 닫기, 포커스 복귀, 바깥 클릭 닫기.
 * hover 없이 클릭·키보드만으로 사용할 수 있어야 한다. 경로가 바뀌면 닫는다.
 */
export function NavDropdown({ label, items }: { label: string; items: NavChild[] }) {
  const id = useId();
  const wrapRef = useRef<HTMLDivElement>(null);
  const btnRef = useRef<HTMLButtonElement>(null);
  const pathname = usePathname();
  const active = items.some((c) => isActivePath(pathname, c.href));

  // 열린 시점의 경로를 기억한다. 경로가 바뀌면(링크 이동) 별도 effect 없이 자동으로 닫힌 상태가 된다.
  const [openedAt, setOpenedAt] = useState<string | null>(null);
  const open = openedAt !== null && openedAt === pathname;
  const setOpen = (v: boolean | ((prev: boolean) => boolean)) => {
    const next = typeof v === 'function' ? v(open) : v;
    setOpenedAt(next ? pathname : null);
  };

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { setOpenedAt(null); btnRef.current?.focus(); }
    };
    const onDown = (e: MouseEvent) => {
      if (!wrapRef.current?.contains(e.target as Node)) setOpenedAt(null);
    };
    document.addEventListener('keydown', onKey);
    document.addEventListener('mousedown', onDown);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.removeEventListener('mousedown', onDown);
    };
  }, [open]);

  return (
    <div ref={wrapRef} className="relative">
      <button
        ref={btnRef}
        type="button"
        aria-expanded={open}
        aria-controls={id}
        onClick={() => setOpen((v) => !v)}
        className={`flex min-h-11 items-center gap-1.5 rounded-md px-3 text-[15px] font-semibold transition-colors hover:text-[var(--color-text)] ${
          active || open ? 'text-[var(--color-text)]' : 'text-[var(--color-body)]'
        }`}
      >
        {label}
        <Icon name="chevron-down" size={16} className={`transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div
          id={id}
          className="absolute left-0 top-full z-50 mt-2 w-[340px] rounded-xl border border-[var(--color-line)] bg-[var(--color-surface)] p-2 shadow-[0_18px_48px_-20px_rgb(14_18_23/0.35)]"
        >
          <ul>
            {items.map((c) => {
              const current = isActivePath(pathname, c.href) && (c.href !== '/solutions' || pathname?.replace(/\/$/, '') === '/solutions');
              return (
                <li key={c.href}>
                  <Link
                    href={c.href}
                    onClick={() => setOpen(false)}
                    aria-current={current ? 'page' : undefined}
                    className="block rounded-lg px-4 py-3 transition-colors hover:bg-[var(--color-subtle)] aria-[current=page]:bg-[var(--color-subtle)]"
                  >
                    <span className="block text-[15px] font-semibold text-[var(--color-text)]">{c.label}</span>
                    {c.description && <span className="mt-0.5 block text-[14px] text-[var(--color-muted)]">{c.description}</span>}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}
