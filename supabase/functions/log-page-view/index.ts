// Supabase Edge Function: log-page-view
// 익명 세션 기준 페이지뷰 로깅. 전체 IP/UA 원문/전체 query string 은 저장하지 않는다.
// 배포: supabase functions deploy log-page-view --project-ref cgydvjqhsllpeuxbephb

import { createClient } from 'jsr:@supabase/supabase-js@2';

const ALLOWED_ORIGINS = new Set([
  'https://www.humease.com',
  'https://humease21.github.io',
]);

const UTM_MAX = 100;
const PATH_MAX = 300;

function corsHeaders(origin: string | null) {
  const allow = origin && ALLOWED_ORIGINS.has(origin) ? origin : '';
  return {
    'Access-Control-Allow-Origin': allow,
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    // x-region: 클라이언트가 Tokyo 리전을 명시하려고 보내는 헤더(PageViewTracker.tsx).
    // 허용 목록에 없으면 브라우저 CORS preflight 가 실제 POST 를 막는다.
    'Access-Control-Allow-Headers': 'content-type, apikey, authorization, x-region',
    Vary: 'Origin',
  };
}

function deviceTypeFromUA(ua: string): 'desktop' | 'mobile' | 'tablet' | 'other' {
  const s = ua.toLowerCase();
  if (/ipad|tablet/.test(s)) return 'tablet';
  if (/mobi|iphone|android/.test(s)) return 'mobile';
  if (s) return 'desktop';
  return 'other';
}

function browserFamilyFromUA(ua: string): string | null {
  const s = ua.toLowerCase();
  if (s.includes('edg/')) return 'Edge';
  if (s.includes('chrome/') && !s.includes('chromium')) return 'Chrome';
  if (s.includes('safari/') && !s.includes('chrome')) return 'Safari';
  if (s.includes('firefox/')) return 'Firefox';
  return null;
}

function osFamilyFromUA(ua: string): string | null {
  const s = ua.toLowerCase();
  if (s.includes('windows')) return 'Windows';
  if (s.includes('mac os')) return 'macOS';
  if (s.includes('android')) return 'Android';
  if (s.includes('iphone') || s.includes('ipad')) return 'iOS';
  if (s.includes('linux')) return 'Linux';
  return null;
}

Deno.serve(async (req) => {
  const origin = req.headers.get('origin');

  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: corsHeaders(origin) });
  }
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ ok: false }), { status: 405, headers: corsHeaders(origin) });
  }

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return new Response(JSON.stringify({ ok: false }), { status: 400, headers: corsHeaders(origin) });
  }

  const sessionId = typeof body.session_id === 'string' ? body.session_id.slice(0, 64) : null;
  const path = typeof body.path === 'string' ? body.path.slice(0, PATH_MAX) : null;
  if (!sessionId || !path) {
    return new Response(JSON.stringify({ ok: false }), { status: 400, headers: corsHeaders(origin) });
  }

  // /admin/** 은 수집하지 않는다(원본 §3-14)
  if (path.startsWith('/admin')) {
    return new Response(JSON.stringify({ ok: true, skipped: true }), { status: 200, headers: corsHeaders(origin) });
  }

  let referrerDomain: string | null = null;
  if (typeof body.referrer === 'string' && body.referrer) {
    try { referrerDomain = new URL(body.referrer).hostname.slice(0, 200); } catch { /* ignore invalid referrer */ }
  }

  const ua = req.headers.get('user-agent') ?? '';

  const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
  const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
  const supabase = createClient(supabaseUrl, serviceRoleKey);

  const { error } = await supabase.from('humease_page_views').insert({
    session_id: sessionId,
    path,
    landing_path: typeof body.landing_path === 'string' ? body.landing_path.slice(0, PATH_MAX) : null,
    referrer_domain: referrerDomain,
    utm_source: typeof body.utm_source === 'string' ? body.utm_source.slice(0, UTM_MAX) : null,
    utm_medium: typeof body.utm_medium === 'string' ? body.utm_medium.slice(0, UTM_MAX) : null,
    utm_campaign: typeof body.utm_campaign === 'string' ? body.utm_campaign.slice(0, UTM_MAX) : null,
    device_type: deviceTypeFromUA(ua),
    browser_family: browserFamilyFromUA(ua),
    os_family: osFamilyFromUA(ua),
  });

  if (error) {
    console.error('page_views insert failed', error);
    return new Response(JSON.stringify({ ok: false }), { status: 500, headers: corsHeaders(origin) });
  }

  return new Response(JSON.stringify({ ok: true }), { status: 200, headers: corsHeaders(origin) });
});
