import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: '공동육아 어린이집 지출 관리 시스템',
  description: '지출 신청·승인·증빙의 디지털 전환',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  )
}
