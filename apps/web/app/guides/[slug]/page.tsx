import {
  type DynamicFetchOptions,
  getDynamicFetchOptions,
  sanityFetch,
  sanityFetchMetadata,
  sanityFetchStaticParams,
} from "@maricopa-senior-living/sanity/live";
import { buildMetadata } from "@maricopa-senior-living/sanity/metadata";
import {
  queryGuideBySlug,
  queryGuideSlugs,
  querySiteSettings,
} from "@maricopa-senior-living/sanity/queries";
import type { Metadata } from "next";
import { draftMode } from "next/headers";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";

import BackButton from "@/components/BackButton";
import { CustomPortableText } from "@/components/CustomPortableText";
import ImageComponent from "@/components/ImageComponent";
import { JsonLd } from "@/components/JsonLd";
import { breadcrumbJsonLd } from "@/lib/json-ld";

export async function generateStaticParams() {
  const { data } = await sanityFetchStaticParams({ query: queryGuideSlugs });
  return data ?? [];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const [{ slug }, { perspective }, { data: settings }] = await Promise.all([
    params,
    getDynamicFetchOptions(),
    sanityFetchMetadata({ query: querySiteSettings, perspective: "published" }),
  ]);
  const { data: guide } = await sanityFetchMetadata({
    query: queryGuideBySlug,
    params: { slug },
    perspective,
  });
  if (!guide) return {};
  const guideData = guide as {
    title?: string;
    excerpt?: string;
    seo?: Parameters<typeof buildMetadata>[0]["seo"];
    lastUpdated?: string;
    _updatedAt?: string;
  };
  return buildMetadata({
    seo: guideData.seo,
    fallbackTitle: guideData.title ?? "Guide",
    fallbackDescription: guideData.excerpt,
    path: `/guides/${slug}`,
    siteTitle: (settings as { title?: string })?.title,
    modifiedTime: guideData.lastUpdated ?? guideData._updatedAt,
  });
}

export default async function GuidePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { isEnabled: isDraftMode } = await draftMode();
  if (isDraftMode) {
    return (
      <Suspense fallback={<GuideFallback />}>
        <DynamicGuidePage params={params} />
      </Suspense>
    );
  }
  const { slug } = await params;
  return <CachedGuidePage slug={slug} perspective="published" stega={false} />;
}

async function DynamicGuidePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const [{ slug }, { perspective, stega }] = await Promise.all([
    params,
    getDynamicFetchOptions(),
  ]);
  return <CachedGuidePage slug={slug} perspective={perspective} stega={stega} />;
}

async function CachedGuidePage({
  slug,
  perspective,
  stega,
}: { slug: string } & DynamicFetchOptions) {
  "use cache";
  const { data } = await sanityFetch({
    query: queryGuideBySlug,
    params: { slug },
    perspective,
    stega,
  });
  const guide = data as {
    title?: string;
    excerpt?: string;
    body?: [];
    steps?: { title: string; body?: string }[];
    mainImage?: Parameters<typeof ImageComponent>[0]["image"];
    author?: { name?: string };
    lastUpdated?: string;
    tags?: { _id: string; title: string; slug: string }[];
  } | null;
  if (!guide) notFound();

  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Guides", path: "/guides" },
          { name: guide.title ?? "Guide", path: `/guides/${slug}` },
        ])}
      />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "HowTo",
          name: guide.title,
          dateModified: guide.lastUpdated,
          step: guide.steps?.map((step, i) => ({
            "@type": "HowToStep",
            position: i + 1,
            name: step.title,
            text: step.body,
          })),
        }}
      />
      <BackButton />
      <article className="rounded-xl border border-border bg-card shadow-sm">
        <div className="px-6 py-8 sm:px-10">
          <p className="text-sm text-muted-foreground">
            {guide.author?.name ? `${guide.author.name} · ` : ""}
            {guide.lastUpdated ? `Updated ${guide.lastUpdated}` : ""}
          </p>
          <h1 className="mt-2 font-serif text-3xl font-semibold tracking-tight md:text-4xl">
            {guide.title}
          </h1>
          {guide.mainImage ? (
            <div className="mt-6 overflow-hidden rounded-lg">
              <ImageComponent
                image={guide.mainImage}
                alt={(guide.mainImage as { alt?: string })?.alt ?? ""}
                width={1024}
                height={640}
                className="w-full"
              />
            </div>
          ) : null}
          {guide.steps?.length ? (
            <ol className="mt-8 space-y-6">
              {guide.steps.map((step, i) => (
                <li key={step.title} className="rounded-lg border border-border p-5">
                  <h2 className="font-serif text-xl font-semibold">
                    Step {i + 1}: {step.title}
                  </h2>
                  {step.body ? (
                    <p className="mt-2 text-muted-foreground">{step.body}</p>
                  ) : null}
                </li>
              ))}
            </ol>
          ) : null}
          <div className="prose prose-lg mt-8 max-w-none">
            <CustomPortableText value={guide.body ?? []} />
          </div>
          {guide.tags?.length ? (
            <div className="mt-10 border-t border-border pt-6">
              <h2 className="text-lg font-semibold">Tags</h2>
              <ul className="mt-3 flex flex-wrap gap-2">
                {guide.tags.map((tag) => (
                  <li key={tag._id}>
                    <Link
                      href={`/tags/${tag.slug}`}
                      className="rounded-full bg-muted px-3 py-1 text-sm hover:bg-primary hover:text-primary-foreground"
                      prefetch={false}
                    >
                      {tag.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </div>
      </article>
    </>
  );
}

function GuideFallback() {
  return <div className="h-96 animate-pulse rounded-xl bg-muted" aria-busy />;
}
