/**
 * public/ 자산의 절대 경로에 basePath 를 붙인다.
 *
 * next.config 의 assetPrefix 는 `_next/*` 빌드 산출물에만 적용된다.
 * public/ 파일을 `/images/x.webp` 처럼 직접 참조하면 Next 가 경로를 다시 쓰지 않으므로,
 * GitHub Pages 프로젝트 사이트(/humease-web-v2 하위)에서 그대로 404 가 된다.
 * unoptimized next/image 도 마찬가지다.
 */
import { basePath } from '@/lib/search-config';

export { basePath };

export const asset = (path: string) => `${basePath}${path}`;
