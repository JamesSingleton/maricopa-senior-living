import { notFound } from 'next/navigation'

import { getPageBySlug } from '@/lib/sanity.client'
import { CustomPortableText } from '@/components/CustomPortableText'

export default async function Page({ params }: { params: { slug: string } }) {
  const { slug } = params
  const pageData = await getPageBySlug(slug)

  if (!pageData) {
    notFound()
  }

  return (
    <>
      <h1 className="inline-block align-middle text-4xl font-semibold capitalize sm:text-5xl md:text-6xl">
        {pageData.title}
      </h1>
      <section className="pt-4">
        <CustomPortableText
          value={pageData.body}
          paragraphClasses="prose prose-lg prose-indigo text-sm font-medium text-zinc-500 sm:text-base md:text-lg lg:max-w-none pt-4"
        />
      </section>
    </>
  )
}
