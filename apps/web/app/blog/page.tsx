import { notFound } from 'next/navigation'
import { sanityFetch } from '@maricopa-senior-living/sanity/live'
import {
  queryBlogIndexPageBlogs,
  queryBlogIndexPageBlogsCount,
  queryBlogIndexPageData,
} from '@maricopa-senior-living/sanity/query'

import { getBlogPaginationStartEnd } from '@/lib/utils'
import { BlogHeader } from '@/components/blog/blog-header'

async function fetchBlogIndexPageData() {
  const res = await sanityFetch({ query: queryBlogIndexPageData })
  return res.data
}

async function fetchBlogIndexPageBlogs(start: number, end: number) {
  const res = await sanityFetch({
    query: queryBlogIndexPageBlogs,
    params: { start, end },
  })
  return res.data
}

async function fetchBlogIndexPageBlogsCount() {
  const res = await sanityFetch({
    query: queryBlogIndexPageBlogsCount,
  })
  return res.data
}

type BlogPageProps = {
  searchParams: Promise<{
    page?: string
  }>
}

export default async function BlogIndexPage({ searchParams }: BlogPageProps) {
  const { page } = await searchParams
  const currentPage = page ? Number(page) : 1

  const [indexPageData, totalCount] = await Promise.all([
    fetchBlogIndexPageData(),
    fetchBlogIndexPageBlogsCount(),
  ])

  if (!indexPageData) {
    notFound()
  }

  const featuredBlogsCount = indexPageData.displayFeaturedBlogs
    ? Number(indexPageData.featuredBlogsCount) || 0
    : 0

  const { start, end } = getBlogPaginationStartEnd(currentPage)
  const blogStart = currentPage === 1 ? 0 : start + featuredBlogsCount
  const blogEnd = currentPage === 1 ? end + featuredBlogsCount : end + featuredBlogsCount

  const [blogs, errBlogs] = await fetchBlogIndexPageBlogs(blogStart, blogEnd)

  return (
    <div className="container mx-auto my-16 px-4 md:px-6">
      <BlogHeader title={indexPageData.title} description={indexPageData.description} />
    </div>
  )
}
