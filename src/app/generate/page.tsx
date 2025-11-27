'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useSearchParams, useRouter } from 'next/navigation'
import dynamic from 'next/dynamic'

// Lazy load components
const MobileMenu = dynamic(() => import('@/components/MobileMenu'), {
  ssr: false
})
const LoginPopup = dynamic(() => import('@/components/LoginPopup'), {
  ssr: false
})

// Backend API URL - change this to your backend server URL
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'

export default function GeneratePage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [prompt, setPrompt] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [isLoginOpen, setIsLoginOpen] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [authChecked, setAuthChecked] = useState(false)
  const [userEmail, setUserEmail] = useState('')
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [aspectRatio, setAspectRatio] = useState<'portrait' | 'landscape'>('portrait')
  const [jobId, setJobId] = useState<string | null>(null)
  const [generationStatus, setGenerationStatus] = useState<string>('idle')
  const [statusMessage, setStatusMessage] = useState<string>('')
  const [videoUrl, setVideoUrl] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [progress, setProgress] = useState(0)
  const progressTimerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    // Check for access_token in URL (from Google OAuth redirect - in case user lands directly here)
    let hadAccessToken = false
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search)
      const accessToken = urlParams.get('access_token')
      
      if (accessToken) {
        // Store the token
        localStorage.setItem('access_token', accessToken)
        hadAccessToken = true
        
        // Clean up URL by removing access_token parameter but keep all other params including prompt
        const currentSearch = new URLSearchParams(window.location.search)
        currentSearch.delete('access_token')
        const newUrl = window.location.pathname + (currentSearch.toString() ? `?${currentSearch.toString()}` : '')
        window.history.replaceState({}, document.title, newUrl)
      }
    }
    
    const urlPrompt = searchParams.get('prompt')
    if (urlPrompt) {
      setPrompt(urlPrompt)
    }
    
    // Check auth status
    checkAuth()
  }, [searchParams])

  useEffect(() => {
    if (!authChecked) return
    setIsLoginOpen(!isLoggedIn)
  }, [isLoggedIn, authChecked])

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
    } finally {
      setAuthChecked(true)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('access_token')
    setIsLoggedIn(false)
    setUserEmail('')
  }

  // Poll for job status
  useEffect(() => {
    if (!jobId || !isGenerating) return

    const pollStatus = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/status/${jobId}`)
        const data = await response.json()

        setGenerationStatus(data.status)

        if (data.status === 'queued') {
          setStatusMessage('Queued... waiting to start')
        } else if (data.status === 'processing') {
          setStatusMessage('Generating video... this may take 1 minute')
        } else if (data.status === 'completed') {
          setStatusMessage('Video ready!')
          setProgress(100)
          setVideoUrl(`${API_BASE_URL}${data.video_url}`)
          setIsGenerating(false)
          setError(null)
        } else if (data.status === 'failed') {
          const errorMessage = data.error || 'Unknown error occurred during video generation'
          console.error('Video generation failed:', errorMessage)
          console.error('Full status data:', data)
          setStatusMessage('Generation failed')
          setError(errorMessage)
          setIsGenerating(false)
          setProgress(0)
        }
      } catch (err) {
        console.error('Status poll error:', err)
        setError('Failed to check status. Is the backend running?')
      }
    }

    // Poll every 3 seconds
    const interval = setInterval(pollStatus, 3000)
    pollStatus() // Initial poll

    return () => clearInterval(interval)
  }, [jobId, isGenerating])

  const startGeneration = async () => {
    if (!isLoggedIn) {
      setError('Please sign in to generate a video.')
      setIsLoginOpen(true)
      return
    }
    const token = localStorage.getItem('access_token')
    if (!token) {
      setError('Please sign in to generate a video.')
      setIsLoggedIn(false)
      setIsLoginOpen(true)
      return
    }

    setIsGenerating(true)
    setError(null)
    setVideoUrl(null)
    setJobId(null)
    setProgress(0)
    setStatusMessage('Starting video generation...')
    
    try {
      const token = localStorage.getItem('access_token')
      // Prepare request body
      const requestBody: Record<string, any> = {
        prompt,
        aspect_ratio: aspectRatio,
      }

      // Call backend API to generate video
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }

      const response = await fetch(`${API_BASE_URL}/api/generate`, {
        method: 'POST',
        headers,
        body: JSON.stringify(requestBody),
      })

      const data = await response.json()

      if (!response.ok) {
        if (response.status === 429) {
          // Daily limit exceeded
          setError(data.message || data.error || 'Daily limit exceeded')
          setIsGenerating(false)
          setProgress(0)
          return
        } else {
          throw new Error(data.error || data.message || `Server error: ${response.status}`)
        }
      }

      setJobId(data.job_id)
      setStatusMessage('Job created, starting generation...')
      setProgress(0)

    } catch (err: any) {
      console.error('Generation error:', err)
      setError(err.message || 'Failed to start generation. Make sure the backend is running on port 8080.')
      setIsGenerating(false)
      setProgress(0)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (prompt) {
      startGeneration()
    }
  }

  useEffect(() => {
    if (isGenerating) {
      const startTime = Date.now()
      if (progressTimerRef.current) {
        clearInterval(progressTimerRef.current)
      }
      progressTimerRef.current = setInterval(() => {
        const elapsed = Date.now() - startTime
        const duration = 80000 // 1 minute 20 seconds
        const nextProgress = Math.min(100, Math.round((elapsed / duration) * 100))
        setProgress(nextProgress)
        if (elapsed >= duration && progressTimerRef.current) {
          clearInterval(progressTimerRef.current)
          progressTimerRef.current = null
        }
      }, 500)
    } else if (progressTimerRef.current) {
      clearInterval(progressTimerRef.current)
      progressTimerRef.current = null
    }

    return () => {
      if (progressTimerRef.current) {
        clearInterval(progressTimerRef.current)
        progressTimerRef.current = null
      }
    }
  }, [isGenerating])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-purple-50">
      {/* Premium Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-white/90 backdrop-blur-xl border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex justify-between items-center h-24">
            <Link href="/" className="flex items-center gap-2 group">
              <Image 
                src="/VidWave-trans.png" 
                alt="Vidwave Logo" 
                width={230} 
                height={80} 
                className="w-[230px] h-[80px]"
                style={{ width: '230px', height: '80px' }}
                priority
              />
            </Link>
            
            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-8">
              <Link href="/blogs" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">
                Blog
              </Link>
              <Link href="/generate" className="text-sm font-medium text-gray-900">
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
                    onClick={() => setIsLoginOpen(true)}
                    className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
                  >
                    Login
                  </button>
                  <button 
                    onClick={() => setIsLoginOpen(true)}
                    className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-sm font-semibold rounded-full hover:shadow-lg hover:scale-105 transition-all"
                  >
                    Get Started Free
                  </button>
                </>
              )}
            </div>
            
            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="md:hidden p-2 text-gray-600 hover:text-gray-900 transition-colors"
              aria-label="Toggle menu"
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
        onOpenLogin={() => setIsLoginOpen(true)}
        isLoggedIn={isLoggedIn}
        userEmail={userEmail}
        onLogout={handleLogout}
      />

      <div className="pt-32 pb-20 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Premium Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-black">
              Generate Your Video
            </h1>
            <p className="text-lg text-slate-600">Transform your ideas into stunning videos with AI</p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Left Panel - Input */}
            <div className="space-y-6">
              {/* Prompt Input */}
              <div className="relative group">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl opacity-20 group-hover:opacity-30 blur transition-all" />
                <div className="relative bg-white border border-slate-200 rounded-2xl p-6 shadow-xl">
                  <label className="block text-sm font-semibold text-slate-700 mb-3">
                    Video Description
                    </label>
                    <textarea
                      value={prompt}
                      onChange={(e) => setPrompt(e.target.value)}
                      rows={8}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all resize-none text-lg text-slate-900 placeholder:text-slate-400"
                      placeholder="Describe your video in detail..."
                      required
                    />
                  <div className="flex justify-between items-center mt-3">
                    <p className="text-xs text-slate-500">{prompt.length}/2000 characters</p>
                      {prompt.length > 0 && (
                        <button
                          type="button"
                          onClick={() => setPrompt('')}
                        className="text-xs text-slate-500 hover:text-slate-900 transition-colors font-medium"
                        >
                          Clear
                        </button>
                      )}
                  </div>
                </div>
              </div>

              {/* Settings Panel */}
              <div className="relative group">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl opacity-20 group-hover:opacity-30 blur transition-all" />
                <div className="relative bg-white border border-slate-200 rounded-2xl p-6 shadow-xl">
                  <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
                    <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                    </svg>
                    Settings
                  </h3>
                  
                  <div className="space-y-5">
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-3">
                        Aspect Ratio
                      </label>
                      <div className="grid grid-cols-2 gap-3">
                        <button
                          type="button"
                          onClick={() => setAspectRatio('portrait')}
                          className={`p-4 rounded-xl text-left transition-all ${
                            aspectRatio === 'portrait'
                              ? 'bg-gradient-to-br from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-500/30'
                              : 'bg-slate-50 border border-slate-200 text-slate-700 hover:border-indigo-300'
                          }`}
                        >
                          <div className="font-semibold mb-1">Portrait • 9:16</div>
                          <div className={`text-xs ${aspectRatio === 'portrait' ? 'text-indigo-100' : 'text-slate-500'}`}>
                           
                          </div>
                        </button>
                        <button
                          type="button"
                          onClick={() => setAspectRatio('landscape')}
                          className={`p-4 rounded-xl text-left transition-all ${
                            aspectRatio === 'landscape'
                              ? 'bg-gradient-to-br from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-500/30'
                              : 'bg-slate-50 border border-slate-200 text-slate-700 hover:border-indigo-300'
                          }`}
                        >
                          <div className="font-semibold mb-1">Landscape • 16:9</div>
                          <div className={`text-xs ${aspectRatio === 'landscape' ? 'text-indigo-100' : 'text-slate-500'}`}>
                            
                          </div>
                        </button>
                      </div>
                    </div>

                  </div>
                </div>
              </div>

              {/* Generate Button */}
              <button
                onClick={handleSubmit}
                disabled={isGenerating || !prompt}
                className="relative w-full group"
              >
                <div className="absolute -inset-0.5 bg-black rounded-2xl opacity-75 group-hover:opacity-100 blur transition-all" />
                <div className={`relative w-full py-5 bg-black rounded-2xl font-bold text-lg text-white transition-all flex items-center justify-center gap-3 shadow-xl border-2 border-gray-800/50 ${
                  isGenerating || !prompt
                    ? 'opacity-50 cursor-not-allowed border-gray-800/30'
                    : 'hover:scale-[1.02] shadow-gray-900/40 hover:border-gray-800'
                }`}>
                  {isGenerating ? (
                    <>
                      <svg className="animate-spin h-6 w-6" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Generating Your Video...
                    </>
                  ) : (
                    <>
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                      Generate Video
                    </>
                  )}
                </div>
              </button>
            </div>

            {/* Right Panel - Preview */}
            <div className="lg:sticky lg:top-32 lg:h-fit">
              <div className="relative group">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl opacity-20 group-hover:opacity-30 blur transition-all" />
                <div className="relative bg-white border border-slate-200 rounded-2xl p-6 shadow-xl">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
                      <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                      Preview
                    </h3>
                    {!isGenerating && !videoUrl && (
                      <span className="text-xs px-3 py-1.5 bg-green-50 text-green-700 rounded-full border border-green-200 font-medium">
                        Ready
                      </span>
                    )}
                  </div>
                  
                  <div
                    className={`bg-gradient-to-br from-slate-100 to-slate-50 rounded-2xl border border-slate-200 relative ${
                      videoUrl
                        ? 'aspect-video min-h-[240px] sm:min-h-[320px] flex items-center justify-center overflow-hidden'
                        : 'p-4 sm:p-8 min-h-[260px]'
                    }`}
                  >
                    {videoUrl ? (
                      // Video ready - show the video
                      <div className="w-full h-full flex flex-col">
                        <div className="relative flex-1 w-full bg-black rounded-2xl overflow-hidden">
                          <video
                            src={videoUrl}
                            controls
                            autoPlay
                            className="w-full h-full object-contain bg-black"
                          />
                          <div className="pointer-events-none absolute inset-0 rounded-2xl ring-1 ring-black/10" />
                          <div className="absolute -bottom-6 left-0 right-0 flex justify-center">
                            <div className="pointer-events-none h-6 w-4 rounded-b-full bg-black opacity-20 blur" />
                          </div>
                        </div>
                        <a
                          href={videoUrl}
                          download
                          className="mt-5 w-full py-3.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-indigo-500/40 transition-all flex items-center justify-center gap-2 shadow-lg"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                          </svg>
                          Download Video
                        </a>
                      </div>
                    ) : isGenerating ? (
                      // Generating - show progress
                      <div className="text-center p-8 w-full">
                        <div className="relative w-20 h-20 mx-auto mb-6">
                          <div className="absolute inset-0 border-4 border-indigo-200 rounded-full" />
                          <div className="absolute inset-0 border-4 border-transparent border-t-indigo-600 rounded-full animate-spin" />
                          <div className="absolute inset-0 flex items-center justify-center text-sm font-bold text-indigo-600">
                            {Math.min(100, Math.round(progress))}%
                          </div>
                        </div>
                        <p className="text-lg font-semibold text-slate-900 mb-2">{statusMessage}</p>
                        <p className="text-sm text-slate-600 mb-4">
                          {generationStatus === 'queued' && 'Waiting in queue...'}
                          {generationStatus === 'processing' && 'AI is generating your video. This typically takes 1 minute.'}
                        </p>
                        {jobId && (
                          <p className="text-xs text-slate-500 mb-4 font-mono">
                            Job ID: {jobId.substring(0, 8)}...
                          </p>
                        )}
                        <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                          <div 
                            className="bg-gradient-to-r from-indigo-600 to-purple-600 h-full rounded-full transition-all duration-500"
                            style={{ width: `${progress}%` }}
                          />
                        </div>
                        {error && (
                          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
                            <p className="font-semibold mb-1">Error:</p>
                            <p>{error}</p>
                          </div>
                        )}
                      </div>
                    ) : error ? (
                      // Error state
                      <div className="text-center px-8">
                        <div className="w-20 h-20 bg-red-50 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-red-200">
                          <svg className="w-10 h-10 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </div>
                        <p className="text-red-600 mb-3 font-bold text-lg">⚠️ Generation Failed</p>
                        <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-4 text-left">
                          <p className="text-sm font-semibold text-red-700 mb-2">Error Details:</p>
                          <p className="text-sm text-slate-700 whitespace-pre-wrap break-words">{error}</p>
                        </div>
                        <div className="flex flex-col gap-2">
                          <button
                            onClick={() => {
                              setError(null)
                              setVideoUrl(null)
                              setProgress(0)
                              setIsGenerating(false)
                              setStatusMessage('')
                            }}
                            className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:shadow-lg text-white rounded-xl text-sm font-semibold transition-all"
                          >
                            Try Again
                          </button>
                          <button
                            onClick={() => {
                              setError(null)
                              setVideoUrl(null)
                              setProgress(0)
                              setIsGenerating(false)
                              setStatusMessage('')
                              setPrompt('')
                            }}
                            className="px-6 py-2 bg-slate-100 hover:bg-slate-200 text-slate-900 rounded-lg text-sm font-medium transition-all"
                          >
                            Start Over
                          </button>
                        </div>
                      </div>
                    ) : (
                      // Idle state
                      <div className="text-center px-8">
                        <div className="w-20 h-20 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-indigo-200">
                          <svg className="w-10 h-10 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </div>
                        <p className="text-slate-700 mb-2 font-medium">Your video will appear here</p>
                        <p className="text-sm text-slate-500">
                          Enter your prompt and click Generate
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Pro Tips */}
                  <div className="mt-6 p-4 bg-gradient-to-br from-indigo-50 to-purple-50 border border-indigo-100 rounded-xl">
                    <h4 className="text-sm font-semibold text-indigo-900 mb-3 flex items-center gap-2">
                      <svg className="w-4 h-4 text-indigo-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                      </svg>
                      Pro Tips
                    </h4>
                    <ul className="text-xs text-slate-600 space-y-2">
                      <li className="flex items-start gap-2">
                        <span className="text-indigo-600 mt-0.5 font-bold">•</span>
                        <span>Be specific and descriptive in your prompts for better results</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-indigo-600 mt-0.5 font-bold">•</span>
                        <span>Experiment with different styles to find your perfect look</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-indigo-600 mt-0.5 font-bold">•</span>
                        <span>Generation typically takes 1 minute</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Login Popup */}
      <LoginPopup 
        isOpen={isLoginOpen} 
        onClose={() => {
          // Don't allow closing if not logged in - login is required
          if (!isLoggedIn) {
            return
          }
          setIsLoginOpen(false)
        }} 
      />
    </div>
  )
}
