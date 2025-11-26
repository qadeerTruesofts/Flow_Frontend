import { Metadata } from 'next'
import { siteConfig } from '@/lib/seo-config'

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  // This route always returns 404, so return appropriate metadata
  return {
    title: 'Page Not Found',
    description: siteConfig.description,
    robots: {
      index: false,
      follow: false,
    },
  }
}

export default function ArticleLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}

