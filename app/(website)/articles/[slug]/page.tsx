import Image from 'next/image'
import { CalendarIcon } from '@heroicons/react/24/outline'
import { format, parseISO } from 'date-fns'

import { getPostBySlug } from '@/lib/sanity.client'
import { urlForImage } from '@/lib/sanity.image'
import { CustomPortableText } from '@/components/CustomPortableText'

export default async function ArticlePage({ params: { slug } }: { params: { slug: string } }) {
  const post = await getPostBySlug(slug)
  console.log(post)
  return (
    <article className="rounded-md bg-white shadow">
      {/* {post.mainImage.asset ? (
        <Image
          src={urlForImage(post.mainImage).url()}
          alt=""
          width={992}
          height={420}
          className="mb-10 rounded-t-md object-cover"
        />
      ) : null} */}
      <div className="px-10 py-10">
        <div className="mb-6 mt-6 flex flex-wrap space-x-5 xl:space-x-10">
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
            <CalendarIcon className="h-5 w-5 text-neutral-500" />
            <span className="sr-only">Published on</span>{' '}
            <time dateTime={post.publishedAt}>
              {format(parseISO(post.publishedAt), 'LLL d, yyyy')}
            </time>
          </span>
        </div>
        <h1 className="lg:text-4xl">{post.title}</h1>
        <div className="prose mt-6 xl:prose-xl">
          <CustomPortableText value={post.body} />
        </div>
      </div>
    </article>
  )
}
