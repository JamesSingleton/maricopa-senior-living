import { createClient } from 'next-sanity'

import { apiVersion, dataset, projectId, useCdn } from '@/lib/sanity.api'
import { allPosts, allCategories, categoryBySlug } from '@/lib/sanity.queries'
import type { Post } from '@/types/Post'

const sanityClient = (token?: string) => {
  return createClient({ projectId, dataset, apiVersion, token, useCdn })
}

export async function getPosts(): Promise<Post[]> {
  return await sanityClient().fetch(allPosts)
}

export async function getCategories(): Promise<any> {
  return await sanityClient().fetch(allCategories)
}

export async function getCategoryBySlug(slug: string): Promise<any> {
  return await sanityClient().fetch(categoryBySlug, { slug })
}
