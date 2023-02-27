import type { Metadata } from 'next'

import BlogCard from '@/components/BlogCard'
import { getAllPostsForHome } from '@/lib/api'

export const metadata: Metadata = {
  title: 'Maricopa Senior Living - Aging Well Your Way!',
  description: 'Your go to source for senior living in Maricopa, AZ',
  openGraph: {
    title: 'Maricopa Senior Living - Aging Well Your Way!',
    description: 'Your go to source for senior living in Maricopa, AZ',
    locale: 'en_US',
    url: 'https://www.maricopaseniorliving.org',
    siteName: 'Maricopa Senior Living',
    type: 'website',
  },
}

export default async function Home() {
  const preview = false
  const allPosts = await getAllPostsForHome(preview)
  const { edges } = allPosts

  return (
    <div className="space-y-8">
      {edges.map((edge: any) => {
        if (edge.node.title !== '') {
          return <BlogCard key={edge.node.title} post={edge.node} />
        }
      })}
    </div>
  )
}
