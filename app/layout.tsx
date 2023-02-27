import './globals.css'

import { Inter } from 'next/font/google'

import Header from './Header'
import Footer from './Footer'
import RightSidebar from './RightSidebar'

const inter = Inter({ subsets: ['latin'] })

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`h-full bg-neutral-100 text-neutral-900 ${inter.className}`}>
      <head>
        <meta content="width=device-width, initial-scale=1" name="viewport" />
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body className="h-full text-lg font-medium">
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
