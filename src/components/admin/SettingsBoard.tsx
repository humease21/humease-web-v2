'use client';

import { useCallback, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { SITE_SETTINGS_ID, type HumeaseSiteSettings } from '@/lib/admin/types';
import { formatDateTime } from '@/lib/admin/format';
import { useAsyncEffect } from '@/lib/admin/use-async-effect';
import {
  ErrorNote, Spinner, buttonClass, inputClass, panelClass, primaryButtonClass,
} from './ui';

/**
 * 사이트 설정. 단일 행(`id = 'default'`)만 다룬다.
 *
 * **Discord Webhook URL, Service Role Key, Supabase Secret 을 표시하거나 수정하는 UI 를 두지 않는다**
 * (원본 §3-18). 이 값들은 Supabase Secrets 에만 있고 브라우저로 내려오지 않는다.
 *
 * SNS 링크는 jsonb 객체(라벨 → URL)로 저장한다. 라벨이 비어 있는 행은 저장하지 않는다.
 */

type SnsRow = { label: string; url: string };

const toRows = (links: Record<string, string> | null | undefined): SnsRow[] =>
  Object.entries(links ?? {}).map(([label, url]) => ({ label, url }));

export function SettingsBoard() {
  const [saved, setSaved] = useState<HumeaseSiteSettings | null>(null);
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [sns, setSns] = useState<SnsRow[]>([]);
  const [inquiryEnabled, setInquiryEnabled] = useState(true);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [note, setNote] = useState<string | null>(null);

  const apply = (row: HumeaseSiteSettings) => {
    setSaved(row);
    setEmail(row.contact_email ?? '');
    setPhone(row.contact_phone ?? '');
    setSns(toRows(row.sns_links));
    setInquiryEnabled(row.inquiry_enabled);
  };

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const supabase = createClient();
      const { data, error: queryError } = await supabase
        .from('humease_site_settings')
        .select('*')
        .eq('id', SITE_SETTINGS_ID)
        .maybeSingle();
      if (queryError) throw queryError;
      // 기본 행은 마이그레이션이 만들어 둔다. 없더라도 저장 시 upsert 로 생성된다.
      if (data) apply(data as HumeaseSiteSettings);
    } catch {
      setError('사이트 설정을 불러오지 못했습니다.');
    } finally {
      setLoading(false);
    }
  }, []);

  useAsyncEffect(load);

  const save = async () => {
    setSaving(true);
    setNote(null);
    try {
      const snsLinks: Record<string, string> = {};
      for (const row of sns) {
        const label = row.label.trim();
        const url = row.url.trim();
        if (label && url) snsLinks[label] = url;
      }

      const supabase = createClient();
      const { data, error: upsertError } = await supabase
        .from('humease_site_settings')
        .upsert({
          id: SITE_SETTINGS_ID,
          contact_email: email.trim() || null,
          contact_phone: phone.trim() || null,
          sns_links: snsLinks,
          inquiry_enabled: inquiryEnabled,
          updated_at: new Date().toISOString(),
        }, { onConflict: 'id' })
        .select('*')
        .single();
      if (upsertError) throw upsertError;
      apply(data as HumeaseSiteSettings);
      setNote('저장했습니다.');
    } catch {
      setNote('저장에 실패했습니다. 권한과 네트워크를 확인해 주세요.');
    } finally {
      setSaving(false);
    }
  };

  const updateSns = (index: number, changes: Partial<SnsRow>) =>
    setSns((current) => current.map((row, i) => (i === index ? { ...row, ...changes } : row)));

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-[24px] font-medium text-[var(--color-text)]">사이트 설정</h1>
        <button type="button" onClick={() => void load()} className={buttonClass}>새로고침</button>
      </div>

      <div className="border border-[var(--color-line)] bg-[var(--color-surface)] px-4 py-4 text-[13px] leading-relaxed text-[var(--color-muted)]">
        <p className="text-[var(--color-text)]">여기에 저장한 값은 관리자 DB 에만 반영됩니다.</p>
        <p className="mt-2">
          공개 사이트의 연락처·문의 폼 노출은 아직 코드가 단일 출처입니다
          (<code className="text-[12px]">src/content/company.ts</code>, <code className="text-[12px]">src/content/contact.ts</code>).
          연동 적용은 이후 작업입니다.
        </p>
        <p className="mt-2">
          Discord Webhook, Service Role Key 등 비밀값은 이 화면에서 다루지 않습니다. Supabase Secrets 에만 둡니다.
        </p>
      </div>

      {error && <ErrorNote message={error} />}

      {loading ? (
        <Spinner label="불러오는 중…" />
      ) : (
        <div className="space-y-4">
          <section className={panelClass}>
            <h2 className="text-[13px] font-semibold text-[var(--color-text)]">대표 연락처</h2>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <label className="block">
                <span className="text-[12px] text-[var(--color-muted)]">대표 이메일</span>
                <input
                  type="email"
                  value={email}
                  maxLength={200}
                  placeholder="contact@example.com"
                  onChange={(e) => setEmail(e.target.value)}
                  className={`${inputClass} mt-1.5`}
                />
              </label>
              <label className="block">
                <span className="text-[12px] text-[var(--color-muted)]">대표 전화</span>
                <input
                  type="tel"
                  value={phone}
                  maxLength={30}
                  placeholder="02-0000-0000"
                  onChange={(e) => setPhone(e.target.value)}
                  className={`${inputClass} mt-1.5`}
                />
              </label>
            </div>
          </section>

          <section className={panelClass}>
            <h2 className="text-[13px] font-semibold text-[var(--color-text)]">SNS 링크</h2>
            <p className="mt-1 text-[12px] text-[var(--color-muted)]">라벨과 URL 을 모두 채운 항목만 저장됩니다.</p>
            <div className="mt-4 space-y-2.5">
              {sns.length === 0 && (
                <p className="text-[13px] text-[var(--color-muted)]">등록된 링크가 없습니다.</p>
              )}
              {sns.map((row, index) => (
                <div key={index} className="flex flex-wrap items-center gap-2">
                  <input
                    type="text"
                    value={row.label}
                    maxLength={30}
                    placeholder="라벨 (예: 블로그)"
                    onChange={(e) => updateSns(index, { label: e.target.value })}
                    className={`${inputClass} w-[160px]`}
                  />
                  <input
                    type="url"
                    value={row.url}
                    maxLength={500}
                    placeholder="https://"
                    onChange={(e) => updateSns(index, { url: e.target.value })}
                    className={`${inputClass} min-w-[200px] flex-1`}
                  />
                  <button
                    type="button"
                    onClick={() => setSns((current) => current.filter((_, i) => i !== index))}
                    className={buttonClass}
                  >
                    삭제
                  </button>
                </div>
              ))}
            </div>
            <button
              type="button"
              onClick={() => setSns((current) => [...current, { label: '', url: '' }])}
              className={`${buttonClass} mt-3`}
            >
              링크 추가
            </button>
          </section>

          <section className={panelClass}>
            <h2 className="text-[13px] font-semibold text-[var(--color-text)]">문의 접수</h2>
            <label className="mt-4 flex items-center gap-2 text-[13px] text-[var(--color-text)]">
              <input
                type="checkbox"
                checked={inquiryEnabled}
                onChange={(e) => setInquiryEnabled(e.target.checked)}
              />
              문의 접수 활성화
            </label>
          </section>

          <div className="flex flex-wrap items-center gap-3">
            <button type="button" disabled={saving} onClick={() => void save()} className={primaryButtonClass}>
              {saving ? '저장 중…' : '설정 저장'}
            </button>
            <span className="text-[12px] text-[var(--color-muted)]">
              {saved ? `최종 저장 ${formatDateTime(saved.updated_at)}` : '저장된 설정 없음'}
            </span>
            {note && <span role="status" className="text-[12px] text-[var(--color-muted)]">{note}</span>}
          </div>
        </div>
      )}
    </div>
  );
}
