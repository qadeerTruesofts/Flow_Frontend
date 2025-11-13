import { Metadata } from 'next'
import { siteConfig } from './seo-config'

interface GenerateMetadataProps {
  title?: string
  description?: string
  image?: string
  keywords?: string[]
  noIndex?: boolean
  canonical?: string
  type?: 'website' | 'article' | 'profile'
  publishedTime?: string
  modifiedTime?: string
  authors?: string[]
}

export function generateMetadata({
  title,
  description,
  image,
  keywords,
  noIndex = false,
  canonical,
  type = 'website',
  publishedTime,
  modifiedTime,
  authors,
}: GenerateMetadataProps = {}): Metadata {
  const metaTitle = title ? `${title} | ${siteConfig.name}` : siteConfig.name
  const metaDescription = description || siteConfig.description
  const metaImage = image || siteConfig.ogImage
  const metaKeywords = keywords ? [...siteConfig.keywords, ...keywords] : siteConfig.keywords

  return {
    title: metaTitle,
    description: metaDescription,
    keywords: metaKeywords.join(', '),
    authors: authors 
      ? authors.map(name => ({ name }))
      : siteConfig.authors,
    creator: siteConfig.name,
    publisher: siteConfig.name,
    formatDetection: {
      email: false,
      address: false,
      telephone: false,
    },
    metadataBase: new URL(siteConfig.url),
    alternates: {
      canonical: canonical || '/',
    },
    openGraph: {
      title: metaTitle,
      description: metaDescription,
      url: canonical || siteConfig.url,
      siteName: siteConfig.name,
      images: [
        {
          url: metaImage,
          width: 1200,
          height: 630,
          alt: metaTitle,
        },
      ],
      locale: 'en_US',
      type: type,
      ...(type === 'article' && publishedTime && {
        publishedTime,
        modifiedTime,
        authors: authors || ['AI Video Generator'],
      }),
    },
    twitter: {
      card: 'summary_large_image',
      title: metaTitle,
      description: metaDescription,
      images: [metaImage],
      creator: siteConfig.twitterHandle,
      site: siteConfig.twitterHandle,
    },
    robots: {
      index: !noIndex,
      follow: !noIndex,
      googleBot: {
        index: !noIndex,
        follow: !noIndex,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    verification: {
      google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
      yandex: process.env.NEXT_PUBLIC_YANDEX_VERIFICATION,
      other:{
      bing: process.env.NEXT_PUBLIC_BING_VERIFICATION,
      },
    },
  }
}

