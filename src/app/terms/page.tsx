import type { Metadata } from 'next'
import Link from 'next/link'

const termsSections = [
  {
    heading: '1. Acceptance of terms',
    body: [
      'By accessing Vidwave, creating an account, or generating videos, you agree to these Terms of Service and our Privacy Policy.',
      'If you are entering into this agreement on behalf of a company or agency, you represent that you have the authority to bind that organization.',
    ],
  },
  {
    heading: '2. Eligibility & accounts',
    body: [
      'You must be at least 13 years old to use Vidwave. Certain features may require you to be 18+ depending on regional regulations.',
      'Keep your login credentials confidential. You are responsible for all activity that occurs under your account.',
    ],
  },
  {
    heading: '3. Usage rights for AI outputs',
    body: [
      'You retain ownership of prompts, uploaded assets, and videos rendered through Vidwave, subject to third-party model policies.',
      'We grant you a worldwide, royalty-free license to download, edit, and publish outputs generated through your account.',
      'Vidwave may display anonymized, aggregated usage metrics for marketing or benchmarking—never identifiable content without permission.',
    ],
  },
  {
    heading: '4. Acceptable use & restrictions',
    body: [
      'Do not use the platform for illegal activities, harassment, deepfakes intended to mislead, or generating hate speech.',
      'Reverse engineering, scraping, or bypassing rendering limits is prohibited.',
      'We reserve the right to suspend accounts that abuse Veo 3 resources, attempt to access other users’ jobs, or compromise system security.',
    ],
  },
  {
    heading: '5. Payments & subscriptions',
    body: [
      'Certain features may require a paid plan. Fees are billed at the start of each term (monthly or annually) and are non-refundable except where required by law.',
      'Downgrading may immediately reduce access to premium rendering queues or storage.',
      'Taxes, exchange fees, and bank charges are the responsibility of the account holder.',
    ],
  },
  {
    heading: '6. Service availability & SLAs',
    body: [
      'Vidwave is provided on an “as-is” basis. We strive for 99%+ uptime but occasional maintenance windows or third-party outages may occur.',
      'Mission-critical teams can request dedicated queues and custom SLAs by contacting sales@vidwave.ai.',
    ],
  },
  {
    heading: '7. Termination',
    body: [
      'You may close your account at any time via the dashboard or by emailing support@vidwave.ai.',
      'We may suspend or terminate access if you violate these terms, misuse the API, or fail to pay outstanding invoices.',
      'Upon termination we will delete or anonymize personal data in accordance with our Privacy Policy, subject to legal retention requirements.',
    ],
  },
  {
    heading: '8. Disclaimers & liability',
    body: [
      'Vidwave does not guarantee that outputs will be error-free, unique, or suitable for every creative use case.',
      'To the fullest extent permitted by law, Vidwave is not liable for lost profits, indirect damages, or content removed for policy violations.',
      'Our total liability will not exceed the fees you paid, if any, in the 12 months preceding the claim.',
    ],
  },
  {
    heading: '9. Changes to these terms',
    body: [
      'We may update these terms to reflect new regulations or features. Material updates will be posted on this page and emailed to admins.',
      'Continued use after an update means you accept the revised terms.',
    ],
  },
]

export const metadata: Metadata = {
  title: 'Terms of Service',
  description: 'Review the legal terms that govern your use of Vidwave and our AI-powered video creation platform.',
  alternates: {
    canonical: '/terms',
  },
}

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen bg-white text-gray-900">
      <header className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
        <div className="mx-auto flex max-w-5xl flex-col gap-4 px-6 py-16 text-center">
          <Link href="/" className="mx-auto flex items-center gap-2 text-white/90">
            <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/10 text-lg font-bold text-white">
              V
            </span>
            <span className="text-base font-semibold tracking-wide uppercase">Vidwave</span>
          </Link>
          <p className="text-sm font-semibold text-blue-200 uppercase tracking-[0.2em]">Terms of Service</p>
          <h1 className="text-4xl md:text-5xl font-bold leading-tight">
            The rules we follow so you can create boldly with AI
          </h1>
          <p className="text-base text-white/80 md:text-lg">
            Effective date: {new Date().toLocaleString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
          </p>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-6 py-16 space-y-8">
        {termsSections.map((section) => (
          <section key={section.heading} className="rounded-3xl border border-gray-100 bg-white p-8 shadow-sm">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">{section.heading}</h2>
            <ul className="space-y-3 text-gray-600 leading-relaxed">
              {section.body.map((item) => (
                <li key={item} className="flex gap-3">
                  <span className="mt-1 h-2 w-2 rounded-full bg-gray-900" aria-hidden />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </section>
        ))}

        <section className="rounded-3xl bg-blue-50 p-8 border border-blue-100">
          <h3 className="text-xl font-semibold text-blue-900 mb-3">Need a custom agreement?</h3>
          <p className="text-blue-900/80 leading-relaxed mb-4">
            Agencies, enterprises, and education teams can request customized data processing addendums, project-specific
            scopes, or dedicated queue agreements.
          </p>
          <div className="flex flex-col gap-2 text-blue-900/80">
            <a href="mailto:legal@vidwave.ai" className="font-semibold underline hover:text-blue-900">
              legal@vidwave.ai
            </a>
            <span>Vidwave HQ, 548 Market Street, San Francisco, CA 94104</span>
          </div>
        </section>
      </main>
    </div>
  )
}

