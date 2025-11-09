import '@maricopa-senior-living/ui/globals.css'
import { Geist, Geist_Mono } from 'next/font/google'
import Script from 'next/script'
import { preconnect } from 'react-dom'

import { Providers } from '@/components/providers'
import { baseUrl } from '@/lib/constants'

import type { Metadata } from 'next'
import { getNavigationData } from '@/lib/navigation'

const fontSans = Geist({
  subsets: ['latin'],
  variable: '--font-sans',
})

const fontMono = Geist_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
})

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
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
  const nav = await getNavigationData()
  console.log(nav)
  return (
    <html lang="en" suppressHydrationWarning>
      <Script src="https://cdn.userway.org/widget.js" data-account="qeA6uoRyx5" data-position="2" />
      <body className={`${fontSans.variable} ${fontMono.variable} font-sans antialiased`}>
        <Providers>
          <main className="py-8 md:py-10 lg:py-14 xl:py-16">
            <div className="gap8 container grid grid-cols-12">
              <div className="col-span-12 lg:col-span-8">{children}</div>
              <div className="col-span-12 space-y-8 lg:col-span-4">Right Sidebar</div>
            </div>
          </main>
        </Providers>
      </body>
    </html>
  )
}
