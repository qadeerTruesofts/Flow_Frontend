'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'

// Dummy article data - This will be replaced with API data later
const dummyArticle = {
  id: '1',
  title: 'The Future of AI Video Generation: Revolutionizing Content Creation',
  category: 'Technology',
  date: '2024-01-15',
  image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=1200&h=600&fit=crop',
  author: 'John Doe',
  readTime: '8 min read',
  content: `
    <p class="lead">Artificial Intelligence has transformed countless industries, and video generation is no exception. In this comprehensive exploration, we dive deep into how AI video generation is revolutionizing content creation.</p>

    <p>The landscape of video content creation has undergone a seismic shift. What once required expensive equipment, professional teams, and days of post-production can now be accomplished with a simple text prompt and cutting-edge AI technology.</p>

    <h2>The Evolution of Video Generation</h2>

    <p>Traditional video production has always been a time-consuming and resource-intensive process. From storyboarding to shooting, editing, and post-production, creating quality video content demanded significant investment in both time and money. However, the advent of AI video generation technologies has democratized this creative process, making it accessible to creators of all skill levels.</p>

    <p>Modern AI video generators use sophisticated machine learning models trained on vast datasets of video content. These models can understand context, interpret prompts, and generate coherent video sequences that match the creator's vision.</p>

    <h2>Key Features and Capabilities</h2>

    <p>Today's AI video generation platforms offer an impressive array of features:</p>

    <ul>
      <li><strong>Text-to-Video:</strong> Transform written descriptions into video content instantly</li>
      <li><strong>Style Transfer:</strong> Apply artistic styles and visual effects automatically</li>
      <li><strong>Scene Understanding:</strong> AI understands context and creates appropriate backgrounds and settings</li>
      <li><strong>Motion Control:</strong> Precise control over camera movements and object motion</li>
      <li><strong>Resolution Optimization:</strong> Generate content at various quality levels</li>
    </ul>

    <h2>Impact on Content Creators</h2>

    <p>The implications for content creators are profound. Independent creators can now produce professional-quality videos without the overhead of traditional production. This has led to an explosion of creative content across platforms, from YouTube to social media.</p>

    <p>Small businesses and startups particularly benefit from these technologies. Marketing teams can create engaging video content for campaigns without hiring expensive production crews. Educational institutions can generate instructional videos more efficiently, and individual creators can bring their ideas to life faster than ever before.</p>

    <h2>Challenges and Considerations</h2>

    <p>Despite the exciting possibilities, there are important considerations. The technology is still evolving, and there are questions about copyright, authenticity, and the role of human creativity. However, many experts believe AI will augment rather than replace human creativity, serving as a powerful tool in the creator's toolkit.</p>

    <h2>Looking Ahead</h2>

    <p>As we look to the future, we can expect AI video generation to become even more sophisticated. Improvements in understanding context, maintaining consistency across frames, and generating longer-form content will continue to push the boundaries of what's possible.</p>

    <p>The democratization of video creation through AI represents a significant shift in how we think about content creation. As these technologies become more accessible and refined, we're likely to see an even greater diversity of voices and creative perspectives in the digital landscape.</p>

    <p>Whether you're a seasoned content creator or someone just starting out, understanding and embracing these tools can unlock new creative possibilities and help bring your vision to life.</p>
  `
}

export default function ArticlePage() {
  const router = useRouter()
  
  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const handleGenerateClick = (e: React.MouseEvent) => {
    e.preventDefault()
    router.push('/generate?signin=true')
  }

  return (
    <div className="min-h-screen bg-white text-gray-900">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-black/90 backdrop-blur-xl border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <Link href="/" className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              </div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                AI Video Generator
              </h1>
            </Link>
            <div className="flex items-center gap-4">
              <Link href="/generate" className="px-5 py-2 bg-purple-600/10 hover:bg-purple-600/20 border border-purple-500/30 rounded-xl text-sm font-semibold text-purple-700 transition-all">
                Generate Video
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Article Container */}
      <article className="pt-32 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Left Side - Article Content (Header + Body) */}
            <div className="lg:col-span-2 space-y-12">
              {/* Article Header Section */}
              <div className="space-y-6">
                {/* Category and Date */}
                <div className="flex flex-wrap items-center gap-4 text-sm">
                  <span className="px-4 py-2 bg-gradient-to-r from-purple-600/20 to-pink-600/20 border border-purple-500/30 rounded-full font-semibold text-purple-700">
                    {dummyArticle.category}
                  </span>
                  <span className="text-gray-600 flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    {formatDate(dummyArticle.date)}
                  </span>
                  <span className="text-gray-600 flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {dummyArticle.readTime}
                  </span>
                </div>

                {/* Title */}
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight bg-gradient-to-r from-gray-900 via-purple-600 to-gray-900 bg-clip-text text-transparent">
                  {dummyArticle.title}
                </h1>

                {/* Author Info */}
                <div className="flex items-center gap-4 pb-6 border-b border-gray-200">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold">
                    {dummyArticle.author.charAt(0)}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">{dummyArticle.author}</p>
                    <p className="text-sm text-gray-600">Content Creator</p>
                  </div>
                </div>

                {/* Featured Image */}
                <div className="relative w-full aspect-video rounded-2xl overflow-hidden border border-gray-200 shadow-2xl">
                  <img
                    src={dummyArticle.image}
                    alt={dummyArticle.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
                </div>
              </div>

              {/* Article Content */}
              <div 
                className="prose prose-lg max-w-none text-gray-800"
                dangerouslySetInnerHTML={{ 
                  __html: dummyArticle.content
                }}
              />
            </div>

            {/* Right Side - Sticky CTA */}
            <div className="lg:col-span-1">
              <div className="lg:sticky lg:top-32 lg:self-start">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl opacity-20 blur-lg" />
                <div className="relative bg-gradient-to-br from-purple-50 via-white to-pink-50 border-2 border-purple-200/60 rounded-2xl p-4 shadow-lg shadow-purple-500/10">
                  <div className="space-y-3">
                    <div>
                      <h3 className="text-lg font-bold mb-1 bg-gradient-to-r from-purple-700 to-pink-700 bg-clip-text text-transparent">
                        Create Your Video
                      </h3>
                      <p className="text-gray-700 text-xs mb-3">
                        Transform your ideas into stunning videos with AI. Free to try!
                      </p>
                    </div>
                    <button
                      onClick={handleGenerateClick}
                      className="block group relative w-full"
                    >
                      <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl opacity-75 group-hover:opacity-100 blur transition-all" />
                      <div className="relative px-4 py-2.5 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl font-bold text-sm hover:scale-105 transition-all shadow-xl shadow-purple-500/50 flex items-center justify-center gap-2 text-white">
                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                        <span className="text-white">Generate AI Video Free</span>
                        <svg className="w-4 h-4 text-white group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                        </svg>
                      </div>
                    </button>
                    {/* Benefits - Horizontal Layout */}
                    <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
                      <div className="flex items-center gap-1 text-purple-700 text-[10px] font-semibold">
                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        No credit card
                      </div>
                      <div className="flex items-center gap-1 text-purple-700 text-[10px] font-semibold">
                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13a1 1 0 102 0V9.414l1.293 1.293a1 1 0 001.414-1.414z" clipRule="evenodd" />
                        </svg>
                        Start instantly
                      </div>
                      <div className="flex items-center gap-1 text-purple-700 text-[10px] font-semibold">
                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        100% Free
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Share Section */}
          <div className="grid lg:grid-cols-3 gap-8 mt-16">
            <div className="lg:col-span-2 pt-8 border-t border-gray-200">
              <p className="text-sm text-gray-600 mb-4">Share this article</p>
              <div className="flex gap-3">
                <button className="px-4 py-2 bg-gray-100 hover:bg-gray-200 border border-gray-200 rounded-xl transition-all flex items-center gap-2 text-gray-700">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                  <span className="text-sm">Share</span>
                </button>
                <button className="px-4 py-2 bg-gray-100 hover:bg-gray-200 border border-gray-200 rounded-xl transition-all flex items-center gap-2 text-gray-700">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                  </svg>
                  <span className="text-sm">Tweet</span>
                </button>
                <button className="px-4 py-2 bg-gray-100 hover:bg-gray-200 border border-gray-200 rounded-xl transition-all flex items-center gap-2 text-gray-700">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                  <span className="text-sm">LinkedIn</span>
                </button>
              </div>
            </div>
            <div className="lg:col-span-1"></div>
          </div>

          {/* Related Articles / Back to Home */}
          <div className="grid lg:grid-cols-3 gap-8 mt-16">
            <div className="lg:col-span-2 pt-8 border-t border-gray-200">
              <Link 
                href="/"
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600/20 to-pink-600/20 hover:from-purple-600/30 hover:to-pink-600/30 border border-purple-500/30 rounded-xl transition-all font-semibold text-gray-900"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Back to Home
              </Link>
            </div>
            <div className="lg:col-span-1">            </div>
          </div>
        </div>
      </article>


      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="p-12 rounded-3xl bg-gradient-to-br from-purple-600/20 to-pink-600/20 border border-purple-500/30">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900">
              Generate  Amazing Ai Videos Free?
            </h2>
            <p className="text-xl text-gray-700 mb-10">
              Join thousands of creators who are already using AI to bring their ideas to life
            </p>
            <button
              onClick={handleGenerateClick}
              className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full text-lg font-semibold hover:opacity-90 transition-all shadow-2xl shadow-purple-500/50 text-white"
            >
              <span className="text-white">Start Creating Now</span>
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </button>
          </div>
        </div>
      </section>
    </div>
  )
}

