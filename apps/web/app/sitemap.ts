import type { MetadataRoute } from "next";

import {
  sanityFetchMetadata,
} from "@maricopa-senior-living/sanity/live";
import { querySitemapEntries } from "@maricopa-senior-living/sanity/queries";

import { baseUrl } from "@/lib/constants";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const { data } = await sanityFetchMetadata({
    query: querySitemapEntries,
    perspective: "published",
  });

  const entries = data as {
    resources?: { slug: string; _updatedAt: string }[];
    articles?: { slug: string; _updatedAt: string }[];
    guides?: { slug: string; _updatedAt: string }[];
    pages?: { slug: string; _updatedAt: string }[];
    categories?: { slug: string; _updatedAt: string }[];
    tags?: { slug: string; _updatedAt: string }[];
  } | null;

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: baseUrl, lastModified: new Date() },
    { url: `${baseUrl}/resources`, lastModified: new Date() },
    { url: `${baseUrl}/articles`, lastModified: new Date() },
    { url: `${baseUrl}/guides`, lastModified: new Date() },
  ];

  const dynamicRoutes: MetadataRoute.Sitemap = [
    ...(entries?.resources ?? []).map((r) => ({
      url: `${baseUrl}/resources/${r.slug}`,
      lastModified: new Date(r._updatedAt),
    })),
    ...(entries?.articles ?? []).map((a) => ({
      url: `${baseUrl}/articles/${a.slug}`,
      lastModified: new Date(a._updatedAt),
    })),
    ...(entries?.guides ?? []).map((g) => ({
      url: `${baseUrl}/guides/${g.slug}`,
      lastModified: new Date(g._updatedAt),
    })),
    ...(entries?.pages ?? []).map((p) => ({
      url: `${baseUrl}/${p.slug}`,
      lastModified: new Date(p._updatedAt),
    })),
    ...(entries?.categories ?? []).map((c) => ({
      url: `${baseUrl}/category/${c.slug}`,
      lastModified: new Date(c._updatedAt),
    })),
    ...(entries?.tags ?? []).map((t) => ({
      url: `${baseUrl}/tags/${t.slug}`,
      lastModified: new Date(t._updatedAt),
    })),
  ];

  return [...staticRoutes, ...dynamicRoutes];
}
