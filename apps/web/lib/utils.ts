import { env } from '@maricopa-senior-living/env/client'

const BLOG_ITEMS_PER_PAGE = 10

export const getBaseUrl = () => {
  if (env.NEXT_PUBLIC_VERCEL_ENV === 'production') {
    return env.NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL
  }

  if (env.NEXT_PUBLIC_VERCEL_ENV === 'preview') {
    return env.NEXT_PUBLIC_VERCEL_URL
  }

  return 'http://localhost:3000'
}

export function getBlogPaginationStartEnd(page: number): {
  start: number
  end: number
} {
  const start = (page - 1) * BLOG_ITEMS_PER_PAGE
  const end = start + BLOG_ITEMS_PER_PAGE
  return { start, end }
}

export function parseChildrenToSlug(children: PortableTextBlock['children']) {
  if (!children) {
    return ''
  }
  return convertToSlug(children.map((child) => child.text).join(''))
}
