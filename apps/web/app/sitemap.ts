import { cachedSanityMetadata } from "@maricopa-senior-living/sanity/live";
import { querySitemap } from "@maricopa-senior-living/sanity/queries";
import type { MetadataRoute } from "next";

import { baseUrl } from "@/lib/constants";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const { data } = await cachedSanityMetadata({
    query: querySitemap,
    perspective: "published",
  });
  const entry = (path: string, lastModified?: string | null) => ({
    url: `${baseUrl}${path}`,
    ...(lastModified ? { lastModified } : {}),
  });
  const each = <T extends { _updatedAt?: string | null }>(
    items: T[] | null | undefined,
    path: (item: T) => string | null,
  ) =>
    (items ?? []).flatMap((item) => {
      const p = path(item);
      return p ? [entry(p, item._updatedAt)] : [];
    });

  return [
    entry("/"),
    entry("/resources"),
    entry("/events"),
    entry("/whats-new"),
    entry("/newsletter"),
    entry("/articles"),
    entry("/links"),
    entry("/about"),
    ...each(data?.pages, (p) => (p.slug ? `/${p.slug}` : null)),
    ...each(data?.topics, (t) => (t.slug ? `/topics/${t.slug}` : null)),
    ...each(data?.resources, (r) => (r.slug ? `/resources/${r.slug}` : null)),
    ...each(data?.articles, (a) => (a.slug ? `/articles/${a.slug}` : null)),
    ...each(data?.events, (e) => (e.slug ? `/events/${e.slug}` : null)),
    ...each(data?.months, (m) => (m.month ? `/whats-new/${m.month}` : null)),
    ...each(data?.newsletters, (n) =>
      n.month ? `/newsletter/${n.month}` : null,
    ),
    ...each(data?.writers, (w) => (w.slug ? `/writers/${w.slug}` : null)),
  ];
}
