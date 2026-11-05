import { cachedSanityStaticParams } from "@maricopa-senior-living/sanity/live";
import { queryPagePaths } from "@maricopa-senior-living/sanity/queries";
import type { Metadata } from "next";
import { Suspense } from "react";

import { pageMetadata, renderCmsPage } from "@/lib/cms-page";
import { Loading } from "@/lib/draft";

type Params = Promise<{ slug: string }>;

export async function generateStaticParams() {
  const { data } = await cachedSanityStaticParams({ query: queryPagePaths });
  const slugs = (data ?? [])
    .filter((p) => p.section === "general" && p.slug)
    .map((p) => ({ slug: p.slug as string }));
  return slugs.length ? slugs : [{ slug: "quick-links" }];
}

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  return pageMetadata((await params).slug, "general");
}

/**
 * Params are request data for paths not built ahead of time, so the content
 * renders inside Suspense; prebuilt paths are still fully static.
 */
export default function GeneralPage({ params }: { params: Params }) {
  return (
    <Suspense fallback={<Loading />}>
      <GeneralPageContent params={params} />
    </Suspense>
  );
}

async function GeneralPageContent({ params }: { params: Params }) {
  return renderCmsPage((await params).slug, "general");
}
