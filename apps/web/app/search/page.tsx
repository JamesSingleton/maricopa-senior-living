import {
  type DynamicFetchOptions,
  getDynamicFetchOptions,
  sanityFetch,
  sanityFetchMetadata,
} from "@maricopa-senior-living/sanity/live";
import { buildMetadata } from "@maricopa-senior-living/sanity/metadata";
import { querySearch, querySiteSettings } from "@maricopa-senior-living/sanity/queries";
import type { Metadata } from "next";
import { Suspense } from "react";

import { ArticleCard } from "@/components/ArticleCard";
import { GuideCard } from "@/components/GuideCard";
import { ResourceCard } from "@/components/ResourceCard";
import { searchParamsCache } from "@/lib/search-params";

export async function generateMetadata(): Promise<Metadata> {
  const { data: settings } = await sanityFetchMetadata({
    query: querySiteSettings,
    perspective: "published",
  });
  return buildMetadata({
    fallbackTitle: "Search",
    fallbackDescription: "Search resources, guides, and articles.",
    path: "/search",
    siteTitle: (settings as { title?: string })?.title,
    seo: { noIndex: true },
  });
}

export default function SearchPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  return (
    <Suspense fallback={<SearchFallback />}>
      <DynamicSearch searchParams={searchParams} />
    </Suspense>
  );
}

async function DynamicSearch({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const [resolved, { perspective, stega }] = await Promise.all([
    searchParams,
    getDynamicFetchOptions(),
  ]);
  const { q } = searchParamsCache.parse(resolved);
  return <CachedSearch query={q} perspective={perspective} stega={stega} />;
}

async function CachedSearch({
  query,
  perspective,
  stega,
}: { query: string } & DynamicFetchOptions) {
  "use cache";
  const term = query.trim();
  const { data: results } = await sanityFetch({
    query: querySearch,
    params: { term: term || "*" },
    perspective,
    stega,
  });
  const items = (results ?? []) as { _type: string; _id: string }[];

  return (
    <>
      <h1 className="font-serif text-3xl font-semibold tracking-tight md:text-4xl">
        {term ? `Results for “${term}”` : "Search"}
      </h1>
      {!term ? (
        <p className="mt-3 text-muted-foreground">
          Use the search box in the sidebar to find resources, guides, and
          articles.
        </p>
      ) : null}
      <section className="mt-8 space-y-6">
        {items.length === 0 && term ? (
          <p className="text-muted-foreground">
            No results found. Try a different term or browse by category.
          </p>
        ) : null}
        {items.map((item) => {
          if (item._type === "article") {
            return <ArticleCard key={item._id} article={item} />;
          }
          if (item._type === "resource") {
            return <ResourceCard key={item._id} resource={item} />;
          }
          if (item._type === "guide") {
            return <GuideCard key={item._id} guide={item} />;
          }
          return null;
        })}
      </section>
    </>
  );
}

function SearchFallback() {
  return <div className="h-48 animate-pulse rounded-xl bg-muted" aria-busy />;
}
