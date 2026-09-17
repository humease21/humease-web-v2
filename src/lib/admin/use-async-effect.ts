'use client';

import { useEffect } from 'react';

/**
 * 의존성이 바뀔 때마다 비동기 작업을 실행한다.
 *
 * 관리자 화면은 전부 마운트 후 Supabase 를 직접 조회한다(정적 export 라 서버가 없다).
 * 효과 본문에서 상태를 **동기적으로** 바꾸면 연쇄 렌더가 생긴다
 * (react-hooks/set-state-in-effect). async IIFE 로 감싸면 `run()` 안의 상태 변경이
 * 전부 첫 await 이후 — 즉 비동기 구간에서 일어난다.
 *
 * `run` 은 반드시 `useCallback` 으로 안정화해서 넘긴다. 아니면 매 렌더마다 다시 실행된다.
 */
export function useAsyncEffect(run: () => Promise<void>): void {
  useEffect(() => { void (async () => { await run(); })(); }, [run]);
}
