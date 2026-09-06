import NextLink from 'next/link';

/**
 * 내부/외부/앵커/mailto 를 구분하는 단일 링크 진입점.
 *
 * 순수 <a href="/solutions"> 는 basePath 가 붙지 않아 GitHub 프로젝트 사이트에서
 * 계정 루트(humease21.github.io/solutions)로 이탈한다. next/link 만 basePath 를 처리한다.
 * 내부 경로는 반드시 이 컴포넌트를 쓴다(요청서 §10.3).
 */
export function A({
  href, children, className, ...rest
}: { href: string; children: React.ReactNode; className?: string } & React.AnchorHTMLAttributes<HTMLAnchorElement>) {
  const external = /^https?:\/\//.test(href);
  const nonPage = href.startsWith('mailto:') || href.startsWith('tel:') || href.startsWith('#');

  if (external) {
    return (
      <a href={href} className={className} target="_blank" rel="noopener noreferrer" {...rest}>
        {children}
      </a>
    );
  }
  if (nonPage) return <a href={href} className={className} {...rest}>{children}</a>;

  return <NextLink href={href} className={className} {...rest}>{children}</NextLink>;
}
