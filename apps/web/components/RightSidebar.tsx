import Link from 'next/link'
import { ChevronRightIcon } from '@heroicons/react/20/solid'
import { EnvelopeIcon } from '@heroicons/react/24/outline'

import SearchBar from '@/components/SearchBar'
import { getRightSidebar } from '@/lib/sanity.fetch'
import Date from '@/components/Date'
import ImageComponent from './ImageComponent'
import { CustomPortableText } from './CustomPortableText'

const RightSidebar = async () => {
  const {
    highlightedCategories,
    highlightedTags,
    joansCorner,
    whatsNew,
    seniorCenterNewsletters,
    nonProfit,
  } = await getRightSidebar()

  return (
    <>
      <SearchBar />
      <div className="rounded-md bg-white p-8 shadow-lg">
        <h2 className="mb-8 text-lg font-bold lg:text-2xl">{nonProfit.title}</h2>
        <div className="prose prose-lg">
          <CustomPortableText value={nonProfit.description} />
        </div>
        <div>
          <Link
            href={`/category/${nonProfit.slug}`}
            prefetch={false}
            className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 focus-visible:outline-solid"
          >
            View More
          </Link>
        </div>
      </div>
      <div className="rounded-md bg-white p-8 shadow-lg">
        <h2 className="mb-8 text-lg font-bold lg:text-2xl">What&apos;s New!</h2>
        <div className="space-y-16">
          <article
            key={`${whatsNew._id}_right_sidebar`}
            className="flex max-w-xl flex-col items-start justify-between"
          >
            <Link href={`/articles/${whatsNew.slug}`} prefetch={false}>
              <div className="flex items-center gap-x-4 text-xs">
                <Date dateString={whatsNew.publishedAt} className="text-zinc-500" />
              </div>
              <div className="group relative">
                <h3 className="mt-3 text-lg leading-6 font-semibold text-zinc-900 group-hover:text-zinc-600">
                  {whatsNew.title}
                </h3>
                <p className="mt-5 line-clamp-3 text-sm leading-6 text-zinc-600">
                  {whatsNew.excerpt}
                </p>
              </div>
              <div className="relative mt-8 flex items-center gap-x-4">
                <ImageComponent
                  image={whatsNew.author.image}
                  alt={`${whatsNew.author.name} avatar`}
                  className="h-10 w-10 rounded-full bg-zinc-50"
                  width={40}
                  height={40}
                />
                <div className="text-sm leading-6">
                  <p className="font-semibold text-zinc-900">{whatsNew.author.name}</p>
                </div>
              </div>
            </Link>
          </article>
        </div>
      </div>
      <div className="rounded-md bg-white p-8 shadow-lg">
        <h2 className="mb-8 text-lg font-bold lg:text-2xl">Joan&apos;s Corner</h2>
        <div className="space-y-16">
          <article
            key={`${joansCorner._id}_right_sidebar`}
            className="flex max-w-xl flex-col items-start justify-between"
          >
            <Link href={`/articles/${joansCorner.slug}`} prefetch={false}>
              <div className="flex items-center gap-x-4 text-xs">
                <Date dateString={joansCorner.publishedAt} className="text-zinc-500" />
              </div>
              <div className="group relative">
                <h3 className="mt-3 text-lg leading-6 font-semibold text-zinc-900 group-hover:text-zinc-600">
                  {joansCorner.title}
                </h3>
                <p className="mt-5 line-clamp-3 text-sm leading-6 text-zinc-600">
                  {joansCorner.excerpt}
                </p>
              </div>
              <div className="relative mt-8 flex items-center gap-x-4">
                <ImageComponent
                  image={joansCorner.author.image}
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
      <div className="rounded-md bg-white p-8 shadow-lg">
        <h2 className="mb-8 text-lg font-bold lg:text-2xl">
          Community/Senior Center Calendar and Newsletters
        </h2>
        <div className="divide-y divide-zinc-200">
          {seniorCenterNewsletters.map((newsletter: any) => (
            <article
              key={newsletter._id}
              className="flex max-w-xl flex-col items-start justify-between py-5"
            >
              <Link href={`/articles/${newsletter.slug}`} prefetch={false}>
                <div className="flex items-center gap-x-4 text-xs">
                  <Date dateString={newsletter.publishedAt} className="text-zinc-500" />
                </div>
                <div className="group relative">
                  <h3 className="mt-3 text-lg leading-6 font-semibold text-zinc-900 group-hover:text-zinc-600">
                    {newsletter.title}
                  </h3>
                  <p className="mt-5 line-clamp-3 text-sm leading-6 text-zinc-600">
                    {newsletter.excerpt}
                  </p>
                </div>
              </Link>
            </article>
          ))}
        </div>
      </div>
      <div className="rounded-md bg-white p-8 shadow-lg">
        <h2 className="mb-8 text-xl font-bold lg:text-2xl">Categories</h2>
        <ul className="space-y-4">
          {highlightedCategories.map((category: any) => (
            <li key={category._id} className="block">
              <Link
                href={`/category/${category.slug}`}
                className="flex justify-between rounded-sm bg-zinc-200 px-5 py-4 transition-all duration-150 hover:bg-red-400 hover:text-white"
                prefetch={false}
              >
                <span className="text-lg font-medium">{`${category.title} (${category.count})`}</span>
                <ChevronRightIcon className="h-6 w-6" />
              </Link>
            </li>
          ))}
        </ul>
      </div>
      <div className="rounded-md bg-white p-8 shadow-lg">
        <h2 className="mb-8 text-lg font-bold lg:text-2xl">Tags</h2>
        <ul className="flex flex-wrap">
          {highlightedTags &&
            highlightedTags.map((tag: any) => (
              <li className="mr-2 pb-2" key={tag._id}>
                <Link
                  title={tag.title}
                  href={`/tag/${tag.slug}`}
                  className="space-x-4 rounded-sm bg-zinc-200 px-3 py-1 text-base transition-all duration-150 hover:bg-red-400 hover:text-white"
                  prefetch={false}
                >
                  {tag.title}
                </Link>
              </li>
            ))}
        </ul>
      </div>
      <div className="rounded-md bg-white p-8 shadow-lg">
        <h2 className="mb-8 text-lg font-bold lg:text-2xl">Please Share Your Feedback</h2>
        <div className="space-y-4 text-center">
          <a
            href="mailto:ron@maricopaseniorliving.org"
            className="inline-flex items-center gap-x-2 rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 focus-visible:outline-solid"
          >
            <EnvelopeIcon className="-ml-0.5 h-5 w-5" aria-hidden="true" />
            Email Us!
          </a>
          <p>This site is owned and managed by Ron Smith</p>
        </div>
      </div>
    </>
  )
}

export default RightSidebar
