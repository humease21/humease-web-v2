/** 목록 항목 순번으로 Reveal 지연값 1~4 를 만든다. 서버 컴포넌트에서도 호출하므로 클라이언트 모듈에 두지 않는다. */
export const stagger = (i: number) => ((i % 4) + 1) as 1 | 2 | 3 | 4;
