import { createClient } from './client';
import type { HumeaseAdminUser } from './types';

/**
 * 로그인된 세션이 실제 관리자인지 DB로 확인한다.
 * Google OAuth 인증 성공 ≠ 관리자 권한 — 이 함수가 최종 게이트다.
 * 이메일 문자열을 클라이언트 코드에 하드코딩해 비교하지 않는다.
 */
export async function getCurrentAdmin(): Promise<HumeaseAdminUser | null> {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data, error } = await supabase
    .from('humease_admin_users')
    .select('user_id, email, role, created_at')
    .eq('user_id', user.id)
    .maybeSingle();

  if (error || !data) return null;
  return data as HumeaseAdminUser;
}

/** 관리자가 아니면 세션을 정리한다. `/admin/**` 진입 시 서버·클라이언트 양쪽에서 호출한다. */
export async function requireAdminOrSignOut(): Promise<HumeaseAdminUser | null> {
  const admin = await getCurrentAdmin();
  if (!admin) {
    const supabase = createClient();
    await supabase.auth.signOut();
    return null;
  }
  return admin;
}

export async function signInWithGoogle(redirectTo: string) {
  const supabase = createClient();
  return supabase.auth.signInWithOAuth({
    provider: 'google',
    options: { redirectTo },
  });
}

export async function signOut() {
  const supabase = createClient();
  return supabase.auth.signOut();
}
