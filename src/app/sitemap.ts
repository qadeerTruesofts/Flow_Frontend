import { MetadataRoute } from 'next'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://desirable-reflection-production-aa8a.up.railway.app'

async function getArticles() {
  try {
    const response = await fetch(`${API_BASE_URL}/api/articles`, {
      next: { revalidate: 3600 }, // Revalidate every hour
    })
    if (!response.ok) return []
    const data = await response.json()
    return data.articles || []
  } catch (error) {
    console.error('Error fetching articles for sitemap:', error)
    return []
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const articles = await getArticles()

  // Static pages
  const staticPages = [
    {
      url: SITE_URL,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 1.0,
    },
    {
      url: `${SITE_URL}/generate`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/blogs`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.9,
    },
  ]

  // Dynamic article pages - use /{slug} instead of /blogs/{slug}
  const articlePages = articles.map((article: any) => ({
    url: `${SITE_URL}/${article.slug || article.id}`,
    lastModified: new Date(article.updated_at || article.date || new Date()),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }))

  // Category pages
  const categories = Array.from(new Set(articles.map((article: any) => article.category).filter(Boolean)))
  const categoryPages = categories.map((category: string) => ({
    url: `${SITE_URL}/blogs/category/${encodeURIComponent(category)}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.6,
  }))

  return [...staticPages, ...articlePages, ...categoryPages]
}

