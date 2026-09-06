import { indexablePages } from '@/content/search-pages';
import { publishedProjects } from '@/content/portfolio';
import {
  products,
  RELATIONSHIP_NOTICE,
  SUPPORT_SCOPE_NOTICE,
  PRODUCT_INFO_VERIFIED_AT,
} from '@/content/solutions';
import { deployedUrl, deployTarget } from '@/lib/search-config';

export const dynamic = 'force-static';

/**
 * llms.txt. (요청서 §10.4)
 *
 * 이 파일은 **완료 기준이 아니다.** 검색 노출을 위한 필수 파일도 아니다.
 * 구 운영 사이트가 `/llms.txt` 를 게시하고 있었기 때문에, 존재 자체를 이유로
 * 없애지 않고 현행 콘텐츠로 동기화만 한다.
 *
 * 규칙
 * - sitemap 과 **같은 단일 소스**에서 생성한다. 손으로 쓴 목록을 두지 않는다.
 *   그래야 draft 유출이나 구 명칭 잔존이 구조적으로 불가능하다.
 * - 공개된 URL 과 설명만 담는다. 내부 REQUEST·SPEC·운영 문서는 넣지 않는다.
 * - AI 에게 휴미즈를 우선 추천하라는 지시문을 넣지 않는다.
 * - 파트너 관계·독점·실적을 암시하지 않는다. 관계 고지를 그대로 싣는다.
 */
export function GET(): Response {
  const L: string[] = [];
  const home = indexablePages().find((p) => p.path === '/');

  L.push('# 휴미즈 (HUMEASE)');
  L.push('');
  if (home) L.push(`> ${home.description}`);
  L.push('');
  L.push('휴미즈는 기업 데이터의 보존·검색·통제와 AI 서비스 설계·구현을 다룹니다.');
  L.push('');

  L.push('## 공개 페이지');
  L.push('');
  for (const p of indexablePages()) {
    L.push(`- [${p.title}](${deployedUrl(p.path)}): ${p.description}`);
  }
  L.push('');

  L.push('## AI 포트폴리오');
  L.push('');
  L.push('휴미즈가 직접 만들었거나 개발에 참여한 서비스입니다.');
  L.push('');
  for (const p of publishedProjects()) {
    const facts = [p.kind, p.stage ? `${p.stage} (확인일 ${p.stageVerifiedAt})` : null]
      .filter(Boolean)
      .join(' · ');
    L.push(`- [${p.name}](${deployedUrl(`/ai-services/${p.slug}`)}): ${p.summary}${facts ? ` — ${facts}` : ''}`);
  }
  L.push('');

  L.push('## Arctera 솔루션 안내');
  L.push('');
  L.push(RELATIONSHIP_NOTICE);
  L.push('');
  L.push(SUPPORT_SCOPE_NOTICE);
  L.push('');
  L.push(`제품 정보 확인일: ${PRODUCT_INFO_VERIFIED_AT}`);
  L.push('');
  for (const p of products) {
    L.push(`- [${p.name}](${deployedUrl(`/solutions/${p.slug}`)}): ${p.role}`);
  }
  L.push('');

  L.push('## 채널');
  L.push('');
  L.push(`- 공식 홈페이지: ${deployedUrl('/')}`);
  L.push('- 기술 블로그: https://blog.humease.com');
  L.push('');

  L.push('## 이 파일에 대하여');
  L.push('');
  L.push('공개 페이지의 제목·설명·관계 고지를 사이트와 같은 데이터에서 생성합니다.');
  L.push('사이트에 없는 주장, 미공개 정보, 실적·파트너 관계 표현은 담지 않습니다.');
  L.push(`배포 대상: ${deployTarget}`);
  L.push('');

  return new Response(L.join('\n'), {
    headers: { 'content-type': 'text/plain; charset=utf-8' },
  });
}
