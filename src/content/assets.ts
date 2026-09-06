/**
 * docs/05 §3 자산 manifest.
 * src 는 존재가 확인된 배포 파일만 기재한다. 없으면 만들어 넣지 않는다.
 * 원본 경로·해시는 docs/reports/ 에 별도 기록한다(브라우저로 보내지 않음).
 */
export type AssetRole = 'decorative' | 'content' | 'product-capture';
export type SourceStatus = 'located' | 'mapped' | 'optimized' | 'verified';

export type Asset = {
  id: string;
  src: string;
  width: number;
  height: number;
  role: AssetRole;
  alt: string;
  sourceStatus: SourceStatus;
};

const A = (
  id: string, file: string, width: number, height: number,
  role: AssetRole = 'decorative', alt = '',
): Asset => ({ id, src: `/images/${file}`, width, height, role, alt, sourceStatus: 'optimized' });

export const assets = {
  A01: A('A01', 'a01-home-hero-desktop.webp', 1376, 768),
  A02: A('A02', 'a02-home-hero-mobile.webp', 912, 1136),
  A03: A('A03', 'a03-data-to-intelligence.webp', 1600, 900),
  A04: A('A04', 'a04-enterprise-data.webp', 1600, 900),
  A05: A('A05', 'a05-ediscovery.webp', 1600, 900),
  A06: A('A06', 'a06-internal-control.webp', 1600, 900),
  A07: A('A07', 'a07-exchange-archive.webp', 1600, 900),
  A08: A('A08', 'a08-applied-ai.webp', 1376, 768),
  A09: A('A09', 'a09-ai-projects.webp', 1376, 768),
  A10: A('A10', 'a10-momieum-connection.webp', 1376, 768),
  A11: A('A11', 'a11-about-craft.webp', 1200, 896),
  A12: A('A12', 'a12-enterprise-solutions.webp', 1376, 768),
  A13: A('A13', 'a13-contact-connection.webp', 1400, 788),
} as const;

/**
 * A14–A16 은 실제 글이 있을 때만 사용한다(docs/05 §2).
 * 현재 확인된 글이 없으므로 화면에서 사용하지 않는다 — 미사용 사유 기록.
 * A17(og-background)은 OG 이미지 합성 확정 후 연결한다.
 */
export const unusedAssets = {
  A14: '실제 Enterprise Data 글 미확인 — 노출 안 함',
  A15: '실제 Applied AI 글 미확인 — 노출 안 함',
  A16: '실제 제품 개발 글 미확인 — 노출 안 함',
  A17: 'OG 카드 합성 미확정 — 연결 보류',
} as const;
