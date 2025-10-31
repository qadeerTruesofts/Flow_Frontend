'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import SignInModal from '@/components/SignInModal'

// Backend API URL - change this to your backend server URL
const API_BASE_URL = 'http://localhost:8080'

export default function GeneratePage() {
  const searchParams = useSearchParams()
  const [prompt, setPrompt] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [showSignInModal, setShowSignInModal] = useState(false)
  const [generationSettings, setGenerationSettings] = useState({
    style: 'realistic',
    model: 'turbo'
  })
  const [jobId, setJobId] = useState<string | null>(null)
  const [generationStatus, setGenerationStatus] = useState<string>('idle')
  const [statusMessage, setStatusMessage] = useState<string>('')
  const [videoUrl, setVideoUrl] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const urlPrompt = searchParams.get('prompt')
    if (urlPrompt) {
      setPrompt(urlPrompt)
    }
  }, [searchParams])

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
          setProgress(10)
        } else if (data.status === 'processing') {
          setStatusMessage('Generating video... this may take 5-10 minutes')
          setProgress(50)
        } else if (data.status === 'completed') {
          setStatusMessage('Video ready!')
          setProgress(100)
          setVideoUrl(`${API_BASE_URL}${data.video_url}`)
          setIsGenerating(false)
          setError(null)
        } else if (data.status === 'failed') {
          setStatusMessage('Generation failed')
          setError(data.error || 'Unknown error occurred')
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
    setIsGenerating(true)
    setError(null)
    setVideoUrl(null)
    setJobId(null)
    setProgress(5)
    setStatusMessage('Starting video generation...')
    
    try {
      // Prepare request body
      const requestBody: any = {
        prompt: prompt,
      }

      // Call backend API to generate video
      const response = await fetch(`${API_BASE_URL}/api/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      })

      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`)
      }

      const data = await response.json()
      setJobId(data.job_id)
      setStatusMessage('Job created, starting generation...')
      setProgress(15)

    } catch (err: any) {
      console.error('Generation error:', err)
      setError(err.message || 'Failed to start generation. Make sure the backend is running on port 8080.')
      setIsGenerating(false)
      setProgress(0)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Show sign-in modal if user is not authenticated
    // For now, always show modal (can be replaced with auth check later)
    setShowSignInModal(true)
  }

  const handleSignInSuccess = () => {
    setShowSignInModal(false)
    // Proceed with generation after sign-in
    if (prompt) {
      startGeneration()
    }
  }

  useEffect(() => {
    // Show sign-in modal when page loads (first time)
    // Check if user came from article page
    const shouldShowModal = searchParams.get('signin') === 'true'
    if (shouldShowModal) {
      setShowSignInModal(true)
    }
  }, [searchParams])


  return (
    <div className="min-h-screen bg-black text-white">
      {/* Premium Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-black/90 backdrop-blur-xl border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <Link href="/" className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              </div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent">
                AI Video Generator
              </h1>
            </Link>
            <div className="flex items-center gap-4">
              <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-purple-600/10 border border-purple-500/20 rounded-full">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                <span className="text-sm text-gray-300">Ready to Generate</span>
              </div>
              <button className="px-5 py-2 bg-purple-600/20 hover:bg-purple-600/30 border border-purple-500/30 rounded-xl text-sm font-semibold transition-all">
                My Videos
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="pt-28 pb-12 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Premium Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-white via-purple-200 to-white bg-clip-text text-transparent">
              Create Your Video
            </h1>
            <p className="text-lg text-gray-400">Configure your settings and generate your masterpiece</p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Left Panel - Input */}
            <div className="space-y-6">
              {/* Mode Selector with Premium Design */}
              <div className="relative">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl opacity-20 blur" />
                <div className="relative bg-gradient-to-br from-gray-900 to-black border border-white/10 rounded-2xl p-6">
                  {/* Text Input Section */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Your Prompt
                    </label>
                    <textarea
                      value={prompt}
                      onChange={(e) => setPrompt(e.target.value)}
                      rows={8}
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-500/50 outline-none transition-all resize-none text-lg"
                      placeholder="Describe your video in detail..."
                      required
                    />
                    <div className="flex justify-between items-center mt-2">
                      <p className="text-xs text-gray-500">{prompt.length}/2000 characters</p>
                      {prompt.length > 0 && (
                        <button
                          type="button"
                          onClick={() => setPrompt('')}
                          className="text-xs text-gray-400 hover:text-white transition-colors"
                        >
                          Clear
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Settings Panel */}
              <div className="relative">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl opacity-20 blur" />
                <div className="relative bg-gradient-to-br from-gray-900 to-black border border-white/10 rounded-2xl p-6">
                  <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
                    <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                    </svg>
                    Advanced Settings
                  </h3>
                  
                  <div className="space-y-6">
                    {/* Model Selection */}
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-3">
                        AI Model
                      </label>
                      <div className="grid grid-cols-2 gap-3">
                        <button
                          onClick={() => setGenerationSettings({...generationSettings, model: 'turbo'})}
                          className={`p-4 rounded-xl text-left transition-all ${
                            generationSettings.model === 'turbo'
                              ? 'bg-gradient-to-br from-purple-600 to-pink-600 border-2 border-purple-400 shadow-lg shadow-purple-500/50'
                              : 'bg-white/5 border border-white/10 hover:border-white/20'
                          }`}
                        >
                          <div className="font-semibold mb-1">Turbo</div>
                          <div className="text-xs text-gray-400">Fast • 30s</div>
                        </button>
                        <button
                          onClick={() => setGenerationSettings({...generationSettings, model: 'pro'})}
                          className={`p-4 rounded-xl text-left transition-all ${
                            generationSettings.model === 'pro'
                              ? 'bg-gradient-to-br from-purple-600 to-pink-600 border-2 border-purple-400 shadow-lg shadow-purple-500/50'
                              : 'bg-white/5 border border-white/10 hover:border-white/20'
                          }`}
                        >
                          <div className="font-semibold mb-1">Pro</div>
                          <div className="text-xs text-gray-400">Quality • 2min</div>
                        </button>
                      </div>
                    </div>

                    {/* Style */}
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-3">
                        Visual Style
                      </label>
                      <select
                        value={generationSettings.style}
                        onChange={(e) => setGenerationSettings({
                          ...generationSettings,
                          style: e.target.value
                        })}
                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:border-purple-500 outline-none appearance-none cursor-pointer hover:bg-white/10 transition-all"
                      >
                        <option value="realistic">Realistic</option>
                        <option value="cinematic">Cinematic</option>
                        <option value="artistic">Artistic</option>
                        <option value="anime">Anime</option>
                      </select>
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
                <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl opacity-75 group-hover:opacity-100 blur transition-all" />
                <div className={`relative w-full py-5 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl font-bold text-lg transition-all flex items-center justify-center gap-3 ${
                  isGenerating || !prompt
                    ? 'opacity-50 cursor-not-allowed'
                    : 'hover:scale-[1.02]'
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
            <div className="lg:sticky lg:top-28 lg:h-fit">
              <div className="relative">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl opacity-20 blur" />
                <div className="relative bg-gradient-to-br from-gray-900 to-black border border-white/10 rounded-2xl p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-semibold flex items-center gap-2">
                      <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                      Preview
                    </h3>
                    {!isGenerating && (
                      <span className="text-xs px-3 py-1.5 bg-purple-600/20 text-purple-300 rounded-full border border-purple-500/30">
                        Ready
                      </span>
                    )}
                  </div>
                  
                  <div className="aspect-video bg-black/50 rounded-2xl flex items-center justify-center border border-white/10 overflow-hidden relative">
                    {videoUrl ? (
                      // Video ready - show the video
                      <div className="w-full h-full">
                        <video
                          src={videoUrl}
                          controls
                          autoPlay
                          className="w-full h-full object-contain"
                        />
                        <div className="absolute bottom-4 left-4 right-4">
                          <a
                            href={videoUrl}
                            download
                            className="w-full py-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl font-semibold hover:opacity-90 transition-all flex items-center justify-center gap-2 shadow-lg"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                            </svg>
                            Download Video
                          </a>
                        </div>
                      </div>
                    ) : isGenerating ? (
                      // Generating - show progress
                      <div className="text-center p-8 w-full">
                        <div className="relative w-20 h-20 mx-auto mb-6">
                          <div className="absolute inset-0 border-4 border-purple-600/30 rounded-full" />
                          <div className="absolute inset-0 border-4 border-transparent border-t-purple-600 rounded-full animate-spin" />
                          <div className="absolute inset-0 flex items-center justify-center text-sm font-bold text-purple-400">
                            {progress}%
                          </div>
                        </div>
                        <p className="text-lg font-semibold mb-2">{statusMessage}</p>
                        <p className="text-sm text-gray-400 mb-4">
                          {generationStatus === 'queued' && 'Waiting in queue...'}
                          {generationStatus === 'processing' && 'Ai Video Generator is generating your video. This typically takes 5-10 minutes.'}
                        </p>
                        {jobId && (
                          <p className="text-xs text-gray-500 mb-4">
                            Job ID: {jobId.substring(0, 8)}...
                          </p>
                        )}
                        <div className="w-full bg-white/10 rounded-full h-2 overflow-hidden">
                          <div 
                            className="bg-gradient-to-r from-purple-600 to-pink-600 h-full rounded-full transition-all duration-500"
                            style={{ width: `${progress}%` }}
                          />
                        </div>
                        {error && (
                          <div className="mt-4 p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-sm text-red-300">
                            <p className="font-semibold mb-1">Error:</p>
                            <p>{error}</p>
                          </div>
                        )}
                      </div>
                    ) : error ? (
                      // Error state
                      <div className="text-center px-8">
                        <div className="w-20 h-20 bg-red-600/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                          <svg className="w-10 h-10 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </div>
                        <p className="text-red-400 mb-2 font-semibold">Generation Failed</p>
                        <p className="text-sm text-gray-400 mb-4">{error}</p>
                        <button
                          onClick={() => {
                            setError(null)
                            setVideoUrl(null)
                            setProgress(0)
                          }}
                          className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-sm transition-all"
                        >
                          Try Again
                        </button>
                      </div>
                    ) : (
                      // Idle state
                      <div className="text-center px-8">
                        <div className="w-20 h-20 bg-gradient-to-br from-purple-600/20 to-pink-600/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                          <svg className="w-10 h-10 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                          </svg>
                        </div>
                        <p className="text-gray-400 mb-2">Your video will appear here</p>
                        <p className="text-sm text-gray-500">
                          Configure settings and click Generate
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Pro Tips */}
                  <div className="mt-6 p-4 bg-gradient-to-br from-purple-600/10 to-pink-600/10 border border-purple-500/20 rounded-xl">
                    <h4 className="text-sm font-semibold text-purple-300 mb-3 flex items-center gap-2">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                      </svg>
                      Pro Tips
                    </h4>
                    <ul className="text-xs text-gray-400 space-y-2">
                      <li className="flex items-start gap-2">
                        <span className="text-purple-400 mt-0.5">•</span>
                        <span>Be specific and descriptive in your prompts for better results</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-purple-400 mt-0.5">•</span>
                        <span>Experiment with different styles to find your perfect look</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        select {
          background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%239333ea' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e");
          background-position: right 0.5rem center;
          background-repeat: no-repeat;
          background-size: 1.5em 1.5em;
          padding-right: 2.5rem;
        }
      `}</style>

      {/* Sign In Modal */}
      <SignInModal
        isOpen={showSignInModal}
        onClose={() => setShowSignInModal(false)}
        onSignInSuccess={handleSignInSuccess}
      />
    </div>
  )
}