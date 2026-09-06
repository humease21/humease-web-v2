# 05. 이미 생성된 이미지의 연결 명세

## 1. 확정 범위

대표님은 이미지 생성이 이미 완료됐다고 명시했다. **이 문서는 이미지 제작 문서가 아니다.** 새 프롬프트·재생성·새 콘셉트·새 영상·새 캐릭터 제작을 시작하지 않는다.

이번 명세서에는 실제 이미지가 첨부되어 있지 않다. 개발 환경에서 대표님이 생성한 파일을 찾아 아래 ID와 연결한다. 실제 파일명이 다르더라도 그대로 사용할 수 있다. 매핑을 위해 이미지를 다시 만들거나 원본 이름을 강제로 변경하지 않는다.

허용 작업은 원본 보존, 웹용 복사, 포맷 변환·리사이즈·압축, 필요 최소 크롭, 배치·object-position 조정이다. 원본 시각 콘셉트를 바꾸는 재색상·합성·인페인팅·생성형 업스케일은 포함하지 않는다. OG의 실제 로고·문구 배치는 코드 합성으로 처리한다.

## 2. 기존 자산 ID와 연결 위치

| ID | 이전에 지정한 basename | 연결 위치 |
|---|---|---|
| A01 | home-hero-desktop | 홈 desktop Hero |
| A02 | home-hero-mobile | 홈 mobile Hero |
| A03 | data-to-intelligence | 홈 사업영역 연결 |
| A04 | enterprise-data | Enterprise Data |
| A05 | ediscovery | e-Discovery |
| A06 | internal-control | Internal Control |
| A07 | exchange-archive | Exchange Archive |
| A08 | applied-ai | Applied AI |
| A09 | ai-projects | AI 프로젝트 |
| A10 | momieum-connection | 홈·AI 프로젝트·맘이음 |
| A11 | about-craft | 회사소개 |
| A12 | enterprise-solutions | 솔루션 |
| A13 | contact-connection | 문의 보조, 404에 필요 시 소규모 재사용 |
| A14 | insight-enterprise-data | 실제 데이터 관련 글의 커버 |
| A15 | insight-applied-ai | 실제 AI 관련 글의 커버 |
| A16 | insight-product-notes | 실제 제품 개발 글의 커버 |
| A17 | og-background | 기존 공유 카드 배경 |

A14–A16은 실제 노출할 글이 있을 때만 사용한다. 준비된 이미지 17개를 모두 페이지에 강제로 채워 넣는 것이 목표가 아니다. 대표님이 일부 이미지를 통합해 생성했다면 실제 자산과 승인 용도에 맞게 ID 매핑을 기록한다.

## 3. 자산 manifest 계약

`src/content/assets.ts`의 레코드는 최소 다음 의미를 갖는다.

- `id`: A01–A17 또는 이미 승인된 실제 로고/캡처 ID.
- `src`: 존재가 확인된 배포 파일 경로. 없으면 임의 확장자를 붙여 만들지 않음.
- `width`, `height`: 실제 파일의 픽셀 크기.
- `role`: decorative / content / product-capture.
- `alt`: 장식이면 빈 문자열, 정보성이면 사실에 맞는 설명.
- `objectPosition`: 실제 구도 확인 후 desktop/mobile별 값.
- `pages`: 적용할 내부 경로 목록.
- `sourceStatus`: located / mapped / optimized / verified.

원본 절대 경로·해시·사용권·내부 확인자는 `docs/reports/ASSET_INVENTORY.md`에 별도 기록한다. 브라우저에 전달하는 manifest에 로컬 경로나 비공개 메모를 포함하지 않는다. `docs/ASSET_MAP.csv`는 초기 연결표이며 실제 파일을 검증했다는 증거가 아니다.

## 4. 원본 보존·웹 최적화

원본은 배포 디렉터리 밖의 기존 보관 위치를 유지한다. 필요한 최적화본만 `public/images`로 복사한다. 거대한 원본과 폰트 묶음을 명세서 ZIP에 넣지 않는다.

전송 예산은 desktop Hero 450KB, mobile Hero 250KB, 일반 이미지 100–220KB, OG 300KB 이하를 목표로 한다. 숫자는 프로젝트 성능 목표이며 생성 도구의 출력 보장이 아니다. 반사·유리·어두운 그라데이션이 뭉개지면 압축과 크기를 조정하고 시각 검수를 병행한다.

동일한 파일을 수차례 재압축하지 않는다. 원본에서 웹용 출력본을 만들고 변경 내역을 기록한다. 확장자는 실제 포맷과 일치해야 한다.

## 5. Next.js 적용

일반 이미지는 `next/image`로 크기를 안정화하고 실제 표시 폭에 맞는 sizes를 설정한다. 배경 장식이라도 접근성 설명을 억지로 넣지 않는다. A01/A02는 picture의 media 선택과 최적화 srcset을 조합하고 실제 모바일 네트워크에서 desktop 원본까지 받지 않는지 검증한다. [S04]

정적인 이미지 파일에 과도한 원근 왜곡이나 스크롤 변형을 적용하지 않는다. 모션은 주로 HTML 텍스트·구획·이미지 컨테이너의 작은 움직임으로 구현한다. 생성물 속 조형을 실제 회사 시스템 또는 제품 스크린샷으로 설명하지 않는다.

## 6. 실제 파일이 아직 연결되지 않은 경우

개발 전체를 멈추지 않고 단색 레이아웃으로 구현을 계속할 수 있다. 이는 개발용 대체 상태이며 최종 시각 승인 완료로 처리하지 않는다. 신규 이미지를 자동 생성하거나 다른 스톡 이미지로 채우지 않는다.

A01·A02 등 해당 릴리스에서 사용하는 주요 이미지 연결이 빠지면 시각 검수는 `BLOCKED`다. 글이 없는 A14–A16처럼 화면에서 사용하지 않기로 한 자산은 사용 계획에서 제외한 이유를 기록한다.

실제 맘이음 UI가 없으면 이미 생성된 A10을 유지한다. 가짜 UI나 부모 리포트를 만들지 않는다. 승인된 실제 화면이 있을 때만 비식별화·캡처일·개발 화면 표시를 갖춰 사용할 수 있다.
