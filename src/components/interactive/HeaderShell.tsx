'use client';

import { useEffect, useState } from 'react';

/** Hero 위에 떠 있다가 스크롤하면 반투명 dark backdrop 으로 전환된다. */
export function HeaderShell({ children }: { children: React.ReactNode }) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-[background-color,border-color,backdrop-filter] duration-500 ${
        scrolled
          ? 'border-b border-[color-mix(in_srgb,var(--color-line)_45%,transparent)] bg-[color-mix(in_srgb,var(--color-bg)_86%,transparent)] supports-[backdrop-filter]:backdrop-blur-md'
          : 'border-b border-transparent bg-transparent'
      }`}
    >
      {children}
    </header>
  );
}
