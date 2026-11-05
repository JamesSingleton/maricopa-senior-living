import {
  cachedSanity,
  cachedSanityMetadata,
  cachedSanityStaticParams,
} from "@maricopa-senior-living/sanity/live";
import {
  queryArticle,
  queryArticlePaths,
} from "@maricopa-senior-living/sanity/queries";
import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";

import { PageHeader } from "@/components/page-header";
import { RichText } from "@/components/rich-text";
import { SanityImage } from "@/components/sanity-image";
import { formatLongDate } from "@/lib/dates";
import { draftAware, Loading } from "@/lib/draft";
import { redirectOrNotFound } from "@/lib/redirects";

type Params = Promise<{ slug: string }>;

export async function generateStaticParams() {
  const { data } = await cachedSanityStaticParams({ query: queryArticlePaths });
  return (data ?? []).filter(Boolean).map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { slug } = await params;
  const { data } = await cachedSanityMetadata({
    query: queryArticle,
    params: { slug },
    perspective: "published",
  });
  if (!data) return {};
  return {
    title: data.title ?? undefined,
    description: data.summary ?? undefined,
    alternates: { canonical: `/articles/${slug}` },
    openGraph: {
      type: "article",
      publishedTime: data.publishedAt ?? undefined,
      authors: data.author?.name ? [data.author.name] : undefined,
    },
  };
}

/**
 * Params are request data for paths not built ahead of time, so the content
 * renders inside Suspense; prebuilt paths are still fully static.
 */
export default function ArticlePage({ params }: { params: Params }) {
  return (
    <Suspense fallback={<Loading />}>
      <ArticlePageContent params={params} />
    </Suspense>
  );
}

async function ArticlePageContent({ params }: { params: Params }) {
  const { slug } = await params;
  return draftAware(async ({ perspective, stega }) => {
    const { data: article } = await cachedSanity({
      query: queryArticle,
      params: { slug },
      perspective,
      stega,
    });
    // Old article URLs that became helpful links, About pages, etc.
    if (!article) return redirectOrNotFound(`/articles/${slug}`);
    return (
      <article>
        <PageHeader
          title={article.title ?? "Article"}
          eyebrow={
            String(article.series) === "joans-corner" ? "Joan's Corner" : null
          }
          crumbs={[{ label: "Articles", href: "/articles" }]}
        >
          <p className="mt-3 text-lg">
            {article.author?.slug ? (
              <Link href={`/writers/${article.author.slug}`}>
                {article.author.name}
              </Link>
            ) : (
              article.author?.name
            )}
            {article.publishedAt
              ? ` · ${formatLongDate(article.publishedAt)}`
              : ""}
          </p>
        </PageHeader>
        <div className="container-page py-8">
          {article.mainImage?.id ? (
            <SanityImage
              image={article.mainImage}
              width={1200}
              className="mb-8 h-auto w-full max-w-3xl rounded-md"
            />
          ) : null}
          <RichText value={article.body} />
          {article.topics?.length ? (
            <aside className="mt-12 border-t-2 border-[var(--msl-line)] pt-6">
              <h2 className="text-xl">Find more help</h2>
              <ul className="mt-3 flex flex-wrap gap-3">
                {article.topics.map((t) => (
                  <li key={t.slug}>
                    <Link
                      href={`/topics/${t.slug}`}
                      className="btn btn-secondary"
                    >
                      {t.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </aside>
          ) : null}
        </div>
      </article>
    );
  });
}
