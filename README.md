# Flow Frontend - AI Video Generator UI

Beautiful Next.js frontend for the Google Flow video generation scraper.

---

## 🚀 Quick Start

### 1. Install Dependencies

```bash
cd Flow_Frontend
npm install
```

### 2. Make Sure Backend is Running

The backend server must be running on `http://localhost:8080`

In a separate terminal, from the root directory:
```bash
cd ..
python web_server.py
```

### 3. Run the Frontend

```bash
npm run dev
```

### 4. Open in Browser

Go to: **https://desirable-reflection-production-aa8a.up.railway.app**

---

## 📋 Features

✅ **Beautiful Modern UI** - Clean, professional design with dark theme
✅ **Real-time Progress** - Live updates while video is generating
✅ **Status Tracking** - See exactly what's happening with your video
✅ **Video Preview** - Watch and download your generated videos
✅ **Error Handling** - Clear error messages with retry options
✅ **Responsive Design** - Works on desktop, tablet, and mobile

---

## 🔧 Configuration

### Change Backend URL

If your backend is running on a different port or server, edit:

**File:** `src/app/generate/page.tsx`

```typescript
// Line 8
const API_BASE_URL = 'http://localhost:8080'  // Change this
```

For production:
```typescript
const API_BASE_URL = 'https://your-backend-server.com'
```

---

## 📱 Pages

### Landing Page (`/`)
- Hero section with quick prompt input
- Feature showcase
- How it works section
- User reviews
- Call to action

### Generate Page (`/generate`)
- **Text to Video** - Create videos from text prompts
- **Image to Video** - Animate static images (UI ready, needs backend support)
- Advanced settings (for future enhancement)
- Real-time preview and progress
- Download finished videos

---

## 🎨 Tech Stack

- **Next.js 14** - React framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **React Hooks** - State management

---

## 📊 How It Works

```
User enters prompt
    ↓
Frontend calls POST /api/generate
    ↓
Backend starts video generation
    ↓
Frontend polls GET /api/status/:job_id every 3 seconds
    ↓
Shows progress: queued → processing → completed
    ↓
Video displays with download button
```

---

## 🔍 API Integration

### Generate Video

```typescript
POST http://localhost:8080/api/generate
Content-Type: application/json

{
  "prompt": "A beautiful sunset over mountains"
}

Response:
{
  "job_id": "uuid-here",
  "status": "queued",
  "message": "Video generation started"
}
```

### Check Status

```typescript
GET http://localhost:8080/api/status/:job_id

Response:
{
  "job_id": "uuid",
  "status": "completed",  // or "queued", "processing", "failed"
  "video_url": "/api/video/uuid",
  "completed_at": "2025-10-30T12:00:00"
}
```

### Download Video

```typescript
GET http://localhost:8080/api/video/:job_id

Returns: video/mp4 file
```

---

## 🎬 Usage Flow

1. **Start Backend**
   ```bash
   python web_server.py
   ```

2. **Start Frontend**
   ```bash
   cd Flow_Frontend
   npm run dev
   ```

3. **Create Video**
   - Open https://desirable-reflection-production-aa8a.up.railway.app
   - Click "Get Started" or enter prompt on home page
   - Adjust settings if needed
   - Click "Generate Video"
   - Wait 5-10 minutes (progress shown live)
   - Watch and download your video!

---

## 🐛 Troubleshooting

### "Failed to check status. Is the backend running?"

**Solution:** Make sure the backend is running:
```bash
python web_server.py
```
Should show: "Server running at: http://localhost:8080"

### "Server error: 500"

**Solution:** Check backend logs for errors. Make sure:
- Google credentials are configured in `credentials.py`
- Playwright is installed: `playwright install chromium`

### Frontend won't start

**Solution:**
```bash
cd Flow_Frontend
rm -rf node_modules
rm package-lock.json
npm install
npm run dev
```

### CORS errors

**Solution:** The backend (`web_server.py`) already has CORS enabled with `flask-cors`. If you still see errors, check that the API_BASE_URL matches exactly.

---

## 📦 Build for Production

```bash
npm run build
npm start
```

This creates an optimized production build.

---

## 🎨 Customization

### Change Colors

Edit: `tailwind.config.js`

```javascript
theme: {
  extend: {
    colors: {
      'custom-purple': '#9333ea',
      'custom-pink': '#ec4899',
    }
  }
}
```

### Add Logo

Replace the SVG icon in the navigation with your logo:

**File:** `src/app/generate/page.tsx` (line ~56)

---

## 🔐 Environment Variables (Optional)

Create `.env.local`:

```bash
NEXT_PUBLIC_API_URL=http://localhost:8080
```

Then use in code:
```typescript
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'
```

---

## 📝 TODO / Future Enhancements

- [ ] Add image-to-video backend support
- [ ] Implement video history/gallery
- [ ] Add user authentication
- [ ] Save videos to cloud storage
- [ ] Add video editing features
- [ ] Batch video generation
- [ ] Template library

---

## 🎯 Project Structure

```
Flow_Frontend/
├── src/
│   ├── app/
│   │   ├── page.tsx              # Landing page
│   │   ├── generate/
│   │   │   └── page.tsx          # Video generation page
│   │   ├── layout.tsx            # Root layout
│   │   └── globals.css           # Global styles
│   └── components/               # Reusable components (future)
├── public/                       # Static assets
├── package.json
├── tailwind.config.js
└── next.config.js
```

---

## 🚀 Deployment

### Deploy Frontend (Vercel)

```bash
npm run build
vercel deploy
```

### Deploy Backend (Heroku, AWS, etc.)

Make sure to:
1. Update `API_BASE_URL` in frontend
2. Configure CORS for your domain
3. Set up production WSGI server (gunicorn)

---

## 📞 Support

Check the main README.md in the root directory for:
- Backend setup
- Troubleshooting
- Architecture details

---

**Happy video generating!** 🎬✨




