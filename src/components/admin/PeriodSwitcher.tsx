'use client';

import { PERIOD_PRESETS, type PeriodPresetId } from '@/lib/admin/period';
import { inputClass } from './ui';

/**
 * 기간 필터. 정적 export 라 K-Bestie 처럼 `router.push(?days=)` 로 서버를 다시 태우지 않고,
 * 상위 컴포넌트의 state 를 바꿔 클라이언트에서 곧바로 재질의한다 — 클릭 즉시 선택 상태가 바뀐다.
 * 조회 중 표시는 `pending` 으로 받는다.
 */
export function PeriodSwitcher({
  preset, from, to, pending, invalid, onPresetChange, onRangeChange,
}: {
  preset: PeriodPresetId;
  from: string;
  to: string;
  pending: boolean;
  invalid: boolean;
  onPresetChange: (id: PeriodPresetId) => void;
  onRangeChange: (next: { from: string; to: string }) => void;
}) {
  return (
    <div className="space-y-3">
      <div role="tablist" aria-label="집계 기간" className="flex flex-wrap items-center gap-1.5">
        {PERIOD_PRESETS.map(({ id, label }) => (
          <button
            key={id}
            type="button"
            role="tab"
            aria-selected={preset === id}
            onClick={() => onPresetChange(id)}
            className={`border px-3 py-1.5 text-[13px] transition-colors ${
              preset === id
                ? 'border-[var(--color-accent)] bg-[var(--color-accent)] text-[#12100C]'
                : 'border-[var(--color-line)] text-[var(--color-muted)] hover:border-[var(--color-accent)] hover:text-[var(--color-accent)]'
            }`}
          >
            {label}
          </button>
        ))}
        {pending && <span role="status" className="ml-1 text-[12px] text-[var(--color-muted)]">갱신 중…</span>}
      </div>

      {preset === 'custom' && (
        <div className="flex flex-wrap items-end gap-2">
          <label className="text-[12px] text-[var(--color-muted)]">
            시작일
            <input
              type="date"
              value={from}
              max={to || undefined}
              onChange={(e) => onRangeChange({ from: e.target.value, to })}
              className={`${inputClass} mt-1 w-[168px]`}
            />
          </label>
          <label className="text-[12px] text-[var(--color-muted)]">
            종료일
            <input
              type="date"
              value={to}
              min={from || undefined}
              onChange={(e) => onRangeChange({ from, to: e.target.value })}
              className={`${inputClass} mt-1 w-[168px]`}
            />
          </label>
          {invalid && (
            <p role="alert" className="pb-2 text-[12px] text-[var(--color-accent)]">
              시작일과 종료일을 순서대로 선택해 주세요.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
