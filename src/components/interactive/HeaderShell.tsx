'use client';

import { useEffect, useState } from 'react';

/** 상단 고정 헤더. 스크롤하면 얇은 그림자로 본문과 구분한다. 배경은 항상 불투명에 가깝게 유지해 가독성을 지킨다. */
export function HeaderShell({ children }: { children: React.ReactNode }) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 border-b bg-[color-mix(in_srgb,var(--color-bg)_94%,transparent)] transition-shadow duration-300 supports-[backdrop-filter]:backdrop-blur-md ${
        scrolled ? 'border-[var(--color-line)] shadow-[0_6px_24px_-18px_rgb(14_18_23/0.35)]' : 'border-transparent'
      }`}
    >
      {children}
    </header>
  );
}
