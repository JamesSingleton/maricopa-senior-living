import { getSearchResults } from '@/lib/sanity.client'
import ArticleCard from '@/components/ArticleCard'
import DirectoryCard from '@/components/DirectoryCard'

export default async function Page({ params, searchParams }: any) {
  const { q } = searchParams
  const results = await getSearchResults(q)

  return (
    <>
      <h1 className="inline-block align-middle text-4xl font-semibold capitalize sm:text-5xl md:text-6xl">
        {`Search Results for "${q}"`}
      </h1>
      <div className="mt-8"></div>
    </>
  )
}
