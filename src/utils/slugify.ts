/**
 * Convert a string to a URL-friendly slug
 * Example: "How to Create AI Videos" -> "how-to-create-ai-videos"
 */
export function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')           // Replace spaces with -
    .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
    .replace(/\-\-+/g, '-')         // Replace multiple - with single -
    .replace(/^-+/, '')             // Trim - from start of text
    .replace(/-+$/, '')             // Trim - from end of text
}

/**
 * Extract slug from URL
 * Example: "how-to-create-ai-videos" -> returns the slug
 */
export function getSlugFromUrl(url: string): string {
  const parts = url.split('/')
  return parts[parts.length - 1]
}

