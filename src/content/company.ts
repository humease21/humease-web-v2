/**
 * 공개 회사 정보.
 * G0 에서 대표자·사업자등록번호·주소는 승인본이 확인되지 않았다.
 * docs/03 §13: 미확인 상태에서 가짜 값이나 '추후 입력'을 공개하지 않는다.
 * 따라서 확인된 값만 둔다. 승인 후 이 파일에만 추가하면 된다.
 */
export const company = {
  nameKo: '주식회사 휴미즈',
  nameEn: 'HUMEASE',
  email: 'contact@humease.com',
  blogUrl: 'https://blog.humease.com/',
  siteUrl: 'https://www.humease.com',
  // 승인 전까지 비워 둔다. 렌더링 측에서 값이 있을 때만 표시한다.
  representative: null as string | null,
  businessNumber: null as string | null,
  address: null as string | null,
} as const;
