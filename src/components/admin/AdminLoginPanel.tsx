'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getCurrentAdmin, signInWithGoogle } from '@/lib/supabase/auth';
import { ErrorNote, Spinner, primaryButtonClass } from './ui';

/**
 * 로그인 화면. Google OAuth 단일 경로다 — 비밀번호 폼도 매직링크도 두지 않는다.
 *
 * Supabase 클라이언트는 `detectSessionInUrl` 기본값(true)으로 동작하므로,
 * OAuth 리다이렉트로 돌아온 직후 URL 의 토큰을 자동으로 흡수한다.
 * 그래서 마운트 시 `getCurrentAdmin()` 만 확인하면 되고, 해시를 직접 파싱하지 않는다.
 *
 * 이미 로그인 + 관리자면 `/admin` 으로 보낸다. 로그인은 됐지만 관리자가 아니면
 * `getCurrentAdmin()` 이 null 을 주고, 이 화면에 그대로 머문다.
 */
export function AdminLoginPanel() {
  const router = useRouter();
  const [checking, setChecking] = useState(true);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;
    void (async () => {
      const admin = await getCurrentAdmin().catch(() => null);
      if (!alive) return;
      if (admin) { router.replace('/admin'); return; }
      setChecking(false);
    })();
    return () => { alive = false; };
  }, [router]);

  const handleSignIn = async () => {
    setPending(true);
    setError(null);
    // basePath 가 붙은 배포에서도 실제로 열리는 주소여야 한다 — origin + 현재 경로의 /admin/ 로 만든다.
    const base = window.location.pathname.replace(/admin\/login\/?$/, 'admin/');
    const { error: authError } = await signInWithGoogle(`${window.location.origin}${base}`);
    if (authError) {
      setError('로그인을 시작하지 못했습니다. 잠시 후 다시 시도해 주세요.');
      setPending(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-5">
      <div className="w-full max-w-[360px] border border-[var(--color-line)] bg-[var(--color-surface)] px-6 py-8">
        <p className="text-[11px] tracking-[0.22em] text-[var(--color-accent)]">HUMEASE ADMIN</p>
        <h1 className="mt-4 text-[22px] font-medium text-[var(--color-text)]">관리자 로그인</h1>
        <p className="mt-3 text-[13px] leading-relaxed text-[var(--color-muted)]">
          등록된 관리자 계정만 접근할 수 있습니다. 로그인 후에도 권한이 확인되지 않으면 세션이 해제됩니다.
        </p>

        <div className="mt-7">
          {checking ? (
            <Spinner label="세션을 확인하는 중…" />
          ) : (
            <button
              type="button"
              onClick={() => void handleSignIn()}
              disabled={pending}
              className={`${primaryButtonClass} w-full py-3 text-[14px]`}
            >
              {pending ? '이동 중…' : 'Google로 로그인'}
            </button>
          )}
        </div>

        {error && <div className="mt-4"><ErrorNote message={error} /></div>}
      </div>
    </div>
  );
}
