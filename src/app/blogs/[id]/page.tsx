import { notFound } from 'next/navigation'

export default function ArticleDetailPage() {
  // Return 404 for any /blogs/blog-title URL
  notFound()
}
