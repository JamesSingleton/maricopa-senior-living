import {
  type DynamicFetchOptions,
  getDynamicFetchOptions,
  sanityFetch,
  sanityFetchMetadata,
  sanityFetchStaticParams,
} from "@maricopa-senior-living/sanity/live";
import {
  queryCategoryBySlug,
  queryCategoryPaths,
} from "@maricopa-senior-living/sanity/queries";
import type { Metadata, ResolvingMetadata } from "next";
import { draftMode } from "next/headers";
import { notFound } from "next/navigation";
import { Suspense } from "react";

import ArticleCard from "@/components/ArticleCard";
import { CustomPortableText } from "@/components/CustomPortableText";
import DirectoryCard from "@/components/DirectoryCard";
import { baseUrl } from "@/lib/constants";
import type { CategoryPageProps } from "@/types/common";

export async function generateStaticParams() {
  const { data } = await sanityFetchStaticParams({ query: queryCategoryPaths });
  return data ?? [];
}

export async function generateMetadata(
  {
    params,
  }: {
    params: Promise<{ category: string }>;
  },
  parent: ResolvingMetadata,
): Promise<Metadata> {
  const [{ category: categoryParam }, { perspective }] = await Promise.all([
    params,
    getDynamicFetchOptions(),
  ]);
  const { data } = await sanityFetchMetadata({
    query: queryCategoryBySlug,
    params: { slug: categoryParam },
    perspective,
  });
  const category = data as CategoryPageProps | null;
  const previousOpenGraph = (await parent)?.openGraph;

  if (!category) {
    return {};
  }

  return {
    title: `${category.title}`,
    description: `${category.excerpt}`,
    openGraph: {
      ...previousOpenGraph,
      title: `${category.title}`,
      description: `${category.excerpt}`,
      url: `${baseUrl}/category/${category.slug}`,
    },
  };
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
    <CachedCategoryPage
      category={category}
      perspective={perspective}
      stega={stega}
    />
  );
}

async function CachedCategoryPage({
  category,
  perspective,
  stega,
}: { category: string } & DynamicFetchOptions) {
  "use cache";
  const { data } = await sanityFetch({
    query: queryCategoryBySlug,
    params: { slug: category },
    perspective,
    stega,
  });
  const categoryData = data as CategoryPageProps | null;

  if (!categoryData) {
    notFound();
  }

  return (
    <>
      <h1 className="inline-block align-middle text-4xl font-semibold capitalize sm:text-5xl md:text-6xl">
        {categoryData.title}
      </h1>
      {categoryData.description && (
        <CustomPortableText
          value={categoryData.description}
          paragraphClasses="prose prose-lg prose-indigo text-sm font-medium text-zinc-500 sm:text-base md:text-lg lg:max-w-none pt-4"
        />
      )}
      <section className="space-y-8 pt-4">
        {categoryData.combinedList.map((item: any) => {
          if (item._type === "post") {
            return <ArticleCard key={item._id} post={item} />;
          }
          return <DirectoryCard key={item._id} directoryItem={item} />;
        })}
      </section>
    </>
  );
}

function CategoryFallback() {
  return (
    <div aria-busy>
      <div className="h-12 w-2/3 animate-pulse rounded bg-zinc-200" />
      <div className="mt-8 space-y-8">
        {Array.from({ length: 3 }).map((_, index) => (
          <div key={index} className="h-32 animate-pulse rounded bg-zinc-200" />
        ))}
      </div>
    </div>
  );
}
