import { createClient as createSupabaseClient } from '@supabase/supabase-js';

/**
 * 브라우저 전용 클라이언트. anon key 만 쓴다 — 공개 전제이며 RLS 로 보호된다.
 * service_role key 는 이 파일에 절대 두지 않는다(Edge Function 내부에서만 사용).
 *
 * `next.config.ts`의 `output:'export'`로 정적 사이트라 서버 런타임이 없다(GitHub Pages 배포).
 * `/admin/**`은 전부 Client Component 이며, 세션은 브라우저 localStorage 에 저장된다
 * (`@supabase/ssr`의 쿠키 기반 SSR 세션이 아니라 표준 `@supabase/supabase-js`를 쓰는 이유).
 */
export function createClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anonKey) {
    throw new Error('NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY 가 설정되지 않았다.');
  }
  return createSupabaseClient(url, anonKey);
}
