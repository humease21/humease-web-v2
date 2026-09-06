/**
 * 배포 대상·원점·색인 승인·URL 정규화의 단일 출처. (요청서 §4)
 *
 * NODE_ENV=production, main 브랜치, basePath 여부 중 **어느 하나로도 검색 공개를 결정하지 않는다.**
 * production 은 프레임워크 빌드 모드로도 쓰이기 때문이다.
 * 설정이 없거나 이상하면 안전한 검증 설정으로 제한한다. 운영 공개를 추정하지 않는다.
 */

export type DeployTarget = 'preview' | 'production';

const rawTarget = process.env.NEXT_PUBLIC_SITE_DEPLOY_TARGET;
export const deployTarget: DeployTarget = rawTarget === 'production' ? 'production' : 'preview';

export const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? '';

/** 산출물을 실제로 제공할 origin. 미지정이면 대상별 기본값. */
export const siteOrigin = (
  process.env.NEXT_PUBLIC_SITE_ORIGIN
  ?? (deployTarget === 'production' ? 'https://www.humease.com' : 'https://humease21.github.io')
).replace(/\/+$/, '');

/**
 * 색인 승인. production 이면서 명시 승인이 있을 때만 true.
 * 둘 중 하나라도 빠지면 색인하지 않는다.
 */
export const searchIndexingEnabled =
  deployTarget === 'production' && process.env.NEXT_PUBLIC_SEARCH_INDEXING_ENABLED === 'true';

/** IndexNow 는 기본 비활성. 승인된 운영 변경만 제출한다. */
export const indexNowEnabled = process.env.INDEXNOW_ENABLED === 'true';

/** 설정 조합이 모순이면 빌드를 실패시킨다. 잘못된 공개를 조용히 허용하지 않는다. */
if (deployTarget === 'production' && basePath !== '') {
  throw new Error('[search-config] production 대상에는 basePath 를 둘 수 없다. 운영은 루트 배포다.');
}
if (searchIndexingEnabled && !siteOrigin.startsWith('https://www.humease.com')) {
  throw new Error(`[search-config] 색인 승인은 운영 origin 에서만 가능하다. 현재: ${siteOrigin}`);
}

/**
 * 내부 논리 경로 → 대표(canonical) 절대 URL.
 * 저장소명·basePath·쿼리·fragment 를 넣지 않는다. HTML 경로는 항상 트레일링 슬래시.
 */
export function canonicalUrl(path: string): string {
  const clean = `/${path.replace(/^\/+/, '').replace(/[?#].*$/, '')}`;
  const withSlash = clean === '/' ? '/' : clean.endsWith('/') ? clean : `${clean}/`;
  return `https://www.humease.com${withSlash}`;
}

/**
 * 현재 산출물에서 실제로 접근 가능한 절대 URL(OG·피드용).
 * 검증 환경은 basePath 를 포함해야 실제로 열린다.
 */
export function deployedUrl(path: string): string {
  const clean = `/${path.replace(/^\/+/, '').replace(/[?#].*$/, '')}`;
  const withSlash = clean === '/' ? '/' : clean.endsWith('/') ? clean : `${clean}/`;
  return `${siteOrigin}${basePath}${withSlash}`;
}

/** public/ 자산의 배포 경로. HTML 이 아니므로 슬래시를 붙이지 않는다. */
export function deployedAssetUrl(path: string): string {
  return `${siteOrigin}${basePath}${path.startsWith('/') ? path : `/${path}`}`;
}
