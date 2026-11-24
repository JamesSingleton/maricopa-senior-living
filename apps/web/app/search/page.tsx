import {
  cachedSanity,
  getDynamicFetchOptions,
} from "@maricopa-senior-living/sanity/live";
import { querySearch } from "@maricopa-senior-living/sanity/queries";
import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";

import { CallButtons } from "@/components/cards";
import { PageHeader } from "@/components/page-header";
import { formatLongDate } from "@/lib/dates";
import { Loading } from "@/lib/draft";
import { hostOf, hrefFor } from "@/lib/links";
import { firstParam, type SearchParams } from "@/lib/params";

export const metadata: Metadata = { title: "Search", robots: { index: false } };

const TYPE_LABEL: Record<string, string> = {
  resource: "Place to call or visit",
  helpfulLink: "Helpful link",
  article: "Article",
  event: "Event",
  page: "Page",
};

export default function SearchPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  return (
    <Suspense fallback={<Loading />}>
      <Results searchParams={searchParams} />
    </Suspense>
  );
}

async function Results({ searchParams }: { searchParams: SearchParams }) {
  const [params, { perspective, stega }] = await Promise.all([
    searchParams,
    getDynamicFetchOptions(),
  ]);
  const q = firstParam(params.q).toLowerCase();
  const { data } = q
    ? await cachedSanity({
        query: querySearch,
        params: { q },
        perspective,
        stega,
      })
    : { data: [] };
  const results = data ?? [];

  return (
    <>
      <PageHeader
        title={q ? `Search results for “${q}”` : "Search"}
        crumbs={[{ label: "Search", href: "/search" }]}
      >
        <form
          action="/search"
          method="get"
          role="search"
          className="no-print mt-5 flex max-w-2xl flex-col gap-2 sm:flex-row"
        >
          <label htmlFor="search-q" className="sr-only">
            Search the website
          </label>
          <input
            id="search-q"
            name="q"
            type="search"
            defaultValue={q}
            required
            className="input"
            placeholder="For example: meals, rides, Medicare"
          />
          <button type="submit" className="btn shrink-0">
            Search
          </button>
        </form>
      </PageHeader>
      <div className="container-page py-8">
        {!q ? (
          <p className="text-lg">
            Type a word in the box above, or{" "}
            <Link href="/resources">browse resources by topic</Link>.
          </p>
        ) : results.length ? (
          <>
            <p className="text-lg">
              {results.length === 40
                ? "Showing the 40 best matches."
                : `${results.length} results.`}
            </p>
            <ul className="mt-5 flex flex-col gap-4">
              {results.map((result) => {
                const externalUrl =
                  result._type === "helpfulLink" ? (result.url ?? null) : null;
                const external = Boolean(externalUrl);
                const href =
                  externalUrl ??
                  hrefFor({ _type: result._type, slug: result.slug });
                if (!href) return null;
                return (
                  <li key={result._id} className="card flex flex-col gap-2">
                    <p className="eyebrow">
                      {TYPE_LABEL[result._type] ?? ""}
                      {result._type === "event" && result.start
                        ? ` · ${formatLongDate(result.start)}`
                        : ""}
                      {externalUrl
                        ? ` · ${result.source ?? hostOf(externalUrl)}`
                        : ""}
                    </p>
                    <h2 className="card-title text-xl">
                      {external ? (
                        <a
                          href={href}
                          rel="noopener noreferrer"
                          target="_blank"
                        >
                          {result.title}
                          <span className="sr-only"> (opens in a new tab)</span>
                        </a>
                      ) : (
                        <Link href={href}>{result.title}</Link>
                      )}
                    </h2>
                    {result.summary ? <p>{result.summary}</p> : null}
                    {result._type === "resource" ? (
                      <CallButtons phones={result.phones} max={1} />
                    ) : null}
                  </li>
                );
              })}
            </ul>
          </>
        ) : (
          <div className="card">
            <p className="text-lg">
              Nothing matched “{q}”. Try a shorter word, check the spelling, or{" "}
              <Link href="/resources">browse by topic</Link>.
            </p>
          </div>
        )}
      </div>
    </>
  );
}
