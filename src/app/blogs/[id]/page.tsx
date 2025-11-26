'use client'

import { useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'

export default function ArticleDetailPage() {
  const router = useRouter()
  const params = useParams()
  const slug = params?.id as string

  // Redirect to root-level slug route
  useEffect(() => {
    if (slug) {
      router.replace(`/${slug}`)
    }
  }, [slug, router])

  // Show loading while redirecting
  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="text-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mb-4" role="status" aria-label="Loading"></div>
        <p className="text-gray-600">Redirecting...</p>
      </div>
    </div>
  )
}
