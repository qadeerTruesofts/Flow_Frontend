import { Metadata } from 'next'
import { siteConfig } from '@/lib/seo-config'

export async function generateMetadata({ params }: { params: { category: string } }): Promise<Metadata> {
  const categoryName = decodeURIComponent(params.category || '')
  
  return {
    title: `${categoryName} Articles - AI Video Generation Guides | ${siteConfig.name}`,
    description: `Explore expert ${categoryName} articles about AI video generation. Learn best practices, tutorials, and tips for creating stunning videos with AI technology.`,
    keywords: [
      ...siteConfig.keywords,
      categoryName.toLowerCase(),
      `${categoryName} tutorial`,
      `${categoryName} guide`,
      'AI video articles',
    ].join(', '),
    openGraph: {
      title: `${categoryName} Articles - AI Video Generation | ${siteConfig.name}`,
      description: `Explore expert ${categoryName} articles about AI video generation. Learn best practices and tutorials.`,
      url: `${siteConfig.url}/blogs/category/${encodeURIComponent(categoryName)}`,
      type: 'website',
      images: [{
        url: siteConfig.ogImage,
        width: 1200,
        height: 630,
        alt: `${categoryName} - AI Video Generation Articles`,
      }],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${categoryName} Articles - AI Video Generation`,
      description: `Explore expert ${categoryName} articles about AI video generation.`,
      images: [siteConfig.ogImage],
    },
    alternates: {
      canonical: `/blogs/category/${encodeURIComponent(categoryName)}`,
    },
    robots: {
      index: true,
      follow: true,
    },
  }
}

export default function CategoryLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}

