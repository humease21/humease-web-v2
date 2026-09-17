import type { Metadata } from 'next';
import { AdminShell } from '@/components/admin/AdminShell';

/**
 * 관리자 콘솔 레이아웃. `(site)` 라우트 그룹과 완전히 분리된다
 * — SiteHeader/SiteFooter/PageViewTracker 를 쓰지 않는다.
 *
 * 이 layout 의 robots 는 하위 전체의 기본값이다. 각 page 도 `adminMeta()` 로
 * 같은 값을 다시 낸다 — 한쪽만 고쳐도 색인이 열리는 일이 없도록 이중으로 둔다.
 */
export const metadata: Metadata = {
  title: { default: '휴미즈 관리자', template: '%s' },
  robots: { index: false, follow: false, nocache: true, googleBot: { index: false, follow: false } },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <AdminShell>{children}</AdminShell>;
}
