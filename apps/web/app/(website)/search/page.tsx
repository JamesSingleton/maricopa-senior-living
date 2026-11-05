import {
  cachedSanity,
  type DynamicFetchOptions,
  getDynamicFetchOptions,
} from "@maricopa-senior-living/sanity/live";
import { querySearch } from "@maricopa-senior-living/sanity/queries";
import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";

import ArticleCard from "@/components/ArticleCard";
import DirectoryCard from "@/components/DirectoryCard";

export const metadata: Metadata = {
  title: "Search",
  robots: { index: false },
};

type SearchParams = Promise<{ q?: string | string[] }>;

/** Normalize `q` so repeats, case and stray spaces share one cache entry. */
function normalizeQuery(value: string | string[] | undefined) {
  const raw = Array.isArray(value) ? value[0] : value;
  return (raw ?? "").replace(/\s+/g, " ").trim().slice(0, 100).toLowerCase();
}

/**
 * Search always uses Suspense — `searchParams` is a dynamic API input, so we
 * cannot branch on draftMode for a published-only static shell.
 */
export default function Page({ searchParams }: { searchParams: SearchParams }) {
  return (
    <Suspense fallback={<SearchFallback />}>
      <DynamicSearch searchParams={searchParams} />
    </Suspense>
  );
}

async function DynamicSearch({ searchParams }: { searchParams: SearchParams }) {
  const [{ q }, { perspective, stega }] = await Promise.all([
    searchParams,
    getDynamicFetchOptions(),
  ]);
  const query = normalizeQuery(q);

  // An empty term would match every document, so don't query at all.
  if (!query) {
    return (
      <SearchLayout query="">
        <EmptyState>
          Type a word like “meals”, “rides” or “Medicare” in the search box.
        </EmptyState>
      </SearchLayout>
    );
  }

  return <CachedSearch query={query} perspective={perspective} stega={stega} />;
}

async function CachedSearch({
  query,
  perspective,
  stega,
}: { query: string } & DynamicFetchOptions) {
  const { data: results } = await cachedSanity({
    query: querySearch,
    params: { searchTerm: query },
    perspective,
    stega,
  });
  const searchResults = (results ?? []) as any[];

  return (
    <SearchLayout query={query}>
      {searchResults.length > 0 ? (
        <>
          <p className="text-lg text-zinc-700">
            {searchResults.length === 50
              ? "Showing the 50 best matches."
              : `${searchResults.length} ${searchResults.length === 1 ? "match" : "matches"}.`}
          </p>
          <section className="space-y-8 pt-4">
            {searchResults.map((result) => {
              if (result._type === "post") {
                return <ArticleCard key={result._id} post={result} />;
              }
              if (result._type === "service") {
                return (
                  <DirectoryCard key={result._id} directoryItem={result} />
                );
              }
              return null;
            })}
          </section>
        </>
      ) : (
        <EmptyState>
          Nothing matched “{query}”. Try a shorter word or check the spelling.
        </EmptyState>
      )}
    </SearchLayout>
  );
}

function SearchLayout({
  query,
  children,
}: {
  query: string;
  children: React.ReactNode;
}) {
  return (
    <>
      {/* The layout already shows a search box (top on phones, sidebar on desktop). */}
      <h1 className="pb-4 text-4xl font-semibold sm:text-5xl">
        {query ? `Results for “${query}”` : "Search"}
      </h1>
      {children}
    </>
  );
}

function EmptyState({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-md bg-zinc-100 p-8 text-lg">
      <p>{children}</p>
      <p className="mt-4">
        Or go back to the{" "}
        <Link className="text-primary underline" href="/">
          home page
        </Link>
        .
      </p>
    </div>
  );
}

function SearchFallback() {
  return (
    <div aria-busy>
      <div className="h-12 w-3/4 animate-pulse rounded bg-zinc-200" />
      <div className="mt-8 space-y-8">
        {Array.from({ length: 3 }).map((_, index) => (
          <div key={index} className="h-32 animate-pulse rounded bg-zinc-200" />
        ))}
      </div>
    </div>
  );
}
