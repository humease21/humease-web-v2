import Link from 'next/link';

/** docs/03 §13 404 */
export default function NotFound() {
  return (
    <main className="flex min-h-screen items-center">
      <div className="shell py-24">
        <h1 className="display-ko">페이지를 찾을 수 없습니다.</h1>
        <p className="body-lg mt-5">주소가 변경되었거나 존재하지 않는 페이지입니다.</p>
        <div className="mt-9 flex flex-wrap gap-3">
          <Link href="/" className="inline-flex min-h-[48px] items-center rounded-lg bg-[var(--color-accent)] px-6 text-[15px] font-medium text-[#12100C]">홈으로 돌아가기</Link>
          <Link href="/contact" className="inline-flex min-h-[48px] items-center rounded-lg border border-[var(--color-line)] px-6 text-[15px] font-medium">문의하기</Link>
        </div>
      </div>
    </main>
  );
}
