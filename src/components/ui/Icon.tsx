/**
 * 사이트 전용 라인 아이콘. 외부 아이콘 패키지·저작권 자산 없이 직접 그린 24px 그리드 path 다.
 * 장식용이므로 기본 aria-hidden 이다. 의미를 전달해야 하면 옆에 텍스트를 둔다.
 */
export type IconName =
  | 'archive' | 'search' | 'shield' | 'scale' | 'mail' | 'spark' | 'flow' | 'code'
  | 'layers' | 'chat' | 'check' | 'arrow-right' | 'arrow-up-right' | 'chevron-down'
  | 'menu' | 'close' | 'target' | 'compass' | 'database' | 'eye';

const PATHS: Record<IconName, React.ReactNode> = {
  archive: <><rect x="3" y="4" width="18" height="5" rx="1.5" /><path d="M5 9v9a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V9" /><path d="M10 13h4" /></>,
  search: <><circle cx="11" cy="11" r="6.5" /><path d="m20 20-4.2-4.2" /></>,
  shield: <><path d="M12 3 5 6v5.5c0 4.3 3 8 7 9.5 4-1.5 7-5.2 7-9.5V6l-7-3Z" /><path d="m9 12 2 2 4-4" /></>,
  scale: <><path d="M12 4v16M7 20h10M5 8h14" /><path d="m5 8-2.5 6a3 3 0 0 0 5 0L5 8ZM19 8l-2.5 6a3 3 0 0 0 5 0L19 8Z" /></>,
  mail: <><rect x="3" y="5" width="18" height="14" rx="2" /><path d="m4 7 8 6 8-6" /></>,
  spark: <><path d="M12 3v4M12 17v4M3 12h4M17 12h4" /><path d="m12 8 1.5 2.5L16 12l-2.5 1.5L12 16l-1.5-2.5L8 12l2.5-1.5L12 8Z" /></>,
  flow: <><rect x="3" y="4" width="6" height="5" rx="1.2" /><rect x="15" y="15" width="6" height="5" rx="1.2" /><path d="M6 9v3a3 3 0 0 0 3 3h6" /><path d="m13 13 2 2-2 2" /></>,
  code: <><path d="m8 8-4 4 4 4M16 8l4 4-4 4M13.5 5l-3 14" /></>,
  layers: <><path d="m12 3 9 5-9 5-9-5 9-5Z" /><path d="m3 13 9 5 9-5" /></>,
  chat: <><path d="M5 5h14a1 1 0 0 1 1 1v9a1 1 0 0 1-1 1h-8l-4 3v-3H5a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1Z" /><path d="M8 9.5h8M8 12.5h5" /></>,
  check: <path d="m5 12.5 4.5 4.5L19 7.5" />,
  'arrow-right': <path d="M4 12h15m-5-5 5 5-5 5" />,
  'arrow-up-right': <path d="M7 17 17 7M9 7h8v8" />,
  'chevron-down': <path d="m6 9 6 6 6-6" />,
  menu: <path d="M4 7h16M4 12h16M4 17h16" />,
  close: <path d="m6 6 12 12M18 6 6 18" />,
  target: <><circle cx="12" cy="12" r="8" /><circle cx="12" cy="12" r="4" /><circle cx="12" cy="12" r="0.8" /></>,
  compass: <><circle cx="12" cy="12" r="8.5" /><path d="m15.5 8.5-2 5-5 2 2-5 5-2Z" /></>,
  database: <><ellipse cx="12" cy="6" rx="7" ry="2.8" /><path d="M5 6v12c0 1.5 3.1 2.8 7 2.8s7-1.3 7-2.8V6" /><path d="M5 12c0 1.5 3.1 2.8 7 2.8s7-1.3 7-2.8" /></>,
  eye: <><path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12Z" /><circle cx="12" cy="12" r="3" /></>,
};

export function Icon({ name, size = 22, className, strokeWidth = 1.6 }: {
  name: IconName; size?: number; className?: string; strokeWidth?: number;
}) {
  return (
    <svg
      width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round"
      aria-hidden="true" focusable="false" className={className}
    >
      {PATHS[name]}
    </svg>
  );
}

/** 버튼·링크 끝의 화살표. hover 시 살짝 이동한다(.btn-arrow). */
export function Arrow({ external }: { external?: boolean }) {
  return <Icon name={external ? 'arrow-up-right' : 'arrow-right'} size={18} strokeWidth={1.9} className="btn-arrow shrink-0" />;
}
