/* eslint-disable @next/next/no-img-element -- 사전 최적화된 정적 자산을 raw <img> 로 쓴다(docs/05 §5). */
import type { Asset } from '@/content/assets';

/**
 * 기존 홈페이지의 장면 배치를 잇는 풀블리드 다크 구간.
 * 이미지를 배경으로 깔고 왼쪽에서 오른쪽으로 옅어지는 마스크 위에 내용을 둔다(내용은 왼쪽 절반).
 */
export function BleedScene({
  image, children, focus = '70% 50%', labelledBy, id,
}: {
  image: Asset;
  children: React.ReactNode;
  focus?: string;
  labelledBy?: string;
  id?: string;
}) {
  return (
    <section id={id} aria-labelledby={labelledBy} className="on-dark section relative scroll-mt-20 overflow-hidden md:min-h-[86svh] md:content-center">
      <div className="bleed mask-scene" aria-hidden="true">
        <img src={image.src} alt="" width={image.width} height={image.height} loading="lazy" decoding="async" style={{ objectPosition: focus }} />
      </div>
      <div className="shell layer">{children}</div>
    </section>
  );
}
