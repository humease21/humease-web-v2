/**
 * 관리자 콘솔 공용 표시 요소.
 *
 * 공개 사이트의 시네마틱 레이어(.scene/.bleed/.display-*)를 쓰지 않는다 — 여기는 운영 도구다.
 * 색은 globals.css 의 고정 토큰만 쓴다. 관리자용으로 새 색을 만들지 않는다.
 * 차트 라이브러리를 추가하지 않는다. 비율 막대는 아래 `RankList` 의 CSS 폭으로 그린다.
 */

export const panelClass =
  'border border-[var(--color-line)] bg-[var(--color-surface)] p-5';

export const inputClass =
  'w-full border border-[var(--color-line)] bg-[var(--color-bg)] px-3 py-2 text-[14px] text-[var(--color-text)] placeholder:text-[var(--color-muted)]';

export const buttonClass =
  'inline-flex items-center justify-center gap-1.5 border border-[var(--color-line)] px-3.5 py-2 text-[13px] font-medium text-[var(--color-text)] transition-colors hover:border-[var(--color-accent)] hover:text-[var(--color-accent)] disabled:cursor-not-allowed disabled:opacity-50';

export const primaryButtonClass =
  'inline-flex items-center justify-center gap-1.5 bg-[var(--color-accent)] px-4 py-2 text-[13px] font-semibold text-[#12100C] transition-colors hover:bg-[#d8cdb6] disabled:cursor-not-allowed disabled:opacity-50';

export function Spinner({ label }: { label: string }) {
  return (
    <p role="status" className="flex items-center gap-2 text-[13px] text-[var(--color-muted)]">
      <span
        aria-hidden="true"
        className="inline-block size-3.5 animate-spin rounded-full border border-[var(--color-line)] border-t-[var(--color-accent)]"
      />
      {label}
    </p>
  );
}

export function ErrorNote({ message }: { message: string }) {
  return (
    <p role="alert" className="border border-[var(--color-accent)] px-4 py-3 text-[13px] text-[var(--color-accent)]">
      {message}
    </p>
  );
}

export function Panel({ title, note, children }: { title: string; note?: string; children: React.ReactNode }) {
  return (
    <section className={panelClass}>
      <h2 className="text-[13px] font-semibold tracking-[0.04em] text-[var(--color-text)]">{title}</h2>
      {note && <p className="mt-1 text-[12px] text-[var(--color-muted)]">{note}</p>}
      <div className="mt-4">{children}</div>
    </section>
  );
}

export function StatCard({ label, value, note }: { label: string; value: string; note?: string }) {
  return (
    <div className="border border-[var(--color-line)] bg-[var(--color-surface)] px-4 py-4">
      <p className="text-[12px] leading-snug text-[var(--color-muted)]">{label}</p>
      <p className="mt-2 text-[26px] leading-none font-medium tabular-nums text-[var(--color-text)]">{value}</p>
      {note && <p className="mt-2 text-[11px] text-[var(--color-muted)]">{note}</p>}
    </div>
  );
}

export type RankRow = { key: string; count: number };

/** 상위 N 목록 + 비율 막대. 값이 0건이면 빈 목록 문구를 낸다(가짜 0% 행을 만들지 않는다). */
export function RankList({ rows, total, limit = 8 }: { rows: RankRow[]; total: number; limit?: number }) {
  if (rows.length === 0) {
    return <p className="text-[13px] text-[var(--color-muted)]">기록이 없습니다.</p>;
  }
  return (
    <ul className="space-y-2.5">
      {rows.slice(0, limit).map((row) => {
        const pct = total > 0 ? (row.count / total) * 100 : 0;
        return (
          <li key={row.key}>
            <div className="flex items-baseline justify-between gap-3">
              <span className="min-w-0 truncate text-[13px] text-[var(--color-text)]" title={row.key}>{row.key}</span>
              <span className="shrink-0 text-[12px] tabular-nums text-[var(--color-muted)]">
                {row.count.toLocaleString('ko-KR')} · {pct.toFixed(1)}%
              </span>
            </div>
            <div className="mt-1 h-1 bg-[var(--color-raised)]">
              <div className="h-full bg-[var(--color-accent)]" style={{ width: `${Math.max(pct, 1)}%` }} />
            </div>
          </li>
        );
      })}
    </ul>
  );
}

/** 로딩 자리표시. 데이터가 도착해도 레이아웃이 튀지 않도록 실제 패널과 크기를 맞춘다. */
export function SkeletonPanels({ count = 3 }: { count?: number }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: count }, (_, i) => (
        <div key={i} className={`${panelClass} animate-pulse`}>
          <div className="h-3 w-24 bg-[var(--color-raised)]" />
          <div className="mt-4 h-20 bg-[var(--color-raised)]/60" />
        </div>
      ))}
    </div>
  );
}

/** 상위 N 집계. PostgREST 에 group by 가 없어 가져온 행 위에서 계산한다. */
export function tally(values: (string | null | undefined)[], emptyLabel = '(없음)'): RankRow[] {
  const map = new Map<string, number>();
  for (const v of values) {
    const key = v && v.trim() ? v.trim() : emptyLabel;
    map.set(key, (map.get(key) ?? 0) + 1);
  }
  return [...map.entries()]
    .map(([key, count]) => ({ key, count }))
    .sort((a, b) => b.count - a.count || a.key.localeCompare(b.key));
}
