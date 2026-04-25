import { Metadata } from 'next'
import Link from 'next/link'
import FadeInSection from '@/components/fade-in-section'

export const metadata: Metadata = {
  title: 'Returns & Exchanges — Taaron',
  description: '30-day hassle-free returns and exchanges on all Taaron leather goods. Unused condition. Contact us to start.',
}

const steps = [
  {
    n: '01',
    title: 'Contact Us',
    body: 'Reach out via WhatsApp or email within 30 days of delivery. Share your order ID and the reason for the return.',
  },
  {
    n: '02',
    title: 'Ship It Back',
    body: 'We\'ll confirm the return and share the drop-off address. Pack the item securely in its original packaging if possible.',
  },
  {
    n: '03',
    title: 'Inspection',
    body: 'Once received, our team inspects the item within 1–2 business days. We\'ll notify you via SMS or WhatsApp.',
  },
  {
    n: '04',
    title: 'Refund or Exchange',
    body: 'Approved returns get a full refund via bKash or exchange for another item of equal value — your choice.',
  },
]

const faqs = [
  {
    q: 'What is the return window?',
    a: '30 days from the date of delivery.',
  },
  {
    q: 'What condition must the item be in?',
    a: 'Unused, in original condition with any tags attached. Items showing signs of use, customisation, or damage cannot be returned.',
  },
  {
    q: 'Do I pay for return shipping?',
    a: 'Yes — return shipping costs are borne by the customer unless the item arrived damaged or incorrect, in which case we cover it.',
  },
  {
    q: 'How long does the refund take?',
    a: 'Refunds are processed within 3–5 business days after inspection. bKash transfers are usually instant once issued.',
  },
  {
    q: 'Can I exchange for a different size or color?',
    a: 'Yes. Subject to availability. If the replacement costs more, you pay the difference; if less, we refund the gap.',
  },
  {
    q: 'What about sale or discounted items?',
    a: 'Sale items are final sale and cannot be returned unless they arrive defective.',
  },
]

export default function ReturnsPage() {
  return (
    <div className="min-h-screen bg-[#F7F4EF] text-[#111111] pt-24">

      {/* Header */}
      <div className="mx-auto max-w-screen-xl px-6 py-16 lg:px-12 lg:py-20">
        <FadeInSection>
          <p className="text-[10px] uppercase tracking-[0.4em] text-[#9B6F47]">Taaron / Support</p>
          <h1
            className="mt-3 font-serif text-4xl font-bold lg:text-5xl xl:text-6xl"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            Returns &amp; Exchanges
          </h1>
          <div className="mt-4 h-px w-12 bg-[#9B6F47]" />
          <p className="mt-5 max-w-lg text-sm leading-relaxed text-[#5C5652]">
            Not quite right? No problem. We accept returns within 30 days of delivery — no fuss, no questions.
          </p>
        </FadeInSection>
      </div>

      {/* Process steps */}
      <section className="border-y border-[#E5DFD6] bg-white px-6 py-16 lg:px-12 lg:py-20">
        <div className="mx-auto max-w-screen-xl">
          <FadeInSection>
            <p className="mb-12 text-[10px] uppercase tracking-[0.4em] text-[#9E9690]">How it works</p>
          </FadeInSection>
          <div className="grid gap-10 md:grid-cols-4">
            {steps.map((step, idx) => (
              <FadeInSection key={step.n} delay={idx * 100}>
                <div className="group">
                  <p
                    className="font-serif text-5xl font-medium text-[#9B6F47]/20 transition-colors duration-500 group-hover:text-[#9B6F47]/60"
                    style={{ fontFamily: 'var(--font-display)' }}
                  >
                    {step.n}
                  </p>
                  <h3 className="mt-4 text-sm font-semibold uppercase tracking-widest text-[#111111]">{step.title}</h3>
                  <div className="mt-3 h-px w-8 bg-[#9B6F47] transition-all duration-500 group-hover:w-16" />
                  <p className="mt-4 text-sm leading-loose text-[#5C5652]">{step.body}</p>
                </div>
              </FadeInSection>
            ))}
          </div>
        </div>
      </section>

      {/* Policy details */}
      <section className="mx-auto max-w-screen-xl px-6 py-16 lg:px-12 lg:py-20">
        <div className="grid gap-16 lg:grid-cols-[1fr_1.5fr]">

          <FadeInSection>
            <div className="space-y-4">
              <div className="group border border-[#E5DFD6] bg-white p-6 transition-all duration-300 hover:border-[#9B6F47] hover:-translate-y-0.5 hover:shadow-sm">
                <p className="text-[10px] uppercase tracking-widest text-[#9E9690]">Return Window</p>
                <p className="mt-2 text-2xl font-semibold text-[#111111]">30 Days</p>
                <p className="mt-1 text-xs text-[#5C5652]">From date of delivery</p>
              </div>
              <div className="group border border-[#E5DFD6] bg-white p-6 transition-all duration-300 hover:border-[#9B6F47] hover:-translate-y-0.5 hover:shadow-sm">
                <p className="text-[10px] uppercase tracking-widest text-[#9E9690]">Refund Method</p>
                <p className="mt-2 text-sm font-medium text-[#111111]">bKash · Bank Transfer</p>
                <p className="mt-1 text-xs text-[#5C5652]">3–5 business days after inspection</p>
              </div>
              <div className="group border border-[#E5DFD6] bg-white p-6 transition-all duration-300 hover:border-[#9B6F47] hover:-translate-y-0.5 hover:shadow-sm">
                <p className="text-[10px] uppercase tracking-widest text-[#9E9690]">Contact</p>
                <a href="mailto:hello@taaron.com" className="mt-2 block text-sm font-medium text-[#9B6F47] hover:underline">
                  hello@taaron.com
                </a>
                <a href="https://wa.me/8801920585212" target="_blank" rel="noopener noreferrer" className="mt-1 block text-xs text-[#5C5652] hover:text-[#9B6F47] transition-colors">
                  Or WhatsApp us: +880 1920-585212
                </a>
              </div>
            </div>
          </FadeInSection>

          {/* FAQ */}
          <FadeInSection delay={100}>
            <p className="mb-8 text-[10px] uppercase tracking-[0.4em] text-[#9E9690]">Common Questions</p>
            <dl className="divide-y divide-[#E5DFD6]">
              {faqs.map((faq) => (
                <div key={faq.q} className="group py-5">
                  <dt className="text-sm font-semibold text-[#111111] transition-colors group-hover:text-[#9B6F47]">
                    {faq.q}
                  </dt>
                  <dd className="mt-2 text-sm leading-loose text-[#5C5652]">{faq.a}</dd>
                </div>
              ))}
            </dl>
          </FadeInSection>

        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-[#E5DFD6] bg-[#111111] px-6 py-16 lg:px-12">
        <div className="mx-auto max-w-screen-xl text-center">
          <FadeInSection>
            <h2
              className="font-serif text-2xl font-medium text-white lg:text-3xl"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              Ready to start a return?
            </h2>
            <p className="mt-3 text-sm text-[#9E9690]">Get in touch and we&apos;ll handle the rest.</p>
            <Link
              href="/contact"
              className="mt-8 inline-block border border-white/30 px-10 py-3.5 text-[11px] uppercase tracking-[0.2em] text-white transition-all duration-300 hover:border-[#9B6F47] hover:bg-[#9B6F47]"
            >
              Contact Us
            </Link>
          </FadeInSection>
        </div>
      </section>

    </div>
  )
}
