import {
  cachedSanity,
  cachedSanityMetadata,
  cachedSanityStaticParams,
} from "@maricopa-senior-living/sanity/live";
import {
  queryResource,
  queryResourcePaths,
} from "@maricopa-senior-living/sanity/queries";
import { FileText } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";

import { CallButtons } from "@/components/cards";
import { PageHeader } from "@/components/page-header";
import { RichText } from "@/components/rich-text";
import { formatClock, formatLongDate } from "@/lib/dates";
import { draftAware, Loading } from "@/lib/draft";
import { hostOf } from "@/lib/links";

type Params = Promise<{ slug: string }>;
const DAYS = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];
const AREA_LABEL: Record<string, string> = {
  maricopa: "People in the City of Maricopa",
  pinal: "People in Pinal County",
  arizona: "People in Arizona",
  national: "Anyone, anywhere",
};

export async function generateStaticParams() {
  const { data } = await cachedSanityStaticParams({
    query: queryResourcePaths,
  });
  return (data ?? []).filter(Boolean).map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { slug } = await params;
  const { data } = await cachedSanityMetadata({
    query: queryResource,
    params: { slug },
    perspective: "published",
  });
  return data
    ? {
        title: data.title ?? undefined,
        description: data.summary ?? undefined,
        alternates: { canonical: `/resources/${slug}` },
      }
    : {};
}

/**
 * Params are request data for paths not built ahead of time, so the content
 * renders inside Suspense; prebuilt paths are still fully static.
 */
export default function ResourcePage({ params }: { params: Params }) {
  return (
    <Suspense fallback={<Loading />}>
      <ResourcePageContent params={params} />
    </Suspense>
  );
}

async function ResourcePageContent({ params }: { params: Params }) {
  const { slug } = await params;
  return draftAware(async ({ perspective, stega }) => {
    const { data: resource } = await cachedSanity({
      query: queryResource,
      params: { slug },
      perspective,
      stega,
    });
    if (!resource) notFound();
    const hours = [...(resource.hours ?? [])].sort(
      (a, b) => DAYS.indexOf(a.day ?? "") - DAYS.indexOf(b.day ?? ""),
    );

    return (
      <>
        <PageHeader
          title={resource.title ?? "Resource"}
          intro={resource.summary}
          crumbs={[
            { label: "Find help", href: "/resources" },
            ...(resource.topics?.[0]?.slug
              ? [
                  {
                    label: resource.topics[0].title ?? "Topic",
                    href: `/topics/${resource.topics[0].slug}`,
                  },
                ]
              : []),
          ]}
        />
        <div className="container-page grid gap-10 py-8 lg:grid-cols-[2fr_1fr]">
          <div className="flex flex-col gap-8">
            <section aria-labelledby="reach">
              <h2 id="reach">How to reach them</h2>
              <div className="mt-4 flex flex-col gap-4">
                <CallButtons phones={resource.phones} max={6} />
                {resource.email ? (
                  <p className="text-lg">
                    Email:{" "}
                    <a href={`mailto:${resource.email}`}>{resource.email}</a>
                  </p>
                ) : null}
                {resource.website ? (
                  <p>
                    <a
                      href={resource.website}
                      className="btn btn-secondary"
                      rel="noopener noreferrer"
                      target="_blank"
                    >
                      Visit their website ({hostOf(resource.website)})
                      <span className="sr-only">, opens in a new tab</span>
                    </a>
                  </p>
                ) : null}
                {resource.address ? (
                  <div>
                    <p className="font-bold">Address</p>
                    <address className="whitespace-pre-line text-lg not-italic">
                      {resource.address}
                    </address>
                    <a
                      href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(resource.address)}`}
                      rel="noopener noreferrer"
                      target="_blank"
                    >
                      Get directions
                      <span className="sr-only">
                        {" "}
                        (opens Google Maps in a new tab)
                      </span>
                    </a>
                  </div>
                ) : null}
              </div>
            </section>
            {resource.description?.length ? (
              <section aria-labelledby="about">
                <h2 id="about">About</h2>
                <div className="mt-3">
                  <RichText value={resource.description} />
                </div>
              </section>
            ) : null}
            {resource.attachments?.length ? (
              <section aria-labelledby="files">
                <h2 id="files">Forms and brochures</h2>
                <ul className="mt-3 flex flex-col gap-2">
                  {resource.attachments.map((file) =>
                    file.file?.url ? (
                      <li key={file._key}>
                        <a href={file.file.url} className="btn btn-secondary">
                          <FileText className="size-5" aria-hidden="true" />
                          {file.title ?? "Open the file"} (
                          {(file.file.extension ?? "file").toUpperCase()})
                        </a>
                      </li>
                    ) : null,
                  )}
                </ul>
              </section>
            ) : null}
          </div>
          <aside className="flex flex-col gap-4">
            {hours.length || resource.hoursNote ? (
              <div className="card">
                <h2 className="text-xl">Hours</h2>
                {hours.length ? (
                  <table className="mt-3 w-full text-left">
                    <tbody>
                      {DAYS.map((day) => {
                        const entry = hours.find((h) => h.day === day);
                        return (
                          <tr
                            key={day}
                            className="border-b border-[var(--msl-line)] last:border-0"
                          >
                            <th scope="row" className="py-1 pr-3 font-normal">
                              {day}
                            </th>
                            <td className="py-1">
                              {entry
                                ? `${formatClock(entry.opens)} – ${formatClock(entry.closes)}`
                                : "Closed"}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                ) : null}
                {resource.hoursNote ? (
                  <p className="mt-2">{resource.hoursNote}</p>
                ) : null}
              </div>
            ) : null}
            <div className="card">
              <h2 className="text-xl">Who it's for</h2>
              <p className="mt-2">
                {resource.eligibility ||
                  AREA_LABEL[resource.serviceArea ?? ""] ||
                  "Ask them about eligibility."}
              </p>
              {resource.cost ? (
                <p className="mt-2">
                  <span className="font-bold">Cost:</span> {resource.cost}
                </p>
              ) : null}
            </div>
            {resource.topics?.length ? (
              <div className="card">
                <h2 className="text-xl">Topics</h2>
                <ul className="mt-2 flex flex-col gap-1">
                  {resource.topics.map((t) => (
                    <li key={t.slug}>
                      <Link href={`/topics/${t.slug}`}>{t.title}</Link>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
            <p className="text-base muted">
              {resource.lastVerified
                ? `Details last checked ${formatLongDate(resource.lastVerified)}. `
                : ""}
              Please call ahead to confirm hours and eligibility.
            </p>
          </aside>
        </div>
      </>
    );
  });
}
