import type { Metadata } from 'next';
import { Geist } from 'next/font/google';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: '이북리더기 추천 테스트 | 나에게 맞는 전자책 리더는?',
  description: '3가지 질문으로 찾는 나만의 이북리더기. 독서 성향 분석 후 최적의 전자책 단말기를 추천해드립니다.',
  openGraph: {
    title: '이북리더기 지름신 판독기',
    description: '나에게 맞는 이북리더기 추천 테스트 — 딱 3가지 질문으로 알아보세요',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className={`${geistSans.variable} h-full`} suppressHydrationWarning>
      <body className="min-h-full antialiased" suppressHydrationWarning>{children}</body>
    </html>
  );
}
