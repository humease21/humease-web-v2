/* eslint-disable @next/next/no-img-element -- full-bleed 배경 이미지는 raw <img> 를 쓴다.
   next/image 의 priority preload 주입이 <picture> 의 media 선택을 우회해
   모바일에서 desktop 원본까지 받는 문제가 실측 확인됐다(docs/05 §5). */
'use client';

import { useEffect, useRef, useState } from 'react';
import type { Asset } from '@/content/assets';

/**
 * FROM DATA → TO INTELLIGENCE.
 * sticky 장면 안에서 스크롤 진행도에 따라 두 상태가 교차한다.
 * 스크롤을 가로채지 않는다 — 사용자는 언제든 자유롭게 스크롤한다.
 * JS 나 모션이 없어도 두 메시지가 모두 읽히도록 정적 상태를 기본값으로 둔다.
 */
export function DataTransition({ image }: { image: Asset }) {
  const trackRef = useRef<HTMLDivElement>(null);
  // null = 아직 판정 전(정적 완전 상태로 렌더). 스크롤 핸들러가 처음 돌 때 확정된다.
  const [state, setState] = useState<{ p: number; motion: boolean } | null>(null);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const el = trackRef.current;
        if (!el) return;
        const r = el.getBoundingClientRect();
        const total = r.height - window.innerHeight;
        if (total <= 0) return;
        setState({ p: Math.min(1, Math.max(0, -r.top / total)), motion: true });
      });
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, []);

  // 모션이 꺼져 있으면 두 문구를 모두 보여준다(정적 완전 상태)
  const motion = state?.motion ?? false;
  const p = state?.p ?? 0;
  const fromOpacity = motion ? Math.max(0, 1 - p * 2.1) : 1;
  const toOpacity = motion ? Math.max(0, (p - 0.42) * 2.3) : 1;
  const settle = motion ? p : 1;

  return (
    <div ref={trackRef} className="relative h-[240svh]">
      <div className="sticky top-0 flex h-[100svh] items-center overflow-hidden">
        <div className="bleed mask-scene" aria-hidden="true">
          <img
            src={image.src} alt="" width={image.width} height={image.height} loading="lazy" decoding="async"
            style={{
              transform: `scale(${1.1 - settle * 0.1})`,
              filter: `saturate(${0.55 + settle * 0.45}) contrast(${0.94 + settle * 0.12})`,
              transition: motion ? 'none' : undefined,
            }}
          />
        </div>

        <div className="shell layer w-full">
          <div className="relative min-h-[9em] max-w-[min(100%,860px)] md:min-h-[8em]">
            <div
              className="absolute inset-x-0 top-0"
              style={{ opacity: fromOpacity, transform: `translateY(${-settle * 14}px)` }}
            >
              <p className="eyebrow">흩어진 데이터</p>
              <p className="display-ko mt-5">흩어진 기록, 서로 다른 시스템, 찾기 어려운 정보.</p>
            </div>

            <div
              className="absolute inset-x-0 top-0"
              style={{
                opacity: toOpacity,
                transform: `translateY(${(1 - settle) * 18}px)`,
                pointerEvents: toOpacity > 0.5 ? 'auto' : 'none',
              }}
            >
              <p className="eyebrow">이해할 수 있는 정보로</p>
              <p className="display-ko mt-5">정돈된 데이터가 사람에게 쓸모 있는 판단으로 이어집니다.</p>
            </div>
          </div>

          <div className="mt-14 h-px w-full max-w-[560px] bg-[color-mix(in_srgb,var(--color-line)_60%,transparent)]">
            <div
              className="h-px bg-[var(--color-accent)]"
              style={{ width: `${settle * 100}%`, transition: motion ? 'none' : undefined }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
