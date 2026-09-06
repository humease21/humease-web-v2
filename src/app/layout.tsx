import type { Metadata } from 'next';
import localFont from 'next/font/local';
import { Source_Serif_4 } from 'next/font/google';
import { company } from '@/content/company';
import { searchIndexingEnabled } from '@/lib/search-config';
import './globals.css';

const sourceSerif = Source_Serif_4({
  subsets: ['latin'], display: 'swap', variable: '--font-source-serif', weight: ['400'],
});
/*
 * next/font/google 의 Noto Sans KR 은 unicode-range 청크마다 @font-face 를 만들어
 * 248개 · 150KB 의 렌더 블로킹 CSS 를 생성했다(gzip 51KB). 공개 카피가 고정된
 * 마케팅 사이트에서는 낭비이므로, 실제 사용 글자만 담은 가변 서브셋을 self-host 한다.
 * 디자인 지정 폰트(docs/02 §3)는 그대로 Noto Sans KR 이다.
 * 카피를 바꾸면 `npm run subset:font` 를 다시 실행해야 한다.
 */
const notoSansKr = localFont({
  src: '../../public/fonts/noto-sans-kr-subset.woff2',
  display: 'swap',
  variable: '--font-noto-sans-kr',
  weight: '400 500',
});

export const metadata: Metadata = {
  metadataBase: new URL(company.siteUrl),
  /*
   * 기본은 색인하지 않는다. basePath 가 비었다는 이유만으로 공개되지 않는다.
   * 배포 대상이 production 이고 색인 승인이 명시된 경우에만 열린다(요청서 §4.1).
   * 크롤링은 막지 않는다 — noindex 를 읽을 수 있어야 하기 때문이다.
   */
  robots: searchIndexingEnabled ? { index: true, follow: true } : { index: false, follow: true },
  // 기존 운영 사이트의 네이버 사이트 인증을 승계한다(공개 토큰).
  verification: { other: { 'naver-site-verification': '62dfd1cc3f11d99cb7e0e258f9c59a97b0666e76' } },
  title: { default: '휴미즈 | Enterprise Data & Applied AI', template: '%s' },
  description:
    '기업 데이터의 보존·검색·통제부터 AI 서비스 설계와 구현까지. 휴미즈의 Enterprise Data, Applied AI, 맘이음 프로젝트를 만나보세요.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko" className={`${sourceSerif.variable} ${notoSansKr.variable}`}>
      <body>{children}</body>
    </html>
  );
}
