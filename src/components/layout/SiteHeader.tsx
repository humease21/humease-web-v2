import Link from 'next/link';
import { asset } from '@/lib/asset-path';
import { HeaderShell } from '@/components/interactive/HeaderShell';

/**
 * 상단 고정 헤더. 임시 축소 운영(src/content/site-mode.ts) 중에는 로고만 둔다 — 메뉴·문의 버튼·모바일 메뉴 없음.
 * 전체 메뉴 구성은 태그 humease-fullsite-2026-10-26 의 이 파일에 있다.
 */
export function SiteHeader() {
  return (
    <HeaderShell>
      <div className="shell flex h-16 items-center lg:h-[72px]">
        <Link href="/" className="inline-flex min-h-11 items-center" aria-label="휴미즈 홈">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={asset('/brand/logo-horizontal-en-ink.webp')} alt="휴미즈" width={337} height={56} className="h-[19px] w-auto lg:h-[21px]" />
        </Link>
      </div>
    </HeaderShell>
  );
}
