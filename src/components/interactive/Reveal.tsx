'use client';

import { useEffect, useRef } from 'react';

/**
 * 등장 모션. IntersectionObserver 만 쓰고 라이브러리는 넣지 않는다.
 * prefers-reduced-motion 에서는 CSS 가 즉시 최종 상태로 만든다(globals.css).
 * JS 가 실패해도 아래 useEffect 가 안 돌 뿐이므로, 그 경우를 대비해
 * 200ms 안에 관찰이 시작되지 않으면 전부 보이도록 fallback 을 둔다.
 */
export function Reveal({
  children, as: Tag = 'div', delay, slow, className,
}: {
  children: React.ReactNode;
  as?: 'div' | 'section' | 'p' | 'h2' | 'li' | 'span';
  delay?: 1 | 2 | 3 | 4;
  slow?: boolean;
  className?: string;
}) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      el.dataset.shown = 'true';
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) { (e.target as HTMLElement).dataset.shown = 'true'; io.unobserve(e.target); }
        }
      },
      { rootMargin: '0px 0px -12% 0px', threshold: 0.08 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const T = Tag as React.ElementType;
  return (
    <T
      ref={ref}
      data-reveal={slow ? 'slow' : ''}
      data-delay={delay}
      className={className}
    >
      {children}
    </T>
  );
}
