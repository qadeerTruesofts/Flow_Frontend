'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import dynamic from 'next/dynamic'

const LoginPopup = dynamic(() => import('@/components/LoginPopup'), { ssr: false })
const MobileMenu = dynamic(() => import('@/components/MobileMenu'), { ssr: false })

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'
const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || 'https://desirable-reflection-production-aa8a.up.railway.app').replace(/\/$/, '')
const PLACEHOLDER_IMAGE = 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=1200&h=600&fit=crop'

export interface Article {
  id: number
  title: string
  slug: string
  category: string
  date: string
  image_url: string | null
  content: string | null
  author: string | null
  meta_title?: string | null
  meta_description?: string | null
  meta_keywords?: string | null
}

interface ArticlePageClientProps {
  article: Article
  relatedArticles: Article[]
}

export default function ArticlePageClient({ article, relatedArticles }: ArticlePageClientProps) {
  const [isLoginOpen, setIsLoginOpen] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [userEmail, setUserEmail] = useState('')

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('access_token')
        if (!token) {
          setIsLoggedIn(false)
          return
        }

        const response = await fetch(`${API_BASE_URL}/api/auth/me`, {
          headers: { Authorization: `Bearer ${token}` }
        })

        if (response.ok) {
          const data = await response.json()
          setIsLoggedIn(true)
          setUserEmail(data.user.email)
        } else {
          setIsLoggedIn(false)
          localStorage.removeItem('access_token')
        }
      } catch {
        setIsLoggedIn(false)
      }
    }

    checkAuth()
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('access_token')
    setIsLoggedIn(false)
    setUserEmail('')
  }

  const openLogin = useCallback(() => setIsLoginOpen(true), [])
  const closeLogin = useCallback(() => setIsLoginOpen(false), [])
  const openMobileMenu = useCallback(() => setIsMobileMenuOpen(true), [])
  const closeMobileMenu = useCallback(() => setIsMobileMenuOpen(false), [])

  const handleShare = (platform: 'facebook' | 'twitter' | 'linkedin') => {
    if (typeof window === 'undefined') return

    const articleUrl = `${SITE_URL}/${article.slug}`
    const text = encodeURIComponent(article.title)
    const url = encodeURIComponent(articleUrl)

    let shareUrl = ''
    if (platform === 'facebook') {
      shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`
    } else if (platform === 'twitter') {
      shareUrl = `https://twitter.com/intent/tweet?url=${url}&text=${text}`
    } else if (platform === 'linkedin') {
      shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${url}`
    }

    if (shareUrl) {
      window.open(shareUrl, '_blank', 'noopener,noreferrer,width=600,height=600')
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
  }

  const getImageUrl = (imageUrl: string | null) => {
    if (!imageUrl) return PLACEHOLDER_IMAGE
    if (imageUrl.startsWith('http')) return imageUrl
    return `${API_BASE_URL}${imageUrl}`
  }

  const slugify = (text: string) =>
    text
      .toString()
      .toLowerCase()
      .trim()
      .replace(/\s+/g, '-')
      .replace(/[^\w-]+/g, '')
      .replace(/--+/g, '-')

  const formatContent = (content: string | null) => {
    if (!content) return '<p>No content available.</p>'

    if (/<(p|h1|h2|h3)/i.test(content)) {
      return content
    }

    const paragraphs = content.split(/\n\n+/)
    const formatted = paragraphs
      .map((para) => {
        const trimmed = para.trim()
        if (!trimmed) return null

        const isHeading =
          (trimmed === trimmed.toUpperCase() && trimmed.length < 80) ||
          trimmed.endsWith(':') ||
          (trimmed.length < 80 && !/[.,!?]$/.test(trimmed)) ||
          /^\d+\./.test(trimmed)

        if (isHeading && !trimmed.includes('. ') && trimmed.split(' ').length < 14) {
          return `<h2>${trimmed}</h2>`
        }

        return `<p>${trimmed.replace(/\n/g, ' ')}</p>`
      })
      .filter(Boolean)
      .join('')

    return formatted || '<p>No content available.</p>'
  }

  return (
    <div className="min-h-screen bg-white">
      <nav className="fixed top-0 w-full z-50 bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="w-9 h-9 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 rounded-xl shadow-lg group-hover:shadow-xl transition-shadow" />
              <span className="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                Vidwave
              </span>
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
                  <button onClick={handleLogout} className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <button onClick={openLogin} className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">
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

      <div className="pt-24 pb-6 px-6 bg-gray-50 border-b border-gray-200">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Link href="/" className="hover:text-gray-900">
              Home
            </Link>
            <span>/</span>
            <Link href="/blogs" className="hover:text-gray-900">
              Blog
            </Link>
            <span>/</span>
            <Link href={`/category/${slugify(article.category)}`} className="hover:text-gray-900">
              {article.category}
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid lg:grid-cols-12 gap-12">
          <aside className="hidden lg:block lg:col-span-3">
            <div className="sticky top-24 space-y-8">
              <div className="bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 rounded-3xl p-8 text-white shadow-2xl">
                <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mb-6">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold mb-3">Create Your AI Video Now</h3>
                <p className="text-blue-100 mb-6 text-sm">Turn your ideas into stunning AI videos. No experience needed!</p>
                <Link
                  href="/generate"
                  className="block w-full py-4 bg-white text-gray-900 rounded-xl font-bold text-center hover:bg-gray-50 transition-all shadow-lg hover:scale-105"
                >
                  Generate Free AI Video →
                </Link>
                <div className="mt-4 pt-4 border-t border-white/20">
                  <div className="flex items-center gap-2 text-sm text-blue-100">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span>No credit card required</span>
                  </div>
                </div>
              </div>

              <div className="p-6 bg-gray-50 rounded-2xl">
                <h4 className="font-semibold text-gray-900 mb-4">Share this article</h4>
                <div className="flex gap-3">
                  <button
                    onClick={() => handleShare('facebook')}
                    aria-label="Share on Facebook"
                    className="w-10 h-10 bg-white rounded-lg flex items-center justify-center hover:bg-blue-50 transition-colors"
                  >
                    <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                    </svg>
                  </button>
                  <button
                    onClick={() => handleShare('twitter')}
                    aria-label="Share on Twitter"
                    className="w-10 h-10 bg-white rounded-lg flex items-center justify-center hover:bg-blue-50 transition-colors"
                  >
                    <svg className="w-5 h-5 text-blue-400" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                    </svg>
                  </button>
                  <button
                    onClick={() => handleShare('linkedin')}
                    aria-label="Share on LinkedIn"
                    className="w-10 h-10 bg-white rounded-lg flex items-center justify-center hover:bg-blue-50 transition-colors"
                  >
                    <svg className="w-5 h-5 text-blue-700" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </aside>

          <article className="lg:col-span-9">
            <header className="mb-12">
              <div className="mb-6">
                <Link
                  href={`/category/${slugify(article.category)}`}
                  className="inline-block px-4 py-2 bg-purple-100 text-purple-600 rounded-full text-sm font-semibold hover:bg-purple-200 transition-colors"
                >
                  {article.category}
                </Link>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">{article.title}</h1>
              <div className="flex items-center gap-6 text-gray-600 pb-8 border-b border-gray-200">
                <time className="text-sm">{formatDate(article.date)}</time>
              </div>
            </header>

            {article.image_url && (
              <div className="relative mb-12 rounded-3xl overflow-hidden bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 aspect-video">
                <Image
                  src={getImageUrl(article.image_url)}
                  alt={article.title}
                  fill
                  className="object-cover"
                  priority
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 75vw, 900px"
                />
              </div>
            )}

            <div
              className="prose prose-lg max-w-none prose-headings:font-bold prose-headings:text-gray-900 prose-h2:text-3xl prose-h2:mt-12 prose-h2:mb-6 prose-h3:text-2xl prose-h3:mt-8 prose-h3:mb-4 prose-p:text-gray-700 prose-p:leading-relaxed prose-p:mb-6 prose-a:text-blue-600 prose-a:no-underline hover:prose-a:underline prose-strong:text-gray-900 prose-ul:my-6 prose-ol:my-6 prose-li:text-gray-700 prose-li:my-2"
              dangerouslySetInnerHTML={{ __html: formatContent(article.content) }}
            />

            <div className="lg:hidden mt-12 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 rounded-3xl p-8 text-white">
              <h3 className="text-2xl font-bold mb-3">Ready to Create Your AI Video?</h3>
              <p className="text-blue-100 mb-6">Turn your ideas into stunning AI videos</p>
              <Link href="/generate" className="block w-full py-4 bg-white text-gray-900 rounded-xl font-bold text-center hover:bg-gray-50 transition-all">
                Generate Free AI Video →
              </Link>
            </div>
          </article>
        </div>
      </div>

      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-4 shadow-2xl">
        <Link href="/generate" className="block w-full py-3 bg-white text-gray-900 rounded-xl font-bold text-center hover:bg-gray-50 transition-all">
          Generate Free AI Video →
        </Link>
      </div>

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

      <footer className="mt-24 py-16 px-6 bg-gray-900 text-gray-400">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-12 mb-12">
            <div>
              <div className="flex items-center gap-2 mb-6">
                <div className="w-9 h-9 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 rounded-xl" />
                <span className="text-lg font-bold text-white">Vidwave</span>
              </div>
              <p className="text-sm">AI-powered video generation platform</p>
            </div>
            <div>
              <h3 className="font-semibold text-white mb-4">Product</h3>
              <ul className="space-y-3 text-sm">
                <li>
                  <Link href="/generate" className="hover:text-white transition-colors">
                    Text to AI Video
                  </Link>
                </li>
                <li>
                  <Link href="/blogs" className="hover:text-white transition-colors">
                    Blog
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-white mb-4">Company</h3>
              <ul className="space-y-3 text-sm">
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    About
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Contact
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-white mb-4">Legal</h3>
              <ul className="space-y-3 text-sm">
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Terms of Service
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t border-gray-800 text-center text-sm">
            <p>&copy; 2025 Vidwave - AI Video Generator. All rights reserved.</p>
          </div>
        </div>
      </footer>

      <LoginPopup isOpen={isLoginOpen} onClose={closeLogin} />
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

