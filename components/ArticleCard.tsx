import Link from 'next/link'
import Image from 'next/image'
import { format, parseISO } from 'date-fns'

import { urlForImage } from '@/lib/sanity.image'

import type { Post } from '@/types/Post'

export default function ArticleCard({ post }: { post: Post }) {
  return (
    <article className="flex flex-col rounded-lg shadow-lg hover:shadow-xl">
      <Link
        href={`/articles/${post.slug}`}
        className="flex flex-col justify-start rounded-lg bg-white p-6"
      >
        {post.categories.map((category: any) => (
          <span key={category.title} className="pb-4 text-sm font-bold uppercase text-blue-700">
            {category.title}
          </span>
        ))}
        <h2 className="text-3xl font-bold hover:text-zinc-700">{post.title}</h2>
        <p className="py-6">{post.excerpt}</p>
        <div className="flex items-center">
          <div className="shrink-0">
            <Image
              className="h-10 w-10 rounded-full object-cover"
              src={urlForImage(post.author.image).url()}
              alt={post.author.name}
              width={40}
              height={40}
            />
          </div>
          <div className="ml-3">
            <p className="text-sm font-medium text-zinc-900">{post.author.name}</p>
            <div className="flex space-x-1 text-sm text-zinc-500">
              <time dateTime={post.publishedAt} suppressHydrationWarning>
                {format(parseISO(post.publishedAt), 'LLL d, yyyy')}
              </time>
            </div>
          </div>
        </div>
      </Link>
    </article>
  )
}
