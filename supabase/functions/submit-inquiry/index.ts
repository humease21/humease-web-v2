// Supabase Edge Function: submit-inquiry
// 흐름: 입력 검증 → DB INSERT(먼저) → Discord Webhook 시도 → 실패해도 사용자에게는 success
// 배포는 이 저장소 CLI 계정에 프로젝트(cgydvjqhsllpeuxbephb) 접근 권한이 없어 현재 불가.
// 배포 명령(권한 확보 후): supabase functions deploy submit-inquiry --project-ref cgydvjqhsllpeuxbephb
// 필요 Secret: HUMEASE_DISCORD_WEBHOOK_URL, PRIVACY_POLICY_VERSION (없으면 기본값 'v1' 사용)
// SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY 는 Supabase가 Edge Function 런타임에 자동 주입한다.

import { createClient } from 'jsr:@supabase/supabase-js@2';

const ALLOWED_INTEREST_AREAS = [
  'Enterprise Data', 'eDiscovery', '내부 통제', 'Exchange 아카이빙',
  'Arctera 솔루션', 'AI/AX', 'AI 서비스 개발', '기타',
];

const ALLOWED_ORIGINS = new Set([
  'https://www.humease.com',
  'https://humease21.github.io',
]);

type InquiryPayload = {
  company_name: string;
  contact_name: string;
  email: string;
  phone?: string;
  interest_area?: string;
  message: string;
  privacy_consent: boolean;
  source_page: string;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  // 스팸 방지 — 실제 사용자는 채우지 않는 honeypot 필드
  website?: string;
  // 페이지 진입 시각(ms epoch). 서버에서 너무 빠른 제출을 판별한다.
  form_rendered_at?: number;
};

function corsHeaders(origin: string | null) {
  const allow = origin && ALLOWED_ORIGINS.has(origin) ? origin : '';
  return {
    'Access-Control-Allow-Origin': allow,
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'content-type, apikey, authorization',
    Vary: 'Origin',
  };
}

function badRequest(message: string, origin: string | null) {
  return new Response(JSON.stringify({ ok: false, error: message }), {
    status: 400,
    headers: { 'content-type': 'application/json', ...corsHeaders(origin) },
  });
}

const isValidEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) && v.length <= 200;

function validate(body: unknown, origin: string | null): { ok: true; data: InquiryPayload } | { ok: false; res: Response } {
  if (typeof body !== 'object' || body === null) {
    return { ok: false, res: badRequest('invalid body', origin) };
  }
  const b = body as Record<string, unknown>;

  // honeypot — 채워져 있으면 스팸으로 간주. 실패를 노출하지 않고 조용히 성공처럼 응답한다.
  if (typeof b.website === 'string' && b.website.trim() !== '') {
    return { ok: false, res: new Response(JSON.stringify({ ok: true }), { status: 200, headers: { 'content-type': 'application/json', ...corsHeaders(origin) } }) };
  }

  // 페이지 진입 후 비정상적으로 빠른 제출(3초 미만) 차단
  if (typeof b.form_rendered_at === 'number' && Date.now() - b.form_rendered_at < 3000) {
    return { ok: false, res: badRequest('too fast', origin) };
  }

  const companyName = typeof b.company_name === 'string' ? b.company_name.trim() : '';
  const contactName = typeof b.contact_name === 'string' ? b.contact_name.trim() : '';
  const email = typeof b.email === 'string' ? b.email.trim() : '';
  const message = typeof b.message === 'string' ? b.message.trim() : '';
  const phone = typeof b.phone === 'string' ? b.phone.trim() : undefined;
  const interestArea = typeof b.interest_area === 'string' ? b.interest_area.trim() : undefined;
  const sourcePage = typeof b.source_page === 'string' ? b.source_page.trim().slice(0, 200) : '/contact';
  const privacyConsent = b.privacy_consent === true;

  if (companyName.length < 1 || companyName.length > 100) return { ok: false, res: badRequest('company_name', origin) };
  if (contactName.length < 1 || contactName.length > 50) return { ok: false, res: badRequest('contact_name', origin) };
  if (!isValidEmail(email)) return { ok: false, res: badRequest('email', origin) };
  if (message.length < 1 || message.length > 4000) return { ok: false, res: badRequest('message', origin) };
  if (phone && phone.length > 30) return { ok: false, res: badRequest('phone', origin) };
  if (interestArea && !ALLOWED_INTEREST_AREAS.includes(interestArea)) return { ok: false, res: badRequest('interest_area', origin) };
  if (!privacyConsent) return { ok: false, res: badRequest('privacy_consent', origin) };

  const utmSource = typeof b.utm_source === 'string' ? b.utm_source.slice(0, 100) : undefined;
  const utmMedium = typeof b.utm_medium === 'string' ? b.utm_medium.slice(0, 100) : undefined;
  const utmCampaign = typeof b.utm_campaign === 'string' ? b.utm_campaign.slice(0, 100) : undefined;

  return {
    ok: true,
    data: {
      company_name: companyName,
      contact_name: contactName,
      email,
      phone,
      interest_area: interestArea,
      message,
      privacy_consent: true,
      source_page: sourcePage,
      utm_source: utmSource,
      utm_medium: utmMedium,
      utm_campaign: utmCampaign,
    },
  };
}

async function notifyDiscord(webhookUrl: string, inquiry: { id: string; company_name: string; contact_name: string; interest_area?: string; message: string; created_at: string }) {
  const summary = inquiry.message.length > 100 ? `${inquiry.message.slice(0, 100)}…` : inquiry.message;
  const content = [
    '[HUMEASE 새 문의]',
    '',
    `회사명: ${inquiry.company_name}`,
    `담당자: ${inquiry.contact_name}`,
    `관심 분야: ${inquiry.interest_area ?? '미선택'}`,
    `문의 요약: ${summary}`,
    `문의 ID: ${inquiry.id}`,
    `접수 시각: ${inquiry.created_at}`,
  ].join('\n');

  const res = await fetch(webhookUrl, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ content }),
  });
  if (!res.ok) throw new Error(`discord webhook ${res.status}`);
}

Deno.serve(async (req) => {
  const origin = req.headers.get('origin');

  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: corsHeaders(origin) });
  }
  if (req.method !== 'POST') {
    return badRequest('method not allowed', origin);
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return badRequest('invalid json', origin);
  }

  const validated = validate(body, origin);
  if (!validated.ok) return validated.res;

  const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
  const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
  const discordWebhookUrl = Deno.env.get('HUMEASE_DISCORD_WEBHOOK_URL');
  const privacyPolicyVersion = Deno.env.get('PRIVACY_POLICY_VERSION') ?? 'v1';

  // service_role 로만 INSERT 한다 — anon 에게는 INSERT 정책조차 주지 않는다(마이그레이션 참고).
  const supabase = createClient(supabaseUrl, serviceRoleKey);

  const nowIso = new Date().toISOString();
  const { data: inserted, error: insertError } = await supabase
    .from('humease_inquiries')
    .insert({
      ...validated.data,
      privacy_consent_at: nowIso,
      privacy_policy_version: privacyPolicyVersion,
    })
    .select('id, created_at, company_name, contact_name, interest_area, message')
    .single();

  // DB 실패 — Discord 는 시도하지 않는다. 사용자에게는 error.
  if (insertError || !inserted) {
    console.error('humease_inquiries insert failed', insertError);
    return new Response(JSON.stringify({ ok: false, error: 'db_insert_failed' }), {
      status: 500,
      headers: { 'content-type': 'application/json', ...corsHeaders(origin) },
    });
  }

  // DB 성공 — 이 시점부터는 Discord 가 실패해도 사용자에게는 항상 success.
  let discordStatus: 'sent' | 'failed' | 'pending' = 'pending';
  if (discordWebhookUrl) {
    try {
      await notifyDiscord(discordWebhookUrl, inserted);
      discordStatus = 'sent';
    } catch (err) {
      console.error('discord notify failed', err);
      discordStatus = 'failed';
    }
  }

  await supabase
    .from('humease_inquiries')
    .update({
      discord_notification_status: discordStatus,
      discord_notified_at: discordStatus === 'sent' ? new Date().toISOString() : null,
    })
    .eq('id', inserted.id);

  return new Response(JSON.stringify({ ok: true, id: inserted.id }), {
    status: 200,
    headers: { 'content-type': 'application/json', ...corsHeaders(origin) },
  });
});
