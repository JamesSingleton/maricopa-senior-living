import {
  type DynamicFetchOptions,
  getDynamicFetchOptions,
  sanityFetch,
  sanityFetchMetadata,
} from "@maricopa-senior-living/sanity/live";
import { buildMetadata } from "@maricopa-senior-living/sanity/metadata";
import { queryHomePage, querySiteSettings } from "@maricopa-senior-living/sanity/queries";
import type { Metadata } from "next";
import { draftMode } from "next/headers";
import { Suspense } from "react";

import { JsonLd } from "@/components/JsonLd";
import { PageBuilder } from "@/components/page-builder/PageBuilder";
import { webSiteJsonLd } from "@/lib/json-ld";

export async function generateMetadata(): Promise<Metadata> {
  const [{ perspective }, { data: home }, { data: settings }] = await Promise.all([
    getDynamicFetchOptions(),
    sanityFetchMetadata({ query: queryHomePage, perspective: "published" }),
    sanityFetchMetadata({ query: querySiteSettings, perspective: "published" }),
  ]);
  const siteTitle = (settings as { title?: string })?.title;
  const homeData = home as { seo?: Parameters<typeof buildMetadata>[0]["seo"]; title?: string } | null;

  return buildMetadata({
    seo: homeData?.seo,
    fallbackTitle: siteTitle ?? "Maricopa Senior Resource Hub",
    fallbackDescription:
      (settings as { description?: string })?.description ??
      "Local resources, guides, and news for seniors in Maricopa, Arizona.",
    path: "/",
    siteTitle,
  });
}

export default async function Home() {
  const { isEnabled: isDraftMode } = await draftMode();

  if (isDraftMode) {
    return (
      <Suspense fallback={<HomeFallback />}>
        <DynamicHome />
      </Suspense>
    );
  }

  return <CachedHome perspective="published" stega={false} />;
}

async function DynamicHome() {
  const { perspective, stega } = await getDynamicFetchOptions();
  return <CachedHome perspective={perspective} stega={stega} />;
}

async function CachedHome({ perspective, stega }: DynamicFetchOptions) {
  "use cache";
  const { data: homePageData } = await sanityFetch({
    query: queryHomePage,
    perspective,
    stega,
  });
  const home = homePageData as { pageBuilder?: [] } | null;

  return (
    <>
      <JsonLd data={webSiteJsonLd("Maricopa Senior Resource Hub")} />
      <PageBuilder blocks={home?.pageBuilder ?? []} />
    </>
  );
}

function HomeFallback() {
  return (
    <div className="space-y-8" aria-busy>
      <div className="h-48 animate-pulse rounded-2xl bg-muted" />
      <div className="space-y-4">
        <div className="h-6 w-2/3 animate-pulse rounded bg-muted" />
        <div className="h-4 animate-pulse rounded bg-muted" />
        <div className="h-4 w-5/6 animate-pulse rounded bg-muted" />
      </div>
    </div>
  );
}
