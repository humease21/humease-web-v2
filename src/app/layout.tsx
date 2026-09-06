import type { Metadata } from 'next';
import { Noto_Sans_KR, Source_Serif_4 } from 'next/font/google';
import { company } from '@/content/company';
import './globals.css';

const sourceSerif = Source_Serif_4({
  subsets: ['latin'], display: 'swap', variable: '--font-source-serif', weight: ['400'],
});
const notoSansKr = Noto_Sans_KR({
  subsets: ['latin'], display: 'swap', variable: '--font-noto-sans-kr', weight: ['400', '500'],
});

export const metadata: Metadata = {
  metadataBase: new URL(company.siteUrl),
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
