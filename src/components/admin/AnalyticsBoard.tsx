'use client';

import { useCallback, useMemo, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import type { HumeasePageView } from '@/lib/supabase/types';
import { formatAverage, formatNumber, formatRatio, localDateKey } from '@/lib/admin/format';
import { localDayKeys, resolvePeriod, type PeriodPresetId, type PeriodRange } from '@/lib/admin/period';
import { useAsyncEffect } from '@/lib/admin/use-async-effect';
import { PeriodSwitcher } from './PeriodSwitcher';
import { ErrorNote, Panel, RankList, SkeletonPanels, StatCard, buttonClass, tally } from './ui';

/**
 * 사이트 분석.
 *
 * 집계는 전부 브라우저에서 한다 — 정적 export 라 서버가 없고, PostgREST 에는 group by 가 없다.
 * 대신 한 번에 내려받는 행 수를 `ROW_CAP` 으로 묶고, 상한에 걸리면 화면에 그대로 알린다.
 * 잘린 표본을 전체인 것처럼 보여주지 않는다.
 *
 * 차트 라이브러리를 새로 추가하지 않는다. 날짜별 막대는 CSS 높이로 그린다.
 */

const ROW_CAP = 10000;

type PageViewRow = Pick<
  HumeasePageView,
  'created_at' | 'session_id' | 'path' | 'referrer_domain'
  | 'utm_source' | 'utm_medium' | 'utm_campaign'
  | 'device_type' | 'browser_family' | 'os_family'
>;

const SELECT_COLUMNS =
  'created_at, session_id, path, referrer_domain, utm_source, utm_medium, utm_campaign, device_type, browser_family, os_family';

type Loaded = { range: PeriodRange; views: PageViewRow[]; inquiries: number; capped: boolean };

/** 질의는 컴포넌트 밖에 둔다 — 상태 변경은 전부 await 이후에만 일어나야 한다. */
async function fetchRange(target: PeriodRange): Promise<Loaded> {
  const supabase = createClient();
  const [views, inquiries] = await Promise.all([
    supabase.from('humease_page_views')
      .select(SELECT_COLUMNS)
      .gte('created_at', target.startIso).lt('created_at', target.endIso)
      .order('created_at', { ascending: true })
      .limit(ROW_CAP),
    supabase.from('humease_inquiries')
      .select('id', { count: 'exact', head: true })
      .gte('created_at', target.startIso).lt('created_at', target.endIso),
  ]);
  if (views.error) throw views.error;
  if (inquiries.error) throw inquiries.error;

  const rows = (views.data ?? []) as PageViewRow[];
  return { range: target, views: rows, inquiries: inquiries.count ?? 0, capped: rows.length >= ROW_CAP };
}

export function AnalyticsBoard() {
  const [preset, setPreset] = useState<PeriodPresetId>('last7');
  const [custom, setCustom] = useState({ from: '', to: '' });
  const [data, setData] = useState<Loaded | null>(null);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const range = useMemo(
    () => resolvePeriod(preset, custom.from, custom.to),
    [preset, custom.from, custom.to],
  );

  const load = useCallback(async () => {
    if (!range) return;
    setPending(true);
    setError(null);
    const result = await fetchRange(range).catch(() => null);
    if (!result) {
      setError('분석 데이터를 불러오지 못했습니다.');
      setPending(false);
      return;
    }
    setData(result);
    setPending(false);
  }, [range]);

  useAsyncEffect(load);

  const stats = useMemo(() => {
    if (!data) return null;
    const { views, inquiries, range: r } = data;
    const sessions = new Set(views.map((v) => v.session_id)).size;

    const byDay = new Map<string, number>();
    for (const v of views) {
      const key = localDateKey(new Date(v.created_at));
      byDay.set(key, (byDay.get(key) ?? 0) + 1);
    }
    const days = localDayKeys(r).map((key) => ({ key, count: byDay.get(key) ?? 0 }));

    return {
      pageViews: views.length,
      sessions,
      inquiries,
      days,
      paths: tally(views.map((v) => v.path)),
      referrers: tally(views.map((v) => v.referrer_domain), '(직접 유입)'),
      utmSource: tally(views.map((v) => v.utm_source)),
      utmMedium: tally(views.map((v) => v.utm_medium)),
      utmCampaign: tally(views.map((v) => v.utm_campaign)),
      devices: tally(views.map((v) => v.device_type)),
      browsers: tally(views.map((v) => v.browser_family)),
      os: tally(views.map((v) => v.os_family)),
    };
  }, [data]);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-[24px] font-medium text-[var(--color-text)]">사이트 분석</h1>
        <button type="button" onClick={() => void load()} disabled={!range || pending} className={buttonClass}>
          새로고침
        </button>
      </div>

      <PeriodSwitcher
        preset={preset}
        from={custom.from}
        to={custom.to}
        pending={pending}
        invalid={preset === 'custom' && !range}
        onPresetChange={setPreset}
        onRangeChange={setCustom}
      />

      {error && <ErrorNote message={error} />}

      {!range ? (
        <p className="text-[13px] text-[var(--color-muted)]">조회할 기간을 선택해 주세요.</p>
      ) : !stats ? (
        <SkeletonPanels count={5} />
      ) : (
        <>
          <p className="text-[12px] text-[var(--color-muted)]">
            기간: {data?.range.label}
            {data?.capped && ` · 상한 ${formatNumber(ROW_CAP)}건에 도달해 일부만 집계했습니다`}
          </p>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            <StatCard label="페이지 조회 수" value={formatNumber(stats.pageViews)} />
            <StatCard label="세션 수" value={formatNumber(stats.sessions)} note="session_id 기준" />
            <StatCard label="세션당 평균 조회" value={formatAverage(stats.pageViews, stats.sessions)} />
            <StatCard label="신규 문의 수" value={formatNumber(stats.inquiries)} />
            <StatCard
              label="문의 전환율"
              value={formatRatio(stats.inquiries, stats.sessions)}
              note="문의 수 ÷ 세션 수"
            />
          </div>

          <Panel title="날짜별 페이지 조회" note={`${stats.days.length}일`}>
            <DailyBars days={stats.days} />
          </Panel>

          <div className="grid gap-4 lg:grid-cols-2">
            <Panel title="인기 페이지 TOP">
              <RankList rows={stats.paths} total={stats.pageViews} />
            </Panel>
            <Panel title="유입 도메인 TOP" note="referrer 의 도메인만 저장한다(전체 URL 아님)">
              <RankList rows={stats.referrers} total={stats.pageViews} />
            </Panel>
          </div>

          <div className="grid gap-4 lg:grid-cols-3">
            <Panel title="UTM Source"><RankList rows={stats.utmSource} total={stats.pageViews} limit={6} /></Panel>
            <Panel title="UTM Medium"><RankList rows={stats.utmMedium} total={stats.pageViews} limit={6} /></Panel>
            <Panel title="UTM Campaign"><RankList rows={stats.utmCampaign} total={stats.pageViews} limit={6} /></Panel>
          </div>

          <div className="grid gap-4 lg:grid-cols-3">
            <Panel title="기기 유형"><RankList rows={stats.devices} total={stats.pageViews} limit={6} /></Panel>
            <Panel title="브라우저"><RankList rows={stats.browsers} total={stats.pageViews} limit={6} /></Panel>
            <Panel title="OS"><RankList rows={stats.os} total={stats.pageViews} limit={6} /></Panel>
          </div>
        </>
      )}
    </div>
  );
}

/** CSS 막대 그래프. 라이브러리를 쓰지 않는다. 0건인 날도 축에서 빠뜨리지 않는다. */
function DailyBars({ days }: { days: { key: string; count: number }[] }) {
  const max = days.reduce((m, d) => Math.max(m, d.count), 0);
  if (days.length === 0) {
    return <p className="text-[13px] text-[var(--color-muted)]">기간에 해당하는 날이 없습니다.</p>;
  }
  return (
    <div className="overflow-x-auto">
      <ul className="flex min-w-full items-end gap-1" style={{ height: 150 }}>
        {days.map((d) => (
          <li key={d.key} className="flex h-full min-w-[14px] flex-1 flex-col justify-end" title={`${d.key} · ${d.count}회`}>
            <span className="mb-1 text-center text-[10px] tabular-nums text-[var(--color-muted)]">{d.count}</span>
            <span
              aria-hidden="true"
              className="block bg-[var(--color-accent)]"
              style={{ height: max > 0 ? `${Math.max((d.count / max) * 100, d.count > 0 ? 2 : 0)}%` : 0 }}
            />
            <span className="mt-1 text-center text-[9px] tabular-nums text-[var(--color-muted)]">
              {d.key.slice(5)}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
