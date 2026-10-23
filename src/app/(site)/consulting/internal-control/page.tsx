import { ConsultingPage } from '@/components/templates/ConsultingPage';
import { assets } from '@/content/assets';
import { pageMeta } from '@/lib/seo';
import { metaForPath } from '@/content/search-pages';

export const metadata = pageMeta({ ...metaForPath('/consulting/internal-control'), path: '/consulting/internal-control' });

export default function Page() {
  return (
    <ConsultingPage
      path="/consulting/internal-control"
      eyebrow="내부 통제"
      title={<>탐지에서,<br />대응과 증적까지</>}
      lead={<>기업 커뮤니케이션의 위험을 탐지하고<br className="hidden sm:inline" /> 검토·조치·감사 이력까지 관리할 수 있는<br className="hidden sm:inline" /> 내부 통제 체계를 설계합니다</>}
      image={assets.A06}
      problemTitle={<>더 많은 경고가 아닌,<br />명확한 통제</>}
      problemBody="모든 데이터를 무작정 수집하거나 경고를 늘리는 대신, 필요한 범위와 담당자의 역할, 예외 상황과 조치 기준을 구체화합니다."
      scope={[
        { k: '관리 범위', v: '데이터 유형과 대상 시스템, 확인할 리스크를 정리합니다.', icon: 'target' },
        { k: '점검 흐름', v: '정책·규칙·검토 절차와 담당자 역할을 설계합니다.', icon: 'eye' },
        { k: '후속 조치', v: '검토 결과의 기록, 예외 처리, 운영 점검 항목을 연결합니다.', icon: 'shield' },
      ]}
      faq={[
        { q: '기존 보안·아카이빙 환경과 함께 검토하나요?', a: '현재 시스템과 운영 정책을 확인하고 필요한 연계 범위를 살펴봅니다.' },
        { q: '리스크 탐지 정확도를 보장하나요?', a: '데이터·정책·제품 구성에 따라 결과가 달라집니다. 적용 전 시험과 운영 중 점검 기준을 함께 정하는 것이 중요합니다.' },
        { q: '모든 직원 데이터를 수집해야 하나요?', a: '업무 목적과 허용 범위를 먼저 검토하며, 불필요한 수집을 기본 전제로 삼지 않습니다.' },
      ]}
      ctaLabel="내부 통제 상담"
    />
  );
}
