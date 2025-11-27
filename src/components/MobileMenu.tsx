'use client'

import { memo } from 'react'
import Link from 'next/link'
import Image from 'next/image'

interface MobileMenuProps {
  isOpen: boolean
  onClose: () => void
  onOpenLogin: () => void
  isLoggedIn?: boolean
  userEmail?: string
  onLogout?: () => void
}

const MobileMenu = memo(({ isOpen, onClose, onOpenLogin, isLoggedIn, userEmail, onLogout }: MobileMenuProps) => {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 md:hidden">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Menu Panel */}
      <div className="absolute top-0 right-0 w-full max-w-sm h-full bg-white shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <Image 
              src="/VidWave-trans.png" 
              alt="Vidwave Logo" 
              width={60} 
              height={60} 
              className="w-[60px] h-[60px]"
              style={{ width: '60px', height: '60px' }}
            />
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
            aria-label="Close menu"
          >
            <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Menu Items */}
        <nav className="p-6 space-y-1">
          <Link
            href="/"
            onClick={onClose}
            className="block px-4 py-3 text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-gray-900 rounded-lg transition-colors"
          >
            Home
          </Link>
          <Link
            href="/blogs"
            onClick={onClose}
            className="block px-4 py-3 text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-gray-900 rounded-lg transition-colors"
          >
            Blog
          </Link>
          <Link
            href="/generate"
            onClick={onClose}
            className="block px-4 py-3 text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-gray-900 rounded-lg transition-colors"
          >
            Text to AI Video
          </Link>
          
          {isLoggedIn ? (
            <>
              <Link
                href="/videos"
                onClick={onClose}
                className="block px-4 py-3 text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-gray-900 rounded-lg transition-colors"
              >
                My Videos
              </Link>
              <Link
                href="/profile"
                onClick={onClose}
                className="flex items-center gap-3 px-4 py-3 text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-gray-900 rounded-lg transition-colors"
              >
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center text-white text-sm font-semibold">
                  {userEmail ? userEmail.charAt(0).toUpperCase() : 'U'}
                </div>
                <span>Profile</span>
              </Link>
              <button
                onClick={() => {
                  onClose()
                  if (onLogout) onLogout()
                }}
                className="w-full text-left px-4 py-3 text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-gray-900 rounded-lg transition-colors"
              >
                Logout
              </button>
            </>
          ) : (
            <button
              onClick={() => {
                onClose()
                onOpenLogin()
              }}
              className="w-full text-left px-4 py-3 text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-gray-900 rounded-lg transition-colors"
            >
              Login
            </button>
          )}
        </nav>

        {/* CTA Button */}
        {!isLoggedIn && (
          <div className="p-6 border-t border-gray-200">
            <button
              onClick={() => {
                onClose()
                onOpenLogin()
              }}
              className="block w-full px-6 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-center text-base font-semibold rounded-xl hover:shadow-lg transition-all"
            >
              Get Started Free
            </button>
          </div>
        )}
      </div>
    </div>
  )
})

MobileMenu.displayName = 'MobileMenu'

export default MobileMenu

