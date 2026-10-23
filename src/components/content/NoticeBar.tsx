import { Icon } from '@/components/ui/Icon';

/** 관계·범위 고지 띠. 히어로 바로 아래에 두어 오해 소지를 먼저 해소한다. */
export function NoticeBar({ children }: { children: React.ReactNode }) {
  return (
    <div className="border-b border-[var(--color-line)] bg-[var(--color-subtle)]">
      <div className="shell flex items-start gap-3 py-4 text-[14px] leading-[1.7] text-[var(--color-body)]">
        <Icon name="shield" size={18} className="mt-0.5 shrink-0 text-[var(--color-navy)]" />
        <p>{children}</p>
      </div>
    </div>
  );
}
