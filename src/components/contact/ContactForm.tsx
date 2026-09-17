'use client';

import { useEffect, useRef, useState } from 'react';
import { createClient } from '@/lib/supabase/client';

/**
 * 실제 문의 접수 폼. `submit-inquiry` Supabase Edge Function을 호출한다.
 * DB INSERT 가 Source of Truth 이며, Discord 알림 실패는 사용자에게 노출하지 않는다.
 *
 * 이 컴포넌트는 CONTACT_MODE === 'live' 일 때만 렌더한다(src/content/contact.ts).
 * 'disabled' 인 동안은 이 파일을 import 하지 않는다 — 개인정보처리방침 승인 전까지는
 * 코드가 준비돼 있어도 화면에 노출하지 않는다(기존 방침 유지).
 */

const INTEREST_AREAS = [
  'Enterprise Data', 'eDiscovery', '내부 통제', 'Exchange 아카이빙',
  'Arctera 솔루션', 'AI/AX', 'AI 서비스 개발', '기타',
] as const;

type FormStatus = 'idle' | 'validating' | 'submitting' | 'success' | 'error';

export function ContactForm({ sourcePage }: { sourcePage: string }) {
  const [status, setStatus] = useState<FormStatus>('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const renderedAt = useRef<number | null>(null);
  const submitLock = useRef(false);
  useEffect(() => { renderedAt.current = Date.now(); }, []);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (submitLock.current) return;

    setStatus('validating');
    const form = e.currentTarget;
    const data = new FormData(form);

    const companyName = String(data.get('company_name') ?? '').trim();
    const contactName = String(data.get('contact_name') ?? '').trim();
    const email = String(data.get('email') ?? '').trim();
    const message = String(data.get('message') ?? '').trim();
    const privacyConsent = data.get('privacy_consent') === 'on';

    if (!companyName || !contactName || !email || !message || !privacyConsent) {
      setStatus('error');
      setErrorMessage('필수 항목을 모두 입력하고 개인정보 수집·이용에 동의해 주세요');
      return;
    }

    submitLock.current = true;
    setStatus('submitting');

    const params = new URLSearchParams(window.location.search);

    try {
      const supabase = createClient();
      const { data: result, error } = await supabase.functions.invoke('submit-inquiry', {
        body: {
          company_name: companyName,
          contact_name: contactName,
          email,
          phone: String(data.get('phone') ?? '').trim() || undefined,
          interest_area: String(data.get('interest_area') ?? '').trim() || undefined,
          message,
          privacy_consent: true,
          source_page: sourcePage,
          utm_source: params.get('utm_source') ?? undefined,
          utm_medium: params.get('utm_medium') ?? undefined,
          utm_campaign: params.get('utm_campaign') ?? undefined,
          website: String(data.get('website') ?? ''), // honeypot
          form_rendered_at: renderedAt.current ?? Date.now(),
        },
      });

      if (error || !result?.ok) {
        throw new Error(error?.message ?? 'submit failed');
      }

      setStatus('success');
      form.reset();
    } catch {
      setStatus('error');
      setErrorMessage('접수에 실패했습니다. 잠시 후 다시 시도하거나 이메일로 연락해 주세요');
    } finally {
      submitLock.current = false;
    }
  }

  if (status === 'success') {
    return (
      <div>
        <p className="title-ko-sm mt-6">문의가 접수되었습니다</p>
        <p className="lead measure mt-4">확인 후 연락드리겠습니다</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="mt-8 grid max-w-[560px] gap-5">
      {/* honeypot — 화면에서 숨기되 스크린리더에는 노출하지 않는다 */}
      <input type="text" name="website" tabIndex={-1} autoComplete="off"
        className="absolute left-[-9999px]" aria-hidden="true" />

      <label className="grid gap-1.5 text-[14px]">
        회사명 *
        <input name="company_name" required maxLength={100}
          className="border border-[var(--color-line)] bg-transparent px-3 py-2.5" />
      </label>
      <label className="grid gap-1.5 text-[14px]">
        담당자명 *
        <input name="contact_name" required maxLength={50}
          className="border border-[var(--color-line)] bg-transparent px-3 py-2.5" />
      </label>
      <label className="grid gap-1.5 text-[14px]">
        이메일 *
        <input type="email" name="email" required maxLength={200}
          className="border border-[var(--color-line)] bg-transparent px-3 py-2.5" />
      </label>
      <label className="grid gap-1.5 text-[14px]">
        연락처
        <input name="phone" maxLength={30}
          className="border border-[var(--color-line)] bg-transparent px-3 py-2.5" />
      </label>
      <label className="grid gap-1.5 text-[14px]">
        관심 분야
        <select name="interest_area" defaultValue=""
          className="border border-[var(--color-line)] bg-transparent px-3 py-2.5">
          <option value="" />
          {INTEREST_AREAS.map((a) => <option key={a} value={a}>{a}</option>)}
        </select>
      </label>
      <label className="grid gap-1.5 text-[14px]">
        문의 내용 *
        <textarea name="message" required maxLength={4000} rows={6}
          className="border border-[var(--color-line)] bg-transparent px-3 py-2.5" />
      </label>
      <label className="flex items-start gap-2 text-[13px] text-[var(--color-muted)]">
        <input type="checkbox" name="privacy_consent" required className="mt-0.5" />
        개인정보 수집·이용에 동의합니다
      </label>

      {status === 'error' && errorMessage && (
        <p role="alert" className="text-[13px] text-[var(--color-accent)]">{errorMessage}</p>
      )}

      <button type="submit" disabled={status === 'submitting' || status === 'validating'}
        className="cta-primary mt-2 disabled:opacity-50">
        {status === 'submitting' ? '접수 중…' : '문의 보내기'}
      </button>

      <p className="text-[12px] text-[var(--color-muted)]">
        초기 문의에는 비밀번호, 개인정보 원문, 실제 고객 데이터 등 민감한 자료를 보내지 마세요
      </p>
    </form>
  );
}
