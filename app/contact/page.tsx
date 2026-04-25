import { Metadata } from 'next'
import FadeInSection from '@/components/fade-in-section'

export const metadata: Metadata = {
  title: 'Contact Us — Taaron',
  description: 'Get in touch with Taaron. We\'re here to help with orders, product questions, and anything else.',
}

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-[#FAFAFA] text-[#1E2737] pt-24">

      {/* Header */}
      <div className="mx-auto max-w-screen-xl px-6 py-16 lg:px-12 lg:py-20">
        <FadeInSection>
          <p className="text-[10px] uppercase tracking-[0.4em] text-[#1969B5]">Taaron / Support</p>
          <h1
            className="mt-3 font-serif text-4xl font-bold lg:text-5xl xl:text-6xl"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            Get in Touch
          </h1>
          <p className="mt-4 max-w-lg text-sm leading-relaxed text-[#4B5C73]">
            Questions about an order, a product, or anything else — we respond within one business day.
          </p>
        </FadeInSection>
      </div>

      {/* Content grid */}
      <div className="mx-auto max-w-screen-xl px-6 pb-24 lg:px-12">
        <div className="grid gap-16 lg:grid-cols-[1fr_1.5fr]">

          {/* Info column */}
          <FadeInSection>
            <div className="space-y-10">

              <div>
                <p className="text-[10px] uppercase tracking-widest text-[#7A8EA6]">WhatsApp / Phone</p>
                <a href="https://wa.me/8801920585212" target="_blank" rel="noopener noreferrer" className="mt-2 block text-lg font-medium text-[#1E2737] transition-colors hover:text-[#1969B5]">
                  +880 1920-585212
                </a>
                <p className="mt-1 text-xs text-[#7A8EA6]">Sun – Thu, 10am – 7pm BST</p>
              </div>

              <div>
                <p className="text-[10px] uppercase tracking-widest text-[#7A8EA6]">Email</p>
                <a href="mailto:hello@taaron.com" className="mt-2 block text-lg font-medium text-[#1E2737] transition-colors hover:text-[#1969B5]">
                  hello@taaron.com
                </a>
                <p className="mt-1 text-xs text-[#7A8EA6]">Response within 1 business day</p>
              </div>

              <div>
                <p className="text-[10px] uppercase tracking-widest text-[#7A8EA6]">Location</p>
                <p className="mt-2 text-sm leading-relaxed text-[#1E2737]">
                  Dhaka, Bangladesh
                </p>
                <p className="mt-1 text-xs text-[#7A8EA6]">COD & bKash available nationwide</p>
              </div>

              <div>
                <p className="mb-3 text-[10px] uppercase tracking-widest text-[#7A8EA6]">Follow Us</p>
                <div className="flex gap-4">
                  <a href="#" aria-label="Facebook" className="text-[#7A8EA6] transition-colors hover:text-[#1E2737]">
                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                    </svg>
                  </a>
                  <a href="#" aria-label="Instagram" className="text-[#7A8EA6] transition-colors hover:text-[#1E2737]">
                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          </FadeInSection>

          {/* Form */}
          <FadeInSection delay={120}>
            <form
              action="https://formsubmit.co/hello@taaron.com"
              method="POST"
              className="space-y-5"
            >
              <input type="hidden" name="_subject" value="New contact from Taaron website" />
              <input type="hidden" name="_captcha" value="false" />
              <input type="hidden" name="_template" value="table" />

              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label htmlFor="name" className="block text-[10px] uppercase tracking-widest text-[#7A8EA6]">
                    Name
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    required
                    placeholder="Your name"
                    className="mt-2 w-full border border-[#DDE3EB] bg-white px-4 py-3 text-sm text-[#1E2737] placeholder-[#B0BCCC] outline-none transition-colors focus:border-[#1E2737]"
                  />
                </div>
                <div>
                  <label htmlFor="phone" className="block text-[10px] uppercase tracking-widest text-[#7A8EA6]">
                    Phone / WhatsApp
                  </label>
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    placeholder="01XXXXXXXXX"
                    className="mt-2 w-full border border-[#DDE3EB] bg-white px-4 py-3 text-sm text-[#1E2737] placeholder-[#B0BCCC] outline-none transition-colors focus:border-[#1E2737]"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="email" className="block text-[10px] uppercase tracking-widest text-[#7A8EA6]">
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  placeholder="you@example.com"
                  className="mt-2 w-full border border-[#DDE3EB] bg-white px-4 py-3 text-sm text-[#1E2737] placeholder-[#B0BCCC] outline-none transition-colors focus:border-[#1E2737]"
                />
              </div>

              <div>
                <label htmlFor="subject" className="block text-[10px] uppercase tracking-widest text-[#7A8EA6]">
                  Subject
                </label>
                <select
                  id="subject"
                  name="subject"
                  className="mt-2 w-full border border-[#DDE3EB] bg-white px-4 py-3 text-sm text-[#1E2737] outline-none transition-colors focus:border-[#1E2737]"
                >
                  <option value="Order inquiry">Order inquiry</option>
                  <option value="Product question">Product question</option>
                  <option value="Return / Exchange">Return / Exchange</option>
                  <option value="Wholesale inquiry">Wholesale inquiry</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label htmlFor="message" className="block text-[10px] uppercase tracking-widest text-[#7A8EA6]">
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  required
                  rows={5}
                  placeholder="How can we help?"
                  className="mt-2 w-full border border-[#DDE3EB] bg-white px-4 py-3 text-sm text-[#1E2737] placeholder-[#B0BCCC] outline-none transition-colors focus:border-[#1E2737] resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-[#1E2737] py-4 text-[11px] uppercase tracking-[0.2em] text-white transition-colors hover:bg-[#1969B5]"
              >
                Send Message
              </button>
            </form>
          </FadeInSection>
        </div>
      </div>

      {/* Bottom divider strip */}
      <div className="border-t border-[#EBEBEB] bg-white px-6 py-10 lg:px-12">
        <div className="mx-auto max-w-screen-xl">
          <div className="grid gap-6 sm:grid-cols-3 text-center sm:text-left">
            <div>
              <p className="text-[10px] uppercase tracking-widest text-[#7A8EA6]">Delivery</p>
              <p className="mt-2 text-sm text-[#1E2737]">Dhaka 1–2 days · Nationwide 3–5 days</p>
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-widest text-[#7A8EA6]">Payment</p>
              <p className="mt-2 text-sm text-[#1E2737]">COD & bKash accepted</p>
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-widest text-[#7A8EA6]">Returns</p>
              <p className="mt-2 text-sm text-[#1E2737]">30-day hassle-free returns</p>
            </div>
          </div>
        </div>
      </div>

    </div>
  )
}
