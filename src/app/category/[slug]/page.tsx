import { notFound } from 'next/navigation'
import CategoryPageClient from './CategoryPageClient'

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
  meta_description?: string
  meta_keywords?: string
}

const slugify = (text: string) => {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-')
}

async function getCategoryData(slug: string) {
  try {
    const response = await fetch(`${API_BASE_URL}/api/articles`, {
      next: { revalidate: 60 } // Revalidate every 60 seconds
    })
    
    if (!response.ok) {
      return null
    }
    
    const data = await response.json()
    const allArticles: Article[] = data.articles || []
    
    // Get all unique categories from articles
    const allCategories = Array.from(new Set(allArticles.map((article: Article) => article.category).filter((cat): cat is string => Boolean(cat))))
    const categorySlugs = allCategories.map(cat => slugify(cat))
    
    // Check if the requested category slug exists
    const categoryExists = categorySlugs.includes(slug)
    
    if (!categoryExists) {
      return null
    }
    
    // Filter articles by category slug
    const filteredArticles = allArticles.filter(
      (article: Article) => slugify(article.category) === slug
    )
    
    // Get the actual category name from filtered articles or find it from allCategories
    const categoryName = filteredArticles.length > 0 
      ? filteredArticles[0].category 
      : (allCategories.find(cat => slugify(cat) === slug) || '')
    
    return {
      categoryName,
      articles: filteredArticles
    }
  } catch (error) {
    console.error('Error fetching category data:', error)
    return null
  }
}

export default async function CategoryPage({ params }: { params: { slug: string } }) {
  const categoryData = await getCategoryData(params.slug)

  if (!categoryData) {
    notFound()
  }

  return (
    <CategoryPageClient 
      slug={params.slug}
      categoryName={categoryData.categoryName}
      articles={categoryData.articles}
    />
  )
}
