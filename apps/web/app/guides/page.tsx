import {
  type DynamicFetchOptions,
  getDynamicFetchOptions,
  sanityFetch,
  sanityFetchMetadata,
} from "@maricopa-senior-living/sanity/live";
import { buildMetadata } from "@maricopa-senior-living/sanity/metadata";
import {
  queryGuidesCount,
  queryGuidesIndex,
  querySiteSettings,
} from "@maricopa-senior-living/sanity/queries";
import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";

import { GuideCard } from "@/components/GuideCard";
import { PAGE_SIZE, searchParamsCache } from "@/lib/search-params";
import { LinkButton } from "@/components/LinkButton";

export async function generateMetadata(): Promise<Metadata> {
  const { data: settings } = await sanityFetchMetadata({
    query: querySiteSettings,
    perspective: "published",
  });
  return buildMetadata({
    fallbackTitle: "Guides",
    fallbackDescription: "Evergreen how-to guides for seniors and caregivers.",
    path: "/guides",
    siteTitle: (settings as { title?: string })?.title,
  });
}

export default function GuidesIndexPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  return (
    <Suspense fallback={<Fallback />}>
      <DynamicGuides searchParams={searchParams} />
    </Suspense>
  );
}

async function DynamicGuides({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const [resolved, { perspective, stega }] = await Promise.all([
    searchParams,
    getDynamicFetchOptions(),
  ]);
  const { page } = searchParamsCache.parse(resolved);
  return <CachedGuides page={page} perspective={perspective} stega={stega} />;
}

async function CachedGuides({
  page,
  perspective,
  stega,
}: { page: number } & DynamicFetchOptions) {
  "use cache";
  const start = (page - 1) * PAGE_SIZE;
  const end = start + PAGE_SIZE;
  const [{ data: guides }, { data: total }] = await Promise.all([
    sanityFetch({
      query: queryGuidesIndex,
      params: { start, end },
      perspective,
      stega,
    }),
    sanityFetch({ query: queryGuidesCount, perspective, stega }),
  ]);
  const pageCount = Math.ceil(((total as number) ?? 0) / PAGE_SIZE);

  return (
    <>
      <h1 className="font-serif text-3xl font-semibold tracking-tight md:text-4xl">
        Guides
      </h1>
      <p className="mt-3 text-lg text-muted-foreground">
        Step-by-step help for common senior needs in Maricopa.
      </p>
      <div className="mt-8 space-y-4">
        {((guides as []) ?? []).map((guide) => (
          <GuideCard key={(guide as { _id: string })._id} guide={guide} />
        ))}
      </div>
      {pageCount > 1 ? (
        <nav className="mt-8 flex justify-center gap-2" aria-label="Pagination">
          {page > 1 ? (
            <LinkButton href={`/guides?page=${page - 1}`} variant="outline" size="sm">
              Previous
            </LinkButton>
          ) : null}
          <span className="flex items-center px-3 text-sm text-muted-foreground">
            Page {page} of {pageCount}
          </span>
          {page < pageCount ? (
            <LinkButton href={`/guides?page=${page + 1}`} variant="outline" size="sm">
              Next
            </LinkButton>
          ) : null}
        </nav>
      ) : null}
    </>
  );
}

function Fallback() {
  return <div className="h-64 animate-pulse rounded-xl bg-muted" aria-busy />;
}
