import type { NextConfig } from 'next';

// GitHub Pages 프로젝트 사이트는 하위 경로로 서빙된다(/humease-web-v2).
// 커스텀 도메인 연결 후에는 루트가 되므로 basePath 가 비어야 한다.
// 하드코딩하면 도메인 전환 순간 모든 자산 경로가 깨진다 → 환경변수로 주입한다.
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? '';

const nextConfig: NextConfig = {
  // GitHub Pages 는 정적 호스팅 전용이다. ADR-001 참조.
  output: 'export',
  basePath,
  assetPrefix: basePath || undefined,
  trailingSlash: true,
  images: {
    // 정적 export 에서는 Next 이미지 최적화 서버가 없다. 빌드 전 사전 최적화본을 쓴다.
    unoptimized: true,
  },
  typescript: { ignoreBuildErrors: false },
};

export default nextConfig;
