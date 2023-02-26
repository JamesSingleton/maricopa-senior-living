import './globals.css'

import Header from './Header'
import Footer from './Footer'
import RightSidebar from './RightSidebar'
import { getTags } from '@/lib/api'

const pages = [
  { name: 'Projects', href: '#', current: false },
  { name: 'Project Nero', href: '#', current: true },
]

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const tags = await getTags()
  const { edges } = tags
  return (
    <html lang="en" className="h-full bg-neutral-100 text-neutral-900">
      <body className="h-full text-lg font-medium">
        <Header />
        <main className="py-16 md:py-20 lg:py-28 xl:py-32">
          <div className="container">
            <div className="grid grid-cols-12 gap-8">
              <div className="col-span-12 lg:col-span-8">{children}</div>
              <div className="col-span-12 lg:col-span-4">
                <RightSidebar tags={edges} />
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </body>
    </html>
  )
}
