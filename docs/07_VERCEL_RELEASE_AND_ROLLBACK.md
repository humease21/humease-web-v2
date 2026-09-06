# 07. 신규 Vercel 배포·운영 전환·롤백

## 1. 시스템과 브랜치

```text
기존 저장소 / 기존 main / 기존 GitHub Pages
  → 현재 www.humease.com 유지
  → 신규 구축 기간 READ-ONLY

신규 저장소 humease-web-v2
  main                       # 신규 프로젝트의 승인된 배포 기준
  feature/foundation         # 신규 기초 구조
  feature/site-pages         # 신규 디자인·본문·기존 이미지 연결
  feature/contact-operations # 문의·운영 기능
  fix/...                    # 신규 사이트 수정
  → 신규 Vercel 프로젝트 humease-web-v2
      PR / feature → Preview
      승인된 main → 신규 프로젝트 내부 Production
      별도 운영 전환 승인 후 → www.humease.com
```

‘main merge’라는 말은 어느 저장소인지 반드시 식별한다. 새 저장소의 승인된 main merge는 허용된 개발 절차지만, 기존 운영 저장소의 main은 수정하지 않는다. feature 브랜치 이름은 실제 작업 범위에 맞게 정리하되 구 저장소에서 만들지 않는다.

Vercel Git 연동은 새 저장소만 연결한다. 새 프로젝트 초기 import가 Production 환경을 만들더라도 실제 회사 도메인이 연결됐다고 간주하지 않는다. 초기에는 공개 플래그와 운영 쓰기를 꺼두고 보호 설정을 검증한다. [S09][S16]

## 2. Vercel 설정 계약

| 설정 | 값 |
|---|---|
| 프로젝트 | 새 `humease-web-v2`, 기존 프로젝트 재사용 금지 |
| Framework Preset | Next.js |
| Root Directory | 새 저장소 루트, 실제 package.json 위치 확인 |
| Install | npm ci |
| Build | npm run build |
| Output Directory | Next.js 자동 설정 유지, dist/out 수동 지정 금지 |
| Node | 24.x |
| Production Branch | 새 저장소 main |
| 공개 도메인 | 전환 승인 전 미연결 |
| 초기 환경 | staging, 문의 mock/disabled, analytics off |
| Preview 보호 | 팀에 제공되는 Deployment Protection 확인·활성화 |

회사 홈페이지이므로 상업용 사용에 맞는 Vercel 플랜·팀 권한·결제 승인을 확인한다. 공식 Hobby 정책은 비상업적 개인 용도를 대상으로 하므로 휴미즈 기업 운영을 무료 Hobby에 당연히 올릴 수 있다고 전제하지 않는다. Pro 이상 등 적합한 계약을 확인하되 이 설계서가 결제 승인을 대신하지 않는다. [S17]

Vercel의 보호 범위는 요금제·설정에 따라 달라진다. 기본 production domain까지 항상 보호된다고 가정하지 말고 비인증 브라우저에서 URL별 접근을 확인한다. noindex는 접근 통제가 아니다. [S16]

## 3. 단계별 절차

### G0 — 경계와 현황 확인

구·신 저장소·폴더·도메인·데이터 흐름을 기록한다. 이미지 실제 위치·회사정보·법적 문서·기존 URL·관리자 업무를 확인한다. 기존 실행 코드를 이 단계에서 변경하지 않는다.

### G1 — Next.js 기반선

새 프로젝트를 초기화하고 버전을 고정한다. Next.js 로컬 production build, 최소 공개 페이지, 기본 404, disabled/mock API, 환경 분리가 동작해야 한다. 새 Vercel의 보호된 URL에 배포한다. **기존 화면의 Vercel 복제 단계는 없다.**

### G2 — 브랜드·핵심 화면

이미 생성된 A01/A02를 연결해 desktop/mobile Hero를 완성한다. 이어서 Business와 맘이음, 실제 typography·메뉴·Footer를 검증한다. 과도한 모션 없이 정지 화면의 품질을 먼저 평가한다. 이미지가 미연결이면 대체 단색 상태로 작업하되 시각 PASS로 처리하지 않는다.

### G3 — 전체 페이지·기능

12개 공개 페이지, URL 별칭, 정책 공개 조건, 문의 상태, 필요한 관리자 업무를 구현한다. 운영과 분리된 어댑터·테스트 데이터로 검증한다. 운영 DB·메일로 자동 E2E를 돌리지 않는다.

### G4 — 릴리스 후보 검증

08 문서의 모든 필수 검수를 수행하고 Antigravity가 독립 검수한다. 심각도·미실행 항목·예외·증거를 정리한다. 배포할 정확한 commit SHA와 deployment ID를 기록한다. 신규 main 반영은 PR 검수·승인 절차를 거친다.

대표님에게 전환 승인 대상으로 다음을 함께 제출한다: 새 화면, 기존 기능 대응표, 테스트 결과, 실제 DNS 변경표, 환경값 변경명(비밀값 제외), 인증서/도메인 조건, 롤백 위치, 남은 위험·승인 예외.

### G5 — 승인 후 live 빌드와 도메인 전환

명시적 승인 후 새 프로젝트의 production 환경을 준비한다. 공개 상태와 운영 어댑터를 포함하는 새 배포가 필요하면 **최종 live 설정으로 다시 build하고 그 deployment를 검수**한다. staging 산출물을 단순 promote하면서 빌드 시 고정된 metadata·기능 플래그까지 변경됐다고 가정하지 않는다.

도메인 연결 전 live 설정의 후보 URL은 비정규 host noindex 및 문의 host gate로 보호한다. 운영 메일·DB의 실제 쓰기 smoke는 승인된 전환 테스트 계획에서만 수행한다.

도메인·DNS를 승인된 표대로 변경한다. 외부 DNS 캐시가 혼재할 수 있으므로 완벽한 무중단을 보장한다고 표현하지 않는다. www/apex/HTTPS/기존 URL/문의/관리자/블로그/메일 영향 점검을 즉시 실시한다.

### G6 — 운영 확인·복구 가능성 유지

실제 사용자 경로와 서버 오류·폼 접수·관리자 확인을 기록한다. 운영 문의 smoke는 별도 승인된 테스트 표식·수신자·정리 정책을 사용하고 실제 고객 데이터를 테스트하지 않는다. 기존 사이트를 최소 7일의 관찰 기준 동안 복구 가능하게 보존한다. 이 기간은 운영자 점검 계획이며 자동 모니터링이 구축됐다는 뜻이 아니다.

기존 Pages 비활성화·저장소 보관 방식 변경은 안정화 후 별도 승인 작업이다. 이 설계서의 작성이나 구현 완료만으로 실행하지 않는다.

## 4. 도메인·검색 노출 matrix

| 환경 / 요청 host | 검색 | 운영 문의·분석 |
|---|---|---|
| Development / localhost | noindex | mock 또는 disabled |
| Preview URL | noindex + 제공 가능한 인증 보호 | 운영 쓰기 금지 |
| 신규 Production, staging 상태 | noindex | 운영 쓰기 금지 |
| 신규 Production, live 상태, *.vercel.app | X-Robots-Tag noindex + 가능한 보호 | host gate로 운영 쓰기 금지 |
| live 상태, www.humease.com | 승인된 공개 페이지 index | 승인된 live 기능만 |
| live 상태, humease.com | www로 영구 redirect | 이 host에서 직접 처리하지 않음 |
| /admin, /api, 인증 페이지 | 항상 noindex | 인증/기능 계약에 따름 |

공통 metadata는 승인 전 noindex다. 승인된 live 빌드의 공개 metadata는 index로 전환한다. 그러나 **비정규 host에서는 서버 응답 X-Robots-Tag를 강제**해 `.vercel.app` 복제 URL이 index 허용을 상속하지 않게 한다. Next.js `proxy.ts` 등 가벼운 응답 경계로 구현하되 관리자 권한 검증을 대체하지 않는다. [S18]

`robots.ts`는 요청 host·공개 상태를 반영한다. host별 응답이 캐시에 섞이지 않도록 동적·캐시 정책을 명시하고 양쪽 실제 응답을 검수한다. 공개 페이지의 layout 전체를 host 확인 때문에 동적으로 만들지 않는다. noindex 헤더·robots·사이트맵·canonical은 서로 다른 역할이며 robots 차단만으로 비밀이나 색인 제거를 보장하지 않는다.

## 5. DNS 변경표와 보호 대상

실제 Vercel 프로젝트가 제시하는 A/CNAME/TXT 값을 사용한다. 예전 공통 IP·CNAME 값을 문서에 고정하지 않는다. 변경표에는 record name, type, 기존 값, 신규 값, TTL, 목적, 승인자, 변경시각, 복원값을 포함한다. [S12]

www와 apex 외의 레코드는 기본 수정 대상이 아니다. MX·SPF·DKIM·DMARC·메일 관련 호스트·Google/Microsoft 검증·blog/build 등 하위 도메인과 다른 서비스의 TXT를 보존한다. apex에 여러 TXT와 MX가 있다고 A만 변경하면서 함께 삭제하지 않는다.

네임서버 전체 이전·와일드카드 변경·DNSSEC·CAA·HSTS preload 변경은 기본 범위에 포함하지 않는다. 인증서 때문에 추가 변경이 필요한 경우 원인·영향·복원 방법을 확인하고 별도 승인한다. 다른 Vercel 프로젝트에 연결된 도메인을 무단으로 떼어내지 않는다.

대표 주소는 www, apex는 www로 영구 이동한다. HTTPS 양쪽 인증서와 path/query 보존, redirect loop 여부를 확인한다. 운영 리다이렉트 규칙이 이메일·블로그·정적 인증파일 요청을 잘못 가로채지 않는지 검수한다.

## 6. 롤백 설계

**코드 롤백:** 직전 정상 Vercel deployment의 SHA·ID·설정 조합을 저장한다. 코드 롤백이 프로젝트 환경변수·도메인·외부 DB 설정을 자동 복원한다고 가정하지 않는다.

**전환 롤백:** 기존 DNS 값과 Pages 설정, 정상 운영 커밋을 기준으로 복귀한다. DNS TTL과 캐시 때문에 즉시 전 세계 동일 복귀는 보장되지 않는다. 롤백도 www/apex/HTTPS/문의/관리자/메일/noindex를 다시 검사한다.

**문의 장애:** 신규 폼만 임시 차단하고 명시된 이메일 연락 경로를 제공할 수 있다. 영구 기능 축소가 아니라 장애 대응이며 운영자에게 상태를 보고한다. DB에 이미 저장된 문의를 프런트 롤백으로 지울 수 있다고 가정하지 않는다.

롤백 발동 후보는 주요 페이지 연속 5xx, 문의 저장 실패, 관리자 권한 노출, 인증서 오류, 핵심 URL 광범위 404다. 구체적 임계치와 판단 담당자는 전환 승인 보고서에 확정한다. 긴급 사고 대응 권한은 별도 운영 정책을 따른다.
