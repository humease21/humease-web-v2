import { Hero } from '@/components/brand/Hero';
import { Section, CapabilityRows, FaqList } from '@/components/sections/Section';
import { ButtonLink } from '@/components/ui/Button';
import { assets } from '@/content/assets';
import { pageMeta } from '@/lib/seo';

export const metadata = pageMeta({
  title: 'Exchange 아카이빙 컨설팅 | 휴미즈',
  description: '메일 보존·검색·사용자 접근·운영을 함께 고려한 Exchange 아카이빙 설계와 도입·이관 검토를 지원합니다.',
  path: '/consulting/exchange-archive',
});

export default function Page() {
  return (
    <>
      <Hero
        eyebrow="ENTERPRISE DATA / EXCHANGE ARCHIVE"
        titleKo="메일의 가치는 남기고, 운영의 부담은 줄이도록."
        lead="메일 보존과 검색, 사용자의 접근 방식과 시스템 운영을 함께 고려해 아카이빙 구조를 설계합니다."
        image={assets.A07}
        priority
      />
      <Section
        title="보관 용량만이 아니라, 사용하는 방식까지."
        lead="아카이브의 목적은 데이터를 옮기는 데서 끝나지 않습니다. 무엇을 얼마나 보관할지, 사용자가 어떻게 찾을지, 운영자가 어떻게 관리할지가 함께 정리되어야 합니다."
      >
        <CapabilityRows
          items={[
            { title: '환경 진단', body: '메일 구성, 사용자 수, 데이터 규모와 증가 추이, 현재 보존 방식을 확인합니다.' },
            { title: '정책·구조 설계', body: '보존 정책, 아카이빙 범위, 검색·접근 방식을 구체화합니다.' },
            { title: '이관·운영 검토', body: '이관 순서와 검증, 운영 인수인계 항목을 정리합니다.' },
          ]}
        />
      </Section>
      <Section eyebrow="FAQ" title="자주 묻는 질문">
        <FaqList
          items={[
            { q: 'Microsoft 365와 온프레미스 모두 가능한가요?', a: '구성·버전·제품 지원 범위가 다르므로 환경을 확인해 적용 가능성을 검토합니다. 단일 방식으로 모든 환경이 지원된다고 안내하지 않습니다.' },
            { q: '용량 절감률을 미리 알 수 있나요?', a: '실제 데이터와 정책을 확인해야 산정할 수 있습니다. 확인하지 않은 비율을 약속하지 않습니다.' },
            { q: 'Enterprise Vault를 검토할 수 있나요?', a: '기존 구성 또는 도입 요구를 기준으로 지원 버전과 기능 범위를 함께 확인합니다.' },
          ]}
        />
        <div className="mt-10"><ButtonLink href="/contact">아카이빙 환경 상담</ButtonLink></div>
      </Section>
    </>
  );
}
