import { cachedNow, cachedSanity } from "@maricopa-senior-living/sanity/live";
import {
  queryNewsletterList,
  querySettings,
} from "@maricopa-senior-living/sanity/queries";
import { ArrowRight } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

import { PageHeader } from "@/components/page-header";
import { monthKey, monthLabel } from "@/lib/dates";
import { draftAware } from "@/lib/draft";

export const metadata: Metadata = {
  title: "Newsletter — Keeping you informed…still",
  description:
    "Maricopa Senior Living's free monthly newsletter, with every past issue.",
};

export default async function NewsletterIndex() {
  return draftAware(async ({ perspective, stega }) => {
    const month = monthKey(await cachedNow());
    const [{ data: settings }, { data: editions }] = await Promise.all([
      cachedSanity({ query: querySettings, perspective, stega }),
      cachedSanity({
        query: queryNewsletterList,
        params: { month },
        perspective,
        stega,
      }),
    ]);
    const [latest, ...older] = editions ?? [];
    const title = settings?.newsletterTitle ?? "Keeping you informed…still";
    return (
      <>
        <PageHeader
          title={title}
          intro="Our free monthly newsletter: local events, useful information and a little humor."
          crumbs={[{ label: "Newsletter", href: "/newsletter" }]}
        >
          {settings?.newsletterDedication ? (
            <p className="mt-3 italic">{settings.newsletterDedication}</p>
          ) : null}
        </PageHeader>
        <div className="container-page py-8">
          {settings?.subscribeInstructions ? (
            <div className="card mb-8 bg-[var(--msl-sage)]">
              <h2 className="text-xl">Get it by email</h2>
              <p className="mt-2 text-lg">{settings.subscribeInstructions}</p>
            </div>
          ) : null}
          {latest?.month ? (
            <section aria-labelledby="latest">
              <h2 id="latest">Latest issue: {monthLabel(latest.month)}</h2>
              <p className="mt-4 flex flex-wrap gap-3">
                <Link href={`/newsletter/${latest.month}`} className="btn">
                  Read the {monthLabel(latest.month)} issue
                  <span className="btn-arrow">
                    <ArrowRight className="size-5" aria-hidden="true" />
                  </span>
                </Link>
              </p>
            </section>
          ) : null}
          {older.length ? (
            <section className="mt-12" aria-labelledby="past">
              <h2 id="past">Past issues</h2>
              <div className="mt-6 flex flex-col gap-6">
                {[
                  ...new Set(older.map((e) => String(e.month).slice(0, 4))),
                ].map((year) => (
                  <div key={year} className="card">
                    <h3 className="text-xl">{year}</h3>
                    <ul className="mt-4 flex flex-wrap gap-2">
                      {older
                        .filter((e) => String(e.month).startsWith(year))
                        .map((edition) => (
                          <li key={edition.month}>
                            <Link
                              href={`/newsletter/${edition.month}`}
                              className="btn btn-secondary btn-sm"
                            >
                              {monthLabel(edition.month ?? "").replace(
                                ` ${year}`,
                                "",
                              )}
                            </Link>
                          </li>
                        ))}
                    </ul>
                  </div>
                ))}
              </div>
            </section>
          ) : null}
        </div>
      </>
    );
  });
}
