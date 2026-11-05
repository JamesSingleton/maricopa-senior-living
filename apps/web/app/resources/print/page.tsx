import {
  cachedSanity,
  getDynamicFetchOptions,
} from "@maricopa-senior-living/sanity/live";
import {
  queryResourcesForPrint,
  queryTopics,
} from "@maricopa-senior-living/sanity/queries";
import type { Metadata } from "next";
import { Suspense } from "react";

import { PrintButton } from "@/components/print-button";
import { addressText } from "@/lib/address";
import { formatClock } from "@/lib/dates";
import { Loading } from "@/lib/draft";
import { firstParam, type SearchParams } from "@/lib/params";

export const metadata: Metadata = {
  title: "Printable resource list",
  robots: { index: false },
};

const DAY_SHORT: Record<string, string> = {
  Monday: "Mon",
  Tuesday: "Tue",
  Wednesday: "Wed",
  Thursday: "Thu",
  Friday: "Fri",
  Saturday: "Sat",
  Sunday: "Sun",
};

/** A plain, black-and-white list sized for printing and handing out. */
export default function PrintPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  return (
    <Suspense fallback={<Loading />}>
      <PrintList searchParams={searchParams} />
    </Suspense>
  );
}

async function PrintList({ searchParams }: { searchParams: SearchParams }) {
  const [params, { perspective, stega }] = await Promise.all([
    searchParams,
    getDynamicFetchOptions(),
  ]);
  const filters = {
    topic: firstParam(params.topic, 60),
    area: firstParam(params.area),
    q: firstParam(params.q).toLowerCase(),
  };
  const [{ data: resources }, { data: topics }] = await Promise.all([
    cachedSanity({
      query: queryResourcesForPrint,
      params: filters,
      perspective,
      stega,
    }),
    cachedSanity({ query: queryTopics, perspective, stega }),
  ]);
  const topic = topics?.find((t) => t.slug === filters.topic);

  return (
    <div className="container-page py-6">
      <div className="no-print card mb-6 flex flex-wrap items-center justify-between gap-4">
        <p className="text-lg">
          This page is made for printing. Use the button, or your browser's
          Print command.
        </p>
        <PrintButton />
      </div>
      <h1 className="text-3xl">
        Maricopa Senior Living — {topic ? topic.title : "Resource list"}
      </h1>
      <p className="mt-1">
        {resources?.length ?? 0} resources · maricopaseniorliving.org · Please
        call ahead to confirm details.
      </p>
      <ol className="mt-6 flex flex-col gap-4">
        {(resources ?? []).map((r) => (
          <li key={r._id} className="card">
            <h2 className="text-xl">{r.title}</h2>
            {r.summary ? <p>{r.summary}</p> : null}
            <p className="mt-1">
              {(r.phones ?? [])
                .map((p) => [p.label, p.number].filter(Boolean).join(": "))
                .join(" · ")}
            </p>
            {r.address ? <p>{addressText(r.address)}</p> : null}
            {r.website ? (
              <p>
                {r.website
                  .replace(/^https?:\/\/(www\.)?/, "")
                  .replace(/\/$/, "")}
              </p>
            ) : null}
            {r.hours?.length ? (
              <p>
                {r.hours
                  .map(
                    (h) =>
                      `${DAY_SHORT[h.day ?? ""] ?? h.day} ${formatClock(h.opens)}–${formatClock(h.closes)}`,
                  )
                  .join(", ")}
                {r.hoursNote ? ` (${r.hoursNote})` : ""}
              </p>
            ) : null}
          </li>
        ))}
      </ol>
    </div>
  );
}
