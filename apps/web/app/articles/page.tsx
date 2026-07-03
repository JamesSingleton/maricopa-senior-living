import {
  type DynamicFetchOptions,
  getDynamicFetchOptions,
  sanityFetch,
  sanityFetchMetadata,
} from "@maricopa-senior-living/sanity/live";
import { buildMetadata } from "@maricopa-senior-living/sanity/metadata";
import {
  queryArticlesCount,
  queryArticlesIndex,
  querySiteSettings,
} from "@maricopa-senior-living/sanity/queries";
import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";

import { ArticleCard } from "@/components/ArticleCard";
import { LinkButton } from "@/components/LinkButton";
import { PAGE_SIZE, searchParamsCache } from "@/lib/search-params";

export async function generateMetadata(): Promise<Metadata> {
  const { data: settings } = await sanityFetchMetadata({
    query: querySiteSettings,
    perspective: "published",
  });
  return buildMetadata({
    fallbackTitle: "Articles",
    fallbackDescription: "News and updates for seniors in Maricopa, Arizona.",
    path: "/articles",
    siteTitle: (settings as { title?: string })?.title,
  });
}

export default function ArticlesIndexPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  return (
    <Suspense fallback={<Fallback />}>
      <DynamicArticles searchParams={searchParams} />
    </Suspense>
  );
}

async function DynamicArticles({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const [resolved, { perspective, stega }] = await Promise.all([
    searchParams,
    getDynamicFetchOptions(),
  ]);
  const { page } = searchParamsCache.parse(resolved);
  return <CachedArticles page={page} perspective={perspective} stega={stega} />;
}

async function CachedArticles({
  page,
  perspective,
  stega,
}: { page: number } & DynamicFetchOptions) {
  "use cache";
  const start = (page - 1) * PAGE_SIZE;
  const end = start + PAGE_SIZE;
  const [{ data: articles }, { data: total }] = await Promise.all([
    sanityFetch({
      query: queryArticlesIndex,
      params: { start, end },
      perspective,
      stega,
    }),
    sanityFetch({ query: queryArticlesCount, perspective, stega }),
  ]);
  const pageCount = Math.ceil(((total as number) ?? 0) / PAGE_SIZE);

  return (
    <>
      <h1 className="font-serif text-3xl font-semibold tracking-tight md:text-4xl">
        Articles
      </h1>
      <p className="mt-3 text-lg text-muted-foreground">
        News, announcements, and syndicated content.
      </p>
      <div className="mt-8 space-y-4">
        {((articles as []) ?? []).map((article) => (
          <ArticleCard key={(article as { _id: string })._id} article={article} />
        ))}
      </div>
      {pageCount > 1 ? (
        <nav className="mt-8 flex justify-center gap-2" aria-label="Pagination">
          {page > 1 ? (
            <LinkButton href={`/articles?page=${page - 1}`} variant="outline" size="sm">
              Previous
            </LinkButton>
          ) : null}
          <span className="flex items-center px-3 text-sm text-muted-foreground">
            Page {page} of {pageCount}
          </span>
          {page < pageCount ? (
            <LinkButton href={`/articles?page=${page + 1}`} variant="outline" size="sm">
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
