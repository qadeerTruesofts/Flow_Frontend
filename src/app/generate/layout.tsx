import { Metadata } from 'next'
import { siteConfig } from '@/lib/seo-config'

export const metadata: Metadata = {
  title: 'Generate Videos with Vidwave | Text to Video AI',
  description: 'Generate professional AI-powered videos instantly from text descriptions. Transform your ideas into stunning videos with Vidwave\'s advanced AI technology. Free to try!',
  keywords: [
    ...siteConfig.keywords,
    'generate video',
    'create video from text',
    'text to video generator',
    'video creation tool',
    'AI video maker online'
  ].join(', '),
  openGraph: {
    title: 'Generate Videos with Vidwave',
    description: 'Generate professional AI-powered videos instantly from text descriptions. Free to try!',
    url: `${siteConfig.url}/generate`,
    type: 'website',
    images: [{
      url: `${siteConfig.url}/og-image.jpg`,
      width: 1200,
      height: 630,
      alt: 'Vidwave - Generate AI Videos',
    }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Generate Videos with Vidwave',
    description: 'Generate professional AI-powered videos instantly from text descriptions. Free to try!',
    images: [`${siteConfig.url}/og-image.jpg`],
  },
  alternates: {
    canonical: '/generate',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function GenerateLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}

