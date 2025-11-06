'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState, useEffect, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { StructuredData, createFAQSchema } from '@/components/StructuredData'
import { jsonLdSoftwareApplication, siteConfig } from '@/lib/seo-config'
import SignInModal from '@/components/SignInModal'

export default function Home() {
  const router = useRouter()
  const [promptText, setPromptText] = useState('')
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [userEmail, setUserEmail] = useState('')
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [showSignInModal, setShowSignInModal] = useState(false)
  const [signInMode, setSignInMode] = useState<'login' | 'signup'>('signup')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    checkAuth()
  }, [])

  const checkAuth = async () => {
    try {
      const token = localStorage.getItem('access_token')
      if (!token) {
        setIsLoggedIn(false)
        return
      }

      const response = await fetch('http://localhost:8080/api/auth/me', {
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

  const handleGenerateClick = (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault()
    }
    if (promptText.trim()) {
      router.push(`/generate?prompt=${encodeURIComponent(promptText)}&signin=true`)
    } else {
      router.push('/generate?signin=true')
    }
  }

  const handleLoginClick = () => {
    setSignInMode('login')
    setShowSignInModal(true)
  }

  const handleSignupClick = () => {
    setSignInMode('signup')
    setShowSignInModal(true)
  }

  const handleSignInSuccess = () => {
    setShowSignInModal(false)
    checkAuth()
  }

  // FAQ Structured Data for SEO
  const faqSchema = useMemo(() => createFAQSchema([
    {
      question: 'What is AI Video Generator?',
      answer: 'AI Video Generator is an advanced artificial intelligence-powered platform that transforms text descriptions and images into high-quality, professional videos in minutes. No video editing experience required.',
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
      answer: 'Yes, all videos generated with AI Video Generator can be used for commercial purposes without any watermarks or restrictions.',
    },
  ]), []);

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
  }), []);

  // VideoObject Schema for Examples
  const videoExamplesSchema = useMemo(() => ({
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'AI Video Generation Examples',
    description: 'Real examples of AI-generated videos created with FlowVideo',
    itemListElement: [
      {
        '@type': 'VideoObject',
        position: 1,
        name: 'A serene sunset over the ocean with waves gently crashing on the shore',
        description: 'AI-generated video example showing a peaceful ocean sunset scene',
        thumbnailUrl: `${siteConfig.url}/A_serene_sunset.mp4`,
        uploadDate: new Date().toISOString(),
        contentUrl: `${siteConfig.url}/A_serene_sunset.mp4`,
      },
      {
        '@type': 'VideoObject',
        position: 2,
        name: 'A bustling city street at night with neon lights and people walking',
        description: 'AI-generated video example showing an urban night scene',
        thumbnailUrl: `${siteConfig.url}/A_bustling_city.mp4`,
        uploadDate: new Date().toISOString(),
        contentUrl: `${siteConfig.url}/A_bustling_city.mp4`,
      },
      {
        '@type': 'VideoObject',
        position: 3,
        name: 'A futuristic robot walking through a high-tech laboratory',
        description: 'AI-generated video example showing a sci-fi laboratory scene',
        thumbnailUrl: `${siteConfig.url}/A_futuristic_robot.mp4`,
        uploadDate: new Date().toISOString(),
        contentUrl: `${siteConfig.url}/A_futuristic_robot.mp4`,
      },
    ],
  }), []);

  // HowTo Schema for SEO
  const howToSchema = useMemo(() => ({
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: 'How to Create AI Videos with FlowVideo',
    description: 'Learn how to create professional videos using AI technology in 3 simple steps',
    step: [
      {
        '@type': 'HowToStep',
        position: 1,
        name: 'Describe Your Vision',
        text: 'Enter your video idea in plain text describing what you want to create',
      },
      {
        '@type': 'HowToStep',
        position: 2,
        name: 'AI Generates Video',
        text: 'Our advanced AI processes your request and creates your professional video',
      },
      {
        '@type': 'HowToStep',
        position: 3,
        name: 'Download & Share',
        text: 'Get your professional video ready to use anywhere - no watermarks, commercial license included',
      },
    ],
  }), []);

  // Return JSX
  return (
    <>
      {/* SEO Structured Data */}
      <StructuredData data={jsonLdSoftwareApplication} />
      <StructuredData data={faqSchema} />
      <StructuredData data={breadcrumbSchema} />
      <StructuredData data={howToSchema} />
      <StructuredData data={videoExamplesSchema} />

      <main className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-purple-50">
        {/* Premium Navigation */}
        <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-xl border-b border-slate-200/60" role="navigation" aria-label="Main navigation">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-20">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-500/30">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <span className="text-xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
                  FlowVideo
                </span>
            </div>
              
              {/* Desktop Navigation */}
              <div className="hidden md:flex items-center gap-6">
                <Link href="#features" className="text-slate-600 hover:text-slate-900 font-medium transition-colors">
                Features
              </Link>
              
                {!mounted ? (
                  <>
                    <button
                      disabled
                      className="px-6 py-2.5 bg-cyan-50 text-slate-900 rounded-xl font-semibold opacity-50"
                    >
                      Login
                    </button>
                    <button
                      disabled
                      className="px-6 py-2.5 bg-slate-900 text-white rounded-xl font-semibold opacity-50 flex items-center gap-2"
                    >
                      Signup
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    </button>
                  </>
                ) : isLoggedIn ? (
                  <>
                    <Link href="/videos" className="text-slate-600 hover:text-slate-900 font-medium transition-colors">
                      My Videos
                    </Link>
                    <Link href="/profile" className="flex items-center gap-2 text-slate-600 hover:text-slate-900 transition-colors">
                      <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-sm font-semibold shadow-md">
                        {userEmail ? userEmail.charAt(0).toUpperCase() : 'U'}
                      </div>
              </Link>
                    <button
                      onClick={handleLogout}
                      className="text-slate-600 hover:text-slate-900 font-medium transition-colors"
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={handleLoginClick}
                      className="px-6 py-2.5 bg-cyan-50 text-slate-900 rounded-xl font-semibold hover:bg-cyan-100 transition-all"
                    >
                      Login
                    </button>
                    <button
                      onClick={handleSignupClick}
                      className="px-6 py-2.5 bg-slate-900 text-white rounded-xl font-semibold hover:bg-slate-800 transition-all flex items-center gap-2"
                    >
                      Signup
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    </button>
                  </>
                )}
              </div>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden text-slate-600 hover:text-slate-900 transition-colors p-2"
                aria-label="Toggle menu"
              >
                {mobileMenuOpen ? (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                ) : (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                )}
              </button>
            </div>

            {/* Mobile Menu */}
            {mobileMenuOpen && (
              <div className="md:hidden py-4 border-t border-slate-200">
                <div className="flex flex-col gap-3">
                  <Link href="#features" className="text-slate-600 hover:text-slate-900 font-medium py-2" onClick={() => setMobileMenuOpen(false)}>
                    Features
                  </Link>
                  {!mounted ? (
                    <>
                      <button
                        disabled
                        className="px-6 py-2.5 bg-cyan-50 text-slate-900 rounded-xl font-semibold text-center opacity-50"
                      >
                        Login
                      </button>
                      <button
                        disabled
                        className="px-6 py-2.5 bg-slate-900 text-white rounded-xl font-semibold text-center opacity-50 flex items-center justify-center gap-2"
                      >
                        Signup
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                        </svg>
                      </button>
                    </>
                  ) : isLoggedIn ? (
                    <>
                      <Link href="/videos" className="text-slate-600 hover:text-slate-900 font-medium py-2" onClick={() => setMobileMenuOpen(false)}>
                        My Videos
                      </Link>
                      <Link href="/profile" className="flex items-center gap-2 text-slate-600 hover:text-slate-900 py-2" onClick={() => setMobileMenuOpen(false)}>
                        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-sm font-semibold">
                          {userEmail ? userEmail.charAt(0).toUpperCase() : 'U'}
                        </div>
                        <span>Profile</span>
                      </Link>
                      <button
                        onClick={() => {
                          handleLogout()
                          setMobileMenuOpen(false)
                        }}
                        className="text-left text-slate-600 hover:text-slate-900 font-medium py-2"
                      >
                        Logout
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => {
                          handleLoginClick()
                          setMobileMenuOpen(false)
                        }}
                        className="px-6 py-2.5 bg-cyan-50 text-slate-900 rounded-xl font-semibold text-center"
                      >
                        Login
                      </button>
                      <button
                        onClick={() => {
                          handleSignupClick()
                          setMobileMenuOpen(false)
                        }}
                        className="px-6 py-2.5 bg-slate-900 text-white rounded-xl font-semibold text-center flex items-center justify-center gap-2"
                      >
                        Signup
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                        </svg>
                      </button>
                    </>
                  )}
                </div>
              </div>
            )}
        </div>
      </nav>

      {/* Hero Section */}
        <section className="pt-32 pb-20 px-4" aria-label="Hero section" itemScope itemType="https://schema.org/WebPageElement">
          <div className="max-w-4xl mx-auto">
            <div className="space-y-8 text-center">
              <div className="inline-flex items-center gap-3 px-6 py-3 bg-indigo-50 border border-indigo-100 rounded-full shadow-lg">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-full blur-xl opacity-75"></div>
                  <div className="relative flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                </div>
                <span className="text-base font-bold text-indigo-900">#1 Rated Platform Worldwide</span>
                <div className="w-px h-6 bg-indigo-200"></div>
                <span className="text-sm font-semibold text-indigo-700">Trusted by 50,000+ Creators</span>
              </div>

              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight" itemProp="name">
                <span className="text-slate-900">Create Stunning</span>
                <br />
                <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  AI Videos
                </span>
              </h1>
              
              <p className="text-xl text-slate-600 leading-relaxed max-w-2xl mx-auto" itemProp="description">
                Transform your ideas into professional videos in seconds with the world's best AI video generator. 
                Create stunning, high-quality videos from text descriptions instantly. No editing skills required. 
                Free to start, trusted by 50,000+ creators worldwide.
              </p>
              
              {/* CTA Input */}
              <div className="space-y-4">
                <div className="relative group max-w-3xl mx-auto">
                  <div className="absolute -inset-1 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-2xl opacity-20 group-hover:opacity-30 blur-xl transition-all"></div>
                  <div className="relative flex gap-3 bg-white rounded-2xl p-2 shadow-xl">
                    <input
                      type="text"
                      value={promptText}
                      onChange={(e) => setPromptText(e.target.value)}
                      placeholder="Describe your video idea..."
                      className="flex-1 px-6 py-4 bg-transparent text-slate-900 placeholder:text-slate-400 outline-none text-lg"
                      aria-label="Video description input"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault()
                          handleGenerateClick()
                        }
                      }}
                    />
                    <button
                      onClick={handleGenerateClick}
                      className="px-10 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-indigo-500/40 transition-all flex items-center gap-2 whitespace-nowrap"
                    >
                      Generate Free
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-center gap-6 text-sm">
                  <div className="flex items-center gap-2 text-slate-600">
                    <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>No credit card required</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-600">
                    <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Free to start</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

      {/* Stats Section */}
        <section className="py-16 px-4" aria-label="Platform statistics" itemScope itemType="https://schema.org/ItemList">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8" role="list">
          {[
            { value: '1M+', label: 'Videos Created', itemProp: 'numberOfItems' },
            { value: '500K+', label: 'Active Users', itemProp: 'audience' },
            { value: '4.9/5', label: 'User Rating', itemProp: 'aggregateRating' },
                { value: '150+', label: 'Countries', itemProp: 'geographicCoverage' }
          ].map((stat, index) => (
            <div key={index} className="text-center" itemScope itemType="https://schema.org/Thing" itemProp="itemListElement">
                  <div className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2" itemProp={stat.itemProp}>
                {stat.value}
              </div>
                  <div className="text-slate-600 font-medium" itemProp="name">{stat.label}</div>
            </div>
          ))}
            </div>
        </div>
      </section>

      {/* Best Text-to-Video Section - Premium Redesign */}
      <section className="relative py-32 px-4 overflow-hidden" aria-labelledby="best-text-to-video-heading" itemScope itemType="https://schema.org/Service">
        {/* Premium Background with Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-indigo-900 to-purple-900"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(99,102,241,0.3),transparent_50%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(168,85,247,0.3),transparent_50%)]"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent"></div>
        
        {/* Animated Grid Pattern */}
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <div 
            className="absolute inset-0"
            style={{
              backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
              backgroundSize: '50px 50px'
            }}
            suppressHydrationWarning
          ></div>
        </div>

        <div className="relative max-w-7xl mx-auto">
          {/* Premium Badge */}
          <div className="text-center mb-12">

            {/* Premium Headline */}
            <h2 id="best-text-to-video-heading" className="text-5xl md:text-6xl lg:text-7xl font-extrabold mb-8 leading-tight">
              <span className="block text-white mb-2">Transform Text Into</span>
              <span className="block bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                Stunning Videos
              </span>
              <span className="block text-white/90 text-4xl md:text-5xl lg:text-6xl mt-3 font-light">
                In Seconds, Not Hours
              </span>
            </h2>
            
            <p className="text-xl md:text-2xl text-white/80 max-w-4xl mx-auto mb-12 leading-relaxed">
              Experience the power of <span className="font-semibold text-white">AI-driven video creation</span> that delivers 
              <span className="font-semibold text-indigo-300"> professional-grade results</span> with unmatched quality, 
              speed, and precision. Join the revolution in content creation.
            </p>
            
            {/* Premium Social Proof Cards */}
            <div className="flex flex-wrap items-center justify-center gap-4 mb-16">
              <div className="group relative px-6 py-4 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl shadow-xl hover:bg-white/15 transition-all hover:scale-105">
                <div className="flex items-center gap-3">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <div>
                    <div className="text-lg font-bold text-white">4.9/5</div>
                    <div className="text-xs text-white/70">From 12,500+ Reviews</div>
                  </div>
                </div>
              </div>
              
              <div className="group relative px-6 py-4 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl shadow-xl hover:bg-white/15 transition-all hover:scale-105">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-emerald-500 rounded-xl flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <div className="text-lg font-bold text-white">Studio Quality</div>
                    <div className="text-xs text-white/70">Professional Results</div>
                  </div>
                </div>
              </div>
              
              <div className="group relative px-6 py-4 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl shadow-xl hover:bg-white/15 transition-all hover:scale-105">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-cyan-500 rounded-xl flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
                    </svg>
                  </div>
                  <div>
                    <div className="text-lg font-bold text-white">Industry Leader</div>
                    <div className="text-xs text-white/70">Most Advanced AI</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Premium Text-to-Video Examples Showcase */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16" role="list" aria-label="Text-to-video conversion examples">
            {[
              {
                text: "A serene sunset over the ocean with waves gently crashing on the shore",
                videoPreview: "/A_serene_sunset.mp4",
                category: "Nature",
                gradient: "from-emerald-500/20 to-teal-500/20"
              },
              {
                text: "A bustling city street at night with neon lights and people walking",
                videoPreview: "/A_bustling_city.mp4",
                category: "Urban",
                gradient: "from-purple-500/20 to-pink-500/20"
              },
              {
                text: "A futuristic robot walking through a high-tech laboratory",
                videoPreview: "/A_futuristic_robot.mp4",
                category: "Sci-Fi",
                gradient: "from-blue-500/20 to-indigo-500/20"
              }
            ].map((example, index) => (
              <article
                key={index}
                className="group relative"
                itemScope
                itemType="https://schema.org/VideoObject"
                role="listitem"
              >
                <meta itemProp="name" content={example.text} />
                <meta itemProp="description" content={`AI-generated video example: ${example.text}`} />
                <meta itemProp="contentUrl" content={`${siteConfig.url}${example.videoPreview}`} />
                <meta itemProp="thumbnailUrl" content={`${siteConfig.url}${example.videoPreview}`} />
                <meta itemProp="genre" content={example.category} />
                {/* Premium Card with Glass Effect */}
                <div className="relative bg-white/10 backdrop-blur-2xl border border-white/20 rounded-3xl overflow-hidden shadow-2xl hover:shadow-indigo-500/20 transition-all duration-500 hover:scale-[1.02] hover:border-white/30">
                  {/* Glow Effect */}
                  <div className={`absolute -inset-0.5 bg-gradient-to-r ${example.gradient} rounded-3xl opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-500`}></div>
                  
                  <div className="relative">
                    {/* Text Input Display - Premium Style */}
                    <div className="p-6 bg-gradient-to-br from-white/5 to-white/0 border-b border-white/10 relative">
                      <div className="flex items-center gap-2.5 mb-4">
                        <div className="relative">
                          <div className="absolute inset-0 bg-green-400 rounded-full blur-md opacity-75"></div>
                          <div className="relative w-2.5 h-2.5 bg-green-400 rounded-full animate-pulse"></div>
                        </div>
                        <span className="text-xs font-bold text-white/90 uppercase tracking-wider">Your Text Input</span>
                      </div>
                      <p className="text-sm text-white/90 leading-relaxed font-medium italic">
                        "{example.text}"
                      </p>
                      
                      {/* Premium Arrow Indicator */}
                      <div className="absolute -bottom-5 left-1/2 -translate-x-1/2 z-20">
                        <div className="relative">
                          <div className="absolute inset-0 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-full blur-lg opacity-50"></div>
                          <div className="relative w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center shadow-xl border-2 border-white/30">
                            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                            </svg>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Premium Video Output Display */}
                    <div className="relative aspect-video bg-slate-900 mt-6 overflow-hidden rounded-b-3xl">
                      <video 
                        autoPlay
                        loop
                        muted
                        playsInline
                        preload="none"
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                        aria-label={`AI-generated video example: ${example.text}`}
                      >
                        <source src={example.videoPreview} type="video/mp4" />
                      </video>
                      
                      {/* Premium Overlay Gradient */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
                      
                      {/* Premium Category Badge */}
                      <div className="absolute top-4 right-4 px-4 py-2 bg-gradient-to-r from-indigo-500/90 to-purple-500/90 backdrop-blur-xl rounded-full text-xs font-bold text-white shadow-lg border border-white/20">
                        {example.category}
                      </div>
                      
                      {/* Premium AI Badge */}
                      <div className="absolute bottom-4 left-4 px-4 py-2 bg-black/70 backdrop-blur-xl rounded-full text-xs font-semibold text-white flex items-center gap-2 border border-white/10">
                        <div className="relative">
                          <div className="absolute inset-0 bg-indigo-400 rounded-full blur-md opacity-50"></div>
                          <svg className="relative w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                            <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <span>AI Generated</span>
                      </div>

                      {/* Play Icon Overlay on Hover */}
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <div className="w-16 h-16 bg-white/20 backdrop-blur-xl rounded-full flex items-center justify-center border border-white/30">
                          <svg className="w-8 h-8 text-white ml-1" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
                          </svg>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>

         

          {/* Premium CTA */}
          <div className="text-center">
            <button
              onClick={handleGenerateClick}
              className="group relative px-10 py-5 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-2xl text-lg font-bold text-white shadow-2xl hover:shadow-indigo-500/50 transition-all duration-500 hover:scale-105 overflow-hidden"
              type="button"
            >
              <span className="absolute inset-0 bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></span>
              <span className="relative flex items-center gap-3">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                <span>Start Creating Free Videos</span>
                <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </span>
            </button>
            <p className="text-white/70 text-sm mt-4">No credit card required • Free forever to start</p>
          </div>
        </div>
      </section>

      {/* Features Section */}
        <section id="features" className="py-24 px-4 bg-white" aria-labelledby="features-heading" itemScope itemType="https://schema.org/ItemList">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-50 border border-indigo-100 rounded-full mb-6">
                <span className="text-sm font-semibold text-indigo-700">Features</span>
              </div>
              <h2 id="features-heading" className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
                Everything You Need
            </h2>
              <p className="text-xl text-slate-600 max-w-2xl mx-auto">
                Professional-grade video generation powered by cutting-edge AI
            </p>
          </div>
          
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8" role="list">
            {[
              {
                icon: (
                    <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                ),
                  title: 'Lightning Fast',
                  description: 'Generate high-quality videos in under 3 minutes with our optimized AI video generation engine'
              },
              {
                icon: (
                    <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                  </svg>
                ),
                  title: 'Professional Quality',
                  description: 'Export in HD, Full HD, and 4K resolution'
              },
              {
                icon: (
                    <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                  </svg>
                ),
                  title: 'Full Control',
                  description: 'Customize every aspect of your video'
              },
              {
                icon: (
                    <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                ),
                  title: 'Image to Video',
                  description: 'Bring your static images to life with AI'
              },
              {
                icon: (
                    <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                ),
                  title: 'Text to Video',
                  description: 'Turn your ideas into stunning visuals instantly'
              },
              {
                icon: (
                    <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                ),
                  title: 'Commercial Use',
                  description: 'Use your videos for business without limits'
              }
            ].map((feature, index) => (
              <div
                key={index}
                  className="group p-8 rounded-2xl bg-gradient-to-br from-slate-50 to-white border border-slate-200 hover:border-indigo-200 hover:shadow-xl hover:shadow-indigo-500/10 transition-all"
              >
                  <div className="w-14 h-14 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center text-white mb-5 shadow-lg shadow-indigo-500/30">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-3">
                  {feature.title}
                </h3>
                  <p className="text-slate-600 leading-relaxed" itemProp="description">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
        <section className="py-24 px-4" aria-labelledby="how-it-works-heading" itemScope itemType="https://schema.org/HowTo">
          <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-50 border border-indigo-100 rounded-full mb-6">
                <span className="text-sm font-semibold text-indigo-700">How It Works</span>
              </div>
              <h2 id="how-it-works-heading" className="text-4xl md:text-5xl font-bold text-slate-900 mb-4" itemProp="name">
                Create Videos in 3 Steps
            </h2>
              <p className="text-xl text-slate-600 max-w-2xl mx-auto" itemProp="description">
                From idea to professional video in minutes
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8" role="list">
            {[
              {
                step: '01',
                  title: 'Describe Your Vision',
                  description: 'Simply type what you want to create - our AI understands your vision'
              },
              {
                step: '02',
                  title: 'AI Works Its Magic',
                  description: 'Our advanced AI processes your request and creates your video'
              },
              {
                step: '03',
                  title: 'Download & Share',
                  description: 'Get your professional video ready to use anywhere'
              }
            ].map((item, index) => (
              <div key={index} className="relative" role="listitem" itemScope itemType="https://schema.org/HowToStep">
                <meta itemProp="position" content={String(index + 1)} />
                <meta itemProp="name" content={item.title} />
                <div className="text-center space-y-4">
                    <div className="relative inline-flex items-center justify-center">
                      <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full blur-xl opacity-40"></div>
                      <div className="relative w-16 h-16 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-full flex items-center justify-center text-white text-2xl font-bold shadow-xl">
                        {item.step}
                      </div>
                    </div>
                    <h3 className="text-2xl font-bold text-slate-900">{item.title}</h3>
                    <p className="text-slate-600 leading-relaxed max-w-xs mx-auto" itemProp="text">{item.description}</p>
                  </div>
                  {index < 2 && (
                    <div className="hidden md:block absolute top-8 left-full w-full h-0.5 bg-gradient-to-r from-indigo-200 to-transparent" />
                  )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
        <section className="py-24 px-4 bg-gradient-to-br from-indigo-600 to-purple-600" aria-label="Call to action">
        <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Ready to Create Your First Video?
            </h2>
            <p className="text-xl text-indigo-100 mb-10 max-w-2xl mx-auto">
              Join thousands of creators using AI to bring their ideas to life
            </p>
            <button
              onClick={handleGenerateClick}
              className="px-10 py-4 bg-white text-indigo-600 rounded-xl text-lg font-bold hover:shadow-2xl hover:scale-105 transition-all inline-flex items-center gap-3"
            >
              Start Creating Free
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </button>
            <p className="text-indigo-100 text-sm mt-4">No credit card required • 3 free videos daily</p>
        </div>
      </section>

      {/* Footer */}
        <footer className="py-12 px-4 bg-white border-t border-slate-200">
          <div className="max-w-7xl mx-auto text-center text-slate-600">
            <p>&copy; 2025 FlowVideo. All rights reserved.</p>
        </div>
      </footer>
      </main>

      {/* Sign In Modal */}
      <SignInModal
        isOpen={showSignInModal}
        onClose={() => setShowSignInModal(false)}
        onSignInSuccess={handleSignInSuccess}
        initialMode={signInMode}
      />
    </>
  )
}
