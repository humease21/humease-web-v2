/**
 * 등장 모션 표식. 서버 컴포넌트로 data-reveal 속성만 렌더한다.
 * 실제 관찰은 레이아웃에 한 번 두는 RevealObserver 가 맡는다 — 항목마다 클라이언트 컴포넌트를
 * 하이드레이션하지 않아 메인 스레드 비용이 늘지 않는다.
 * JS 가 없거나 늦으면 html 에 reveal-ready 클래스가 붙지 않아 내용은 처음부터 보인다(globals.css).
 */
export function Reveal({
  children, as: Tag = 'div', delay, className, id,
}: {
  children: React.ReactNode;
  as?: 'div' | 'section' | 'p' | 'h2' | 'li' | 'span' | 'article';
  delay?: 1 | 2 | 3 | 4;
  className?: string;
  id?: string;
}) {
  return (
    <Tag id={id} data-reveal="" data-delay={delay} className={className}>
      {children}
    </Tag>
  );
}
