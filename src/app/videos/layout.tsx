import { Metadata } from 'next'
import { siteConfig } from '@/lib/seo-config'

export const metadata: Metadata = {
  title: 'My Videos - Manage Your AI-Generated Videos',
  description: 'View and manage all your AI-generated videos in one place. Access your video library, download videos, and create new content with Vidwave.',
  keywords: [
    ...siteConfig.keywords,
    'video library',
    'my videos',
    'video management',
    'download videos',
    'video portfolio'
  ].join(', '),
  openGraph: {
    title: 'My Videos - Vidwave',
    description: 'View and manage all your AI-generated videos in one place.',
    url: `${siteConfig.url}/videos`,
    type: 'website',
    images: [{
      url: `${siteConfig.url}/og-image.jpg`,
      width: 1200,
      height: 630,
      alt: 'Vidwave - My Videos',
    }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'My Videos - Vidwave',
    description: 'View and manage all your AI-generated videos in one place.',
    images: [`${siteConfig.url}/og-image.jpg`],
  },
  alternates: {
    canonical: '/videos',
  },
  robots: {
    index: false, // User-specific content, don't index
    follow: true,
  },
}

export default function VideosLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}

