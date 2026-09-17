import { adminMeta } from '@/lib/seo';
import { SettingsBoard } from '@/components/admin/SettingsBoard';

export const metadata = adminMeta('사이트 설정');

/** 정적 셸만 내보내는 서버 컴포넌트. DB 조회·저장은 전부 클라이언트에서 한다(output:'export'). */
export default function Page() {
  return <SettingsBoard />;
}
