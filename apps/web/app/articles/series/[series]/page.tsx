import { cachedSanity } from "@maricopa-senior-living/sanity/live";
import {
  queryArticlesCount,
  queryArticlesSlice,
} from "@maricopa-senior-living/sanity/queries";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";

import { ArticleCard, type ArticleCardData } from "@/components/cards";
import { PageHeader } from "@/components/page-header";
import { draftAware, Loading } from "@/lib/draft";

const SERIES: Record<string, { title: string; intro: string }> = {
  "joans-corner": {
    title: "Joan's Corner",
    intro:
      "Joan Koczor wrote these columns for Maricopa's seniors and founded the newsletter “Keeping you informed”. We keep her writing here in her memory.",
  },
  "rons-ramblings": {
    title: "Ron's Ramblings",
    intro: "Thoughts and notes from Ron Smith.",
  },
};

type Params = Promise<{ series: string }>;

export function generateStaticParams() {
  return Object.keys(SERIES).map((series) => ({ series }));
}

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { series } = await params;
  return SERIES[series]
    ? { title: SERIES[series].title, description: SERIES[series].intro }
    : {};
}

/**
 * Params are request data for paths not built ahead of time, so the content
 * renders inside Suspense; prebuilt paths are still fully static.
 */
export default function SeriesPage({ params }: { params: Params }) {
  return (
    <Suspense fallback={<Loading />}>
      <SeriesPageContent params={params} />
    </Suspense>
  );
}

async function SeriesPageContent({ params }: { params: Params }) {
  const { series } = await params;
  const info = SERIES[series];
  if (!info) notFound();
  return draftAware(async ({ perspective, stega }) => {
    const filters = { series, topicId: "" };
    const [{ data: items }, { data: total }] = await Promise.all([
      cachedSanity({
        query: queryArticlesSlice(0, 200),
        params: filters,
        perspective,
        stega,
      }),
      cachedSanity({
        query: queryArticlesCount,
        params: filters,
        perspective,
        stega,
      }),
    ]);
    const articles = (items ?? []) as ArticleCardData[];
    return (
      <>
        <PageHeader
          title={info.title}
          intro={info.intro}
          crumbs={[
            { label: "Articles", href: "/articles" },
            { label: info.title, href: `/articles/series/${series}` },
          ]}
        />
        <div className="container-page py-8">
          <p className="text-lg">
            {typeof total === "number" ? total : articles.length} articles
          </p>
          <ul className="mt-4 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {articles.map((article) => (
              <li key={article._id}>
                <ArticleCard article={article} />
              </li>
            ))}
          </ul>
        </div>
      </>
    );
  });
}
