import { SiteHeader } from '@/components/layout/SiteHeader';
import { SiteFooter } from '@/components/layout/SiteFooter';
import { PageViewTracker } from '@/components/analytics/PageViewTracker';
import { RevealObserver } from '@/components/interactive/RevealObserver';

/** 공개 사이트 공통 레이아웃. `.theme-site` 가 라이트 팔레트 토큰을 적용한다(DESIGN.md). 관리자 화면은 이 범위 밖이다. */
export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="theme-site flex min-h-screen flex-col">
      <PageViewTracker />
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-3 focus:z-[70] focus:rounded-md focus:bg-[var(--color-text)] focus:px-5 focus:py-3 focus:text-[var(--color-bg)]"
      >
        본문으로 건너뛰기
      </a>
      <SiteHeader />
      <main id="main" className="flex-1">{children}</main>
      <SiteFooter />
      <RevealObserver />
    </div>
  );
}
