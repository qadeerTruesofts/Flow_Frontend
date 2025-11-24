import { Metadata } from 'next'
import { siteConfig } from '@/lib/seo-config'

export const metadata: Metadata = {
  title: 'Blog - AI Video Generation Guides, Tutorials & Tips',
  description: 'Discover expert insights, tutorials, and the latest updates in AI video technology. Learn how to create stunning videos with AI, best practices, and industry trends.',
  keywords: [
    ...siteConfig.keywords,
    'AI video blog',
    'video creation tutorials',
    'AI video guides',
    'video marketing tips',
    'video editing tutorials',
    'content creation blog'
  ].join(', '),
  openGraph: {
    title: 'Blog - AI Video Generation Guides & Tutorials | Vidwave',
    description: 'Discover expert insights, tutorials, and the latest updates in AI video technology.',
    url: `${siteConfig.url}/blogs`,
    type: 'website',
    images: [{
      url: `${siteConfig.url}/og-image.jpg`,
      width: 1200,
      height: 630,
      alt: 'Vidwave Blog - AI Video Guides',
    }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Blog - AI Video Generation Guides & Tutorials | Vidwave',
    description: 'Discover expert insights, tutorials, and the latest updates in AI video technology.',
    images: [`${siteConfig.url}/og-image.jpg`],
  },
  alternates: {
    canonical: '/blogs',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function BlogsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}

