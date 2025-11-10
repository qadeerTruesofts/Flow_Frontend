'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'

interface Video {
  id: number
  title: string | null
  prompt: string | null
  status: string
  created_at: string
  video_url: string | null
  file_size: number | null
}

export default function VideosPage() {
  const router = useRouter()
  const [videos, setVideos] = useState<Video[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    checkAuth()
    loadVideos()
  }, [])

  const checkAuth = async () => {
    try {
      const token = localStorage.getItem('access_token')
      if (!token) {
        router.push('/')
        return
      }

      const response = await fetch(`${API_BASE_URL}/api/auth/me`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (!response.ok) {
        router.push('/')
      }
    } catch (error) {
      console.error('Auth check error:', error)
      router.push('/')
    }
  }

  const loadVideos = async () => {
    try {
      const token = localStorage.getItem('access_token')
      if (!token) {
        setError('Please log in to view your videos')
        setLoading(false)
        return
      }

      const response = await fetch(`${API_BASE_URL}/api/profile/videos`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        const data = await response.json()
        setVideos(data.videos || [])
      } else {
        setError('Failed to load videos')
      }
    } catch (error) {
      console.error('Error loading videos:', error)
      setError('Error loading videos. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('access_token')
    router.push('/')
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mb-4"></div>
          <p className="text-slate-600">Loading videos...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 via-purple-50/30 to-white">
      {/* Premium Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-white/90 backdrop-blur-xl border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="w-9 h-9 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 rounded-xl shadow-lg group-hover:shadow-xl transition-shadow" />
              <span className="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">VideoAI</span>
            </Link>
            
            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-8">
              <Link href="/blogs" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">
                Blog
              </Link>
              <Link href="/generate" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">
                Text to AI Video
              </Link>
              <Link href="/videos" className="text-sm font-medium text-gray-900">
                My Videos
              </Link>
              <Link href="/profile" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">
                Profile
              </Link>
              <button
                onClick={handleLogout}
                className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
              >
                Logout
              </button>
            </div>
            
            {/* Mobile Menu Button */}
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-gray-600 hover:text-gray-900 transition-colors"
              aria-label="Open menu"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
          
          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="md:hidden py-4 border-t border-gray-200">
              <div className="flex flex-col gap-3">
                <Link href="/blogs" className="text-gray-600 hover:text-gray-900 font-medium py-2" onClick={() => setMobileMenuOpen(false)}>
                  Blog
                </Link>
                <Link href="/generate" className="text-gray-600 hover:text-gray-900 font-medium py-2" onClick={() => setMobileMenuOpen(false)}>
                  Text to AI Video
                </Link>
                <Link href="/videos" className="text-gray-900 font-medium py-2" onClick={() => setMobileMenuOpen(false)}>
                  My Videos
                </Link>
                <Link href="/profile" className="text-gray-600 hover:text-gray-900 font-medium py-2" onClick={() => setMobileMenuOpen(false)}>
                  Profile
                </Link>
                <button
                  onClick={() => {
                    handleLogout()
                    setMobileMenuOpen(false)
                  }}
                  className="text-left text-gray-600 hover:text-gray-900 font-medium py-2"
                >
                  Logout
                </button>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Main Content */}
      <main className="pt-32 pb-20 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-slate-900 via-indigo-700 to-slate-900 bg-clip-text text-transparent mb-4">
              My Videos
            </h1>
            <p className="text-lg text-slate-600">View and download all your generated videos</p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-8">
              <p className="text-red-700">{error}</p>
            </div>
          )}

          {videos.length === 0 ? (
            <div className="relative group">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-3xl opacity-20 blur transition-all" />
              <div className="relative bg-white border border-slate-200 rounded-3xl shadow-xl p-12 text-center">
                <div className="w-24 h-24 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-3xl flex items-center justify-center mx-auto mb-6">
                  <svg className="w-12 h-12 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-3">No Videos Yet</h3>
                <p className="text-slate-600 mb-8 max-w-md mx-auto">
                  Start creating amazing videos with AI! Your generated videos will appear here.
                </p>
                <Link
                  href="/generate"
                  className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-indigo-500/40 transition-all"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  Create Your First Video
                </Link>
              </div>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {videos.map((video) => (
                <div key={video.id} className="relative group">
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl opacity-20 group-hover:opacity-30 blur transition-all" />
                  <div className="relative bg-white border border-slate-200 rounded-2xl shadow-xl overflow-hidden flex flex-col h-full">
                    {/* Video Player Section */}
                    {video.status === 'completed' && video.video_url ? (
                      <div className="relative w-full aspect-video bg-black">
                        <video
                          src={`${API_BASE_URL}${video.video_url}`}
                          controls
                          className="w-full h-full object-contain"
                          preload="none"
                          loading="lazy"
                          playsInline
                          aria-label={`Generated video: ${video.prompt || 'AI generated video'}`}
                        >
                          Your browser does not support the video tag.
                        </video>
                      </div>
                    ) : (
                      <div className="relative w-full aspect-video bg-gradient-to-br from-slate-100 to-slate-50 flex items-center justify-center border-b border-slate-200">
                        <div className="text-center p-6">
                          <div className="inline-block w-16 h-16 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-2xl flex items-center justify-center mb-4">
                            {video.status === 'processing' || video.status === 'queued' ? (
                              <svg className="w-8 h-8 text-indigo-600 animate-spin" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                              </svg>
                            ) : (
                              <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                              </svg>
                            )}
                          </div>
                          <p className="text-sm font-medium text-slate-600 capitalize">
                            {video.status === 'processing' ? 'Generating...' : video.status}
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Info Section */}
                    <div className="p-5 flex-1 flex flex-col">
                      {/* Status Badge & Date */}
                      <div className="flex items-center justify-between mb-3">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          video.status === 'completed' ? 'bg-green-100 text-green-700 border border-green-200' :
                          video.status === 'processing' ? 'bg-blue-100 text-blue-700 border border-blue-200' :
                          video.status === 'queued' ? 'bg-yellow-100 text-yellow-700 border border-yellow-200' :
                          'bg-red-100 text-red-700 border border-red-200'
                        }`}>
                          {video.status === 'completed' ? '✓ Ready' : video.status}
                        </span>
                        <span className="text-xs text-slate-500">
                          {formatDate(video.created_at)}
                        </span>
                      </div>

                      {/* Prompt */}
                      {video.prompt && (
                        <p className="text-sm text-slate-600 mb-4 line-clamp-2 flex-1">
                          {video.prompt}
                        </p>
                      )}

                      {/* Download Button */}
                      {video.status === 'completed' && video.video_url && (
                        <a
                          href={`${API_BASE_URL}${video.video_url}`}
                          download
                          className="inline-flex items-center justify-center gap-2 w-full px-4 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-indigo-500/40 transition-all"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                          </svg>
                          Download Video
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Quick Action */}
          {videos.length > 0 && (
            <div className="mt-12 text-center">
              <Link
                href="/generate"
                className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-indigo-500/40 transition-all"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Create New Video
              </Link>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
