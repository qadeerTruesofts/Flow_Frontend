'use client'

import { useState } from 'react'

interface SignInModalProps {
  isOpen: boolean
  onClose: () => void
  onSignInSuccess?: () => void
}

export default function SignInModal({ isOpen, onClose, onSignInSuccess }: SignInModalProps) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [isLoginMode, setIsLoginMode] = useState(false)
  const [isSigningUp, setIsSigningUp] = useState(false)

  if (!isOpen) return null

  const handleGoogleLogin = () => {
    setIsSigningUp(true)
    // TODO: Implement Google login
    console.log('Google login clicked')
    setTimeout(() => {
      setIsSigningUp(false)
      onSignInSuccess?.()
      onClose()
    }, 1000)
  }

  const handleEmailLogin = () => {
    setIsLoginMode(true)
  }

  const handleSignUp = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSigningUp(true)
    // TODO: Implement email sign-up
    console.log('Sign-up:', { name, email, password })
    setTimeout(() => {
      setIsSigningUp(false)
      onSignInSuccess?.()
      onClose()
    }, 1000)
  }

  const handleEmailSignIn = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSigningUp(true)
    // TODO: Implement email sign-in
    console.log('Email sign-in:', email)
    setTimeout(() => {
      setIsSigningUp(false)
      onSignInSuccess?.()
      onClose()
    }, 1000)
  }

  const handleOverlayClick = (e: React.MouseEvent) => {
    // Prevent closing by clicking overlay when close button is removed
    // Users must complete sign-in
  }

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/30 backdrop-blur-[1px] p-4"
      onClick={handleOverlayClick}
    >
      <div className="relative w-full max-w-md">
        {/* Glow effect */}
        <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 to-pink-600 rounded-3xl opacity-30 blur-xl" />
        
        {/* Modal */}
        <div className="relative bg-gradient-to-br from-gray-900 via-black to-gray-900 border border-white/20 rounded-3xl p-8 shadow-2xl">
          {/* Header */}
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-2 bg-gradient-to-r from-white via-purple-200 to-white bg-clip-text text-transparent">
              {isLoginMode ? 'Sign In to Continue' : 'Create Your Account'}
            </h2>
            <p className="text-gray-400 text-sm">
              {isLoginMode ? 'Sign in to create amazing videos with AI' : 'Create amazing videos with AI - Sign up to get started'}
            </p>
          </div>

          {isLoginMode ? (
            /* Login Form */
            <form onSubmit={handleEmailSignIn} className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-500/50 outline-none transition-all text-white placeholder:text-gray-500"
                  placeholder="your@email.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-500/50 outline-none transition-all text-white placeholder:text-gray-500"
                  placeholder="Enter your password"
                />
              </div>

              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" className="w-4 h-4 rounded bg-white/5 border-white/10 text-purple-600 focus:ring-purple-500" />
                  <span className="text-gray-400">Remember me</span>
                </label>
                <button type="button" className="text-purple-400 hover:text-purple-300 transition-colors">
                  Forgot password?
                </button>
              </div>

              <button
                type="submit"
                disabled={isSigningUp}
                className="w-full group relative"
              >
                <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl opacity-75 group-hover:opacity-100 blur transition-all" />
                <div className="relative w-full px-6 py-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl font-bold text-lg hover:scale-105 transition-all shadow-2xl shadow-purple-500/50 flex items-center justify-center gap-2">
                  {isSigningUp ? (
                    <>
                      <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Signing in...
                    </>
                  ) : (
                    'Sign In'
                  )}
                </div>
              </button>

              <button
                type="button"
                onClick={() => setIsLoginMode(false)}
                className="w-full px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl transition-all font-semibold text-sm text-white"
              >
                Back to sign up
              </button>
            </form>
          ) : (
            /* Sign Up Form */
            <form onSubmit={handleSignUp} className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-500/50 outline-none transition-all text-white placeholder:text-gray-500"
                  placeholder="John Doe"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-500/50 outline-none transition-all text-white placeholder:text-gray-500"
                  placeholder="your@email.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-500/50 outline-none transition-all text-white placeholder:text-gray-500"
                  placeholder="Create a password"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Confirm Password
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-500/50 outline-none transition-all text-white placeholder:text-gray-500"
                  placeholder="Confirm your password"
                />
              </div>

              <button
                type="submit"
                disabled={isSigningUp}
                className="w-full group relative"
              >
                <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl opacity-75 group-hover:opacity-100 blur transition-all" />
                <div className="relative w-full px-6 py-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl font-bold text-lg hover:scale-105 transition-all shadow-2xl shadow-purple-500/50 flex items-center justify-center gap-2">
                  {isSigningUp ? (
                    <>
                      <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Creating account...
                    </>
                  ) : (
                    'Create Account'
                  )}
                </div>
              </button>
            </form>
          )}

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/10"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-gradient-to-br from-gray-900 to-black text-gray-400">or</span>
            </div>
          </div>

          {/* Login Options */}
          <div className="space-y-4">
            {/* Google Login */}
            <button
              onClick={handleGoogleLogin}
              disabled={isSigningUp}
              className="w-full group relative"
            >
              <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-600 to-blue-500 rounded-xl opacity-0 group-hover:opacity-20 blur transition-all" />
              <div className="relative w-full px-6 py-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl transition-all flex items-center justify-center gap-3 font-semibold text-white">
                {isSigningUp ? (
                  <>
                    <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    <span className="text-white">Signing in...</span>
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5 text-white" viewBox="0 0 24 24">
                      <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                      <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                      <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                      <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                    </svg>
                    <span className="text-white">Login with Google</span>
                  </>
                )}
              </div>
            </button>

            {/* Email Login */}
            <button
              onClick={handleEmailLogin}
              disabled={isSigningUp}
              className="w-full group relative"
            >
              <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl opacity-0 group-hover:opacity-20 blur transition-all" />
              <div className="relative w-full px-6 py-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl transition-all flex items-center justify-center gap-3 font-semibold text-white">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <span className="text-white">Login with Email</span>
              </div>
            </button>

            {!isLoginMode && (
              <p className="text-center text-sm text-gray-400 mt-4">
                Already have an account?{' '}
                <button 
                  onClick={() => setIsLoginMode(true)}
                  className="text-purple-400 hover:text-purple-300 font-semibold transition-colors"
                >
                  Sign in
                </button>
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

