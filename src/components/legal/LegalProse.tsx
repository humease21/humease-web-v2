/**
 * 법률 문서(개인정보처리방침/이용약관) 전용 본문 요소.
 * 공개 사이트의 시네마틱 Reveal/display 타이포를 쓰지 않는다 — 법률 문서는
 * 지연 없이 전체가 즉시 보여야 한다. 문구는 원본 승인본을 그대로 옮긴다.
 */

export function LegalH2({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="mt-14 border-t border-[var(--color-line)] pt-8 text-[19px] font-semibold text-[var(--color-text)] first:mt-0 first:border-t-0 first:pt-0">
      {children}
    </h2>
  );
}

export function LegalH3({ children }: { children: React.ReactNode }) {
  return <h3 className="mt-7 text-[15px] font-semibold text-[var(--color-text)]">{children}</h3>;
}

export function LegalP({ children }: { children: React.ReactNode }) {
  return <p className="mt-4 text-[15px] leading-[1.8] text-[var(--color-muted)]">{children}</p>;
}

export function LegalUl({ children }: { children: React.ReactNode }) {
  return <ul className="mt-3 list-disc space-y-1.5 pl-5 text-[15px] leading-[1.8] text-[var(--color-muted)]">{children}</ul>;
}

export function LegalOl({ children }: { children: React.ReactNode }) {
  return <ol className="mt-3 list-decimal space-y-1.5 pl-5 text-[15px] leading-[1.8] text-[var(--color-muted)]">{children}</ol>;
}

export function LegalMeta({ children }: { children: React.ReactNode }) {
  return <p className="mt-2 text-[13px] text-[var(--color-muted)]">{children}</p>;
}
