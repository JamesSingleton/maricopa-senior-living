import { getSearchResults } from '@/lib/sanity.fetch'
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
      <section className="space-y-8 pt-4">
        {results.length > 0 &&
          results.map((result: any) => {
            if (result._type === 'post') {
              return <ArticleCard key={result._id} post={result} />
            } else if (result._type === 'service') {
              return <DirectoryCard key={result._id} directoryItem={result} />
            }
          })}
      </section>
    </>
  )
}
