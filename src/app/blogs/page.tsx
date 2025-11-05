'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { StructuredData, createBreadcrumbSchema } from '@/components/StructuredData'
import { siteConfig } from '@/lib/seo-config'

const API_BASE_URL = 'http://localhost:8080'

interface Article {
  id: number
  title: string
  slug: string
  category: string
  date: string
  image_url: string | null
  content: string | null
  author: string | null
}

export default function BlogPage() {
  const router = useRouter()
  const [articles, setArticles] = useState<Article[]>([])
  const [categories, setCategories] = useState<string[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    loadArticles()
    extractCategories()
  }, [])

  useEffect(() => {
    // When category changes, articles are already filtered client-side
    // This could be optimized to filter on backend
  }, [selectedCategory])

  const loadArticles = async () => {
    try {
      setLoading(true)
      const response = await fetch(`${API_BASE_URL}/api/articles`)
      
      if (response.ok) {
        const data = await response.json()
        setArticles(data.articles || [])
        extractCategories(data.articles || [])
      } else {
        setError('Failed to load articles')
      }
    } catch (error) {
      console.error('Error loading articles:', error)
      setError('Error loading articles. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const extractCategories = (articleList: Article[] = articles) => {
    const uniqueCategories = Array.from(new Set(articleList.map(article => article.category)))
    setCategories(uniqueCategories.sort())
  }

  const filteredArticles = selectedCategory
    ? articles.filter(article => article.category === selectedCategory)
    : articles

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const getImageUrl = (imageUrl: string | null) => {
    if (!imageUrl) return 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=1200&h=600&fit=crop'
    if (imageUrl.startsWith('http')) return imageUrl
    return `${API_BASE_URL}${imageUrl}`
  }

  // Breadcrumb structured data for SEO
  const breadcrumbSchema = createBreadcrumbSchema([
    { name: 'Home', url: siteConfig.url },
    { name: 'Blog', url: `${siteConfig.url}/blogs` },
  ])

  // Article list structured data
  const articleListSchema = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'AI Video Generation Articles & Guides',
    description: 'Explore our comprehensive collection of articles about AI video generation, tutorials, and industry insights.',
    url: `${siteConfig.url}/blogs`,
    mainEntity: {
      '@type': 'ItemList',
      itemListElement: articles.map((article, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        url: `${siteConfig.url}/blogs/${article.slug}`,
        name: article.title,
      })),
    },
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mb-4" role="status" aria-label="Loading"></div>
          <p className="text-gray-600">Loading articles...</p>
        </div>
      </div>
    )
  }

  return (
    <>
      {/* SEO Structured Data */}
      <StructuredData data={breadcrumbSchema} />
      {articles.length > 0 && <StructuredData data={articleListSchema} />}

      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-purple-50">
      {/* Premium Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-xl border-b border-slate-200/60" role="navigation" aria-label="Main navigation">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <Link href="/" className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-500/30">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
                FlowVideo
              </span>
            </Link>
            
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="pt-24 md:pt-32 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">AI Video Generation Articles & Guides</h1>
            <p className="text-lg text-gray-600">Discover expert insights, tutorials, and the latest updates in AI video technology</p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-8">
              <p className="text-red-600">{error}</p>
            </div>
          )}

          {/* Category Filter */}
          {categories.length > 0 && (
            <div className="mb-8">
              <div className="flex flex-wrap gap-3">
                <Link
                  href="/blogs"
                  className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                    !selectedCategory
                      ? 'bg-indigo-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-200'
                  }`}
                  aria-label="Show all articles"
                >
                  All Articles
                </Link>
                {categories.map((category) => (
                  <Link
                    key={category}
                    href={`/blogs/category/${encodeURIComponent(category)}`}
                    className="px-4 py-2 rounded-full text-sm font-semibold transition-all bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-200 hover:border-indigo-300"
                    aria-label={`View ${category} articles`}
                  >
                    {category}
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Newest Articles Section */}
          {filteredArticles.length > 0 && (
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Latest AI Video Articles</h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6" role="list">
                {filteredArticles.slice(0, 6).map((article) => (
                  <Link
                    key={article.id}
                    href={`/blogs/${article.slug}`}
                    className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200 hover:border-purple-500/30 hover:shadow-xl transition-all group"
                  >
                    {/* Article Image */}
                    <div className="relative w-full aspect-video overflow-hidden">
                      <Image
                        src={getImageUrl(article.image_url)}
                        alt={`${article.title} - ${article.category} Article`}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                            <Link 
                              href={`/blogs/category/${encodeURIComponent(article.category)}`}
                              onClick={(e) => e.stopPropagation()}
                              className="absolute top-4 left-4 px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full text-xs font-semibold text-indigo-700 hover:bg-white hover:text-indigo-900 transition-colors z-10"
                            >
                              {article.category}
                            </Link>
                    </div>
                    
                    {/* Article Info */}
                    <div className="p-6">
                      <div className="mb-3">
                        <time className="text-xs text-slate-500" dateTime={article.date} itemProp="datePublished">
                          {formatDate(article.date)}
                        </time>
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-purple-600 transition-colors">
                        {article.title}
                      </h3>
                      {article.content && (
                        <p className="text-gray-600 text-sm line-clamp-3">
                          {article.content.replace(/<[^>]*>/g, '').substring(0, 150)}...
                        </p>
                      )}
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* All Articles Grid */}
          {filteredArticles.length > 6 && (
            <div>
              <h2 className="text-2xl font-bold text-slate-900 mb-6">All Articles</h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredArticles.slice(6).map((article) => (
                  <Link
                    key={article.id}
                    href={`/blogs/${article.slug}`}
                    className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200 hover:border-purple-500/30 hover:shadow-xl transition-all group"
                  >
                    {/* Article Image */}
                    <div className="relative w-full aspect-video overflow-hidden">
                      <Image
                        src={getImageUrl(article.image_url)}
                        alt={`${article.title} - ${article.category} Article`}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                            <Link 
                              href={`/blogs/category/${encodeURIComponent(article.category)}`}
                              onClick={(e) => e.stopPropagation()}
                              className="absolute top-4 left-4 px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full text-xs font-semibold text-indigo-700 hover:bg-white hover:text-indigo-900 transition-colors z-10"
                            >
                              {article.category}
                            </Link>
                    </div>
                    
                    {/* Article Info */}
                    <div className="p-6">
                      <div className="mb-3">
                        <time className="text-xs text-slate-500" dateTime={article.date} itemProp="datePublished">
                          {formatDate(article.date)}
                        </time>
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-purple-600 transition-colors">
                        {article.title}
                      </h3>
                      {article.content && (
                        <p className="text-gray-600 text-sm line-clamp-3">
                          {article.content.replace(/<[^>]*>/g, '').substring(0, 150)}...
                        </p>
                      )}
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* No Articles Found */}
          {filteredArticles.length === 0 && !loading && (
            <div className="bg-white rounded-2xl shadow-lg p-12 text-center border border-gray-200">
              <svg className="w-24 h-24 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <h3 className="text-xl font-bold text-gray-900 mb-2">No Articles Found</h3>
              <p className="text-gray-600">
                {selectedCategory ? `No articles found in category "${selectedCategory}"` : 'No articles available yet'}
              </p>
            </div>
          )}
        </div>
      </main>
      </div>

    </>
  )
}

