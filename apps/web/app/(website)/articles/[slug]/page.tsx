import Link from 'next/link'
import { notFound } from 'next/navigation'
import { CalendarIcon } from '@heroicons/react/24/outline'

import { getPostBySlug, getAllPostSlugs } from '@/lib/sanity.fetch'
import { CustomPortableText } from '@/components/CustomPortableText'
import Date from '@/components/Date'
import BackButton from '@/components/BackButton'
import ImageComponent from '@/components/ImageComponent'
import { sanityFetch } from '@/lib/sanity/live'
import { client } from '@/lib/sanity/client'
import { queryArticleSlugPageData, queryArticlePaths } from '@/lib/sanity/query'

import type { Metadata } from 'next'
import type { Tag } from '@/lib/sanity/sanity.types'

async function fetchArticleSlugPageData(slug: string) {
  return await sanityFetch({
    query: queryArticleSlugPageData,
    params: { slug },
  })
}

async function fetchArticlePaths() {
  try {
    const slugs = await client.fetch(queryArticlePaths)

    if (!Array.isArray(slugs) || slugs.length === 0) {
      return []
    }
    return slugs.map((slug) => ({
      slug,
    }))
  } catch (error) {
    console.error('Error fetching article paths:', error)
    return []
  }
}

export async function generateStaticParams() {
  const paths = await fetchArticlePaths()

  return paths
}

// Allow dynamic params for paths not generated at build time
export const dynamicParams = true

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const post = await getPostBySlug(slug)

  if (!post) {
    return {}
  }

  return {
    title: `${post.title}`,
    description: `${post.excerpt}`,
    openGraph: {
      title: `${post.title}`,
      description: `${post.excerpt}`,
      type: 'article',
      tags: post.tags.map((tag) => tag.title),
      publishedTime: post.publishedAt,
      modifiedTime: post._updatedAt,
    },
  }
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const { data: post } = await fetchArticleSlugPageData(slug)

  if (!post) {
    notFound()
  }

  return (
    <>
      <BackButton />
      <article className="prose prose-lg prose-indigo mt-4 rounded-md bg-white shadow-sm lg:max-w-none">
        <div className="px-4 py-4 sm:px-10 sm:py-10">
          <div className="flex flex-wrap space-x-5 xl:space-x-10">
            <span className="flex items-center space-x-2">
              <ImageComponent
                image={post.author.image}
                alt={`Avatar of ${post.author.name}`}
                width={24}
                height={24}
                className="h-6 w-6 rounded-full"
              />
              <span>{post.author.name}</span>
            </span>
            <span className="flex items-center space-x-2">
              <CalendarIcon className="h-5 w-5 text-zinc-500" />
              <span className="sr-only">Published on</span> <Date dateString={post.publishedAt} />
            </span>
          </div>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            {post.title}
          </h1>
          {post.mainImage && (
            <div className="flex items-center justify-center">
              <ImageComponent
                image={post.mainImage}
                alt={post.mainImage.alt}
                width={1024}
                height={768}
                className="rounded-md"
              />
            </div>
          )}
          <CustomPortableText value={post.body} />
          {post.tags && (
            <div className="mt-8 md:mt-14">
              <h2 className="text-xl font-semibold">Tags</h2>
              <ul className="not-prose flex list-none items-center space-x-4 pl-0" role="list">
                {post.tags.map((tag: { _id: string; title: string; slug: string }) => (
                  <li key={tag._id}>
                    <Link
                      href={`/tag/${tag.slug}`}
                      prefetch={false}
                      className="rounded bg-zinc-200 px-3 py-1 text-base transition-all duration-150 hover:bg-red-400 hover:text-white"
                    >
                      {tag.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </article>
    </>
  )
}
