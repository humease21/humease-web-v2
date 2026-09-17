import type { InquiryStatus } from '@/lib/supabase/types';

/**
 * 문의 상태 라벨·필터 정의. DB CHECK 제약(humease_inquiries.status)과 값이 1:1로 맞아야 한다.
 * 화면 문구를 바꿀 때 DB 값을 바꾸지 않는다 — 라벨만 여기서 고친다.
 */

export const INQUIRY_STATUSES: readonly InquiryStatus[] = [
  'new', 'reviewing', 'replied', 'closed', 'spam',
] as const;

export const INQUIRY_STATUS_LABELS: Record<InquiryStatus, string> = {
  new: '신규',
  reviewing: '검토 중',
  replied: '답변 완료',
  closed: '종결',
  spam: '스팸',
};

export type InquiryFilter = 'all' | InquiryStatus;

export const INQUIRY_FILTERS: readonly { id: InquiryFilter; label: string }[] = [
  { id: 'all', label: '전체' },
  { id: 'new', label: '신규' },
  { id: 'reviewing', label: '검토 중' },
  { id: 'replied', label: '답변 완료' },
  { id: 'closed', label: '종결' },
  { id: 'spam', label: '스팸' },
] as const;

/** 상태 배지 색. 팔레트 토큰 밖의 색을 새로 만들지 않는다. */
export const inquiryStatusBadgeClass = (status: InquiryStatus): string => {
  switch (status) {
    case 'new':
      return 'border-[var(--color-accent)] text-[var(--color-accent)]';
    case 'reviewing':
      return 'border-[var(--color-cool)] text-[var(--color-cool)]';
    case 'replied':
      return 'border-[var(--color-warm)] text-[var(--color-warm)]';
    default:
      return 'border-[var(--color-line)] text-[var(--color-muted)]';
  }
};

export const DISCORD_STATUS_LABELS: Record<string, string> = {
  pending: '대기',
  sent: '전송됨',
  failed: '실패',
};
