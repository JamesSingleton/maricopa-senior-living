import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";

import {
  loadEdition,
  NewsletterEdition,
} from "@/components/newsletter-edition";
import { PrintButton } from "@/components/print-button";
import { isMonthKey } from "@/lib/dates";
import { draftAware, Loading } from "@/lib/draft";

type Params = Promise<{ month: string }>;

export const metadata: Metadata = { robots: { index: false } };

export function generateStaticParams() {
  return [{ month: "2026-11" }];
}

/**
 * Print layout of an issue. Images are requested smaller and more
 * compressed than on the web page, so "Save as PDF" stays small enough to
 * email (the Word version was about 6 MB).
 */
/**
 * Params are request data for paths not built ahead of time, so the content
 * renders inside Suspense; prebuilt paths are still fully static.
 */
export default function NewsletterPrintPage({ params }: { params: Params }) {
  return (
    <Suspense fallback={<Loading />}>
      <NewsletterPrintPageContent params={params} />
    </Suspense>
  );
}

async function NewsletterPrintPageContent({ params }: { params: Params }) {
  const { month } = await params;
  if (!isMonthKey(month)) notFound();
  return draftAware(async (options) => {
    const data = await loadEdition(month, options);
    if (!data.edition) notFound();
    return (
      <div className="container-page py-6">
        <div className="no-print card mb-6 flex flex-col gap-3">
          <p className="text-lg">
            To make a PDF to email: click the button, then choose{" "}
            <strong>Save as PDF</strong> (or “Microsoft Print to PDF”) as the
            printer.
          </p>
          <div>
            <PrintButton label="Print or save as PDF" />
          </div>
        </div>
        <NewsletterEdition month={month} data={data} print />
      </div>
    );
  });
}
