import {
  cachedNow,
  cachedSanity,
  cachedSanityStaticParams,
} from "@maricopa-senior-living/sanity/live";
import {
  queryMonthlyUpdate,
  queryMonthlyUpdateList,
} from "@maricopa-senior-living/sanity/queries";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";

import { PageHeader } from "@/components/page-header";
import { RichText } from "@/components/rich-text";
import { isMonthKey, monthKey, monthLabel, shiftMonth } from "@/lib/dates";
import { draftAware, Loading } from "@/lib/draft";

type Params = Promise<{ month: string }>;

export async function generateStaticParams() {
  const { data } = await cachedSanityStaticParams({
    query: queryMonthlyUpdateList,
    params: { month: "9999-12" },
  });
  const months = (data ?? []).map((m) => m.month).filter(isMonthKey);
  return (months.length ? months : ["2026-11"]).map((month) => ({ month }));
}

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { month } = await params;
  return isMonthKey(month)
    ? { title: `What's New — ${monthLabel(month)}` }
    : {};
}

/**
 * Params are request data for paths not built ahead of time, so the content
 * renders inside Suspense; prebuilt paths are still fully static.
 */
export default function MonthPage({ params }: { params: Params }) {
  return (
    <Suspense fallback={<Loading />}>
      <MonthPageContent params={params} />
    </Suspense>
  );
}

async function MonthPageContent({ params }: { params: Params }) {
  const { month } = await params;
  if (!isMonthKey(month)) notFound();
  return draftAware(async ({ perspective, stega }) => {
    const [{ data: update }, { data: months }] = await Promise.all([
      cachedSanity({
        query: queryMonthlyUpdate,
        params: { month },
        perspective,
        stega,
      }),
      cachedSanity({
        query: queryMonthlyUpdateList,
        params: { month: "9999-12" },
        perspective,
        stega,
      }),
    ]);
    if (!update) notFound();
    // Ron may publish next month early; visitors only see it once it starts.
    if (perspective === "published" && month > monthKey(await cachedNow()))
      notFound();
    const available = new Set<string>(
      (months ?? []).map((m) => String(m.month)),
    );
    const previous = shiftMonth(month, -1);
    const next = shiftMonth(month, 1);
    return (
      <>
        <PageHeader
          title={
            update.title || `What's New in Maricopa — ${monthLabel(month)}`
          }
          intro={update.intro}
          crumbs={[
            { label: "What's New", href: "/whats-new" },
            { label: monthLabel(month), href: `/whats-new/${month}` },
          ]}
        />
        <div className="container-page py-8">
          <RichText value={update.body} />
          <nav
            aria-label="Other months"
            className="mt-12 flex flex-wrap justify-between gap-4 border-t-2 border-[var(--msl-line)] pt-6"
          >
            {available.has(previous) ? (
              <Link
                href={`/whats-new/${previous}`}
                className="btn btn-secondary"
              >
                ← {monthLabel(previous)}
              </Link>
            ) : (
              <span />
            )}
            <Link href="/whats-new" className="btn btn-secondary">
              All months
            </Link>
            {available.has(next) ? (
              <Link href={`/whats-new/${next}`} className="btn btn-secondary">
                {monthLabel(next)} →
              </Link>
            ) : (
              <span />
            )}
          </nav>
        </div>
      </>
    );
  });
}
