import { cachedNow, cachedSanity } from "@maricopa-senior-living/sanity/live";
import { queryMonthlyUpdateList } from "@maricopa-senior-living/sanity/queries";
import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";

import { PageHeader } from "@/components/page-header";
import { monthKey, monthLabel } from "@/lib/dates";
import { draftAware } from "@/lib/draft";

export const metadata: Metadata = {
  title: "What's New in Maricopa",
  description:
    "What's happening in Maricopa this month, written by Ron Smith — with an archive of past months.",
};

/** The latest month, plus the archive of every earlier month. */
export default async function WhatsNewIndex() {
  return draftAware(async ({ perspective, stega }) => {
    const month = monthKey(await cachedNow());
    const { data: months } = await cachedSanity({
      query: queryMonthlyUpdateList,
      params: { month },
      perspective,
      stega,
    });
    const [latest, ...older] = months ?? [];
    if (latest?.month && !older.length) redirect(`/whats-new/${latest.month}`);
    return (
      <>
        <PageHeader
          title="What's New in Maricopa"
          intro="A monthly look at what's happening around town."
          crumbs={[{ label: "What's New", href: "/whats-new" }]}
        />
        <div className="container-page py-8">
          {latest?.month ? (
            <div className="card bg-[var(--msl-sage)]">
              <p className="eyebrow">This month</p>
              <h2 className="mt-1">{monthLabel(latest.month)}</h2>
              {latest.intro ? (
                <p className="mt-2 measure text-lg">{latest.intro}</p>
              ) : null}
              <p className="mt-4">
                <Link href={`/whats-new/${latest.month}`} className="btn">
                  Read {monthLabel(latest.month)}
                </Link>
              </p>
            </div>
          ) : (
            <p className="text-lg">The first monthly update is coming soon.</p>
          )}
          {older.length ? (
            <section className="mt-10" aria-labelledby="archive">
              <h2 id="archive">Earlier months</h2>
              <ul className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {older.map((m) => (
                  <li key={m.month}>
                    <Link
                      href={`/whats-new/${m.month}`}
                      className="card card-link block"
                    >
                      <span className="card-title">
                        {monthLabel(m.month ?? "")}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          ) : null}
        </div>
      </>
    );
  });
}
