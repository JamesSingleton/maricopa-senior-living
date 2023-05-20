import 'tailwindcss/tailwind.css'

import { Inter, Roboto_Mono } from 'next/font/google'

import Header from '@/components/Header'
import Footer from '@/components/Footer'
import RightSidebar from '@/components/RightSidebar'
import { baseUrl } from '@/lib/constants'
import { getMenu } from '@/lib/sanity.client'
import ScrollToTop from '@/components/ScrollToTop'

export const revalidate = 300 // revlidate this page every 5 minutes

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

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
})

const roboto_mono = Roboto_Mono({
  variable: '--font-roboto-mono',
  subsets: ['latin'],
})

export default async function IndexLayout({ children }: { children: React.ReactNode }) {
  const menu = await getMenu()

  return (
    <html lang="en" className={`${inter.variable} ${roboto_mono.variable}`}>
      <body className="bg-zinc-50 text-zinc-900 antialiased">
        <Header menu={menu} />
        <main className="py-8 md:py-10 lg:py-14 xl:py-16">
          <div className="container grid grid-cols-12 gap-8">
            <div className="col-span-12 lg:col-span-8">{children}</div>
            <div className="col-span-12 space-y-8 lg:col-span-4">
              {/* @ts-expect-error Server Component */}
              <RightSidebar />
            </div>
          </div>
        </main>
        <Footer menu={menu.footer} />
        <ScrollToTop />
      </body>
    </html>
  )
}
