import { Reveal } from '@/components/interactive/Reveal';
import { A } from '@/components/ui/Link';

/**
 * 공개 자료 안내. (요청서 §7.3)
 * contentUpdatedAt 과 sourcesCheckedAt 을 구분한다.
 * 출처만 재확인했는데 본문 수정일을 덮어쓰지 않는다.
 */
export function SourceNotes({
  sourcesCheckedAt, references, scopeNotice, relationshipNotice,
}: {
  sourcesCheckedAt: string;
  references: { label: string; url: string }[];
  scopeNotice: string;
  relationshipNotice?: string;
}) {
  return (
    <Reveal delay={4}>
      <div className="mt-16 border-t border-[color-mix(in_srgb,var(--color-line)_55%,transparent)] pt-8">
        <p className="text-[12px] uppercase tracking-[0.18em] text-[var(--color-muted)]">공개 자료 안내</p>

        <dl className="mt-6 space-y-3 text-[14px] leading-[1.8] text-[var(--color-muted)]">
          <div className="flex flex-wrap gap-x-3">
            <dt className="font-medium text-[var(--color-text)]">제품 정보 확인일</dt>
            <dd>{sourcesCheckedAt}</dd>
          </div>
          <div className="flex flex-wrap gap-x-3">
            <dt className="font-medium text-[var(--color-text)]">참고 자료</dt>
            <dd>
              {references.map((r, i) => (
                <span key={r.url}>
                  {i > 0 && ' · '}
                  <A href={r.url} className="underline underline-offset-4 transition-colors hover:text-[var(--color-accent)]">
                    {r.label}<span aria-hidden="true"> ↗</span>
                  </A>
                </span>
              ))}
            </dd>
          </div>
          <div>
            <dt className="font-medium text-[var(--color-text)]">안내</dt>
            <dd className="measure mt-1">{scopeNotice}</dd>
          </div>
          {relationshipNotice && (
            <div>
              <dt className="font-medium text-[var(--color-text)]">관계</dt>
              <dd className="measure mt-1">{relationshipNotice}</dd>
            </div>
          )}
        </dl>
      </div>
    </Reveal>
  );
}
