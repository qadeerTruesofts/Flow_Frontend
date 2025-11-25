'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState, useEffect, useCallback, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { StructuredData, createFAQSchema } from '@/components/StructuredData'
import { jsonLdSoftwareApplication, siteConfig } from '@/lib/seo-config'
import SignInModal from '@/components/SignInModal'
import dynamic from 'next/dynamic'

// Lazy load components
const LoginPopup = dynamic(() => import('@/components/LoginPopup'), {
  ssr: false
})
const MobileMenu = dynamic(() => import('@/components/MobileMenu'), {
  ssr: false
})

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'

export default function Home() {
  const router = useRouter()
  const [promptText, setPromptText] = useState('')
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [userEmail, setUserEmail] = useState('')
  const [isLoginOpen, setIsLoginOpen] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    
    // Check for access_token in URL (from Google OAuth redirect)
    const urlParams = new URLSearchParams(window.location.search)
    const accessToken = urlParams.get('access_token')
    
    if (accessToken) {
      // Store the token
      localStorage.setItem('access_token', accessToken)
      
      // Redirect to the page the user originally attempted to access
      const redirectPath = localStorage.getItem('postLoginRedirect')
      if (redirectPath) {
        localStorage.removeItem('postLoginRedirect')
        if (redirectPath !== `${window.location.pathname}${window.location.search}`) {
          window.location.assign(redirectPath)
          return
        }
      }
      
      // Clean up URL
      window.history.replaceState({}, document.title, window.location.pathname)
    }
    
    checkAuth()
  }, [])

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

  const handleGenerateClick = useCallback(() => {
    if (promptText.trim()) {
      router.push(`/generate?prompt=${encodeURIComponent(promptText)}`)
    } else {
      router.push('/generate')
    }
  }, [promptText, router])
  
  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && promptText.trim()) {
      router.push(`/generate?prompt=${encodeURIComponent(promptText)}`)
    }
  }, [promptText, router])
  
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

  // FAQ Structured Data for SEO
  const faqSchema = useMemo(() => createFAQSchema([
    {
      question: 'What is Vidwave?',
      answer: 'Vidwave is an AI-native video studio that transforms your text descriptions and assets into polished, professional footage in minutes—no editing skills required.',
    },
    {
      question: 'How long does it take to generate a video?',
      answer: 'Most videos are generated within 2-5 minutes, depending on the complexity and length of your content. Our AI processes your request in real-time to deliver fast results.',
    },
    {
      question: 'What video quality can I expect?',
      answer: 'Our AI generates videos in multiple resolutions including HD (1080p) and 4K quality, suitable for professional use across all platforms including YouTube, social media, and presentations.',
    },
    {
      question: 'Do I need video editing skills?',
      answer: 'No! Our platform is designed for everyone. Simply describe what you want or upload an image, and our AI handles all the complex video generation automatically.',
    },
    {
      question: 'Can I use the videos commercially?',
      answer: 'Yes, every video rendered with Vidwave can be used commercially with no watermarks or hidden licensing fees.',
    },
  ]), [])

  // Breadcrumb Schema for Homepage
  const breadcrumbSchema = useMemo(() => ({
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: siteConfig.url,
      },
    ],
  }), [])

  return (
    <>
      {/* SEO Structured Data */}
      <StructuredData data={jsonLdSoftwareApplication} />
      <StructuredData data={faqSchema} />
      <StructuredData data={breadcrumbSchema} />

      <div className="min-h-screen bg-gradient-to-b from-blue-50 via-purple-50/30 to-white text-gray-900">
        {/* Premium Navigation */}
        <nav className="fixed top-0 w-full z-50 bg-white/90 backdrop-blur-xl border-b border-gray-100">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <Link href="/" className="flex items-center gap-2 group">
                <div className="w-9 h-9 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 rounded-xl shadow-lg group-hover:shadow-xl transition-shadow" />
                <span className="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">Vidwave</span>
              </Link>
              <div className="hidden md:flex items-center gap-8" suppressHydrationWarning>
                <Link href="/blogs" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">
                  Blog
                </Link>
                <Link href="/generate" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">
                  Text to AI Video
                </Link>
                
                {!mounted ? (
                  <div className="flex items-center gap-8">
                    <div className="w-20 h-8"></div>
                  </div>
                ) : isLoggedIn ? (
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

        {/* Hero Section - Ultra Premium */}
        <section className="relative pt-32 pb-24 px-6 overflow-hidden">
          {/* Subtle radial gradients */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(59,130,246,0.08),transparent_50%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(168,85,247,0.08),transparent_50%)]" />
          
          <div className="relative max-w-6xl mx-auto">
            {/* Premium Trust Badge */}
            <div className="flex justify-center mb-10">
              <div className="inline-flex items-center gap-3 px-6 py-3 bg-white rounded-full shadow-lg border border-gray-100">
                <div className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full shadow-md">
                  <span className="text-white text-base font-bold">5.0</span>
                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                </div>
                <div className="h-4 w-px bg-gray-200" />
                <span className="text-sm font-semibold text-gray-900">Trusted by 10,000+ creators worldwide</span>
              </div>
            </div>

            {/* Premium Headline */}
            <div className="text-center mb-12">
              <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6 leading-[1.1] tracking-tight">
                Vidwave
                <br />
                <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                  Turn Text into AI Videos
                </span>
              </h1>
              <p className="text-xl md:text-2xl text-gray-600 mb-4 max-w-3xl mx-auto leading-relaxed">
                Create professional videos from text with AI-powered generation. No editing skills needed.
              </p>
              <p className="text-base text-gray-500 max-w-2xl mx-auto">
                Generate high-quality videos with AI voice, music, and stunning visuals in seconds.
              </p>
            </div>

            {/* Premium CTA Input */}
            <div className="max-w-3xl mx-auto mb-10">
              <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-3xl opacity-20 blur-2xl group-hover:opacity-30 transition-opacity" />
                <div className="relative">
                  <input
                    type="text"
                    value={promptText}
                    onChange={(e) => setPromptText(e.target.value)}
                    placeholder="Describe your video... e.g., 'A beautiful sunset over mountains with calm music'"
                    className="w-full px-4 sm:px-6 lg:px-8 py-4 sm:py-6 pr-4 sm:pr-48 rounded-3xl bg-white border-2 border-gray-200 focus:border-purple-500 outline-none text-sm sm:text-base lg:text-lg transition-all shadow-xl hover:shadow-2xl placeholder:text-gray-400"
                    onKeyDown={handleKeyDown}
                  />
                  <div className="flex flex-col gap-3 sm:gap-0 sm:block">
                    <button
                      onClick={handleGenerateClick}
                      className="mt-3 sm:mt-0 w-full sm:w-auto sm:absolute sm:right-2 sm:top-1/2 sm:-translate-y-1/2 px-6 sm:px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-2xl font-bold hover:from-blue-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl hover:scale-[1.02]"
                    >
                      Generate Free →
                    </button>
                  </div>
                </div>
              </div>
              
              {/* Trust Indicators */}
              <div className="flex items-center justify-center gap-2 sm:gap-6 mt-6">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="font-medium">No credit card</span>
                </div>
                <div className="h-4 w-px bg-gray-300" />
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="font-medium">No watermark</span>
                </div>
                <div className="h-4 w-px bg-gray-300" />
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="font-medium">HD Quality</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section - Premium Design */}
        <section id="features" className="py-24 px-6">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-20">
              <div className="inline-block px-4 py-2 bg-purple-100 rounded-full mb-6">
                <span className="text-sm font-semibold text-purple-600">POWERFUL FEATURES</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                Everything You Need to Create
                <br />
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Professional Videos
                </span>
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                AI-powered tools designed to make video creation effortless
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  title: 'Text to Video AI',
                  description: 'Transform any text into stunning videos with AI-powered generation. Just describe what you want.',
                  gradient: 'from-blue-500 to-blue-600',
                  iconPath: 'M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z'
                },
                {
                  title: 'Professional Quality',
                  description: 'Generate HD videos with cinematic quality. Perfect for social media, marketing, and more.',
                  gradient: 'from-purple-500 to-purple-600',
                  iconPath: 'M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z'
                },
                {
                  title: 'Lightning Fast',
                  description: 'Create videos in seconds, not hours. Our AI processes your request instantly.',
                  gradient: 'from-pink-500 to-pink-600',
                  iconPath: 'M13 10V3L4 14h7v7l9-11h-7z'
                },
                {
                  title: 'AI Voice & Music',
                  description: 'Automatically add professional voiceover and background music to your videos.',
                  gradient: 'from-orange-500 to-red-500',
                  iconPath: 'M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3'
                },
                {
                  title: 'Multiple Styles',
                  description: 'Choose from realistic, artistic, cinematic, and anime styles to match your vision.',
                  gradient: 'from-teal-500 to-cyan-500',
                  iconPath: 'M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01'
                },
                {
                  title: 'Easy Export',
                  description: 'Download your videos instantly in any format. Optimized for all platforms.',
                  gradient: 'from-indigo-500 to-purple-600',
                  iconPath: 'M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4'
                }
              ].map((feature, index) => (
                <article key={index} className="group relative p-8 rounded-3xl bg-white border border-gray-100 hover:border-gray-200 hover:shadow-xl transition-all duration-300">
                  <div className={`w-14 h-14 bg-gradient-to-br ${feature.gradient} rounded-2xl flex items-center justify-center text-white mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                    <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={feature.iconPath} />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {feature.description}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* Minimal Trusted Reviews Section */}
        <section id="reviews" className="py-24 px-6">
          <div className="max-w-6xl mx-auto">
            {/* Simple Header */}
            <div className="text-center mb-16">
              <div className="flex items-center justify-center gap-2 mb-4">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="w-6 h-6 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
                Trusted by Creators Worldwide
              </h2>
              <p className="text-lg text-gray-600">
                See what our users say about Vidwave
              </p>
            </div>

            {/* Minimal Review Cards - 2 Column */}
            <div className="grid md:grid-cols-2 gap-8">
              {[
                {
                  name: 'Sarah Mitchell',
                  role: 'Content Creator',
                  text: 'Vidwave has completely transformed my workflow. I create professional videos in minutes that used to take me hours.',
                  verified: true
                },
                {
                  name: 'Marcus Chen',
                  role: 'Marketing Director',
                  text: 'Best investment for our marketing team. The text to video feature saves us thousands in production costs.',
                  verified: true
                },
                {
                  name: 'Emily Rodriguez',
                  role: 'Social Media Manager',
                  text: 'My engagement rates increased by 300%! The videos are professional and the AI understands exactly what I need.',
                  verified: true
                },
                {
                  name: 'David Park',
                  role: 'YouTuber',
                  text: 'As a full-time creator, this tool is invaluable. The speed and quality are unmatched. Highly recommend!',
                  verified: true
                }
              ].map((review, index) => (
                <div
                  key={index}
                  className="p-6 bg-gray-50/50 rounded-2xl border border-gray-100 hover:border-gray-200 hover:shadow-sm transition-all"
                >
                  {/* Stars */}
                  <div className="flex gap-0.5 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  
                  {/* Review Text */}
                  <p className="text-gray-700 leading-relaxed mb-5 text-base">
                    "{review.text}"
                  </p>
                  
                  {/* Author - Minimal */}
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gray-900 flex items-center justify-center text-white text-sm font-semibold">
                      {review.name.split(' ').map((n: string) => n[0]).join('')}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-gray-900 text-sm">{review.name}</span>
                        {review.verified && (
                          <svg className="w-4 h-4 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                        )}
                      </div>
                      <div className="text-xs text-gray-500">{review.role}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Premium CTA Section */}
        <section className="relative py-32 px-6 overflow-hidden">
          {/* Premium gradient background */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.1),transparent_50%)]" />
          
          <div className="relative max-w-4xl mx-auto text-center">
            <div className="inline-block px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full mb-8">
              <span className="text-sm font-semibold text-white">START FOR FREE</span>
            </div>
            
            <h2 className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
              Ready to Ship Your
              <br />
              First Vidwave Project?
            </h2>
            <p className="text-xl text-blue-100 mb-12 max-w-2xl mx-auto">
              Join 10,000+ creators using AI to generate professional videos in seconds
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button 
                onClick={openLogin}
                className="group px-10 py-5 bg-white text-gray-900 rounded-2xl text-lg font-bold hover:bg-gray-50 transition-all shadow-2xl hover:shadow-white/20 hover:scale-105 flex items-center gap-3"
              >
                Start Generating Now
                <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </button>
            </div>
            
            {/* Trust indicators */}
            <div className="flex items-center justify-center gap-6 mt-10 text-white/90">
              {['No credit card', 'Free forever', 'Cancel anytime'].map((text, i) => (
                <div key={i} className="flex items-center gap-2 text-sm font-medium">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  {text}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Premium Footer */}
        <footer className="py-16 px-6 bg-gray-900 text-gray-400">
          <div className="max-w-7xl mx-auto">
            <div className="grid md:grid-cols-4 gap-12 mb-12">
              <div>
                <div className="flex items-center gap-2 mb-6">
                  <div className="w-9 h-9 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 rounded-xl" />
                  <span className="text-xl font-bold text-white">Vidwave</span>
                </div>
                <p className="text-sm leading-relaxed">
                  AI-powered text to video generator. Create professional videos in seconds with advanced AI technology.
                </p>
              </div>
              
              <div>
                <h3 className="font-semibold text-white mb-4">Product</h3>
                <ul className="space-y-3 text-sm">
                  <li><Link href="/generate" className="hover:text-white transition-colors">Text to Video</Link></li>
                  <li><Link href="#features" className="hover:text-white transition-colors">Features</Link></li>
                  <li><Link href="#reviews" className="hover:text-white transition-colors">Reviews</Link></li>
                </ul>
              </div>
              
              <div>
                <h3 className="font-semibold text-white mb-4">Company</h3>
                <ul className="space-y-3 text-sm">
                  <li><Link href="/about" className="hover:text-white transition-colors">About</Link></li>
                  <li><a href="mailto:hello@vidwave.ai" className="hover:text-white transition-colors">Contact</a></li>
                </ul>
              </div>
              
              <div>
                <h3 className="font-semibold text-white mb-4">Legal</h3>
                <ul className="space-y-3 text-sm">
                  <li><Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
                  <li><Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link></li>
                </ul>
              </div>
            </div>
            
            <div className="pt-8 border-t border-gray-800 text-center text-sm">
              <p>&copy; 2025 Vidwave. All rights reserved.</p>
            </div>
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
    </>
  )
}
