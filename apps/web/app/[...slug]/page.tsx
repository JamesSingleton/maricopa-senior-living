import { notFound } from 'next/navigation'
import { sanityFetch } from '@maricopa-senior-living/sanity/live'
import { querySlugPageData } from '@maricopa-senior-living/sanity/query'
import { PageBuilder } from '@/components/pagebuilder'

async function fetchSlugPageData(slug: string) {
  return await sanityFetch({
    query: querySlugPageData,
    params: { slug: `/${slug}` },
  })
}

export default async function SlugPage({ params }: { params: Promise<{ slug: string[] }> }) {
  const { slug } = await params
  const slugString = slug.join('/')
  const { data: pageData } = await fetchSlugPageData(slugString)

  if (!pageData) {
    notFound()
  }

  const { title, pageBuilder, _id, _type } = pageData ?? {}

  return !Array.isArray(pageBuilder) || pageBuilder?.length === 0 ? (
    <div className="flex min-h-[50vh] flex-col items-center justify-center p-4 text-center">
      <h1 className="mb-4 text-2xl font-semibold capitalize">{title}</h1>
      <p className="text-muted-foreground mb-6">This page has no content blocks yet.</p>
    </div>
  ) : (
    <PageBuilder id={_id} pageBuilder={pageBuilder} type={_type} />
  )
}
