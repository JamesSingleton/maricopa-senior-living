import { sanityFetchMetadata } from "@maricopa-senior-living/sanity/live";
import {
  queryAllPageSlugs,
  queryArticlePaths,
  queryCategoryPaths,
  queryTagPaths,
} from "@maricopa-senior-living/sanity/queries";
import type { MetadataRoute } from "next";

import { baseUrl } from "@/lib/constants";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [
    { data: pageSlugs },
    { data: articleSlugs },
    { data: categoryPaths },
    { data: tagPaths },
  ] = await Promise.all([
    sanityFetchMetadata({
      query: queryAllPageSlugs,
      perspective: "published",
    }),
    sanityFetchMetadata({
      query: queryArticlePaths,
      perspective: "published",
    }),
    sanityFetchMetadata({
      query: queryCategoryPaths,
      perspective: "published",
    }),
    sanityFetchMetadata({
      query: queryTagPaths,
      perspective: "published",
    }),
  ]);

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: baseUrl, lastModified: new Date() },
    { url: `${baseUrl}/search`, lastModified: new Date() },
  ];

  const pages =
    pageSlugs?.map((page) => ({
      url: `${baseUrl}/${page.slug}`,
      lastModified: new Date(),
    })) ?? [];

  const articles =
    articleSlugs?.map((slug) => ({
      url: `${baseUrl}/articles/${slug}`,
      lastModified: new Date(),
    })) ?? [];

  const categories =
    categoryPaths?.map((entry) => ({
      url: `${baseUrl}/category/${entry.category}`,
      lastModified: new Date(),
    })) ?? [];

  const tags =
    tagPaths?.map((entry) => ({
      url: `${baseUrl}/tag/${entry.tag}`,
      lastModified: new Date(),
    })) ?? [];

  return [...staticRoutes, ...pages, ...articles, ...categories, ...tags];
}
