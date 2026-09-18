'use client';

import { useEffect, useRef } from 'react';

/**
 * 네이티브 `<dialog>` 기반 모달.
 *
 * `showModal()` 은 브라우저가 알아서 처리해준다 — 포커스 트랩, ESC 닫기, 배경 inert.
 * 커스텀 라이브러리를 넣지 않는다. 직접 구현하는 것은 스크롤 락 · 닫힘 시 포커스 복귀뿐이다.
 * 오버레이(::backdrop) 클릭 닫기는 흔한 관용구를 쓴다 — 클릭 대상이 dialog 엘리먼트
 * 자신일 때만 닫는다(내부 콘텐츠 클릭은 dialog 가 아니라 그 자식이 target 이 된다).
 */
export function Modal({
  open, onClose, titleId, children,
}: {
  open: boolean;
  onClose: () => void;
  titleId: string;
  children: React.ReactNode;
}) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const triggerRef = useRef<Element | null>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (open) {
      triggerRef.current = document.activeElement;
      if (!dialog.open) dialog.showModal();
      document.body.style.overflow = 'hidden';
    } else if (dialog.open) {
      dialog.close();
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  // ESC 와 브라우저 기본 닫기 동작도 여기로 모인다 — 상태를 한 곳(부모)에서만 바꾼다.
  const handleNativeClose = () => {
    document.body.style.overflow = '';
    onClose();
    if (triggerRef.current instanceof HTMLElement) triggerRef.current.focus();
  };

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby={titleId}
      onClose={handleNativeClose}
      onClick={(e) => { if (e.target === dialogRef.current) handleNativeClose(); }}
      className="m-auto max-h-[85svh] w-[min(560px,calc(100vw-32px))] border border-[var(--color-line)] bg-[var(--color-surface)] p-0 text-[var(--color-text)] backdrop:bg-black/70"
    >
      {open && children}
    </dialog>
  );
}
