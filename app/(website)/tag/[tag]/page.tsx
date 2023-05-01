import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getTags, getTag } from '@/lib/api'
import BlogCard from '@/components/BlogCard'

export async function generateStaticParams() {
  const tags = await getTags()

  return tags.edges.map((edge: any) => ({
    tag: edge.node.slug,
  }))
}

async function getTagData(tag: string) {
  const res = await getTag(tag)

  return res
}

export async function generateMetadata({ params }: { params: { tag: string } }): Promise<Metadata> {
  const tag = await getTagData(params.tag)

  if (!tag) return notFound()

  return {
    title: `${tag.name}`,
    description: `${tag.description}`,
    openGraph: {
      title: `${tag.name}`,
      description: `${tag.description}`,
    },
  }
}

export default async function TagsPage({ params }: { params: { tag: string } }) {
  const tag = await getTagData(params.tag)
  if (!tag) return notFound()
  return (
    <div>
      <h1 className="inline-block align-middle text-4xl font-semibold capitalize sm:text-5xl md:text-6xl">
        {tag.name}
      </h1>
      <span className="mt-2 block text-neutral-700 sm:mt-4">{`${tag.posts.edges.length} ${
        tag.posts.edges.length === 1 ? 'Article' : 'Articles'
      }`}</span>
      <div className="pt-4">
        <div className="space-y-8">
          {tag.posts.edges.map((edge: any) => {
            if (edge.node.title !== '') {
              return <BlogCard key={edge.node.title} post={edge.node} />
            }
          })}
        </div>
      </div>
    </div>
  )
}
