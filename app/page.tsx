import { Inter } from '@next/font/google'

import BlogCard from '@/components/BlogCard'
import { posts } from '@/lib/constants'
import { getAllPostsForHome } from '@/lib/api'

const inter = Inter({ subsets: ['latin'] })

export default async function Home() {
  const preview = false
  const allPosts = await getAllPostsForHome(preview)
  const { edges } = allPosts
  const heroPost = edges[0]?.node
  const morePosts = edges.slice(1)

  return (
    <div className="space-y-8">
      {posts.map((post) => (
        <BlogCard key={post.title} post={post} />
      ))}
    </div>
  )
}
