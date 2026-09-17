'use client';

import { useCallback, useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import type { HumeaseInquiry, InquiryStatus } from '@/lib/supabase/types';
import { formatDateTime } from '@/lib/admin/format';
import {
  DISCORD_STATUS_LABELS,
  INQUIRY_FILTERS,
  INQUIRY_STATUSES,
  INQUIRY_STATUS_LABELS,
  inquiryStatusBadgeClass,
  type InquiryFilter,
} from '@/lib/admin/inquiries';
import { useAsyncEffect } from '@/lib/admin/use-async-effect';
import { CopyButton } from './CopyButton';
import { ErrorNote, Spinner, buttonClass, inputClass, panelClass, primaryButtonClass } from './ui';

/**
 * 문의 관리.
 *
 * 필터·검색은 브라우저가 Supabase 에 직접 질의한다(정적 export 라 API route 가 없다).
 * 검색은 회사명·담당자·이메일에 대한 `ilike` 다 — 입력값의 `%`, `,` 는 PostgREST `or` 문법을
 * 깨뜨리므로 제거한다.
 *
 * **물리 DELETE 버튼을 두지 않는다.** DB 에도 DELETE 정책이 없다(V0 범위 밖).
 * 종결 처리는 상태값('종결'/'스팸')으로만 한다.
 */

const PAGE_SIZE = 200;

/** PostgREST `or=(...)` 안에서 의미를 갖는 문자와 와일드카드를 걷어낸다. */
const sanitizeSearch = (raw: string) => raw.replace(/[%,()*]/g, ' ').trim();

export function InquiriesBoard() {
  const [rows, setRows] = useState<HumeaseInquiry[]>([]);
  const [filter, setFilter] = useState<InquiryFilter>('all');
  const [searchInput, setSearchInput] = useState('');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  /** 편집 중인 메모. 어느 문의의 초안인지 함께 들고 있어야 다른 행으로 새어 나가지 않는다. */
  const [memoEdit, setMemoEdit] = useState<{ inquiryId: string; text: string } | null>(null);
  const [saving, setSaving] = useState(false);
  const [saveNote, setSaveNote] = useState<{ inquiryId: string; text: string } | null>(null);

  // 검색어 디바운스 — 글자마다 질의를 보내지 않는다.
  useEffect(() => {
    const timer = window.setTimeout(() => setSearch(sanitizeSearch(searchInput)), 300);
    return () => window.clearTimeout(timer);
  }, [searchInput]);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const supabase = createClient();
      let query = supabase
        .from('humease_inquiries')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(PAGE_SIZE);

      if (filter !== 'all') query = query.eq('status', filter);
      if (search) {
        query = query.or(
          `company_name.ilike.%${search}%,contact_name.ilike.%${search}%,email.ilike.%${search}%`,
        );
      }

      const { data, error: queryError } = await query;
      if (queryError) throw queryError;
      setRows((data ?? []) as HumeaseInquiry[]);
    } catch {
      setError('문의 목록을 불러오지 못했습니다.');
    } finally {
      setLoading(false);
    }
  }, [filter, search]);

  useAsyncEffect(load);

  const selected = rows.find((r) => r.id === selectedId) ?? null;

  /*
   * 메모 초안과 저장 알림은 선택된 행에서 **파생**시킨다.
   * 효과로 선택 변화를 지켜보며 setState 하면 연쇄 렌더가 된다(react-hooks/set-state-in-effect).
   * 초안의 소유자가 현재 선택과 다르면 저장된 값을 그대로 보여준다.
   */
  const storedMemo = selected?.admin_memo ?? '';
  const memoDraft = memoEdit && memoEdit.inquiryId === selected?.id ? memoEdit.text : storedMemo;
  const visibleNote = saveNote && saveNote.inquiryId === selected?.id ? saveNote.text : null;

  const patch = async (id: string, changes: Partial<Pick<HumeaseInquiry, 'status' | 'admin_memo'>>) => {
    setSaving(true);
    setSaveNote(null);
    try {
      const supabase = createClient();
      const { data, error: updateError } = await supabase
        .from('humease_inquiries')
        .update({ ...changes, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select('*')
        .single();
      if (updateError) throw updateError;
      const updated = data as HumeaseInquiry;
      setRows((current) => current.map((r) => (r.id === id ? updated : r)));
      setSaveNote({ inquiryId: id, text: '저장했습니다.' });
    } catch {
      setSaveNote({ inquiryId: id, text: '저장에 실패했습니다. 권한과 네트워크를 확인해 주세요.' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-[24px] font-medium text-[var(--color-text)]">문의 관리</h1>
        <button type="button" onClick={() => void load()} className={buttonClass}>새로고침</button>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <div role="tablist" aria-label="문의 상태 필터" className="flex flex-wrap gap-1.5">
          {INQUIRY_FILTERS.map(({ id, label }) => (
            <button
              key={id}
              type="button"
              role="tab"
              aria-selected={filter === id}
              onClick={() => setFilter(id)}
              className={`border px-3 py-1.5 text-[13px] transition-colors ${
                filter === id
                  ? 'border-[var(--color-accent)] bg-[var(--color-accent)] text-[#12100C]'
                  : 'border-[var(--color-line)] text-[var(--color-muted)] hover:border-[var(--color-accent)] hover:text-[var(--color-accent)]'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
        <label className="ml-auto w-full sm:w-[280px]">
          <span className="sr-only">회사명·담당자·이메일 검색</span>
          <input
            type="search"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="회사명 · 담당자 · 이메일 검색"
            className={inputClass}
          />
        </label>
      </div>

      {error && <ErrorNote message={error} />}

      <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_minmax(0,420px)]">
        <section className={panelClass}>
          {loading ? (
            <Spinner label="불러오는 중…" />
          ) : rows.length === 0 ? (
            <p className="text-[13px] text-[var(--color-muted)]">
              {search || filter !== 'all' ? '조건에 맞는 문의가 없습니다.' : '아직 접수된 문의가 없습니다.'}
            </p>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[700px] text-left text-[13px]">
                  <thead className="text-[12px] text-[var(--color-muted)]">
                    <tr className="border-b border-[var(--color-line)]">
                      <th scope="col" className="py-2 pr-4 font-medium">접수일</th>
                      <th scope="col" className="py-2 pr-4 font-medium">회사명</th>
                      <th scope="col" className="py-2 pr-4 font-medium">담당자</th>
                      <th scope="col" className="py-2 pr-4 font-medium">관심 분야</th>
                      <th scope="col" className="py-2 pr-4 font-medium">상태</th>
                      <th scope="col" className="py-2 font-medium">메모</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rows.map((row) => (
                      <tr
                        key={row.id}
                        onClick={() => setSelectedId(row.id)}
                        aria-selected={selectedId === row.id}
                        className={`cursor-pointer border-b border-[var(--color-line)]/50 transition-colors hover:bg-[var(--color-raised)] ${
                          selectedId === row.id ? 'bg-[var(--color-raised)]' : ''
                        }`}
                      >
                        <td className="py-2.5 pr-4 tabular-nums text-[var(--color-muted)]">{formatDateTime(row.created_at)}</td>
                        <td className="py-2.5 pr-4 text-[var(--color-text)]">{row.company_name}</td>
                        <td className="py-2.5 pr-4 text-[var(--color-muted)]">{row.contact_name}</td>
                        <td className="py-2.5 pr-4 text-[var(--color-muted)]">{row.interest_area ?? '—'}</td>
                        <td className="py-2.5 pr-4">
                          <span className={`border px-2 py-0.5 text-[11px] ${inquiryStatusBadgeClass(row.status)}`}>
                            {INQUIRY_STATUS_LABELS[row.status]}
                          </span>
                        </td>
                        <td className="py-2.5 text-[var(--color-muted)]">{row.admin_memo?.trim() ? '있음' : '—'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {rows.length >= PAGE_SIZE && (
                <p className="mt-4 text-[12px] text-[var(--color-muted)]">
                  최근 {PAGE_SIZE}건까지만 표시합니다. 더 예전 문의는 상태 필터나 검색으로 좁혀 주세요.
                </p>
              )}
            </>
          )}
        </section>

        <aside className={panelClass}>
          {!selected ? (
            <p className="text-[13px] text-[var(--color-muted)]">목록에서 문의를 선택하면 상세가 표시됩니다.</p>
          ) : (
            <div className="space-y-5">
              <div>
                <p className="text-[11px] tracking-[0.14em] text-[var(--color-accent)]">문의 상세</p>
                <h2 className="mt-2 text-[18px] font-medium text-[var(--color-text)]">{selected.company_name}</h2>
                <p className="mt-1 text-[12px] break-all text-[var(--color-muted)]">ID {selected.id}</p>
              </div>

              <dl className="space-y-2.5 text-[13px]">
                <Field label="접수 시각" value={formatDateTime(selected.created_at)} />
                <Field label="담당자" value={selected.contact_name} />
                <Field
                  label="이메일"
                  value={selected.email}
                  action={<CopyButton value={selected.email} label="이메일" />}
                />
                <Field
                  label="연락처"
                  value={selected.phone ?? '—'}
                  action={selected.phone ? <CopyButton value={selected.phone} label="연락처" /> : undefined}
                />
                <Field label="관심 분야" value={selected.interest_area ?? '—'} />
                <Field label="개인정보 동의" value={`${formatDateTime(selected.privacy_consent_at)} · ${selected.privacy_policy_version}`} />
                <Field label="유입 페이지" value={selected.source_page} />
                <Field
                  label="UTM"
                  value={
                    [selected.utm_source, selected.utm_medium, selected.utm_campaign].some(Boolean)
                      ? `source: ${selected.utm_source ?? '—'} / medium: ${selected.utm_medium ?? '—'} / campaign: ${selected.utm_campaign ?? '—'}`
                      : '—'
                  }
                />
                <Field
                  label="Discord 알림"
                  value={`${DISCORD_STATUS_LABELS[selected.discord_notification_status] ?? selected.discord_notification_status}${
                    selected.discord_notified_at ? ` · ${formatDateTime(selected.discord_notified_at)}` : ''
                  }`}
                />
                <Field label="최종 수정" value={formatDateTime(selected.updated_at)} />
              </dl>

              <div>
                <p className="text-[12px] text-[var(--color-muted)]">문의 내용</p>
                <p className="mt-2 border border-[var(--color-line)] bg-[var(--color-bg)] px-3 py-3 text-[13px] leading-relaxed whitespace-pre-wrap text-[var(--color-text)]">
                  {selected.message}
                </p>
              </div>

              <label className="block">
                <span className="text-[12px] text-[var(--color-muted)]">상태</span>
                <select
                  value={selected.status}
                  disabled={saving}
                  onChange={(e) => void patch(selected.id, { status: e.target.value as InquiryStatus })}
                  className={`${inputClass} mt-1.5`}
                >
                  {INQUIRY_STATUSES.map((s) => (
                    <option key={s} value={s}>{INQUIRY_STATUS_LABELS[s]}</option>
                  ))}
                </select>
              </label>

              <div>
                <label className="block">
                  <span className="text-[12px] text-[var(--color-muted)]">관리자 메모</span>
                  <textarea
                    value={memoDraft}
                    rows={5}
                    disabled={saving}
                    onChange={(e) => setMemoEdit({ inquiryId: selected.id, text: e.target.value })}
                    className={`${inputClass} mt-1.5`}
                  />
                </label>
                <button
                  type="button"
                  disabled={saving || memoDraft === storedMemo}
                  onClick={() => void patch(selected.id, { admin_memo: memoDraft.trim() ? memoDraft : null })}
                  className={`${primaryButtonClass} mt-2.5`}
                >
                  {saving ? '저장 중…' : '메모 저장'}
                </button>
              </div>

              {visibleNote && <p role="status" className="text-[12px] text-[var(--color-muted)]">{visibleNote}</p>}
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}

function Field({ label, value, action }: { label: string; value: string; action?: React.ReactNode }) {
  return (
    <div className="flex items-start justify-between gap-3 border-b border-[var(--color-line)]/40 pb-2.5">
      <dt className="shrink-0 text-[12px] text-[var(--color-muted)]">{label}</dt>
      <dd className="flex min-w-0 items-center gap-2 text-right">
        <span className="min-w-0 break-all text-[var(--color-text)]">{value}</span>
        {action}
      </dd>
    </div>
  );
}
