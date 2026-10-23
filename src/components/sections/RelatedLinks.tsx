import { Reveal } from '@/components/interactive/Reveal';
import { stagger } from '@/lib/stagger';
import { Arrow } from '@/components/ui/Icon';
import { A } from '@/components/ui/Link';

/** 연관 페이지 이동 — 페이지 하단에서 다음 탐색을 이어 준다. */
export function RelatedLinks({ title = '함께 살펴보기', items }: {
  title?: string;
  items: { label: string; href: string; description?: string }[];
}) {
  return (
    <nav aria-label={title}>
      <Reveal as="h2" className="heading-lg">{title}</Reveal>
      <ul className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {items.map((it, i) => (
          <Reveal as="li" key={it.href} delay={stagger(i)} className="flex">
            <A href={it.href} className="card card-link group w-full !p-5 md:!p-6">
              <span className="flex items-center justify-between gap-3 text-[16px] font-semibold text-[var(--color-text)]">
                {it.label}<Arrow />
              </span>
              {it.description && <span className="body-sm mt-1.5 block">{it.description}</span>}
            </A>
          </Reveal>
        ))}
      </ul>
    </nav>
  );
}

export const SERVICE_LINKS = [
  { label: '기업 데이터', href: '/enterprise-data', description: '보존·검색·접근·통제·조사' },
  { label: 'e-Discovery', href: '/consulting/e-discovery', description: '조사·감사·분쟁 대응 체계' },
  { label: '내부 통제', href: '/consulting/internal-control', description: '위험 탐지·검토·조치' },
  { label: 'Exchange 아카이빙', href: '/consulting/exchange-archive', description: '메일 보존·검색·복원' },
  { label: 'AI 서비스', href: '/consulting/ai-transformation', description: '설계·자동화·구현' },
  { label: 'Arctera 솔루션', href: '/solutions', description: 'Capture에서, Compliance까지' },
];

export const relatedServices = (current: string) => SERVICE_LINKS.filter((l) => l.href !== current).slice(0, 4);
