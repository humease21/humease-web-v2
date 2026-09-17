'use client';

import { useCallback, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { projects } from '@/content/portfolio';
import type { HumeasePortfolioOverride } from '@/lib/admin/types';
import { formatDateTime } from '@/lib/admin/format';
import { useAsyncEffect } from '@/lib/admin/use-async-effect';
import {
  ErrorNote, Spinner, buttonClass, inputClass, panelClass, primaryButtonClass,
} from './ui';

/**
 * 포트폴리오 운영 메타 관리 (V0 = B안).
 *
 * 카피(이름·요약·문제·접근·하이라이트)의 SSOT 는 코드다(src/content/portfolio.ts, 원본 §3-17).
 * 이 화면에서는 고칠 수 없고, 고칠 수 있게 만들지도 않는다.
 * 여기서 다루는 값은 slug 당 세 가지뿐이다 — 목록 노출 여부 / 상태 배지 / 외부 링크.
 *
 * "공개·비공개"라는 말을 쓰지 않는다. 상세 페이지는 이미 정적 HTML 로 배포돼 있어
 * list_visible 을 꺼도 URL 로 직접 열린다. 화면에도 같은 경고를 낸다.
 *
 * 이번 V0 범위는 **관리자 화면에서의 저장까지**다. 홈·허브 화면이 이 값을 읽어
 * 실제 목록을 바꾸는 연동은 이 작업 범위가 아니다.
 */

type Draft = { listVisible: boolean; statusBadge: string; externalUrl: string };

const toDraft = (o: HumeasePortfolioOverride | undefined): Draft => ({
  listVisible: o?.list_visible ?? true,
  statusBadge: o?.status_badge ?? '',
  externalUrl: o?.external_url ?? '',
});

export function PortfolioBoard() {
  const [overrides, setOverrides] = useState<Record<string, HumeasePortfolioOverride>>({});
  const [drafts, setDrafts] = useState<Record<string, Draft>>({});
  const [loading, setLoading] = useState(true);
  const [savingSlug, setSavingSlug] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [note, setNote] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const supabase = createClient();
      const { data, error: queryError } = await supabase
        .from('humease_portfolio_overrides')
        .select('*')
        .in('slug', projects.map((p) => p.slug));
      if (queryError) throw queryError;

      const map: Record<string, HumeasePortfolioOverride> = {};
      for (const row of (data ?? []) as HumeasePortfolioOverride[]) map[row.slug] = row;
      setOverrides(map);
      setDrafts(Object.fromEntries(projects.map((p) => [p.slug, toDraft(map[p.slug])])));
    } catch {
      setError('포트폴리오 설정을 불러오지 못했습니다.');
    } finally {
      setLoading(false);
    }
  }, []);

  useAsyncEffect(load);

  const save = async (slug: string) => {
    const draft = drafts[slug];
    if (!draft) return;
    setSavingSlug(slug);
    setNote(null);
    try {
      const supabase = createClient();
      const { data, error: upsertError } = await supabase
        .from('humease_portfolio_overrides')
        .upsert({
          slug,
          list_visible: draft.listVisible,
          status_badge: draft.statusBadge.trim() || null,
          external_url: draft.externalUrl.trim() || null,
          updated_at: new Date().toISOString(),
        }, { onConflict: 'slug' })
        .select('*')
        .single();
      if (upsertError) throw upsertError;
      const row = data as HumeasePortfolioOverride;
      setOverrides((current) => ({ ...current, [slug]: row }));
      setNote(`${slug} 설정을 저장했습니다.`);
    } catch {
      setNote(`${slug} 저장에 실패했습니다. 권한과 네트워크를 확인해 주세요.`);
    } finally {
      setSavingSlug(null);
    }
  };

  const update = (slug: string, changes: Partial<Draft>) =>
    setDrafts((current) => ({ ...current, [slug]: { ...current[slug], ...changes } }));

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-[24px] font-medium text-[var(--color-text)]">포트폴리오</h1>
        <button type="button" onClick={() => void load()} className={buttonClass}>새로고침</button>
      </div>

      <div className="border border-[var(--color-line)] bg-[var(--color-surface)] px-4 py-4 text-[13px] leading-relaxed text-[var(--color-muted)]">
        <p className="text-[var(--color-text)]">이 화면은 목록 노출 여부와 운영 메타만 다룹니다.</p>
        <p className="mt-2">
          프로젝트 이름·요약·본문은 코드가 단일 출처입니다(<code className="text-[12px]">src/content/portfolio.ts</code>).
          여기서는 수정할 수 없습니다.
        </p>
        <p className="mt-2 text-[var(--color-accent)]">
          목록 노출을 꺼도 접근 차단이 아닙니다. 상세 페이지는 정적 HTML 로 이미 배포되어 있어 URL 로 직접 열릴 수 있습니다.
        </p>
        <p className="mt-2">
          현재 단계에서는 이 값이 관리자 DB 에만 저장됩니다. 공개 화면(홈·포트폴리오 목록)에 반영하는 연동은 아직 적용되지 않았습니다.
        </p>
      </div>

      {error && <ErrorNote message={error} />}
      {note && <p role="status" className="text-[12px] text-[var(--color-muted)]">{note}</p>}

      {loading ? (
        <Spinner label="불러오는 중…" />
      ) : (
        <div className="space-y-4">
          {projects.map((project) => {
            const draft = drafts[project.slug] ?? toDraft(undefined);
            const stored = overrides[project.slug];
            const dirty =
              draft.listVisible !== (stored?.list_visible ?? true)
              || draft.statusBadge !== (stored?.status_badge ?? '')
              || draft.externalUrl !== (stored?.external_url ?? '');

            return (
              <section key={project.slug} className={panelClass}>
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0">
                    <h2 className="text-[16px] font-medium text-[var(--color-text)]">{project.name}</h2>
                    <p className="mt-1 text-[12px] text-[var(--color-muted)]">
                      /ai-services/{project.slug} · {project.category}
                    </p>
                  </div>
                  <label className="flex shrink-0 items-center gap-2 text-[13px] text-[var(--color-text)]">
                    <input
                      type="checkbox"
                      checked={draft.listVisible}
                      onChange={(e) => update(project.slug, { listVisible: e.target.checked })}
                    />
                    목록에 노출
                  </label>
                </div>

                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  <label className="block">
                    <span className="text-[12px] text-[var(--color-muted)]">상태 배지 (비우면 배지 없음)</span>
                    <input
                      type="text"
                      value={draft.statusBadge}
                      maxLength={40}
                      placeholder={project.stage ?? '예: 개발 중'}
                      onChange={(e) => update(project.slug, { statusBadge: e.target.value })}
                      className={`${inputClass} mt-1.5`}
                    />
                  </label>
                  <label className="block">
                    <span className="text-[12px] text-[var(--color-muted)]">외부 링크 (비우면 링크 없음)</span>
                    <input
                      type="url"
                      value={draft.externalUrl}
                      maxLength={500}
                      placeholder={project.externalUrl ?? 'https://'}
                      onChange={(e) => update(project.slug, { externalUrl: e.target.value })}
                      className={`${inputClass} mt-1.5`}
                    />
                  </label>
                </div>

                <div className="mt-4 flex flex-wrap items-center gap-3">
                  <button
                    type="button"
                    disabled={!dirty || savingSlug === project.slug}
                    onClick={() => void save(project.slug)}
                    className={primaryButtonClass}
                  >
                    {savingSlug === project.slug ? '저장 중…' : '저장'}
                  </button>
                  <span className="text-[12px] text-[var(--color-muted)]">
                    {stored ? `최종 저장 ${formatDateTime(stored.updated_at)}` : '저장된 설정 없음 (기본값 사용 중)'}
                  </span>
                </div>
              </section>
            );
          })}
        </div>
      )}
    </div>
  );
}
