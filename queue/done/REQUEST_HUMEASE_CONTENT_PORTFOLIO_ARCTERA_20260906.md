# REQUEST — 휴미즈 홈페이지 콘텐츠·AI 포트폴리오·Arctera Solutions 보강

| 항목 | 기준 |
|---|---|
| Request ID | `HUMEASE-WEB-20260906-CONTENT-01` |
| 문서 버전 | 1.0 |
| 작성일 | 2026-09-06 / Asia/Seoul |
| 대상 저장소 | `humease21/humease-web-v2` |
| 문서 성격 | **기존 구현에 추가하는 변경 요청서. 신규 구축 명세서가 아니다.** |
| 구현 담당 | Claude Code |
| 독립 점검 | Antigravity — READ-ONLY |
| 최종 승인 | 대표님 |
| 유지하는 기술 | Next.js App Router · TypeScript · Tailwind CSS · Static Export · GitHub Actions · GitHub Pages |
| 제외 | Vercel, 프레임워크 재작성, 이미지 생성·재생성, 신규 유료 CMS, 운영 DNS 변경 |

> **목표: 고급스러운 디자인 안에 휴미즈의 실제 사업과 구현 역량을 충분히 담는다.**
> Enterprise Data와 Applied AI는 역량을, AI Portfolio는 실제 개발 프로젝트를, Arctera Solutions는 외부 엔터프라이즈 제품과 적용 전문성을 보여준다.

---

## 0. 실행 요약과 우선순위

### 0.1 반드시 반영할 6가지

1. `/ai-services`를 맘이음 단일 소개에서 **프로젝트를 계속 추가할 수 있는 회사 AI 포트폴리오**로 확장한다.
2. 기존 홈페이지의 프로젝트 목록을 조사·이관한다. 확인된 기존 항목은 **AnyBuild, HairAI, 내친구 케이**이며, 새 홈페이지의 **맘이음**은 개발 중 프로젝트로 별도 관리한다.
3. `/solutions`의 공개 명칭을 **Arctera Solutions**로 바꾸고 **공식 파트너로 오인될 표현을 제거**한다.
4. Arctera 공식 자료에 근거한 **6개 해결 과제와 4개 핵심 제품**을 한국어로 소개한다. 개별 제품은 독립 상세페이지를 갖는다.
5. 제품 표기를 **`Enterprise Vault Capture (formerly Merge1)`**로 통일하고, 기존 `Merge1` 검색어와 링크의 연속성을 확보한다.
6. 메인·관련 컨설팅 페이지에서 포트폴리오와 솔루션으로 자연스럽게 연결한다. 내용을 늘리되 동일한 설명과 거대한 빈 화면을 반복하지 않는다.

### 0.2 기존 지침과의 관계

- 대표님이 이미 전달한 **A안 프리미엄 디자인·레이아웃 지침은 유지**한다. 이 요청을 이유로 이전의 `55:45 텍스트+둥근 이미지 카드` 구조로 되돌리지 않는다.
- 이번 요청은 **콘텐츠·정보구조·추가 상세페이지·검색 대응**을 보강한다. 디자인을 처음부터 다시 만드는 작업이 아니다.
- 이전 명세의 ‘맘이음 한 개만 소개’, ‘솔루션 세 개를 한 줄씩 소개’, ‘공개 페이지는 항상 12개’ 기준은 이번 범위에서 대체한다.
- Vercel 관련 옛 문서는 실행하지 않는다. 저장소의 GitHub Pages 전환 결정과 이번 요청을 우선한다.
- 호스팅 변경, `www.humease.com` 연결, DNS·CNAME·인증서 작업은 별도 승인 대상이다.
- 이전 대화에서 예시로 나온 제품·서비스·역할을 실제 승인된 사업 사실로 자동 승격하지 않는다.

### 0.3 이번 작업의 완료 구분

**구현 완료**와 **공개 승인 완료**를 분리한다. 등록 구조·페이지·검수는 진행하되, 운영 상태·소유 주체·공개 허가 등 확인되지 않은 프로젝트 정보는 해당 항목의 공개만 보류한다. 보류 항목이 있으면 ‘전체 공개 완료’라고 보고하지 않는다.

---

## 1. 현재 확인한 기준선

2026-09-06 GitHub 소스를 READ-ONLY로 조회한 결과다. 작업 시작 시 로컬 변경과 최신 HEAD를 다시 대조한다. 이 문서가 실제 화면·기능의 QA 통과를 의미하지는 않는다.

| 확인 대상 | 확인 내용 | 근거 |
|---|---|---|
| 구 홈페이지 `src/pages/AIServices.tsx` | `/data/ai-services.json`에서 목록을 읽고 외부 서비스로 연결 | [R01] |
| 구 홈페이지 `public/data/ai-services.json` | AnyBuild, HairAI, 내친구 케이 3개 등록 | [R02] |
| 신 홈페이지 `/ai-services` | 맘이음 중심의 단일 `ProductReveal` 구성 | [R03] |
| 신 홈페이지 `/solutions` | Enterprise Vault, Merge1, Data Insight 세 항목과 간략 설명 | [R04] |
| 구 홈페이지 `/solutions` | `ev`, `merge1`, `datainsight` 앵커 및 EV 세부 기능 소개 존재 | [R05] |
| 구 홈페이지 표현 | `Strategic Partners` 이미지 alt, ‘한국 시장 유일’ 등 재사용하면 안 되는 표현 존재 | [R05] |
| 신 홈페이지 SEO | 공통 `pageMeta()`가 title·description·canonical·OG를 생성 | [R06] |

### 중요한 정정

- **기존 세 서비스를 ‘내친구 케이·맘이음·모나리’로 확정하지 않는다.** 그것은 이전 답변의 추정 목록이었다.
- 실제 이관 출처에 있는 세 항목을 먼저 보존한다. 맘이음까지 데이터 후보가 네 개가 되어도 억지로 세 개에 맞추지 않는다.
- 기존 목록에 있다는 사실은 **현재 정상 운영, 최신 기능, 법인 소유권을 모두 검증했다는 뜻이 아니다.** 해당 정보는 구분해 확인한다.
- AnyBuild·HairAI·내친구 케이의 외부 서비스 운영 상태는 이번 문서 작성에서 검증 완료되지 않았다. 조회 도구의 접근 실패를 서비스 장애로 단정하지 않는다.

---

## 2. 범위와 변경 금지선

### 2.1 포함

- 메뉴·푸터의 영역 명칭과 내부 연결 정리.
- 홈의 사업 설명·포트폴리오 진입·Arctera Solutions 진입 보강.
- AI 포트폴리오 목록, 공통 데이터 구조, 프로젝트별 상세페이지, 향후 추가 절차.
- Arctera Solutions 허브와 4개 제품 상세페이지의 한국어 콘텐츠.
- 기존 EV 관련 세부 설명 중 근거가 있는 내용의 유지·정리.
- Capture/Merge1 명칭, 메타데이터, 본문, 내부 링크, 기존 앵커 대응.
- 새 경로를 포함한 정적 빌드·모바일·접근성·검색·링크 회귀 검수.
- 변경 요청 추적표와 구현·공개 승인 보고서.

### 2.2 제외

- 저장소 신규 생성, 프레임워크 교체, 기존 구현 전체 폐기.
- 이미지 프롬프트 작성, 이미지 신규 생성·재생성, 임의 로고 제작.
- Vercel 및 새로운 유료 호스팅·CMS·분석 서비스 도입.
- Next.js 서버 API, Server Actions, 런타임 SSR, 별도 서버 구축.
- 운영 DB·RLS·관리자 인증·메일·문의 백엔드 구조 변경.
- 실제 문의 전송, 운영 메일·알림 발송, 실제 개인정보를 이용한 테스트.
- 구 저장소 수정, 운영 DNS·CNAME·MX·TXT 변경, 운영 도메인 전환.
- 공식 파트너·총판·인증·독점 관계나 확인되지 않은 고객 실적 생성.
- Arctera 전체 제품군을 무제한 추가하거나 Unified Platform을 휴미즈의 확정 제공 제품으로 추가하는 일.

### 2.3 판단 기준

| 관점 | 이번 요청에 적용할 기준 |
|---|---|
| 조력자 34% | 기존 데이터 전문성과 실제 AI 프로젝트가 함께 드러나도록 콘텐츠를 보강한다. |
| 조언자 33% | 공식 파트너 오인, 미확인 실적, 중복 문단, 과도한 범위 확장과 운영 변경을 차단한다. |
| 혁신가 33% | 프로젝트 하나를 추가하면 목록·상세·홈·사이트맵이 함께 갱신되는 누적형 포트폴리오로 만든다. |

---

## 3. 정보구조와 메뉴

### 3.1 영역의 역할

| 공개 영역 | 답해야 할 질문 | 기준 경로 |
|---|---|---|
| Enterprise Data | 기업 데이터의 어떤 문제를 해결하는가? | `/enterprise-data/` |
| Applied AI | 고객의 아이디어와 업무를 어떻게 AI 서비스로 만드는가? | `/consulting/ai-transformation/` |
| AI Portfolio | 실제로 어떤 AI 프로젝트를 개발했거나 개발하고 있는가? | `/ai-services/` |
| Arctera Solutions | 어떤 외부 제품이 어떤 데이터 과제를 지원하는가? | `/solutions/` |
| Insights | 기술을 어떻게 이해하고 설명하는가? | `/insights/` |
| About | 휴미즈는 누구이며 어떤 경험에 기반하는가? | `/about/` |
| Contact | 어떤 내용으로 상담할 수 있는가? | `/contact/` |

메뉴의 순서와 모바일 노출은 기존 A안 레이아웃을 존중한다. 긴 영문명을 억지로 한 줄에 넣기보다 메뉴 폭을 조정한다. URL에 `portfolio`가 없다는 이유로 `/ai-services/`를 변경하지 않는다.

### 3.2 대상 경로

```text
/                                      기존 홈 보강
/enterprise-data/                      관련 영역·제품 연결 보강
/consulting/ai-transformation/          제공 역량과 실제 포트폴리오 연결
/consulting/e-discovery/                eDiscovery 제품·컨설팅 역할 구분
/consulting/internal-control/           감독·검토·접근 분석 관련 연결
/consulting/exchange-archive/           Enterprise Vault 상세 연결
/ai-services/                          AI Portfolio 허브로 확장
/ai-services/anybuild/                  기존 포트폴리오 이관 대상
/ai-services/hairai/                    기존 포트폴리오 이관 대상
/ai-services/k-bestie/                  기존 포트폴리오 이관 대상
/ai-services/mom-ie/                    기존 맘이음 상세 유지·정리
/solutions/                            Arctera Solutions 허브
/solutions/enterprise-vault/            Enterprise Vault Complete 상세
/solutions/enterprise-vault-capture/    Capture (formerly Merge1) 상세
/solutions/data-insight/                Data Insight 상세
/solutions/ediscovery-platform/         eDiscovery Platform 상세
/about/                                회사·개인 경력 구분과 관련 링크 점검
/insights/                             실제 글과 관련 영역 연결
/contact/                              문의 동선 유지
```

프로젝트 상세는 공개 조건을 만족한 항목만 실제 HTML을 생성한다. 기존 정적 경로와 `[slug]` 라우트가 충돌하지 않게 한 방식으로 정리하고, `/ai-services/mom-ie/` 주소는 유지한다.

---

## 4. 홈 콘텐츠 보강 — 짧게 읽히고 깊게 연결되게

### 4.1 기본 원칙

- 현재 A안 Hero·장면·타이포·기존 이미지를 유지한다.
- 핵심 메시지 한 개, 짧은 설명, 다음 상세로 가는 링크를 기본 단위로 삼는다.
- 각 장면에 서로 다른 역할을 부여한다. 같은 철학을 영어와 한국어로 길게 반복하지 않는다.
- 아래 문구는 홈페이지 반영용이다. `[내부]`로 표시한 문장은 공개하지 않는다.
- 상세 정보가 늘어났다는 이유로 모든 구간을 100svh로 고정하지 않는다. 상세 구간은 내용에 맞는 높이를 사용한다.

### 4.2 Hero — 유지

**영문 제목**

> Complexity, made intelligent.

**한글 보조 제목**

> 복잡한 데이터와 아이디어를, 실제로 작동하는 기술로.

**설명**

> 기업 데이터의 보존과 통제부터 AI 서비스의 설계와 구현까지. 휴미즈는 기술을 현실의 문제 해결로 연결합니다.

**CTA**: `사업영역 살펴보기` → 홈 사업영역 / `프로젝트 문의` → `/contact/`

### 4.3 WHY HUMEASE — 데이터와 AI의 연결

**제목**

> 데이터의 신뢰에서, AI의 실행으로.

**설명**

> 필요한 정보를 보존하고, 찾아내고, 올바르게 다루는 일. 휴미즈는 기업 데이터 환경에 대한 이해를 바탕으로 실제 사용되는 AI 서비스와 시스템을 설계합니다.

[내부] ‘휴미즈 법인이 20년간 운영됐다’고 읽히는 표현은 금지한다. 인력의 경력은 About에서 인물·기간·역할을 확인한 뒤 별도로 표시한다.

### 4.4 Enterprise Data — 명칭 나열에서 문제 해결로

**제목**

> 중요한 데이터는, 보관한 뒤에도 관리할 수 있어야 합니다.

**설명**

> 무엇을 얼마나 보존하고, 누가 접근하며, 필요한 순간 어떻게 찾아 제출할지. 데이터의 전체 흐름을 고객 환경과 운영 요구에 맞춰 검토합니다.

| 짧은 항목 | 화면 문구 |
|---|---|
| Preserve · 보존 | 필요한 데이터를 정책에 맞게 남깁니다. |
| Discover · 검색 | 필요한 정보와 관련 기록을 찾는 구조를 설계합니다. |
| Control · 통제 | 접근과 검토의 기준을 명확히 합니다. |
| Respond · 대응 | 감사·조사·자료 제출에 필요한 절차를 준비합니다. |

**CTA**: `Enterprise Data 알아보기` → `/enterprise-data/`

**동일 영역 하단의 짧은 연결**

> Arctera Solutions — 제품의 기능과 고객 환경에 맞는 적용 범위를 살펴보세요.

`Arctera Solutions 보기` → `/solutions/`

[내부] Arctera를 홈의 거대한 별도 카탈로그로 복제하지 않는다. 허브로 연결되는 짧은 증거 영역으로 배치한다.

### 4.5 Applied AI — 고객에게 제공하는 역량

**제목**

> 아이디어를, 실제로 쓰이는 AI로.

**설명**

> 해결할 문제와 사용할 사람을 먼저 정하고, 대화 경험·데이터 흐름·업무 연결을 설계합니다. 필요한 기능을 구현한 뒤 실제 사용 과정에서 확인하고 개선합니다.

**표현할 범위**: AI 서비스 기획 / 대화형 서비스 / 업무 자동화 / 웹 애플리케이션 / 프로토타입 검증.

**CTA**: `Applied AI 알아보기` → `/consulting/ai-transformation/`

### 4.6 HOW WE WORK — 방법론은 한 번만

**제목**

> 문제를 이해하는 데서, 작동을 확인하는 데까지.

| 단계 | 문구 |
|---|---|
| Understand | 현재 환경, 사용자, 실제 문제를 확인합니다. |
| Architect | 데이터·기술·운영의 연결 구조를 설계합니다. |
| Build | 합의한 범위부터 실제 사용할 수 있게 구현합니다. |
| Validate | 사용 흐름과 운영 조건을 확인하고 개선합니다. |

[내부] Applied AI 장면에 거의 같은 4단계 방법론을 또 넣지 않는다. 컨설팅 상세에는 이 단계별 실제 검토 항목을 설명한다.

### 4.7 AI Portfolio — 맘이음 한 개 고정 제거

**Eyebrow**: `AI PORTFOLIO`

**제목**

> 우리가 만든 것들이, 우리의 역량을 설명합니다.

**설명**

> 아이디어에서 출발해 서비스로 이어지는 과정. 휴미즈의 AI 개발 프로젝트와 그 안에서 풀어가는 문제를 소개합니다.

- 공개 승인된 프로젝트 중 `featured` 항목 최대 3개를 보여준다.
- 각 항목은 이름·한 줄 정의·검증된 현재 단계·상세 링크만 노출한다.
- 홈에 3개만 보여도 포트폴리오 전체를 3개로 제한하지 않는다.
- 기존의 맘이음 단일 하드코딩을 공통 포트폴리오 데이터 기반으로 바꾼다.

**CTA**: `전체 AI 포트폴리오 보기` → `/ai-services/`

### 4.8 EXPERIENCE · INSIGHTS · CONTACT

**Experience 제목**

> 기술의 깊이는, 문제를 이해해 온 경험에서 나옵니다.

**설명**

> 기업의 메시징·아카이빙·정보 거버넌스 환경을 이해하는 전문성을 바탕으로, 현실적인 제약까지 고려한 기술 적용을 지향합니다.

`휴미즈 알아보기` → `/about/`

**Insights 제목**: `현장에서 생각하고, 기술로 답합니다.`

실제 공개된 글이 있으면 제목·날짜·주제·링크를 보여준다. 없으면 기존 인사이트 허브 링크만 두고 가짜 글과 날짜를 만들지 않는다.

**Contact 제목**: `어떤 문제를 함께 해결할까요?`

**설명**: `기업 데이터 환경의 고민부터 AI 서비스 아이디어까지. 현재 상황과 기대하는 변화를 알려주세요.`

`프로젝트 문의` → `/contact/`

---

## 5. AI Portfolio — 지속적으로 쌓이는 구조

### 5.1 허브의 공개 문구

| 위치 | 문구 |
|---|---|
| 메뉴 | AI Portfolio |
| Eyebrow | BUILT BY HUMEASE |
| H1 | 직접 만든 서비스로, AI의 가능성을 보여줍니다. |
| 설명 | 아이디어를 어떻게 서비스로 구체화했는지, 어떤 문제를 풀고 무엇을 구현했는지. 휴미즈의 AI 개발 포트폴리오를 소개합니다. |
| 목록 제목 | AI 프로젝트 |
| 하단 CTA | AI 아이디어를 함께 구체화하고 싶으신가요? |
| CTA 버튼 | 협업 문의 |

`Built by HUMEASE`는 포트폴리오 브랜딩이다. 모든 항목의 법인 소유·운영을 자동으로 뜻하게 만들지 말고 프로젝트별 실제 개발 참여와 운영 관계를 구분한다.

### 5.2 초기 이관 데이터

다음은 **구 사이트의 실제 등록 목록과 신 사이트의 기존 프로젝트를 합친 이관 기준**이다. 등록 사실, 현재 서비스 상태, 상세 기능의 검증 수준을 분리한다. [R02][R03]

| 항목 | 이관용 한 줄 소개 | 기존 링크 또는 상세 경로 | 상태 처리 |
|---|---|---|---|
| AnyBuild | 아이디어를 서비스 기획과 구현으로 연결하는 AI 프로젝트. | `https://anybuild.humease.com/` | 기존 등록은 확인. 현재 운영 단계·기능은 확인 후 표기. |
| HairAI | 사진을 바탕으로 어울리는 헤어스타일을 살펴보는 AI 프로젝트. | `https://hairai.humease.com/` | 기존 등록은 확인. 현재 운영 단계·기능은 확인 후 표기. |
| 내친구 케이 | 아이와 대화하는 AI 친구와 부모를 위한 인사이트를 연결하는 가족 소통 서비스. | `https://www.k-bestie.com/` | 기존 등록은 확인. 최신 승인된 소개·공개 단계·운영 주체를 대조. |
| 맘이음 | 친구처럼 곁에 있고, 비서처럼 도와주고, 가족과 연결해주는 AI. | `/ai-services/mom-ie/` | 이번 협의 기준 **개발 중**. 서비스 외부 링크는 승인된 실제 주소만 사용. |

**이관 시 주의**

- AnyBuild의 ‘아이디어만 입력하면 모든 서비스를 완성’, HairAI의 분석 정확도, 케이의 ‘하루 5분’ 같은 과거 문구를 최신 사실 확인 없이 확대 사용하지 않는다.
- 출처에 없는 모나리 등 새 프로젝트는 이번 초기 목록에 임의 추가하지 않는다.
- 기존 썸네일은 실서비스 화면으로 표현하지 않는다. 사용 허가와 용도를 확인한 기존 자산만 사용한다.
- 외부 링크가 확인되지 않았으면 체험·바로가기 버튼만 비노출하고 상세페이지의 프로젝트 소개는 공개 승인 범위에서 제공한다.
- 회사 포트폴리오 등록과 실제 서비스의 사업자·결제·개인정보 처리 주체는 별개다. 후자를 임의로 휴미즈로 바꾸지 않는다.

### 5.3 상태와 분류는 서로 다른 데이터다

| 데이터 | 값의 예 | 공개 규칙 |
|---|---|---|
| 프로젝트 종류 | 자체 서비스 / 개발 참여 프로젝트 / 실험 | 실제 관계가 확인된 값만 표시 |
| 서비스 단계 | 구상 / 프로토타입 / 개발 중 / 베타 / 공개 운영 / 종료 | 증거와 확인일이 있는 값만 표시 |
| 콘텐츠 공개 | draft / published / archived | 공개 승인과 별도 관리 |

`Product / In Development / Client Work`처럼 종류와 단계를 하나의 필터에 섞지 않는다. 초기에 소수 항목인 상태에서는 필터 UI를 필수로 만들지 않는다.

### 5.4 항목 하나에 보여줄 정보

- 이름, 한 줄 정의, 검증된 상태, 기존 승인 이미지 또는 로고.
- 해결하는 문제를 설명하는 짧은 문장.
- `프로젝트 자세히 보기` — 내부 상세페이지.
- 실제 공개 링크가 유효할 때만 `서비스 방문` — 외부 새 탭.
- 필요한 항목에는 `휴미즈의 참여: 기획·설계·개발` 등 확인된 기여 범위.

작은 카드 3개가 전부인 페이지가 아니라 프로젝트를 충분히 보여주는 편집형 목록으로 구현한다. 단, 항목이 늘어날 때마다 각각 강제 풀스크린으로 길어지지는 않도록 한다.

### 5.5 상세페이지의 필수 콘텐츠

| 순서 | 공개 제목 | 반드시 들어갈 내용 |
|---|---|---|
| 1 | 프로젝트 소개 | 이름, 한 줄 정의, 확인된 현재 단계, 대표 이미지 |
| 2 | 어떤 문제에서 시작했나요? | 사용자와 사용 상황, 해결하려는 불편 |
| 3 | 어떻게 풀었나요? | 핵심 아이디어와 사용자 흐름 |
| 4 | 무엇을 구현했나요? | 실제 구현된 핵심 기능, 구현 여부 |
| 5 | AI는 어디에서 작동하나요? | 입력→AI 역할→사용자가 받는 결과 |
| 6 | 어떻게 검증하고 있나요? | 확인된 개발·사용 검증 내용. 목표와 결과 구분 |
| 7 | 휴미즈의 역할 | 기획·설계·개발 등 실제 참여, 필요한 경우 운영 주체 |
| 8 | 현재 단계 | 기준일, 이용 가능 범위, 확인된 다음 단계 |
| 9 | 다음 행동 | 유효한 외부 서비스 링크, 포트폴리오로 돌아가기, 협업 문의 |

각 문단은 2~4문장 이내를 기본으로 한다. 같은 기능을 문제·아이디어·구현 항목에 반복하지 않는다. 구현되지 않은 기능은 ‘계획’으로 분리한다.

**콘텐츠가 아직 충분하지 않은 항목**은 이름·문제·현재 단계·참여 범위가 확인된 최소 상세부터 만들 수 있다. 배운 점, 성과 수치, 사용자 후기, 기술 스택을 채우기 위해 창작하지 않는다. 필수 공개 사실을 확인할 수 없으면 draft로 유지한다.

### 5.6 맘이음 상세의 고정 기준

- 공개 서비스명은 **맘이음**. 영문명 혼용을 확대하지 않는다.
- 대표 문구는 `친구처럼 곁에 있고, 비서처럼 도와주고, 가족과 연결해주는 AI`.
- 소개는 **개발 중인 서비스의 지향점**으로 작성한다. 검증되지 않은 기능을 현재 제공 기능으로 바꾸지 않는다.
- 대화 상대, 일상 도움, 가족 연결이라는 세 가치를 설명한다.
- 건강 진단·응급 감지 정확도·가족 원문 열람·사용자 수·유료 운영 같은 미확인 내용을 추가하지 않는다.
- AI 기술 공개 범위는 승인된 사실만 사용한다. 제품별 비공개 개발 문서를 그대로 홈페이지에 옮기지 않는다.

### 5.7 데이터 구조 — 최소 계약

기존 콘텐츠 관리 관례에 맞추되 아래 정보를 한곳에서 관리한다. 데이터 등록 때문에 새 DB나 CMS를 만들지 않는다.

| 필드 | 의미 |
|---|---|
| `slug` | 고유한 상세 경로 식별자. 최초 공개 후 변경 최소화 |
| `name`, `summary` | 서비스명과 한 줄 소개 |
| `category` | 서비스 주제. 실제 확인된 분류 |
| `stage`, `stageVerifiedAt` | 단계와 확인일. 미확인 값은 `null` |
| `publication` | draft / published / archived |
| `featured`, `sortOrder` | 홈 노출과 목록 순서 |
| `coverAsset`, `coverAlt`, `visualType` | 기존 자산 경로, 설명, 실제 화면/브랜드 이미지 구분 |
| `externalUrl`, `externalLinkVerifiedAt` | 외부 서비스 링크와 확인일 |
| `contribution`, `operatorLabel` | 개발 참여와 필요한 운영 주체 표기 |
| `problem`, `approach`, `implementedFeatures` | 상세 콘텐츠 |
| `plannedFeatures`, `aiRole`, `validationNotes` | 계획·AI 사용·검증 내용을 분리 |
| `sourceRefs`, `reviewedAt`, `publicationApproved` | 사실 근거·내용 점검·공개 승인 |

목록, 홈의 대표 프로젝트, 상세, 사이트맵은 동일한 공개 레코드에서 생성한다. UI 파일 여러 곳에 프로젝트명을 각각 하드코딩하지 않는다. 내부 승인 메모나 개인 연락처는 공개 번들에 포함하지 않는다.

### 5.8 추가·수정 흐름

```text
프로젝트 데이터 추가
→ 이름·한 줄 정의·문제·현재 단계·참여 범위 확인
→ 기존 자산과 실제 링크 연결
→ 상세 내용 작성 및 사실 검토
→ 공개 승인
→ 빌드 시 목록·상세·홈 대표항목·사이트맵 반영
```

‘네 번째를 넣으려면 레이아웃 전체를 다시 수정해야 하는 구조’는 FAIL이다. 확장 테스트에 쓰는 가짜 프로젝트는 테스트 디렉터리에만 두고 공개 목록·출력물에는 절대 포함하지 않는다.

---

## 6. Arctera Solutions 허브

### 6.1 명칭과 관계 고지

**공개 영역명: `Arctera Solutions`**

다음 문구를 허브와 제품 상세의 적절한 하단 위치에 실제 읽을 수 있는 크기로 표시한다.

> 본 페이지는 휴미즈가 Arctera 솔루션 정보를 정리한 안내 페이지입니다. 휴미즈는 Arctera의 공식 파트너가 아닙니다. 제품명과 상표는 각 권리자에게 귀속됩니다.

추가 원칙:

- Official Partner, Authorized Partner, Strategic Partner, 공식 총판, 독점 공급 등의 표현을 사용하지 않는다.
- 화면 본문뿐 아니라 이미지 alt, 푸터, 메타데이터, 구조화 데이터도 점검한다.
- ‘한국 시장 유일’, ‘완벽한 규제 준수’, ‘모든 데이터 완전 수집’, ‘즉시 규제 통과’ 등 입증되지 않은 표현을 제외한다.
- 벤더 로고를 사용한다면 기존 사용 가능 자산과 실제 가이드 범위에서 제품 식별용으로만 쓴다. 파트너 배지·공동 인증처럼 조합하지 않는다.
- 공급·가격·라이선스·유지보수 보장을 임의 약속하지 않는다. 이번 페이지는 제품 정보와 적용 상담을 연결한다.

### 6.2 허브 첫 화면 문구

**Eyebrow**: ARCTERA SOLUTIONS

**H1**

> 기업 데이터의 보존부터, 컴플라이언스와 eDiscovery까지.

**설명**

> 기업의 커뮤니케이션과 정보를 수집하고, 보존하고, 필요한 순간 찾을 수 있도록. 주요 Arctera 솔루션의 역할과 적용 시 검토할 사항을 한국어로 안내합니다.

**휴미즈 역할**

> 휴미즈는 고객의 데이터 환경과 운영 요구를 바탕으로 제품의 적용 범위와 연계 구성을 함께 검토합니다.

**CTA**: `주요 제품 살펴보기` → `#products` / `솔루션 상담` → `/contact/`

### 6.3 허브 순서

```text
Arctera Solutions 소개
→ 해결할 수 있는 6가지 업무 과제
→ 핵심 제품 4개와 상세페이지
→ 고객 환경에서 함께 검토할 항목
→ 관련 컨설팅
→ 공식 자료·관계 고지·상담
```

여섯 과제는 각각 한 줄 요약으로 훑어볼 수 있게 한다. 제품 상세 설명을 허브에 모두 반복하지 않는다.

### 6.4 6개 해결 과제 — 반영용 한국어

아래 분류는 Arctera 공식 솔루션 분류를 바탕으로 정리했다. **분류 전체가 아래 네 제품의 단일 라이선스에 모두 포함된다는 뜻은 아니다.** [S01–S07]

| 영문 분류 | 한국어 제목 | 공개 설명 |
|---|---|---|
| Communications Compliance | 커뮤니케이션 컴플라이언스 | 이메일·메시징·협업 도구의 업무 기록에 일관된 수집·보존·검토 기준을 적용하도록 돕습니다. |
| Supervision & Surveillance | 커뮤니케이션 감독 및 모니터링 | 검토가 필요한 커뮤니케이션을 선별하고 담당자의 검토·후속 조치·감사 기록을 연결합니다. |
| Records & Retention | 기록 관리 및 보존 정책 | 필요한 기록을 적정 기간 보존하고, 보존 의무와 삭제 제한을 확인하며 정보의 생명주기를 관리합니다. |
| Investigations & eDiscovery | 조사 및 eDiscovery | 분산된 관련 기록을 찾아 보존하고 검토·제출하는 조사 과정을 지원합니다. |
| Insights & Analytics | 커뮤니케이션 인사이트 및 분석 | 커뮤니케이션의 패턴과 위험 신호를 살펴보고 거버넌스 의사결정에 필요한 정보를 제공합니다. |
| Data Migration | 아카이브 및 데이터 마이그레이션 | 기존 아카이브를 이전·통합할 때 데이터의 무결성, 메타데이터, 보존 맥락을 유지하는 과제를 다룹니다. |

**구분이 필요한 두 항목**

- `Insights & Analytics`는 Arctera의 커뮤니케이션 분석 과제다. 아래 `Data Insight` 제품과 이름이 비슷하다고 동일 기능으로 취급하지 않는다.
- `Data Migration`은 해결 과제다. 네 제품 중 하나를 구매하면 모든 레거시 이전이 자동 포함된다고 표현하지 않는다.

### 6.5 핵심 제품 목록

| 표시명 | 한 줄 역할 | 상세 경로 |
|---|---|---|
| Enterprise Vault Complete | 기업 정보를 보존하고 정책에 따라 관리하는 아카이빙·거버넌스 | `/solutions/enterprise-vault/` |
| **Enterprise Vault Capture (formerly Merge1)** | 여러 커뮤니케이션 채널의 데이터를 수집해 보존·검토 환경으로 연결 | `/solutions/enterprise-vault-capture/` |
| Data Insight | 데이터 현황·사용·접근 패턴을 분석해 관리 판단 지원 | `/solutions/data-insight/` |
| eDiscovery Platform | 조사 자료의 검색·보존·수집·검토·제출 과정 지원 | `/solutions/ediscovery-platform/` |

Data Insight와 eDiscovery Platform 상세 본문 첫 문장에는 공식 자료의 명칭인 `Enterprise Vault Data Insight`, `Enterprise Vault eDiscovery Platform`을 함께 안내한다. Capture는 목록에서도 `Merge1`만 단독 제품명으로 남기지 않는다. [S08–S11]

---

## 7. 제품 상세페이지 — 실제 반영할 콘텐츠

### 7.0 공통 구성

각 상세페이지는 `정확한 제품명 → 역할 → 주요 기능 → 적용 검토 항목 → 관련 영역 → 공식 자료 → 상담` 순으로 구성한다. 상세 내용은 검색 가능한 정적 HTML에 존재해야 한다. 모달을 열어야만 제품 설명이 생성되는 구조는 사용하지 않는다.

각 제품의 도입 검토 항목은 **휴미즈가 제안하는 검토 프레임**이다. 벤더가 제공하는 기능이나 보장 조건과 구분한다.

공통 안내 문구:

> 실제 지원 기능과 연결 범위는 제품 버전, 라이선스, 데이터 소스 및 구성에 따라 달라질 수 있습니다. 도입·이관 전에는 공식 지원 자료와 고객 환경을 함께 확인해야 합니다.

### 7.1 Enterprise Vault Complete

**경로**: `/solutions/enterprise-vault/`

**H1**: Enterprise Vault Complete

**한글 부제**

> 중요한 정보를 오래 보존하고, 필요한 순간 활용할 수 있도록.

**본문**

> Enterprise Vault Complete는 기업의 커뮤니케이션과 콘텐츠를 보존·관리하는 정보 아카이빙 및 거버넌스 제품입니다. 수집, 분류, 보존, 감독, 조사와 데이터 분석을 연결해 정보 관리 업무를 지원합니다. 공식 자료는 조직이 데이터 위치와 운영을 통제하는 온프레미스 중심의 구성을 설명합니다. [S08]

**주요 기능**

| 영역 | 설명 |
|---|---|
| 기업 정보 아카이빙 | 지원되는 이메일·기업 콘텐츠를 보존하고 검색할 수 있게 관리합니다. |
| 분류 및 보존 정책 | 정보의 속성과 정책에 따라 분류·보존 기준을 적용합니다. |
| 조사·검토 연계 | 관련 구성요소와 연계하여 자료 검색과 조사·검토 업무를 지원합니다. |
| 거버넌스 운영 | 데이터와 정책을 통제하면서 장기 정보 관리 요구에 대응합니다. |

**기존 페이지에서 이어받을 관련 기능**

- **Exchange Mailbox Archiving**: 사서함 아카이빙 요구와 사용자 이용 흐름을 설명한다. 특정 Exchange·Outlook·Microsoft 365 버전 호환성은 임의 기재하지 않는다.
- **Classification**: 분류와 보존·생명주기 정책을 연결하는 역할을 소개한다. [S12]
- **Surveillance**: 아카이브된 기록의 감독 검토, 담당자 배정, 검토 이력과 후속 조치를 소개한다. ‘모든 채널 실시간 감시’로 확대하지 않는다. [S13]
- **Discovery Accelerator**: Enterprise Vault 아카이브 안의 케이스 중심 검토와 기록 관리 역할을 소개한다. eDiscovery Platform과 같은 제품으로 합치지 않는다. [S14]

[내부] 위 구성요소를 모두 기본 라이선스 포함이라고 설명하지 않는다. eDiscovery Platform의 검토 기능이 없다고 단순화해서도 안 된다.

**휴미즈 적용 검토**

> 대상 데이터와 증가량, 보존 정책, 검색·복원 요구, 기존 메시징 환경, 운영 역할과 변경 범위를 먼저 정리합니다. 신규 도입과 기존 환경 개선·이관은 서로 다른 조건으로 검토합니다.

**연결**: `/consulting/exchange-archive/`, `/consulting/e-discovery/`, `/solutions/enterprise-vault-capture/`

**CTA**: `Enterprise Vault 적용 상담`

### 7.2 Enterprise Vault Capture (formerly Merge1)

**경로**: `/solutions/enterprise-vault-capture/`

**H1 및 주요 제품명**: **Enterprise Vault Capture (formerly Merge1)**

**한글 부제**

> 이메일 밖의 업무 대화도, 보존과 검토의 흐름 안으로.

**본문 첫 문단**

> 기존 Merge1으로 알려진 Enterprise Vault Capture는 기업의 협업·메시징 등 여러 커뮤니케이션 채널에서 데이터를 수집하는 제품입니다. 대화 참여자, 시간, 첨부파일과 같은 맥락을 함께 유지하면서 아카이브와 후속 거버넌스 업무로 연결합니다. [S09]

**주요 기능**

| 영역 | 설명 |
|---|---|
| 협업·메시징 데이터 수집 | Microsoft Teams, Slack 등 지원 채널의 커뮤니케이션을 수집합니다. |
| 대화 맥락 유지 | 참여자·타임스탬프·첨부파일 등 관련 메타데이터를 함께 다룹니다. |
| 형식 정규화 | 수집 데이터를 후속 아카이빙과 검토에 이용하기 쉬운 형태로 정리합니다. |
| 아카이브 연계 | 수집한 기록을 Enterprise Vault 또는 지원되는 아카이브 환경으로 전달합니다. |

**기존 이름으로 찾아온 고객 안내**

> Merge1, Arctera Merge1 또는 Veritas Merge1이라는 이름으로 찾아오셨나요? 이 페이지에서는 현재 공식 명칭인 Enterprise Vault Capture를 기준으로 제품의 역할을 안내합니다.

**FAQ**

**Q. Merge1과 Enterprise Vault Capture는 서로 다른 제품인가요?**

> 공식 사이트는 `Enterprise Vault Capture (formerly Merge1)`로 표기합니다. 휴미즈도 기존 이름과 현재 이름을 함께 안내하며, 두 이름을 별도 제품으로 나누지 않습니다. [S09]

**Q. 현재 사용하는 Merge1 환경을 그대로 변경할 수 있나요?**

> 이름이 변경되었다는 사실만으로 업그레이드 가능 여부나 계약·라이선스 조건이 확정되지는 않습니다. 설치 버전, 사용 커넥터, 수집 방식, 연결 아카이브와 계약 조건을 확인해야 합니다.

**휴미즈 적용 검토**

> 수집 대상과 채널별 API·권한, 필요한 데이터 범위, 기존 기록의 처리 조건, 목적지 아카이브, 누락 확인 및 재처리 절차를 검토합니다.

**연결**: `/solutions/enterprise-vault/`, `/consulting/internal-control/`, `/consulting/e-discovery/`

**CTA**: `Capture / Merge1 적용 상담`

[내부] 커넥터 수·지원 채널 수는 이번 콘텐츠에서 숫자로 기재하지 않는다. 특정 채널의 모든 데이터 유형을 지원한다고 추정하지 않는다.

### 7.3 Data Insight

**경로**: `/solutions/data-insight/`

**H1**: Data Insight

**한글 부제**

> 어떤 데이터가 어디에 있고, 어떻게 사용되는지부터.

**본문**

> Enterprise Vault Data Insight는 데이터 현황과 사용·접근 패턴을 분석하여 정보 거버넌스 판단을 돕는 제품입니다. 데이터의 위치, 크기, 노후도, 소유 관련 정보와 접근 활동을 살펴보고 관리 우선순위를 정하는 데 활용합니다. 데이터를 보관하는 아카이브 자체가 아니라 분석·리포팅 역할에 초점을 둡니다. [S10]

**주요 기능**

| 영역 | 설명 |
|---|---|
| 데이터 현황 파악 | 지원 저장소의 분포와 용량·증가 추이를 살펴봅니다. |
| 사용·접근 분석 | 접근 빈도와 활동을 통해 관리가 필요한 영역을 확인합니다. |
| 책임·소유 정보 | 확인 가능한 소유·관리 단서를 활용해 관리 공백을 파악합니다. |
| 정리·보존 판단 | 오래되거나 중복·과다 노출 가능성이 있는 데이터의 검토를 돕습니다. |
| 거버넌스 보고 | 정리, 보존 정책, 접근 검토에 필요한 분석 결과를 제공합니다. |

**휴미즈 적용 검토**

> 대상 파일·저장소, 접근 로그 수집 조건, 소유자 판단 기준, 민감정보 관리 범위와 정리 승인 절차를 검토합니다. 분석 결과를 실제 삭제나 권한 변경으로 연결할 때는 별도의 승인·검증 절차를 둡니다.

**FAQ**

**Q. Data Insight가 데이터를 자동으로 보관하거나 삭제하나요?**

> 이 페이지에서 소개하는 중심 역할은 데이터 분석과 보고입니다. 보관·삭제·권한 변경 기능이나 다른 제품과의 연계 범위는 실제 구성에 따라 확인해야 합니다.

**연결**: `/enterprise-data/`, `/consulting/internal-control/`, `/solutions/enterprise-vault/`

**CTA**: `Data Insight 적용 상담`

### 7.4 eDiscovery Platform

**경로**: `/solutions/ediscovery-platform/`

**H1**: eDiscovery Platform

**한글 부제**

> 필요한 자료를 찾고, 보존하고, 검토 가능한 과정으로 제출합니다.

**본문**

> Enterprise Vault eDiscovery Platform은 법적 분쟁, 내부 조사와 규제 대응에 필요한 정보의 검색·보존·수집·검토·제출을 지원합니다. 사건의 범위와 검색 조건을 정의하고, 관련 기록과 처리 이력을 관리하는 데 활용합니다. [S11]

**주요 기능**

| 영역 | 설명 |
|---|---|
| 사건 및 범위 관리 | 조사 대상, 기간, 관련자와 데이터 범위를 정리합니다. |
| 검색·수집 | 키워드와 메타데이터 조건으로 관련 자료를 찾고 수집합니다. |
| Legal Hold | 조사에 필요한 기록의 보존과 삭제 제한을 관리합니다. |
| 검토 | 자료를 필터링·분류·태깅하고 필요한 내용을 검토합니다. |
| 마스킹·제출 | 지원 범위에서 민감한 부분을 가리고 제출용 결과를 준비합니다. |
| 감사 기록 | 검색·보존·수집·제출 과정의 이력을 남깁니다. |

**휴미즈 적용 검토**

> 자료 소스와 규모, 조사 범위, 수집 권한, 검토 역할, 보존 조건, 필요한 제출 형식을 확인합니다. 법률적 판단과 제출 적합성의 최종 확인은 고객의 법무·컴플라이언스 담당 범위와 구분합니다.

**FAQ**

**Q. Discovery Accelerator와 같은 제품인가요?**

> 같은 제품으로 소개하지 않습니다. Enterprise Vault 아카이브의 케이스 기반 검토 요구와 여러 자료의 검색·보존·수집·검토 요구를 구분하여 제품 및 구성의 적용 범위를 확인합니다. [S11][S14]

**연결**: `/consulting/e-discovery/`, `/solutions/enterprise-vault/`

**CTA**: `eDiscovery 적용 상담`

---

## 8. Capture / Merge1 검색 대응

### 8.1 목표와 한계

목표는 기존 `Merge1` 고객이 현재 제품 정보를 이해하고 휴미즈의 관련 페이지를 발견할 수 있는 구조를 만드는 것이다. **검색 등록·상위 노출·특정 순위는 보장하지 않는다.** 검색엔진이 읽을 수 있는 내용·링크·메타데이터·대표 주소를 정확히 제공하는 것이 이번 구현의 완료 범위다. [T03]

### 8.2 고정 표기

| 위치 | 반영값 |
|---|---|
| 제품 기본 이름 | `Enterprise Vault Capture (formerly Merge1)` |
| H1 | `Enterprise Vault Capture (formerly Merge1)` |
| HTML title | `Enterprise Vault Capture (formerly Merge1) | 휴미즈` |
| 대표 상세 URL | `/solutions/enterprise-vault-capture/` |
| 첫 문단 | ‘기존 Merge1으로 알려진 Enterprise Vault Capture…’ |
| 제품 목록 | 현재 이름과 `(formerly Merge1)`을 함께 노출 |
| 내부 링크 | 문맥에 따라 전체 이름 또는 `Capture / Merge1 자세히 보기` |
| FAQ | 이름 관계와 기존 설치 환경의 별도 확인 필요성 설명 |

긴 H1의 괄호 부분을 작은 글씨로 줄바꿈할 수 있지만 DOM 텍스트는 한 제품명으로 읽혀야 한다. 모바일에서 `Merge1` 부분을 아예 숨기지 않는다.

### 8.3 메타디스크립션

```text
Enterprise Vault Capture (formerly Merge1)의 협업·메시징 데이터 수집과 아카이브 연계를 한국어로 안내합니다. Arctera 제품 정보와 휴미즈의 적용 검토 항목을 확인하세요.
```

루트 title template이 브랜드를 추가한다면 중복된 `| 휴미즈 | 휴미즈`가 생성되지 않게 한다.

### 8.4 본문·이미지·구조화 데이터

- `Merge1`을 제목·첫 문단·실제 FAQ·내부 링크에 자연스럽게 포함한다. 모든 문단에 반복하지 않는다.
- meta keywords, 숨김 텍스트, 동일한 내용의 검색어별 복제 페이지를 만들지 않는다.
- **이미지 alt는 이미지를 설명한다.** 실제 제품 화면·도식이면 그 내용에 맞게 작성하고, 장식용 추상 이미지는 `alt=""`를 사용한다. 검색어를 넣기 위해 모든 이미지에 Merge1을 삽입하지 않는다.
- 기존 WebPage·Breadcrumb 구조화 데이터가 있으면 정확한 페이지명·URL을 반영한다.
- 제품 개체를 표현할 때 `name: Enterprise Vault Capture`, `alternateName: Merge1`으로 구분할 수 있다. 휴미즈를 해당 제품의 제조사·브랜드 소유자로 설정하지 않는다.
- 실제 없는 가격·리뷰·평점·인증·제휴관계 데이터를 만들지 않는다.
- FAQ가 있다고 검색의 특별 노출이 보장된다고 설명하지 않는다.

### 8.5 기존 URL·앵커 보존

구 소스에 다음 앵커가 확인됐다. 허브에서 해당 항목으로 이동하는 의미를 보존한다. [R05]

| 기존 진입 | 처리 |
|---|---|
| `/solutions/#ev` | Enterprise Vault 제품 소개 또는 해당 상세로 가는 항목에 연결 |
| `/solutions/#merge1` | 현재 Capture 제품 소개 항목에 연결 |
| `/solutions/#datainsight` | Data Insight 제품 소개 항목에 연결 |

- 기존 앵커 id는 문서 안의 실제 요소에 유지하고 sticky header에 가리지 않게 한다.
- `/solutions/merge1/` 같은 과거 상세 경로가 실제 존재했는지는 조사한다. 존재 확인 없이 임의로 ‘기존 URL’이라고 기록하지 않는다.
- 기존 경로가 실제 존재하면 동일 내용을 여러 원본으로 복제하지 말고 대표 상세로 연결한다.
- GitHub Pages Static Export에 Next.js 서버 `redirects()`나 서버 301 규칙을 추가하지 않는다. [T01][T02]
- 서버 리다이렉트를 사용할 수 없는 기존 별칭 경로는 필요한 경우 빌드 후 생성한 정적 HTML의 즉시 meta refresh·canonical·실제 링크로 처리한다. **HTTP 301이 아니라 보통 HTTP 200의 정적 이동 페이지**임을 보고한다. [T04]
- 모든 404를 홈으로 보내는 SPA fallback은 금지한다. 신규 URL이 누락되어도 200으로 보이는 검수를 방지한다.

### 8.6 검증 주소와 운영 도메인의 검색 정책

| 환경 | 기준 |
|---|---|
| GitHub 프로젝트 검증 주소 | `/humease-web-v2` basePath에 맞는 정적 자산·내부 링크. 공개 검증 페이지에는 noindex 정책 적용. |
| 승인 후 운영 주소 | `https://www.humease.com` 기준 대표 URL·사이트맵·색인 허용 정책. 루트 배포용으로 재빌드. |

- 현재 배포 환경이 무엇인지 먼저 확인한다. DNS 전환이 이미 이뤄졌다고 추정하지 않는다.
- 검증 페이지의 noindex는 HTML meta로 제공한다. robots.txt로 크롤링을 모두 차단해 noindex를 읽지 못하게 하는 조합을 피한다. [T05]
- 프로젝트 경로 아래 `robots.txt`는 호스트 루트의 robots 정책을 대신하지 못한다. GitHub 프로젝트 사이트에서는 페이지별 meta를 검수한다.
- 검증 주소를 검색엔진에 제출하지 않는다. 운영 색인 요청·사이트맵 제출은 도메인 전환과 공개 승인이 끝난 뒤 권한이 있는 담당자가 수행한다.
- 운영 전환 전에는 미공개 상세의 canonical·사이트맵만 먼저 운영 검색에 제출하지 않는다.
- basePath 변경은 배포 파일의 문자열 치환이 아니라 올바른 환경값으로 **재빌드**해 검증한다.

---

## 9. 다른 페이지와의 연결

### 9.1 Enterprise Data

서비스 설명을 삭제하지 않고 아래 연결을 추가한다.

- 보존·아카이빙 → Enterprise Vault Complete.
- 협업·메시징 수집 → Enterprise Vault Capture (formerly Merge1).
- 데이터 사용·접근 현황 → Data Insight.
- 조사·검토·제출 → eDiscovery Platform.

위 연결은 적용 검토의 출발점이다. 제품 간 기능 중복·버전·계약 차이를 무시한 확정 구성표처럼 표현하지 않는다.

### 9.2 Applied AI

‘무엇을 제공할 수 있는가’와 ‘실제로 만든 것’을 분리한다. 기존 역량 설명 아래 `관련 AI 프로젝트`를 공개 포트폴리오 데이터에서 연결한다. 포트폴리오 내용을 상세하게 다시 복제하지 않는다.

### 9.3 컨설팅 상세

| 페이지 | 추가 연결 및 보강 내용 |
|---|---|
| e-Discovery | 조사 범위·자료 준비·검토 흐름이라는 서비스 관점과 eDiscovery Platform 제품 정보를 구분 |
| Internal Control | 감독 검토 정책과 기록, 접근·데이터 분석 요구를 구분해 관련 솔루션 연결 |
| Exchange Archive | 사서함 운영과 보존·검색 요구를 구분하고 Enterprise Vault 상세 연결 |

### 9.4 About

- 개인의 Microsoft MVP·재직 이력을 회사 인증이나 파트너십으로 바꾸지 않는다.
- 확인된 경력 연수는 **해당 전문가의 경력**으로 표기한다. 휴미즈 법인의 업력으로 표기하지 않는다.
- ‘전문가팀’, ‘자체 연구소’, ‘24시간 지원’ 등의 조직·지원 규모를 임의로 만들지 않는다.

### 9.5 Contact

CTA는 기존 `/contact/` 및 기존 문의 기능을 사용한다. 제품명에 맞는 버튼 문구는 허용하되, 신규 문의 저장 필드·분류·알림을 위해 DB나 운영 백엔드를 바꾸지 않는다. 문의 주제 자동 선택은 현재 폼이 안전하게 지원하는 경우에만 연결한다.

---

## 10. 기술 구현 기준

### 10.1 재사용 우선

현재 사용 중인 `CinematicHero`, `Scene`, `Statement`, `ProductReveal`, `Reveal`, 버튼·탐색·SEO 헬퍼를 우선 검토한다. 콘텐츠를 확장하기 위해 이미 진행된 A안 디자인을 덮어쓰지 않는다. 필요한 일반화만 수행한다.

권장 논리 분리:

```text
AI 프로젝트 콘텐츠
→ 목록 / 홈 대표항목 / 상세 / 사이트맵

Arctera 제품 콘텐츠
→ 제품 목록 / 상세 / 관련 링크 / 검색 메타데이터

공식 자료 목록
→ source URL / 확인일 / 해당 기능의 근거
```

### 10.2 정적 빌드

- `output: 'export'`를 유지한다.
- 제품·포트폴리오 본문을 빌드 시 HTML로 생성한다.
- 동적 세그먼트를 사용한다면 공개 slug를 `generateStaticParams()`로 모두 반환한다.
- 미확인 slug나 draft 프로젝트는 공개 HTML·사이트맵·공개 JSON에 포함하지 않는다.
- Request·Cookie·서버 인증에 의존하는 Route Handler나 런타임 처리를 새로 도입하지 않는다.
- 빌드 시 실행되는 Server Component는 정적 Export와 함께 사용할 수 있다. ‘Server Component’라는 이유만으로 모든 페이지를 Client Component로 바꾸지 않는다. [T01]

### 10.3 basePath와 링크

- 논리 경로는 `/solutions/.../`, `/ai-services/.../`로 관리한다.
- `next/link`에는 현재 Next.js basePath 처리와 충돌하지 않는 논리 경로를 전달한다. 접두사를 이중으로 붙이지 않는다.
- 일반 `<a>`, 이미지, 다운로드 파일 등에는 기존 프로젝트 경로 헬퍼를 적용한다. `/solutions/...`가 GitHub 계정 루트로 새는지 점검한다.
- 내부/외부/앵커/`mailto:` 링크를 구분한다.
- 현재 `src/lib/seo.ts`의 대표 URL 생성과 새 상세페이지의 trailing slash가 일관되게 동작하도록 한다. [R06]
- JavaScript가 꺼져도 핵심 본문·제품명·실제 링크를 읽을 수 있어야 한다.

### 10.4 이미지와 모션

- A01–A17 및 현재 보유한 승인 이미지·로고만 사용한다.
- 기존 자산의 압축, 반응형 크기, CSS crop·mask·overlay는 허용한다.
- 새 이미지를 생성하거나 벤더 사이트 전체 이미지를 허가 확인 없이 복사하지 않는다.
- 이미지가 없어도 텍스트 중심의 완성된 항목을 만들 수 있다. 가짜 제품 UI나 공사 중 카드를 만들지 않는다.
- 모션 라이브러리 추가 자체를 완료 조건으로 삼지 않는다. CSS만으로 충분하면 그대로 사용한다.
- `prefers-reduced-motion` 및 모션 실패·스크립트 비활성 상태에서도 콘텐츠가 숨겨지지 않아야 한다.

### 10.5 콘텐츠 검증 자동화

프로젝트 관례에 맞는 스크립트·테스트를 추가하되 아래를 검사한다.

- 공개 프로젝트의 slug 중복, 필수 항목 누락, draft 노출.
- 공개 제품 네 개의 경로와 전체 제품명.
- Capture H1·title·본문의 Merge1 포함 및 별도 중복 제품 없음.
- 설명 없는 공식 파트너 주장·가짜 실적 문구의 신규 유입.
- 출처 URL과 내용 확인일의 누락.
- 내부 링크·이미지 경로의 basePath 누락 또는 이중 적용.
- 공개 페이지의 noindex·canonical 환경 불일치.

‘공식 파트너’라는 글자가 있다는 이유만으로 관계 고지 문장까지 실패 처리하지 않는다. 부정 고지와 긍정 주장을 구분한다.

---

## 11. 내용 검수 및 출처 관리

### 11.1 사실의 종류를 구분

| 종류 | 사용 기준 |
|---|---|
| 제품 기능 | 제조사 공식 제품 페이지·데이터시트·지원 문서로 확인 |
| 고객 환경 적용 | 휴미즈의 검토·제안 항목으로 표시. 제품 보장과 구분 |
| 휴미즈 경력·성과 | 확인된 이력과 공개 허가가 있는 자료만 사용 |
| AI 프로젝트 | 기존 등록 사실과 현재 개발·운영 증거를 분리 |
| 기획·계획 | ‘계획’, ‘개발 중’, ‘검토 중’으로 명시 |

### 11.2 공개 제품 페이지의 자료 안내

상세 하단에 `공식 제품 정보` 링크와 `제품 정보 확인일: 2026-09-06`을 표시한다. 구현 시 새로운 사실로 내용을 바꾸면 실제 재확인일과 출처를 갱신한다. 빌드 날짜를 자동으로 ‘정보 확인일’로 바꾸지 않는다.

긴 영문 페이지를 그대로 번역·복제하지 않고 이 요청서의 한국어 요약을 사용한다. 벤더의 고객 로고·성공 수치·인증을 휴미즈 실적으로 사용하지 않는다.

---

## 12. 검수 항목 — PASS 기준

모든 결과는 `PASS / FAIL / BLOCKED / NOT RUN` 중 하나로 기록한다. 스크립트 통과, 화면 검수, 실제 배포 확인은 각각 다른 결과다.

### 12.1 사업·콘텐츠

| ID | 합격 조건 |
|---|---|
| C01 | Enterprise Data·Applied AI·AI Portfolio·Arctera Solutions의 역할이 구분된다. |
| C02 | AI Portfolio가 맘이음 한 개로 하드코딩되지 않는다. |
| C03 | AnyBuild·HairAI·내친구 케이의 이관 여부와 공개 상태가 각각 기록되어 있다. |
| C04 | 맘이음의 개발 중 상태와 승인 문구가 유지된다. |
| C05 | 프로젝트 개수 3개 제한, 가짜 서비스, 임의 모나리 추가가 없다. |
| C06 | 프로젝트별 운영·소유·개발 참여 관계를 허위로 단정하지 않는다. |
| C07 | Arctera Solutions 명칭과 비공식 파트너 관계 고지가 적용된다. |
| C08 | 6개 해결 과제와 4개 핵심 제품이 서로 구분된다. |
| C09 | 제품 상세마다 역할·주요 기능·적용 검토·공식 출처·상담이 있다. |
| C10 | Capture가 `Enterprise Vault Capture (formerly Merge1)`로 일관되게 표시된다. |
| C11 | Data Insight를 아카이브 자체로, Discovery Accelerator를 eDiscovery Platform과 같은 제품으로 설명하지 않는다. |
| C12 | 지원 수·고객 성과·법규 준수·독점 지위 등 미확인 주장이 없다. |

### 12.2 검색·경로

| ID | 합격 조건 |
|---|---|
| S01 | Capture의 빌드된 HTML에 H1·title·첫 문단·FAQ의 Merge1이 실제 존재한다. |
| S02 | 각 제품 상세 URL을 새 탭에서 직접 열고 새로고침해도 정상 표시된다. |
| S03 | `/solutions/#ev`, `#merge1`, `#datainsight`가 유효한 항목으로 이동한다. |
| S04 | 서버 301을 구현한 것처럼 허위 보고하지 않는다. 정적 별칭과 HTTP 상태를 구분한다. |
| S05 | 검색어 스팸·숨김 텍스트·동일 설명 복제 페이지가 없다. |
| S06 | 검증 환경과 운영 환경의 canonical·noindex·사이트맵이 서로 맞는다. |
| S07 | 내부 링크가 계정 루트로 이탈하거나 basePath가 두 번 붙지 않는다. |
| S08 | 이미지 alt가 실제 이미지 역할을 설명하고 장식 이미지는 빈 alt다. |
| S09 | draft 프로젝트가 공개 HTML·목록·사이트맵·공개 데이터 파일에 없다. |
| S10 | 알 수 없는 경로는 정상적인 404이며 홈으로 숨겨지지 않는다. |

### 12.3 디자인·사용성

| ID | 합격 조건 |
|---|---|
| U01 | 기존 A안의 몰입형 비주얼·대형 타이포·절제된 모션을 유지한다. |
| U02 | 콘텐츠 보강 때문에 동일한 작은 카드와 긴 문단이 반복되지 않는다. |
| U03 | 1920·1440·768·390·320px 폭에서 잘림·겹침·가로 넘침이 없다. |
| U04 | 긴 Capture 제품명과 `(formerly Merge1)`이 모바일에서 모두 읽힌다. |
| U05 | 키보드로 메뉴·목록·상세 링크·FAQ를 사용할 수 있고 포커스가 보인다. |
| U06 | reduced-motion·JavaScript 비활성 상태에서도 핵심 콘텐츠를 읽는다. |
| U07 | 서비스 외부 링크는 내부 상세와 구분되고 새 탭임을 알아볼 수 있다. |
| U08 | 생성 이미지와 실제 제품 화면을 혼동시키지 않는다. |

### 12.4 기술·회귀

| ID | 합격 조건 |
|---|---|
| T01 | 기존 타입 검사·린트·정적 빌드·검증 스크립트가 통과한다. |
| T02 | 새 페이지의 본문은 클라이언트 fetch 성공에만 의존하지 않는다. |
| T03 | 새 서버·CMS·유료 서비스·Vercel 의존성이 생기지 않는다. |
| T04 | 기존 문의·법적 고지·탐색 기능의 계약을 변경하지 않는다. |
| T05 | 운영 문의·메일 발송 없이 mock 또는 차단 환경에서 회귀를 확인한다. |
| T06 | 프로젝트 추가 테스트에서 공통 레이아웃 재작성 없이 목록·상세가 반영된다. |
| T07 | 테스트용 가상 레코드가 공개 산출물에 포함되지 않는다. |
| T08 | Lighthouse 등 기존 성능 목표를 유지하고 변경 전후 같은 조건으로 비교한다. |
| T09 | 작업 전후 commit·diff·검증 대상 URL·미실행 항목을 보고한다. |

빌드·200 응답만으로 디자인이나 콘텐츠를 PASS로 판단하지 않는다. 검색 상위 노출 여부도 구현 PASS 기준으로 삼지 않는다.

---

## 13. 실행 단계와 승인 경계

### G0 — 충돌·기준선 확인

- 현 작업트리·브랜치·HEAD·배포 워크플로와 최근 A안 변경을 확인한다.
- 진행 중인 디자인 수정·미커밋 파일을 덮어쓰거나 강제 reset하지 않는다.
- 구 사이트의 프로젝트 목록과 신 사이트 데이터를 비교해 이관표를 작성한다.
- 프로젝트별 확정/미확정 항목을 정리하고 불명확한 항목의 공개만 보류한다.
- 새 운영 도메인 상태를 확인하되 변경하지 않는다.

### G1 — 콘텐츠와 공통 데이터

- 포트폴리오·제품 데이터와 출처 기록을 분리한다.
- 이 문서의 한국어 문구와 제품 표기를 적용한다.
- 알려진 링크·상태·기여 범위를 검토하고 공개 조건을 확정한다.

### G2 — 페이지와 내부 연결

- 홈·포트폴리오 허브·상세·솔루션 허브·4개 제품 상세를 구현한다.
- 관련 컨설팅·메뉴·푸터·CTA를 연결한다.
- 기존 A안 컴포넌트와 이미지 자산을 재사용한다.

### G3 — 검색·정적 빌드·회귀

- Capture/Merge1 전체 검색 대응과 과거 앵커를 점검한다.
- 프로젝트 추가·비공개 제외·basePath·직접 접근을 검수한다.
- 데스크톱·모바일 실제 화면과 접근성·성능 증거를 남긴다.

### G4 — 독립 점검·대표님 검토

- Antigravity는 읽기 전용으로 본 요청과 결과물을 대조한다.
- 대표님에게 기능 검수와 별도로 프로젝트 공개 목록·표기·핵심 화면을 제시한다.
- BLOCKED/NOT RUN을 PASS로 합치지 않는다.

### G5 — 승인된 배포

- 현재 `main` push가 자동 배포를 실행할 수 있으므로, 이 요청서를 받은 것만으로 즉시 main merge·push하지 않는다.
- 로컬 또는 승인된 검증 환경에서 확인하고, 배포 승인을 받은 대상에만 반영한다.
- GitHub Pages는 저장소당 독립적인 PR Preview가 자동 제공된다고 가정하지 않는다. 승인 없이 별도 테스트 저장소·호스팅을 만들지 않는다.
- `www.humease.com` DNS·Custom Domain·CNAME 변경은 이번 요청에 포함하지 않는다.
- 이전 정상 commit과 산출물 위치를 남겨 내용·UI 변경을 되돌릴 수 있게 한다.

---

## 14. 개발 완료 보고 형식

아래 항목을 실제 내용으로 채워 보고한다. ‘모두 완료’만 제출하지 않는다.

```text
Request ID:
작업 브랜치 / 기준 commit / 결과 commit:
변경 파일:
반영 페이지:

AI Portfolio:
- 이관 대상별 공개/보류/유지 결과와 근거
- 프로젝트별 이름 / 현재 단계 / 운영·개발 참여 표기
- 새 프로젝트 추가 테스트 결과

Arctera Solutions:
- 6개 과제 / 4개 제품 / 4개 상세 경로 확인
- 비공식 파트너 관계 고지 확인
- 공식 자료와 제품 정보 확인일

Capture / Merge1:
- H1 / title / description / 본문 / FAQ / 내부 링크
- 기존 앵커와 확인된 과거 URL 처리
- HTTP 상태 / canonical / noindex / sitemap

검수:
- 콘텐츠 / 기능 / 정적 빌드 / 디자인 / 접근성 / 성능 각각의 결과
- 실제 스크린샷 및 재현 절차
- FAIL / BLOCKED / NOT RUN 목록

배포:
- 배포 여부 / 승인 근거 / 실제 검증 주소
- DNS·운영 DB·메일·구 저장소 변경 없음 확인
- 롤백 기준
```

---

## 15. Claude Code 전달문

아래 문장은 작업을 시작할 때 사용하는 전달문이다. 세부 기준은 본문을 따른다.

```text
REQUEST_HUMEASE_CONTENT_PORTFOLIO_ARCTERA_20260906.md를 기준으로 humease21/humease-web-v2에 콘텐츠·AI 포트폴리오·Arctera Solutions 보강을 추가 구현하라; 기존 A안 디자인과 Next.js Static Export·GitHub Pages·기존 이미지 자산을 유지하고 Vercel·이미지 생성·프레임워크 재작성은 하지 마라; 먼저 현재 작업트리와 디자인 변경의 충돌 여부를 READ-ONLY로 확인한 뒤 기존 AnyBuild·HairAI·내친구 케이 등록 자료와 새 사이트의 맘이음 개발 중 정보를 각각 대조하고 공개 가능한 사실만 데이터 기반 포트폴리오·상세·홈에 반영하라; Arctera Solutions에는 공식 파트너가 아니라는 관계 고지와 공식 자료 기반 한국어 6개 과제·4개 제품 상세를 적용하고 Enterprise Vault Capture (formerly Merge1) 명칭·본문·메타데이터·기존 앵커를 일관되게 처리하라; 미확인 서비스 단계·법인 소유·실적·지원 범위는 만들지 말고 해당 항목 공개만 보류하라; 변경 전후 정적 빌드·직접 접근·basePath·링크·noindex/canonical·모바일·접근성·성능을 검수하여 증거와 함께 보고하고 대표님 승인 전에는 main merge/push에 의한 배포·운영 도메인/DNS·운영 DB/RLS·메일·구 저장소를 변경하지 마라.
```

## 16. Antigravity 독립 점검 전달문

```text
본 REQUEST의 12절 검수 항목을 기준으로 구현 결과와 사실 근거를 READ-ONLY로 대조한다.
기존 A안 디자인, GitHub Pages 정적 배포, 프로젝트 목록 이관, 공개 승인 상태, Arctera 비파트너 고지와 제품명, Capture/Merge1 검색 대응을 우선 확인한다.
실제 화면·정적 HTML·경로·메타데이터·모바일·모션 감소 상태를 각각 검수한다.
공개 서비스 동작 확인이 끝나지 않았으면 해당 운영 상태를 PASS로 판정하지 않는다.
소스·설정·이미지·Git 이력·DB·RLS·배포·DNS를 변경하지 않고 운영 문의·메일을 발생시키지 않는다.
PASS/FAIL/BLOCKED/NOT RUN을 항목별로 구분하고 근거·재현 절차·심각도를 보고한다.
```

---

## 17. 출처와 확인 범위

아래 출처는 2026-09-06 확인했다. GitHub 소스는 이후 변경될 수 있으므로 작업 시작 시 최신 내용과 대조한다. 기능 설명은 공식 자료를 바탕으로 한 한국어 요약이며 고객 환경의 지원 보장을 뜻하지 않는다.

### 기존·현재 구현 근거

- [R01] 구 홈페이지 AI 목록 페이지: https://github.com/Humease/Homepage/blob/main/src/pages/AIServices.tsx
- [R02] 구 홈페이지 실제 AI 등록 데이터: https://github.com/Humease/Homepage/blob/main/public/data/ai-services.json — 조회 blob `d22dace68b69e62ade30bd9af066b4633503c05b`.
- [R03] 신 홈페이지 AI 프로젝트 페이지: https://github.com/humease21/humease-web-v2/blob/main/src/app/(site)/ai-services/page.tsx
- [R04] 신 홈페이지 솔루션 페이지: https://github.com/humease21/humease-web-v2/blob/main/src/app/(site)/solutions/page.tsx
- [R05] 구 홈페이지 솔루션 페이지: https://github.com/Humease/Homepage/blob/main/src/pages/Solutions.tsx
- [R06] 신 홈페이지 메타데이터 헬퍼: https://github.com/humease21/humease-web-v2/blob/main/src/lib/seo.ts

### Arctera·Enterprise Vault 공식 제품 및 솔루션

- [S01] Arctera 솔루션 분류: https://www.arctera.com/
- [S02] Communications Compliance: https://www.arctera.com/solutions/communications-compliance
- [S03] Supervision & Surveillance: https://www.arctera.com/solutions/supervision-and-surveillance
- [S04] Records & Retention: https://www.arctera.com/solutions/records-and-retention-optimization
- [S05] Investigations & eDiscovery: https://www.arctera.com/solutions/investigations-and-ediscovery
- [S06] Insights & Analytics: https://www.arctera.com/solutions/insights-and-analytics
- [S07] Data Migration: https://www.arctera.com/solutions/data-migration
- [S08] Enterprise Vault Complete: https://www.enterprisevault.com/enterprise-vault-complete — `https://www.arctera.com/enterprise-vault`에서 연결됨.
- [S09] Capture 및 formerly Merge1 공식 표기: https://www.enterprisevault.com/enterprise-vault-complete/capture
- [S10] Data Insight: https://www.enterprisevault.com/enterprise-vault-complete/data-insight — `https://www.arctera.com/data-insight`에서 연결됨.
- [S11] eDiscovery Platform: https://www.enterprisevault.com/enterprise-vault-complete/ediscovery-platform — `https://www.arctera.com/ediscovery-platform`에서 연결됨.
- [S12] Classification: https://www.enterprisevault.com/enterprise-vault-complete/classification
- [S13] Surveillance: https://www.enterprisevault.com/enterprise-vault-complete/surveillance
- [S14] Discovery Accelerator: https://www.enterprisevault.com/enterprise-vault-complete/discovery-accelerator

### 정적 배포·검색 공식 기준

- [T01] Next.js Static Export: https://nextjs.org/docs/app/guides/static-exports
- [T02] GitHub Pages 개요: https://docs.github.com/en/pages/getting-started-with-github-pages/what-is-github-pages
- [T03] Google Search Essentials: https://developers.google.com/search/docs/essentials
- [T04] 서버·meta refresh 등 리다이렉트 구분: https://developers.google.com/search/docs/crawling-indexing/301-redirects
- [T05] noindex와 robots.txt의 관계: https://developers.google.com/search/docs/crawling-indexing/block-indexing

---

## 18. 최종 합격 문장

> 방문자가 휴미즈의 기존 데이터 전문성, 실제 AI 개발 포트폴리오, Arctera 제품 정보를 서로 혼동하지 않고 이해하며, 원하는 프로젝트나 제품의 충분한 한국어 설명과 상담 동선까지 도달할 수 있어야 한다. 고급스러운 디자인, 정확한 명칭, 확인 가능한 사실, 지속적인 업데이트 구조가 함께 유지되어야 한다.

<!-- 문서 내 출처 참조 링크 -->
[R01]: <https://github.com/Humease/Homepage/blob/main/src/pages/AIServices.tsx>
[R02]: <https://github.com/Humease/Homepage/blob/main/public/data/ai-services.json>
[R03]: <https://github.com/humease21/humease-web-v2/blob/main/src/app/(site)/ai-services/page.tsx>
[R04]: <https://github.com/humease21/humease-web-v2/blob/main/src/app/(site)/solutions/page.tsx>
[R05]: <https://github.com/Humease/Homepage/blob/main/src/pages/Solutions.tsx>
[R06]: <https://github.com/humease21/humease-web-v2/blob/main/src/lib/seo.ts>
[S01]: <https://www.arctera.com/>
[S02]: <https://www.arctera.com/solutions/communications-compliance>
[S03]: <https://www.arctera.com/solutions/supervision-and-surveillance>
[S04]: <https://www.arctera.com/solutions/records-and-retention-optimization>
[S05]: <https://www.arctera.com/solutions/investigations-and-ediscovery>
[S06]: <https://www.arctera.com/solutions/insights-and-analytics>
[S07]: <https://www.arctera.com/solutions/data-migration>
[S08]: <https://www.enterprisevault.com/enterprise-vault-complete>
[S09]: <https://www.enterprisevault.com/enterprise-vault-complete/capture>
[S10]: <https://www.enterprisevault.com/enterprise-vault-complete/data-insight>
[S11]: <https://www.enterprisevault.com/enterprise-vault-complete/ediscovery-platform>
[S12]: <https://www.enterprisevault.com/enterprise-vault-complete/classification>
[S13]: <https://www.enterprisevault.com/enterprise-vault-complete/surveillance>
[S14]: <https://www.enterprisevault.com/enterprise-vault-complete/discovery-accelerator>
[T01]: <https://nextjs.org/docs/app/guides/static-exports>
[T02]: <https://docs.github.com/en/pages/getting-started-with-github-pages/what-is-github-pages>
[T03]: <https://developers.google.com/search/docs/essentials>
[T04]: <https://developers.google.com/search/docs/crawling-indexing/301-redirects>
[T05]: <https://developers.google.com/search/docs/crawling-indexing/block-indexing>
