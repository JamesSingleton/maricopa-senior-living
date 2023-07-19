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
      <div className="mx-auto max-w-7xl overflow-hidden px-6 py-20 sm:py-24 lg:px-8">
        <nav
          className="-mb-6 columns-2 sm:flex sm:justify-center sm:space-x-12"
          aria-label="Footer"
        >
          {menu.map((item) => (
            <div key={item._key} className="pb-6">
              {item.reference ? (
                <Link
                  href={item.reference.slug}
                  className="text-sm leading-6 text-zinc-600 hover:text-zinc-900"
                >
                  {item.reference.title}
                </Link>
              ) : (
                <a href={item.url} className="text-sm leading-6 text-zinc-600 hover:text-zinc-900">
                  {item.text}
                </a>
              )}
            </div>
          ))}
        </nav>
        <p className="mt-10 text-center text-xs leading-5 text-zinc-500">
          &copy; {new Date().getFullYear()} Maricopa Senior Living. All rights reserved.
        </p>
      </div>
    </footer>
  )
}
