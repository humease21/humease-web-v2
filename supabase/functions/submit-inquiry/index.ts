// Supabase Edge Function: submit-inquiry
// 흐름: 입력 검증 → DB INSERT(먼저) → Discord Webhook 시도 → 실패해도 사용자에게는 success
// 2026-09-18: HUMEASE_DISCORD_WEBHOOK_URL secret 등록·실 문의 1건으로 종단 검증 완료
// (discord_notification_status: sent, 테스트 행은 검증 직후 삭제). Discord Webhook 은
// 내친구 케이(K-Bestie)와 같은 채널이지만 이름 "휴미즈(앱)" + HUMEASE 아이콘 아바타의
// 별도 Webhook — 기존 K-Bestie DISCORD_WEBHOOK_URL secret 은 건드리지 않았다.
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
    // x-region: supabase-js 의 FunctionInvokeOptions.region(Tokyo 명시 호출)이 자동으로
    // 붙이는 헤더다. CORS preflight 허용 목록에 없으면 브라우저가 실제 POST 를 막는다
    // (curl 은 CORS 를 적용하지 않아 이 문제가 로컬 검증에서는 드러나지 않았다).
    'Access-Control-Allow-Headers': 'content-type, apikey, authorization, x-region, x-client-info',
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

/**
 * Discord 는 알림 채널일 뿐이다 — Source of Truth 는 DB.
 * 개인정보처리방침 제4조: "신규 문의 알림을 위해 사용하는 외부 메신저에는 담당자명, 이메일,
 * 전화번호, 회사명, 문의 내용 또는 문의 식별번호 등 문의자를 식별할 수 있는 정보를
 * 전송하지 않는다." company_name/contact_name/email/phone/message/id 는 어떤 것도
 * payload 에 넣지 않는다 — interest_area·접수 시간처럼 개인을 특정할 수 없는 값만 보낸다.
 * 상세는 관리자 페이지(RLS + Google OAuth 인증 뒤)에서 최신순으로 확인한다.
 *
 * 이 채널은 내친구 케이(K-Bestie) 알림과 같은 Discord 채널을 쓰지만, Webhook 은
 * HUMEASE 전용(HUMEASE_DISCORD_WEBHOOK_URL)이다 — 이름 "휴미즈(앱)", HUMEASE
 * 아이콘 아바타로 Discord UI 에서 K-Bestie 알림과 구분된다.
 */
const KST_TIME_FORMAT = new Intl.DateTimeFormat('ko-KR', {
  timeZone: 'Asia/Seoul',
  year: 'numeric', month: '2-digit', day: '2-digit',
  hour: '2-digit', minute: '2-digit', hour12: false,
});

async function notifyDiscord(webhookUrl: string, inquiry: { interestArea?: string; createdAt: string }) {
  const payload = {
    content: null,
    allowed_mentions: { parse: [] as string[] },
    embeds: [{
      title: 'HUMEASE 새 문의 접수',
      description: '관리자 페이지(/admin/inquiries)에서 최신순으로 확인해 주세요.',
      color: 0xc7b99d,
      fields: [
        { name: '유형', value: '홈페이지 문의', inline: true },
        { name: '관심 분야', value: inquiry.interestArea ?? '미선택', inline: true },
        { name: '접수 시간', value: `${KST_TIME_FORMAT.format(new Date(inquiry.createdAt))} (KST)`, inline: false },
      ],
    }],
  };

  const res = await fetch(webhookUrl, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(payload),
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
    .select('id, interest_area, created_at')
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
      await notifyDiscord(discordWebhookUrl, { interestArea: inserted.interest_area ?? undefined, createdAt: inserted.created_at });
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
