import 'server-only'

import { client } from './sanity.client'

import type { QueryParams } from 'next-sanity'
import {
  allCategories,
  allPostSlugs,
  allTags,
  categoryBySlug,
  navigationQuery,
  pageBySlug,
  postBySlug,
  rightSidebarQuery,
  search,
  tagBySlug,
} from './sanity.queries'
import { GroupItem, RightSidebar } from '@/types/common'
import { Post } from '@/types/Post'

export const token = process.env.SANITY_API_READ_TOKEN

export async function sanityFetch<QueryResponse>({
  query,
  params = {},
  tags,
}: {
  query: string
  params?: QueryParams
  tags?: string[]
}) {
  return client.fetch<QueryResponse>(query, params, {
    next: {
      //revalidate: 30, // for simple, time-based revalidation
      tags, // for tag-based revalidation
    },
  })
}

export function getNavigation() {
  return sanityFetch<any>({
    query: navigationQuery,
    tags: ['navigation'],
  })
}

export function getRightSidebar() {
  return sanityFetch<RightSidebar>({
    query: rightSidebarQuery,
    tags: ['category', 'tag', 'post'],
  })
}

export function getCategoryBySlug(slug: string) {
  return sanityFetch<GroupItem>({
    query: categoryBySlug,
    params: { slug },
    tags: [`category:${slug}`],
  })
}

export function getCategories() {
  return client.fetch<string[]>(allCategories, {}, { token, perspective: 'published' })
}

export function getPageBySlug(slug: string) {
  return sanityFetch<any>({
    query: pageBySlug,
    params: { slug },
    tags: [`page:${slug}`],
  })
}

export function getPostBySlug(slug: string) {
  return sanityFetch<Post>({
    query: postBySlug,
    params: { slug },
    tags: [`post:${slug}`],
  })
}

export function getAllPostSlugs() {
  return client.fetch<string[]>(allPostSlugs, {}, { token, perspective: 'published' })
}

export function getTagBySlug(slug: string) {
  return sanityFetch<GroupItem>({
    query: tagBySlug,
    params: { slug },
    tags: [`tag:${slug}`],
  })
}

export function getTags() {
  return client.fetch<string[]>(allTags, {}, { token, perspective: 'published' })
}

export function getSearchResults(query: string) {
  return sanityFetch<any>({
    query: search,
    // @ts-ignore
    params: { query },
    tags: ['post', 'tag', 'category', 'service'],
  })
}

export function getHomePage() {
  return sanityFetch<any>({
    query: `*[_type == 'home'][0]`,
    tags: ['home'],
  })
}
