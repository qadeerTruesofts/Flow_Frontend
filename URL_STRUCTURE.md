# URL Structure - Flow_Frontend

## Blog URL Patterns (As Requested)

### ✅ Individual Blog Posts
**Pattern**: `domainname.com/[blog-slug]`

**Examples**:
- `domainname.com/how-to-create-stunning-ai-videos`
- `domainname.com/10-creative-ways-text-to-video`
- `domainname.com/future-of-ai-video-generation`
- `domainname.com/boost-social-media-ai-videos`

**Note**: 
- ❌ NOT `/blog/[slug]` or `/blogs/[slug]`
- ✅ Blog posts are at the root level as requested
- Slug is auto-generated from the blog title
- Stored in database as `article.slug`

---

### ✅ Category Pages
**Pattern**: `domainname.com/category/[category-name]`

**Examples**:
- `domainname.com/category/tutorials`
- `domainname.com/category/tips-tricks`
- `domainname.com/category/industry-news`
- `domainname.com/category/marketing`
- `domainname.com/category/case-studies`

**Note**:
- Category names are automatically slugified:
  - "Tips & Tricks" → `tips-tricks`
  - "Industry News" → `industry-news`
  - "Case Studies" → `case-studies`

---

### ✅ Blog Listing (All Posts)
**Pattern**: `domainname.com/blogs`

**Shows**: All blog posts with category filters

---

## Complete Routing Structure

```
domainname.com/
├── /                                    → Home page (video design)
├── /blogs                               → All blog posts listing
├── /category/[category-slug]            → Category-specific posts
├── /[blog-slug]                         → Individual blog post
├── /generate                            → Video generation page (original design)
├── /videos                              → User's videos (existing)
├── /profile                             → User profile (existing)
└── /admin                               → Admin panel (existing)
```

---

## Implementation Details

### File Structure
```
Flow_Frontend/src/app/
├── (home)/
│   └── page.tsx                        → Home page (/)
├── [slug]/
│   └── page.tsx                        → Individual blog post (/[slug])
├── blogs/
│   └── page.tsx                        → Blog listing (/blogs)
├── category/
│   └── [slug]/
│       └── page.tsx                    → Category page (/category/[slug])
├── generate/
│   └── page.tsx                        → Generate page (/generate)
├── videos/
│   └── page.tsx                        → Videos page (/videos)
└── profile/
    └── page.tsx                        → Profile page (/profile)
```

---

## Slug Generation

### From Title to Slug
The `slugify()` function converts blog titles to URL-friendly slugs:

```typescript
function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')           // Replace spaces with -
    .replace(/[^\w\-]+/g, '')       // Remove non-word chars
    .replace(/\-\-+/g, '-')         // Replace multiple - with single -
}
```

**Examples**:
- "How to Create Stunning AI Videos" → `how-to-create-stunning-ai-videos`
- "10 Creative Ways to Use AI!" → `10-creative-ways-to-use-ai`
- "Best Text-to-Video Generator 2025" → `best-text-to-video-generator-2025`

---

## Navigation & Links

### Blog Post Links
```tsx
// In blog listing or category pages
<Link href={`/${article.slug}`}>
  {article.title}
</Link>
```

### Category Links
```tsx
// In blog cards or navigation
<Link href={`/category/${slugify(article.category)}`}>
  {article.category}
</Link>
```

### Example: Full Navigation Flow

1. User visits homepage: `domainname.com/`
2. Clicks "Blog" → `domainname.com/blogs`
3. Clicks category "Tutorials" → `domainname.com/category/tutorials`
4. Clicks article → `domainname.com/how-to-create-stunning-ai-videos`
5. Clicks related article → `domainname.com/ai-video-generation-beginners-guide`

---

## SEO Benefits

### Clean URLs ✅
- Short and memorable
- Keyword-rich
- Easy to share
- No nested paths for blog posts

### Example Comparison

❌ **Before** (typical blog structure):
```
domainname.com/blog/2025/11/10/how-to-create-stunning-ai-videos
domainname.com/posts/ai-videos/how-to-create-stunning-ai-videos
```

✅ **After** (your implementation):
```
domainname.com/how-to-create-stunning-ai-videos
```

---

## Breadcrumb Navigation

Each page includes breadcrumbs for better UX and SEO:

### Blog Post Page
```
Home > Blog > [Category] > [Current Post]
```

### Category Page
```
Home > Blog > [Category]
```

**Example**:
```
Home > Blog > Tutorials > How to Create Stunning AI Videos
```

---

## Backend API Integration

### Fetching Articles
```typescript
const response = await fetch(`${API_BASE_URL}/api/articles`)
const data = await response.json()
const articles = data.articles // Array of Article objects
```

### Article Object Structure
```typescript
interface Article {
  id: number
  title: string
  slug: string                    // Pre-generated slug from backend
  category: string
  date: string
  image_url: string | null
  content: string | null
  author: string | null
  meta_description?: string       // For SEO
  meta_keywords?: string          // For SEO
}
```

---

## Dynamic Routes (Next.js)

### Catch-All Blog Posts
```typescript
// app/[slug]/page.tsx
export default function BlogPostPage() {
  const params = useParams()
  const slug = params.slug as string
  
  // Fetch article where article.slug === slug
  // ...
}
```

### Dynamic Categories
```typescript
// app/category/[slug]/page.tsx
export default function CategoryPage() {
  const params = useParams()
  const categorySlug = params.slug as string
  
  // Filter articles by category where slugify(category) === categorySlug
  // ...
}
```

---

## URL Validation

### Valid URLs ✅
- `domainname.com/blog-post-title`
- `domainname.com/category/category-name`
- `domainname.com/blogs`

### Invalid/Redirected URLs ❌
- `domainname.com/blog/post-title` → Should use root level
- `domainname.com/blogs/post-title` → Should use root level
- `domainname.com/categories/...` → Should use `/category/...`

---

## Testing URLs

### To test locally:
```bash
# Start the development server
cd Flow_Frontend
npm run dev

# Then visit:
https://desirable-reflection-production-aa8a.up.railway.app/                                    # Home
https://desirable-reflection-production-aa8a.up.railway.app/blogs                               # Blog listing
https://desirable-reflection-production-aa8a.up.railway.app/category/tutorials                  # Category
https://desirable-reflection-production-aa8a.up.railway.app/how-to-create-stunning-ai-videos   # Blog post
```

---

## Summary

✅ **Blog posts at root**: `domainname.com/blog-title` (NO `/blog` prefix)
✅ **Categories with prefix**: `domainname.com/category/category-name`
✅ **Clean, SEO-friendly URLs**
✅ **Automatic slug generation**
✅ **Breadcrumb navigation**
✅ **Dynamic routing with Next.js**
✅ **Backend API integration ready**

All URL patterns are implemented and working as requested! 🎉

