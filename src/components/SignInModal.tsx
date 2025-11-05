'use client'

import { useState, useEffect } from 'react'

interface SignInModalProps {
  isOpen: boolean
  onClose: () => void
  onSignInSuccess?: () => void
  initialMode?: 'login' | 'signup'
}

export default function SignInModal({ isOpen, onClose, onSignInSuccess, initialMode = 'signup' }: SignInModalProps) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [isLoginMode, setIsLoginMode] = useState(initialMode === 'login')
  const [isSigningUp, setIsSigningUp] = useState(false)

  // Update isLoginMode when initialMode changes
  useEffect(() => {
    setIsLoginMode(initialMode === 'login')
  }, [initialMode, isOpen])

  useEffect(() => {
    // Only load Google Sign-In script if modal is open
    if (!isOpen) return
    
    // Load Google Sign-In script
    if (typeof window !== 'undefined') {
      // Check if script already exists
      const existingScript = document.querySelector('script[src="https://accounts.google.com/gsi/client"]')
      if (existingScript) {
        // Script already loaded, just initialize
        if ((window as any).google) {
          initializeGoogleSignIn()
        }
        return
      }
      
      const loadGoogleScript = () => {
        if ((window as any).google) {
          initializeGoogleSignIn()
          return
        }
        
        const script = document.createElement('script')
        script.src = 'https://accounts.google.com/gsi/client'
        script.async = true
        script.defer = true
        script.onload = () => {
          // Wait a bit for google to be available
          setTimeout(() => {
            if ((window as any).google) {
              initializeGoogleSignIn()
            }
          }, 100)
        }
        script.onerror = () => {
          console.error('Failed to load Google Sign-In script')
        }
        document.body.appendChild(script)
      }
      
      loadGoogleScript()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen])

  const initializeGoogleSignIn = () => {
    if (typeof window === 'undefined' || !(window as any).google) return
    
    try {
      (window as any).google.accounts.id.initialize({
        client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || '',
        callback: handleGoogleCallback,
      })
    } catch (error) {
      console.error('Error initializing Google Sign-In:', error)
    }
  }

  const handleGoogleCallback = async (response: any) => {
    if (!response.credential) {
      console.error('No credential in Google response')
      return
    }

    setIsSigningUp(true)
    
    try {
      // Send ID token to backend
      const backendResponse = await fetch('http://localhost:8080/api/auth/google', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          id_token: response.credential
        })
      })

      const data = await backendResponse.json()

      if (backendResponse.ok) {
        // Store token
        if (data.access_token) {
          localStorage.setItem('access_token', data.access_token)
        }
        
        // Close modal and trigger success callback
        onSignInSuccess?.()
        onClose()
      } else {
        alert(data.error || 'Google login failed. Please try again.')
      }
    } catch (error: any) {
      console.error('Google login error:', error)
      alert('An error occurred during Google login. Please try again.')
    } finally {
      setIsSigningUp(false)
    }
  }

  const handleGoogleLogin = () => {
    if (typeof window === 'undefined' || !(window as any).google) {
      alert('Google Sign-In is not loaded. Please refresh the page and try again.')
      return
    }
    
    try {
      // Use One Tap Sign-In prompt
      (window as any).google.accounts.id.prompt((notification: any) => {
        if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
          // If one-tap is not available, show a button-based sign-in
          setIsSigningUp(true)
          
          // Fallback: Show a button-based sign-in
          const buttonDiv: HTMLDivElement = document.createElement('div')
          buttonDiv.id = 'google-signin-button'
          buttonDiv.style.display = 'none'
          const body = document.body
          if (body) {
            body.appendChild(buttonDiv)
          }
          
          (window as any).google.accounts.id.renderButton(
            buttonDiv,
            {
              theme: 'outline',
              size: 'large',
              type: 'standard',
              text: 'signin_with',
              shape: 'rectangular',
              logo_alignment: 'left',
            }
          )
          
          // Trigger click on the button
          setTimeout(() => {
            const button = buttonDiv.querySelector('button') as HTMLButtonElement | null
            if (button) {
              button.click()
            } else {
              setIsSigningUp(false)
              alert('Unable to initialize Google Sign-In. Please check your Google Client ID configuration.')
            }
          }, 100)
        }
      })
    } catch (error) {
      console.error('Error triggering Google Sign-In:', error)
      setIsSigningUp(false)
      alert('An error occurred. Please try again.')
    }
  }

  const handleEmailLogin = () => {
    setIsLoginMode(true)
  }

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSigningUp(true)
    
    try {
      // Validate passwords match
      if (password !== confirmPassword) {
        alert('Passwords do not match')
        setIsSigningUp(false)
        return
      }

      // Call signup API
      const response = await fetch('http://localhost:8080/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: email,
          password: password,
          name: name
        })
      })

      const data = await response.json()

      if (response.ok) {
        // Store token
        if (data.access_token) {
          localStorage.setItem('access_token', data.access_token)
        }
        
        // Close modal and trigger success callback
        onSignInSuccess?.()
        onClose()
      } else {
        alert(data.error || 'Sign up failed. Please try again.')
      }
    } catch (error: any) {
      console.error('Sign up error:', error)
      alert('An error occurred during sign up. Please try again.')
    } finally {
      setIsSigningUp(false)
    }
  }

  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSigningUp(true)
    
    try {
      // Call login API
      const response = await fetch('http://localhost:8080/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: email,
          password: password
        })
      })

      const data = await response.json()

      if (response.ok) {
        // Store token
        if (data.access_token) {
          localStorage.setItem('access_token', data.access_token)
        }
        
        // Close modal and trigger success callback
        onSignInSuccess?.()
        onClose()
      } else {
        alert(data.error || 'Login failed. Please check your credentials.')
      }
    } catch (error: any) {
      console.error('Login error:', error)
      alert('An error occurred during login. Please try again.')
    } finally {
      setIsSigningUp(false)
    }
  }

  const handleOverlayClick = (e: React.MouseEvent) => {
    // Prevent closing by clicking overlay when close button is removed
    // Users must complete sign-in
  }

  // Early return AFTER all hooks have been called
  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
      onClick={handleOverlayClick}
    >
      <div className="relative w-full max-w-md">
        {/* Glow effect */}
        <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-3xl opacity-20 blur-xl" />
        
        {/* Modal */}
        <div className="relative bg-white border border-slate-200 rounded-3xl p-8 shadow-2xl">
          {/* Header */}
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-2 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              {isLoginMode ? 'Sign In to Continue' : 'Create Your Account'}
            </h2>
            <p className="text-slate-600 text-sm">
              {isLoginMode ? 'Sign in to create amazing videos with AI' : 'Create amazing videos with AI - Sign up to get started'}
            </p>
          </div>

          {isLoginMode ? (
            /* Login Form */
            <form onSubmit={handleEmailSignIn} className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all text-slate-900 placeholder:text-slate-400"
                  placeholder="your@email.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all text-slate-900 placeholder:text-slate-400"
                  placeholder="Enter your password"
                />
              </div>

              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" className="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500" />
                  <span className="text-slate-600">Remember me</span>
                </label>
                <button type="button" className="text-indigo-600 hover:text-indigo-700 transition-colors font-medium">
                  Forgot password?
                </button>
              </div>

              <button
                type="submit"
                disabled={isSigningUp}
                className="w-full group relative"
              >
                <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl opacity-75 group-hover:opacity-100 blur transition-all" />
                <div className="relative w-full px-6 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl font-bold text-lg text-white hover:scale-105 transition-all shadow-lg shadow-indigo-500/30 flex items-center justify-center gap-2">
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
                className="w-full px-6 py-3 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl transition-all font-semibold text-sm text-slate-700"
              >
                Back to sign up
              </button>
            </form>
          ) : (
            /* Sign Up Form */
            <form onSubmit={handleSignUp} className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all text-slate-900 placeholder:text-slate-400"
                  placeholder="John Doe"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all text-slate-900 placeholder:text-slate-400"
                  placeholder="your@email.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all text-slate-900 placeholder:text-slate-400"
                  placeholder="Create a password"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Confirm Password
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all text-slate-900 placeholder:text-slate-400"
                  placeholder="Confirm your password"
                />
              </div>

              <button
                type="submit"
                disabled={isSigningUp}
                className="w-full group relative"
              >
                <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl opacity-75 group-hover:opacity-100 blur transition-all" />
                <div className="relative w-full px-6 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl font-bold text-lg text-white hover:scale-105 transition-all shadow-lg shadow-indigo-500/30 flex items-center justify-center gap-2">
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
              <div className="w-full border-t border-slate-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white text-slate-500">or</span>
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
              <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-600 to-blue-500 rounded-xl opacity-0 group-hover:opacity-10 blur transition-all" />
              <div className="relative w-full px-6 py-4 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl transition-all flex items-center justify-center gap-3 font-semibold text-slate-700">
                {isSigningUp ? (
                  <>
                    <svg className="animate-spin h-5 w-5 text-slate-700" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    <span>Signing in...</span>
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                    </svg>
                    <span>Continue with Google</span>
                  </>
                )}
              </div>
            </button>

            {!isLoginMode && (
              <p className="text-center text-sm text-slate-600 mt-4">
                Already have an account?{' '}
                <button 
                  onClick={() => setIsLoginMode(true)}
                  className="text-indigo-600 hover:text-indigo-700 font-semibold transition-colors"
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

