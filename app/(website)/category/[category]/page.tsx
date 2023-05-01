import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import { getCategoryBySlug } from '@/lib/sanity.client'
import { CustomPortableText } from '@/components/CustomPortableText'
import ArticleCard from '@/components/ArticleCard'

export async function generateMetadata({
  params,
}: {
  params: { category: string }
}): Promise<Metadata> {
  const category = await getCategoryBySlug(params.category)

  if (!category) return notFound()

  return {
    title: `${category.title}`,
    description: `${category.excerpt}`,
    openGraph: {
      title: `${category.title}`,
      description: `${category.excerpt}`,
    },
  }
}

export default async function CategoryPage({ params }: { params: { category: string } }) {
  const category = await getCategoryBySlug(params.category)

  if (!category) return notFound()
  return (
    <>
      <h1 className="inline-block align-middle text-4xl font-semibold capitalize sm:text-5xl md:text-6xl">
        {category.title}
      </h1>
      <CustomPortableText
        value={category.description}
        paragraphClasses="prose prose-lg prose-indigo text-sm font-medium text-zinc-500 sm:text-base md:text-lg lg:max-w-none pt-4"
      />
      <section className="space-y-8 pt-4">
        {category.content.length > 0 &&
          category.content.map((item: any) => {
            if (item._type === 'service') {
              return (
                <div key={item._id} className="overflow-hidden bg-white shadow sm:rounded-lg">
                  <div className="px-4 py-6 sm:px-6">
                    <h3 className="text-base font-semibold leading-7 text-gray-900">
                      {item.title}
                    </h3>
                    <p className="mt-1 max-w-2xl text-sm leading-6 text-gray-500">
                      {item.description}
                    </p>
                  </div>
                  <div className="border-t border-gray-100">
                    <dl className="divide-y divide-gray-100">
                      {item.audience && (
                        <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                          <dt className="text-sm font-medium text-gray-900">
                            Audience/Eligibility
                          </dt>
                          <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                            {item.audience}
                          </dd>
                        </div>
                      )}
                      <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                        <dt className="text-sm font-medium text-gray-900">Website</dt>
                        <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                          {item.website ? (
                            <a
                              href={item.website}
                              target="_blank"
                              className="text-indigo-600 hover:text-indigo-500"
                              rel="noreferrer noopener"
                            >
                              {item.website}
                            </a>
                          ) : (
                            'N/A'
                          )}
                        </dd>
                      </div>
                      <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                        <dt className="text-sm font-medium text-gray-900">Phone</dt>
                        <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                          <a
                            href={`tel:${item.phone}`}
                            className="text-indigo-600 hover:text-indigo-500"
                          >
                            {item.phone}
                          </a>
                        </dd>
                      </div>
                      <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                        <dt className="text-sm font-medium text-gray-900">Location</dt>
                        <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                          {item.address}
                        </dd>
                      </div>
                      <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                        <dt className="text-sm font-medium text-gray-900">Notes</dt>
                        <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                          {item.notes}
                        </dd>
                      </div>
                    </dl>
                  </div>
                </div>
              )
            } else if (item._type === 'post') {
              return <ArticleCard post={item} key={item._id} />
            }
          })}
      </section>
    </>
  )
}
