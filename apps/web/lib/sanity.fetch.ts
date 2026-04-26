import "server-only";

import type { QueryParams } from "next-sanity";

import type { CategoryPage, GroupItem } from "@/types/common";
import type { Post } from "@/types/Post";
import { client } from "./sanity.client";
import {
  allCategories,
  allPostSlugs,
  allTags,
  categoryBySlug,
  navigationQuery,
  pageBySlug,
  postBySlug,
  search,
  tagBySlug,
} from "./sanity.queries";

export const token = process.env.SANITY_API_READ_TOKEN;

export async function sanityFetch<QueryResponse>({
  query,
  params = {},
  tags,
}: {
  query: string;
  params?: QueryParams;
  tags?: string[];
}) {
  return client.fetch<QueryResponse>(query, params, {
    next: {
      tags,
    },
  });
}

export function getNavigation() {
  return sanityFetch<any>({
    query: navigationQuery,
    tags: ["navigation"],
  });
}

export function getCategoryBySlug(slug: string) {
  return sanityFetch<CategoryPage>({
    query: categoryBySlug,
    params: { slug },
    tags: [`category:${slug}`],
  });
}

export function getCategories() {
  return client.fetch<string[]>(
    allCategories,
    {},
    { token, perspective: "published" },
  );
}

export function getAllPostSlugs() {
  return client.fetch<string[]>(
    allPostSlugs,
    {},
    { token, perspective: "published" },
  );
}

export function getTagBySlug(slug: string) {
  return sanityFetch<GroupItem>({
    query: tagBySlug,
    params: { slug },
    tags: [`tag:${slug}`],
  });
}

export function getTags() {
  return client.fetch<string[]>(
    allTags,
    {},
    { token, perspective: "published" },
  );
}

export function getSearchResults(query: string) {
  return sanityFetch<any>({
    query: search,
    // @ts-expect-error
    params: { query },
    tags: ["post", "tag", "category", "service"],
  });
}
