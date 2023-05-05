import { getPosts } from '@/lib/sanity.client'
import ArticleCard from '@/components/ArticleCard'

import type { Metadata } from 'next'
import type { Post } from '@/types/Post'

export const metadata: Metadata = {
  alternates: {
    canonical: '/articles',
  },
}

export default async function Page() {
  const posts = await getPosts()
  return (
    <>
      <h1 className="inline-block align-middle text-4xl font-semibold capitalize sm:text-5xl md:text-6xl">
        Articles
      </h1>
      <section className="pt-9">
        {posts.length > 0 && posts.map((post: Post) => <ArticleCard key={post._id} post={post} />)}
      </section>
    </>
  )
}
