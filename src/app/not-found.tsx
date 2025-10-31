import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white flex items-center justify-center px-4">
      <div className="text-center">
        <h1 className="text-6xl font-bold mb-4">404</h1>
        <h2 className="text-2xl mb-8">Page Not Found</h2>
        <Link 
          href="/" 
          className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full text-lg font-semibold hover:opacity-90 transition-all"
        >
          Return Home
        </Link>
      </div>
    </div>
  )
}
