import ArticleCard from '@/components/ArticleCard'
import { getPosts } from '@/lib/sanity.client'
import { baseUrl } from '@/lib/constants'

import type { Metadata } from 'next'
import type { Post } from '@/types/Post'

export const metadata: Metadata = {
  title: 'Maricopa Senior Living - Aging Well Your Way!',
  description: 'Your go to source for senior living in Maricopa, AZ',
  openGraph: {
    title: 'Maricopa Senior Living - Aging Well Your Way!',
    description: 'Your go to source for senior living in Maricopa, AZ',
    locale: 'en_US',
    url: baseUrl,
    siteName: 'Maricopa Senior Living',
    type: 'website',
  },
  alternates: {
    canonical: '/',
  },
}

export default async function Home() {
  const posts = await getPosts()

  return (
    <div className="space-y-8">
      {posts.map((post: Post) => (
        <ArticleCard post={post} key={post._id} />
      ))}
    </div>
  )
}
