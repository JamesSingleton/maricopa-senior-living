import {
  type DynamicFetchOptions,
  getDynamicFetchOptions,
  sanityFetch,
  sanityFetchMetadata,
  sanityFetchStaticParams,
} from "@maricopa-senior-living/sanity/live";
import { buildMetadata } from "@maricopa-senior-living/sanity/metadata";
import {
  querySiteSettings,
  queryTagBySlug,
  queryTagContent,
  queryTagRefCount,
  queryTagSlugs,
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
  const { data } = await sanityFetchStaticParams({ query: queryTagSlugs });
  return ((data ?? []) as { slug: string }[]).map((item) => ({ tag: item.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ tag: string }>;
}): Promise<Metadata> {
  const [{ tag }, { perspective }, { data: settings }] = await Promise.all([
    params,
    getDynamicFetchOptions(),
    sanityFetchMetadata({ query: querySiteSettings, perspective: "published" }),
  ]);
  const { data } = await sanityFetchMetadata({
    query: queryTagBySlug,
    params: { slug: tag },
    perspective,
  });
  if (!data) return {};
  const tagData = data as {
    title?: string;
    descriptionText?: string;
    seo?: Parameters<typeof buildMetadata>[0]["seo"];
  };
  return buildMetadata({
    seo: tagData.seo,
    fallbackTitle: tagData.title ?? "Tag",
    fallbackDescription: tagData.descriptionText,
    path: `/tags/${tag}`,
    siteTitle: (settings as { title?: string })?.title,
  });
}

export default async function TagPage({
  params,
}: {
  params: Promise<{ tag: string }>;
}) {
  const { isEnabled: isDraftMode } = await draftMode();
  if (isDraftMode) {
    return (
      <Suspense fallback={<TagFallback />}>
        <DynamicTagPage params={params} />
      </Suspense>
    );
  }
  const { tag } = await params;
  return <CachedTagPage tag={tag} perspective="published" stega={false} />;
}

async function DynamicTagPage({
  params,
}: {
  params: Promise<{ tag: string }>;
}) {
  const [{ tag }, { perspective, stega }] = await Promise.all([
    params,
    getDynamicFetchOptions(),
  ]);
  return <CachedTagPage tag={tag} perspective={perspective} stega={stega} />;
}

async function CachedTagPage({
  tag,
  perspective,
  stega,
}: { tag: string } & DynamicFetchOptions) {
  "use cache";
  const [{ data: tagData }, { data: refCount }, { data: content }] =
    await Promise.all([
      sanityFetch({
        query: queryTagBySlug,
        params: { slug: tag },
        perspective,
        stega,
      }),
      sanityFetch({
        query: queryTagRefCount,
        params: { slug: tag },
        perspective,
        stega,
      }),
      sanityFetch({
        query: queryTagContent,
        params: { slug: tag },
        perspective,
        stega,
      }),
    ]);

  const t = tagData as {
    title?: string;
    description?: [];
    descriptionText?: string;
  } | null;
  if (!t) notFound();
  if (((refCount as number) ?? 0) < 3) notFound();

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
          { name: t.title ?? "Tag", path: `/tags/${tag}` },
        ])}
      />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          name: t.title,
          description: t.descriptionText,
        }}
      />
      <h1 className="font-serif text-3xl font-semibold tracking-tight md:text-4xl">
        {t.title}
      </h1>
      {t.description?.length ? (
        <div className="prose prose-lg mt-4 max-w-2xl text-muted-foreground">
          <CustomPortableText value={t.description} />
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

function TagFallback() {
  return <div className="h-64 animate-pulse rounded-xl bg-muted" aria-busy />;
}
