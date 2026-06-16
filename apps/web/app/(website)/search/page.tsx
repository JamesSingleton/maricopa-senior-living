import {
  getDynamicFetchOptions,
  sanityFetch,
  type DynamicFetchOptions,
} from "@maricopa-senior-living/sanity/live";
import { Suspense } from "react";

import ArticleCard from "@/components/ArticleCard";
import DirectoryCard from "@/components/DirectoryCard";
import { querySearch } from "@maricopa-senior-living/sanity/queries";

export default function Page({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
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
  searchParams: Promise<{ q?: string }>;
}) {
  const [{ q = "" }, { perspective, stega }] = await Promise.all([
    searchParams,
    getDynamicFetchOptions(),
  ]);

  return (
    <CachedSearch query={q} perspective={perspective} stega={stega} />
  );
}

async function CachedSearch({
  query,
  perspective,
  stega,
}: { query: string } & DynamicFetchOptions) {
  "use cache";
  const { data: results } = await sanityFetch({
    query: querySearch,
    params: { searchTerm: query },
    perspective,
    stega,
  });
  const searchResults = (results ?? []) as any[];

  return (
    <>
      <h1 className="inline-block align-middle text-4xl font-semibold capitalize sm:text-5xl md:text-6xl">
        {`Search Results for "${query}"`}
      </h1>
      <section className="space-y-8 pt-4">
        {searchResults.length > 0 &&
          searchResults.map((result: any) => {
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
