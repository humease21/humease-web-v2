import { adminMeta } from '@/lib/seo';
import { DashboardBoard } from '@/components/admin/DashboardBoard';

export const metadata = adminMeta('대시보드');

/** 정적 셸만 내보내는 서버 컴포넌트. DB 조회는 전부 클라이언트에서 한다(output:'export'). */
export default function Page() {
  return <DashboardBoard />;
}
