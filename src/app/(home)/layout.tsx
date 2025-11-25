import { Metadata } from 'next'
import { siteConfig } from '@/lib/seo-config'

export const metadata: Metadata = {
  title: 'Vidwave | AI Video Studio',
  description: 'Vidwave lets you turn ideas into premium AI-generated videos in seconds. Launch campaigns faster with cinematic renders, voiceovers, and motion graphics—no editing skills required.',
  keywords: [
    ...siteConfig.keywords,
    'free video generator',
    'online video maker',
    'create videos online',
    'video production AI',
    'automated video creation tool',
    'text to video converter',
    'AI video maker',
    'video generator free'
  ].join(', '),
  openGraph: {
    title: 'Vidwave | AI Video Studio',
    description: 'Transform your ideas into professional videos in seconds with Vidwave\'s advanced AI technology. Free to start, trusted by 50,000+ creators.',
    url: siteConfig.url,
    type: 'website',
    siteName: siteConfig.name,
    images: [{
      url: siteConfig.ogImage,
      width: 1200,
      height: 630,
      alt: 'Vidwave | AI Video Studio',
    }],
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Vidwave | AI Video Studio',
    description: 'Transform your ideas into professional videos in seconds. Free to start, trusted by 50,000+ creators.',
    images: [siteConfig.ogImage],
    creator: siteConfig.twitterHandle,
    site: siteConfig.twitterHandle,
  },
  alternates: {
    canonical: '/',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
}

export default function HomeLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}

