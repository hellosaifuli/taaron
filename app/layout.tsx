import { Inter } from "next/font/google";
import { ReactNode } from "react";
import { Toaster } from "sonner";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/next";
import Script from "next/script";
import LuxuryNav from "@/components/luxury-nav";
import SiteFooter from "@/components/site-footer";
import { CartProvider } from "@/components/cart-provider";
import "./globals.css";

const GA_ID = "G-9EQ378LQFZ";
const FB_PIXEL_ID = "1350892813744212";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const baseUrl = process.env.VERCEL_PROJECT_PRODUCTION_URL
  ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
  : "http://localhost:3000";

export const viewport = {
  width: "device-width",
  initialScale: 1,
};

export const metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: "Taaron — Premium Leather Goods | Everyday Elegance",
    template: "%s | Taaron",
  },
  description:
    "Taaron crafts premium leather wallets, bags, and belts in Bangladesh. Artisanal craftsmanship, minimalist design, modern luxury. COD & bKash available.",
  keywords: [
    "leather goods Bangladesh",
    "premium leather wallet",
    "leather bag Bangladesh",
    "leather belt",
    "artisanal leather",
    "taaron",
    "তারুণ",
    "luxury leather Bangladesh",
    "handmade leather wallet",
    "leather cardholder",
    "ladies leather bag",
    "minimalist wallet",
    "bkash payment leather",
    "cash on delivery leather Bangladesh",
  ],
  authors: [{ name: "Taaron", url: baseUrl }],
  creator: "Taaron",
  publisher: "Taaron",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: baseUrl,
    siteName: "Taaron",
    title: "Taaron — Premium Leather Goods | Everyday Elegance",
    description:
      "Premium leather wallets, bags, and belts. Artisanal craftsmanship meets minimalist design. COD & bKash available in Bangladesh.",
    images: [
      {
        url: `${baseUrl}/og-image.png`,
        width: 1200,
        height: 630,
        alt: "Taaron — Premium Leather Goods",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Taaron — Premium Leather Goods",
    description:
      "Artisanal leather wallets, bags, and belts. Modern luxury without the heavy price tag.",
    images: [`${baseUrl}/og-image.png`],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: { canonical: baseUrl },
  icons: {
    icon: "/favicon.png",
    shortcut: "/favicon.png",
    apple: "/favicon.png",
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en-BD" className={inter.variable}>
      <body
        className="bg-[#F7F4EF] text-[#111111] selection:bg-[#9B6F47]/15"
        style={{ fontFamily: "var(--font-sans), system-ui, sans-serif" }}
      >
        <CartProvider>
          <LuxuryNav />
          <main className="pb-24 lg:pb-0">{children}</main>
          <SiteFooter />
        </CartProvider>
        <Toaster closeButton position="bottom-right" />
        <SpeedInsights />
        <Analytics />
        {/* Google Analytics */}
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_ID}');
          `}
        </Script>
        {/* Meta Pixel */}
        <Script id="fb-pixel" strategy="afterInteractive">
          {`
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', '${FB_PIXEL_ID}');
            fbq('track', 'PageView');
          `}
        </Script>
        <noscript>
          {`<img height="1" width="1" style="display:none" src="https://www.facebook.com/tr?id=${FB_PIXEL_ID}&ev=PageView&noscript=1"/>`}
        </noscript>
      </body>
    </html>
  );
}
