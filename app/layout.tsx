import './globals.css'

import { HomeIcon } from '@heroicons/react/20/solid'

import Header from './Header'
import Footer from './Footer'
import RightSidebar from './RightSidebar'

const pages = [
  { name: 'Projects', href: '#', current: false },
  { name: 'Project Nero', href: '#', current: true },
]

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full bg-neutral-100 text-neutral-900">
      {/*
        <head /> will contain the components returned by the nearest parent
        head.tsx. Find out more at https://beta.nextjs.org/docs/api-reference/file-conventions/head
      */}
      <head />
      <body className="h-full text-lg font-medium">
        <Header />
        <main className="py-16 md:py-20 lg:py-28 xl:py-32">
          <div className="container">
            <div className="grid grid-cols-12 gap-8">
              <div className="col-span-12 lg:col-span-8">{children}</div>
              <div className="col-span-12 lg:col-span-4">
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
