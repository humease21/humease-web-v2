/* eslint-disable @next/next/no-img-element -- full-bleed 배경 이미지는 raw <img> 를 쓴다.
   next/image 의 priority preload 주입이 <picture> 의 media 선택을 우회해
   모바일에서 desktop 원본까지 받는 문제가 실측 확인됐다(docs/05 §5). */
import { Reveal } from '@/components/interactive/Reveal';
import { company } from '@/content/company';

/** 마지막 full-width closing scene. 대형 타이포 + 강한 CTA 하나. */
export function ClosingContact({ image }: { image?: { src: string; width: number; height: number } }) {
  return (
    <section className="scene scene-tall ambient-silver relative overflow-hidden">
      {image && (
        <div className="bleed mask-soft" aria-hidden="true">
          <img src={image.src} alt="" width={image.width} height={image.height} loading="lazy" decoding="async"
            style={{ opacity: 0.5 }} />
        </div>
      )}
      <div className="shell layer w-full">
        <div className="max-w-[min(100%,1000px)]">
          <Reveal as="p" className="eyebrow">LET&rsquo;S TALK</Reveal>
          <Reveal delay={1} slow>
            <h2 className="title-ko mt-7">해결하고 싶은 문제가 있다면, 함께 살펴보겠습니다.</h2>
          </Reveal>
          <Reveal delay={2}>
            <p className="lead measure mt-8">
              데이터 환경의 고민부터 AI 서비스 아이디어까지. 현재 상황과 기대하는 변화를 알려주세요.
            </p>
          </Reveal>
          <Reveal delay={3}>
            <div className="mt-12 flex flex-wrap items-center gap-x-10 gap-y-5">
              <a href="/contact" className="cta-primary">프로젝트 문의<span aria-hidden="true">→</span></a>
              <a href={`mailto:${company.email}`} className="cta-ghost">{company.email}</a>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
