import { adminMeta } from '@/lib/seo';
import { InquiriesBoard } from '@/components/admin/InquiriesBoard';

export const metadata = adminMeta('문의 관리');

/** 정적 셸만 내보내는 서버 컴포넌트. DB 조회·수정은 전부 클라이언트에서 한다(output:'export'). */
export default function Page() {
  return <InquiriesBoard />;
}
