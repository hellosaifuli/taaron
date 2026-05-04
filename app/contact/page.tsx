import { Metadata } from "next";
import Script from "next/script";
import FadeInSection from "@/components/fade-in-section";

const baseUrl = process.env.VERCEL_PROJECT_PRODUCTION_URL
  ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
  : "http://localhost:3000";

export const metadata: Metadata = {
  title: "Contact Us",
  description:
    "Get in touch with Taaron. We're here to help with orders, product questions, and anything else. Respond within one business day.",
  alternates: { canonical: `${baseUrl}/contact` },
  openGraph: {
    title: "Contact Us",
    description:
      "Questions about an order or product? Reach us via WhatsApp, email, or the contact form. We respond within one business day.",
    url: `${baseUrl}/contact`,
    siteName: "Taaron",
    images: [
      {
        url: `${baseUrl}/taaron-logo.png`,
        width: 1200,
        height: 630,
        alt: "Taaron — Premium Leather Goods",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Contact Us",
    description:
      "Get in touch with Taaron. We respond within one business day.",
    images: [`${baseUrl}/taaron-logo.png`],
  },
};

const localBusinessSchema = {
  "@context": "https://schema.org",
  "@type": "ClothingStore",
  name: "Taaron",
  description:
    "Premium leather wallets, bags, and belts crafted in Bangladesh.",
  url: "https://taaron.store",
  telephone: "+8801648817191",
  email: "taaron.store@gmail.com",
  address: {
    "@type": "PostalAddress",
    addressLocality: "Dhaka",
    addressCountry: "BD",
  },
  openingHours: "Mo-Fr 10:00-19:00",
  contactPoint: {
    "@type": "ContactPoint",
    telephone: "+8801648817191",
    contactType: "customer service",
    areaServed: "BD",
    availableLanguage: ["English", "Bengali"],
  },
  sameAs: [
    "https://www.facebook.com/taaron.store",
    "https://www.instagram.com/taaron.store",
  ],
};

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-[#F7F4EF] text-[#111111]">
      <Script
        id="local-business-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(localBusinessSchema),
        }}
      />

      {/* Banner header */}
      <div
        className="relative flex flex-col justify-end overflow-hidden px-6 pb-10 pt-12 lg:px-16 lg:pb-12 lg:pt-20"
        style={{
          background:
            "linear-gradient(135deg, #F0EDE7 0%, #E2D9CC 50%, #D4BFA0 100%)",
          minHeight: "28vh",
        }}
      >
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage:
              "radial-gradient(circle at 70% 50%, #F7F4EF 0%, transparent 60%)",
          }}
        />
        <div className="relative max-w-screen-xl mx-auto w-full">
          <p className="text-[10px] uppercase tracking-[0.4em] text-[#9B6F47]">
            Support
          </p>
          <h1
            className="mt-2 text-[#111111]"
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(2.4rem, 5vw, 4.5rem)",
              lineHeight: "1.05",
              letterSpacing: "-0.01em",
              fontWeight: 400,
            }}
          >
            Get in Touch
          </h1>
          <p className="mt-3 max-w-md text-sm leading-relaxed text-[#5C5652]">
            Questions about an order, a product, or anything else — we respond
            within one business day.
          </p>
        </div>
      </div>

      {/* Content grid */}
      <div className="mx-auto max-w-screen-xl px-6 py-16 lg:px-16 lg:py-20">
        <div className="grid gap-16 lg:grid-cols-[1fr_1.6fr]">
          {/* Info column */}
          <FadeInSection>
            <div className="divide-y divide-[#E5DFD6]">
              <a
                href="https://wa.me/8801648817191"
                target="_blank"
                rel="noopener noreferrer"
                className="group block py-7 transition-colors first:pt-0"
              >
                <p className="text-[10px] uppercase tracking-widest text-[#9E9690]">
                  WhatsApp / Phone
                </p>
                <p
                  className="mt-2 text-xl font-medium text-[#111111] transition-colors group-hover:text-[#9B6F47]"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  +880 1648-817191
                </p>
                <p className="mt-1 text-xs text-[#9E9690]">
                  Sun – Thu, 10am – 7pm BST
                </p>
              </a>

              <a
                href="mailto:taaron.store@gmail.com"
                className="group block py-7 transition-colors"
              >
                <p className="text-[10px] uppercase tracking-widest text-[#9E9690]">
                  Email
                </p>
                <p
                  className="mt-2 text-xl font-medium text-[#111111] transition-colors group-hover:text-[#9B6F47]"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  taaron.store@gmail.com
                </p>
                <p className="mt-1 text-xs text-[#9E9690]">
                  Response within 1 business day
                </p>
              </a>

              <div className="py-7">
                <p className="text-[10px] uppercase tracking-widest text-[#9E9690]">
                  Location
                </p>
                <p className="mt-2 text-sm leading-relaxed text-[#111111]">
                  Dhaka, Bangladesh
                </p>
                <p className="mt-1 text-xs text-[#9E9690]">
                  COD & bKash available nationwide
                </p>
              </div>

              <div className="py-7">
                <p className="mb-4 text-[10px] uppercase tracking-widest text-[#9E9690]">
                  Follow Us
                </p>
                <div className="flex gap-5">
                  <a
                    href="https://www.facebook.com/taaron.store"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Facebook"
                    className="text-[#9E9690] transition-colors hover:text-[#9B6F47]"
                  >
                    <svg
                      className="h-5 w-5"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                    </svg>
                  </a>
                  <a
                    href="https://www.instagram.com/taaron.store"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Instagram"
                    className="text-[#9E9690] transition-colors hover:text-[#9B6F47]"
                  >
                    <svg
                      className="h-5 w-5"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          </FadeInSection>

          {/* Form */}
          <FadeInSection delay={100}>
            <form
              action="https://formsubmit.co/taaron.store@gmail.com"
              method="POST"
              className="space-y-6"
            >
              <input
                type="hidden"
                name="_subject"
                value="New contact from Taaron website"
              />
              <input type="hidden" name="_captcha" value="false" />
              <input type="hidden" name="_template" value="table" />

              <div className="grid gap-6 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="name"
                    className="block text-[10px] uppercase tracking-widest text-[#5C5652]"
                  >
                    Name
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    required
                    placeholder="Your name"
                    className="mt-2 w-full border-0 border-b border-[#B8AFA5] bg-transparent py-3 text-sm text-[#111111] placeholder-[#B8AFA5] outline-none transition-colors focus:border-[#9B6F47]"
                  />
                </div>
                <div>
                  <label
                    htmlFor="phone"
                    className="block text-[10px] uppercase tracking-widest text-[#5C5652]"
                  >
                    Phone / WhatsApp
                  </label>
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    placeholder="01XXXXXXXXX"
                    className="mt-2 w-full border-0 border-b border-[#B8AFA5] bg-transparent py-3 text-sm text-[#111111] placeholder-[#B8AFA5] outline-none transition-colors focus:border-[#9B6F47]"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="block text-[10px] uppercase tracking-widest text-[#5C5652]"
                >
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  placeholder="you@example.com"
                  className="mt-2 w-full border-0 border-b border-[#B8AFA5] bg-transparent py-3 text-sm text-[#111111] placeholder-[#B8AFA5] outline-none transition-colors focus:border-[#9B6F47]"
                />
              </div>

              <div>
                <label
                  htmlFor="subject"
                  className="block text-[10px] uppercase tracking-widest text-[#5C5652]"
                >
                  Subject
                </label>
                <select
                  id="subject"
                  name="subject"
                  className="mt-2 w-full border-0 border-b border-[#B8AFA5] bg-transparent py-3 text-sm text-[#111111] outline-none transition-colors focus:border-[#9B6F47]"
                >
                  <option value="Order inquiry">Order inquiry</option>
                  <option value="Product question">Product question</option>
                  <option value="Return / Exchange">Return / Exchange</option>
                  <option value="Wholesale inquiry">Wholesale inquiry</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label
                  htmlFor="message"
                  className="block text-[10px] uppercase tracking-widest text-[#5C5652]"
                >
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  required
                  rows={5}
                  placeholder="How can we help?"
                  className="mt-2 w-full resize-none border-0 border-b border-[#B8AFA5] bg-transparent py-3 text-sm text-[#111111] placeholder-[#B8AFA5] outline-none transition-colors focus:border-[#9B6F47]"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="rounded-sm bg-[#111111] px-12 py-4 text-[11px] uppercase tracking-[0.25em] text-white transition-colors duration-300 hover:bg-[#9B6F47]"
                >
                  Send Message
                </button>
              </div>
            </form>
          </FadeInSection>
        </div>
      </div>
    </div>
  );
}
