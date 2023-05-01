import Image from 'next/image'
import Link from 'next/link'
import { ChevronRightIcon } from '@heroicons/react/20/solid'

import { getPopularTags } from '@/lib/api'
import SearchBar from '@/components/SearchBar'
import { getPopularCategories } from '@/lib/sanity.client'

const RightSidebar = async () => {
  const tags = await getPopularTags()
  const categories = await getPopularCategories()

  return (
    <div className="space-y-7">
      <SearchBar />
      <div className="rounded-md bg-white p-8 shadow-lg">
        <h2 className="mb-8 text-xl font-bold lg:text-2xl">Popular Categories</h2>
        <ul className="space-y-4">
          {categories.map((category: any) => (
            <li key={category._id} className="block">
              <Link
                href={`/category/${category.slug}`}
                className="flex justify-between rounded bg-neutral-200 px-5 py-4 transition-all duration-150 hover:bg-red-400 hover:text-white"
              >
                <span className="text-lg font-medium">{category.title}</span>
                <ChevronRightIcon className="h-6 w-6" />
              </Link>
            </li>
          ))}
        </ul>
      </div>
      <div className="rounded-md bg-white p-8 shadow-lg">
        <h2 className="mb-8 text-lg font-bold lg:text-2xl">Popular Tags</h2>
        <ul className="flex flex-wrap">
          {tags &&
            tags.edges.map((tag: any) => (
              <li className="mr-2 pb-2" key={tag.node.name}>
                <Link
                  title={tag.node.name}
                  href={`/tag/${tag.node.slug}`}
                  className="space-x-4 rounded bg-neutral-200 px-3 py-1 text-base transition-all duration-150 hover:bg-red-400 hover:text-white"
                >
                  {tag.node.name}
                </Link>
              </li>
            ))}
        </ul>
      </div>
      <div className="rounded-md bg-white p-8 shadow-lg">
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
                  className="mb-1 line-clamp-2 font-semibold text-neutral-900"
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
                  className="mb-1 line-clamp-2 font-semibold text-neutral-900"
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
