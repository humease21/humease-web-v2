'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { primaryNav } from '@/content/navigation';

/** docs/02 §7 — 실제 button, Escape 닫기, 포커스 복귀, 열렸을 때만 배경 스크롤 잠금 */
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

  return (
    <div className="md:hidden">
      <button
        ref={triggerRef}
        type="button"
        aria-expanded={open}
        aria-controls="mobile-menu"
        onClick={() => setOpen((v) => !v)}
        className="grid h-11 w-11 place-items-center rounded-lg border border-[var(--color-line)] text-sm font-medium"
      >
        <span className="sr-only">메뉴 {open ? '닫기' : '열기'}</span>
        <span aria-hidden>{open ? '✕' : '☰'}</span>
      </button>

      {open && (
        <div id="mobile-menu" className="fixed inset-x-0 top-16 bottom-0 z-40 overflow-y-auto bg-[var(--color-bg)]">
          <nav aria-label="모바일 메뉴" className="shell py-6">
            <ul className="flex flex-col">
              {primaryNav.map((item) => (
                <li key={item.href} className="border-b border-[var(--color-line)]/50">
                  <Link
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className="flex min-h-[56px] items-center text-lg font-medium"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      )}
    </div>
  );
}
