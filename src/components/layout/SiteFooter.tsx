import Link from 'next/link';
import { asset } from '@/lib/asset-path';

/**
 * 하단 푸터. 임시 축소 운영(src/content/site-mode.ts) 중에는 로고와 개인정보처리방침 링크만 둔다.
 * 처리방침은 개인정보 보호법 제30조·시행령 제31조의 홈페이지 지속 게재 의무 때문에 남긴다(대표 승인 2026-10-26,
 * docs/agent/research/privacy-policy-disclosure.md). 이용약관은 문의 동의 영역과 처리방침에서 연결된다.
 * 전체 구성은 태그 humease-fullsite-2026-10-26 의 이 파일에 있다.
 */
export function SiteFooter() {
  return (
    <footer className="on-dark border-t border-[var(--color-line)]">
      <div className="shell flex flex-col gap-6 py-12 sm:flex-row sm:items-center sm:justify-between md:py-14">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={asset('/brand/logo-horizontal-en.webp')} alt="휴미즈" width={337} height={56} className="h-[21px] w-auto self-start sm:self-auto" />
        <Link href="/privacy" className="inline-flex min-h-11 items-center text-[14px] font-semibold text-[var(--color-body)] transition-colors hover:text-[var(--color-text)]">
          개인정보처리방침
        </Link>
      </div>
    </footer>
  );
}
