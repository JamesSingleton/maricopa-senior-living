import {
  cachedSanity,
  getDynamicFetchOptions,
} from "@maricopa-senior-living/sanity/live";
import {
  queryArticlesCount,
  queryArticlesSlice,
} from "@maricopa-senior-living/sanity/queries";
import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";

import { ArticleCard, type ArticleCardData } from "@/components/cards";
import { PageHeader, Pager } from "@/components/page-header";
import { Loading } from "@/lib/draft";
import { pageParam, type SearchParams } from "@/lib/params";

export const metadata: Metadata = {
  title: "Articles",
  description: "Articles by Ron Smith, Joan Koczor and other Maricopa writers.",
};

const PAGE_SIZE = 12;

export default function ArticlesPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  return (
    <>
      <PageHeader
        title="Articles"
        intro="Written for this website by Ron Smith, Joan Koczor and other local writers."
        crumbs={[{ label: "Articles", href: "/articles" }]}
      >
        <p className="no-print mt-5 flex flex-wrap gap-3">
          <Link
            href="/articles/series/joans-corner"
            className="btn btn-secondary"
          >
            Joan's Corner
          </Link>
          <Link href="/links" className="btn btn-secondary">
            Helpful links from other websites
          </Link>
        </p>
      </PageHeader>
      <Suspense fallback={<Loading />}>
        <ArticleList searchParams={searchParams} />
      </Suspense>
    </>
  );
}

async function ArticleList({ searchParams }: { searchParams: SearchParams }) {
  const [params, { perspective, stega }] = await Promise.all([
    searchParams,
    getDynamicFetchOptions(),
  ]);
  const page = pageParam(params.page);
  const start = (page - 1) * PAGE_SIZE;
  const filters = { series: "", topicId: "" };
  const [{ data: items }, { data: total }] = await Promise.all([
    cachedSanity({
      query: queryArticlesSlice(start, start + PAGE_SIZE),
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
  const count = typeof total === "number" ? total : 0;
  return (
    <div className="container-page py-8">
      <ul className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {articles.map((article) => (
          <li key={article._id}>
            <ArticleCard article={article} />
          </li>
        ))}
      </ul>
      <Pager
        page={page}
        totalPages={Math.max(1, Math.ceil(count / PAGE_SIZE))}
        hrefFor={(p) => `/articles?page=${p}`}
      />
    </div>
  );
}
