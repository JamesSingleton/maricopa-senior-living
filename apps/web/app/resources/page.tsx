import {
  cachedSanity,
  getDynamicFetchOptions,
} from "@maricopa-senior-living/sanity/live";
import {
  queryResourcesCount,
  queryResourcesSlice,
  queryTopics,
} from "@maricopa-senior-living/sanity/queries";
import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";

import { ResourceCard, type ResourceCardData } from "@/components/cards";
import { PageHeader, Pager } from "@/components/page-header";
import { TopicIcon } from "@/components/topic-icon";
import { Loading } from "@/lib/draft";
import { firstParam, pageParam, type SearchParams } from "@/lib/params";

export const metadata: Metadata = {
  title: "Find help",
  description:
    "Local services and organizations for seniors and caregivers in Maricopa, Arizona, sorted by topic.",
};

const PAGE_SIZE = 24;
const AREAS = [
  { value: "", label: "Anywhere" },
  { value: "maricopa", label: "City of Maricopa" },
  { value: "pinal", label: "Pinal County" },
  { value: "arizona", label: "Arizona" },
  { value: "national", label: "National" },
];

export default function ResourcesPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  return (
    <>
      <PageHeader
        title="Find help"
        intro="Organizations and services you can call or visit. Choose a topic, or search for what you need."
        crumbs={[{ label: "Find help", href: "/resources" }]}
      />
      <Suspense fallback={<Loading />}>
        <Results searchParams={searchParams} />
      </Suspense>
    </>
  );
}

async function Results({ searchParams }: { searchParams: SearchParams }) {
  const [params, { perspective, stega }] = await Promise.all([
    searchParams,
    getDynamicFetchOptions(),
  ]);
  const topic = firstParam(params.topic, 60);
  const area = AREAS.some((a) => a.value === firstParam(params.area))
    ? firstParam(params.area)
    : "";
  const q = firstParam(params.q).toLowerCase();
  const page = pageParam(params.page);
  const start = (page - 1) * PAGE_SIZE;
  const filters = { topic, area, q };

  const [{ data: topics }, { data: items }, { data: total }] =
    await Promise.all([
      cachedSanity({ query: queryTopics, perspective, stega }),
      cachedSanity({
        query: queryResourcesSlice(start, start + PAGE_SIZE),
        params: filters,
        perspective,
        stega,
      }),
      cachedSanity({
        query: queryResourcesCount,
        params: filters,
        perspective,
        stega,
      }),
    ]);
  const resources = (items ?? []) as ResourceCardData[];
  const count = typeof total === "number" ? total : 0;
  const totalPages = Math.max(1, Math.ceil(count / PAGE_SIZE));
  const query = (extra: Record<string, string>) => {
    const qs = new URLSearchParams({
      ...(topic && { topic }),
      ...(area && { area }),
      ...(q && { q }),
      ...extra,
    });
    const s = qs.toString();
    return s ? `/resources?${s}` : "/resources";
  };
  const activeTopic = topics?.find((t) => t.slug === topic);

  return (
    <div className="container-page py-8">
      {!topic && !q && !area ? (
        <section aria-labelledby="topics-heading">
          <h2 id="topics-heading">Browse by topic</h2>
          <ul className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {(topics ?? []).map((t) => (
              <li key={t._id}>
                <Link
                  href={`/topics/${t.slug}`}
                  className="card card-link flex items-center gap-4"
                >
                  <TopicIcon name={t.icon} />
                  <span>
                    <span className="card-title block">{t.title}</span>
                    <span className="block text-base muted">
                      {t.resourceCount} resources
                    </span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <form
        method="get"
        action="/resources"
        className="card mt-10 grid gap-4 md:grid-cols-[1fr_1fr_1fr_auto] md:items-end"
      >
        <div>
          <label htmlFor="q" className="label">
            Search
          </label>
          <input
            id="q"
            name="q"
            type="search"
            defaultValue={q}
            className="input"
            placeholder="e.g. food bank"
          />
        </div>
        <div>
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
        <div>
          <label htmlFor="area" className="label">
            Serves
          </label>
          <select id="area" name="area" defaultValue={area} className="input">
            {AREAS.map((a) => (
              <option key={a.value} value={a.value}>
                {a.label}
              </option>
            ))}
          </select>
        </div>
        <button type="submit" className="btn">
          Show results
        </button>
      </form>

      <div className="mt-8 flex flex-wrap items-center justify-between gap-4">
        <h2 aria-live="polite">
          {count} {count === 1 ? "resource" : "resources"}
          {activeTopic ? ` in ${activeTopic.title}` : ""}
          {q ? ` matching “${q}”` : ""}
        </h2>
        <div className="flex flex-wrap gap-3">
          {topic || q || area ? (
            <Link href="/resources" className="btn btn-secondary">
              Clear choices
            </Link>
          ) : null}
          <Link
            href={query({}).replace("/resources", "/resources/print")}
            className="btn btn-secondary"
          >
            Printable list
          </Link>
        </div>
      </div>

      {resources.length ? (
        <ul className="mt-5 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {resources.map((resource) => (
            <li key={resource._id}>
              <ResourceCard resource={resource} />
            </li>
          ))}
        </ul>
      ) : (
        <div className="card mt-5">
          <p className="text-lg">
            Nothing matched. Try a shorter word, or choose “All topics”.
          </p>
        </div>
      )}
      <Pager
        page={page}
        totalPages={totalPages}
        hrefFor={(p) => query({ page: String(p) })}
      />
    </div>
  );
}
