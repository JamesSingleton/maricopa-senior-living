import Image from 'next/image'
import { getPostAndMorePosts } from '@/lib/api'

export default async function ArticlePage({ params: { slug } }: { params: { slug: string } }) {
  const preview = false
  const { post, posts } = await getPostAndMorePosts(slug, preview)

  return (
    <article>
      <Image
        src={post.featuredImage.node.sourceUrl}
        alt=""
        width={750}
        height={420}
        className="mb-10 object-cover"
      />
      <div className="px-10 pb-10">
        <div className="mt-6 flex flex-wrap space-x-5 xl:space-x-10"></div>
        <h1 className="lg:text-4xl">{post.title}</h1>
        <div dangerouslySetInnerHTML={{ __html: post.content }} />
      </div>
    </article>
  )
}
