'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useParams } from 'next/navigation'
import dynamic from 'next/dynamic'

// Lazy load components
const LoginPopup = dynamic(() => import('@/components/LoginPopup'), {
  ssr: false
})
const MobileMenu = dynamic(() => import('@/components/MobileMenu'), {
  ssr: false
})

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

export default function BlogPostPage() {
  const params = useParams()
  const slug = params.slug as string
  
  const [article, setArticle] = useState<Article | null>(null)
  const [relatedArticles, setRelatedArticles] = useState<Article[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [isLoginOpen, setIsLoginOpen] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [userEmail, setUserEmail] = useState('')

  useEffect(() => {
    if (slug) {
      loadArticle()
      checkAuth()
    }
  }, [slug])

  const checkAuth = async () => {
    try {
      const token = localStorage.getItem('access_token')
      if (!token) {
        setIsLoggedIn(false)
        return
      }

      const response = await fetch(`${API_BASE_URL}/api/auth/me`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        const data = await response.json()
        setIsLoggedIn(true)
        setUserEmail(data.user.email)
      } else {
        setIsLoggedIn(false)
        localStorage.removeItem('access_token')
      }
    } catch (error) {
      setIsLoggedIn(false)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('access_token')
    setIsLoggedIn(false)
    setUserEmail('')
  }

  const openLogin = useCallback(() => {
    setIsLoginOpen(true)
  }, [])
  
  const closeLogin = useCallback(() => {
    setIsLoginOpen(false)
  }, [])
  
  const openMobileMenu = useCallback(() => {
    setIsMobileMenuOpen(true)
  }, [])
  
  const closeMobileMenu = useCallback(() => {
    setIsMobileMenuOpen(false)
  }, [])

  const loadArticle = async () => {
    try {
      setLoading(true)
      
      // Fetch all articles first
      const response = await fetch(`${API_BASE_URL}/api/articles`)
      
      if (response.ok) {
        const data = await response.json()
        const articles = data.articles || []
        
        // Find the article with matching slug
        const foundArticle = articles.find((a: Article) => a.slug === slug)
        
        if (foundArticle) {
          setArticle(foundArticle)
          
          // Get related articles from same category
          const related = articles
            .filter((a: Article) => a.category === foundArticle.category && a.id !== foundArticle.id)
            .slice(0, 3)
          setRelatedArticles(related)
        } else {
          setError('Article not found')
        }
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

  const slugify = (text: string) => {
    return text
      .toString()
      .toLowerCase()
      .trim()
      .replace(/\s+/g, '-')
      .replace(/[^\w\-]+/g, '')
      .replace(/\-\-+/g, '-')
  }

  // Format content: Convert plain text to HTML if needed
  const formatContent = (content: string | null) => {
    if (!content) return '<p>No content available.</p>'
    
    // Check if content already has HTML tags
    if (content.includes('<p>') || content.includes('<h1>') || content.includes('<h2>') || content.includes('<h3>')) {
      return content
    }
    
    // Convert plain text to formatted HTML with better detection
    const paragraphs = content.split(/\n\n+/) // Split by double line breaks
    let formattedContent = ''
    
    for (let para of paragraphs) {
      const lines = para.split('\n').map(l => l.trim()).filter(l => l)
      
      if (lines.length === 0) continue
      
      const firstLine = lines[0]
      
      // Detect headings:
      // 1. All caps lines
      // 2. Lines ending with colon
      // 3. Short lines (< 80 chars) that don't end with period
      // 4. Lines starting with numbers followed by period
      const isHeading = (
        firstLine === firstLine.toUpperCase() && firstLine.length < 80 ||
        firstLine.endsWith(':') ||
        (firstLine.length < 80 && !firstLine.endsWith('.') && !firstLine.endsWith(',')) ||
        /^\d+\./.test(firstLine)
      )
      
      if (isHeading && lines.length === 1) {
        formattedContent += `<h2>${firstLine}</h2>`
      } else {
        // It's a paragraph, join the lines
        formattedContent += `<p>${lines.join(' ')}</p>`
      }
    }
    
    return formattedContent || '<p>No content available.</p>'
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 via-purple-50/30 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mb-4" role="status" aria-label="Loading"></div>
          <p className="text-gray-600">Loading article...</p>
        </div>
      </div>
    )
  }

  if (error || !article) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 via-purple-50/30 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-20 h-20 bg-red-50 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-red-200">
            <svg className="w-10 h-10 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Article Not Found</h2>
          <p className="text-gray-600 mb-6">{error || 'The article you are looking for does not exist.'}</p>
          <Link
            href="/blogs"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all"
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
    <div className="min-h-screen bg-gradient-to-b from-blue-50 via-purple-50/30 to-white">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-white/90 backdrop-blur-xl border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="w-9 h-9 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 rounded-xl shadow-lg group-hover:shadow-xl transition-shadow" />
              <span className="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">VideoAI</span>
            </Link>
            <div className="hidden md:flex items-center gap-8">
              <Link href="/blogs" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">
                Blog
              </Link>
              <Link href="/generate" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">
                Text to AI Video
              </Link>
              
              {isLoggedIn ? (
                <>
                  <Link href="/videos" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">
                    My Videos
                  </Link>
                  <Link href="/profile" className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors">
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center text-white text-sm font-semibold shadow-md">
                      {userEmail ? userEmail.charAt(0).toUpperCase() : 'U'}
                    </div>
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={openLogin}
                    className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
                  >
                    Login
                  </button>
                  <button
                    onClick={openLogin}
                    className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-sm font-semibold rounded-full hover:shadow-lg hover:scale-105 transition-all"
                  >
                    Get Started Free
                  </button>
                </>
              )}
            </div>
            
            {/* Mobile Menu Button */}
            <button 
              onClick={openMobileMenu}
              className="md:hidden p-2 text-gray-600 hover:text-gray-900 transition-colors"
              aria-label="Open menu"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </nav>

      {/* Article Content */}
      <article className="pt-32 pb-24 px-6">
        <div className="max-w-4xl mx-auto">
          {/* Breadcrumb */}
          <div className="mb-8 flex items-center gap-2 text-sm text-gray-600">
            <Link href="/" className="hover:text-gray-900 transition-colors">Home</Link>
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
            </svg>
            <Link href="/blogs" className="hover:text-gray-900 transition-colors">Blog</Link>
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
            </svg>
            <Link href={`/category/${slugify(article.category)}`} className="hover:text-gray-900 transition-colors">{article.category}</Link>
          </div>

          {/* Category Badge and Date */}
          <div className="flex items-center gap-4 mb-6 flex-wrap">
            <Link
              href={`/category/${slugify(article.category)}`}
              className="inline-block px-4 py-2 bg-purple-100 rounded-full text-sm font-semibold text-purple-600 hover:bg-purple-200 transition-colors"
            >
              {article.category}
            </Link>
            <time dateTime={article.date} className="text-sm text-gray-600">
              {formatDate(article.date)}
            </time>
          </div>

          {/* Title */}
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-8 leading-tight">
            {article.title}
          </h1>

          {/* Featured Image */}
          {article.image_url && (
            <div className="relative aspect-video mb-12 rounded-3xl overflow-hidden shadow-2xl">
              <Image
                src={getImageUrl(article.image_url)}
                alt={article.title}
                fill
                className="object-cover"
                priority
              />
            </div>
          )}

          {/* Content */}
          <div 
            className="prose prose-lg max-w-none 
            prose-headings:font-bold prose-headings:mb-6 prose-headings:mt-10 first:prose-headings:mt-0
            prose-h1:text-4xl prose-h1:bg-gradient-to-r prose-h1:from-blue-600 prose-h1:via-purple-600 prose-h1:to-pink-600 prose-h1:bg-clip-text prose-h1:text-transparent
            prose-h2:text-3xl prose-h2:text-blue-600
            prose-h3:text-2xl prose-h3:text-purple-600
            prose-h4:text-xl prose-h4:text-indigo-600
            prose-h5:text-lg prose-h5:text-blue-500
            prose-h6:text-base prose-h6:text-purple-500
            prose-p:text-gray-700 prose-p:text-lg prose-p:leading-relaxed prose-p:mb-6
            prose-a:text-blue-600 prose-a:font-semibold prose-a:no-underline hover:prose-a:underline hover:prose-a:text-blue-700
            prose-strong:text-gray-900 prose-strong:font-bold
            prose-em:text-purple-600 prose-em:italic
            prose-ul:list-disc prose-ul:pl-6 prose-ul:mb-6 prose-ul:space-y-2
            prose-ol:list-decimal prose-ol:pl-6 prose-ol:mb-6 prose-ol:space-y-2
            prose-li:text-gray-700 prose-li:text-lg prose-li:leading-relaxed
            prose-blockquote:border-l-4 prose-blockquote:border-blue-600 prose-blockquote:pl-6 prose-blockquote:py-2 prose-blockquote:italic prose-blockquote:text-gray-600 prose-blockquote:bg-blue-50 prose-blockquote:rounded-r-lg
            prose-code:text-blue-600 prose-code:bg-blue-50 prose-code:px-2 prose-code:py-1 prose-code:rounded prose-code:font-semibold prose-code:text-sm
            prose-pre:bg-gray-900 prose-pre:text-gray-100 prose-pre:p-6 prose-pre:rounded-xl prose-pre:overflow-x-auto
            prose-img:rounded-2xl prose-img:shadow-2xl prose-img:my-10 prose-img:border prose-img:border-gray-200
            prose-hr:border-gray-300 prose-hr:my-10"
            dangerouslySetInnerHTML={{ __html: formatContent(article.content) }}
          />
        </div>
      </article>

      {/* Related Articles */}
      {relatedArticles.length > 0 && (
        <section className="py-16 px-6 bg-gray-50">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">Related Articles</h2>
            <div className="grid md:grid-cols-3 gap-8">
              {relatedArticles.map((post) => (
                <Link
                  key={post.id}
                  href={`/${post.slug}`}
                  className="group bg-white rounded-3xl overflow-hidden border border-gray-100 hover:border-gray-200 hover:shadow-xl transition-all duration-300"
                >
                  <div className="relative h-48 bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 overflow-hidden">
                    <Image
                      src={getImageUrl(post.image_url)}
                      alt={post.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors line-clamp-2">
                      {post.title}
                    </h3>
                    <p className="text-sm text-gray-500">{formatDate(post.date)}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="py-20 px-6 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Ready to Create Your Own AI Videos?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Start generating professional videos in seconds
          </p>
          <Link
            href="/generate"
            className="inline-flex items-center gap-3 px-10 py-5 bg-white text-gray-900 rounded-2xl text-lg font-bold hover:bg-gray-50 transition-all shadow-2xl hover:scale-105"
          >
            Generate Free Video
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 bg-gray-900 text-gray-400">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg" />
            <span className="text-lg font-bold text-white">VideoAI</span>
          </div>
          <p className="text-sm">&copy; 2025 VideoAI. All rights reserved.</p>
        </div>
      </footer>

      {/* Login Popup */}
      <LoginPopup isOpen={isLoginOpen} onClose={closeLogin} />
      
      {/* Mobile Menu */}
      <MobileMenu 
        isOpen={isMobileMenuOpen} 
        onClose={closeMobileMenu} 
        onOpenLogin={openLogin}
        isLoggedIn={isLoggedIn}
        userEmail={userEmail}
        onLogout={handleLogout}
      />
    </div>
  )
}

