# 운영 전환 2단계 — DNS 기준선·롤백 값·실행 절차

- 기록 시각: 2026-09-06 23:14 KST (2026-09-06T14:14Z)
- 출발 커밋: `48807d737441e887d296a9371c25028ec43f8f70`
- Actions run `34037593499` — build success / deploy success
- 조회 방법: Cloudflare DoH (`cloudflare-dns.com/dns-query`). 읽기 전용.
- **상태: 실행 차단.** 사유는 §4.

## 1. 전환 전 DNS 기준선 (변경 금지 항목 포함)

### 1.1 웹 관련 — 이번 전환의 유일한 변경 대상

| 이름 | 타입 | TTL | 현재 값 | 이번 단계 조치 |
|---|---|---|---|---|
| `www.humease.com` | CNAME | 3600 | `humease.github.io.` | **`humease21.github.io.` 로 변경** |
| `humease.com` | A | 3600 | `185.199.108.153` | 변경 없음 |
| `humease.com` | A | 3600 | `185.199.109.153` | 변경 없음 |
| `humease.com` | A | 3600 | `185.199.110.153` | 변경 없음 |
| `humease.com` | A | 3600 | `185.199.111.153` | 변경 없음 |
| `humease.com` | AAAA | — | 없음 | 변경 없음 |

apex A 4개는 GitHub Pages 공용 IP 와 **정확히 일치한다.** 지시된 "다른 값이면 중단" 조건에 해당하지 않으므로 그대로 둔다.

### 1.2 메일·인증 — 절대 변경 금지

| 이름 | 타입 | TTL | 값 | 용도 |
|---|---|---|---|---|
| `humease.com` | MX | 3600 | `0 humease-com.mail.protection.outlook.com.` | Microsoft 365 메일 수신 |
| `humease.com` | TXT | 3600 | `v=spf1 include:spf.protection.outlook.com -all` | SPF |
| `humease.com` | TXT | 3600 | `MS=ms42929545` | Microsoft 365 도메인 소유권 |
| `humease.com` | TXT | 180 | `google-site-verification=-BEpRW0KnTXvrAddmTdZVTS2SEvbv5oZpB8fmpVTTKw` | Google 소유권 |
| `humease.com` | TXT | 180 | `google-site-verification=z8Tvmzcg9Uk2IUlqO-NSCPA0560q39xV0Dicf4F2fU4` | Google 소유권 |
| `_dmarc.humease.com` | TXT | — | **없음** | DMARC 미설정 |

DKIM 은 흔한 셀렉터 13종(`google` `default` `selector1` `selector2` `s1` `s2` `k1` `k2` `mail` `dkim` `naver` `daum` `mailplug`)을 조회했으나 응답이 없었다. **DKIM 이 없다는 뜻이 아니다.** 셀렉터 이름을 모르면 DNS 로 열거할 수 없다. 어느 경우든 TXT 는 건드리지 않는다.

`_dmarc` 부재는 이번 전환과 무관한 별개 사안이다. 이번 단계에서 추가하지 않는다.

### 1.3 DNS 관리 주체

| 항목 | 값 |
|---|---|
| NS | `ns1~ns4.hosting.co.kr.` |

Cloudflare·Route53 이 아니다. **API 접근 수단이 없다.** DNS 변경은 hosting.co.kr 관리 콘솔에서 사람이 해야 한다.

## 2. 롤백 값 — 실패 시 이 값으로 되돌린다

```
이름   : www
타입   : CNAME
값     : humease.github.io.
TTL    : 3600
```

되돌린 뒤 `Humease/Homepage` 의 Pages Custom Domain 을 `www.humease.com` 으로 다시 설정해야 원상복구가 완료된다. CNAME 만 되돌리면 GitHub 쪽에서 도메인을 주장하는 저장소가 없어 계속 404 다.

**TTL 3600 이므로 롤백 반영에 최대 1시간이 걸린다.** 전환 전 TTL 을 300 으로 낮춰두면 롤백 시간이 5분으로 줄어든다. 낮춘 값이 전파되려면 낮추는 작업 자체를 최소 1시간 전에 해야 한다.

## 3. GitHub 쪽 기준선

| 항목 | 값 |
|---|---|
| `Humease/Homepage` Pages cname | `www.humease.com` |
| `Humease/Homepage` Pages status | `built` |
| `Humease/Homepage` HTTPS 인증서 | `approved`, 대상 `www.humease.com` + `humease.com`, 만료 2026-10-23 |
| `Humease/Homepage` Enforce HTTPS | `true` |
| `humease21/humease-web-v2` Pages cname | `null` |
| `humease21/humease-web-v2` build_type | `workflow` |
| `_github-pages-challenge-humease21.humease.com` TXT | **없음 — 도메인 미검증** |
| `_github-pages-challenge-humease.humease.com` TXT | 없음 |

전환 전 HTTP 기준선

| URL | 결과 |
|---|---|
| `https://www.humease.com/` | 200 (구 사이트) |
| `https://humease.com/` | 301 → `https://www.humease.com/` |
| `https://humease21.github.io/humease-web-v2/` | 200 (신규, 자산은 404 — 1단계 결과) |

## 4. 실행 차단 사유

| # | 필요한 작업 | 차단 사유 |
|---|---|---|
| 1 | humease21 계정의 `humease.com` 소유권 Verify | 사용자 계정 도메인 검증 토큰은 **웹 UI 에만** 노출된다. REST API 없음(`/user/settings/verified-domains` 등 404 확인). TXT 값을 알 수 없어 안내도 불가 |
| 2 | `Humease/Homepage` Custom Domain 제거 | humease21 토큰의 해당 저장소 권한이 `pull` 뿐 (`admin:false`, `push:false`). Pages 설정 변경 불가 |
| 3 | `www` CNAME 변경 | DNS 가 hosting.co.kr. API·자격증명 없음 |

세 작업 모두 **소유자 조작이 필요하다.** 2·3 은 순서가 강제되므로 하나라도 막히면 나머지도 진행할 수 없다.

## 5. 대표님 실행 절차

### 5-A. (권장, 선택) 전환 1시간 전 — TTL 낮추기
hosting.co.kr → `www` CNAME 의 TTL 을 `3600` → `300` 으로 변경. 값은 그대로 `humease.github.io.`
롤백 소요를 1시간 → 5분으로 줄인다.

### 5-B. 도메인 소유권 Verify (humease21 계정)
1. **humease21 계정으로 로그인** 후 <https://github.com/settings/pages> 접속
2. `Add a domain` → `humease.com` 입력
3. 화면에 나오는 TXT **이름과 값**을 그대로 hosting.co.kr 에 추가
   - 이름: `_github-pages-challenge-humease21` (호스트 입력란에 따라 `_github-pages-challenge-humease21.humease.com`)
   - 값: 화면에 표시된 문자열 (이 값은 계정마다 다르고 저는 조회할 수 없습니다)
4. 전파 후 GitHub 화면에서 `Verify` 클릭 → **Verified** 확인
5. 기존 MX/SPF/TXT 는 **수정하지 말고 새 TXT 만 추가**한다

### 5-C. 기존 Custom Domain 제거 (Humease 계정 필요)
**Humease 계정으로 로그인** → `Humease/Homepage` → Settings → Pages → Custom domain 을 **비우고 Save**
→ 제거 시각을 기록한다. **이 순간부터 다운타임이 시작된다.**

### 5-D. 신규 Custom Domain 등록 — 5-C 직후 즉시
`humease21/humease-web-v2` → Settings → Pages → Custom domain 에 `www.humease.com` 입력 → Save
→ 등록 시각 기록. DNS check 는 아직 실패한다(5-E 전이므로 정상).

이 저장소는 제 토큰으로 접근 가능하므로 **5-D 는 제가 즉시 실행할 수 있습니다.** 5-C 완료를 알려주시면 바로 처리합니다.

### 5-E. DNS CNAME 변경 — 5-D 직후 즉시
hosting.co.kr → `www` CNAME 값을 `humease.github.io.` → **`humease21.github.io.`**
apex A 4개·MX·SPF·모든 TXT 는 **손대지 않는다.**

### 5-F. 검증·HTTPS (제가 수행)
DNS check Successful 확인 → TLS 인증서 발급 대기 → Enforce HTTPS 활성화 → www/apex/robots/sitemap/주요 페이지/자산 반복 검증.

## 6. 다운타임 예상

| 구간 | 예상 |
|---|---|
| 5-C ~ 5-D | UI 조작 시간. 연달아 하면 1분 이내 |
| 5-E DNS 전파 | TTL 3600 → 최대 1시간 (5-A 수행 시 5분) |
| 신규 저장소 TLS 인증서 발급 | 통상 수분, 최대 수십 분. **이 구간은 HTTP 200 이지만 HTTPS 실패** |

TLS 발급 구간은 GitHub 측 처리라 단축할 수 없다. 전환 시각은 트래픽이 적은 시간대를 권한다.

## 7. 이번 단계에서 하지 않은 것

기존 저장소 삭제·archive 없음. apex A 변경 없음. MX/SPF/DKIM/DMARC/기타 TXT 변경 없음. DNS 전체 변경 없음. 조회는 전부 읽기 전용이었다.
