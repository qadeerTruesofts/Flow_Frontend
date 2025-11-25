// SEO configuration for Vidwave

const DEFAULT_SITE_URL = 'https://vidwave.ai'

export const siteConfig = {
  name: 'Vidwave',
  description:
    'Vidwave is the AI-first studio that turns text prompts into premium, production-ready videos in seconds. No editing skills required.',
  url: (process.env.NEXT_PUBLIC_SITE_URL || DEFAULT_SITE_URL).replace(/\/$/, ''),
  ogImage: `${(process.env.NEXT_PUBLIC_SITE_URL || DEFAULT_SITE_URL).replace(/\/$/, '')}/og-image.jpg`,
  twitterHandle: '@vidwaveai',
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
      name: 'Vidwave Team',
      url: (process.env.NEXT_PUBLIC_SITE_URL || DEFAULT_SITE_URL).replace(/\/$/, ''),
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
    'https://twitter.com/vidwaveai',
    'https://www.facebook.com/vidwaveai',
    'https://www.linkedin.com/company/vidwaveai',
    'https://www.instagram.com/vidwaveai',
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

