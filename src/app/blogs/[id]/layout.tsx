import { Metadata } from 'next'
import { siteConfig } from '@/lib/seo-config'
import { generateMetadata as generateMetadataHelper } from '@/lib/generate-metadata'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'

interface Article {
  id: number
  title: string
  slug: string
  category: string
  date: string
  image_url: string | null
  content: string | null
  author: string | null
  updated_at?: string
  meta_title?: string | null
  meta_description?: string | null
  meta_keywords?: string | null
  og_image?: string | null
}

async function getArticle(slug: string): Promise<Article | null> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/articles/by-slug/${slug}`, {
      next: { revalidate: 60 } // Revalidate every 60 seconds
    })
    
    if (response.ok) {
      const data = await response.json()
      return data.article
    }
    return null
  } catch (error) {
    console.error('Error fetching article for metadata:', error)
    return null
  }
}

function getImageUrl(imageUrl: string | null, apiBaseUrl: string): string {
  if (!imageUrl) return siteConfig.ogImage
  if (imageUrl.startsWith('http')) return imageUrl
  return `${apiBaseUrl}${imageUrl}`
}

function stripHtmlTags(html: string | null): string {
  if (!html) return ''
  return html.replace(/<[^>]*>/g, '').trim()
}

function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  return text.substring(0, maxLength).trim() + '...'
}

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const slug = params.id
  const article = await getArticle(slug)

  if (!article) {
    // Fallback metadata if article not found
    return {
      title: 'Article Not Found',
      description: siteConfig.description,
      robots: {
        index: false,
        follow: false,
      },
    }
  }

  // Use article SEO fields or fallback to defaults
  const metaTitle = article.meta_title || article.title
  const metaDescription = article.meta_description || 
    truncateText(stripHtmlTags(article.content) || `${article.category} article about AI video generation`, 160)
  const metaImage = article.og_image || getImageUrl(article.image_url, API_BASE_URL)
  
  // Process keywords
  let keywords: string[] = [...siteConfig.keywords]
  if (article.meta_keywords) {
    keywords = [...keywords, ...article.meta_keywords.split(',').map(k => k.trim())]
  }
  keywords.push(article.category)

  const canonical = `${siteConfig.url}/${article.slug}`
  const publishedTime = article.date
  const modifiedTime = article.updated_at || article.date

  return generateMetadataHelper({
    title: metaTitle,
    description: metaDescription,
    image: metaImage,
    keywords: keywords,
    canonical: canonical,
    type: 'article',
    publishedTime: publishedTime,
    modifiedTime: modifiedTime,
    authors: article.author ? [article.author] : undefined,
  })
}

export default function ArticleLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}

