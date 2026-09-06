import Link from 'next/link';

type Props = { href: string; children: React.ReactNode; variant?: 'primary' | 'ghost' };

/** docs/02 §5 — hover 없이도 클릭 가능성이 보여야 한다. 터치 44px 이상. */
export function ButtonLink({ href, children, variant = 'primary' }: Props) {
  const base =
    'inline-flex min-h-[48px] items-center justify-center rounded-lg px-6 text-[15px] font-medium transition-colors duration-200';
  const styles =
    variant === 'primary'
      ? 'bg-[var(--color-accent)] text-[#12100C] hover:bg-[#d6cbb4]'
      : 'border border-[var(--color-line)] text-[var(--color-text)] hover:border-[var(--color-accent)]';
  const external = href.startsWith('http') || href.startsWith('mailto:');

  if (external) {
    return (
      <a
        href={href}
        className={`${base} ${styles}`}
        {...(href.startsWith('http') ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
      >
        {children}
      </a>
    );
  }
  return <Link href={href} className={`${base} ${styles}`}>{children}</Link>;
}
