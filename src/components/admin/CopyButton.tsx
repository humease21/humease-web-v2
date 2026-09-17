'use client';

import { useState } from 'react';
import { buttonClass } from './ui';

/**
 * 클립보드 복사. `navigator.clipboard` 는 보안 컨텍스트에서만 동작하므로
 * 실패를 조용히 삼키지 않고 "직접 선택해 복사" 안내로 바꾼다.
 */
export function CopyButton({ value, label }: { value: string; label: string }) {
  const [state, setState] = useState<'idle' | 'copied' | 'failed'>('idle');

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setState('copied');
    } catch {
      setState('failed');
    }
    window.setTimeout(() => setState('idle'), 2000);
  };

  return (
    <button
      type="button"
      onClick={() => void copy()}
      aria-label={`${label} 복사`}
      className={`${buttonClass} py-1 text-[12px]`}
    >
      {state === 'copied' ? '복사됨' : state === 'failed' ? '복사 실패' : '복사'}
    </button>
  );
}
