/**
 * 관리자 화면 공통 표시 포맷.
 * 정적 export 사이트라 이 코드는 전부 브라우저에서 실행된다 — 운영자의 로컬 시간대로 표시한다.
 * 서버 렌더 결과와 다를 수 있는 값이므로 마운트 이후에만 사용한다(AdminGuard 통과 후).
 */

const dateTimeFormat = new Intl.DateTimeFormat('ko-KR', {
  year: 'numeric', month: '2-digit', day: '2-digit',
  hour: '2-digit', minute: '2-digit', hour12: false,
});

export const formatDateTime = (iso: string | null): string =>
  iso ? dateTimeFormat.format(new Date(iso)) : '—';

export const formatNumber = (n: number): string => n.toLocaleString('ko-KR');

/** 소수 1자리. 분모가 0이면 표시하지 않는다 — 0%로 단정하지 않는다. */
export const formatRatio = (numerator: number, denominator: number): string =>
  denominator > 0 ? `${((numerator / denominator) * 100).toFixed(1)}%` : '—';

export const formatAverage = (numerator: number, denominator: number): string =>
  denominator > 0 ? (numerator / denominator).toFixed(2) : '—';

/** 로컬 시간대 기준 YYYY-MM-DD. UTC 로 밀리지 않도록 getFullYear 계열만 쓴다. */
export const localDateKey = (d: Date): string => {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
};
