import '@maricopa-senior-living/ui/globals.css'
import { Geist, Geist_Mono } from 'next/font/google'
import { preconnect, prefetchDNS } from 'react-dom'
import Script from 'next/script'
import PlausibleProvider from 'next-plausible'
import { SanityLive } from '@maricopa-senior-living/sanity/live'

import RightSidebar from '@/components/RightSidebar'
import { getBaseUrl } from '@/lib/utils'
import { getNavigationData } from '@/lib/navigation'
import { Navbar } from '@/components/navbar'

import type { Metadata } from 'next'

const fontSans = Geist({
  subsets: ['latin'],
  variable: '--font-sans',
})

const fontMono = Geist_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
})

const baseUrl = getBaseUrl()

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl!),
  title: {
    template: '%s | Maricopa Senior Living',
    default: 'Maricopa Senior Living - Aging Well Your Way!',
  },
  openGraph: {
    type: 'website',
    title: {
      template: '%s | Maricopa Senior Living',
      default: 'Maricopa Senior Living - Aging Well Your Way!',
    },
  },
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  preconnect('https://cdn.sanity.io')
  prefetchDNS('https://cdn.sanity.io')
  const nav = await getNavigationData()
  return (
    <html lang="en" suppressHydrationWarning>
      <Script src="https://cdn.userway.org/widget.js" data-account="qeA6uoRyx5" data-position="2" />
      <body className={`${fontSans.variable} ${fontMono.variable} font-sans antialiased`}>
        <PlausibleProvider domain="maricopaseniorliving.org" trackFileDownloads trackOutboundLinks>
          <Navbar navbarData={nav.navbarData} settingsData={nav.settingsData} />
          <main className="py-8 md:py-10 lg:py-14 xl:py-16">
            <div className="container grid grid-cols-12 gap-8">
              <div className="col-span-12 lg:col-span-8">{children}</div>
              <div className="col-span-12 space-y-8 lg:col-span-4">
                <RightSidebar />
              </div>
            </div>
          </main>
          <SanityLive />
        </PlausibleProvider>
      </body>
    </html>
  )
}
