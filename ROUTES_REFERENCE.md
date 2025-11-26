# Complete Routes Reference - Flow Frontend

This document lists all routes in the application and their corresponding file locations.

## 📁 Route Files Location

All route files are located in: **`Flow_Frontend/src/app/`**

---

## 🔗 Complete Route List

### 1. **Homepage** `/`
- **File**: `src/app/(home)/page.tsx`
- **Layout**: `src/app/(home)/layout.tsx`
- **URL**: `vidwave.ai/`
- **Description**: Main homepage with video generation input

### 2. **Blog Posts** `/{slug}`
- **File**: `src/app/[slug]/page.tsx`
- **Client Component**: `src/app/[slug]/ArticlePageClient.tsx`
- **URL**: `vidwave.ai/blog-title`
- **Description**: Individual blog post pages at root level
- **Example**: `vidwave.ai/the-role-of-artificial-intelligence-in-modern-medicine`

### 3. **Blog Listing** `/blogs`
- **File**: `src/app/blogs/page.tsx`
- **Layout**: `src/app/blogs/layout.tsx`
- **URL**: `vidwave.ai/blogs`
- **Description**: List of all blog posts with category filters

### 4. **Category Pages** `/category/{category-slug}`
- **File**: `src/app/category/[slug]/page.tsx`
- **URL**: `vidwave.ai/category/category-name`
- **Description**: Category-specific blog posts
- **Example**: `vidwave.ai/category/ai`

### 5. **Generate Page** `/generate`
- **File**: `src/app/generate/page.tsx`
- **Layout**: `src/app/generate/layout.tsx`
- **URL**: `vidwave.ai/generate`
- **Description**: Video generation page

### 6. **About Page** `/about`
- **File**: `src/app/about/page.tsx`
- **URL**: `vidwave.ai/about`
- **Description**: About page

### 7. **Privacy Policy** `/privacy`
- **File**: `src/app/privacy/page.tsx`
- **URL**: `vidwave.ai/privacy`
- **Description**: Privacy policy page

### 8. **Terms of Service** `/terms`
- **File**: `src/app/terms/page.tsx`
- **URL**: `vidwave.ai/terms`
- **Description**: Terms of service page

### 9. **User Videos** `/videos`
- **File**: `src/app/videos/page.tsx`
- **Layout**: `src/app/videos/layout.tsx`
- **URL**: `vidwave.ai/videos`
- **Description**: User's saved videos (requires login)

### 10. **User Profile** `/profile`
- **File**: `src/app/profile/page.tsx`
- **Layout**: `src/app/profile/layout.tsx`
- **URL**: `vidwave.ai/profile`
- **Description**: User profile page (requires login)

### 11. **Admin Panel** `/admin`
- **File**: `src/app/admin/page.tsx`
- **URL**: `vidwave.ai/admin`
- **Description**: Admin dashboard

### 12. **Admin Login** `/admin/login`
- **File**: `src/app/admin/login/page.tsx`
- **URL**: `vidwave.ai/admin/login`
- **Description**: Admin login page

---

## 🚫 Disabled/Redirected Routes

### 13. **Blog Posts (Old Route)** `/blogs/{id}` - **RETURNS 404**
- **File**: `src/app/blogs/[id]/page.tsx`
- **Layout**: `src/app/blogs/[id]/layout.tsx`
- **URL**: `vidwave.ai/blogs/blog-title` ❌
- **Status**: Always returns 404 (not found)
- **Note**: This route is disabled. Blog posts should be accessed via `/{slug}`

### 14. **Category Pages (Old Route)** `/blogs/category/{category}` - **REDIRECTS**
- **File**: `src/app/blogs/category/[category]/page.tsx`
- **Layout**: `src/app/blogs/category/[category]/layout.tsx`
- **URL**: `vidwave.ai/blogs/category/category-name` ❌
- **Status**: Automatically redirects to `/category/{category-name}`
- **Note**: Old route redirects to new route

---

## 📄 Special Files

### Root Layout
- **File**: `src/app/layout.tsx`
- **Purpose**: Root layout wrapper for all pages
- **Contains**: Global metadata, fonts, structured data

### 404 Page
- **File**: `src/app/not-found.tsx`
- **Purpose**: Custom 404 error page
- **Triggered**: When a route doesn't exist

### Sitemap
- **File**: `src/app/sitemap.ts`
- **Purpose**: Generates XML sitemap automatically
- **URL**: `vidwave.ai/sitemap.xml`

### Global Styles
- **File**: `src/app/globals.css`
- **Purpose**: Global CSS styles

---

## 📋 Route Structure Summary

```
vidwave.ai/
├── /                                    → Homepage
├── /{slug}                              → Blog post (e.g., /blog-title)
├── /blogs                               → Blog listing
├── /category/{slug}                     → Category page (e.g., /category/ai)
├── /generate                            → Video generation
├── /about                               → About page
├── /privacy                             → Privacy policy
├── /terms                               → Terms of service
├── /videos                              → User videos (login required)
├── /profile                             → User profile (login required)
├── /admin                               → Admin panel
└── /admin/login                         → Admin login

❌ DISABLED:
├── /blogs/{id}                          → 404 (old blog post route)
└── /blogs/category/{category}           → Redirects to /category/{category}
```

---

## 🗂️ File Structure Map

```
Flow_Frontend/src/app/
├── (home)/                    # Homepage route group
│   ├── layout.tsx            # Homepage layout
│   └── page.tsx              # Homepage content → /
│
├── [slug]/                    # Dynamic blog post route
│   ├── ArticlePageClient.tsx # Client component
│   └── page.tsx              # Blog post page → /{slug}
│
├── blogs/                     # Blog routes
│   ├── [id]/                 # OLD route (returns 404)
│   │   ├── layout.tsx        # Layout metadata
│   │   └── page.tsx          # Returns 404 → /blogs/{id}
│   │
│   ├── category/             # OLD category route (redirects)
│   │   └── [category]/
│   │       ├── layout.tsx    # Layout metadata
│   │       └── page.tsx      # Redirects → /blogs/category/{category}
│   │
│   ├── layout.tsx            # Blog listing layout
│   └── page.tsx              # Blog listing → /blogs
│
├── category/                  # Category routes
│   └── [slug]/
│       └── page.tsx          # Category page → /category/{slug}
│
├── generate/                  # Generate route
│   ├── layout.tsx            # Generate layout
│   └── page.tsx              # Generate page → /generate
│
├── about/                     # About route
│   └── page.tsx              # About page → /about
│
├── privacy/                   # Privacy route
│   └── page.tsx              # Privacy page → /privacy
│
├── terms/                     # Terms route
│   └── page.tsx              # Terms page → /terms
│
├── videos/                    # Videos route
│   ├── layout.tsx            # Videos layout
│   └── page.tsx              # Videos page → /videos
│
├── profile/                   # Profile route
│   ├── layout.tsx            # Profile layout
│   └── page.tsx              # Profile page → /profile
│
├── admin/                     # Admin routes
│   ├── login/
│   │   └── page.tsx          # Admin login → /admin/login
│   └── page.tsx              # Admin panel → /admin
│
├── layout.tsx                 # Root layout (all pages)
├── not-found.tsx              # 404 page
├── sitemap.ts                 # Sitemap generator
└── globals.css                # Global styles
```

---

## 📝 Notes

1. **Route Groups**: `(home)` is a route group (parentheses) - doesn't affect URL structure
2. **Dynamic Routes**: `[slug]`, `[id]`, `[category]` are dynamic route parameters
3. **Layout Files**: `layout.tsx` files wrap child routes with shared UI/metadata
4. **Special Routes**:
   - `layout.tsx` - Shared layout
   - `page.tsx` - Route page component
   - `not-found.tsx` - 404 page
   - `sitemap.ts` - Sitemap generator

---

## 🔍 Quick Search

To find a route:
1. **Static routes** (e.g., `/about`): Look in `src/app/about/page.tsx`
2. **Dynamic routes** (e.g., `/{slug}`): Look in `src/app/[slug]/page.tsx`
3. **Nested routes** (e.g., `/admin/login`): Look in `src/app/admin/login/page.tsx`

---

**Last Updated**: Based on current file structure
**Location**: All route files are in `Flow_Frontend/src/app/` directory

