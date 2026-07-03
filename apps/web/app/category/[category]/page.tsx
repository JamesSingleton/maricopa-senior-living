import {
  type DynamicFetchOptions,
  getDynamicFetchOptions,
  sanityFetch,
  sanityFetchMetadata,
  sanityFetchStaticParams,
} from "@maricopa-senior-living/sanity/live";
import { buildMetadata } from "@maricopa-senior-living/sanity/metadata";
import {
  queryCategoryBySlug,
  queryCategoryContent,
  queryCategorySlugs,
  querySiteSettings,
} from "@maricopa-senior-living/sanity/queries";
import type { Metadata } from "next";
import { draftMode } from "next/headers";
import { notFound } from "next/navigation";
import { Suspense } from "react";

import { ArticleCard } from "@/components/ArticleCard";
import { CustomPortableText } from "@/components/CustomPortableText";
import { GuideCard } from "@/components/GuideCard";
import { JsonLd } from "@/components/JsonLd";
import { breadcrumbJsonLd } from "@/lib/json-ld";
import { ResourceCard } from "@/components/ResourceCard";

export async function generateStaticParams() {
  const { data } = await sanityFetchStaticParams({ query: queryCategorySlugs });
  return ((data ?? []) as { slug: string }[]).map((item) => ({
    category: item.slug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string }>;
}): Promise<Metadata> {
  const [{ category }, { perspective }, { data: settings }] = await Promise.all([
    params,
    getDynamicFetchOptions(),
    sanityFetchMetadata({ query: querySiteSettings, perspective: "published" }),
  ]);
  const { data } = await sanityFetchMetadata({
    query: queryCategoryBySlug,
    params: { slug: category },
    perspective,
  });
  if (!data) return {};
  const cat = data as {
    title?: string;
    descriptionText?: string;
    seo?: Parameters<typeof buildMetadata>[0]["seo"];
  };
  return buildMetadata({
    seo: cat.seo,
    fallbackTitle: cat.title ?? "Category",
    fallbackDescription: cat.descriptionText,
    path: `/category/${category}`,
    siteTitle: (settings as { title?: string })?.title,
  });
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { isEnabled: isDraftMode } = await draftMode();

  if (isDraftMode) {
    return (
      <Suspense fallback={<CategoryFallback />}>
        <DynamicCategoryPage params={params} />
      </Suspense>
    );
  }

  const { category } = await params;
  return (
    <CachedCategoryPage
      category={category}
      perspective="published"
      stega={false}
    />
  );
}

async function DynamicCategoryPage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const [{ category }, { perspective, stega }] = await Promise.all([
    params,
    getDynamicFetchOptions(),
  ]);
  return (
    <CachedCategoryPage category={category} perspective={perspective} stega={stega} />
  );
}

async function CachedCategoryPage({
  category,
  perspective,
  stega,
}: { category: string } & DynamicFetchOptions) {
  "use cache";
  const [{ data: categoryData }, { data: content }] = await Promise.all([
    sanityFetch({
      query: queryCategoryBySlug,
      params: { slug: category },
      perspective,
      stega,
    }),
    sanityFetch({
      query: queryCategoryContent,
      params: { slug: category },
      perspective,
      stega,
    }),
  ]);

  const cat = categoryData as {
    title?: string;
    description?: [];
    descriptionText?: string;
  } | null;
  if (!cat) notFound();

  const items = content as {
    resources?: [];
    articles?: [];
    guides?: [];
  } | null;

  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: cat.title ?? "Category", path: `/category/${category}` },
        ])}
      />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          name: cat.title,
          description: cat.descriptionText,
        }}
      />
      <h1 className="font-serif text-3xl font-semibold tracking-tight md:text-4xl">
        {cat.title}
      </h1>
      {cat.description?.length ? (
        <div className="prose prose-lg mt-4 max-w-2xl text-muted-foreground">
          <CustomPortableText value={cat.description} />
        </div>
      ) : null}
      <div className="mt-10 space-y-8">
        {(items?.resources ?? []).map((r) => (
          <ResourceCard key={(r as { _id: string })._id} resource={r} />
        ))}
        {(items?.articles ?? []).map((a) => (
          <ArticleCard key={(a as { _id: string })._id} article={a} />
        ))}
        {(items?.guides ?? []).map((g) => (
          <GuideCard key={(g as { _id: string })._id} guide={g} />
        ))}
      </div>
    </>
  );
}

function CategoryFallback() {
  return <div className="space-y-6" aria-busy>
    <div className="h-10 w-2/3 animate-pulse rounded bg-muted" />
    <div className="h-32 animate-pulse rounded-xl bg-muted" />
  </div>;
}
