import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import ArticlePageClient, { Article } from './ArticlePageClient'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'
const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || 'https://desirable-reflection-production-aa8a.up.railway.app').replace(/\/$/, '')
const DEFAULT_DESCRIPTION =
  'Vidwave turns your ideas into captivating AI-generated videos in minutes. Explore tutorials, workflows, and inspiration from the Vidwave team.'
const DEFAULT_KEYWORDS = ['Vidwave', 'AI video generator', 'text to video', 'Veo 3', 'AI storytelling']
const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=1200&h=630&fit=crop'

export const revalidate = 0

interface ArticlesResponse {
  articles?: Article[]
}

async function fetchArticles(): Promise<Article[]> {
  const response = await fetch(`${API_BASE_URL}/api/articles`, {
    cache: 'no-store'
  })

  if (!response.ok) {
    throw new Error(`Failed to fetch articles: ${response.status}`)
  }

  const data = (await response.json()) as ArticlesResponse
  return data.articles || []
}

async function getArticleData(slug: string): Promise<{ article: Article | null; related: Article[] }> {
  const articles = await fetchArticles()
  const article = articles.find((item) => item.slug === slug) || null

  if (!article) {
    return { article: null, related: [] }
  }

  const related = articles
    .filter((item) => item.category === article.category && item.id !== article.id)
    .slice(0, 3)

  return { article, related }
}

function resolveKeywords(metaKeywords?: string | null): string[] {
  if (!metaKeywords) {
    return DEFAULT_KEYWORDS
  }
  return metaKeywords
    .split(',')
    .map((keyword) => keyword.trim())
    .filter(Boolean)
}

function resolveImageUrl(imageUrl?: string | null): string {
  if (!imageUrl) return FALLBACK_IMAGE
  if (imageUrl.startsWith('http')) return imageUrl
  return `${API_BASE_URL}${imageUrl}`
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  try {
    const { article } = await getArticleData(params.slug)

    if (!article) {
      return {
        title: 'Article Not Found | Vidwave',
        description: DEFAULT_DESCRIPTION
      }
    }

    const title = article.meta_title?.trim() || `${article.title} | Vidwave`
    const description = article.meta_description?.trim() || DEFAULT_DESCRIPTION
    const keywords = resolveKeywords(article.meta_keywords)
    const url = `${SITE_URL}/${article.slug}`
    const imageUrl = resolveImageUrl(article.image_url)

    return {
      title,
      description,
      keywords,
      alternates: {
        canonical: url
      },
      openGraph: {
        title,
        description,
        url,
        type: 'article',
        siteName: 'Vidwave',
        images: [
          {
            url: imageUrl,
            width: 1200,
            height: 630,
            alt: article.title
          }
        ]
      },
      twitter: {
        card: 'summary_large_image',
        title,
        description,
        images: [imageUrl]
      }
    }
  } catch (error) {
    console.error('Failed to generate metadata for article', params.slug, error)
    return {
      title: 'Vidwave Blog',
      description: DEFAULT_DESCRIPTION,
      keywords: DEFAULT_KEYWORDS
    }
  }
}

export default async function BlogPostPage({ params }: { params: { slug: string } }) {
  const { article, related } = await getArticleData(params.slug)

  if (!article) {
    notFound()
  }

  return <ArticlePageClient article={article} relatedArticles={related} />
}

