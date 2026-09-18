import { Scene } from '@/components/sections/Scene';
import { LegalH2, LegalH3, LegalMeta, LegalOl, LegalP, LegalUl } from '@/components/legal/LegalProse';
import { pageMeta } from '@/lib/seo';
import { metaForPath } from '@/content/search-pages';

export const metadata = pageMeta({ ...metaForPath('/privacy'), path: '/privacy' });

/**
 * 개인정보처리방침. V1.0(대표 승인본, queue/todo 업로드, 2026-09-18)을 베이스로,
 * V1.1(2026-09-18, 대표 승인)에서 Discord 알림 실제 동작과 문구를 일치시키기 위해
 * 제4조/제5조/제6조에 Discord 관련 조항을 추가했다. 기존 V1.0 본문은 queue/done 에
 * 원본 그대로 보존돼 있다 — 조용히 덮어쓰지 않는다. Microsoft 365 실제 데이터 위치,
 * Discord 개인정보 보호 문의처 등 검증되지 않은 값은 추정해 추가하지 않는다.
 */
export default function Page() {
  return (
    <Scene mask="none">
      <article className="measure">
        <p className="eyebrow">개인정보처리방침</p>
        <h1 className="title-ko-sm mt-6">개인정보처리방침</h1>
        <LegalP>
          주식회사 휴미즈(이하 “회사”)는 정보주체의 개인정보를 중요하게 생각하며, 「개인정보 보호법」 등 관련 법령을 준수합니다.
        </LegalP>
        <LegalP>
          회사는 개인정보의 처리 목적, 처리하는 개인정보의 항목, 보유기간, 정보주체의 권리 및 개인정보 보호조치 등을 다음과 같이 공개합니다.
        </LegalP>
        <LegalMeta>버전: V1.1 · 시행일: 2026년 9월 18일</LegalMeta>

        <LegalH2>제1조 개인정보의 처리 목적</LegalH2>
        <LegalP>회사는 다음의 목적으로 개인정보를 처리합니다.</LegalP>
        <LegalOl>
          <li>프로젝트 및 사업 문의 접수</li>
          <li>문의자 확인 및 상담 진행</li>
          <li>문의 내용에 대한 회신 및 후속 연락</li>
          <li>상담 이력 관리 및 분쟁 발생 시 사실관계 확인</li>
          <li>웹사이트 이용 현황 분석 및 서비스 개선</li>
          <li>스팸, 비정상적인 접근 등 웹사이트 보안 및 안정성 확보</li>
        </LegalOl>
        <LegalP>회사는 위 목적 이외의 용도로 개인정보를 이용하지 않으며, 이용 목적이 변경되는 경우 관련 법령에 따라 필요한 조치를 합니다.</LegalP>

        <LegalH2>제2조 처리하는 개인정보의 항목</LegalH2>
        <LegalH3>1. 프로젝트 문의</LegalH3>
        <LegalP>필수 항목</LegalP>
        <LegalUl>
          <li>회사명</li>
          <li>담당자명</li>
          <li>이메일 주소</li>
          <li>문의 내용</li>
        </LegalUl>
        <LegalP>선택 항목</LegalP>
        <LegalUl>
          <li>연락처</li>
          <li>관심 분야</li>
        </LegalUl>
        <LegalP>문의 과정에서 자동으로 처리될 수 있는 정보</LegalP>
        <LegalUl>
          <li>문의 유입 페이지</li>
          <li>UTM Source</li>
          <li>UTM Medium</li>
          <li>UTM Campaign</li>
          <li>폼 진입 시각</li>
          <li>개인정보 수집·이용 동의 일시</li>
        </LegalUl>

        <LegalH3>2. 웹사이트 이용 과정에서 자동으로 생성되는 정보</LegalH3>
        <LegalP>회사는 서비스 운영 및 이용 현황 분석을 위해 다음 정보를 처리할 수 있습니다.</LegalP>
        <LegalUl>
          <li>임의로 생성된 세션 식별자</li>
          <li>방문 페이지 경로</li>
          <li>최초 방문 경로</li>
          <li>유입 도메인</li>
          <li>UTM Source, Medium, Campaign</li>
          <li>기기 유형</li>
          <li>브라우저 유형</li>
          <li>운영체제 유형</li>
          <li>접속 일시</li>
        </LegalUl>
        <LegalP>회사가 운영하는 자체 분석 데이터베이스에는 방문자의 원본 IP 주소 또는 원본 User-Agent 문자열을 저장하지 않습니다.</LegalP>
        <LegalP>다만 웹사이트 호스팅 및 네트워크 제공 사업자는 서비스 제공과 보안을 위해 IP 주소 및 요청 정보를 처리할 수 있습니다.</LegalP>

        <LegalH3>3. 이메일로 직접 문의하는 경우</LegalH3>
        <LegalP>정보주체가 회사의 공식 이메일로 직접 연락하는 경우 다음 정보가 처리될 수 있습니다.</LegalP>
        <LegalUl>
          <li>발신자 이름</li>
          <li>이메일 주소</li>
          <li>이메일 본문</li>
          <li>첨부파일</li>
          <li>이메일에 정보주체가 직접 기재한 기타 정보</li>
        </LegalUl>

        <LegalH2>제3조 개인정보의 처리 및 보유기간</LegalH2>
        <LegalP>회사는 개인정보의 처리 목적을 달성하는 데 필요한 기간 동안만 개인정보를 보유합니다.</LegalP>
        <LegalOl>
          <li>
            프로젝트 문의 및 상담 정보
            <LegalUl>
              <li>보유기간: 문의 접수일로부터 3년</li>
              <li>보유목적: 후속 상담, 상담 이력 관리 및 분쟁 발생 시 사실관계 확인</li>
              <li>정보주체가 삭제를 요청하고 별도의 법적 보존 사유가 없는 경우 보유기간 전이라도 지체 없이 삭제합니다.</li>
            </LegalUl>
          </li>
          <li>
            웹사이트 이용 분석 정보
            <LegalUl>
              <li>보유기간: 수집일로부터 12개월</li>
              <li>보유기간이 경과한 정보는 자동으로 삭제하거나 개인을 식별할 수 없는 형태로 처리합니다.</li>
            </LegalUl>
          </li>
          <li>
            계약 체결 이후 별도의 법령에 따라 보존할 의무가 발생한 정보
            <LegalUl>
              <li>해당 법령에서 정한 기간 동안 별도로 보존할 수 있습니다.</li>
            </LegalUl>
          </li>
        </LegalOl>

        <LegalH2>제4조 개인정보의 제3자 제공</LegalH2>
        <LegalP>회사는 원칙적으로 정보주체의 개인정보를 제3자에게 제공하지 않습니다.</LegalP>
        <LegalP>다만 다음의 경우에는 관련 법령에 따라 개인정보를 제공할 수 있습니다.</LegalP>
        <LegalOl>
          <li>정보주체가 사전에 동의한 경우</li>
          <li>법률에 특별한 규정이 있는 경우</li>
          <li>수사기관 또는 관계기관의 적법한 요청이 있는 경우</li>
        </LegalOl>
        <LegalP>
          신규 문의를 관리자에게 신속히 알리기 위해 Discord 알림 서비스를 이용하며, 이때 회사명, 담당자명, 관심 분야, 문의 내용의 일부(앞부분 최대 20자)를 전송합니다. 이메일 주소, 전화번호, 문의 내용 전문, 문의 식별번호는 Discord로 전송하지 않습니다.
        </LegalP>

        <LegalH2>제5조 개인정보 처리업무의 위탁</LegalH2>
        <LegalP>회사는 원활한 웹사이트 운영을 위하여 다음과 같이 개인정보 처리업무의 일부를 외부 사업자에게 위탁할 수 있습니다.</LegalP>

        <LegalH3>Supabase, Inc.</LegalH3>
        <LegalUl>
          <li>위탁업무: 문의 접수 API, 데이터베이스, 웹사이트 이용 통계 저장, 관리자 인증 관련 시스템 운영</li>
          <li>보유기간: 회사가 설정한 개인정보 보유기간 또는 서비스 계약 종료 시까지</li>
        </LegalUl>

        <LegalH3>GitHub, Inc.</LegalH3>
        <LegalUl>
          <li>위탁업무: 회사 웹사이트 정적 콘텐츠 호스팅 및 서비스 보안</li>
          <li>처리정보: 웹사이트 접속 과정에서 발생하는 IP 주소 및 요청 정보 등</li>
          <li>보유기간: GitHub의 계약 및 개인정보 보호정책에 따른 기간</li>
        </LegalUl>

        <LegalH3>Microsoft Corporation</LegalH3>
        <LegalUl>
          <li>위탁업무: 회사 공식 이메일 송수신 및 보관</li>
          <li>보유기간: 이메일 이용 목적 달성 또는 회사의 보유정책 및 서비스 계약 종료 시까지</li>
        </LegalUl>

        <LegalH3>Discord Inc.</LegalH3>
        <LegalUl>
          <li>위탁업무: 신규 문의 접수 알림 발송</li>
          <li>처리정보: 회사명, 담당자명, 관심 분야, 문의 내용 일부(앞부분 최대 20자)</li>
          <li>보유기간: Discord 채널 내 메시지 보관 정책에 따름(회사가 직접 관리하지 않음)</li>
        </LegalUl>
        <LegalP>회사는 위탁계약 및 서비스 이용 과정에서 개인정보가 안전하게 관리될 수 있도록 필요한 사항을 확인하고 관리합니다.</LegalP>

        <LegalH2>제6조 개인정보의 국외 이전</LegalH2>
        <LegalP>회사는 웹사이트와 문의 시스템 운영을 위해 일부 개인정보를 국외에서 처리하거나 보관할 수 있습니다.</LegalP>

        <LegalH3>Supabase, Inc.</LegalH3>
        <LegalUl>
          <li>이전받는 자: Supabase, Inc.</li>
          <li>연락처: privacy@supabase.io</li>
          <li>주요 처리·보관 국가: 일본</li>
          <li>주요 처리 리전: Tokyo (<code>ap-northeast-1</code>)</li>
          <li>이전되는 개인정보: 프로젝트 문의 정보 및 웹사이트 이용 분석 정보</li>
          <li>이전 시기 및 방법: 문의 제출 또는 웹사이트 이용 시 암호화된 네트워크를 통해 전송</li>
          <li>이용 목적: 데이터베이스 저장, API 처리, 서비스 운영</li>
          <li>보유기간: 본 개인정보처리방침에서 정한 보유기간 또는 서비스 계약 종료 시까지</li>
          <li>이전 근거: 웹사이트 및 문의 서비스 제공을 위해 필요한 개인정보 처리위탁·보관</li>
        </LegalUl>
        <LegalP>
          Supabase 서비스 운영 과정에서 수탁자의 운영 인력 또는 하위처리자가 필요한 범위에서 개인정보를 처리할 수 있으며, 회사는 서비스 계약 및 개인정보 보호 관련 계약에 따라 이를 관리합니다.
        </LegalP>

        <LegalH3>GitHub, Inc.</LegalH3>
        <LegalUl>
          <li>이전받는 자: GitHub, Inc.</li>
          <li>개인정보 보호 문의: dpo@github.com</li>
          <li>주요 처리 국가: 미국 및 GitHub의 글로벌 서비스 인프라 소재 국가</li>
          <li>이전되는 정보: IP 주소, 접속 시각, HTTP 요청 정보 등 웹사이트 접속 과정에서 생성되는 정보</li>
          <li>이전 시기 및 방법: 웹사이트 접속 시 암호화된 네트워크를 통해 처리</li>
          <li>이용 목적: 웹사이트 콘텐츠 전송, 서비스 운영 및 보안</li>
          <li>보유기간: GitHub의 개인정보 보호정책 및 계약에서 정한 기간</li>
        </LegalUl>
        <LegalH3>Discord Inc.</LegalH3>
        <LegalUl>
          <li>이전받는 자: Discord Inc.</li>
          <li>주요 처리 국가: 미국 및 Discord의 글로벌 서비스 인프라 소재 국가</li>
          <li>이전되는 개인정보: 회사명, 담당자명, 관심 분야, 문의 내용 일부(앞부분 최대 20자)</li>
          <li>이전 시기 및 방법: 문의 접수 시 암호화된 네트워크를 통해 전송</li>
          <li>이용 목적: 관리자에게 신규 문의 발생을 신속히 알리기 위함</li>
          <li>보유기간: Discord 채널 내 메시지 보관 정책에 따름</li>
        </LegalUl>

        <LegalP>정보주체는 개인정보의 국외 처리에 관한 문의를 회사 개인정보 보호책임자에게 할 수 있습니다.</LegalP>

        <LegalH2>제7조 개인정보의 파기</LegalH2>
        <LegalP>회사는 개인정보의 보유기간이 경과하거나 처리 목적이 달성된 경우 지체 없이 해당 개인정보를 파기합니다.</LegalP>
        <LegalP>전자적 파일은 복구 또는 재생되지 않도록 삭제하며, 종이 문서가 존재하는 경우 분쇄하거나 안전한 방법으로 폐기합니다.</LegalP>
        <LegalP>회사가 사용하는 데이터베이스의 프로젝트 문의 정보는 접수 후 3년, 웹사이트 이용 분석 정보는 수집 후 12개월이 지나면 정기적인 자동 파기 절차를 통해 삭제합니다.</LegalP>
        <LegalP>서비스 제공 사업자의 백업 시스템에 일시적으로 남아 있는 정보는 해당 사업자의 백업 및 삭제 정책에 따라 순차적으로 삭제됩니다.</LegalP>

        <LegalH2>제8조 정보주체의 권리와 행사방법</LegalH2>
        <LegalP>정보주체는 회사에 대해 다음 권리를 행사할 수 있습니다.</LegalP>
        <LegalUl>
          <li>개인정보 열람 요청</li>
          <li>개인정보 정정 요청</li>
          <li>개인정보 삭제 요청</li>
          <li>개인정보 처리정지 요청</li>
          <li>개인정보 수집·이용 동의 철회</li>
        </LegalUl>
        <LegalP>권리 행사는 이메일을 통해 요청할 수 있습니다.</LegalP>
        <LegalP>개인정보 문의: contact@humease.com</LegalP>
        <LegalP>회사는 관련 법령에서 정한 기간과 절차에 따라 요청을 처리합니다.</LegalP>

        <LegalH2>제9조 개인정보의 안전성 확보조치</LegalH2>
        <LegalP>회사는 개인정보 보호를 위해 다음과 같은 조치를 시행합니다.</LegalP>
        <LegalOl>
          <li>개인정보 접근권한 최소화</li>
          <li>관리자 인증 및 접근통제</li>
          <li>데이터베이스 Row Level Security 등 접근제어 적용</li>
          <li>통신구간 암호화</li>
          <li>개인정보 처리 시스템에 대한 접근권한 관리</li>
          <li>개인정보 처리 위탁업체 관리</li>
          <li>개인정보 보유기간 경과 후 정기적 파기</li>
        </LegalOl>

        <LegalH2>제10조 개인정보 자동수집 장치 및 브라우저 저장소</LegalH2>
        <LegalP>회사는 일반 방문자에 대해 광고 목적의 쿠키를 사용하지 않습니다.</LegalP>
        <LegalP>사이트 이용 분석을 위해 방문 세션 동안 다음 정보를 <code>sessionStorage</code>에 저장할 수 있습니다.</LegalP>
        <LegalUl>
          <li><code>humease_session_id</code></li>
          <li><code>humease_landing_path</code></li>
        </LegalUl>
        <LegalP>해당 정보는 브라우저 탭 또는 세션이 종료되면 브라우저에서 삭제됩니다.</LegalP>
        <LegalP>관리자 로그인 과정에서는 인증 상태 유지를 위해 인증 서비스가 브라우저 저장소를 사용할 수 있습니다.</LegalP>
        <LegalP>정보주체는 브라우저 설정을 통해 저장소 사용을 제한할 수 있습니다. 일반적인 회사 소개 페이지 열람에는 별도의 회원 로그인이 필요하지 않습니다.</LegalP>

        <LegalH2>제11조 개인정보 보호책임자</LegalH2>
        <LegalP>회사는 개인정보 보호와 관련한 업무 및 정보주체의 고충처리를 담당하기 위해 다음과 같이 개인정보 보호책임자를 두고 있습니다.</LegalP>
        <LegalUl>
          <li>개인정보 보호책임자: 정미경 대표이사</li>
          <li>소속: 주식회사 휴미즈</li>
          <li>이메일: contact@humease.com</li>
        </LegalUl>
        <LegalP>개인정보 침해와 관련한 상담이 필요한 경우 개인정보침해신고센터 등 관계기관을 이용할 수 있습니다.</LegalP>

        <LegalH2>제12조 외부 사이트에 대한 안내</LegalH2>
        <LegalP>회사의 홈페이지에는 블로그, 포트폴리오, 회사가 운영하거나 소개하는 별도 서비스 등 외부 사이트로 연결되는 링크가 포함될 수 있습니다.</LegalP>
        <LegalP>외부 사이트로 이동한 이후에는 해당 사이트의 개인정보처리방침 및 이용정책이 적용될 수 있으므로 해당 사이트의 정책을 확인하시기 바랍니다.</LegalP>

        <LegalH2>제13조 개인정보처리방침의 변경</LegalH2>
        <LegalP>본 개인정보처리방침은 관련 법령, 서비스 또는 개인정보 처리방식이 변경되는 경우 수정될 수 있습니다.</LegalP>
        <LegalP>중요한 변경이 있는 경우 시행 전에 홈페이지를 통해 안내합니다.</LegalP>
        <LegalMeta>
          공고일: 2026년 9월 18일
          <br />
          시행일: 2026년 9월 18일
          <br />
          개정 이력 — V1.1(2026-09-18): 신규 문의 Discord 알림에 회사명·담당자명·관심 분야·문의 내용 일부(최대 20자)가 전송되는 사실을 반영해 제4조·제5조·제6조를 개정(이메일·전화번호·문의 내용 전문·문의 식별번호는 전송하지 않음). V1.0(2026-09-18)에서 변경.
        </LegalMeta>
      </article>
    </Scene>
  );
}
