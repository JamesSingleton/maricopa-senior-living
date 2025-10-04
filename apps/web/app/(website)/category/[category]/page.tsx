import type { Metadata, ResolvingMetadata } from 'next'
import Image from 'next/image'
import { notFound } from 'next/navigation'

import { getCategoryBySlug } from '@/lib/sanity.fetch'
import { CustomPortableText } from '@/components/CustomPortableText'
import ArticleCard from '@/components/ArticleCard'
import DirectoryCard from '@/components/DirectoryCard'
import { baseUrl } from '@/lib/constants'

// export async function generateStaticParams() {
//   const categories = await getCategories()

//   return categories.map((category) => ({
//     category: category.slug,
//   }))
// }

export async function generateMetadata(
  {
    params,
  }: {
    params: Promise<{ category: string }>
  },
  parent: ResolvingMetadata,
): Promise<Metadata> {
  const { category: categoryParam } = await params
  const category = await getCategoryBySlug(categoryParam)
  const previousOpenGraph = (await parent)?.openGraph

  if (!category) {
    return {}
  }

  return {
    title: `${category.title}`,
    description: `${category.excerpt}`,
    openGraph: {
      ...previousOpenGraph,
      title: `${category.title}`,
      description: `${category.excerpt}`,
      url: `${baseUrl}/category/${category.slug}`,
    },
  }
}

export default async function CategoryPage({ params }: { params: Promise<{ category: string }> }) {
  const { category: categoryParam } = await params
  const category = await getCategoryBySlug(categoryParam)

  if (!category) {
    notFound()
  }

  return (
    <>
      <h1 className="inline-block align-middle text-4xl font-semibold capitalize sm:text-5xl md:text-6xl">
        {category.title}
      </h1>
      {category.description && (
        <CustomPortableText
          value={category.description}
          paragraphClasses="prose prose-lg prose-indigo text-sm font-medium text-zinc-500 sm:text-base md:text-lg lg:max-w-none pt-4"
        />
      )}
      <section className="space-y-8 pt-4">
        {category.combinedList.map((item: any) => {
          if (item._type === 'post') {
            return <ArticleCard key={item._id} post={item} />
          }
          return <DirectoryCard key={item._id} directoryItem={item} />
        })}
      </section>
    </>
  )
}
