import { adminMeta } from '@/lib/seo';
import { AnalyticsBoard } from '@/components/admin/AnalyticsBoard';

export const metadata = adminMeta('사이트 분석');

/** 정적 셸만 내보내는 서버 컴포넌트. 집계는 전부 클라이언트에서 한다(output:'export'). */
export default function Page() {
  return <AnalyticsBoard />;
}
