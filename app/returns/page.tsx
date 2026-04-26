import { Metadata } from 'next'
import Link from 'next/link'
import Script from 'next/script'
import FadeInSection from '@/components/fade-in-section'

const baseUrl = process.env.VERCEL_PROJECT_PRODUCTION_URL
  ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
  : 'http://localhost:3000'

export const metadata: Metadata = {
  title: 'Returns & Exchanges',
  description: '30-day hassle-free returns and exchanges on all Taaron leather goods. Unused condition required. Full refund via bKash or bank transfer.',
  alternates: { canonical: `${baseUrl}/returns` },
  openGraph: {
    title: 'Returns & Exchanges',
    description: '30-day hassle-free returns. Full refund via bKash or bank transfer within 3–5 business days after inspection.',
    url: `${baseUrl}/returns`,
    siteName: 'Taaron',
    images: [{ url: `${baseUrl}/taaron-logo.png`, width: 1200, height: 630, alt: 'Taaron — Premium Leather Goods' }],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Returns & Exchanges',
    description: '30-day hassle-free returns on all Taaron leather goods.',
    images: [`${baseUrl}/taaron-logo.png`],
  },
}

const steps = [
  { n: '01', title: 'Contact Us', body: 'Reach out via WhatsApp or email within 30 days of delivery. Share your order ID and the reason for the return.' },
  { n: '02', title: 'Ship It Back', body: "We'll confirm the return and share the drop-off address. Pack the item securely in its original packaging if possible." },
  { n: '03', title: 'Inspection', body: "Once received, our team inspects the item within 1–2 business days. We'll notify you via SMS or WhatsApp." },
  { n: '04', title: 'Refund or Exchange', body: 'Approved returns get a full refund via bKash or exchange for another item of equal value — your choice.' },
]

const faqs = [
  { q: 'What is the return window?', a: '30 days from the date of delivery.' },
  { q: 'What condition must the item be in?', a: 'Unused, in original condition with any tags attached. Items showing signs of use, customisation, or damage cannot be returned.' },
  { q: 'Do I pay for return shipping?', a: 'Yes — return shipping costs are borne by the customer unless the item arrived damaged or incorrect, in which case we cover it.' },
  { q: 'How long does the refund take?', a: 'Refunds are processed within 3–5 business days after inspection. bKash transfers are usually instant once issued.' },
  { q: 'Can I exchange for a different size or color?', a: 'Yes. Subject to availability. If the replacement costs more, you pay the difference; if less, we refund the gap.' },
  { q: 'What about sale or discounted items?', a: 'Sale items are final sale and cannot be returned unless they arrive defective.' },
]

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faqs.map((faq) => ({
    '@type': 'Question',
    name: faq.q,
    acceptedAnswer: { '@type': 'Answer', text: faq.a },
  })),
}

export default function ReturnsPage() {
  return (
    <div className="min-h-screen bg-[#F7F4EF] text-[#111111]">
      <Script id="faq-schema" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      {/* Banner header */}
      <div
        className="relative flex flex-col justify-end overflow-hidden px-6 pb-10 pt-28 lg:px-16 lg:pb-12 lg:pt-32"
        style={{
          background: 'linear-gradient(135deg, #F0EDE7 0%, #E2D9CC 50%, #D4BFA0 100%)',
          minHeight: '28vh',
        }}
      >
        <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle at 70% 50%, #F7F4EF 0%, transparent 60%)' }} />
        <div className="relative mx-auto max-w-screen-xl w-full">
          <p className="text-[10px] uppercase tracking-[0.4em] text-[#9B6F47]">Support</p>
          <h1
            className="mt-2 text-[#111111]"
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(2.4rem, 5vw, 4.5rem)',
              lineHeight: '1.05',
              letterSpacing: '-0.01em',
              fontWeight: 400,
            }}
          >
            Returns &amp; Exchanges
          </h1>
          <p className="mt-3 max-w-md text-sm leading-relaxed text-[#5C5652]">
            Not quite right? No problem. We accept returns within 30 days of delivery — no fuss, no questions.
          </p>
        </div>
      </div>

      {/* Process steps */}
      <section className="mx-auto max-w-screen-xl px-6 py-16 lg:px-16 lg:py-20">
        <FadeInSection>
          <p className="mb-12 text-[10px] uppercase tracking-[0.4em] text-[#9E9690]">How it works</p>
        </FadeInSection>
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, idx) => (
            <FadeInSection key={step.n} delay={idx * 80}>
              <div className="group border-t border-[#E5DFD6] pt-6">
                <p
                  className="font-serif text-4xl font-medium text-[#9B6F47]/25 transition-colors duration-500 group-hover:text-[#9B6F47]/70"
                  style={{ fontFamily: 'var(--font-display)' }}
                >
                  {step.n}
                </p>
                <h3 className="mt-4 text-[11px] font-semibold uppercase tracking-widest text-[#111111]">{step.title}</h3>
                <p className="mt-3 text-sm leading-loose text-[#5C5652]">{step.body}</p>
              </div>
            </FadeInSection>
          ))}
        </div>
      </section>

      {/* Policy + FAQ */}
      <section className="border-t border-[#E5DFD6] mx-auto max-w-screen-xl px-6 py-16 lg:px-16 lg:py-20">
        <div className="grid gap-16 lg:grid-cols-[1fr_1.6fr]">

          <FadeInSection>
            <p className="mb-8 text-[10px] uppercase tracking-[0.4em] text-[#9E9690]">Policy at a Glance</p>
            <div className="divide-y divide-[#E5DFD6]">
              <div className="py-6 first:pt-0">
                <p className="text-[10px] uppercase tracking-widest text-[#9E9690]">Return Window</p>
                <p className="mt-2 text-2xl font-medium text-[#111111]" style={{ fontFamily: 'var(--font-display)' }}>30 Days</p>
                <p className="mt-1 text-xs text-[#5C5652]">From date of delivery</p>
              </div>
              <div className="py-6">
                <p className="text-[10px] uppercase tracking-widest text-[#9E9690]">Refund Method</p>
                <p className="mt-2 text-sm font-medium text-[#111111]">bKash · Bank Transfer</p>
                <p className="mt-1 text-xs text-[#5C5652]">3–5 business days after inspection</p>
              </div>
              <div className="py-6">
                <p className="text-[10px] uppercase tracking-widest text-[#9E9690]">Contact</p>
                <a href="mailto:taaron.store@gmail.com" className="mt-2 block text-sm font-medium text-[#9B6F47] transition-colors hover:text-[#111111]">
                  taaron.store@gmail.com
                </a>
                <a href="https://wa.me/8801920585212" target="_blank" rel="noopener noreferrer" className="mt-1 block text-xs text-[#5C5652] transition-colors hover:text-[#9B6F47]">
                  WhatsApp: +880 1920-585212
                </a>
              </div>
            </div>
          </FadeInSection>

          <FadeInSection delay={80}>
            <p className="mb-8 text-[10px] uppercase tracking-[0.4em] text-[#9E9690]">Common Questions</p>
            <dl className="divide-y divide-[#E5DFD6]">
              {faqs.map((faq) => (
                <div key={faq.q} className="group py-5">
                  <dt className="text-sm font-medium text-[#111111] transition-colors group-hover:text-[#9B6F47]">
                    {faq.q}
                  </dt>
                  <dd className="mt-2 text-sm leading-relaxed text-[#5C5652]">{faq.a}</dd>
                </div>
              ))}
            </dl>
          </FadeInSection>

        </div>
      </section>

      {/* CTA */}
      <section className="bg-[#111111] px-6 py-16 lg:px-16">
        <div className="mx-auto max-w-screen-xl">
          <FadeInSection>
            <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2
                  className="text-2xl font-medium text-white lg:text-3xl"
                  style={{ fontFamily: 'var(--font-display)' }}
                >
                  Ready to start a return?
                </h2>
                <p className="mt-2 text-sm text-[#9E9690]">Get in touch and we&apos;ll handle the rest.</p>
              </div>
              <Link
                href="/contact"
                className="inline-block border border-white/20 px-10 py-3.5 text-[11px] uppercase tracking-[0.25em] text-white transition-all duration-300 hover:border-[#9B6F47] hover:bg-[#9B6F47] whitespace-nowrap"
              >
                Contact Us
              </Link>
            </div>
          </FadeInSection>
        </div>
      </section>

    </div>
  )
}
