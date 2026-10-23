'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { primaryCta, primaryNav } from '@/content/navigation';
import { Icon } from '@/components/ui/Icon';
import { isActivePath } from '@/components/interactive/NavLink';

/**
 * 모바일·태블릿 메뉴. 패널을 body 로 portal 한다 — 헤더의 backdrop-filter 가 position:fixed 의
 * containing block 을 만들어 패널 높이가 0 이 되는 문제를 원천 차단한다.
 * 실제 button, Escape 닫기, 포커스 복귀, 열렸을 때만 배경 스크롤 잠금.
 */
export function MobileNav() {
  const triggerRef = useRef<HTMLButtonElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const pathname = usePathname();

  // 열린 시점의 경로를 기억한다. 경로가 바뀌면(링크 이동) 별도 effect 없이 자동으로 닫힌 상태가 된다.
  const [openedAt, setOpenedAt] = useState<string | null>(null);
  const open = openedAt !== null && openedAt === pathname;
  const setOpen = (v: boolean | ((prev: boolean) => boolean)) => {
    const next = typeof v === 'function' ? v(open) : v;
    setOpenedAt(next ? pathname : null);
  };

  useEffect(() => {
    if (!open) return;
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { setOpenedAt(null); triggerRef.current?.focus(); }
    };
    document.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prev;
    };
  }, [open]);

  const close = () => { setOpen(false); triggerRef.current?.focus(); };

  const panel = (
    <div
      id="mobile-menu"
      role="dialog"
      aria-modal="true"
      aria-label="전체 메뉴"
      className="theme-site fixed inset-0 z-[60] flex flex-col overflow-y-auto lg:hidden"
    >
      <div className="shell flex h-16 shrink-0 items-center justify-between border-b border-[var(--color-line)]">
        <span className="text-[15px] font-semibold text-[var(--color-muted)]">메뉴</span>
        <button ref={closeRef} type="button" onClick={close} className="-mr-2 grid h-11 w-11 place-items-center rounded-md">
          <span className="sr-only">메뉴 닫기</span>
          <Icon name="close" size={24} />
        </button>
      </div>
      <nav aria-label="모바일 메뉴" className="shell flex-1 pb-8 pt-4">
        <ul>
          {primaryNav.map((item) => (
            <li key={item.label} className="border-b border-[var(--color-line)] py-3">
              {item.children?.length ? (
                <>
                  <p className="px-1 pb-1 pt-2 text-[13px] font-semibold tracking-[0.04em] text-[var(--color-brand-ink)]">{item.label}</p>
                  <ul>
                    {item.children.map((c) => (
                      <li key={c.href}>
                        <Link
                          href={c.href}
                          onClick={() => setOpen(false)}
                          aria-current={isActivePath(pathname, c.href) ? 'page' : undefined}
                          className="flex min-h-12 items-center px-1 text-[17px] font-medium text-[var(--color-text)] aria-[current=page]:font-bold"
                        >
                          {c.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </>
              ) : (
                <Link
                  href={item.href}
                  onClick={() => setOpen(false)}
                  aria-current={isActivePath(pathname, item.href) ? 'page' : undefined}
                  className="flex min-h-12 items-center px-1 text-[18px] font-semibold text-[var(--color-text)]"
                >
                  {item.label}
                </Link>
              )}
            </li>
          ))}
        </ul>
      </nav>
      <div className="shell shrink-0 border-t border-[var(--color-line)] py-4">
        <Link href={primaryCta.href} onClick={() => setOpen(false)} className="btn btn-primary w-full">
          {primaryCta.label}
        </Link>
      </div>
    </div>
  );

  return (
    <div className="lg:hidden">
      <button
        ref={triggerRef}
        type="button"
        aria-expanded={open}
        aria-controls="mobile-menu"
        onClick={() => setOpen(true)}
        className="-mr-2 grid h-11 w-11 place-items-center rounded-md text-[var(--color-text)]"
      >
        <span className="sr-only">메뉴 열기</span>
        <Icon name="menu" size={24} />
      </button>
      {open && createPortal(panel, document.body)}
    </div>
  );
}
