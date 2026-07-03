import {
  type DynamicFetchOptions,
  getDynamicFetchOptions,
  sanityFetch,
  sanityFetchMetadata,
  sanityFetchStaticParams,
} from "@maricopa-senior-living/sanity/live";
import { buildMetadata } from "@maricopa-senior-living/sanity/metadata";
import {
  queryPageBySlug,
  queryPageSlugs,
  querySiteSettings,
} from "@maricopa-senior-living/sanity/queries";
import type { Metadata } from "next";
import { draftMode } from "next/headers";
import { notFound } from "next/navigation";
import { Suspense } from "react";

import { JsonLd } from "@/components/JsonLd";
import { PageBuilder } from "@/components/page-builder/PageBuilder";
import { breadcrumbJsonLd } from "@/lib/json-ld";

export async function generateStaticParams() {
  const { data } = await sanityFetchStaticParams({ query: queryPageSlugs });
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
  const { data } = await sanityFetchMetadata({
    query: queryPageBySlug,
    params: { slug },
    perspective,
  });
  if (!data) return {};
  const page = data as {
    title?: string;
    seo?: Parameters<typeof buildMetadata>[0]["seo"];
  };
  return buildMetadata({
    seo: page.seo,
    fallbackTitle: page.title ?? "Page",
    path: `/${slug}`,
    siteTitle: (settings as { title?: string })?.title,
  });
}

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { isEnabled: isDraftMode } = await draftMode();

  if (isDraftMode) {
    return (
      <Suspense fallback={<PageFallback />}>
        <DynamicPage params={params} />
      </Suspense>
    );
  }

  const { slug } = await params;
  return <CachedPage slug={slug} perspective="published" stega={false} />;
}

async function DynamicPage({ params }: { params: Promise<{ slug: string }> }) {
  const [{ slug }, { perspective, stega }] = await Promise.all([
    params,
    getDynamicFetchOptions(),
  ]);
  return <CachedPage slug={slug} perspective={perspective} stega={stega} />;
}

async function CachedPage({
  slug,
  perspective,
  stega,
}: { slug: string } & DynamicFetchOptions) {
  "use cache";
  const { data } = await sanityFetch({
    query: queryPageBySlug,
    params: { slug },
    perspective,
    stega,
  });
  const pageData = data as { title?: string; pageBuilder?: [] } | null;

  if (!pageData) notFound();

  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: pageData.title ?? "Page", path: `/${slug}` },
        ])}
      />
      <PageBuilder blocks={pageData.pageBuilder ?? []} />
    </>
  );
}

function PageFallback() {
  return <div className="h-64 animate-pulse rounded-xl bg-muted" aria-busy />;
}
