'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { HomeIcon } from '@heroicons/react/20/solid'

interface Breadcrumb {
  name: string
  href?: string
}

export default function Breadcrumbs({ breadcrumbs }: { breadcrumbs: Breadcrumb[] }) {
  const pathname = usePathname()
  return (
    <nav className="flex" aria-label="Breadcrumb">
      <ol role="list" className="flex items-center space-x-4">
        <li>
          <div>
            <Link href="/" className="text-gray-400 hover:text-gray-500">
              <HomeIcon className="h-5 w-5 flex-shrink-0" aria-hidden="true" />
              <span className="sr-only">Home</span>
            </Link>
          </div>
        </li>
        {breadcrumbs.map((breadcrumb) => (
          <li key={breadcrumb.name}>
            <div className="flex items-center">
              <svg
                className="h-5 w-5 flex-shrink-0 text-gray-300"
                fill="currentColor"
                viewBox="0 0 20 20"
                aria-hidden="true"
              >
                <path d="M5.555 17.776l8-16 .894.448-8 16-.894-.448z" />
              </svg>
              {breadcrumb.href ? (
                <Link
                  href={breadcrumb.href}
                  className="ml-4 text-sm font-medium capitalize text-gray-500 hover:text-gray-700"
                  aria-current={breadcrumb.href === pathname ? 'page' : undefined}
                >
                  {breadcrumb.name.replace(/-/g, ' ')}
                </Link>
              ) : (
                <span className="ml-4 text-sm font-medium text-gray-500 hover:text-gray-700">
                  {breadcrumb.name.replace(/-/g, ' ')}
                </span>
              )}
            </div>
          </li>
        ))}
      </ol>
    </nav>
  )
}
