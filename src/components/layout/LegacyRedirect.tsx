import type { Metadata } from 'next';
import { company } from '@/content/company';
import { basePath } from '@/lib/asset-path';
import { A } from '@/components/ui/Link';

/**
 * 별칭 페이지의 metadata. canonical 과 robots 는 Metadata API 로 넘긴다.
 * 컴포넌트에서 raw <meta name="robots"> 를 렌더하면 root layout 의 값과 중복된다.
 */
export const legacyMetadata = (to: string): Metadata => ({
  title: '페이지 이동 | 휴미즈',
  alternates: { canonical: `${company.siteUrl}${to}` },
  // 별칭 자체는 색인하지 않되 최종 경로로 링크는 따라가게 한다.
  robots: { index: false, follow: true },
});

/**
 * 정적 이동 페이지.
 *
 * 서버 리다이렉트를 쓸 수 없는 환경이므로 canonical + meta refresh + 실제 링크로 처리한다.
 * 응답 코드는 200 이다. 301 이 아니다.
 * 별칭 자체는 색인되지 않도록 noindex 를 둔다. JS·자동 이동이 실패해도 링크로 이동할 수 있다.
 */
export function LegacyRedirect({ to, label }: { to: string; label: string }) {
  const target = `${basePath}${to}/`;
  return (
    <>
      {/* Metadata API 에 http-equiv 가 없어 이것만 raw 로 둔다. React 19 가 head 로 호이스팅한다. */}
      <meta httpEquiv="refresh" content={`0; url=${target}`} />

      <main className="flex min-h-[70svh] items-center">
        <div className="shell w-full">
          <p className="eyebrow">페이지가 이동했습니다</p>
          <h1 className="title-ko mt-6">{label} 페이지로 이동합니다.</h1>
          <p className="lead measure mt-7">
            자동으로 이동하지 않으면 아래 링크를 눌러 주세요.
          </p>
          <A href={to} className="cta-primary mt-11">
            {label} 바로가기<span aria-hidden="true">→</span>
          </A>
        </div>
      </main>
    </>
  );
}
