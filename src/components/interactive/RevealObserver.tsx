'use client';

import { usePathname } from 'next/navigation';
import { useEffect } from 'react';

/**
 * 페이지의 [data-reveal] 요소를 IntersectionObserver 하나로 관찰한다.
 * 이미 화면 안에 있는 요소는 숨기기 전에 먼저 표시 처리해 첫 화면 깜빡임을 막는다.
 * prefers-reduced-motion 이면 아무것도 숨기지 않는다.
 */
export function RevealObserver() {
  const pathname = usePathname();

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const els = [...document.querySelectorAll<HTMLElement>('[data-reveal]:not([data-shown])')];
    const vh = window.innerHeight;
    for (const el of els) {
      const r = el.getBoundingClientRect();
      if (r.top < vh && r.bottom > 0) el.dataset.shown = 'true';
    }
    document.documentElement.classList.add('reveal-ready');

    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) { (e.target as HTMLElement).dataset.shown = 'true'; io.unobserve(e.target); }
        }
      },
      { rootMargin: '0px 0px -8% 0px', threshold: 0.05 },
    );
    for (const el of els) if (!el.dataset.shown) io.observe(el);
    return () => io.disconnect();
  }, [pathname]);

  return null;
}
