import Image from 'next/image'
import Link from 'next/link'
import { ChevronRightIcon, MagnifyingGlassIcon } from '@heroicons/react/20/solid'

import { categories } from '@/lib/constants'

const RightSidebar = ({ tags }: { tags: any }) => {
  return (
    <div className="space-y-7">
      <div className="relative flex items-center rounded-md bg-white py-1 pl-3 shadow">
        <div className="flex flex-1 items-center justify-center px-2 py-4">
          <div className="w-full max-w-lg lg:max-w-xs">
            <label htmlFor="search" className="sr-only">
              Search
            </label>
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
              </div>
              <input
                id="search"
                name="search"
                className="block w-full rounded-md border border-gray-300 bg-white py-2 pl-10 pr-3 leading-5 placeholder-gray-500 focus:border-indigo-500 focus:placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:text-sm"
                placeholder="Search"
                type="search"
              />
            </div>
          </div>
        </div>
      </div>
      <div className="rounded-md bg-white p-8">
        <h2 className="mb-8 text-xl font-bold lg:text-2xl">Categories</h2>
        <ul className="space-y-4">
          {categories.map(({ name, href }) => (
            <li key={name} className="block">
              <Link
                href={href}
                className="flex justify-between rounded bg-neutral-200 py-4 px-5 transition-all duration-150 hover:bg-red-400 hover:text-white"
              >
                <span>{name}</span>
                <ChevronRightIcon className="h-6 w-6" />
              </Link>
            </li>
          ))}
        </ul>
      </div>
      <div className="rounded-md bg-white p-8">
        <h2 className="mb-8 text-lg font-bold lg:text-2xl">Popular Tags</h2>
        <ul className="flex flex-wrap">
          {tags &&
            tags.map((tag: any) => (
              <li className="mr-2 pb-2" key={tag.node.name}>
                <Link
                  title={tag.node.name}
                  href={`/tag/${tag.node.slug}`}
                  className="rounded bg-neutral-200 px-3 py-1 text-base transition-all duration-150 hover:bg-red-400 hover:text-white"
                >
                  {tag.node.name}
                </Link>
              </li>
            ))}
        </ul>
      </div>
      <div className="rounded-md bg-white p-8">
        <h2 className="mb-8 text-lg font-bold lg:text-2xl">Joan&apos;s Corner</h2>
        <ul className="divide-y divide-red-400">
          <li className="py-10 first:pt-0 last:pb-0">
            <Link
              className="flex space-x-4"
              href="#"
              title="Read more about Geriatric Massage: The Best Therapy For Elderly"
            >
              <div className="flex-none">
                <Image
                  alt=""
                  className="h-20 w-20 rounded object-cover"
                  height={80}
                  src="https://bestwpware.com/html/tf/edumim/assets/images/all-img/rc-1.png"
                  width={80}
                />
              </div>
              <div className="flex-1">
                <h3
                  className="mb-1 font-semibold text-neutral-900 line-clamp-2"
                  title="Geriatric Massage: The Best Therapy For Elderly"
                >
                  Geriatric Massage: The Best Therapy For Elderly
                </h3>
              </div>
            </Link>
          </li>
          <li className="py-10 first:pt-0 last:pb-0">
            <Link
              className="flex space-x-4"
              href="#"
              title="Read more about Geriatric Massage: The Best Therapy For Elderly"
            >
              <div className="flex-none">
                <Image
                  alt=""
                  className="h-20 w-20 rounded object-cover"
                  height={80}
                  src="https://bestwpware.com/html/tf/edumim/assets/images/all-img/rc-1.png"
                  width={80}
                />
              </div>
              <div className="flex-1">
                <h3
                  className="mb-1 font-semibold text-neutral-900 line-clamp-2"
                  title="Geriatric Massage: The Best Therapy For Elderly"
                >
                  Geriatric Massage: The Best Therapy For Elderly
                </h3>
              </div>
            </Link>
          </li>
        </ul>
      </div>
    </div>
  )
}

export default RightSidebar
