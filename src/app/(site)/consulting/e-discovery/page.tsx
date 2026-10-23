import { ConsultingPage } from '@/components/templates/ConsultingPage';
import { assets } from '@/content/assets';
import { pageMeta } from '@/lib/seo';
import { metaForPath } from '@/content/search-pages';

export const metadata = pageMeta({ ...metaForPath('/consulting/e-discovery'), path: '/consulting/e-discovery' });

export default function Page() {
  return (
    <ConsultingPage
      path="/consulting/e-discovery"
      eyebrow="e-Discovery"
      title={<>데이터에서,<br />증거로</>}
      lead={<>조사·감사·분쟁 대응에 필요한 데이터를<br className="hidden sm:inline" /> 보존하고 검색·수집·검토·제출할 수 있는<br className="hidden sm:inline" /> eDiscovery 체계를 설계합니다</>}
      image={assets.A05}
      problemTitle={<>검색보다 중요한,<br />대응 체계</>}
      problemBody="데이터가 여러 시스템에 흩어져 있거나, 요청할 때마다 담당자가 수작업으로 대응하고 있다면 범위·권한·절차부터 정리해야 합니다."
      scope={[
        { k: '대상과 범위 정리', v: '요청 목적, 기간, 관련 데이터와 보존 요건을 함께 확인합니다.', icon: 'target' },
        { k: '검색·검토 구조', v: '검색 조건과 검토 역할, 처리 흐름을 설계합니다.', icon: 'search' },
        { k: '운영과 증적', v: '접근 권한과 수행 기록 등 운영에 필요한 점검 항목을 정리합니다.', icon: 'shield' },
      ]}
      faq={[
        { q: '기존 아카이브와 연계할 수 있나요?', a: '데이터 소스와 제품 버전, 연결 방식, 사용 권한을 확인한 뒤 적용 범위를 검토합니다.' },
        { q: '법률 판단도 제공하나요?', a: '휴미즈는 기술과 운영 체계의 설계를 지원합니다. 법률 판단과 제출 의무의 해석은 고객의 법무 담당자 또는 법률 전문가와 함께 확인해야 합니다.' },
        { q: '특정 제품만 사용하나요?', a: '현재 환경과 요구를 먼저 확인하고 적합한 구성을 검토합니다.' },
      ]}
      ctaLabel="e-Discovery 상담"
    />
  );
}
