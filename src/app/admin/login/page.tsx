import { adminMeta } from '@/lib/seo';
import { AdminLoginPanel } from '@/components/admin/AdminLoginPanel';

export const metadata = adminMeta('로그인');

/** 정적 셸만 내보내는 서버 컴포넌트. 실제 동작은 전부 클라이언트에서 한다. */
export default function Page() {
  return <AdminLoginPanel />;
}
