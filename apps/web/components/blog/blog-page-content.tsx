import { BlogHeader } from './blog-header'

import type { Blog } from '@/types'
import type { QueryBlogIndexPageDataResult } from '@maricopa-senior-living/sanity/types'
import { SearchInput } from './blog-search'

type BlogPageContentProps = {
  indexPageData: NonNullable<QueryBlogIndexPageDataResult>
  blogs: Blog[]
  paginationMetadata: PaginationMetadata
}

export function BlogPageContent({
  indexPageData,
  blogs,
  paginationMetadata,
}: BlogPageContentProps) {
  const {
    title,
    description,
    pageBuilder = [],
    _id,
    _type,
    featuredBlogsCount,
    displayFeaturedBlogs,
  } = indexPageData

  const validFeaturedBlogsCount = featuredBlogsCount ? Number.parseInt(featuredBlogsCount, 10) : 0

  return (
    <main className="bg-background">
      <div className="container mx-auto my-16 px-4 md:px-6">
        <BlogHeader title={title} description={description} />
        <SearchInput
          className="mt-8 mb-12"
          onChange={setSearchQuery}
          onClear={() => setSearchQuery('')}
          placeholder="Search blogs..."
          value={searchQuery}
        />
      </div>
    </main>
  )
}
