import { Suspense } from 'react'
import Script from 'next/script'

import Header from '@/components/site-header'
import Footer from '@/components/site-footer'
import Sidebar from '@/components/sidebar'
import { Providers } from '@/components/providers'
import { baseUrl } from '@/lib/constants'
import { getNavigation } from '@/lib/sanity.fetch'
import ScrollToTop from '@/components/ScrollToTop'

export const metadata = {
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

export default async function IndexLayout({ children }: { children: React.ReactNode }) {
  const navigation = await getNavigation()

  return (
    <Providers>
      <Script src="https://cdn.userway.org/widget.js" data-account="qeA6uoRyx5" data-position="2" />
      <Suspense fallback={null}>
        <Header menu={navigation.headerPrimary} />
      </Suspense>
      <div className="container mx-auto flex-grow px-4 py-6">
        <div className="flex flex-col gap-8 lg:flex-row">
          <main className="flex-1">{children}</main>
          <Sidebar className="w-full lg:w-96" />
        </div>
      </div>
      <Footer />

      <ScrollToTop />
    </Providers>
  )
}
