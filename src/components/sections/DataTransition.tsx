/* eslint-disable @next/next/no-img-element -- full-bleed 배경 이미지는 raw <img> 를 쓴다.
   next/image 의 priority preload 주입이 <picture> 의 media 선택을 우회해
   모바일에서 desktop 원본까지 받는 문제가 실측 확인됐다(docs/05 §5). */
'use client';

import { useEffect, useRef, useState } from 'react';
import type { Asset } from '@/content/assets';

/** Stage 1 이 완전히 사라지는 진행도. 이 지점에서 fromOpacity 가 정확히 0 이 된다. */
const STAGE1_END = 0.4;
/** Stage 2 가 나타나기 시작하는 진행도. STAGE1_END 와의 간격이 dead-zone 이다. */
const STAGE2_START = 0.46;
/** Stage 2 가 완전히 불투명해지는 진행도. */
const STAGE2_FULL = 0.86;
/** 모션 감소 환경에서 두 단계가 교체되는 지점 — dead-zone 의 중앙. */
const STEP_AT = (STAGE1_END + STAGE2_START) / 2;

const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);

/**
 * FROM DATA → TO INTELLIGENCE.
 * sticky 장면 안에서 스크롤 진행도에 따라 두 상태가 교차한다.
 * 스크롤을 가로채지 않는다 — 사용자는 언제든 자유롭게 스크롤한다.
 *
 * 두 문구는 같은 좌표(absolute inset-x-0 top-0)에 겹쳐 놓이므로
 * 어떤 순간에도 하나만 보여야 한다. 가시 범위를 상호 배타적으로 정의한다.
 *   일반 모션 — V1 = [0, 0.40), dead-zone [0.40, 0.46], V2 = (0.46, 1]  ⇒  V1 ∩ V2 = ∅
 *   모션 감소 — p < 0.43 이면 Stage 1 만, 그 이상이면 Stage 2 만. 중간 상태가 없다.
 *   SSR·하이드레이션 전 — 측정값이 없으므로 p = 0 으로 두어 Stage 1 만 보인다.
 * 불투명도 0 인 단계는 visibility: hidden 으로 합성·접근성 트리에서도 제외한다.
 */
export function DataTransition({ image }: { image: Asset }) {
  const trackRef = useRef<HTMLDivElement>(null);
  // null = 아직 측정 전. Stage 1 단독 상태로 렌더한다.
  const [state, setState] = useState<{ p: number; reduced: boolean } | null>(null);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const el = trackRef.current;
        if (!el) return;
        const r = el.getBoundingClientRect();
        const total = r.height - window.innerHeight;
        if (total <= 0) return;
        // 모션 감소 환경에서도 리스너를 등록한다. 애니메이션 대신 단계 교체로 동작한다.
        setState({ p: clamp01(-r.top / total), reduced: mq.matches });
      });
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    mq.addEventListener('change', onScroll);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      mq.removeEventListener('change', onScroll);
    };
  }, []);

  const p = state?.p ?? 0;
  const reduced = state?.reduced ?? false;
  const stepped = p < STEP_AT ? 0 : 1;

  const fromOpacity = reduced ? 1 - stepped : clamp01((STAGE1_END - p) / STAGE1_END);
  const toOpacity = reduced
    ? stepped
    : clamp01((p - STAGE2_START) / (STAGE2_FULL - STAGE2_START));
  const settle = reduced ? stepped : p;

  return (
    <div ref={trackRef} className="relative h-[240svh]">
      <div className="sticky top-0 flex h-[100svh] items-center overflow-hidden">
        <div className="bleed mask-scene" aria-hidden="true">
          <img
            src={image.src} alt="" width={image.width} height={image.height} loading="lazy" decoding="async"
            style={{
              transform: `scale(${1.1 - settle * 0.1})`,
              filter: `saturate(${0.55 + settle * 0.45}) contrast(${0.94 + settle * 0.12})`,
              transition: reduced ? undefined : 'none',
            }}
          />
        </div>

        <div className="shell layer w-full">
          <div className="relative min-h-[9em] max-w-[min(100%,860px)] md:min-h-[8em]">
            <div
              className="absolute inset-x-0 top-0"
              style={{
                opacity: fromOpacity,
                visibility: fromOpacity > 0 ? 'visible' : 'hidden',
                transform: `translateY(${-settle * 14}px)`,
                pointerEvents: fromOpacity > 0.5 ? 'auto' : 'none',
              }}
            >
              <p className="eyebrow">흩어진 데이터</p>
              <p className="display-ko mt-5">흩어진 데이터,<br />제각각인 관리 기준</p>
            </div>

            <div
              className="absolute inset-x-0 top-0"
              style={{
                opacity: toOpacity,
                visibility: toOpacity > 0 ? 'visible' : 'hidden',
                transform: `translateY(${(1 - settle) * 18}px)`,
                pointerEvents: toOpacity > 0.5 ? 'auto' : 'none',
              }}
            >
              <p className="eyebrow">이해할 수 있는 정보로</p>
              <p className="display-ko mt-5">데이터 거버넌스에서,<br />AX 실행까지</p>
            </div>
          </div>

          <div className="mt-14 h-px w-full max-w-[560px] bg-[color-mix(in_srgb,var(--color-line)_60%,transparent)]">
            <div
              className="h-px bg-[var(--color-accent)]"
              style={{ width: `${settle * 100}%`, transition: reduced ? undefined : 'none' }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
