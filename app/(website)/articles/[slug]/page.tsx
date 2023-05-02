import Image from 'next/image'
import Link from 'next/link'
import { CalendarIcon } from '@heroicons/react/24/outline'

import { getPostBySlug } from '@/lib/sanity.client'
import { urlForImage } from '@/lib/sanity.image'
import { CustomPortableText } from '@/components/CustomPortableText'
import Date from '@/components/Date'

export default async function ArticlePage({ params: { slug } }: { params: { slug: string } }) {
  const post = await getPostBySlug(slug)

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
            <CalendarIcon className="h-5 w-5 text-zinc-500" />
            <span className="sr-only">Published on</span> <Date dateString={post.publishedAt} />
          </span>
        </div>
        <h1 className="lg:text-4xl">{post.title}</h1>
        <div className="prose prose-lg prose-indigo">
          <CustomPortableText value={post.body} />
        </div>
        {post.tags && (
          <div className="mt-8 md:mt-14">
            <h2 className="pb-4 text-xl font-semibold">Tags</h2>
            {post.tags.map((tag) => (
              <Link
                href={`/tag/${tag.slug}`}
                key={tag._id}
                className="space-x-4 rounded bg-zinc-200 px-3 py-1 text-base transition-all duration-150 hover:bg-red-400 hover:text-white"
              >
                {tag.title}
              </Link>
            ))}
          </div>
        )}
      </div>
    </article>
  )
}
