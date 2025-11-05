# 🔗 URL Configuration Guide - Production Deployment

This guide shows **exactly where** all URLs are configured and how to update them for production.

---

## 📍 **Quick Summary**

✅ **Good News**: Most URLs use environment variables (`NEXT_PUBLIC_SITE_URL`)
⚠️ **Action Required**: Update `robots.txt` and set environment variable in production

---

## 🎯 **1. SITEMAP - Uses Environment Variable** ✅

**File**: `Flow_Frontend/src/app/sitemap.ts`

**Current Configuration** (Line 4):
```typescript
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
```

**Status**: ✅ **GOOD** - Uses environment variable with localhost fallback

**How to Update**: 
1. Set environment variable in production:
   ```bash
   NEXT_PUBLIC_SITE_URL=https://yourdomain.com
   ```

2. Or update the fallback (line 4):
   ```typescript
   const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://yourdomain.com'
   ```

**All URLs in Sitemap** (Lines 26-56):
- ✅ `SITE_URL` (homepage)
- ✅ `${SITE_URL}/generate`
- ✅ `${SITE_URL}/blogs`
- ✅ `${SITE_URL}/blogs/${article.slug}`
- ✅ `${SITE_URL}/blogs/category/${category}`

---

## 🤖 **2. ROBOTS.TXT - NEEDS MANUAL UPDATE** ⚠️

**File**: `Flow_Frontend/public/robots.txt`

**Current Configuration** (Lines 20-21):
```
Sitemap: https://flowvideo.com/sitemap.xml
Sitemap: http://localhost:3000/sitemap.xml
```

**Status**: ⚠️ **NEEDS UPDATE** - Has hardcoded URLs

**How to Update**:
Replace lines 20-21 with your production URL:
```
Sitemap: https://yourdomain.com/sitemap.xml
```

**Or remove the localhost line entirely** (keep only production):
```
Sitemap: https://yourdomain.com/sitemap.xml
```

---

## 📝 **3. METADATA - Uses Environment Variable** ✅

All metadata uses `siteConfig.url` which reads from environment variable.

### **3a. SEO Config (Main Source)**
**File**: `Flow_Frontend/src/lib/seo-config.ts`

**Current Configuration** (Lines 6-7, 39):
```typescript
url: process.env.NEXT_PUBLIC_SITE_URL || 'https://flowvideo.com',
ogImage: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://flowvideo.com'}/og-image.jpg`,
// Line 39:
url: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
```

**Status**: ✅ **GOOD** - Uses environment variable

**How to Update**:
1. Set environment variable: `NEXT_PUBLIC_SITE_URL=https://yourdomain.com`
2. Or update fallback URLs (lines 6, 7, 39) to your production domain

**All Metadata Files Using siteConfig.url**:
- ✅ `src/app/layout.tsx` - Uses `siteConfig.url`
- ✅ `src/app/(home)/layout.tsx` - Uses `siteConfig.url`
- ✅ `src/app/blogs/layout.tsx` - Uses `siteConfig.url`
- ✅ `src/app/blogs/[id]/page.tsx` - Uses `siteConfig.url`
- ✅ `src/app/blogs/category/[category]/layout.tsx` - Uses `siteConfig.url`
- ✅ `src/app/generate/layout.tsx` - Uses `siteConfig.url`
- ✅ `src/app/videos/layout.tsx` - Uses `siteConfig.url`
- ✅ `src/app/profile/layout.tsx` - Uses `siteConfig.url`

**All automatically use production URL once you set the environment variable!**

---

## 📋 **Complete List of Files Using URLs**

### **Files Using Environment Variables** (✅ Auto-update):
1. `src/app/sitemap.ts` - `SITE_URL` variable
2. `src/lib/seo-config.ts` - `siteConfig.url` (main source)
3. `src/app/layout.tsx` - Uses `siteConfig.url`
4. `src/app/(home)/layout.tsx` - Uses `siteConfig.url`
5. `src/app/(home)/page.tsx` - Uses `siteConfig.url` in structured data
6. `src/app/blogs/layout.tsx` - Uses `siteConfig.url`
7. `src/app/blogs/page.tsx` - Uses `siteConfig.url`
8. `src/app/blogs/[id]/page.tsx` - Uses `siteConfig.url`
9. `src/app/blogs/category/[category]/layout.tsx` - Uses `siteConfig.url`
10. `src/app/blogs/category/[category]/page.tsx` - Uses `siteConfig.url`
11. `src/app/generate/layout.tsx` - Uses `siteConfig.url`
12. `src/app/videos/layout.tsx` - Uses `siteConfig.url`
13. `src/app/profile/layout.tsx` - Uses `siteConfig.url`

### **Files Needing Manual Update** (⚠️):
1. `public/robots.txt` - Line 20-21 (hardcoded sitemap URLs)

---

## 🚀 **Step-by-Step Production Update Guide**

### **Option 1: Environment Variable (Recommended)** ✅

1. **Create `.env.local` file** (or set in your hosting platform):
   ```bash
   NEXT_PUBLIC_SITE_URL=https://yourdomain.com
   NEXT_PUBLIC_API_URL=https://api.yourdomain.com
   ```

2. **Update `robots.txt`**:
   ```diff
   - Sitemap: https://flowvideo.com/sitemap.xml
   - Sitemap: http://localhost:3000/sitemap.xml
   + Sitemap: https://yourdomain.com/sitemap.xml
   ```

3. **Update `seo-config.ts` fallback** (optional, for safety):
   ```diff
   - url: process.env.NEXT_PUBLIC_SITE_URL || 'https://flowvideo.com',
   + url: process.env.NEXT_PUBLIC_SITE_URL || 'https://yourdomain.com',
   ```

### **Option 2: Hardcode All URLs** (Not Recommended)

Update all files manually - see list above.

---

## 📍 **Exact Locations to Update**

### **1. Sitemap URLs** (`src/app/sitemap.ts`)
```typescript
// Line 4 - Update fallback if needed
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://yourdomain.com'
```

### **2. Robots.txt** (`public/robots.txt`)
```diff
# Line 20-21 - REQUIRED UPDATE
- Sitemap: https://flowvideo.com/sitemap.xml
- Sitemap: http://localhost:3000/sitemap.xml
+ Sitemap: https://yourdomain.com/sitemap.xml
```

### **3. SEO Config** (`src/lib/seo-config.ts`)
```typescript
// Line 6 - Main URL (optional fallback update)
url: process.env.NEXT_PUBLIC_SITE_URL || 'https://yourdomain.com',

// Line 7 - OG Image URL (optional fallback update)
ogImage: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://yourdomain.com'}/og-image.jpg`,

// Line 39 - Author URL (optional fallback update)
url: process.env.NEXT_PUBLIC_SITE_URL || 'https://yourdomain.com',
```

---

## ✅ **Verification Checklist**

After updating, verify:

1. ✅ **Sitemap accessible**: `https://yourdomain.com/sitemap.xml`
2. ✅ **Robots.txt points to sitemap**: Check `public/robots.txt` line 20
3. ✅ **Environment variable set**: `NEXT_PUBLIC_SITE_URL` in production
4. ✅ **All metadata URLs**: Check page source for correct URLs
5. ✅ **Open Graph images**: Test with https://www.opengraph.xyz/

---

## 🎯 **Quick Reference**

| Component | File | Status | Update Method |
|-----------|------|--------|---------------|
| Sitemap | `sitemap.ts` | ✅ Uses env var | Set `NEXT_PUBLIC_SITE_URL` |
| Robots.txt | `robots.txt` | ⚠️ Hardcoded | Manual update line 20 |
| Metadata | All layouts | ✅ Uses env var | Set `NEXT_PUBLIC_SITE_URL` |
| SEO Config | `seo-config.ts` | ✅ Uses env var | Set `NEXT_PUBLIC_SITE_URL` |

---

## 💡 **Pro Tip**

**Best Practice**: Use environment variables everywhere! That way:
- ✅ Development: `http://localhost:3000`
- ✅ Production: `https://yourdomain.com`
- ✅ No code changes needed between environments

**Just set**: `NEXT_PUBLIC_SITE_URL=https://yourdomain.com` in production!

---

## 📝 **Summary**

**Total Files with URLs**: 13 files
- ✅ **12 files** use environment variables (auto-update)
- ⚠️ **1 file** needs manual update (`robots.txt`)

**Action Required**:
1. Set `NEXT_PUBLIC_SITE_URL` environment variable in production
2. Update `public/robots.txt` line 20 with your production domain

**That's it!** 🎉



