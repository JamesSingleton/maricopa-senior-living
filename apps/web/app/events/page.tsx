import {
  cachedNow,
  cachedSanity,
  getDynamicFetchOptions,
} from "@maricopa-senior-living/sanity/live";
import { queryEventsInRange } from "@maricopa-senior-living/sanity/queries";
import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";

import { EventRow } from "@/components/cards";
import { PageHeader } from "@/components/page-header";
import {
  formatDayHeading,
  isMonthKey,
  monthKey,
  monthLabel,
  monthRange,
  shiftMonth,
} from "@/lib/dates";
import { Loading } from "@/lib/draft";
import { expandOccurrences, groupByDay } from "@/lib/events";
import { firstParam, type SearchParams } from "@/lib/params";

export const metadata: Metadata = {
  title: "Events calendar",
  description:
    "Upcoming events, classes and activities for seniors in Maricopa, Arizona.",
};

export default function EventsPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  return (
    <>
      <PageHeader
        title="Events calendar"
        intro="Things happening for seniors in and around Maricopa. Times are Arizona time."
        crumbs={[{ label: "Events", href: "/events" }]}
      />
      <Suspense fallback={<Loading />}>
        <MonthView searchParams={searchParams} />
      </Suspense>
    </>
  );
}

async function MonthView({ searchParams }: { searchParams: SearchParams }) {
  const [params, { perspective, stega }, nowIso] = await Promise.all([
    searchParams,
    getDynamicFetchOptions(),
    cachedNow(),
  ]);
  const thisMonth = monthKey(nowIso);
  const requested = firstParam(params.month, 7);
  const month = isMonthKey(requested) ? requested : thisMonth;
  const mslOnly = firstParam(params.msl) === "1";
  const { from, to } = monthRange(month);
  // For this month, start from today so past days don't crowd the top.
  const start = month === thisMonth ? new Date(nowIso) : new Date(from);
  const { data } = await cachedSanity({
    query: queryEventsInRange,
    params: { from: start.toISOString(), to, topicId: "", mslOnly },
    perspective,
    stega,
  });
  const days = groupByDay(expandOccurrences(data ?? [], start, new Date(to)));
  const href = (m: string) =>
    `/events?${new URLSearchParams({ month: m, ...(mslOnly && { msl: "1" }) })}`;

  return (
    <div className="container-page py-8">
      <nav
        aria-label="Choose a month"
        className="flex flex-wrap items-center justify-between gap-4"
      >
        {month > thisMonth ? (
          <Link
            href={href(shiftMonth(month, -1))}
            className="btn btn-secondary"
          >
            ← {monthLabel(shiftMonth(month, -1))}
          </Link>
        ) : (
          <span />
        )}
        <h2 className="text-center">{monthLabel(month)}</h2>
        <Link href={href(shiftMonth(month, 1))} className="btn btn-secondary">
          {monthLabel(shiftMonth(month, 1))} →
        </Link>
      </nav>
      <p className="mt-4">
        {mslOnly ? (
          <Link href={`/events?month=${month}`}>Show all events</Link>
        ) : (
          <Link href={`/events?month=${month}&msl=1`}>
            Show only events hosted by Maricopa Senior Living
          </Link>
        )}
      </p>
      {days.length ? (
        <div className="mt-6 flex flex-col gap-8">
          {days.map(({ day, items }) => (
            <section key={day} aria-labelledby={`day-${day}`}>
              <h3
                id={`day-${day}`}
                className="border-b-2 border-[var(--msl-line)] pb-1 text-xl"
              >
                {formatDayHeading(`${day}`)}
              </h3>
              <ul className="mt-3 flex flex-col gap-3">
                {items.map((occurrence) => (
                  <li key={occurrence.key}>
                    <EventRow occurrence={occurrence} showDate={false} />
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      ) : (
        <div className="card mt-6">
          <p className="text-lg">
            No events are listed for {monthLabel(month)} yet. Check back soon.
          </p>
        </div>
      )}
    </div>
  );
}
