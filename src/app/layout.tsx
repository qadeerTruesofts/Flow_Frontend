import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'AI Video Generator - Create Amazing Videos with AI',
  description: 'Transform your text and images into stunning videos using AI. Fast, easy, and professional video generation for everyone.',
  metadataBase: new URL('http://localhost:3002'),
  keywords: 'AI video generator, text to video, image to video, AI video creation, video generation',
  openGraph: {
    title: 'AI Video Generator - Create Amazing Videos with AI',
    description: 'Transform your text and images into stunning videos using AI. Fast, easy, and professional video generation for everyone.',
    type: 'website',
    locale: 'en_US',
    siteName: 'AI Video Generator'
  }
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {children}
      </body>
    </html>
  )
}