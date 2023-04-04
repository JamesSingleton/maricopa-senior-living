import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getCategories, getCategory } from '@/lib/api'

export async function generateStaticParams() {
  const categories = await getCategories()

  return categories.edges.map((edge: any) => ({
    category: edge.node.slug,
  }))
}

async function getCategoryData(category: string) {
  const res = await getCategory(category)

  return res
}

export async function generateMetadata({
  params,
}: {
  params: { category: string }
}): Promise<Metadata> {
  const category = await getCategoryData(params.category)

  if (!category) return notFound()

  return {
    title: `${category.name}`,
    description: `${category.description}`,
    openGraph: {
      title: `${category.name}`,
      description: `${category.description}`,
    },
  }
}

export default async function CategoryPage({ params }: { params: { category: string } }) {
  const category = await getCategoryData(params.category)
  if (!category) return notFound()
  return (
    <>
      <h1 className="inline-block align-middle text-4xl font-semibold capitalize sm:text-5xl md:text-6xl">
        {category.name}
      </h1>
      <span className="mt-2 block text-neutral-700 sm:mt-4">{`${category.posts.edges.length} Articles`}</span>
    </>
  )
}
