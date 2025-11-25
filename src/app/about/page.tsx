import Link from 'next/link'
import type { Metadata } from 'next'
import { siteConfig } from '@/lib/seo-config'

const stats = [
  { label: 'Videos generated', value: '120K+' },
  { label: 'Creators worldwide', value: '50K+' },
  { label: 'Avg. render time', value: '2.5 min' },
  { label: 'Support satisfaction', value: '98%' },
]

const pillars = [
  {
    title: 'AI-first creativity',
    description:
      'We obsess over research so that every creator—no matter their skill level—can tap into cinematic AI capabilities with a single prompt.',
  },
  {
    title: 'Human centered design',
    description:
      'Everything we build is tested with real storytellers. Empathy for your workflow drives our product roadmap, not vanity metrics.',
  },
  {
    title: 'Enterprise-grade reliability',
    description:
      'From token auto-refresh to observability, Vidwave is engineered to stay online and keep rendering even when demand spikes.',
  },
]

const milestones = [
  {
    date: 'Q2 2023',
    title: 'Vidwave prototype',
    detail: 'A scrappy internal tool that converted text prompts into short-form clips for marketing experiments.',
  },
  {
    date: 'Q4 2023',
    title: 'Private beta',
    detail: 'Expanded to 500 invited creators, added native Veo 3 integration, and shipped the first admin dashboard.',
  },
  {
    date: 'Q2 2024',
    title: 'Vidwave Cloud',
    detail: 'Launched multi-user rendering queues, OAuth onboarding, and SEO-ready blogging tools.',
  },
  {
    date: 'Today',
    title: 'Global rollout',
    detail: 'Powering agencies, educators, and solo founders with reliable AI video infrastructure.',
  },
]

export const metadata: Metadata = {
  title: 'About Vidwave',
  description:
    'Learn how Vidwave helps creators, agencies, and teams turn ideas into professional AI-generated videos in minutes.',
  alternates: {
    canonical: '/about',
  },
}

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 via-purple-50/40 to-white text-gray-900">
      <Header />

      <main className="max-w-6xl mx-auto px-6 lg:px-8 py-20 space-y-20">
        <section className="text-center space-y-6">
          <p className="inline-flex items-center px-4 py-1.5 rounded-full bg-white shadow-sm text-sm font-semibold text-purple-700">
            Built for modern storytellers
          </p>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
            We make premium video creation effortless
          </h1>
          <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
            Vidwave is an AI-native studio that combines Google&rsquo;s Veo 3 models, thoughtful UX, and mission-critical
            automation. We believe anyone should be able to turn imagination into polished footage without touching a
            timeline.
          </p>
        </section>

        <section className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="rounded-3xl border border-gray-100 bg-white/80 p-8 shadow-sm backdrop-blur transition hover:-translate-y-1 hover:shadow-lg"
            >
              <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
              <p className="mt-2 text-sm uppercase tracking-wide text-gray-500">{stat.label}</p>
            </div>
          ))}
        </section>

        <section className="grid gap-10 lg:grid-cols-2">
          <div className="rounded-3xl bg-white p-10 shadow-xl">
            <p className="text-sm font-semibold text-purple-600 mb-3">Our story</p>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">From agency pain point to global platform</h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              Vidwave started as an internal tool to help creative teams keep up with client demand. We stitched together
              clunky AI pipelines, hacked admin dashboards, and launched dozens of experiments until the workflow finally
              felt magical.
            </p>
            <p className="text-gray-600 leading-relaxed">
              Today the same obsession powers everything from our auto-refreshing token pipelines to the SEO-friendly
              publishing tools inside the admin panel. We ship pragmatic innovation so that your audiences see results,
              not your backend.
            </p>
          </div>
          <div className="rounded-3xl border border-gray-100 bg-white/70 p-10 backdrop-blur">
            <p className="text-sm font-semibold text-purple-600 mb-3">What drives us</p>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Three pillars we never compromise on</h2>
            <div className="space-y-6">
              {pillars.map((pillar) => (
                <div key={pillar.title} className="rounded-2xl border border-gray-100 p-6 shadow-sm bg-white/60">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{pillar.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{pillar.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section>
          <div className="flex items-center justify-between flex-wrap gap-4 mb-8">
            <div>
              <p className="text-sm font-semibold text-purple-600 mb-1">Building in public</p>
              <h2 className="text-3xl font-bold text-gray-900">Milestones that shaped Vidwave</h2>
            </div>
            <Link
              href="/generate"
              className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-3 text-sm font-semibold text-white shadow-lg transition hover:opacity-90"
            >
              Try the AI studio
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14m-7-7l7 7-7 7" />
              </svg>
            </Link>
          </div>
          <div className="grid gap-6 md:grid-cols-2">
            {milestones.map((item) => (
              <article key={item.title} className="rounded-3xl border border-gray-100 bg-white/80 p-8 shadow-sm">
                <p className="text-sm font-semibold text-purple-600">{item.date}</p>
                <h3 className="mt-3 text-2xl font-semibold text-gray-900">{item.title}</h3>
                <p className="mt-3 text-gray-600 leading-relaxed">{item.detail}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="rounded-3xl bg-gradient-to-br from-blue-600 via-purple-600 to-pink-500 px-8 py-12 text-white shadow-2xl">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wide text-white/80">Join the movement</p>
              <h2 className="mt-2 text-3xl md:text-4xl font-bold leading-tight">Create stunning AI videos in minutes</h2>
              <p className="mt-4 text-white/90 max-w-2xl">
                Your audience expects premium visuals. Vidwave handles the rendering pipelines, queue management, and SEO
                scaffolding so you can focus on storytelling.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
              <Link
                href="/generate"
                className="flex-1 rounded-2xl bg-white/10 px-8 py-4 text-center text-lg font-semibold backdrop-blur hover:bg-white/20 transition"
              >
                Start generating
              </Link>
              <Link
                href="/blogs"
                className="flex-1 rounded-2xl bg-white px-8 py-4 text-center text-lg font-semibold text-gray-900 hover:bg-gray-100 transition"
              >
                Explore resources
              </Link>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}

function Header() {
  return (
    <header className="border-b border-gray-100 bg-white/80 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 lg:px-8 py-5">
        <Link href="/" className="flex items-center gap-3 text-gray-900">
          <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 text-lg font-bold text-white shadow-lg">
            V
          </span>
          <div>
            <p className="text-lg font-bold">Vidwave</p>
            <p className="text-xs text-gray-500">AI Video Studio</p>
          </div>
        </Link>
        <nav className="flex items-center gap-6 text-sm font-medium text-gray-600">
          <Link href="/generate" className="hover:text-gray-900">
            Text to Video
          </Link>
          <Link href="/blogs" className="hover:text-gray-900">
            Blog
          </Link>
          <a href={siteConfig.url} className="hidden sm:inline-flex hover:text-gray-900" target="_blank" rel="noreferrer">
            {new URL(siteConfig.url).hostname}
          </a>
        </nav>
      </div>
    </header>
  )
}

