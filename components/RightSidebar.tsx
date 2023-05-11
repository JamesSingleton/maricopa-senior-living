import Image from 'next/image'
import Link from 'next/link'
import { ChevronRightIcon } from '@heroicons/react/20/solid'

import SearchBar from '@/components/SearchBar'
import { getPopularCategories, getJoansCorner, getPopularTags } from '@/lib/sanity.client'
import { urlForImage } from '@/lib/sanity.image'
import Date from '@/components/Date'

const RightSidebar = async () => {
  const tags = await getPopularTags()
  const categories = await getPopularCategories()
  const joansCorner = await getJoansCorner()

  return (
    <>
      <SearchBar />
      <div className="rounded-md bg-white p-8 shadow-lg">
        <h2 className="mb-8 text-xl font-bold lg:text-2xl">Popular Categories</h2>
        <ul className="space-y-4">
          {categories.map((category: any) => (
            <li key={category._id} className="block">
              <Link
                href={`/category/${category.slug}`}
                className="flex justify-between rounded bg-zinc-200 px-5 py-4 transition-all duration-150 hover:bg-red-400 hover:text-white"
              >
                <span className="text-lg font-medium">{`${category.title} (${category.count})`}</span>
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
            tags.map((tag: any) => (
              <li className="mr-2 pb-2" key={tag._id}>
                <Link
                  title={tag.title}
                  href={`/tag/${tag.slug}`}
                  className="space-x-4 rounded bg-zinc-200 px-3 py-1 text-base transition-all duration-150 hover:bg-red-400 hover:text-white"
                >
                  {tag.title}
                </Link>
              </li>
            ))}
        </ul>
      </div>
      <div className="rounded-md bg-white p-8 shadow-lg">
        <h2 className="mb-8 text-lg font-bold lg:text-2xl">Joan&apos;s Corner</h2>
        <div className="space-y-16">
          <article
            key={`${joansCorner._id}_right_sidebar`}
            className="flex max-w-xl flex-col items-start justify-between"
          >
            <Link href={`/articles/${joansCorner.slug}`}>
              <div className="flex items-center gap-x-4 text-xs">
                <Date dateString={joansCorner.publishedAt} className="text-zinc-500" />
              </div>
              <div className="group relative">
                <h3 className="mt-3 text-lg font-semibold leading-6 text-zinc-900 group-hover:text-zinc-600">
                  {joansCorner.title}
                </h3>
                <p className="mt-5 line-clamp-3 text-sm leading-6 text-zinc-600">
                  {joansCorner.excerpt}
                </p>
              </div>
              <div className="relative mt-8 flex items-center gap-x-4">
                <Image
                  src={urlForImage(joansCorner.author.image).url()}
                  alt={`${joansCorner.author.name} avatar`}
                  className="h-10 w-10 rounded-full bg-zinc-50"
                  width={40}
                  height={40}
                />
                <div className="text-sm leading-6">
                  <p className="font-semibold text-zinc-900">{joansCorner.author.name}</p>
                </div>
              </div>
            </Link>
          </article>
        </div>
      </div>
    </>
  )
}

export default RightSidebar
