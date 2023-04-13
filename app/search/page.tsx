import { search } from '@/lib/api'
import BlogCard from '@/components/BlogCard'

export default async function Page({ params, searchParams }: any) {
  const { q } = searchParams
  const results = await search(q)
  return (
    <>
      <h1 className="inline-block align-middle text-4xl font-semibold capitalize sm:text-5xl md:text-6xl">
        {`Search Results for "${q}"`}
      </h1>
      <div className="mt-8">
        {results.edges.map((result: any) => {
          if (result.node.featuredImage) {
            return <BlogCard key={result.node.title} post={result.node} />
          }
        })}
      </div>
    </>
  )
}
