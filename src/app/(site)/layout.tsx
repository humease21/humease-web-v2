import { SiteHeader } from '@/components/layout/SiteHeader';
import { SiteFooter } from '@/components/layout/SiteFooter';

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-5 focus:top-5 focus:z-[70] focus:bg-[var(--color-accent)] focus:px-5 focus:py-3 focus:text-[#12100C]"
      >
        본문으로 건너뛰기
      </a>
      <SiteHeader />
      {/* 헤더가 overlay 라 main 에 상단 패딩을 두지 않는다 — Hero 가 화면 최상단부터 시작한다. */}
      <main id="main" className="flex-1">{children}</main>
      <SiteFooter />
    </div>
  );
}
