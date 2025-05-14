import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="mt-12 border-t">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-wrap justify-between">
          <div className="mb-6 w-full md:mb-0 md:w-1/3">
            <h2 className="mb-4 text-lg font-semibold">Maricopa Senior Living</h2>
            <p className="text-sm">
              A comprehensive resource for seniors in Maricopa, Arizona. Providing information and
              support to help you age your way!
            </p>
          </div>
          <div className="mb-6 w-full md:mb-0 md:w-1/3">
            <h2 className="mb-4 text-lg font-semibold">Quick Links</h2>
            <ul className="text-sm">
              <li className="mb-2">
                <Link href="/resources" className="hover:text-primary">
                  Resources
                </Link>
              </li>
              <li className="mb-2">
                <Link href="/events" className="hover:text-primary">
                  Events
                </Link>
              </li>
              <li className="mb-2">
                <Link href="/articles" className="hover:text-primary">
                  Articles
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-primary">
                  Contact
                </Link>
              </li>
            </ul>
          </div>
          <div className="w-full md:w-1/3">
            <h2 className="mb-4 text-lg font-semibold">Contact Us</h2>
            <div className="text-sm not-italic">
              <Link href="mailto:ron@maricopaseniorliving.org" className="hover:text-primary">
                ron@maricopaseniorliving.org
              </Link>
            </div>
          </div>
        </div>
        <div className="mt-8 border-t pt-8 text-center text-sm">
          <p>&copy; {new Date().getFullYear()} Maricopa Senior Living. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
