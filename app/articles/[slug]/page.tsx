import Image from 'next/image'
import { CalendarIcon } from '@heroicons/react/24/outline'
import { getPostAndMorePosts } from '@/lib/api'

export default async function ArticlePage({ params: { slug } }: { params: { slug: string } }) {
  const preview = false
  const { post, posts } = await getPostAndMorePosts(slug, preview)
  const publishDate = new Date(post.date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
  return (
    <article className="rounded-md bg-white shadow">
      <Image
        src={post.featuredImage.node.sourceUrl}
        alt=""
        width={992}
        height={420}
        className="mb-10 rounded-t-md object-cover"
      />
      <div className="px-10 pb-10">
        <div className="mt-6 mb-6 flex flex-wrap space-x-5 xl:space-x-10">
          <span className="flex items-center space-x-2">
            <Image
              src={post.author.node.avatar.url}
              alt={post.author.node.name}
              width={24}
              height={24}
              className="h-6 w-6 rounded-full"
            />
            <span>{post.author.node.name}</span>
          </span>
          <span className="flex items-center space-x-2">
            <CalendarIcon className="h-5 w-5 text-neutral-500" />
            <span className="sr-only">Published on</span>{' '}
            <time dateTime={post.date}>{publishDate}</time>
          </span>
        </div>
        <h1 className="lg:text-4xl">{post.title}</h1>
        <div
          className="prose mt-6 xl:prose-xl"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />
      </div>
    </article>
  )
}
