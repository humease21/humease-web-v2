# 홈 화면 스크롤 기반 데이터 전환 애니메이션 전수 조사 보고서
**부제: Windows Chrome 환경의 문구 및 상단 Eyebrow 동일 위치 중첩 현상 원인 규명 및 수학적 검증**

- **문서 번호**: `HUMEASE-DOC-20260924-SCROLL-STAGE-OVERLAP`
- **조사 일시**: 2026-09-24T07:35:00+09:00
- **조사 대상 경로**: `/mnt/e/VibeCoding/humease-web-v2` (`E:\VibeCoding\humease-web-v2`)
- **수행 모드**: READ-ONLY (소스 코드 수정 일체 없음, 정밀 정적 분석 및 수학적 검증)

---

## 1. 개요 및 요약 (Executive Summary)

### 1.1 현상 요약
- **정상 관측 환경 (대표 PC)**: 홈 화면(`#business`) 스크롤 시 `흩어진 데이터, 제각각인 관리 기준` (Stage 1)에서 `데이터 거버넌스에서, AX 실행까지` (Stage 2)로 순차적으로 부드럽게 전환됨.
- **이상 관측 환경 (다른 Windows PC의 Chrome)**: 이전 문구와 다음 문구뿐만 아니라 상단의 eyebrow (`흩어진 데이터` vs `이해할 수 있는 정보로`)까지 **완전히 동일한 위치에 겹쳐서 이중 노출(double-exposure)되거나 영구적으로 중첩**되는 현상 발생.

### 1.2 핵심 결론
본 조사를 통해 확인된 결과, 이는 **단순 CSS 폰트 로딩이나 줄바꿈 문제가 아닌 컴포넌트의 계산 구조 및 접근성 폴백(Fallback) 설계 결함**이다.
주요 원인은 다음 두 가지로 규명되었다:

1. **[주요 원인 1 — 치명적 영구 중첩] `prefers-reduced-motion: reduce` 분기 처리 결함**:
   - Windows 10/11의 [설정 > 접근성 > 시각 효과 > 애니메이션 효과: 끔]이 설정된 PC에서는 Chrome이 `prefers-reduced-motion: reduce`를 활성화한다.
   - 이때 `DataTransition.tsx`의 `useEffect`는 즉시 반환(`return`)되어 스크롤 리스너가 아예 등록되지 않는다.
   - 개발자의 의도는 "모션이 꺼져 있으면 두 문구를 모두 보여준다"였으나, 두 스테이지가 모두 `className="absolute inset-x-0 top-0"`으로 마크업되어 있어 **두 문구와 두 eyebrow가 100% 불투명도(`opacity: 1`)로 동일한 픽셀 좌표에 영구 중첩**된다.
2. **[주요 원인 2 — 스크롤 중 이중 노출] 불투명도 계산 공식의 수학적 상호 배타성 결여 및 마우스 휠 이산 점프**:
   - 모션이 정상 작동하는 환경에서도 `fromOpacity`와 `toOpacity`의 가시 범위가 수학적으로 상호 배타적이지 않다.
   - 스크롤 진행도 $p \in (0.4200, 0.4762)$ (전체 구간의 약 **5.62%**)에서 **두 문구의 불투명도가 동시에 $> 0$**이다.
   - 윈도우 외장 휠 마우스의 이산 스크롤(1 노치당 100~120px)과 125%/150% 디스플레이 배율(작은 뷰포트 높이 $H$)이 결합되면, 휠 스크롤 1번에 $p$가 약 12~15%씩 급격히 점프하여 사용자가 휠을 멈추었을 때 이 5.62% 중첩 구간 내에 정확히 멈출 확률이 매우 높다.

---

## 2. 실제 코드 위치 및 아키텍처 상세 (Code Locations & Architecture)

### 2.1 대상 파일 및 컴포넌트
- **파일 경로**: [`src/components/sections/DataTransition.tsx`](file:///E:/VibeCoding/humease-web-v2/src/components/sections/DataTransition.tsx)
- **컴포넌트**: `export function DataTransition({ image }: { image: Asset })`
- **호출 위치**: [`src/app/(site)/page.tsx`](file:///E:/VibeCoding/humease-web-v2/src/app/%28site%29/page.tsx#L50-L52)
  ```tsx
  <div id="business">
    <DataTransition image={assets.A03} />
  </div>
  ```

### 2.2 핵심 상태 및 스크롤 진행도 계산 로직
`src/components/sections/DataTransition.tsx` 라인 16~50:
```tsx
16:   const trackRef = useRef<HTMLDivElement>(null);
17:   // null = 아직 판정 전(정적 완전 상태로 렌더). 스크롤 핸들러가 처음 돌 때 확정된다.
18:   const [state, setState] = useState<{ p: number; motion: boolean } | null>(null);
19: 
20:   useEffect(() => {
21:     if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
22:     let raf = 0;
23:     const onScroll = () => {
24:       cancelAnimationFrame(raf);
25:       raf = requestAnimationFrame(() => {
26:         const el = trackRef.current;
27:         if (!el) return;
28:         const r = el.getBoundingClientRect();
29:         const total = r.height - window.innerHeight;
30:         if (total <= 0) return;
31:         setState({ p: Math.min(1, Math.max(0, -r.top / total)), motion: true });
32:       });
33:     };
34:     onScroll();
35:     window.addEventListener('scroll', onScroll, { passive: true });
36:     window.addEventListener('resize', onScroll);
37:     return () => {
38:       cancelAnimationFrame(raf);
39:       window.removeEventListener('scroll', onScroll);
40:       window.removeEventListener('resize', onScroll);
41:     };
42:   }, []);
43: 
44:   // 모션이 꺼져 있으면 두 문구를 모두 보여준다(정적 완전 상태)
45:   const motion = state?.motion ?? false;
46:   const p = state?.p ?? 0;
47:   const fromOpacity = motion ? Math.max(0, 1 - p * 2.1) : 1;
48:   const toOpacity = motion ? Math.max(0, (p - 0.42) * 2.3) : 1;
49:   const settle = motion ? p : 1;
```

### 2.3 렌더링 마크업 구조
`src/components/sections/DataTransition.tsx` 라인 52~86:
```tsx
52:     <div ref={trackRef} className="relative h-[240svh]">
53:       <div className="sticky top-0 flex h-[100svh] items-center overflow-hidden">
...
65:         <div className="shell layer w-full">
66:           <div className="relative min-h-[9em] max-w-[min(100%,860px)] md:min-h-[8em]">
67:             {/* Stage 1 (이전 문구) */}
68:             <div
69:               className="absolute inset-x-0 top-0"
70:               style={{ opacity: fromOpacity, transform: `translateY(${-settle * 14}px)` }}
71:             >
72:               <p className="eyebrow">흩어진 데이터</p>
73:               <p className="display-ko mt-5">흩어진 데이터,<br />제각각인 관리 기준</p>
74:             </div>
75: 
76:             {/* Stage 2 (다음 문구) */}
77:             <div
78:               className="absolute inset-x-0 top-0"
79:               style={{
80:                 opacity: toOpacity,
81:                 transform: `translateY(${(1 - settle) * 18}px)`,
82:                 pointerEvents: toOpacity > 0.5 ? 'auto' : 'none',
83:               }}
84:             >
85:               <p className="eyebrow">이해할 수 있는 정보로</p>
86:               <p className="display-ko mt-5">데이터 거버넌스에서,<br />AX 실행까지</p>
87:             </div>
88:           </div>
```

---

## 3. 기술 스택 및 메커니즘 전수 확인 (Technology Audit)

| 검증 항목 | 실제 사용 여부 | 위치 (파일/라인) | 상세 동작 및 영향도 |
|---|---|---|---|
| **`position: sticky`** | **사용됨** | `DataTransition.tsx`:53 | `sticky top-0 h-[100svh]`: 트랙(`240svh`) 내부에서 뷰포트에 100svh 동안 고정됨. 정상 작동함. |
| **`position: absolute`** | **사용됨 (핵심 결함)** | `DataTransition.tsx`:68, 76 | Stage 1과 Stage 2가 **둘 다** `absolute inset-x-0 top-0`에 배치됨. 두 요소가 DOM 흐름에서 빠져나와 정확히 같은 좌상단 좌표(0, 0)를 기준으로 중첩됨. |
| **`vh / svh / dvh`** | **사용됨** | `DataTransition.tsx`:52, 53 | 트랙 `h-[240svh]`, 씬 `h-[100svh]`. 데스크톱 크롬에서는 `100svh == 100vh == window.innerHeight`로 매핑됨. Tailwind v4 유틸리티로 올바르게 컴파일됨. |
| **`window.innerHeight`** | **사용됨** | `DataTransition.tsx`:29 | `total = r.height - window.innerHeight` 계산 시 사용. 윈도우 스케일링/줌에 따라 CSS 픽셀 단위로 축소/확대됨. |
| **`scrollY`** | **미사용** | `HeaderShell.tsx`:10 에만 존재 | `DataTransition`은 `scrollY`를 참조하지 않고 `el.getBoundingClientRect().top`을 직접 측정함. |
| **`IntersectionObserver`** | **미사용** | `Reveal.tsx`:29 에만 존재 | `DataTransition`은 IO를 쓰지 않고 네이티브 `scroll` 이벤트 + `rAF` 방식을 취함. |
| **`Framer Motion (useScroll / useTransform)`** | **전혀 사용되지 않음** | `package.json` | `framer-motion` 라이브러리는 설치조차 되어 있지 않음 (의존성 목록에 부재). |
| **`CSS scroll-driven animation`** | **미사용** | `globals.css` | `@scroll-timeline`이나 `animation-timeline: scroll()` 등 최신 CSS 스크롤 애니메이션은 사용되지 않음. |
| **`breakpoint`** | **사용됨** | `DataTransition.tsx`:66 | `md:min-h-[8em]`: 높이 제한용 미디어 쿼리만 사용되며, 스크롤 진행도나 불투명도 수식에는 영향을 주지 않음. |
| **`resize handler`** | **사용됨 (부분 누락)** | `DataTransition.tsx`:36 | `window.addEventListener('resize', onScroll)` 등록되어 있음. 그러나 `prefers-reduced-motion` 환경에서는 조기 반환되어 등록되지 않음. |
| **`font loading layout shift`** | **간접 영향** | `layout.tsx`:18-23 | Noto Sans KR 서브셋이 `display: 'swap'`으로 로드됨. 시스템 기본 폰트(맑은 고딕)와의 높이 차이로 상단 Hero 섹션 높이가 미세하게 변동(CLS)할 수 있으나, 본문 겹침의 직접 원인은 아님. |

---

## 4. 각 문구 가시 범위(Visible Range)의 수학적 검증

### 4.1 수식 정의
스크롤 진행도 $p \in [0, 1]$에 대하여 두 스테이지의 불투명도 함수는 다음과 같다:
$$\text{fromOpacity}(p) = \begin{cases} 1 & (\text{motion} = \text{false}) \\ \max(0, 1 - 2.1p) & (\text{motion} = \text{true}) \end{cases}$$
$$\text{toOpacity}(p) = \begin{cases} 1 & (\text{motion} = \text{false}) \\ \max(0, 2.3(p - 0.42)) & (\text{motion} = \text{true}) \end{cases}$$

### 4.2 가시 집합(Visible Domain) 계산 ($\text{motion} = \text{true}$인 경우)

1. **Stage 1 (흩어진 데이터) 가시 조건**:
   $$\text{fromOpacity}(p) > 0 \iff 1 - 2.1p > 0 \iff 2.1p < 1 \iff p < \frac{1}{2.1} = \frac{10}{21} \approx 0.476190...$$
   $$V_1 = \left[0, \frac{10}{21}\right) = [0, 0.47619)$$

2. **Stage 2 (이해할 수 있는 정보로) 가시 조건**:
   $$\text{toOpacity}(p) > 0 \iff 2.3(p - 0.42) > 0 \iff p - 0.42 > 0 \iff p > 0.42 = \frac{21}{50}$$
   $$V_2 = \left(\frac{21}{50}, 1\right] = (0.42, 1]$$

3. **상호 배타성(Mutual Exclusivity) 판정**:
   두 스테이지가 배타적이려면 $V_1 \cap V_2 = \emptyset$ 이어야 한다.
   $$V_1 \cap V_2 = \left[0, \frac{10}{21}\right) \cap \left(\frac{21}{50}, 1\right] = \left(\frac{21}{50}, \frac{10}{21}\right) = (0.42000, 0.47619)$$
   $$\Delta p_{\text{overlap}} = \frac{10}{21} - \frac{21}{50} = \frac{500 - 441}{1050} = \frac{59}{1050} \approx \mathbf{0.056190} \ (\approx \mathbf{5.62\%})$$

**[판정 결론]**:
$V_1 \cap V_2 \neq \emptyset$ 이므로, **두 문구의 가시 범위는 수학적으로 상호 배타적이지 않으며 전체 스크롤 트랙의 5.62% 구간에서 반드시 동시에 가시화(opacity > 0)된다.**

### 4.3 진행도($p$) 구간별 불투명도 및 변위(Transform) 정밀 데이터

| 스크롤 진행도 ($p$) | Stage 1 `fromOpacity` | Stage 2 `toOpacity` | Stage 1 `translateY` | Stage 2 `translateY` | 시각적 렌더링 상태 |
|---|---|---|---|---|---|
| **$p = 0.00$** | **1.000** (100%) | **0.000** (0%) | $0.0\text{px}$ | $+18.0\text{px}$ | Stage 1 완전 단독 표시 |
| **$p = 0.20$** | **0.580** (58%) | **0.000** (0%) | $-2.8\text{px}$ | $+14.4\text{px}$ | Stage 1 서서히 감쇠 |
| **$p = 0.40$** | **0.160** (16%) | **0.000** (0%) | $-5.6\text{px}$ | $+10.8\text{px}$ | Stage 1 희미해짐 |
| **$p = 0.420$** (경계) | **0.118** (11.8%) | **0.000** (0%) | $-5.88\text{px}$ | $+10.44\text{px}$ | Stage 2 가시화 시작점 |
| **$p = 0.430$** (중첩) | **0.097** (9.7%) | **0.023** (2.3%) | $-6.02\text{px}$ | $+10.26\text{px}$ | **두 문구 동시 노출 (중첩)** |
| **$p = 0.448$** (중첩 정점) | **0.059** (5.9%) | **0.065** (6.5%) | $-6.27\text{px}$ | $+9.94\text{px}$ | **두 문구 고스트 이중 노출** |
| **$p = 0.460$** (중첩) | **0.034** (3.4%) | **0.092** (9.2%) | $-6.44\text{px}$ | $+9.72\text{px}$ | **두 문구 동시 노출 (중첩)** |
| **$p = 0.4762$** (경계) | **0.000** (0%) | **0.129** (12.9%) | $-6.67\text{px}$ | $+9.43\text{px}$ | Stage 1 완전 소멸점 |
| **$p = 0.60$** | **0.000** (0%) | **0.414** (41.4%) | $-8.4\text{px}$ | $+7.2\text{px}$ | Stage 2 선명화 |
| **$p = 0.8548$** | **0.000** (0%) | **1.000** (100%) | $-11.97\text{px}$ | $+2.61\text{px}$ | Stage 2 완전 표시 도달 |
| **$p = 1.00$** | **0.000** (0%) | **1.334 $\rightarrow$ 1.0** | $-14.0\text{px}$ | $0.0\text{px}$ | Stage 2 완전 단독 표시 |

### 4.4 모션 비활성 환경 ($\text{motion} = \text{false}$)에서의 가시 집합
`prefers-reduced-motion: reduce`가 켜져 있거나 SSR/하이드레이션 이전 상태:
$$\text{fromOpacity} = 1.0 \implies V_1 = [0, 1]$$
$$\text{toOpacity} = 1.0 \implies V_2 = [0, 1]$$
$$V_1 \cap V_2 = [0, 1] \quad (\mathbf{100\% \ 구간 \ 중첩})$$
- `settle = 1`로 고정됨:
  - Stage 1: `translateY(-14px)`, `opacity: 1`
  - Stage 2: `translateY(0px)`, `opacity: 1`
- **결과**: `translateY` 차이가 불과 14px에 불과하여, **`흩어진 데이터`와 `이해할 수 있는 정보로` eyebrow가 14px 차이로 겹치고, 아래 두 줄의 대형 한글 헤드라인이 완전히 한 덩어리로 뭉개져 출력됨.**

---

## 5. 환경별 정밀 매트릭스 분석 (Scaling, Zoom, Viewport, UI)

### 5.1 스크롤 물리량 계산 기본식
1. 트랙 총 높이: $H_{\text{track}} = 2.4 \times H$ (여기서 $H = \text{window.innerHeight}$)
2. 고정 뷰포트 높이: $H_{\text{sticky}} = 1.0 \times H$
3. 총 스크롤 유효 거리: $\text{total} = H_{\text{track}} - H_{\text{sticky}} = 1.4 \times H$
4. 중첩 구간 스크롤 픽셀 거리: $\Delta y_{\text{overlap}} = \Delta p_{\text{overlap}} \times \text{total} = 0.05619 \times 1.4 H \approx \mathbf{0.078666 \times H}$
5. 윈도우 일반 외장 마우스 휠 1 노치(notch)당 스크롤 이동량: $\Delta y_{\text{wheel}} \approx 100 \sim 120\text{px}$
6. 휠 1회당 진행도 증가량: $\Delta p_{\text{wheel}} = \frac{\Delta y_{\text{wheel}}}{\text{total}} = \frac{100 \sim 120}{1.4 H}$

### 5.2 뷰포트 및 배율별 정량 데이터 매트릭스

> *참고: 브라우저 UI(탭/주소창/북마크바 약 110px) 및 윈도우 작업표시줄(약 40~48px)을 반영한 일반적인 최대화 창 기준 CSS `innerHeight` 적용.*

| 해상도 | OS 배율 | 크롬 줌 | CSS $H$ (innerHeight) | 유효 스크롤 ($\text{total}$) | 중첩 픽셀 폭 ($\Delta y_{\text{overlap}}$) | 휠 1회당 $\Delta p$ | 섹션 통과 휠 횟수 | 중첩 구간 체류/정지 위험도 |
|---|---|---|---|---|---|---|---|---|
| **1366 × 768** | 100% | 100% | **~610px** | **854px** | **48.0px** | **11.7% ~ 14.0%** | 약 7 ~ 8회 | **매우 높음** (휠 1번에 중첩 폭 초과 점프 또는 정지) |
| **1366 × 768** | 100% | 125% | **~488px** | **683px** | **38.4px** | **14.6% ~ 17.5%** | 약 5 ~ 6회 | **극도로 높음** |
| **1440 × 900** | 100% | 100% | **~740px** | **1036px** | **58.2px** | **9.6% ~ 11.6%** | 약 9 ~ 10회 | **높음** |
| **1920 × 1080** | 100% | 100% | **~920px** | **1288px** | **72.4px** | **7.7% ~ 9.3%** | 약 11 ~ 13회 | **보통** |
| **1920 × 1080** | 125% (권장값) | 100% | **~700px** | **980px** | **55.1px** | **10.2% ~ 12.2%** | 약 8 ~ 9회 | **매우 높음** (일반 노트북 기본 환경) |
| **1920 × 1080** | 125% | 110% | **~636px** | **890px** | **50.0px** | **11.2% ~ 13.5%** | 약 7 ~ 8회 | **매우 높음** |
| **1920 × 1080** | 150% | 100% | **~570px** | **798px** | **44.8px** | **12.5% ~ 15.0%** | 약 6 ~ 7회 | **극도로 높음** (13~14인치 노트북) |
| **1920 × 1080** | 100% | 80% | **~1150px** | **1610px** | **90.5px** | **6.2% ~ 7.4%** | 약 14 ~ 16회 | 낮음 |
| **2560 × 1440** | 100% | 100% | **~1280px** | **1792px** | **100.7px** | **5.5% ~ 6.7%** | 약 15 ~ 18회 | 낮음 (대표 PC 고해상도 환경 추정) |
| **2560 × 1440** | 125% | 100% | **~1020px** | **1428px** | **80.2px** | **7.0% ~ 8.4%** | 약 12 ~ 14회 | 보통 |

### 5.3 분석 시사점
1. **대표 PC vs 다른 PC의 체감 차이 메커니즘**:
   - 대표 PC가 QHD(2560x1440) 또는 맥북(고정밀 트랙패드 연속 스크롤)인 경우: 총 스크롤 유효 거리가 1600~1800px에 달하고 픽셀 단위로 부드럽게 넘어가므로, 5.62% 구간을 눈 깜짝할 사이에 통과하여 "순차적으로 정상 전환"되는 것처럼 인지됨.
   - 반면 FHD 125% 또는 1366x768 환경의 Windows PC에 일반 휠 마우스를 연결한 경우: 총 스크롤 거리가 800~980px에 불과하며, 휠 1 노치당 진행도가 12% 이상 뛰어넘음. 휠을 3~4회 굴리다 멈추었을 때 $p=0.43\sim 0.46$ 구간에 걸려 멈출 확률이 통계적으로 매우 높아 **두 텍스트가 겹친 채 멈춰 서 있는 상태**를 보게 됨.
2. **고정 픽셀 임계값 부재**:
   - 코드에 고정 픽셀(예: `scrollY > 400px`)로 스테이지를 나누는 로직은 없으나, **상대 비율 $p$에 대한 0.42와 2.1이라는 매직 넘버가 뷰포트 높이나 입력 디바이스 특성을 고려하지 않고 하드코딩**되어 있음.

---

## 6. 재현 조건 (Reproduction Scenarios)

### 시나리오 A: 영구 100% 완전 중첩 재현 (치명적)
1. **OS**: Windows 10 또는 Windows 11
2. **설정**: [Windows 설정] > [접근성] > [시각 효과] > **[애니메이션 효과] 토글을 "끔(Off)"**으로 변경.
   *(또는 제어판 > 접근성 센터 > 컴퓨터를 보기 쉽게 설정 > "불필요한 애니메이션 모두 끄기" 체크)*
3. **브라우저**: Chrome (최신 버전) 실행 후 홈페이지 접속.
4. **결과**:
   - 페이지에 진입하자마자 `#business` 섹션에서:
     - `흩어진 데이터` (eyebrow)와 `이해할 수 있는 정보로` (eyebrow)가 14px 차이로 겹쳐서 출력됨.
     - `흩어진 데이터, 제각각인 관리 기준`과 `데이터 거버넌스에서, AX 실행까지`가 100% 불투명도로 동일 위치에 완전히 포개져 글자가 뭉개짐.
   - 스크롤을 아무리 내려도 상태가 변하지 않고 **영구적으로 겹쳐 있음**.

### 시나리오 B: 스크롤 중 이중 노출 정지 재현
1. **환경**: 일반 Windows 랩탑 (1920x1080 @ 125% 배율 또는 1366x768 @ 100%).
2. **입력장치**: 일반 외장 휠 마우스 (Logitech 등 표준 휠).
3. **재현 절차**:
   - 홈 화면 로드 후 Hero 섹션 아래로 마우스 휠을 1클릭씩 천천히 3~4회 회전.
4. **결과**:
   - 휠이 3번째 또는 4번째 회전 후 멈췄을 때 $p \approx 0.44$ 위치에 뷰포트가 정지.
   - 두 eyebrow와 두 헤드라인 문구가 불투명도 약 5~10% 수준으로 동시에 반투명하게 겹쳐서 가독성이 완전히 깨짐.

### 시나리오 C: 초기 로드 / SSR 하이드레이션 깜빡임 (FOUC)
1. **환경**: Chrome 개발자 도구 > Network: Fast 3G, CPU: 4x slowdown 설정.
2. **재현 절차**: 페이지 새로고침.
3. **결과**:
   - JS 번들이 로드되고 `useEffect` 내의 `rAF`가 돌기 전까지 SSR HTML 상태(`state === null`, `motion === false`)로 인해 두 텍스트가 100% 겹친 채 0.5~1초간 화면에 노출되었다가 깜빡이며 분리됨.

---

## 7. GAP 분석 (Current vs Expected)

| 평가 항목 | 현재 구현 (`DataTransition.tsx`) | 요구 / 이상적 동작 (Expected) | GAP 및 위험도 |
|---|---|---|---|
| **접근성 (Reduced Motion)** | `prefers-reduced-motion` 감지 시 리스너 등록 중단 후 두 절대위치 텍스트를 `opacity: 1`로 동시 렌더. | 모션 감소 환경에서는 두 텍스트를 수직으로 순차 배치(정적 문서 흐름)하거나, 스크롤 위치에 따라 배타적(Step 0/1)으로 교체. | **CRITICAL**: 윈도우 접근성 사용자에게 완전히 망가진 화면 제공. |
| **가시 범위 배타성** | $p \in (0.42, 0.4762)$에서 두 텍스트가 동시에 $>0$ 불투명도를 가짐 ($\Delta p \approx 5.62\%$). | 두 텍스트의 가시 범위가 완전히 배타적이거나 ($V_1 \cap V_2 = \emptyset$), 최소한 Stage 1이 0이 된 후 버퍼(Dead-zone)를 거쳐 Stage 2가 시작되어야 함. | **HIGH**: 휠 마우스 사용자에게 텍스트 이중 노출 및 시각적 결함 유발. |
| **초기 렌더링 상태 (SSR/Hydration)** | `state = null`일 때 fallback으로 두 문구가 모두 불투명도 1로 렌더링됨. | 초기 렌더링 시에는 첫 번째 장면(Stage 1)만 100% 보이고, Stage 2는 0%여야 함. | **MEDIUM**: 저사양 기기나 네트워크 지연 시 깜빡임 발생. |
| **레이아웃 구조** | 단일 컨테이너 내부에서 두 텍스트가 모두 `absolute inset-x-0 top-0`으로 고정. | 상태에 따라 텍스트 내용만 교체되거나(단일 DOM 슬롯), 불투명도 0인 요소는 `display: none` 또는 `visibility: hidden` 처리. | **MEDIUM**: 접근성 트리 및 스크린 리더에서 두 문구가 동일 위치에 중복 인지됨. |

---

## 8. 향후 조치를 위한 대상 분류 (Action Boundaries)

> **주의: 본 조사는 READ-ONLY 분석이며 코드를 일체 수정하지 않았다. 아래 분류는 후속 작업 티켓 발행 시 개발자가 엄격히 준수해야 할 경계선이다.**

### 8.1 수정해야 할 대상 (Targets to Modify in Future Task)
- **대상 파일**: [`src/components/sections/DataTransition.tsx`](file:///E:/VibeCoding/humease-web-v2/src/components/sections/DataTransition.tsx)
- **구체적 수정 지점**:
  1. **초기 상태 수정 (라인 18, 45-50)**:
     - `state === null`일 때 기본값을 Stage 1 100%, Stage 2 0%로 설정하여 초기 로드 및 SSR 중첩 차단.
  2. **`prefers-reduced-motion` 처리 수정 (라인 21, 45-50)**:
     - 단순히 조기 반환(`return`)하고 `opacity: 1`을 주는 잘못된 로직 폐기.
     - 모션 감소 환경에서는:
       - **방안 A (권장)**: 스크롤 위치에 따른 계단식(Step) 전환 ($p < 0.5$이면 Stage 1만 100%, $p \ge 0.5$이면 Stage 2만 100%).
       - **방안 B**: `sticky`를 풀고 일반적인 수직 레이아웃(`static/relative`)으로 두 문구를 위아래로 순차 나열.
  3. **불투명도 함수 수식 수정 (라인 47-48)**:
     - 상호 배타성($V_1 \cap V_2 = \emptyset$)을 보장하도록 수식 개편.
     - 예시:
       - Stage 1: $p \in [0, 0.40]$에서 페이드아웃 (0.40에서 완전 0 도달).
       - 버퍼 구간: $p \in [0.40, 0.46]$에서는 둘 다 불투명도 0 (공백 상태).
       - Stage 2: $p \in [0.46, 0.70]$에서 페이드인 시작.
  4. **비가시 상태 은닉 처리 (라인 68-87)**:
     - 불투명도가 0인 스테이지에는 `visibility: 'hidden'` 또는 `pointer-events: 'none'`을 확실히 부여하여 렌더링 엔진의 합성 오버헤드와 잔상 방지.

### 8.2 절대 건드리면 안 되는 대상 (Targets NOT to Touch)
- **카피 문구 및 텍스트 원문**:
  - `흩어진 데이터`, `흩어진 데이터, 제각각인 관리 기준`
  - `이해할 수 있는 정보로`, `데이터 거버넌스에서, AX 실행까지`
  - *이유: 2026-09-17 커밋(`97732ee`)을 통해 19개 페이지 전사 통합 승인이 완료된 핵심 브랜드 카피이며, `docs/03_PAGES_AND_COPY.md` 및 `verify-request-copy.mjs` 검증 대상임.*
- **배경 이미지 및 비주얼 시스템**:
  - `image={assets.A03}` 자산 매핑
  - `.bleed`, `.mask-scene` 그라디언트 마스크 (`globals.css`)
  - 배경 scale/filter 전환 애니메이션
- **상위 페이지 및 인접 섹션 컴포넌트**:
  - [`src/app/(site)/page.tsx`](file:///E:/VibeCoding/humease-web-v2/src/app/%28site%29/page.tsx)
  - [`src/components/brand/CinematicHero.tsx`](file:///E:/VibeCoding/humease-web-v2/src/components/brand/CinematicHero.tsx)
  - [`src/components/sections/Scene.tsx`](file:///E:/VibeCoding/humease-web-v2/src/components/sections/Scene.tsx)
  - [`src/components/interactive/HeaderShell.tsx`](file:///E:/VibeCoding/humease-web-v2/src/components/interactive/HeaderShell.tsx)
  - [`src/components/interactive/Reveal.tsx`](file:///E:/VibeCoding/humease-web-v2/src/components/interactive/Reveal.tsx)
- **폰트 서브셋 빌드 체계**:
  - `public/fonts/noto-sans-kr-subset.woff2`, `scripts/subset-font.mjs`
  - *이유: 폰트 파일 자체는 온전하며 글리프 누락이나 파일 결함이 없음.*

---
**보고서 작성 완료**: 2026-09-24 | Antigravity Diagnostic Agent (READ-ONLY)
