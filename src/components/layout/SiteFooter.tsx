import Link from 'next/link';
import { company } from '@/content/company';
import { primaryNav } from '@/content/navigation';

/**
 * docs/03 §13 — 대표자·사업자등록번호·주소는 승인값 확인 전 표시하지 않는다.
 * 값이 null 이면 렌더하지 않는다. '추후 입력' 같은 자리표시자도 쓰지 않는다.
 * /privacy 는 승인 본문이 없어 링크하지 않는다(docs/03 §13).
 */
export function SiteFooter() {
  const details = [company.representative, company.businessNumber, company.address].filter(Boolean);

  return (
    <footer className="mt-auto border-t border-[var(--color-line)]/60 bg-[var(--color-surface)]">
      <div className="shell py-12 md:py-16">
        <div className="flex flex-col gap-10 md:flex-row md:justify-between">
          <div>
            <p className="font-[family-name:var(--font-display)] text-xl">HUMEASE</p>
            <p className="mt-3 text-sm text-[var(--color-muted)]">{company.nameKo}</p>
            <a
              href={`mailto:${company.email}`}
              className="mt-1 inline-block text-sm text-[var(--color-muted)] underline underline-offset-4 hover:text-[var(--color-text)]"
            >
              {company.email}
            </a>
            {details.length > 0 && (
              <p className="mt-2 text-sm text-[var(--color-muted)]">{details.join(' · ')}</p>
            )}
          </div>

          <nav aria-label="하단 메뉴">
            <ul className="grid grid-cols-2 gap-x-10 gap-y-3 md:grid-cols-1">
              {primaryNav.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="text-sm text-[var(--color-muted)] hover:text-[var(--color-text)]">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <p className="mt-12 text-xs text-[var(--color-muted)]">
          Copyright © {new Date().getFullYear()} HUMEASE.
        </p>
      </div>
    </footer>
  );
}
