import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { CalendarIcon } from '@heroicons/react/24/outline'

import { getPostBySlug, getAllPostSlugs } from '@/lib/sanity.fetch'
import { urlForImage } from '@/lib/sanity.image'
import { CustomPortableText } from '@/components/CustomPortableText'
import Date from '@/components/Date'
import BackButton from '@/components/BackButton'

import type { Metadata } from 'next'

export async function generateStaticParams() {
  const slugs = await getAllPostSlugs()

  return slugs.map((slug) => ({
    slug,
  }))
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string }
}): Promise<Metadata> {
  const post = await getPostBySlug(params.slug)

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

export default async function ArticlePage({ params: { slug } }: { params: { slug: string } }) {
  const post = await getPostBySlug(slug)

  if (!post) {
    notFound()
  }

  return (
    <>
      <BackButton />
      <article className="prose prose-lg prose-indigo mt-4 rounded-md bg-white shadow lg:max-w-none">
        <div className="px-4 py-4 sm:px-10 sm:py-10">
          <div className="flex flex-wrap space-x-5 xl:space-x-10">
            <span className="flex items-center space-x-2">
              <Image
                src={urlForImage(post.author.image).url()}
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
          <CustomPortableText value={post.body} />
          {post.tags && (
            <div className="mt-8 md:mt-14">
              <h2 className="text-xl font-semibold">Tags</h2>
              <ul className="not-prose flex list-none items-center space-x-4 pl-0" role="list">
                {post.tags.map((tag) => (
                  <li key={tag._id}>
                    <Link
                      href={`/tag/${tag.slug}`}
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
