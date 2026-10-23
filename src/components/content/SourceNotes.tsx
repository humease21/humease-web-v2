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
    <Reveal>
      <aside aria-label="공개 자료 안내" className="rounded-xl border border-[var(--color-line)] bg-[var(--color-subtle)] p-6 md:p-8">
        <p className="text-[15px] font-semibold text-[var(--color-text)]">공개 자료 안내</p>
        <dl className="mt-4 grid gap-4 text-[15px] leading-[1.7] text-[var(--color-body)] md:grid-cols-[max-content_minmax(0,1fr)] md:gap-x-8">
          <dt className="font-semibold text-[var(--color-text)]">제품 정보 확인일</dt>
          <dd className="-mt-3 md:mt-0">{sourcesCheckedAt}</dd>
          <dt className="font-semibold text-[var(--color-text)]">참고 자료</dt>
          <dd className="-mt-3 md:mt-0">
            {references.map((r, i) => (
              <span key={r.url}>
                {i > 0 && ' · '}
                <A href={r.url} className="underline underline-offset-4 hover:text-[var(--color-text)]">
                  {r.label}<span aria-hidden="true"> ↗</span><span className="sr-only">(새 탭에서 열림)</span>
                </A>
              </span>
            ))}
          </dd>
          <dt className="font-semibold text-[var(--color-text)]">안내</dt>
          <dd className="-mt-3 md:mt-0">{scopeNotice}</dd>
          {relationshipNotice && (
            <>
              <dt className="font-semibold text-[var(--color-text)]">관계</dt>
              <dd className="-mt-3 md:mt-0">{relationshipNotice}</dd>
            </>
          )}
        </dl>
      </aside>
    </Reveal>
  );
}
