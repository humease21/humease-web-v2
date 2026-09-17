'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { requireAdminOrSignOut } from '@/lib/supabase/auth';
import type { HumeaseAdminUser } from '@/lib/supabase/types';
import { Spinner } from './ui';

/**
 * `/admin/**` 진입 게이트.
 *
 * 정적 export 라 서버 미들웨어가 없다 — 관리자 HTML 자체는 누구나 받아갈 수 있다.
 * 따라서 이 컴포넌트는 "화면 감추기"이고, 실제 데이터 보호는 Supabase RLS 가 한다
 * (anon 은 humease_* 어떤 테이블도 읽지 못한다). 둘 중 하나만으로는 부족하다.
 *
 * `requireAdminOrSignOut()` 은 세션 존재 + humease_admin_users 조회를 모두 확인하고,
 * 관리자가 아니면 세션을 정리한다. 이메일을 코드에 하드코딩해 비교하지 않는다.
 */
export function AdminGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [admin, setAdmin] = useState<HumeaseAdminUser | null>(null);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    let alive = true;
    void (async () => {
      const result = await requireAdminOrSignOut().catch(() => null);
      if (!alive) return;
      setAdmin(result);
      setChecked(true);
      if (!result) router.replace('/admin/login');
    })();
    return () => { alive = false; };
  }, [router]);

  if (!checked) {
    return (
      <div className="flex min-h-[50svh] items-center justify-center">
        <Spinner label="권한을 확인하는 중…" />
      </div>
    );
  }

  if (!admin) {
    return (
      <div className="flex min-h-[50svh] items-center justify-center">
        <p className="text-[13px] text-[var(--color-muted)]">로그인 화면으로 이동합니다…</p>
      </div>
    );
  }

  return <>{children}</>;
}
