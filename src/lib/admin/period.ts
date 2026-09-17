/**
 * 사이트 분석 기간 필터.
 *
 * 경계는 **운영자의 로컬 시간대 하루**를 기준으로 잡고 ISO(UTC) 로 변환해 질의한다.
 * `created_at` 은 timestamptz 이므로 절대 시각 비교가 맞다 — 문자열 날짜를 비교하지 않는다.
 * 끝 경계는 항상 배타적(`lt`)이다. 하루의 마지막 밀리초를 손으로 만들지 않는다.
 */

export type PeriodPresetId = 'today' | 'yesterday' | 'last7' | 'thisMonth' | 'lastMonth' | 'custom';

export const PERIOD_PRESETS: readonly { id: PeriodPresetId; label: string }[] = [
  { id: 'today', label: '오늘' },
  { id: 'yesterday', label: '어제' },
  { id: 'last7', label: '최근 7일' },
  { id: 'thisMonth', label: '이번 달' },
  { id: 'lastMonth', label: '지난달' },
  { id: 'custom', label: '기간 선택' },
] as const;

export type PeriodRange = {
  /** 포함 */
  startIso: string;
  /** 배타 */
  endIso: string;
  label: string;
};

const startOfLocalDay = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate());
const addDays = (d: Date, n: number) => new Date(d.getFullYear(), d.getMonth(), d.getDate() + n);

/**
 * `custom` 은 `from`/`to`(YYYY-MM-DD, 둘 다 포함)를 받는다.
 * 값이 비었거나 뒤집혀 있으면 null 을 반환한다 — 임의로 보정하지 않는다.
 */
export function resolvePeriod(
  preset: PeriodPresetId,
  from: string,
  to: string,
  now: Date = new Date(),
): PeriodRange | null {
  const today = startOfLocalDay(now);

  switch (preset) {
    case 'today':
      return { startIso: today.toISOString(), endIso: addDays(today, 1).toISOString(), label: '오늘' };
    case 'yesterday':
      return { startIso: addDays(today, -1).toISOString(), endIso: today.toISOString(), label: '어제' };
    case 'last7':
      // 오늘을 포함한 7일.
      return { startIso: addDays(today, -6).toISOString(), endIso: addDays(today, 1).toISOString(), label: '최근 7일' };
    case 'thisMonth': {
      const start = new Date(now.getFullYear(), now.getMonth(), 1);
      const end = new Date(now.getFullYear(), now.getMonth() + 1, 1);
      return { startIso: start.toISOString(), endIso: end.toISOString(), label: '이번 달' };
    }
    case 'lastMonth': {
      const start = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      const end = new Date(now.getFullYear(), now.getMonth(), 1);
      return { startIso: start.toISOString(), endIso: end.toISOString(), label: '지난달' };
    }
    case 'custom': {
      if (!from || !to) return null;
      const [fy, fm, fd] = from.split('-').map(Number);
      const [ty, tm, td] = to.split('-').map(Number);
      if (!fy || !fm || !fd || !ty || !tm || !td) return null;
      const start = new Date(fy, fm - 1, fd);
      const end = new Date(ty, tm - 1, td + 1); // to 를 포함하도록 하루 더한 배타 경계
      if (start >= end) return null;
      return { startIso: start.toISOString(), endIso: end.toISOString(), label: `${from} ~ ${to}` };
    }
  }
}

/** 구간 안의 로컬 날짜 키를 순서대로. 데이터가 없는 날도 0으로 채우기 위해 필요하다. */
export function localDayKeys(range: PeriodRange, maxDays = 120): string[] {
  const keys: string[] = [];
  const cursor = startOfLocalDay(new Date(range.startIso));
  const end = new Date(range.endIso);
  while (cursor < end && keys.length < maxDays) {
    const y = cursor.getFullYear();
    const m = String(cursor.getMonth() + 1).padStart(2, '0');
    const d = String(cursor.getDate()).padStart(2, '0');
    keys.push(`${y}-${m}-${d}`);
    cursor.setDate(cursor.getDate() + 1);
  }
  return keys;
}
