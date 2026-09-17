'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

const SESSION_KEY = 'humease_session_id';

function getSessionId(): string {
  try {
    let id = sessionStorage.getItem(SESSION_KEY);
    if (!id) {
      id = crypto.randomUUID();
      sessionStorage.setItem(SESSION_KEY, id);
    }
    return id;
  } catch {
    // sessionStorage 접근 불가(프라이버시 모드 등) — 임시 세션 값
    return crypto.randomUUID();
  }
}

/**
 * 익명 페이지뷰 로깅. /admin/**, localhost, preview 배포에서는 전송하지 않는다(원본 §3-14).
 * 전체 IP·UA 원문·전체 query string 은 저장하지 않는다 — log-page-view Edge Function 참고.
 */
export function PageViewTracker() {
  const pathname = usePathname();

  useEffect(() => {
    if (process.env.NEXT_PUBLIC_SITE_DEPLOY_TARGET !== 'production') return;
    if (typeof window === 'undefined') return;
    if (window.location.hostname === 'localhost') return;
    if (pathname?.startsWith('/admin')) return;

    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    if (!url || !anonKey) return;

    const params = new URLSearchParams(window.location.search);
    const landingKey = 'humease_landing_path';
    let landingPath: string;
    try {
      landingPath = sessionStorage.getItem(landingKey) ?? pathname ?? '/';
      if (!sessionStorage.getItem(landingKey)) sessionStorage.setItem(landingKey, landingPath);
    } catch {
      landingPath = pathname ?? '/';
    }

    fetch(`${url}/functions/v1/log-page-view`, {
      method: 'POST',
      // x-region: Supabase 공식 Edge Function 리전 지정 헤더. Tokyo(ap-northeast-1)를
      // 명시해 개인정보처리방침 제6조 국외이전 고지와 실제 처리 리전을 일치시킨다.
      headers: {
        'content-type': 'application/json',
        apikey: anonKey,
        authorization: `Bearer ${anonKey}`,
        'x-region': 'ap-northeast-1',
      },
      body: JSON.stringify({
        session_id: getSessionId(),
        path: pathname,
        landing_path: landingPath,
        referrer: document.referrer || undefined,
        utm_source: params.get('utm_source') ?? undefined,
        utm_medium: params.get('utm_medium') ?? undefined,
        utm_campaign: params.get('utm_campaign') ?? undefined,
      }),
      keepalive: true,
    }).catch(() => { /* 분석 실패가 페이지 이용을 막지 않는다 */ });
  }, [pathname]);

  return null;
}
