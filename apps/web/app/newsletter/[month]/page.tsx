import {
  cachedNow,
  cachedSanityStaticParams,
} from "@maricopa-senior-living/sanity/live";
import { queryNewsletterList } from "@maricopa-senior-living/sanity/queries";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";

import {
  loadEdition,
  NewsletterEdition,
} from "@/components/newsletter-edition";
import { PageHeader } from "@/components/page-header";
import { isMonthKey, monthKey, monthLabel } from "@/lib/dates";
import { draftAware, Loading } from "@/lib/draft";

type Params = Promise<{ month: string }>;

export async function generateStaticParams() {
  const { data } = await cachedSanityStaticParams({
    query: queryNewsletterList,
    params: { month: "9999-12" },
  });
  const months = (data ?? []).map((e) => e.month).filter(isMonthKey);
  return (months.length ? months : ["2026-11"]).map((month) => ({ month }));
}

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { month } = await params;
  return isMonthKey(month)
    ? { title: `Keeping you informed…still — ${monthLabel(month)}` }
    : {};
}

function size(bytes?: number | null) {
  return bytes ? ` (${(bytes / 1_000_000).toFixed(1)} MB)` : "";
}

/**
 * Params are request data for paths not built ahead of time, so the content
 * renders inside Suspense; prebuilt paths are still fully static.
 */
export default function NewsletterMonthPage({ params }: { params: Params }) {
  return (
    <Suspense fallback={<Loading />}>
      <NewsletterMonthPageContent params={params} />
    </Suspense>
  );
}

async function NewsletterMonthPageContent({ params }: { params: Params }) {
  const { month } = await params;
  if (!isMonthKey(month)) notFound();
  return draftAware(async (options) => {
    const data = await loadEdition(month, options);
    const { edition } = data;
    if (!edition) notFound();
    // Ron may publish next month early; visitors only see it once it starts.
    if (
      options.perspective === "published" &&
      month > monthKey(await cachedNow())
    )
      notFound();
    const built = (edition.sections?.length ?? 0) > 0;
    return (
      <>
        <PageHeader
          title={`${data.settings?.newsletterTitle ?? "Keeping you informed…still"} — ${monthLabel(month)}`}
          crumbs={[
            { label: "Newsletter", href: "/newsletter" },
            { label: monthLabel(month), href: `/newsletter/${month}` },
          ]}
        >
          <p className="no-print mt-5 flex flex-wrap gap-3">
            {built ? (
              <Link href={`/newsletter/${month}/print`} className="btn">
                Print or save as PDF
              </Link>
            ) : null}
            {edition.uploadedPdf?.url ? (
              <a
                href={edition.uploadedPdf.url}
                className={built ? "btn btn-secondary" : "btn"}
              >
                📄 Open the PDF{size(edition.uploadedPdf.size)}
              </a>
            ) : null}
          </p>
        </PageHeader>
        <div className="container-page py-8">
          {built ? (
            <NewsletterEdition month={month} data={data} />
          ) : (
            <p className="text-lg">
              This issue is available as a PDF. Use the button above to open it.
            </p>
          )}
        </div>
      </>
    );
  });
}
