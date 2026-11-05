import { cachedSanityMetadata } from "@maricopa-senior-living/sanity/live";
import { querySitemap } from "@maricopa-senior-living/sanity/queries";
import type { MetadataRoute } from "next";

import { baseUrl } from "@/lib/constants";

type Entry = { slug: string | null; _updatedAt: string };

/**
 * Public URLs with their real last-edit dates. Archived posts and empty
 * tags/categories are left out; search results are not indexable pages.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const { data } = await cachedSanityMetadata({
    query: querySitemap,
    perspective: "published",
  });

  const toEntries = (entries: Entry[] | undefined, prefix: string) =>
    (entries ?? [])
      .filter((entry): entry is Entry & { slug: string } => Boolean(entry.slug))
      .map((entry) => ({
        url: `${baseUrl}${prefix}/${entry.slug.replace(/^\//, "")}`,
        lastModified: entry._updatedAt,
      }));

  return [
    { url: baseUrl },
    ...toEntries(data?.pages, ""),
    ...toEntries(data?.articles, "/articles"),
    ...toEntries(data?.categories, "/category"),
    ...toEntries(data?.tags, "/tag"),
  ];
}
