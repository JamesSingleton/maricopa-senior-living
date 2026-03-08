import { ChevronRightIcon } from '@heroicons/react/20/solid'
import { CurrencyDollarIcon, EnvelopeIcon } from '@heroicons/react/24/outline'
import Link from 'next/link'
import Date from '@/components/Date'
import SearchBar from '@/components/SearchBar'
import { sanityFetch } from '@/lib/sanity/live'
import { highlightedCategories, highlightedTags } from '@/lib/sanity/query'
import { getRightSidebar } from '@/lib/sanity.fetch'
import { CustomPortableText } from './CustomPortableText'
import ImageComponent from './ImageComponent'

async function fetchHighlightedCategories() {
  return await sanityFetch({
    query: highlightedCategories,
  })
}

async function fetchHighlightedTags() {
  return await sanityFetch({
    query: highlightedTags,
  })
}

const RightSidebar = async () => {
  const { data: highlightedCategories } = await fetchHighlightedCategories()
  const { data: highlightedTags } = await fetchHighlightedTags()
  const { whatsNew, seniorCenterNewsletters, nonProfit } = await getRightSidebar()

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
        <h2 className="mb-8 text-lg font-bold lg:text-2xl">Community/Senior Center Calendar</h2>
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
        <h2 className="mb-8 text-lg font-bold lg:text-2xl">Support & Feedback</h2>
        <div className="space-y-4 space-x-4 text-center">
          <Link
            href="https://www.paypal.com/donate?hosted_button_id=VDPMC329ZC5ZE"
            className="inline-flex items-center gap-x-2 rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 focus-visible:outline-solid"
            target="_blank"
            rel="noopener noreferrer"
          >
            <CurrencyDollarIcon className="-ml-0.5 h-5 w-5" aria-hidden="true" />
            Donate
          </Link>
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
