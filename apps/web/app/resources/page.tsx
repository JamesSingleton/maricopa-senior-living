import {
  type DynamicFetchOptions,
  getDynamicFetchOptions,
  sanityFetch,
  sanityFetchMetadata,
} from "@maricopa-senior-living/sanity/live";
import { buildMetadata } from "@maricopa-senior-living/sanity/metadata";
import {
  queryAllCategories,
  queryAllTags,
  queryResourcesCount,
  queryResourcesIndex,
  querySiteSettings,
} from "@maricopa-senior-living/sanity/queries";
import type { Metadata } from "next";
import { permanentRedirect } from "next/navigation";
import { Suspense } from "react";

import {
  ResourcesFilterBar,
  ResourcesGrid,
} from "@/components/ResourcesFilter";
import { PAGE_SIZE, searchParamsCache } from "@/lib/search-params";
import { LinkButton } from "@/components/LinkButton";

export async function generateMetadata(): Promise<Metadata> {
  const { data: settings } = await sanityFetchMetadata({
    query: querySiteSettings,
    perspective: "published",
  });
  return buildMetadata({
    fallbackTitle: "Local Resources",
    fallbackDescription:
      "Browse senior services and organizations in Maricopa, Arizona.",
    path: "/resources",
    siteTitle: (settings as { title?: string })?.title,
  });
}

export default function ResourcesPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  return (
    <Suspense fallback={<ResourcesFallback />}>
      <DynamicResources searchParams={searchParams} />
    </Suspense>
  );
}

async function DynamicResources({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const [resolved, { perspective, stega }] = await Promise.all([
    searchParams,
    getDynamicFetchOptions(),
  ]);
  const { categories, tags, page } = searchParamsCache.parse(resolved);

  if (categories.length === 1 && tags.length === 0 && page === 1) {
    permanentRedirect(`/category/${categories[0]!}`);
  }

  return (
    <CachedResources
      category={categories[0] ?? ""}
      tag={tags[0] ?? ""}
      page={page}
      perspective={perspective}
      stega={stega}
    />
  );
}

async function CachedResources({
  category,
  tag,
  page,
  perspective,
  stega,
}: { category: string; tag: string; page: number } & DynamicFetchOptions) {
  "use cache";
  const start = (page - 1) * PAGE_SIZE;
  const end = start + PAGE_SIZE;
  const categoryFilter = category || undefined;
  const tagFilter = tag || undefined;
  const [{ data: resources }, { data: total }, { data: categories }, { data: tags }] =
    await Promise.all([
      sanityFetch({
        query: queryResourcesIndex,
        // @ts-expect-error typegen narrows optional GROQ params too strictly
        params: { category: categoryFilter, tag: tagFilter, start, end },
        perspective,
        stega,
      }),
      sanityFetch({
        query: queryResourcesCount,
        // @ts-expect-error typegen narrows optional GROQ params too strictly
        params: { category: categoryFilter, tag: tagFilter },
        perspective,
        stega,
      }),
      sanityFetch({ query: queryAllCategories, perspective, stega }),
      sanityFetch({ query: queryAllTags, perspective, stega }),
    ]);

  const pageCount = Math.ceil(((total as number) ?? 0) / PAGE_SIZE);

  return (
    <>
      <h1 className="font-serif text-3xl font-semibold tracking-tight md:text-4xl">
        Local resources
      </h1>
      <p className="mt-3 text-lg text-muted-foreground">
        Services and organizations seniors can contact in Maricopa.
      </p>
      <div className="mt-8 space-y-8">
        <ResourcesFilterBar
          allCategories={(categories as { slug: string; title: string }[]) ?? []}
          allTags={(tags as { slug: string; title: string }[]) ?? []}
        />
        <ResourcesGrid resources={(resources as []) ?? []} />
        {pageCount > 1 ? (
          <nav className="flex justify-center gap-2" aria-label="Pagination">
            {page > 1 ? (
              <LinkButton href={`/resources?page=${page - 1}`} variant="outline" size="sm">
                Previous
              </LinkButton>
            ) : null}
            <span className="flex items-center px-3 text-sm text-muted-foreground">
              Page {page} of {pageCount}
            </span>
            {page < pageCount ? (
              <LinkButton href={`/resources?page=${page + 1}`} variant="outline" size="sm">
                Next
              </LinkButton>
            ) : null}
          </nav>
        ) : null}
      </div>
    </>
  );
}

function ResourcesFallback() {
  return <div className="h-64 animate-pulse rounded-xl bg-muted" aria-busy />;
}
