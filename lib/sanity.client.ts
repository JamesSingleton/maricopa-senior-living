import { createClient } from 'next-sanity'

import { apiVersion, dataset, projectId, useCdn } from '@/lib/sanity.api'
import {
  allPosts,
  allCategories,
  categoryBySlug,
  postBySlug,
  popularCategories,
  search,
  joansCorner,
  popularTags,
  allTags,
  tagBySlug,
} from '@/lib/sanity.queries'
import type { Post } from '@/types/Post'
import type { GroupItem, TitleAndSlug, PopularItems } from '@/types/common'

const sanityClient = (token?: string) => {
  return createClient({ projectId, dataset, apiVersion, token, useCdn })
}

export async function getPosts(): Promise<Post[]> {
  return await sanityClient().fetch(allPosts)
}

export async function getCategories(): Promise<TitleAndSlug[]> {
  return await sanityClient().fetch(allCategories)
}

export async function getCategoryBySlug(slug: string): Promise<GroupItem> {
  return await sanityClient().fetch(categoryBySlug, { slug })
}

export async function getPostBySlug(slug: string): Promise<Post> {
  return await sanityClient().fetch(postBySlug, { slug })
}

export async function getPopularCategories(): Promise<PopularItems[]> {
  return await sanityClient().fetch(popularCategories)
}

export async function getTags(): Promise<TitleAndSlug[]> {
  return await sanityClient().fetch(allTags)
}

export async function getTagBySlug(slug: string): Promise<GroupItem> {
  return await sanityClient().fetch(tagBySlug, { slug })
}

export async function getPopularTags(): Promise<PopularItems[]> {
  return await sanityClient().fetch(popularTags)
}

export async function getSearchResults(query: string): Promise<any> {
  return await sanityClient().fetch(search, { query })
}

export async function getJoansCorner(): Promise<any> {
  return await sanityClient().fetch(joansCorner)
}
