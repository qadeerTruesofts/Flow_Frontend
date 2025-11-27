'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import dynamic from 'next/dynamic'

// Lazy load MobileMenu component
const MobileMenu = dynamic(() => import('@/components/MobileMenu'), {
  ssr: false
})

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'

interface User {
  id: number
  email: string
  name: string | null
  picture: string | null
  role: string
  created_at: string
}

interface Video {
  id: number
  title: string | null
  prompt: string | null
  status: string
  created_at: string
  video_url: string | null
}

export default function ProfilePage() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [videos, setVideos] = useState<Video[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    checkAuth()
    loadUserVideos()
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

      if (response.ok) {
        const data = await response.json()
        setUser(data.user)
      } else {
        router.push('/')
      }
    } catch (error) {
      console.error('Auth check error:', error)
      router.push('/')
    } finally {
      setLoading(false)
    }
  }

  const loadUserVideos = async () => {
    try {
      const token = localStorage.getItem('access_token')
      if (!token) return

      const response = await fetch(`${API_BASE_URL}/api/profile/videos`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        const data = await response.json()
        setVideos(data.videos || [])
      }
    } catch (error) {
      console.error('Error loading videos:', error)
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
      month: 'long',
      day: 'numeric'
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mb-4"></div>
          <p className="text-slate-600">Loading profile...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 via-purple-50/30 to-white">
      {/* Premium Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-white/90 backdrop-blur-xl border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex justify-between items-center h-24">
            <Link href="/" className="flex items-center gap-2 group">
              <Image 
                src="/VidWave-trans.png" 
                alt="Vidwave Logo" 
                width={250} 
                height={80} 
                className="w-[250px] h-[80px]"
                style={{ width: '250px', height: '80px' }}
                priority
              />
            </Link>
            
            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-8">
              <Link href="/blogs" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">
                Blog
              </Link>
              <Link href="/generate" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">
                Text to AI Video
              </Link>
              <Link href="/videos" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">
                My Videos
              </Link>
              <Link href="/profile" className="text-sm font-medium text-gray-900">
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
              onClick={() => setMobileMenuOpen(true)}
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

      {/* Mobile Menu */}
      <MobileMenu 
        isOpen={mobileMenuOpen} 
        onClose={() => setMobileMenuOpen(false)} 
        onOpenLogin={() => {}}
        isLoggedIn={true}
        userEmail={user?.email || ''}
        onLogout={handleLogout}
      />

      {/* Main Content */}
      <main className="pt-32 pb-20 px-4">
        <div className="max-w-5xl mx-auto">
          {/* Profile Header */}
          <div className="relative group mb-8">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-3xl opacity-20 group-hover:opacity-30 blur transition-all" />
            <div className="relative bg-white border border-slate-200 rounded-3xl p-8 shadow-xl">
              <div className="flex flex-col md:flex-row items-center gap-6">
                {user.picture ? (
                  <img
                    src={user.picture}
                    alt={`Profile picture of ${user.name || user.email}`}
                    className="w-24 h-24 rounded-full shadow-lg object-cover"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="w-24 h-24 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-3xl font-bold shadow-lg">
                    {user.email.charAt(0).toUpperCase()}
                  </div>
                )}
                <div className="flex-1 text-center md:text-left">
                  <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent mb-2">
                    {user.name || user.email.split('@')[0]}
                  </h1>
                  <p className="text-slate-600 mb-4">{user.email}</p>
                  <div className="flex flex-wrap items-center justify-center md:justify-start gap-4">
                    <span className="px-4 py-1.5 bg-indigo-50 text-indigo-700 rounded-full text-sm font-semibold border border-indigo-200">
                      {user.role === 'admin' ? 'Admin' : 'User'}
                    </span>
                    <span className="text-sm text-slate-500">
                      Member since {formatDate(user.created_at)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Statistics Cards */}
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <div className="relative group">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl opacity-20 group-hover:opacity-30 blur transition-all" />
              <div className="relative bg-white border border-slate-200 rounded-2xl p-6 text-center shadow-xl">
                <div className="w-12 h-12 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                </div>
                <div className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2">
                  {videos.length}
                </div>
                <div className="text-sm text-slate-600 font-medium">Total Videos</div>
              </div>
            </div>

            <div className="relative group">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-green-600 to-emerald-600 rounded-2xl opacity-20 group-hover:opacity-30 blur transition-all" />
              <div className="relative bg-white border border-slate-200 rounded-2xl p-6 text-center shadow-xl">
                <div className="w-12 h-12 bg-gradient-to-br from-green-100 to-emerald-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div className="text-4xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-2">
                  {videos.filter(v => v.status === 'completed').length}
                </div>
                <div className="text-sm text-slate-600 font-medium">Completed</div>
              </div>
            </div>

            <div className="relative group">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-2xl opacity-20 group-hover:opacity-30 blur transition-all" />
              <div className="relative bg-white border border-slate-200 rounded-2xl p-6 text-center shadow-xl">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-cyan-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <svg className="w-6 h-6 text-blue-600 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                </div>
                <div className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent mb-2">
                  {videos.filter(v => v.status === 'processing' || v.status === 'queued').length}
                </div>
                <div className="text-sm text-slate-600 font-medium">In Progress</div>
              </div>
            </div>
          </div>

          {/* Account Details */}
          <div className="relative group">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl opacity-20 group-hover:opacity-30 blur transition-all" />
            <div className="relative bg-white border border-slate-200 rounded-2xl p-8 shadow-xl">
              <h2 className="text-2xl font-bold text-slate-900 mb-6">Account Details</h2>
              <div className="space-y-4">
                {user.name && (
                  <div className="flex items-center justify-between py-4 border-b border-slate-200">
                    <span className="text-slate-600 font-medium">Full Name</span>
                    <span className="text-slate-900 font-semibold">{user.name}</span>
                  </div>
                )}
                <div className="flex items-center justify-between py-4 border-b border-slate-200">
                  <span className="text-slate-600 font-medium">Email Address</span>
                  <span className="text-slate-900 font-semibold">{user.email}</span>
                </div>
                <div className="flex items-center justify-between py-4 border-b border-slate-200">
                  <span className="text-slate-600 font-medium">Account Type</span>
                  <span className="px-4 py-1.5 bg-indigo-50 text-indigo-700 rounded-full text-sm font-semibold border border-indigo-200">
                    {user.role === 'admin' ? 'Administrator' : 'Standard User'}
                  </span>
                </div>
                <div className="flex items-center justify-between py-4">
                  <span className="text-slate-600 font-medium">Member Since</span>
                  <span className="text-slate-900">{formatDate(user.created_at)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
