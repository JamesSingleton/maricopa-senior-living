import {
  type DynamicFetchOptions,
  getDynamicFetchOptions,
  sanityFetch,
  sanityFetchMetadata,
  sanityFetchStaticParams,
} from "@maricopa-senior-living/sanity/live";
import { buildMetadata } from "@maricopa-senior-living/sanity/metadata";
import {
  queryArticleBySlug,
  queryArticleSlugs,
  querySiteSettings,
} from "@maricopa-senior-living/sanity/queries";
import type { Metadata } from "next";
import { draftMode } from "next/headers";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";

import BackButton from "@/components/BackButton";
import { CustomPortableText } from "@/components/CustomPortableText";
import DateComponent from "@/components/Date";
import ImageComponent from "@/components/ImageComponent";
import { JsonLd } from "@/components/JsonLd";
import { breadcrumbJsonLd } from "@/lib/json-ld";

export async function generateStaticParams() {
  const { data } = await sanityFetchStaticParams({ query: queryArticleSlugs });
  return data ?? [];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const [{ slug }, { perspective }, { data: settings }] = await Promise.all([
    params,
    getDynamicFetchOptions(),
    sanityFetchMetadata({ query: querySiteSettings, perspective: "published" }),
  ]);
  const { data: article } = await sanityFetchMetadata({
    query: queryArticleBySlug,
    params: { slug },
    perspective,
  });
  if (!article) return {};

  const articleData = article as {
    title?: string;
    excerpt?: string;
    seo?: Parameters<typeof buildMetadata>[0]["seo"];
    publishedAt?: string;
    _updatedAt?: string;
    syndication?: { originalUrl?: string };
  };

  return buildMetadata({
    seo: articleData.seo,
    fallbackTitle: articleData.title ?? "Article",
    fallbackDescription: articleData.excerpt,
    path: `/articles/${slug}`,
    siteTitle: (settings as { title?: string })?.title,
    type: "article",
    canonicalUrl: articleData.syndication?.originalUrl,
    publishedTime: articleData.publishedAt,
    modifiedTime: articleData._updatedAt,
  });
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { isEnabled: isDraftMode } = await draftMode();

  if (isDraftMode) {
    return (
      <Suspense fallback={<ArticleFallback />}>
        <DynamicArticlePage params={params} />
      </Suspense>
    );
  }

  const { slug } = await params;
  return <CachedArticlePage slug={slug} perspective="published" stega={false} />;
}

async function DynamicArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const [{ slug }, { perspective, stega }] = await Promise.all([
    params,
    getDynamicFetchOptions(),
  ]);
  return <CachedArticlePage slug={slug} perspective={perspective} stega={stega} />;
}

async function CachedArticlePage({
  slug,
  perspective,
  stega,
}: { slug: string } & DynamicFetchOptions) {
  "use cache";
  const { data } = await sanityFetch({
    query: queryArticleBySlug,
    params: { slug },
    perspective,
    stega,
  });
  const article = data as {
    title?: string;
    body?: [];
    mainImage?: Parameters<typeof ImageComponent>[0]["image"];
    author?: { name?: string; image?: Parameters<typeof ImageComponent>[0]["image"] };
    publishedAt?: string;
    contentSource?: string;
    syndication?: { attribution?: string; originalUrl?: string };
    tags?: { _id: string; title: string; slug: string }[];
  } | null;

  if (!article) notFound();

  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Articles", path: "/articles" },
          { name: article.title ?? "Article", path: `/articles/${slug}` },
        ])}
      />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Article",
          headline: article.title,
          datePublished: article.publishedAt,
          author: article.author?.name
            ? { "@type": "Person", name: article.author.name }
            : undefined,
          ...(article.syndication?.originalUrl
            ? { isBasedOn: article.syndication.originalUrl }
            : {}),
        }}
      />
      <BackButton />
      <article className="rounded-xl border border-border bg-card shadow-sm">
        <div className="px-6 py-8 sm:px-10">
          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
            {article.author?.name ? <span>{article.author.name}</span> : null}
            {article.publishedAt ? (
              <DateComponent dateString={article.publishedAt} />
            ) : null}
            {article.contentSource === "syndicated" ? (
              <span className="rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-900">
                Syndicated
              </span>
            ) : null}
          </div>
          <h1 className="mt-4 font-serif text-3xl font-semibold tracking-tight md:text-4xl">
            {article.title}
          </h1>
          {article.syndication?.attribution ? (
            <p className="mt-3 text-sm italic text-muted-foreground">
              {article.syndication.attribution}
            </p>
          ) : null}
          {article.mainImage ? (
            <div className="mt-6 overflow-hidden rounded-lg">
              <ImageComponent
                image={article.mainImage}
                alt={(article.mainImage as { alt?: string })?.alt ?? ""}
                width={1024}
                height={640}
                className="w-full"
              />
            </div>
          ) : null}
          <div className="prose prose-lg mt-8 max-w-none">
            <CustomPortableText value={article.body ?? []} />
          </div>
          {article.tags?.length ? (
            <div className="mt-10 border-t border-border pt-6">
              <h2 className="text-lg font-semibold">Tags</h2>
              <ul className="mt-3 flex flex-wrap gap-2">
                {article.tags.map((tag) => (
                  <li key={tag._id}>
                    <Link
                      href={`/tags/${tag.slug}`}
                      className="rounded-full bg-muted px-3 py-1 text-sm hover:bg-primary hover:text-primary-foreground"
                      prefetch={false}
                    >
                      {tag.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </div>
      </article>
    </>
  );
}

function ArticleFallback() {
  return <div className="h-96 animate-pulse rounded-xl bg-muted" aria-busy />;
}
