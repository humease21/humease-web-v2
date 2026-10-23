import Link from 'next/link';
import { SiteHeader } from '@/components/layout/SiteHeader';
import { SiteFooter } from '@/components/layout/SiteFooter';

export default function NotFound() {
  return (
    <div className="theme-site flex min-h-screen flex-col">
      <SiteHeader />
      <main id="main" className="flex flex-1 items-center">
        <div className="shell section w-full">
          <p className="eyebrow">404</p>
          <h1 className="display-page mt-4">페이지를 찾을 수 없습니다.</h1>
          <p className="lead measure mt-5">주소가 변경되었거나 존재하지 않는 페이지입니다.</p>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <Link href="/" className="btn btn-primary">홈으로 돌아가기<span aria-hidden="true">→</span></Link>
            <Link href="/contact" className="btn btn-secondary">문의하기</Link>
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
