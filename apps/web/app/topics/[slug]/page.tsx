import {
  cachedSanity,
  cachedSanityMetadata,
  cachedSanityStaticParams,
} from "@maricopa-senior-living/sanity/live";
import {
  queryTopic,
  queryTopics,
} from "@maricopa-senior-living/sanity/queries";
import { MapPin } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";

import { ArticleCard, HelpfulLinkCard, ResourceCard } from "@/components/cards";
import { JsonLd } from "@/components/json-ld";
import { PageHeader } from "@/components/page-header";
import { draftAware, Loading } from "@/lib/draft";
import { seoMetadata } from "@/lib/seo";
import { topicLd } from "@/lib/structured-data";

type Params = Promise<{ slug: string }>;

/** Nearest first, so a long topic reads as four short lists. */
const AREAS = [
  { value: "maricopa", label: "In Maricopa" },
  { value: "pinal", label: "Pinal County" },
  { value: "arizona", label: "Across Arizona" },
  { value: "national", label: "National" },
];

export async function generateStaticParams() {
  const { data } = await cachedSanityStaticParams({ query: queryTopics });
  return (data ?? [])
    .filter((t) => t.slug)
    .map((t) => ({ slug: t.slug as string }));
}

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { slug } = await params;
  const { data } = await cachedSanityMetadata({
    query: queryTopic,
    params: { slug },
    perspective: "published",
  });
  return data
    ? seoMetadata({
        title: data.title,
        description: data.description,
        path: `/topics/${slug}`,
      })
    : {};
}

/**
 * Params are request data for paths not built ahead of time, so the content
 * renders inside Suspense; prebuilt paths are still fully static.
 */
export default function TopicPage({ params }: { params: Params }) {
  return (
    <Suspense fallback={<Loading />}>
      <TopicPageContent params={params} />
    </Suspense>
  );
}

async function TopicPageContent({ params }: { params: Params }) {
  const { slug } = await params;
  return draftAware(async ({ perspective, stega }) => {
    const { data: topic } = await cachedSanity({
      query: queryTopic,
      params: { slug },
      perspective,
      stega,
    });
    if (!topic) notFound();
    const resources = topic.resources ?? [];
    const groups = AREAS.map((area) => ({
      ...area,
      items: resources.filter(
        (r) => (r.serviceArea ?? "maricopa") === area.value,
      ),
    })).filter((group) => group.items.length);
    return (
      <>
        <JsonLd
          data={topicLd({ ...topic, resources: topic.resources ?? [] })}
        />
        <PageHeader
          title={topic.title ?? "Topic"}
          intro={topic.description}
          crumbs={[
            { label: "Find help", href: "/resources" },
            { label: topic.title ?? "Topic", href: `/topics/${slug}` },
          ]}
        >
          <nav
            aria-label="On this page"
            className="no-print mt-5 flex flex-wrap gap-3"
          >
            {resources.length ? (
              <a href="#resources" className="btn btn-secondary">
                Places to call ({resources.length})
              </a>
            ) : null}
            {topic.linkCount ? (
              <a href="#links" className="btn btn-secondary">
                Helpful reading ({topic.linkCount})
              </a>
            ) : null}
            {topic.articles?.length ? (
              <a href="#articles" className="btn btn-secondary">
                Our articles
              </a>
            ) : null}
            <Link
              href={`/resources/print?topic=${slug}`}
              className="btn btn-secondary"
            >
              Printable list
            </Link>
          </nav>
        </PageHeader>
        <div className="container-page flex flex-col gap-12 py-8">
          {resources.length ? (
            <section id="resources" aria-labelledby="resources-h">
              <h2 id="resources-h" className="ruled">
                Places to call or visit
              </h2>
              <p className="muted mt-2 measure">
                Closest to home first: Maricopa, then Pinal County, then
                statewide and national services.
              </p>
              {groups.length > 1 ? (
                <nav
                  aria-label="Jump to an area"
                  className="no-print mt-4 flex flex-wrap gap-2"
                >
                  {groups.map((group) => (
                    <a
                      key={group.value}
                      href={`#area-${group.value}`}
                      className="chip"
                    >
                      {group.label} ({group.items.length})
                    </a>
                  ))}
                </nav>
              ) : null}
              {groups.map((group) => (
                <div
                  key={group.value}
                  id={`area-${group.value}`}
                  className="mt-8 scroll-mt-4"
                >
                  <h3 className="ruled flex items-center gap-3 text-[1.5rem]">
                    <MapPin
                      className="size-6 text-[var(--msl-clay)]"
                      aria-hidden="true"
                    />
                    {group.label}
                    <span className="muted text-base font-normal">
                      {group.items.length}{" "}
                      {group.items.length === 1 ? "place" : "places"}
                    </span>
                  </h3>
                  <ul className="mt-4 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {group.items.map((resource) => (
                      <li key={resource._id}>
                        <ResourceCard resource={resource} hideArea />
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </section>
          ) : null}
          {topic.links?.length ? (
            <section id="links" aria-labelledby="links-h">
              <h2 id="links-h" className="ruled">
                Helpful reading from other websites
              </h2>
              <ul className="mt-4 grid gap-4 md:grid-cols-2">
                {topic.links.map((link) => (
                  <li key={link._id}>
                    <HelpfulLinkCard link={link} />
                  </li>
                ))}
              </ul>
              {(topic.linkCount ?? 0) > (topic.links.length ?? 0) ? (
                <p className="mt-5">
                  <Link
                    href={`/links?topic=${slug}`}
                    className="btn btn-secondary"
                  >
                    See all {topic.linkCount} helpful links
                  </Link>
                </p>
              ) : null}
            </section>
          ) : null}
          {topic.articles?.length ? (
            <section id="articles" aria-labelledby="articles-h">
              <h2 id="articles-h" className="ruled">
                Articles from Maricopa Senior Living
              </h2>
              <ul className="mt-4 grid gap-4 md:grid-cols-3">
                {topic.articles.map((article) => (
                  <li key={article._id}>
                    <ArticleCard article={article} />
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
