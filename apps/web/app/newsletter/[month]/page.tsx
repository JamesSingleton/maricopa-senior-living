import {
  cachedNow,
  cachedSanityStaticParams,
} from "@maricopa-senior-living/sanity/live";
import { queryNewsletterList } from "@maricopa-senior-living/sanity/queries";
import { ArrowRight, FileText, Printer } from "lucide-react";
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
          {built ? (
            <p className="no-print mt-6 flex flex-wrap gap-3">
              <Link href={`/newsletter/${month}/print`} className="btn">
                <Printer className="size-5" aria-hidden="true" />
                Print or save as PDF
              </Link>
              {edition.uploadedPdf?.url ? (
                <a href={edition.uploadedPdf.url} className="btn btn-secondary">
                  <FileText className="size-5" aria-hidden="true" />
                  Open the original PDF{size(edition.uploadedPdf.size)}
                </a>
              ) : null}
            </p>
          ) : null}
        </PageHeader>
        <div className="container-page py-8">
          {built ? (
            <NewsletterEdition month={month} data={data} />
          ) : (
            <div className="card flex flex-col gap-5 p-8 sm:flex-row sm:items-center">
              <span className="icon-circle">
                <FileText className="size-6" aria-hidden="true" />
              </span>
              <div className="grow">
                <h2 className="text-xl">
                  The {monthLabel(month)} issue is a PDF
                </h2>
                <p className="muted mt-1">
                  It opens in your browser, where you can read, print or save
                  it.
                </p>
              </div>
              {edition.uploadedPdf?.url ? (
                <a href={edition.uploadedPdf.url} className="btn shrink-0">
                  Open the PDF{size(edition.uploadedPdf.size)}
                  <span className="btn-arrow">
                    <ArrowRight className="size-5" aria-hidden="true" />
                  </span>
                </a>
              ) : null}
            </div>
          )}
        </div>
      </>
    );
  });
}
