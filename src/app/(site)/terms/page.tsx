import { Scene } from '@/components/sections/Scene';
import { LegalH2, LegalMeta, LegalOl, LegalP } from '@/components/legal/LegalProse';
import { pageMeta } from '@/lib/seo';
import { metaForPath } from '@/content/search-pages';

export const metadata = pageMeta({ ...metaForPath('/terms'), path: '/terms' });

/**
 * 홈페이지 이용약관 V1.0. 대표 승인본(queue/todo 업로드, 2026-09-18)을 그대로 옮긴다.
 * 임의 축약·추가·법률해석 변경을 하지 않는다.
 */
export default function Page() {
  return (
    <Scene mask="none">
      <article className="measure">
        <p className="eyebrow">이용약관</p>
        <h1 className="title-ko-sm mt-6">홈페이지 이용약관</h1>
        <LegalMeta>시행일: 2026년 9월 18일</LegalMeta>

        <LegalH2>제1조 목적</LegalH2>
        <LegalP>
          본 약관은 주식회사 휴미즈(이하 “회사”)가 운영하는 <code>www.humease.com</code> 및 회사가 제공하는 홈페이지 관련 서비스의 이용조건과 회사 및 이용자의 권리·의무를 정하는 것을 목적으로 합니다.
        </LegalP>

        <LegalH2>제2조 홈페이지의 성격</LegalH2>
        <LegalP>회사의 홈페이지는 회사, 사업영역, 제품·서비스, 기술정보, 포트폴리오 및 프로젝트 상담 등에 관한 정보를 제공하기 위한 기업 홈페이지입니다.</LegalP>
        <LegalP>현재 홈페이지에서는 일반 이용자를 대상으로 한 회원가입, 온라인 결제 또는 전자상거래 계약 체결 기능을 제공하지 않습니다.</LegalP>

        <LegalH2>제3조 약관의 효력 및 변경</LegalH2>
        <LegalP>본 약관은 홈페이지에 게시함으로써 효력이 발생합니다.</LegalP>
        <LegalP>회사는 관련 법령 또는 서비스 운영상 필요한 경우 본 약관을 변경할 수 있으며, 이용자의 권리 또는 의무에 중대한 영향을 미치는 변경은 홈페이지를 통해 안내합니다.</LegalP>

        <LegalH2>제4조 홈페이지 이용</LegalH2>
        <LegalP>이용자는 관계 법령 및 본 약관을 준수하여 홈페이지를 이용하여야 합니다.</LegalP>
        <LegalP>다음 행위를 해서는 안 됩니다.</LegalP>
        <LegalOl>
          <li>홈페이지의 정상적인 운영을 방해하는 행위</li>
          <li>회사 또는 제3자의 권리를 침해하는 행위</li>
          <li>허위정보를 이용해 문의를 제출하는 행위</li>
          <li>자동화 프로그램 등을 이용한 과도한 요청 또는 스팸 전송</li>
          <li>홈페이지의 보안 또는 시스템에 대한 무단 접근·공격·분석 행위</li>
          <li>관계 법령에 위반되는 행위</li>
        </LegalOl>

        <LegalH2>제5조 프로젝트 문의</LegalH2>
        <LegalP>이용자는 홈페이지의 문의 기능을 통해 회사에 프로젝트 또는 사업 관련 상담을 요청할 수 있습니다.</LegalP>
        <LegalP>문의 접수 자체가 회사와 이용자 사이의 계약 체결을 의미하지 않습니다.</LegalP>
        <LegalP>구체적인 업무 범위, 비용, 일정 및 책임은 필요한 경우 별도의 제안서·견적서·계약 등을 통해 확정됩니다.</LegalP>

        <LegalH2>제6조 제공 정보에 관한 사항</LegalH2>
        <LegalP>회사는 홈페이지에 가능한 정확한 정보를 제공하기 위해 노력합니다.</LegalP>
        <LegalP>
          다만 홈페이지에 게시된 일반적인 기술정보, 제품정보, 법률·컴플라이언스 관련 설명, 사례 또는 콘텐츠는 특정 이용자의 구체적인 상황에 대한 전문적인 자문이나 계약상 보증을 의미하지 않습니다.
        </LegalP>
        <LegalP>제품 또는 제3자 서비스에 관한 정보는 해당 사업자의 정책 또는 제품 변경에 따라 변경될 수 있습니다.</LegalP>

        <LegalH2>제7조 지식재산권</LegalH2>
        <LegalP>홈페이지에 게시된 다음 콘텐츠의 저작권 및 기타 지식재산권은 별도의 표시가 없는 한 회사 또는 적법한 권리자에게 있습니다.</LegalP>
        <LegalOl>
          <li>문서 및 설명</li>
          <li>디자인</li>
          <li>그래픽 및 이미지</li>
          <li>회사 로고 및 브랜드 요소</li>
          <li>자체 제작 콘텐츠</li>
          <li>소프트웨어 및 화면 구성</li>
        </LegalOl>
        <LegalP>이용자는 관련 법령에서 허용하는 범위를 벗어나 회사의 사전 동의 없이 콘텐츠를 복제, 배포, 수정, 판매 또는 상업적으로 이용해서는 안 됩니다.</LegalP>
        <LegalP>제3자의 상표, 제품명, 로고 및 콘텐츠에 대한 권리는 각 권리자에게 있습니다.</LegalP>

        <LegalH2>제8조 외부 사이트 및 제3자 서비스</LegalH2>
        <LegalP>홈페이지에는 블로그, 포트폴리오 또는 제3자가 제공하는 사이트로 연결되는 링크가 포함될 수 있습니다.</LegalP>
        <LegalP>외부 사이트로 이동한 이후의 서비스, 개인정보 처리 및 콘텐츠에 대해서는 해당 사이트의 이용조건과 개인정보 보호정책이 적용됩니다.</LegalP>
        <LegalP>회사는 회사가 직접 관리하지 않는 외부 사이트의 지속적인 이용 가능성 또는 콘텐츠를 보증하지 않습니다.</LegalP>

        <LegalH2>제9조 개인정보 보호</LegalH2>
        <LegalP>회사는 홈페이지 이용 과정에서 개인정보를 처리하는 경우 「개인정보 보호법」 등 관계 법령을 준수합니다.</LegalP>
        <LegalP>
          개인정보 처리에 관한 자세한 사항은 홈페이지의 <a href="/privacy" className="text-[var(--color-accent)] underline underline-offset-2">개인정보처리방침</a>에서 확인할 수 있습니다.
        </LegalP>

        <LegalH2>제10조 서비스의 변경 및 중단</LegalH2>
        <LegalP>회사는 시스템 점검, 보안 문제, 통신 장애, 천재지변 또는 운영상 필요한 사유가 발생하는 경우 홈페이지의 전부 또는 일부를 변경하거나 일시적으로 중단할 수 있습니다.</LegalP>

        <LegalH2>제11조 책임의 제한</LegalH2>
        <LegalP>회사는 회사의 고의 또는 중대한 과실이 없는 한 다음 사유로 발생한 손해에 대해 책임을 부담하지 않습니다.</LegalP>
        <LegalOl>
          <li>이용자의 귀책사유</li>
          <li>불가항력적인 통신 또는 시스템 장애</li>
          <li>회사가 직접 관리하지 않는 제3자 서비스</li>
          <li>이용자가 홈페이지의 일반 정보를 구체적인 전문 자문으로 간주하여 독자적으로 판단한 경우</li>
        </LegalOl>
        <LegalP>본 조는 관계 법령에 따라 회사가 부담해야 하는 책임을 부당하게 제한하지 않습니다.</LegalP>

        <LegalH2>제12조 준거법 및 관할</LegalH2>
        <LegalP>본 약관은 대한민국 법령에 따라 해석됩니다.</LegalP>
        <LegalP>회사와 이용자 사이에 분쟁이 발생한 경우 당사자는 원만한 해결을 위해 노력하며, 해결되지 않는 경우 관계 법령에 따른 관할법원에서 처리합니다.</LegalP>

        <LegalH2>제13조 문의</LegalH2>
        <LegalP>본 약관에 관한 문의는 다음 연락처를 통해 접수할 수 있습니다.</LegalP>
        <LegalP>
          주식회사 휴미즈
          <br />
          이메일: contact@humease.com
        </LegalP>
        <LegalMeta>
          부칙
          <br />
          본 약관은 2026년 9월 18일부터 시행합니다.
        </LegalMeta>
      </article>
    </Scene>
  );
}
