import { adminMeta } from '@/lib/seo';
import { PortfolioBoard } from '@/components/admin/PortfolioBoard';

export const metadata = adminMeta('포트폴리오');

/** 정적 셸만 내보내는 서버 컴포넌트. DB 조회·저장은 전부 클라이언트에서 한다(output:'export'). */
export default function Page() {
  return <PortfolioBoard />;
}
