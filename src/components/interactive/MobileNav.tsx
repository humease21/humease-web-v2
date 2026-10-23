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
 * 열려 있는 동안 패널 밖의 body 자식을 inert 로 만들어 포커스·보조기기 탐색을 패널 안에 가둔다(aria-modal 계약).
 */
export function MobileNav() {
  const triggerRef = useRef<HTMLButtonElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const pathname = usePathname();

  const [open, setOpen] = useState(false);
  // 경로가 바뀌면(링크 이동·뒤로/앞으로) 렌더 중에 닫는다 — effect 안 setState 를 피하는 React 권장 패턴.
  const [seenPath, setSeenPath] = useState(pathname);
  if (seenPath !== pathname) {
    setSeenPath(pathname);
    setOpen(false);
  }
  // 사용자가 닫았을 때만 열기 버튼으로 포커스를 돌린다(링크 이동 시에는 새 페이지가 포커스를 가진다).
  const returnFocus = useRef(false);

  useEffect(() => {
    if (!open) return;
    const trigger = triggerRef.current;
    const panelEl = document.getElementById('mobile-menu');
    const background = [...document.body.children].filter((el) => el !== panelEl) as HTMLElement[];
    for (const el of background) el.inert = true;
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { returnFocus.current = true; setOpen(false); return; }
      // 포커스 순환 — 패널 처음·끝에서 Tab/Shift+Tab 이 패널 밖(body·브라우저 UI)으로 빠지지 않게 한다.
      if (e.key !== 'Tab' || !panelEl) return;
      const focusables = [...panelEl.querySelectorAll<HTMLElement>('a[href], button:not([disabled])')];
      if (!focusables.length) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      const active = document.activeElement;
      if (e.shiftKey && (active === first || !panelEl.contains(active))) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && (active === last || !panelEl.contains(active))) { e.preventDefault(); first.focus(); }
    };
    document.addEventListener('keydown', onKey);
    // 열린 채로 데스크톱 폭(lg, 1024px)이 되면 패널은 CSS 로 숨겨지므로 상태도 닫아 inert·스크롤 잠금을 푼다.
    const desktop = window.matchMedia('(min-width: 1024px)');
    const onDesktop = (e: MediaQueryListEvent) => { if (e.matches) setOpen(false); };
    desktop.addEventListener('change', onDesktop);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      desktop.removeEventListener('change', onDesktop);
      document.body.style.overflow = prev;
      for (const el of background) el.inert = false;
      // inert 를 먼저 풀어야 열기 버튼에 포커스를 줄 수 있다.
      if (returnFocus.current) { returnFocus.current = false; trigger?.focus(); }
    };
  }, [open]);

  const close = () => { returnFocus.current = true; setOpen(false); };

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
