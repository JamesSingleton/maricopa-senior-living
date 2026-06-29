import {
  type DynamicFetchOptions,
  getDynamicFetchOptions,
  sanityFetch,
  sanityFetchStaticParams,
} from "@maricopa-senior-living/sanity/live";
import {
  queryAllPageSlugs,
  queryPageBySlug,
} from "@maricopa-senior-living/sanity/queries";
import { draftMode } from "next/headers";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import type { PortableTextBlock } from "sanity";

import { CustomPortableText } from "@/components/CustomPortableText";

type PageData = {
  title: string;
  body: PortableTextBlock[];
} | null;

export async function generateStaticParams() {
  const { data } = await sanityFetchStaticParams({ query: queryAllPageSlugs });
  return data ?? [];
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
  const pageData = data as PageData;

  if (!pageData) {
    notFound();
  }

  return (
    <>
      <h1 className="inline-block align-middle text-4xl font-semibold capitalize sm:text-5xl md:text-6xl">
        {pageData.title}
      </h1>
      <section className="prose prose-lg prose-indigo pt-4 text-sm font-medium text-zinc-500 sm:text-base md:text-lg lg:max-w-none">
        <CustomPortableText value={pageData.body} />
      </section>
    </>
  );
}

function PageFallback() {
  return (
    <div aria-busy>
      <div className="h-12 w-2/3 animate-pulse rounded bg-zinc-200" />
      <div className="mt-4 space-y-3">
        <div className="h-4 animate-pulse rounded bg-zinc-200" />
        <div className="h-4 animate-pulse rounded bg-zinc-200" />
        <div className="h-4 w-5/6 animate-pulse rounded bg-zinc-200" />
      </div>
    </div>
  );
}
