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
    .filter((p) => p.section === "about" && p.slug)
    .map((p) => ({ slug: p.slug as string }));
  return slugs.length ? slugs : [{ slug: "who-we-are" }];
}

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  return pageMetadata((await params).slug, "about");
}

/**
 * Params are request data for paths not built ahead of time, so the content
 * renders inside Suspense; prebuilt paths are still fully static.
 */
export default function AboutPage({ params }: { params: Params }) {
  return (
    <Suspense fallback={<Loading />}>
      <AboutPageContent params={params} />
    </Suspense>
  );
}

async function AboutPageContent({ params }: { params: Params }) {
  return renderCmsPage((await params).slug, "about");
}
