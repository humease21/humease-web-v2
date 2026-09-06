import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="flex min-h-[88svh] items-center">
      <div className="shell w-full">
        <p className="eyebrow">404</p>
        <h1 className="title-ko mt-6">페이지를 찾을 수 없습니다.</h1>
        <p className="lead measure mt-7">주소가 변경되었거나 존재하지 않는 페이지입니다.</p>
        <div className="mt-12 flex flex-wrap items-center gap-x-10 gap-y-4">
          <Link href="/" className="cta-primary">홈으로 돌아가기<span aria-hidden="true">→</span></Link>
          <Link href="/contact" className="cta-ghost">문의하기</Link>
        </div>
      </div>
    </main>
  );
}
