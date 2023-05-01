import 'tailwindcss/tailwind.css'

import { Inter, Roboto_Mono } from 'next/font/google'

import Header from '@/components/Header'
import Footer from '@/components/Footer'
import RightSidebar from '@/components/RightSidebar'
import { baseUrl } from '@/lib/constants'

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
  display: 'swap',
  subsets: ['latin'],
})

const roboto_mono = Roboto_Mono({
  variable: '--font-roboto-mono',
  display: 'swap',
  subsets: ['latin'],
})

export default function IndexLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${roboto_mono.variable}`}>
      <body className="bg-zinc-50 text-zinc-900 antialiased">
        <Header />
        <main className="py-16 md:py-20 lg:py-28 xl:py-32">
          <div className="container">
            <div className="grid grid-cols-12 gap-8">
              <div className="col-span-12 lg:col-span-8">{children}</div>
              <div className="col-span-12 lg:col-span-4">
                {/* @ts-expect-error Server Component */}
                <RightSidebar />
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </body>
    </html>
  )
}
