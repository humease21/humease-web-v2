'use client';

import Link from 'next/link';
import { useEffect, useId, useRef, useState } from 'react';
import type { NavChild } from '@/content/navigation';

/**
 * 사업영역 서브메뉴. 실제 button + aria-expanded, Escape 닫기, 포커스 복귀,
 * 바깥 클릭 닫기. hover 없이 클릭·키보드만으로 사용할 수 있어야 한다.
 */
export function NavDropdown({ label, items }: { label: string; items: NavChild[] }) {
  const [open, setOpen] = useState(false);
  const id = useId();
  const wrapRef = useRef<HTMLDivElement>(null);
  const btnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { setOpen(false); btnRef.current?.focus(); }
    };
    const onDown = (e: MouseEvent) => {
      if (!wrapRef.current?.contains(e.target as Node)) setOpen(false);
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
        className="flex items-center gap-1.5 text-[13px] font-medium tracking-[0.01em] text-[var(--color-muted)] transition-colors duration-200 hover:text-[var(--color-text)]"
      >
        {label}
        <span aria-hidden="true" className={`text-[9px] transition-transform duration-200 ${open ? 'rotate-180' : ''}`}>▼</span>
      </button>

      {open && (
        <ul
          id={id}
          className="absolute left-0 top-full z-50 mt-4 min-w-[220px] border border-[color-mix(in_srgb,var(--color-line)_55%,transparent)] bg-[var(--color-surface)] py-2"
        >
          {items.map((c) => (
            <li key={c.href}>
              <Link
                href={c.href}
                onClick={() => setOpen(false)}
                className="block px-5 py-3 text-[14px] text-[var(--color-muted)] transition-colors hover:bg-[var(--color-raised)] hover:text-[var(--color-text)]"
              >
                {c.label}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
