import {
  cachedSanity,
  cachedSanityMetadata,
  cachedSanityStaticParams,
  type DynamicFetchOptions,
  getDynamicFetchOptions,
} from "@maricopa-senior-living/sanity/live";
import {
  queryArticleSlugPageData,
  queryRecentArticleSlugs,
} from "@maricopa-senior-living/sanity/queries";
import type { QueryArticleSlugPageDataResult } from "@maricopa-senior-living/sanity/types";
import { CalendarIcon } from "lucide-react";
import type { Metadata } from "next";
import { draftMode } from "next/headers";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";

import BackButton from "@/components/BackButton";
import { CustomPortableText } from "@/components/CustomPortableText";
import DateComponent from "@/components/Date";
import { SanityImage } from "@/components/sanity-image";

export async function generateStaticParams() {
  const { data } = await cachedSanityStaticParams({
    query: queryRecentArticleSlugs,
  });
  return data ?? [];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const [{ slug }, { perspective }] = await Promise.all([
    params,
    getDynamicFetchOptions(),
  ]);
  const { data: post } = await cachedSanityMetadata({
    query: queryArticleSlugPageData,
    params: { slug },
    perspective,
  });

  if (!post) {
    return {};
  }

  return {
    title: post.title ?? undefined,
    description: post.excerpt ?? undefined,
    alternates: { canonical: `/articles/${slug}` },
    openGraph: {
      title: post.title ?? undefined,
      description: post.excerpt ?? undefined,
      type: "article",
      tags: post.tags?.flatMap((tag) => (tag?.title ? [tag.title] : [])),
      publishedTime: post.publishedAt,
      modifiedTime: post._updatedAt,
    },
  };
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
  return (
    <CachedArticlePage slug={slug} perspective="published" stega={false} />
  );
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

  return (
    <CachedArticlePage slug={slug} perspective={perspective} stega={stega} />
  );
}

async function CachedArticlePage({
  slug,
  perspective,
  stega,
}: { slug: string } & DynamicFetchOptions) {
  const { data } = await cachedSanity({
    query: queryArticleSlugPageData,
    params: { slug },
    perspective,
    stega,
  });
  const post = data as QueryArticleSlugPageDataResult;

  if (!post) {
    notFound();
  }

  return (
    <>
      <BackButton />
      <article className="prose prose-lg prose-indigo lg:max-w-none">
        <div className="px-4 py-4 sm:px-10 sm:py-10">
          <div className="flex flex-wrap space-x-5 xl:space-x-10">
            {post.author?.name ? (
              <span className="flex items-center space-x-2">
                {post.author.image ? (
                  <SanityImage
                    image={post.author.image}
                    alt=""
                    width={24}
                    height={24}
                    className="h-6 w-6 rounded-full"
                  />
                ) : null}
                <span>{post.author.name}</span>
              </span>
            ) : null}
            <span className="flex items-center space-x-2">
              <CalendarIcon className="h-5 w-5 text-zinc-500" />
              <span className="sr-only">Published on</span>{" "}
              <DateComponent dateString={post.publishedAt} />
            </span>
          </div>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            {post.title}
          </h1>
          {post.mainImage && (
            <div className="flex items-center justify-center">
              <SanityImage
                image={post.mainImage}
                width={1024}
                height={768}
                className="rounded-md"
              />
            </div>
          )}
          {post.body ? <CustomPortableText value={post.body} /> : null}
          {post.tags && post.tags.length > 0 && (
            <div className="mt-8 md:mt-14">
              <h2 className="text-xl font-semibold">Tags</h2>
              <ul className="not-prose flex list-none items-center space-x-4 pl-0">
                {post.tags
                  .flatMap((tag) => (tag ? [tag] : []))
                  .map((tag) => (
                    <li key={tag._id}>
                      <Link
                        href={`/tag/${tag.slug}`}
                        prefetch={false}
                        className="rounded bg-zinc-200 px-3 py-1 text-base transition-all duration-150 hover:bg-red-400 hover:text-white"
                      >
                        {tag.title}
                      </Link>
                    </li>
                  ))}
              </ul>
            </div>
          )}
        </div>
      </article>
    </>
  );
}

function ArticleFallback() {
  return (
    <div aria-busy>
      <div className="h-8 w-24 animate-pulse rounded bg-zinc-200" />
      <div className="mt-6 space-y-4">
        <div className="h-10 w-3/4 animate-pulse rounded bg-zinc-200" />
        <div className="aspect-[4/3] animate-pulse rounded-md bg-zinc-200" />
        <div className="h-4 animate-pulse rounded bg-zinc-200" />
        <div className="h-4 animate-pulse rounded bg-zinc-200" />
        <div className="h-4 w-5/6 animate-pulse rounded bg-zinc-200" />
      </div>
    </div>
  );
}
