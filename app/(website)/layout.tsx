import { Suspense } from 'react'
import Script from 'next/script'
import PlausibleProvider from 'next-plausible'

import Header from '@/components/Header'
import Footer from '@/components/Footer'
import RightSidebar from '@/components/RightSidebar'
import { baseUrl } from '@/lib/constants'
import { getMenu } from '@/lib/sanity.client'
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
  const menu = await getMenu()

  return (
    <>
      <Script src="https://cdn.userway.org/widget.js" data-account="qeA6uoRyx5" data-position="2" />
      <Suspense fallback={
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-zinc-900" />
        </div>
        
      }>
        <Header menu={menu} />
      </Suspense>
      <main className="py-8 md:py-10 lg:py-14 xl:py-16">
        <div className="container grid grid-cols-12 gap-8">
          <div className="col-span-12 lg:col-span-8">{children}</div>
          <div className="col-span-12 space-y-8 lg:col-span-4">
            <RightSidebar />
          </div>
        </div>
      </main>
      <Footer menu={menu.footer} />
      <ScrollToTop />
    </>
  )
}
