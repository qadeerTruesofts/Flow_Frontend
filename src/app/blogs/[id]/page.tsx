'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter, useParams } from 'next/navigation'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeRaw from 'rehype-raw'
import { StructuredData, createArticleSchema, createBreadcrumbSchema } from '@/components/StructuredData'
import { siteConfig } from '@/lib/seo-config'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'

interface Article {
  id: number
  title: string
  category: string
  date: string
  image_url: string | null
  content: string | null
  author: string | null
  slug: string
  updated_at?: string
  meta_title?: string | null
  meta_description?: string | null
  meta_keywords?: string | null
  og_image?: string | null
}

export default function ArticleDetailPage() {
  const router = useRouter()
  const params = useParams()
  const slug = params?.id as string  // URL param is still [id] but contains slug
  
  const [article, setArticle] = useState<Article | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (slug) {
      loadArticle()
    }
  }, [slug])

  const loadArticle = async () => {
    try {
      setLoading(true)
      const response = await fetch(`${API_BASE_URL}/api/articles/by-slug/${slug}`)
      
      if (response.ok) {
        const data = await response.json()
        setArticle(data.article)
      } else if (response.status === 404) {
        setError('Article not found')
      } else {
        setError('Failed to load article')
      }
    } catch (error) {
      console.error('Error loading article:', error)
      setError('Error loading article. Please try again.')
    } finally {
      setLoading(false)
    }
  }

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

  const handleGenerateClick = (e: React.MouseEvent) => {
    e.preventDefault()
    router.push('/generate?signin=true')
  }

  // SEO: Generate enhanced structured data for the article
  const articleSchema = article ? {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.meta_title || article.title,
    description: article.meta_description || (article.content ? article.content.replace(/<[^>]*>/g, '').substring(0, 160) : `${article.category} article about AI video generation`),
    image: {
      '@type': 'ImageObject',
      url: article.og_image || getImageUrl(article.image_url),
      width: 1200,
      height: 675,
    },
    datePublished: article.date,
    dateModified: article.updated_at || article.date,
    author: {
      '@type': 'Person',
      name: article.author || 'FlowVideo Team',
    },
    publisher: {
      '@type': 'Organization',
      name: siteConfig.name,
      logo: {
        '@type': 'ImageObject',
        url: `${siteConfig.url}/logo.png`,
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${siteConfig.url}/blogs/${article.slug}`,
    },
    articleSection: article.category,
    keywords: article.meta_keywords || [article.category, 'AI Video', 'Video Generation', 'Artificial Intelligence'].join(', '),
  } : null

  // SEO: Breadcrumb structured data
  const breadcrumbSchema = article ? createBreadcrumbSchema([
    { name: 'Home', url: siteConfig.url },
    { name: 'Blog', url: `${siteConfig.url}/blogs` },
    { name: article.title, url: `${siteConfig.url}/blogs/${article.slug}` },
  ]) : null

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mb-4" role="status" aria-label="Loading"></div>
          <p className="text-gray-600">Loading article...</p>
        </div>
      </div>
    )
  }

  if (error || !article) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Article Not Found</h1>
          <p className="text-gray-600 mb-6">{error || 'The article you are looking for does not exist.'}</p>
          <Link
            href="/blogs"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full hover:opacity-90 transition-all"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Blog
          </Link>
        </div>
      </div>
    )
  }

  return (
    <>
      {/* SEO: Structured Data */}
      {articleSchema && <StructuredData data={articleSchema} />}
      {breadcrumbSchema && <StructuredData data={breadcrumbSchema} />}

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

      {/* Article Container */}
      <article className="pt-24 md:pt-32 pb-20" itemScope itemType="https://schema.org/Article">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Left Side - Article Content (Header + Body) */}
            <div className="lg:col-span-2 space-y-12">
              {/* Article Header Section */}
              <div className="space-y-6">
                {/* Category and Date */}
                <div className="flex flex-wrap items-center gap-4 text-sm">
                  <span className="px-4 py-2 bg-gradient-to-r from-purple-600/20 to-pink-600/20 border border-purple-500/30 rounded-full font-semibold text-purple-700">
                    {article.category}
                  </span>
                  <time className="text-slate-600 flex items-center gap-2" dateTime={article.date} itemProp="datePublished">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    {formatDate(article.date)}
                  </time>
                </div>

                {/* Title */}
                <h1 
                  className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight bg-gradient-to-r from-slate-900 via-indigo-600 to-slate-900 bg-clip-text text-transparent"
                  itemProp="headline"
                >
                  {article.title}
                </h1>


                {/* Featured Image */}
                <div className="relative w-full md:w-3/4 lg:w-2/3 mx-auto aspect-video rounded-2xl overflow-hidden border border-gray-200 shadow-2xl">
                  <Image
                    src={getImageUrl(article.image_url)}
                    alt={`Featured image for ${article.title} - ${article.category} article about AI video generation`}
                    fill
                    sizes="(max-width: 768px) 90vw, (max-width: 1200px) 70vw, 720px"
                    className="object-cover md:object-contain md:p-6 bg-white"
                    priority
                    itemProp="image"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" aria-hidden="true" />
                  <meta itemProp="datePublished" content={article.date} />
                  {article.updated_at && <meta itemProp="dateModified" content={article.updated_at} />}
                  <meta itemProp="author" content={article.author || 'AI Video Generator Team'} />
                </div>
              </div>

              {/* Article Content */}
              {article.content ? (
                <ReactMarkdown
                  className="prose prose-lg max-w-none text-gray-800 mt-8 article-content"
                  remarkPlugins={[remarkGfm]}
                  rehypePlugins={[rehypeRaw]}
                  components={{
                    table: ({node, ...props}) => (
                      <div className="article-table-wrapper">
                        <table {...props} />
                      </div>
                    ),
                  }}
                >
                  {prepareArticleContent(article.content)}
                </ReactMarkdown>
              ) : (
                <div className="mt-8 p-6 bg-gray-50 rounded-lg border border-gray-200">
                  <p className="text-gray-600 italic">No content available for this article.</p>
                </div>
              )}
            </div>

            {/* Right Side - Sticky CTA */}
            <div className="lg:col-span-1">
              <div className="lg:sticky lg:top-32 lg:self-start">
                <div className="relative bg-white border border-slate-200 rounded-2xl p-6 shadow-xl">
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-xl font-bold mb-2 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                        Create Your Video
                      </h3>
                      <p className="text-slate-600 text-sm">
                        Transform your ideas into stunning videos with AI. Free to try!
                      </p>
                    </div>
                    <button
                      onClick={handleGenerateClick}
                      className="block group relative w-full"
                    >
                      <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl opacity-75 group-hover:opacity-100 blur transition-all" />
                      <div className="relative px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl font-bold text-sm hover:scale-105 transition-all shadow-lg shadow-indigo-500/30 flex items-center justify-center gap-2 text-white">
                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                        <span className="text-white">Generate AI Video Free</span>
                        <svg className="w-4 h-4 text-white group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                        </svg>
                      </div>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Back to Blog */}
          <div className="mt-16 pt-8 border-t border-slate-200">
            <Link 
              href="/blogs"
              className="inline-flex items-center gap-2 px-6 py-3 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl transition-all font-semibold text-slate-700"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Blog
            </Link>
          </div>
        </div>
      </article>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-br from-slate-50 via-white to-purple-50" aria-label="Call to action">
        <div className="max-w-4xl mx-auto text-center">
          <div className="p-12 rounded-3xl bg-gradient-to-br from-indigo-600/20 to-purple-600/20 border border-indigo-500/30">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-slate-900 via-indigo-600 to-slate-900 bg-clip-text text-transparent">
              Ready to Create Amazing Videos?
            </h2>
            <p className="text-xl text-slate-700 mb-10">
              Join thousands of creators who are already using AI to bring their ideas to life
            </p>
            <button
              onClick={handleGenerateClick}
              className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full text-lg font-semibold hover:opacity-90 transition-all shadow-2xl shadow-indigo-500/50 text-white border-2 border-indigo-400/50 hover:border-indigo-400"
            >
              Start Creating Now
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </button>
          </div>
        </div>
      </section>
      </div>
    </>
  )
}

const normalizeArticleContent = (content: string) => {
  if (!content) return ''
  let normalized = content.replace(/\|\s*\|/g, '|\n|')
  normalized = normalized.replace(/(\S)\s*\|\s*-\s*-\s*-\s*\|\s*(\S)/g, '$1 |\n| --- | $2') // safeguard
  return normalized
}

const prepareArticleContent = (content: string) => {
  if (!content) return ''
  let prepared = normalizeArticleContent(content)
  prepared = prepared.replace(/\r\n/g, '\n')
  prepared = prepared.replace(/•\s+/g, '- ')
  prepared = prepared.replace(/\t/g, '    ')
  prepared = prepared.replace(/([^\n])\n(?!\n)/g, '$1\n\n')
  return prepared.trim()
}

