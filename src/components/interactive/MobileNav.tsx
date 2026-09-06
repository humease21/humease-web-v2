'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { primaryNav } from '@/content/navigation';

/**
 * 패널을 body 로 portal 한다 — 헤더의 backdrop-filter 가 position:fixed 의
 * containing block 을 만들어 패널 높이가 0 이 되는 문제를 원천 차단한다.
 * 실제 button, Escape 닫기, 포커스 복귀, 열렸을 때만 배경 스크롤 잠금.
 */
export function MobileNav() {
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { setOpen(false); triggerRef.current?.focus(); }
    };
    document.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prev;
    };
  }, [open]);

  const panel = (
    <div id="mobile-menu" className="fixed inset-0 z-[60] overflow-y-auto bg-[var(--color-bg)] md:hidden">
      <div className="shell flex min-h-16 items-center justify-end">
        <button
          type="button"
          onClick={() => { setOpen(false); triggerRef.current?.focus(); }}
          className="grid h-11 w-11 place-items-center text-2xl"
        >
          <span className="sr-only">메뉴 닫기</span>
          <span aria-hidden="true">✕</span>
        </button>
      </div>
      <nav aria-label="모바일 메뉴" className="shell pb-16 pt-6">
        <ul>
          {primaryNav.map((item) => (
            <li key={item.href} className="border-t border-[color-mix(in_srgb,var(--color-line)_50%,transparent)]">
              <Link href={item.href} onClick={() => setOpen(false)} className="flex min-h-[68px] items-center text-2xl font-medium">
                {item.label}
              </Link>
              {item.children?.length ? (
                <ul className="pb-5 pl-4">
                  {item.children.map((c) => (
                    <li key={c.href}>
                      <Link
                        href={c.href}
                        onClick={() => setOpen(false)}
                        className="flex min-h-[52px] items-center text-[16px] text-[var(--color-muted)]"
                      >
                        {c.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              ) : null}
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );

  return (
    <div className="md:hidden">
      <button
        ref={triggerRef}
        type="button"
        aria-expanded={open}
        aria-controls="mobile-menu"
        onClick={() => setOpen(true)}
        className="grid h-11 w-11 place-items-center text-xl"
      >
        <span className="sr-only">메뉴 열기</span>
        <span aria-hidden="true">☰</span>
      </button>
      {open && createPortal(panel, document.body)}
    </div>
  );
}
