import type { Metadata } from 'next'
import { Nunito, Nunito_Sans } from 'next/font/google'
import './globals.css'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { siteConfig } from '@/lib/site-config'

// next/font self-hosts and optimizes the fonts, exposing them as CSS vars.
// Distinct names (--font-nunito / --font-nunito-sans) avoid clashing with the
// `--font-display` / `--font-body` Tailwind @theme tokens, which reference
// these vars (see globals.css) so utilities like `font-display` resolve them.
const nunito = Nunito({
  subsets: ['latin'],
  weight: ['600', '700', '800'],
  display: 'swap',
  variable: '--font-nunito',
})

const nunitoSans = Nunito_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  display: 'swap',
  variable: '--font-nunito-sans',
})

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: `${siteConfig.name} — ${siteConfig.description}`,
    template: `%s — ${siteConfig.name}`,
  },
  description: siteConfig.description,
  openGraph: {
    type: 'website',
    locale: siteConfig.locale,
    url: siteConfig.url,
    siteName: siteConfig.name,
    images: [{ url: siteConfig.ogImage, width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
}

const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'NGO',
  name: siteConfig.name,
  description: siteConfig.description,
  url: siteConfig.url,
  logo: `${siteConfig.url}/images/logo.png`,
  contactPoint: {
    '@type': 'ContactPoint',
    email: siteConfig.contact.email,
    telephone: siteConfig.contact.phone,
    contactType: 'customer service',
    areaServed: 'AR',
    availableLanguage: 'Spanish',
  },
  address: {
    '@type': 'PostalAddress',
    addressCountry: 'AR',
    addressLocality: siteConfig.contact.address,
  },
  sameAs: Object.values(siteConfig.social).filter(Boolean),
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es-AR" className={`${nunito.variable} ${nunitoSans.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationSchema),
          }}
        />
      </head>
      <body className="min-h-screen flex flex-col bg-white text-neutral-800 font-sans antialiased">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  )
}
