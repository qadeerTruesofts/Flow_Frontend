// SEO Configuration for AI Video Generator

const DEFAULT_SITE_URL = 'https://desirable-reflection-production-aa8a.up.railway.app'

export const siteConfig = {
  name: 'Vidwave - AI Video Generator',
  description: 'Create stunning AI-powered videos in seconds. Transform your ideas into professional videos with Vidwave\'s advanced AI video generation technology. Free to start, no credit card required. Trusted by 50,000+ creators worldwide.',
  url: process.env.NEXT_PUBLIC_SITE_URL || DEFAULT_SITE_URL,
  ogImage: `${process.env.NEXT_PUBLIC_SITE_URL || DEFAULT_SITE_URL}/og-image.jpg`,
  twitterHandle: '@Vidwave',
  locale: 'en_US',
  keywords: [
    'AI video generator',
    'text to video AI',
    'AI video creation',
    'video generator online',
    'free AI video maker',
    'artificial intelligence video',
    'automated video creation',
    'AI video editing',
    'video generation tool',
    'AI content creation',
    'video marketing AI',
    'professional video maker',
    'Vidwave',
    'create video with AI',
    'AI video software',
    'online video generator',
    'text to video converter',
    'AI video maker free',
    'generate videos from text',
    'automated video production',
    'AI video platform',
    'video creation AI',
    'smart video generator',
    'AI powered video maker'
  ],
  authors: [
    {
      name: 'AI Video Generator',
      url: process.env.NEXT_PUBLIC_SITE_URL || DEFAULT_SITE_URL,
    },
  ],
}

export const jsonLdWebsite = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: siteConfig.name,
  description: siteConfig.description,
  url: siteConfig.url,
  potentialAction: {
    '@type': 'SearchAction',
    target: {
      '@type': 'EntryPoint',
      urlTemplate: `${siteConfig.url}/blog?search={search_term_string}`,
    },
    'query-input': 'required name=search_term_string',
  },
}

export const jsonLdOrganization = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: siteConfig.name,
  description: siteConfig.description,
  url: siteConfig.url,
  logo: {
    '@type': 'ImageObject',
    url: `${siteConfig.url}/logo.png`,
    width: 512,
    height: 512,
  },
  contactPoint: {
    '@type': 'ContactPoint',
    contactType: 'Customer Service',
    availableLanguage: 'English',
  },
  sameAs: [
    'https://twitter.com/flowvideo',
    'https://facebook.com/flowvideo',
    'https://linkedin.com/company/flowvideo',
    'https://instagram.com/flowvideo',
  ],
  aggregateRating: {
    '@type': 'AggregateRating',
    ratingValue: '4.8',
    ratingCount: '1250',
    bestRating: '5',
    worstRating: '1',
  },
}

export const jsonLdSoftwareApplication = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: siteConfig.name,
  applicationCategory: 'MultimediaApplication',
  operatingSystem: 'Web Browser',
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'USD',
  },
  aggregateRating: {
    '@type': 'AggregateRating',
    ratingValue: '4.8',
    ratingCount: '1250',
  },
  description: siteConfig.description,
  url: siteConfig.url,
}

