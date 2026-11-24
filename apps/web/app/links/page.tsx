import {
  cachedSanity,
  getDynamicFetchOptions,
} from "@maricopa-senior-living/sanity/live";
import {
  queryLinksCount,
  queryLinksSlice,
  queryTopics,
} from "@maricopa-senior-living/sanity/queries";
import type { Metadata } from "next";
import { Suspense } from "react";

import { HelpfulLinkCard, type LinkCardData } from "@/components/cards";
import { PageHeader, Pager } from "@/components/page-header";
import { Loading } from "@/lib/draft";
import { firstParam, pageParam, type SearchParams } from "@/lib/params";

export const metadata: Metadata = {
  title: "Helpful links",
  description:
    "Trustworthy articles and websites from other organizations, picked for Maricopa seniors and caregivers.",
};

const PAGE_SIZE = 30;

export default function LinksPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  return (
    <>
      <PageHeader
        title="Helpful links"
        intro="Good articles and websites from other organizations. Each one opens on its own website."
        crumbs={[{ label: "Helpful links", href: "/links" }]}
      />
      <Suspense fallback={<Loading />}>
        <LinkList searchParams={searchParams} />
      </Suspense>
    </>
  );
}

async function LinkList({ searchParams }: { searchParams: SearchParams }) {
  const [params, { perspective, stega }] = await Promise.all([
    searchParams,
    getDynamicFetchOptions(),
  ]);
  const topic = firstParam(params.topic, 60);
  const page = pageParam(params.page);
  const start = (page - 1) * PAGE_SIZE;
  const [{ data: topics }, { data: items }, { data: total }] =
    await Promise.all([
      cachedSanity({ query: queryTopics, perspective, stega }),
      cachedSanity({
        query: queryLinksSlice(start, start + PAGE_SIZE),
        params: { topic },
        perspective,
        stega,
      }),
      cachedSanity({
        query: queryLinksCount,
        params: { topic },
        perspective,
        stega,
      }),
    ]);
  const links = (items ?? []) as LinkCardData[];
  const count = typeof total === "number" ? total : 0;

  return (
    <div className="container-page py-8">
      <form
        method="get"
        action="/links"
        className="card flex flex-col gap-3 sm:flex-row sm:items-end"
      >
        <div className="grow">
          <label htmlFor="topic" className="label">
            Topic
          </label>
          <select
            id="topic"
            name="topic"
            defaultValue={topic}
            className="input"
          >
            <option value="">All topics</option>
            {(topics ?? []).map((t) => (
              <option key={t._id} value={t.slug ?? ""}>
                {t.title}
              </option>
            ))}
          </select>
        </div>
        <button type="submit" className="btn">
          Show links
        </button>
      </form>
      <h2 className="mt-8">{count} helpful links</h2>
      <ul className="mt-4 grid gap-4 md:grid-cols-2">
        {links.map((link) => (
          <li key={link._id}>
            <HelpfulLinkCard link={link} />
          </li>
        ))}
      </ul>
      <Pager
        page={page}
        totalPages={Math.max(1, Math.ceil(count / PAGE_SIZE))}
        hrefFor={(p) =>
          `/links?${new URLSearchParams({ ...(topic && { topic }), page: String(p) })}`
        }
      />
    </div>
  );
}
