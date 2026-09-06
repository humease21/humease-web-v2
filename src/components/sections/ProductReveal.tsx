/* eslint-disable @next/next/no-img-element -- full-bleed 배경 이미지는 raw <img> 를 쓴다.
   next/image 의 priority preload 주입이 <picture> 의 media 선택을 우회해
   모바일에서 desktop 원본까지 받는 문제가 실측 확인됐다(docs/05 §5). */
import type { Asset } from '@/content/assets';
import { Reveal } from '@/components/interactive/Reveal';

/**
 * 맘이음 — 일반 서비스 카드가 아니라 독립 Product Reveal 장면.
 * 배경 톤을 미세하게 따뜻하게 전환하고 champagne/warm ivory 포인트를 쓴다.
 * 승인된 문구·자산만 사용한다. 가짜 앱 UI·사용자 수·성과를 만들지 않는다.
 */
export function ProductReveal({ image, body }: { image: Asset; body?: string }) {
  return (
    <section className="scene scene-tall ambient-warm relative overflow-hidden">
      <div className="bleed" aria-hidden="true">
        <img src={image.src} alt="" width={image.width} height={image.height} loading="lazy" decoding="async" />
        <div
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(to right, var(--color-bg) 6%, color-mix(in srgb, var(--color-bg) 76%, transparent) 48%, color-mix(in srgb, var(--color-bg) 30%, transparent) 100%),'
              + 'linear-gradient(to bottom, color-mix(in srgb, #2a2119 22%, transparent) 0%, transparent 55%)',
          }}
        />
      </div>

      <div className="shell layer w-full">
        <div className="max-w-[min(100%,880px)]">
          <Reveal as="p" className="eyebrow">BUILT BY HUMEASE</Reveal>
          <Reveal delay={1} slow>
            <h2 className="display-en mt-6 text-[var(--color-warm)]">We don&rsquo;t just advise.<br />We build.</h2>
          </Reveal>

          <Reveal delay={2}>
            <div className="mt-10 flex flex-wrap items-center gap-4">
              <h3 className="title-ko-sm text-[var(--color-text)]">맘이음</h3>
              <span className="border border-[color-mix(in_srgb,var(--color-warm)_50%,transparent)] px-3 py-1 text-[11px] font-medium tracking-[0.14em] text-[var(--color-warm)]">
                개발 중
              </span>
            </div>
          </Reveal>

          <Reveal delay={3}>
            <p className="mt-7 text-[19px] leading-[1.6] text-[var(--color-text)] md:text-[26px] md:leading-[1.5]">
              친구처럼 곁에 있고, 비서처럼 도와주고, 가족과 연결해주는 AI
            </p>
          </Reveal>

          <Reveal delay={4}>
            <p className="lead measure mt-7">
              {body ?? '부모님에게는 일상을 함께하는 대화 상대를, 가족에게는 더 자연스럽게 연결되는 계기를. 휴미즈가 준비하고 있는 가족 소통 AI 서비스입니다.'}
            </p>
          </Reveal>

          <Reveal delay={4}>
            <a href="/ai-services/mom-ie" className="cta-ghost mt-11">
              맘이음 프로젝트 보기<span aria-hidden="true">→</span>
            </a>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
