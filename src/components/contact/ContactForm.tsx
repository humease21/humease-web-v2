'use client';

import { useEffect, useId, useRef, useState } from 'react';
import { FunctionRegion } from '@supabase/supabase-js';
import { createClient } from '@/lib/supabase/client';
import { Modal } from '@/components/ui/Modal';
import { A } from '@/components/ui/Link';

/**
 * 실제 문의 접수 폼. `submit-inquiry` Supabase Edge Function을 호출한다.
 * DB INSERT 가 Source of Truth 이며, Discord 알림 실패는 사용자에게 노출하지 않는다.
 *
 * 이 컴포넌트는 CONTACT_MODE === 'live' 일 때만 렌더한다(src/content/contact.ts).
 * 'disabled' 인 동안은 이 파일을 import 하지 않는다.
 *
 * Edge Function 은 `region: FunctionRegion.ApNortheast1` 로 Tokyo 리전을 명시 호출한다
 * (개인정보처리방침 제6조 국외이전 고지와 일치시킨다 — Supabase 기본 라우팅에 맡기지 않는다).
 *
 * 동의문은 「프로젝트 문의 개인정보 수집·이용 동의문」 V1.1(2026-09-18, Discord 알림 조항
 * 추가로 V1.0 에서 개정)을 그대로 옮긴다. 모달을 열람하는 것 자체는 동의가 아니다 —
 * 체크박스 상태만 동의 여부를 결정한다.
 */

const INTEREST_AREAS = [
  'Enterprise Data', 'eDiscovery', '내부 통제', 'Exchange 아카이빙',
  'Arctera 솔루션', 'AI/AX', 'AI 서비스 개발', '기타',
] as const;

type FormStatus = 'idle' | 'validating' | 'submitting' | 'success' | 'error';

export function ContactForm({ sourcePage }: { sourcePage: string }) {
  const [status, setStatus] = useState<FormStatus>('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [consented, setConsented] = useState(false);
  const [consentModalOpen, setConsentModalOpen] = useState(false);
  const consentTitleId = useId();
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
        region: FunctionRegion.ApNortheast1,
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
        <p role="status" className="heading-lg mt-6">문의가 접수되었습니다</p>
        <p className="body mt-2">확인 후 연락드리겠습니다</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="relative mt-6 grid gap-5 sm:grid-cols-2">
      {/* honeypot — 화면에서 숨기되 스크린리더에는 노출하지 않는다 */}
      <input type="text" name="website" tabIndex={-1} autoComplete="off"
        className="absolute left-[-9999px] h-px w-px" aria-hidden="true" />

      <label className="field">
        회사명 *
        <input name="company_name" required maxLength={100} autoComplete="organization"
          className="field-control" />
      </label>
      <label className="field">
        담당자명 *
        <input name="contact_name" required maxLength={50} autoComplete="name"
          className="field-control" />
      </label>
      <label className="field">
        이메일 *
        <input type="email" name="email" required maxLength={200} autoComplete="email"
          className="field-control" />
      </label>
      <label className="field">
        연락처
        <input name="phone" type="tel" maxLength={30} autoComplete="tel"
          className="field-control" />
      </label>
      <label className="field sm:col-span-2">
        관심 분야
        <select name="interest_area" defaultValue=""
          className="field-control">
          <option value="">선택해 주세요</option>
          {INTEREST_AREAS.map((a) => <option key={a} value={a}>{a}</option>)}
        </select>
      </label>
      <label className="field sm:col-span-2">
        문의 내용 *
        <textarea name="message" required maxLength={4000} rows={6}
          className="field-control" />
      </label>
      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[15px] text-[var(--color-body)] sm:col-span-2">
        <label className="flex min-h-11 cursor-pointer items-center gap-3">
          <input
            type="checkbox"
            name="privacy_consent"
            required
            checked={consented}
            onChange={(e) => setConsented(e.target.checked)}
            className="h-5 w-5 shrink-0 accent-[var(--color-text)]"
          />
          개인정보 수집·이용에 동의합니다.
        </label>
        <button
          type="button"
          onClick={() => setConsentModalOpen(true)}
          className="min-h-11 font-semibold text-[var(--color-text)] underline underline-offset-4"
        >
          내용 보기
        </button>
        {/* 임시 축소 운영 중 푸터에 이용약관 링크가 없으므로 동의 영역에서 두 문서를 모두 열람할 수 있게 한다. 새 탭 — 입력 중인 내용을 잃지 않는다. */}
        <p className="flex w-full flex-wrap items-center gap-x-4 text-[14px] text-[var(--color-muted)]">
          <A href="/privacy" target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center underline underline-offset-4 hover:text-[var(--color-text)]">
            개인정보처리방침<span className="sr-only">(새 탭에서 열림)</span>
          </A>
          <A href="/terms" target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center underline underline-offset-4 hover:text-[var(--color-text)]">
            이용약관<span className="sr-only">(새 탭에서 열림)</span>
          </A>
        </p>
      </div>

      <Modal open={consentModalOpen} onClose={() => setConsentModalOpen(false)} titleId={consentTitleId}>
        <div className="flex items-start justify-between gap-4 border-b border-[var(--color-line)] px-6 py-4">
          <h2 id={consentTitleId} className="text-[17px] font-semibold text-[var(--color-text)]">개인정보 수집·이용 동의</h2>
          <button
            type="button"
            autoFocus
            onClick={() => setConsentModalOpen(false)}
            aria-label="닫기"
            className="-mr-2 grid h-11 w-11 shrink-0 place-items-center text-[24px] leading-none text-[var(--color-muted)] transition-colors hover:text-[var(--color-text)]"
          >
            ×
          </button>
        </div>
        <div className="px-6 py-5 text-[15px] leading-relaxed text-[var(--color-body)]">
          <p>주식회사 휴미즈는 프로젝트 문의 접수와 상담을 위해 아래와 같이 개인정보를 수집·이용합니다.</p>

          <p className="mt-4 font-semibold text-[var(--color-text)]">수집·이용 목적</p>
          <ul className="mt-1.5 list-disc space-y-1 pl-5">
            <li>프로젝트 및 사업 문의 접수</li>
            <li>문의자 확인</li>
            <li>문의 내용 검토 및 답변</li>
            <li>후속 상담</li>
            <li>상담 이력 관리 및 분쟁 발생 시 사실관계 확인</li>
            <li>스팸 및 비정상적인 문의 방지</li>
          </ul>

          <p className="mt-4 font-semibold text-[var(--color-text)]">수집 항목</p>
          <p className="mt-1.5">필수: 회사명, 담당자명, 이메일 주소, 문의 내용</p>
          <p className="mt-1">선택: 연락처, 관심 분야</p>
          <p className="mt-1">
            문의 제출 시 자동 처리될 수 있는 정보: 문의 유입 페이지, UTM Source, UTM Medium, UTM Campaign, 폼 진입 시각, 개인정보 수집·이용 동의 일시
          </p>

          <p className="mt-4 font-semibold text-[var(--color-text)]">보유 및 이용기간</p>
          <p className="mt-1.5">문의 접수일로부터 3년간 보관한 후 파기합니다.</p>
          <p className="mt-1">다만 정보주체가 그 전에 삭제를 요청하고 관계 법령상 별도의 보존 의무가 없는 경우 지체 없이 삭제합니다.</p>

          <p className="mt-4 font-semibold text-[var(--color-text)]">동의 거부권 및 불이익</p>
          <p className="mt-1.5">귀하는 개인정보 수집·이용에 대한 동의를 거부할 권리가 있습니다.</p>
          <p className="mt-1">필수 개인정보의 수집·이용에 동의하지 않는 경우 홈페이지를 통한 프로젝트 문의 접수가 불가능합니다.</p>
          <p className="mt-1">연락처와 관심 분야 등 선택 항목은 입력하지 않아도 문의를 접수할 수 있으며, 선택 항목 미제공에 따른 불이익은 없습니다.</p>

          <p className="mt-4">
            문의 처리 시스템 운영을 위해 문의정보는 일본 도쿄 지역의 Supabase 인프라를 통해 처리·보관될 수 있습니다. 자세한 내용은{' '}
            <A href="/privacy" target="_blank" rel="noopener noreferrer" className="font-semibold text-[var(--color-text)] underline underline-offset-2">
              개인정보처리방침
            </A>
            의 「개인정보의 국외 이전」 항목에서 확인할 수 있습니다.
          </p>
          <p className="mt-3">
            신규 문의 발생을 관리자에게 알리기 위해 Discord 알림 서비스를 이용하며, 이때 회사명, 담당자명, 관심 분야, 문의 내용의 일부(최대 20자)가 전송됩니다. 이메일 주소, 전화번호, 문의 내용 전문은 전송되지 않습니다.
          </p>
        </div>
      </Modal>

      {status === 'error' && errorMessage && (
        <p role="alert" className="rounded-lg border border-[#E7B4AE] bg-[#FDF3F2] px-4 py-3 text-[15px] text-[#9B2C20] sm:col-span-2">{errorMessage}</p>
      )}

      <button type="submit" disabled={!consented || status === 'submitting' || status === 'validating'}
        className="btn btn-primary w-full disabled:cursor-not-allowed disabled:opacity-45 sm:col-span-2">
        {status === 'submitting' ? '접수 중…' : '문의 보내기'}
      </button>

      <p className="caption sm:col-span-2">
        초기 문의에는 비밀번호, 개인정보 원문, 실제 고객 데이터 등 민감한 자료를 보내지 마세요
      </p>
    </form>
  );
}
