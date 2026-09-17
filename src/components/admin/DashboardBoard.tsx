'use client';

import { useCallback, useState } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import type { HumeaseInquiry } from '@/lib/supabase/types';
import { formatDateTime, formatNumber } from '@/lib/admin/format';
import { INQUIRY_STATUS_LABELS, inquiryStatusBadgeClass } from '@/lib/admin/inquiries';
import { resolvePeriod } from '@/lib/admin/period';
import { useAsyncEffect } from '@/lib/admin/use-async-effect';
import { ErrorNote, Panel, SkeletonPanels, StatCard, buttonClass, tally } from './ui';

/**
 * 대시보드. 오늘·최근 현황 요약과 최근 문의 5건.
 *
 * PostgREST 에는 group by 가 없다. "가장 많이 본 페이지"는 최근 30일 path 컬럼만
 * 내려받아 브라우저에서 집계한다 — 범위를 명시해 표시하고, 상한에 걸리면 그 사실도 알린다.
 * 없는 기간을 전체인 것처럼 말하지 않는다.
 */

const TOP_PAGE_WINDOW_DAYS = 30;
const TOP_PAGE_ROW_CAP = 5000;

type Summary = {
  todayViews: number;
  todaySessions: number;
  newInquiries: number;
  reviewingInquiries: number;
  weekInquiries: number;
  topPage: { key: string; count: number } | null;
  topPageCapped: boolean;
  recent: HumeaseInquiry[];
};

/**
 * 질의는 컴포넌트 밖의 async 함수에 둔다.
 * 그래야 `load()` 본문이 `await` 로 시작하고, 상태 변경이 전부 비동기 구간에서 일어난다
 * — 효과 안의 동기 setState 는 연쇄 렌더를 만든다(react-hooks/set-state-in-effect).
 */
async function fetchSummary(): Promise<Summary> {
  const supabase = createClient();
  const now = new Date();
  const today = resolvePeriod('today', '', '', now);
  if (!today) throw new Error('today period unresolved');

  const weekAgo = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 6).toISOString();
  const topWindowStart = new Date(
    now.getFullYear(), now.getMonth(), now.getDate() - (TOP_PAGE_WINDOW_DAYS - 1),
  ).toISOString();

  const [views, sessions, newCount, reviewingCount, weekCount, topPaths, recent] = await Promise.all([
    supabase.from('humease_page_views')
      .select('id', { count: 'exact', head: true })
      .gte('created_at', today.startIso).lt('created_at', today.endIso),
    supabase.from('humease_page_views')
      .select('session_id')
      .gte('created_at', today.startIso).lt('created_at', today.endIso)
      .limit(TOP_PAGE_ROW_CAP),
    supabase.from('humease_inquiries')
      .select('id', { count: 'exact', head: true }).eq('status', 'new'),
    supabase.from('humease_inquiries')
      .select('id', { count: 'exact', head: true }).eq('status', 'reviewing'),
    supabase.from('humease_inquiries')
      .select('id', { count: 'exact', head: true }).gte('created_at', weekAgo),
    supabase.from('humease_page_views')
      .select('path')
      .gte('created_at', topWindowStart)
      .limit(TOP_PAGE_ROW_CAP),
    supabase.from('humease_inquiries')
      .select('*').order('created_at', { ascending: false }).limit(5),
  ]);

  const firstError = [views, sessions, newCount, reviewingCount, weekCount, topPaths, recent]
    .find((r) => r.error)?.error;
  if (firstError) throw firstError;

  const pathRows = (topPaths.data ?? []) as { path: string }[];
  const ranked = tally(pathRows.map((r) => r.path));

  return {
    todayViews: views.count ?? 0,
    todaySessions: new Set(((sessions.data ?? []) as { session_id: string }[]).map((r) => r.session_id)).size,
    newInquiries: newCount.count ?? 0,
    reviewingInquiries: reviewingCount.count ?? 0,
    weekInquiries: weekCount.count ?? 0,
    topPage: ranked[0] ?? null,
    topPageCapped: pathRows.length >= TOP_PAGE_ROW_CAP,
    recent: (recent.data ?? []) as HumeaseInquiry[],
  };
}

export function DashboardBoard() {
  const [data, setData] = useState<Summary | null>(null);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    const result = await fetchSummary().catch(() => null);
    if (!result) {
      setError('데이터를 불러오지 못했습니다. 네트워크를 확인한 뒤 다시 시도해 주세요.');
      return;
    }
    setData(result);
    setError(null);
  }, []);

  useAsyncEffect(load);

  if (error) {
    return (
      <div className="space-y-4">
        <ErrorNote message={error} />
        <button type="button" onClick={() => void load()} className={buttonClass}>다시 시도</button>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="space-y-6">
        <h1 className="text-[24px] font-medium text-[var(--color-text)]">대시보드</h1>
        <SkeletonPanels count={6} />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-[24px] font-medium text-[var(--color-text)]">대시보드</h1>
        <button type="button" onClick={() => void load()} className={buttonClass}>새로고침</button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard label="오늘 페이지 조회" value={formatNumber(data.todayViews)} />
        <StatCard label="오늘 세션" value={formatNumber(data.todaySessions)} note="session_id 기준 중복 제거" />
        <StatCard label="신규 문의" value={formatNumber(data.newInquiries)} note="상태 = 신규" />
        <StatCard label="검토 중 문의" value={formatNumber(data.reviewingInquiries)} note="상태 = 검토 중" />
        <StatCard label="최근 7일 문의" value={formatNumber(data.weekInquiries)} note="오늘 포함 7일" />
        <StatCard
          label={`가장 많이 본 페이지 (최근 ${TOP_PAGE_WINDOW_DAYS}일)`}
          value={data.topPage ? data.topPage.key : '—'}
          note={
            data.topPage
              ? `${formatNumber(data.topPage.count)}회${data.topPageCapped ? ` · 최근 ${formatNumber(TOP_PAGE_ROW_CAP)}건만 집계` : ''}`
              : '기록 없음'
          }
        />
      </div>

      <Panel title="최근 문의" note="가장 최근 접수된 5건">
        {data.recent.length === 0 ? (
          <p className="text-[13px] text-[var(--color-muted)]">아직 접수된 문의가 없습니다.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] text-left text-[13px]">
              <thead className="text-[12px] text-[var(--color-muted)]">
                <tr className="border-b border-[var(--color-line)]">
                  <th scope="col" className="py-2 pr-4 font-medium">회사명</th>
                  <th scope="col" className="py-2 pr-4 font-medium">담당자</th>
                  <th scope="col" className="py-2 pr-4 font-medium">관심 분야</th>
                  <th scope="col" className="py-2 pr-4 font-medium">접수 시각</th>
                  <th scope="col" className="py-2 font-medium">상태</th>
                </tr>
              </thead>
              <tbody>
                {data.recent.map((row) => (
                  <tr key={row.id} className="border-b border-[var(--color-line)]/50">
                    <td className="py-2.5 pr-4 text-[var(--color-text)]">{row.company_name}</td>
                    <td className="py-2.5 pr-4 text-[var(--color-muted)]">{row.contact_name}</td>
                    <td className="py-2.5 pr-4 text-[var(--color-muted)]">{row.interest_area ?? '—'}</td>
                    <td className="py-2.5 pr-4 tabular-nums text-[var(--color-muted)]">{formatDateTime(row.created_at)}</td>
                    <td className="py-2.5">
                      <span className={`border px-2 py-0.5 text-[11px] ${inquiryStatusBadgeClass(row.status)}`}>
                        {INQUIRY_STATUS_LABELS[row.status]}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Panel>

      <nav aria-label="빠른 링크" className="grid gap-3 sm:grid-cols-3">
        {[
          { href: '/admin/inquiries', label: '전체 문의', note: '접수된 문의 목록과 상태 관리' },
          { href: '/admin/analytics', label: '사이트 분석', note: '기간별 조회·세션·유입 현황' },
          { href: '/admin/portfolio', label: '포트폴리오', note: '목록 노출 여부와 운영 메타' },
        ].map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="border border-[var(--color-line)] bg-[var(--color-surface)] px-4 py-4 transition-colors hover:border-[var(--color-accent)]"
          >
            <p className="text-[14px] text-[var(--color-text)]">{item.label}</p>
            <p className="mt-1.5 text-[12px] text-[var(--color-muted)]">{item.note}</p>
          </Link>
        ))}
      </nav>
    </div>
  );
}
