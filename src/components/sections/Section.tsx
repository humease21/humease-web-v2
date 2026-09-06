export function Section({
  id, eyebrow, title, lead, children,
}: { id?: string; eyebrow?: string; title?: string; lead?: string; children?: React.ReactNode }) {
  return (
    <section id={id} className="section border-b border-[var(--color-line)]/40">
      <div className="shell">
        {eyebrow && <p className="eyebrow">{eyebrow}</p>}
        {title && <h2 className="h2-ko mt-4 max-w-3xl">{title}</h2>}
        {lead && <p className="body-lg prose-measure mt-5">{lead}</p>}
        {children}
      </div>
    </section>
  );
}

/** docs/02 §5 CapabilityRows — 일괄 유리 카드 그리드 금지, 선과 텍스트로 구성 */
export function CapabilityRows({
  items,
}: { items: { title: string; body: string; href?: string; linkLabel?: string }[] }) {
  return (
    <ul className="mt-12 divide-y divide-[var(--color-line)]/50 border-y border-[var(--color-line)]/50">
      {items.map((it) => (
        <li key={it.title} className="grid gap-3 py-8 md:grid-cols-[minmax(0,280px)_1fr] md:gap-10">
          <h3 className="text-lg font-medium text-[var(--color-text)]">{it.title}</h3>
          <div>
            <p className="body-lg">{it.body}</p>
            {it.href && it.linkLabel && (
              <a href={it.href} className="mt-3 inline-block text-sm font-medium text-[var(--color-accent)] underline underline-offset-4">
                {it.linkLabel}
              </a>
            )}
          </div>
        </li>
      ))}
    </ul>
  );
}

/** docs/03 §14 — FAQ 는 본문으로 표시해 JS 없이도 읽히게 한다 */
export function FaqList({ items }: { items: { q: string; a: string }[] }) {
  return (
    <dl className="mt-12 divide-y divide-[var(--color-line)]/50 border-y border-[var(--color-line)]/50">
      {items.map((it) => (
        <div key={it.q} className="py-7">
          <dt className="text-base font-medium text-[var(--color-text)]">{it.q}</dt>
          <dd className="body-lg mt-2">{it.a}</dd>
        </div>
      ))}
    </dl>
  );
}
