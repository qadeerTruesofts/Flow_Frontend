import { Metadata } from 'next'
import { siteConfig } from '@/lib/seo-config'

export const metadata: Metadata = {
  title: 'Profile - Manage Your FlowVideo Account',
  description: 'Manage your FlowVideo account settings, view your video history, and update your profile information.',
  keywords: [
    ...siteConfig.keywords,
    'user profile',
    'account settings',
    'video history'
  ].join(', '),
  openGraph: {
    title: 'Profile - FlowVideo',
    description: 'Manage your FlowVideo account settings and view your video history.',
    url: `${siteConfig.url}/profile`,
    type: 'website',
    images: [{
      url: `${siteConfig.url}/og-image.jpg`,
      width: 1200,
      height: 630,
      alt: 'FlowVideo - Profile',
    }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Profile - FlowVideo',
    description: 'Manage your FlowVideo account settings and view your video history.',
    images: [`${siteConfig.url}/og-image.jpg`],
  },
  alternates: {
    canonical: '/profile',
  },
  robots: {
    index: false, // User-specific content, don't index
    follow: true,
  },
}

export default function ProfileLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}

