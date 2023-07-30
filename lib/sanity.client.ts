import { createClient } from 'next-sanity'

import { apiVersion, dataset, projectId, useCdn } from '@/lib/sanity.api'
import {
  allPosts,
  allCategories,
  categoryBySlug,
  postBySlug,
  search,
  allTags,
  tagBySlug,
  menu,
  pageBySlug,
  allPostSlugs,
  rightSidebarQuery,
} from '@/lib/sanity.queries'
import type { Post } from '@/types/Post'
import type { GroupItem, TitleAndSlug, PopularItems, RightSidebar } from '@/types/common'

export const sanityClient = (token?: string) => {
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

export async function getAllPostSlugs(): Promise<TitleAndSlug[]> {
  return await sanityClient().fetch(allPostSlugs)
}

export async function getTags(): Promise<TitleAndSlug[]> {
  return await sanityClient().fetch(allTags)
}

export async function getTagBySlug(slug: string): Promise<GroupItem> {
  return await sanityClient().fetch(tagBySlug, { slug })
}

export async function getSearchResults(query: string): Promise<any> {
  return await sanityClient().fetch(search, { query })
}

export async function getMenu(): Promise<any> {
  return await sanityClient().fetch(menu)
}

export async function getPageBySlug(slug: string): Promise<any> {
  return await sanityClient().fetch(pageBySlug, { slug })
}

export async function getRightSidebar(): Promise<RightSidebar> {
  return await sanityClient().fetch(rightSidebarQuery)
}