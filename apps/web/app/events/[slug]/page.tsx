import {
  cachedNow,
  cachedSanity,
  cachedSanityMetadata,
  cachedSanityStaticParams,
} from "@maricopa-senior-living/sanity/live";
import {
  queryEvent,
  queryEventPaths,
} from "@maricopa-senior-living/sanity/queries";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";

import { PageHeader } from "@/components/page-header";
import { RichText } from "@/components/rich-text";
import { SanityImage } from "@/components/sanity-image";
import { formatDayHeading } from "@/lib/dates";
import { draftAware, Loading } from "@/lib/draft";
import { expandOccurrences, repeatLabel, timeRange } from "@/lib/events";
import { resolveLink } from "@/lib/links";

type Params = Promise<{ slug: string }>;

export async function generateStaticParams() {
  const { data } = await cachedSanityStaticParams({ query: queryEventPaths });
  const slugs = (data ?? []).filter(Boolean);
  // Cache Components needs at least one path at build time.
  return (slugs.length ? slugs : ["placeholder"]).map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { slug } = await params;
  const { data } = await cachedSanityMetadata({
    query: queryEvent,
    params: { slug },
    perspective: "published",
  });
  return data
    ? { title: data.title ?? undefined, description: data.summary ?? undefined }
    : {};
}

/**
 * Params are request data for paths not built ahead of time, so the content
 * renders inside Suspense; prebuilt paths are still fully static.
 */
export default function EventPage({ params }: { params: Params }) {
  return (
    <Suspense fallback={<Loading />}>
      <EventPageContent params={params} />
    </Suspense>
  );
}

async function EventPageContent({ params }: { params: Params }) {
  const { slug } = await params;
  return draftAware(async ({ perspective, stega }) => {
    const [{ data: event }, nowIso] = await Promise.all([
      cachedSanity({ query: queryEvent, params: { slug }, perspective, stega }),
      cachedNow(),
    ]);
    if (!event) notFound();
    const now = new Date(nowIso);
    const upcoming = expandOccurrences(
      [event],
      now,
      new Date(now.getTime() + 400 * 24 * 3600 * 1000),
    );
    const [first] = expandOccurrences([event], new Date(0), new Date(8.64e15));
    const next = upcoming[0] ?? first;
    const rule = repeatLabel(event);
    const signUp = resolveLink(event.registration?.link ?? null);

    return (
      <>
        <PageHeader
          title={event.title ?? "Event"}
          eyebrow={
            event.hostedByMsl ? "Hosted by Maricopa Senior Living" : null
          }
          crumbs={[{ label: "Events", href: "/events" }]}
        />
        <div className="container-page grid gap-10 py-8 lg:grid-cols-[2fr_1fr]">
          <div className="flex flex-col gap-6">
            <div className="card flex flex-col gap-2 text-lg">
              {next ? (
                <p>
                  <span className="font-bold">
                    {upcoming.length ? "Next date" : "Date"}:
                  </span>{" "}
                  {formatDayHeading(next.at)}, {timeRange(next)}
                </p>
              ) : null}
              {rule ? <p>{rule}</p> : null}
              {event.location ? (
                <p>
                  <span className="font-bold">Place:</span> {event.location}
                  {event.address ? `, ${event.address}` : ""}
                </p>
              ) : null}
              {event.cost ? (
                <p>
                  <span className="font-bold">Cost:</span> {event.cost}
                </p>
              ) : null}
              {event.registration?.required ? (
                <p className="font-bold">Sign-up is required.</p>
              ) : null}
              {signUp ? (
                <p>
                  <a
                    href={signUp.href}
                    className="btn"
                    {...(signUp.external
                      ? { rel: "noopener noreferrer", target: "_blank" }
                      : {})}
                  >
                    {event.registration?.link?.label ?? "Sign up"}
                  </a>
                </p>
              ) : null}
            </div>
            {event.summary ? (
              <p className="measure text-xl">{event.summary}</p>
            ) : null}
            <RichText value={event.details} />
            {upcoming.length > 1 ? (
              <section>
                <h2 className="text-xl">Upcoming dates</h2>
                <ul className="mt-2 list-disc pl-6">
                  {upcoming.slice(0, 8).map((o) => (
                    <li key={o.key}>
                      {formatDayHeading(o.at)}, {timeRange(o)}
                    </li>
                  ))}
                </ul>
              </section>
            ) : null}
          </div>
          <aside className="flex flex-col gap-4">
            {event.flyer?.id ? (
              <figure className="card">
                <SanityImage
                  image={event.flyer}
                  width={700}
                  className="h-auto w-full rounded-md"
                />
                <figcaption className="mt-2 text-base muted">
                  Event flyer
                </figcaption>
              </figure>
            ) : null}
            <Link href="/events" className="btn btn-secondary">
              Back to the events calendar
            </Link>
          </aside>
        </div>
      </>
    );
  });
}
