import Link from 'next/link'

interface FooterProps {
  _key: string
  url: string
  text: string
  reference: {
    _id: string
    _type: string
    slug: string
    title: string
  }
}

export default function Footer({ menu }: { menu: FooterProps[] }) {
  return (
    <footer className="bg-white">
      <div className="mx-auto max-w-7xl overflow-hidden px-6 py-10 sm:py-12 lg:px-8">
        <nav
          className="-mb-6 columns-2 sm:flex sm:justify-center sm:space-x-12"
          aria-label="Footer"
        >
          {menu.map((item) => (
            <div key={item._key} className="pb-6">
              {item.reference ? (
                <Link
                  href={item.reference.slug}
                  className="text-base leading-6 text-zinc-600 hover:text-zinc-900"
                >
                  {item.reference.title}
                </Link>
              ) : (
                <a href={item.url} className="text-base leading-6 text-zinc-600 hover:text-zinc-900">
                  {item.text}
                </a>
              )}
            </div>
          ))}
        </nav>
        <p className="mt-10 text-center text-sm leading-5 text-zinc-500">
          &copy; {new Date().getFullYear()} Maricopa Senior Living. All rights reserved. <a className="text-indigo-600 hover:text-indigo-700" target="_blank" rel="noopener" href="https://www.jamessingleton.me">Built and maintained by James Singleton</a>
        </p>
      </div>
    </footer>
  )
}
