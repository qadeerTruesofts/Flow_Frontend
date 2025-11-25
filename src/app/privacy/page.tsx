import type { Metadata } from 'next'
import Link from 'next/link'

const sections = [
  {
    title: '1. Information we collect',
    content: [
      'Account data such as name, email address, Google profile information, and authentication tokens when you sign in.',
      'Content data including prompts, uploaded reference assets, rendered videos.',
      
    ],
  },
  {
    title: '2. How we use your information',
    content: [
      'Authenticate you with Google OAuth, maintain session security, and keep you signed in across devices.',
      'Render videos using your prompts  and deliver files back to your dashboard.',
      'Improve the platform by analyzing aggregate usage, testing new features, and preventing abuse or fraud.',
      'Communicate service updates, product education, newsletters, or respond to support requests.',
    ],
  },
  {
    title: '3. Sharing your data',
    content: [
      
      'Analytics and error tracking tools that help us monitor uptime and performance.',
      
      'Legal or compliance requests when required to meet applicable laws, defend our rights, or respond to valid subpoenas.',
    ],
  },
  {
    title: '4. Data retention & security',
    content: [
      'Rendering credentials are encrypted at rest and rotated automatically when possible.',
      'Project assets are retained while your account remains active or until you delete them from the dashboard.',
      'Backups are stored on secure infrastructure with limited access and strict logging.',
      'If you close your account, we remove or anonymize personal data within 30 days unless legal obligations require longer retention.',
    ],
  },
  {
    title: '5. Your rights',
    content: [
      'Access, update, or delete profile information directly from your account settings.',
      'Request a copy of your data or ask us to delete it by emailing privacy@vidwave.ai.',
      'Opt out of marketing emails by using the unsubscribe link or contacting support.',
      'Disable cookie-based analytics in your browser or through third-party opt-out tools.',
    ],
  },
]

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description:
    'Understand how Vidwave collects, uses, and protects your data when you create AI-generated videos and manage content.',
  alternates: {
    canonical: '/privacy',
  },
}

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-slate-50 text-gray-900">
      <header className="border-b border-slate-200 bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-4xl flex-col gap-3 px-6 py-10 text-center">
          <Link href="/" className="mx-auto flex items-center gap-2 text-gray-900">
            <div className="h-10 w-10 rounded-2xl bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 text-white flex items-center justify-center font-bold">
              V
            </div>
            <span className="text-base font-semibold">Vidwave</span>
          </Link>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-purple-600">Privacy Policy</p>
          <h1 className="text-4xl font-bold text-gray-900">Your creativity deserves trustworthy privacy</h1>
          <p className="text-base text-gray-600 md:text-lg">
            Last updated: {new Date().toLocaleString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
          </p>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-6 py-16 space-y-10">
        <section className="rounded-3xl bg-white p-8 shadow-lg">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Our promise</h2>
          <p className="text-gray-600 leading-relaxed">
            Vidwave is built for creators and teams who rely on us to turn sensitive ideas into finished videos. We only
            collect the data required to run the platform, secure your account, and improve the experience. We never sell
            personal data and we never train external AI models on your private projects.
          </p>
        </section>

        {sections.map((section) => (
          <section key={section.title} className="rounded-3xl border border-slate-200 bg-white/80 p-8 shadow-sm">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">{section.title}</h3>
            <ul className="space-y-3 text-gray-600 leading-relaxed">
              {section.content.map((item) => (
                <li key={item} className="flex gap-3">
                  <span className="mt-1 inline-flex h-2 w-2 rounded-full bg-purple-500" aria-hidden />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </section>
        ))}

        <section className="rounded-3xl bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-600 p-8 text-white shadow-2xl">
          <h3 className="text-2xl font-semibold mb-3">Questions or requests?</h3>
          <p className="text-white/90 leading-relaxed mb-6">
            Reach out anytime and our trust & safety team will respond within 2 business days.
          </p>
          <div className="flex flex-col gap-3 text-white/90">
            <p>
              Email:{' '}
              <a href="mailto:privacy@vidwave.ai" className="underline hover:text-white">
                privacy@vidwave.ai
              </a>
            </p>
            <p>Address: Vidwave HQ, 548 Market Street, San Francisco, CA 94104</p>
          </div>
        </section>
      </main>
    </div>
  )
}

