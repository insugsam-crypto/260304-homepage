import type { Metadata, Viewport } from 'next'
import { Inter, Playfair_Display } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { Toaster } from 'sonner'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
})

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
})

export const metadata: Metadata = {
  title: '프리미엄 브랜드 스튜디오',
  description: '당신의 비즈니스를 특별한 높이로 끌어올리는 프리미엄 브랜드 경험을 창조합니다.',
  openGraph: {
    title: '프리미엄 브랜드 스튜디오',
    description: '당신의 비즈니스를 특별한 높이로 끌어올리는 프리미엄 브랜드 경험을 창조합니다.',
    type: 'website',
  },
}

export const viewport: Viewport = {
  themeColor: '#1C1C1C',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ko" className={`${inter.variable} ${playfair.variable}`}>
      <body className="font-sans antialiased">
        {children}
        <Toaster
          position="top-center"
          toastOptions={{
            style: {
              background: '#242424',
              color: '#F5F0E8',
              border: '1px solid #3A3A3A',
            },
          }}
        />
        <Analytics />
      </body>
    </html>
  )
}
